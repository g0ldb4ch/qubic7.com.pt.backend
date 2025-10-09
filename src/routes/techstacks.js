const express = require('express');
const router = express.Router();
const {
  getTechStacksBySubdomain,
  createTechStack,
  updateTechStack,
  deleteTechStack
} = require('../controllers/techStackController');

// Routes per tech stack per sottodominio
router.route('/subdomain/:subdomainId')
  .get(getTechStacksBySubdomain)
  .post(createTechStack);

// Routes per singola tecnologia
router.route('/:id')
  .put(updateTechStack)
  .delete(deleteTechStack);

module.exports = router;