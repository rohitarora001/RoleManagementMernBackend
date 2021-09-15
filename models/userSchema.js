const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    avatar: {
        type: [String],
        default: []
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    productsviewed: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    canEditCategory: {
        type: String,
        default: false
    },
    canDeleteCategory: {
        type: String,
        default: false
    },
    canAddCategory: {
        type: String,
        default: false
    },
    canEditProduct: {
        type: String,
        default: false
    },
    canDeleteProduct: {
        type: String,
        default: false
    },
    canAddProduct: {
        type: String,
        default: false
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Category'
    }
},
    { timestamps: true }
)

const User = mongoose.model("User", userSchema);

module.exports = User;