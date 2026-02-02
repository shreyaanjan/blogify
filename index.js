const dontenv = require('dotenv')
dontenv.config()

const express = require('express')
const connectDb = require('./config/db.js')
const authRouter = require('./routes/authRouter.js')
const viewAuthRouter = require('./routes/viewAuthRouter.js')
const cookieParser = require('cookie-parser')
const blogRouter = require('./routes/blogRouter.js')
const clientRouter = require('./routes/clientRouter.js')
const authMiddleware = require('./middlewares/auth.js')

const app = express()
const PORT = process.env.PORT

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))
app.use(express.static('public'))

connectDb()

// Rest
app.use('/api/auth', authRouter)
// EJS
app.use('/auth', viewAuthRouter)
app.use('/blog', authMiddleware, blogRouter)
app.use('/', authMiddleware, clientRouter)

app.listen(PORT, (err) => {
    console.log(`Server is running at http://localhost:${PORT}`);
    if(err) console.log("Server is down.");
})