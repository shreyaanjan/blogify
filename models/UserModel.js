const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    forgotPasswordOTP: {
        type: String,
    },
    forgotPasswordOTPExpiry: {
        type: Date
    }
}, {
    timestamps: true,
})

const User = new mongoose.model('User', userSchema)
module.exports = User