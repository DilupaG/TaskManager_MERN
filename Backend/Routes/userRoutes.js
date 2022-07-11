const express = require('express')
const router = express.Router();
const authenticateUser = require('../Middleware/auth')

const {register,login,updateUser,sendOTP,resetPassword} =  require('../Controllers/userController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateUser').patch(authenticateUser,updateUser);
router.route('/sendOTP').post(sendOTP);
router.route('/resetPassword').patch(resetPassword);


module.exports = router