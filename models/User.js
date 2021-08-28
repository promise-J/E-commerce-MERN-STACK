const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    cart: {
        type: Array,
        default: []
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {type: String},
    profilePicture: {type: String},
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {timestamp: true})



const User = mongoose.model('User', userSchema)
module.exports = User