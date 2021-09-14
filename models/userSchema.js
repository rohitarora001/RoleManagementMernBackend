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
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    productsviewed: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    canEditCategory: {
        type: Boolean,
        default: false
    },
    canDeleteCategory: {
        type: Boolean,
        default: false
    },
    canAddCategory: {
        type: Boolean,
        default: false
    },
    canEditProduct: {
        type: Boolean,
        default: false
    },
    canDeleteProduct: {
        type: Boolean,
        default: false
    },
    canAddProduct: {
        type: Boolean,
        default: false
    },
    canDeleteUser: {
        type: Boolean,
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