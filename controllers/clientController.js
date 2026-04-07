const Blogs = require('../models/BlogModel.js')

const getClientPage = async (req, res) => {
    try {
        const blogs = await Blogs.find()
        const user = req.user || null; // Get user from session/token if logged in
        res.render('home', { blogs, user })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getClientPage
}