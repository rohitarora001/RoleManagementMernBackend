const express = require('express');
const router = express.Router();
const { userSignIn, userSignup } = require('../controllers/auth')
const multer = require('multer')
const path = require('path');

// Config for multer
const DIR = path.join(__dirname, '../uploads/Users')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR)
  },
  filename: function (req, file, cb) {
    let d = new Date();
    let n = d.getTime();
    cb(null, n + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
})


// User Signin
router.post('/signin-user', userSignIn);

// Signup User
router.post('/register-user', upload.single('avatar'), userSignup)

module.exports = router;