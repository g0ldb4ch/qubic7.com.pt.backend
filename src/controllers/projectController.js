const Project = require('../models/Project');
const Subdomain = require('../models/Subdomain');
const TechStack = require('../models/TechStack');
const Vulnerability = require('../models/Vulnerability');

// @desc    Ottieni tutti i progetti
// @route   GET /api/projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Ottieni singolo progetto
// @route   GET /api/projects/:id
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Progetto non trovato'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Crea nuovo progetto
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Aggiorna progetto
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Progetto non trovato'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Elimina progetto
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Progetto non trovato'
      });
    }

    // Elimina anche tutti i sottodomini e le relative entità
    const subdomains = await Subdomain.find({ projectId: req.params.id });
    const subdomainIds = subdomains.map(s => s._id);

    await TechStack.deleteMany({ subdomainId: { $in: subdomainIds } });
    await Vulnerability.deleteMany({ subdomainId: { $in: subdomainIds } });
    await Subdomain.deleteMany({ projectId: req.params.id });
    await project.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Esporta progetto completo per n8n
// @route   GET /api/projects/:id/export
exports.exportProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Progetto non trovato'
      });
    }

    // Ottieni tutti i sottodomini
    const subdomains = await Subdomain.find({ projectId: req.params.id });

    // Per ogni sottodominio, ottieni tech stack e vulnerabilità
    const subdomainsData = await Promise.all(
      subdomains.map(async (subdomain) => {
        const techStack = await TechStack.find({ subdomainId: subdomain._id });
        const vulnerabilities = await Vulnerability.find({ subdomainId: subdomain._id });

        return {
          subdomain: subdomain.subdomain,
          ipAddress: subdomain.ipAddress,
          status: subdomain.status,
          discoveryDate: subdomain.discoveryDate,
          notes: subdomain.notes,
          techStack: techStack.map(tech => ({
            technology: tech.technology,
            version: tech.version,
            category: tech.category,
            notes: tech.notes
          })),
          vulnerabilities: vulnerabilities.map(vuln => ({
            title: vuln.title,
            description: vuln.description,
            severity: vuln.severity,
            cvss: vuln.cvss,
            cve: vuln.cve,
            status: vuln.status,
            proof: vuln.proof,
            remediation: vuln.remediation,
            discoveryDate: vuln.discoveryDate,
            affectedUrl: vuln.affectedUrl,
            impact: vuln.impact
          }))
        };
      })
    );

    const exportData = {
      project: {
        name: project.name,
        domain: project.domain,
        client: project.client,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        description: project.description
      },
      subdomains: subdomainsData,
      statistics: {
        totalSubdomains: subdomains.length,
        totalVulnerabilities: subdomainsData.reduce((acc, s) => acc + s.vulnerabilities.length, 0),
        vulnerabilitiesBySeverity: {
          critical: subdomainsData.reduce((acc, s) => 
            acc + s.vulnerabilities.filter(v => v.severity === 'critical').length, 0),
          high: subdomainsData.reduce((acc, s) => 
            acc + s.vulnerabilities.filter(v => v.severity === 'high').length, 0),
          medium: subdomainsData.reduce((acc, s) => 
            acc + s.vulnerabilities.filter(v => v.severity === 'medium').length, 0),
          low: subdomainsData.reduce((acc, s) => 
            acc + s.vulnerabilities.filter(v => v.severity === 'low').length, 0),
          info: subdomainsData.reduce((acc, s) => 
            acc + s.vulnerabilities.filter(v => v.severity === 'info').length, 0)
        }
      },
      exportDate: new Date()
    };

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};