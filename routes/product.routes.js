const { addProduct,
    deleteProduct,
    getProductByCategory,
    updateProduct,
    getOneProduct,
    getAllproducts } = require("../controllers/product");
const express = require('express');
const router = express.Router();
const checkAdminOrOwner = require("../middlewares/checkAdminOrOwner");
const auth = require("../middlewares/auth");
// const multer = require('multer')
// const path = require('path');
// Config for multer
// const DIR = path.join(__dirname, '../uploads/Products')
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, DIR)
//   },
//   filename: function (req, file, cb) {
//     let date = new Date();
//     let dateTime = date.getTime();
//     cb(null, dateTime + file.originalname)
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
// upload.array('picture')
router.get('/', auth, getAllproducts) // Get all Products 
router.post('/create', auth,checkAdminOrOwner , addProduct) // Add a product
router.delete('/delete/:id', auth, checkAdminOrOwner, deleteProduct) // Delete a product
router.get('/:id', auth,  getOneProduct) // Product by id
router.get('/getproductbycategory/:id', auth, getProductByCategory) // Product by category
router.post('/update/:id', auth, checkAdminOrOwner, updateProduct) // Update product

module.exports = router;

