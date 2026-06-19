const express = require('express');
const { registerUser, loginUser, logoutUser, forgetPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgetPassword);
router.route('/password/reset/:token').post(resetPassword);

module.exports = router;