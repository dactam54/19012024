const jsonwebtoken = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization?.split(' ')[1]
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    err: 1,
                    mes: 'Invalid access token'
                })
            }
            req.user = decode
            next()
        })
    } else {
        return res.status(401).json({
            err: 1,
            mes: 'Require authentication!'
        })
    }
}
const isAdmin = (req, res, next) => {
    const { role } = req.user
    if (role !== 'admin')
        throw new Error('Require Admin Role')
    next()
}
module.exports = {
    verifyToken,
    isAdmin,
}