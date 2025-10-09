const express = require('express');
const router = express.Router();
const {
  getVulnerabilitiesBySubdomain,
  getVulnerability,
  createVulnerability,
  updateVulnerability,
  deleteVulnerability,
  getVulnerabilityStats
} = require('../controllers/vulnerabilityController');

// Routes per vulnerabilità per sottodominio
router.route('/subdomain/:subdomainId')
  .get(getVulnerabilitiesBySubdomain)
  .post(createVulnerability);

// Route per statistiche vulnerabilità per progetto
router.route('/project/:projectId/stats')
  .get(getVulnerabilityStats);

// Routes per singola vulnerabilità
router.route('/:id')
  .get(getVulnerability)
  .put(updateVulnerability)
  .delete(deleteVulnerability);

module.exports = router;