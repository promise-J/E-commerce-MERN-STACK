const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: {
        type: Object,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    checked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Product = mongoose.model('Product', productSchema)
module.exports = Product