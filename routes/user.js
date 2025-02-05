const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
router.post('/sign-up', authController.signup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.post('/resetPassword/:token', authController.resetPassword);
module.exports = router;
