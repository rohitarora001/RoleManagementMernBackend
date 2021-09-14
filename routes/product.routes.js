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

router.get('/', auth, getAllproducts) // Get all Products 
router.post('/create', auth,checkAdminOrOwner , addProduct) // Add a product
router.delete('/delete/:id', auth, checkAdminOrOwner, deleteProduct) // Delete a product
router.get('/:id', auth,  getOneProduct) // Product by id
router.get('/getproductbycategory/:id', auth, getProductByCategory) // Product by category
router.post('/update/:id', auth, checkAdminOrOwner, updateProduct) // Update product

module.exports = router;

