const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  exportProject
} = require('../controllers/projectController');

// Routes per progetti
router.route('/')
  .get(getAllProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.route('/:id/export')
  .get(exportProject);

module.exports = router;