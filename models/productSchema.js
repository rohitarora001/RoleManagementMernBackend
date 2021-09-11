const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    pictures: {
        type: [String],
        default: []
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    }
}, { timestamps: true }
)

const Product = mongoose.model("Product", productSchema);
module.exports = Product