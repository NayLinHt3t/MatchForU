const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const activityController = require('../controllers/activity');

router.post('/', authController.protected, activityController.createActivity);
router.get('/', authController.protected, activityController.getActivity);

module.exports = router;
