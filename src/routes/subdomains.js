const express = require('express');
const router = express.Router();
const {
  getSubdomainsByProject,
  getSubdomain,
  createSubdomain,
  updateSubdomain,
  deleteSubdomain
} = require('../controllers/subdomainController');

// Routes per sottodomini per progetto
router.route('/project/:projectId')
  .get(getSubdomainsByProject)
  .post(createSubdomain);

// Routes per singolo sottodominio
router.route('/:id')
  .get(getSubdomain)
  .put(updateSubdomain)
  .delete(deleteSubdomain);

module.exports = router;