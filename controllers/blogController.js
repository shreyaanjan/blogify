const User = require('../models/UserModel.js');
const Blogs = require('../models/BlogModel.js');
const path = require('path')
const fs = require('fs');
const authMiddleware = require('../middlewares/auth.js');

const getProfile = async (req, res) => {
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
}

const dashboard = async (req, res) => {
    try {
        const { id } = req.user

        const user = await User.findById(id).select('-password -createdAt -updatedAt')
        const blogs = await Blogs.find({}).populate('author', 'name')

        return res.render('index', {
            blogs, user
        })
    } catch (error) {
        console.log(error);
    }
}

const getAddBlogPage = async (req, res) => {
    try {
        const { id } = req.user

        const user = await User.findById(id).select('-password -createdAt -updatedAt')
        return res.render('addBlog', { user })
    } catch (error) {
        console.log(error);
    }
}

const addBlog = async (req, res) => {
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
}

const deleteBlog = async (req, res) => {
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
}

const editBlog = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const user = await User.findById(userId).select('-password -createdAt -updatedAt')
        const editBlog = await Blogs.findById(id)

        return res.render('editBlog', {
            editBlog, user
        })
    } catch (error) {
        console.log(error);
    }
}

const updateBlog = async (req, res) => {
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
}

const viewBlog = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const user = await User.findById(userId).select('-password -createdAt -updatedAt')
        const blog = await Blogs.findById(id).populate('author', 'name')
        return res.render('blogView', {
            blog,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getProfile, dashboard, getAddBlogPage, addBlog, deleteBlog, editBlog, updateBlog, viewBlog
}