const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.js');
const User = require('../models/UserModel.js');
const upload = require('../middlewares/multer.js');
const Blogs = require('../models/BlogModel.js');
const path = require('path')
const fs = require('fs')

router.get("/profile", async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findById(id).select('-password -createdAt -updatedAt')

        const userBlogs = await Blogs.find({ author: id })
        return res.render('profile', {
            user, userBlogs
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/', async (req, res) => {
    try {
        const blogs = await Blogs.find({}).populate('author', 'name')
        console.log(blogs);
        return res.render('index', {
            blogs
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/add-blog', (req, res) => {
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
            ...data, file: doc, author: req.user.id
        }

        const newBlog = new Blogs(blog)
        await newBlog.save()
        return res.redirect('/blog')
    } catch (error) {
        console.log(error);
    }
})

router.get('/delete-blog/:id', async (req, res) => {
    try {
        const { id } = req.params
        const blog = await Blogs.findById(id)
        const imgPath = path.join(__dirname, "..", blog.file)

        fs.unlink(imgPath, (err) => {
            console.log(err);
        })

        await Blogs.findByIdAndDelete(id)
        return res.redirect('/blog')
    } catch (error) {
        console.log(error);
    }
})

router.get('/edit-blog/:id', async (req, res) => {
    try {
        const { id } = req.params
        const editBlog = await Blogs.findById(id)
        return res.render('editBlog', {
            editBlog
        })
    } catch (error) {
        console.log(error);
    }
})

router.post('/edit-blog/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params
        const blog = await Blogs.findById(id)
        const updatedData = req.body

        if (req.file) {
            const oldImgPath = path.join(__dirname, "..", blog.file)
            fs.unlink(oldImgPath, (err) => {
                console.log(err);
            })

            const newImgPath = req.file.path
            updatedData.file = newImgPath
        }

        await Blogs.findByIdAndUpdate(id, updatedData)
        return res.redirect('/blog')
    } catch (error) {
        console.log(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const blog = await Blogs.findById(id)
        return res.render('blogView', {
            blog
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router