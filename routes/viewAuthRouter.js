const express = require('express');
const User = require('../models/UserModel.js');
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/signup', (req, res) => {
    try {
        return res.render('signup')
    } catch (error) {
        console.log(error);
    }
})

router.get('/login', (req, res) => {
    try {
        return res.render('login')
    } catch (error) {
        console.log(error);
    }
})

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie("token")
        return res.redirect('/auth/login')
    } catch (error) {
        console.log(error);
    }
})

router.post('/signup', async (req, res) => {
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
})

router.post('/login', async (req, res) => {
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
})

module.exports = router