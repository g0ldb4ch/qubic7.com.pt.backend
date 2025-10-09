const TechStack = require('../models/TechStack');

// @desc    Ottieni tutte le tecnologie di un sottodominio
// @route   GET /api/subdomains/:subdomainId/techstacks
exports.getTechStacksBySubdomain = async (req, res) => {
  try {
    const techStacks = await TechStack.find({ subdomainId: req.params.subdomainId })
      .sort({ category: 1, technology: 1 });
    
    res.json({
      success: true,
      count: techStacks.length,
      data: techStacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Crea nuova tecnologia
// @route   POST /api/subdomains/:subdomainId/techstacks
exports.createTechStack = async (req, res) => {
  try {
    const techStackData = {
      ...req.body,
      subdomainId: req.params.subdomainId
    };

    const techStack = await TechStack.create(techStackData);
    
    res.status(201).json({
      success: true,
      data: techStack
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Aggiorna tecnologia
// @route   PUT /api/techstacks/:id
exports.updateTechStack = async (req, res) => {
  try {
    const techStack = await TechStack.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!techStack) {
      return res.status(404).json({
        success: false,
        error: 'Tecnologia non trovata'
      });
    }

    res.json({
      success: true,
      data: techStack
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Elimina tecnologia
// @route   DELETE /api/techstacks/:id
exports.deleteTechStack = async (req, res) => {
  try {
    const techStack = await TechStack.findById(req.params.id);

    if (!techStack) {
      return res.status(404).json({
        success: false,
        error: 'Tecnologia non trovata'
      });
    }

    await techStack.deleteOne();

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