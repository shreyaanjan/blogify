const express = require('express')
const router = express.Router()
const upload = require('../middlewares/multer.js');
const { getProfile, dashboard, getAddBlogPage, addBlog, deleteBlog, editBlog, updateBlog, viewBlog } = require('../controllers/blogController.js');

router.get("/profile", getProfile)
router.get('/', dashboard)
router.get('/add-blog', getAddBlogPage)
router.post('/add-blog', upload.single('file'), addBlog)
router.get('/delete-blog/:id', deleteBlog)
router.get('/edit-blog/:id', editBlog)
router.post('/edit-blog/:id', upload.single('file'), updateBlog)
router.get('/:id', viewBlog)

module.exports = router