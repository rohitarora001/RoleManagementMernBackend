const express = require('express');
const auth = require("../middlewares/auth");
const checkAdminOrOwner = require("../middlewares/checkAdminOrOwner");

const router = express.Router();
const { addCategory ,
     getAllCategories,
     getOneCategory,
     updateCategory,
     deleteCategory } = require('../controllers/category')

// Add a category
router.post('/create',auth,checkAdminOrOwner, addCategory)
// Get all category
router.get('/', auth, getAllCategories)
// Update category
router.patch('/update-category/:id', auth ,checkAdminOrOwner, updateCategory)
// Get one category by id 
router.get('/:id', auth , getOneCategory)
// Delete category
router.delete('/delete-category/:id', auth,checkAdminOrOwner, deleteCategory);

module.exports = router;