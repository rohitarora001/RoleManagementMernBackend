const express = require('express');
const router = express.Router();
const { adminCreatedUser } = require('../controllers/admin')
const  checkOwner = require("../middlewares/checkOwner");

// Create a user with custom role
router.post('/create-user', checkOwner, adminCreatedUser);

module.exports = router;