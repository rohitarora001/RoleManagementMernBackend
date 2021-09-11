const express = require('express');
const router = express.Router();
const { userSignIn, userSignup } = require('../controllers/auth')

// User Signin
router.post('/signin-user', userSignIn);

// Signup User
router.post('/register-user',  userSignup)

module.exports = router;