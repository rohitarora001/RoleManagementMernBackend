const express = require('express');
const router = express.Router();
const { adminCreatedUser,
    permissionControl,
    userLogin } = require('../controllers/admin')
const checkOwner = require("../middlewares/checkOwner");

// Create a user with custom role
router.post('/create-user', checkOwner, adminCreatedUser);

// Revoking the permissions
router.patch('/permissions/:id', checkOwner, permissionControl);

// Login any user 
router.post('/user-login/:id', checkOwner, userLogin);

module.exports = router;