const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const profileController = require('../controllers/profile');

router
  .route('/profile/:id')
  .get(authController.protected, profileController.getProfile)
  .patch(authController.protected, profileController.updateProfile)
  .delete(authController.protected, profileController.deleteProfile);
router.post(
  '/profile',
  authController.protected,
  profileController.createProfile
);

router.post('/sign-up', authController.signup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.post('/resetPassword/:token', authController.resetPassword);
module.exports = router;
