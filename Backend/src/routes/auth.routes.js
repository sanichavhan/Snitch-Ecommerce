import {Router} from 'express'
import {validateRegisterUser,validateLoginUser} from '../validator/auth.validator.js'
import { googleCallback, register, login, getCurrentUser } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import passport from 'passport'
import { config } from '../config/config.js'
const router = Router()

router.post('/register', validateRegisterUser, register)
router.post('/login', validateLoginUser, login)
router.get('/me', authMiddleware, getCurrentUser)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback',passport.authenticate('google',{
        session : false
    }),
    googleCallback
)
export default router