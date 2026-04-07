const User = require("../models/UserModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail.js');

const getSignUpPage = (req, res) => {
    try {
        return res.render('signup')
    } catch (error) {
        console.log(error);
    }
}

const getLoginPage = (req, res) => {
    try {
        return res.render('login')
    } catch (error) {
        console.log(error);
    }
}

const getForgotPassPage = (req, res) => {
    try {
        return res.render('forgotPassword')
    } catch (error) {
        console.log(error);
    }
}

const getResetPassPage = (req, res) => {
    try {
        return res.render('resetPassword')
    } catch (error) {
        console.log(error)
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.redirect('/auth/login')
    } catch (error) {
        console.log(error);
    }
}

const signUpUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const hashedPass = await bcrypt.hash(password, 10)

        const newUser = {
            name, email, password: hashedPass
        }

        await User.create(newUser)
        return res.redirect('/auth/login')
    } catch (error) {
        console.log(error);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.redirect('/auth/login')
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.redirect('/auth/login')
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.PVT_KEY, {
            expiresIn: '2h'
        })

        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        })

        return res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}

const forgotPass = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.redirect('/auth/forgot-password')
        }

        const OTP = parseInt(100000 + Math.random() * 900000).toString()
        const hashedOTP = await bcrypt.hash(OTP, 10)

        user.forgotPasswordOTP = hashedOTP
        user.forgotPasswordOTPExpiry = Date.now() + 10 * 60 * 1000
        await user.save()

        await sendMail(email, "OTP To Reset Password For Blog App", `Your OTP To Reset Password is ${OTP}. This OTP is valid for 10 Minutes.`)

        return res.redirect('/auth/reset-password')
    } catch (error) {
        console.log(error);
    }
}

const resetPass = async (req, res) => {
    try {
        const { email, otp, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.redirect('/auth/reset-password')
        }

        if (!user.forgotPasswordOTP || !user.forgotPasswordOTPExpiry || user.forgotPasswordOTPExpiry < Date.now()) {
            return res.redirect('/auth/forgot-password')
        }

        const isValidOTP = await bcrypt.compare(otp, user.forgotPasswordOTP)
        if (!isValidOTP) {
            return res.redirect('/auth/reset-password')
        }

        const newHashedPass = await bcrypt.hash(password, 10)
        user.password = newHashedPass
        user.forgotPasswordOTP = null
        user.forgotPasswordOTPExpiry = null

        await user.save()
        return res.redirect('/auth/login')
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getSignUpPage, getLoginPage, getForgotPassPage, getResetPassPage, logout, signUpUser, loginUser, forgotPass, resetPass
}