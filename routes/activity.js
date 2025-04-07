const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const activityController = require('../controllers/activity');

router.post('/', authController.protected, activityController.createActivity);
router.get('/', authController.protected, activityController.getActivity);
router.get(
  '/:activityId',
  authController.protected,
  activityController.getActivity
);
router.post(
  '/join/:activityId',
  authController.protected,
  activityController.joinActivity
);
module.exports = router;
