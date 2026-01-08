const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token

        const decoded = jwt.verify(token, process.env.PVT_KEY)
        req.user = {
            id: decoded.id,
            email: decoded.email
        }
        next()
    } catch (error) {
        console.log(error);
        res.redirect('/auth/login')
    }
}

module.exports = authMiddleware