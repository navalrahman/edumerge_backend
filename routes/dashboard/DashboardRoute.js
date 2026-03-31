const express = require('express');
const router = express.Router();
const dashboardController = require('../../controller/DashboardController/DashboardController');
const requireAuth = require('../../middleware/auth');

router.use(requireAuth);

router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
