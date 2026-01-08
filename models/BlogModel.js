const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        required: true
    }
},{
    timestamps: true,
})

const Blogs = new mongoose.model('Blogs', blogSchema)
module.exports = Blogs