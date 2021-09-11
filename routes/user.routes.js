const  auth = require("../middlewares/auth");
const  checkUserOrOwner = require("../middlewares/checkUserOrOwner");
const express = require('express');
const router = express.Router();
const { myProfile,
  getAllUsers,
  getViewedProducts,
  getAdminCategory,
  getProductByCategory,
  getOneUser,
  updateUser,
  deleteUser,
  changePassword,
  updateUserProfilePic } = require('../controllers/user')
const multer = require('multer')
const path = require('path');

// Config for multer
// const DIR = path.join(__dirname, '../uploads/Users')
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, DIR)
//   },
//   filename: function (req, file, cb) {
//     let d = new Date();
//     let n = d.getTime();
//     cb(null, n + file.originalname)
//   }
// })

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//     }
//   }
// })
// upload.single('avatar')

router.get("/me", auth, myProfile) // My Profile
// router.get("/uploads/:filename",auth,updateUserProfilePic)//Get profile photo
router.get('/all-user', auth, getAllUsers) // Get All Users
router.get('/:id', auth, getOneUser); // Get A Single User
router.get('/:id/viewedproducts', auth, getViewedProducts); // Get Products Viewed By User
router.get('/:id/myproducts', auth, getProductByCategory); // Get Products Made
router.get('/:id/mycategory', auth, getAdminCategory); // Get Category made
router.post('/change-password/:id', auth, changePassword) // Password change
router.patch('/update-user/:id', auth, updateUser) // Update a user
router.put('/update-user-picture/:id', auth,  updateUserProfilePic) // Update profile Picture
router.delete('/delete/:id', auth, deleteUser); // Delete A User

module.exports = router;