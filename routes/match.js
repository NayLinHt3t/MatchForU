const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const matchController = require('../controllers/match');
router.route('/match').get(authController.protected, matchController.getMatch);
router.route('/like').post(authController.protected, matchController.likeUser);
router
  .route('/reject')
  .post(authController.protected, matchController.rejectUser);

module.exports = router;
