const express = require('express')
const User = require('../models/UserModel.js')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const hashedPass = await bcrypt.hash(password, 10)

        const newUser = {
            name, email, password: hashedPass
        }

        await User.create(newUser)
        return res.json({
            message: "Sign up done",
            status: true,
        })
    } catch (error) {
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "user not found. try again.",
                status: false,
            })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(400).json({
                message: "invalid password",
                status: false,
            })
        }

        return res.status(200).json({
            message: "user logged in",
            status: true,
            token
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router