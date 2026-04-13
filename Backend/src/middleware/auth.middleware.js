import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' })
        }

        const decoded = jwt.verify(token, config.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        return res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }
}
