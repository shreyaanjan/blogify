const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.js');
const User = require('../models/UserModel.js');
const upload = require('../middlewares/multer.js');
const Blogs = require('../models/BlogModel.js');

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findById(id).select('-password -createdAt -updatedAt')

        return res.render('profile', {
            user
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/', async (req, res) => {
    try {
        const blogs = await Blogs.find({})
        return res.render('index', {
            blogs
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/add-blog', authMiddleware, (req, res) => {
    try {
        return res.render('addBlog')
    } catch (error) {
        console.log(error);
    }
})

router.post('/add-blog', upload.single('file'), async (req, res) => {
    try {
        const data = req.body
        const doc = req.file.path

        const blog = {
            ...data, file: doc
        }

        const newBlog = new Blogs(blog)
        await newBlog.save()
        return res.redirect('/blog')
    } catch (error) {
        console.log(error);
    }
})


module.exports = router