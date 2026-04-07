const express = require('express');
const router = express.Router()
const { getSignUpPage, getLoginPage, getForgotPassPage, getResetPassPage, logout, signUpUser, loginUser, forgotPass, resetPass } = require('../controllers/authController.js');

router.get('/signup', getSignUpPage )
router.get('/login', getLoginPage)
router.get('/forgot-password', getForgotPassPage)
router.get('/reset-password', getResetPassPage)
router.post('/logout', logout)
router.post('/signup', signUpUser)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPass)
router.post('/reset-password', resetPass)

module.exports = router