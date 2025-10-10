const Subdomain = require('../models/Subdomain');
const TechStack = require('../models/TechStack');
const Vulnerability = require('../models/Vulnerability');

// @desc    Ottieni tutti i sottodomini di un progetto
// @route   GET /api/projects/:projectId/subdomains
exports.getSubdomainsByProject = async (req, res) => {
  try {
    const subdomains = await Subdomain.find({ projectId: req.params.projectId })
      .sort({ subdomain: 1 });

    const subdomainsWithDetails = await Promise.all(
      subdomains.map(async (sub) => {
        const techStack = await TechStack.find({ subdomainId: sub._id });
        const vulnerabilities = await Vulnerability.find({ subdomainId: sub._id });

        return {
          ...sub.toObject(),
          techStack,
          vulnerabilities
        };
      })
    );

    res.json({
      success: true,
      count: subdomainsWithDetails.length,
      data: subdomainsWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Ottieni singolo sottodominio con dettagli completi
// @route   GET /api/subdomains/:id
exports.getSubdomain = async (req, res) => {
  try {
    const subdomain = await Subdomain.findById(req.params.id)
      .populate('projectId', 'name domain client');
    
    if (!subdomain) {
      return res.status(404).json({
        success: false,
        error: 'Sottodominio non trovato'
      });
    }

    // Ottieni anche tech stack e vulnerabilità
    const techStack = await TechStack.find({ subdomainId: subdomain._id });
    const vulnerabilities = await Vulnerability.find({ subdomainId: subdomain._id });

    res.json({
      success: true,
      data: {
        ...subdomain.toObject(),
        techStack,
        vulnerabilities,
        stats: {
          totalTechnologies: techStack.length,
          totalVulnerabilities: vulnerabilities.length,
          criticalVulnerabilities: vulnerabilities.filter(v => v.severity === 'critical').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Crea nuovo sottodominio
// @route   POST /api/projects/:projectId/subdomains
exports.createSubdomain = async (req, res) => {
  try {
    const subdomainData = {
      ...req.body,
      projectId: req.params.projectId
    };

    const subdomain = await Subdomain.create(subdomainData);
    
    res.status(201).json({
      success: true,
      data: subdomain
    });
  } catch (error) {
    // Gestisci errore duplicato
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Questo sottodominio esiste già per questo progetto'
      });
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Aggiorna sottodominio
// @route   PUT /api/subdomains/:id
exports.updateSubdomain = async (req, res) => {
  try {
    const subdomain = await Subdomain.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!subdomain) {
      return res.status(404).json({
        success: false,
        error: 'Sottodominio non trovato'
      });
    }

    res.json({
      success: true,
      data: subdomain
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Elimina sottodominio
// @route   DELETE /api/subdomains/:id
exports.deleteSubdomain = async (req, res) => {
  try {
    const subdomain = await Subdomain.findById(req.params.id);

    if (!subdomain) {
      return res.status(404).json({
        success: false,
        error: 'Sottodominio non trovato'
      });
    }

    // Elimina anche tech stack e vulnerabilità associate
    await TechStack.deleteMany({ subdomainId: req.params.id });
    await Vulnerability.deleteMany({ subdomainId: req.params.id });
    await subdomain.deleteOne();

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