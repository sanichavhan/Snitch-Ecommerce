import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

async function sendTokenResponse(user, res, message) {
    try {
        const token = jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRE
        })

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
            secure: config.NODE_ENV === 'production'
        });

        res.status(200).json({
            success: true,
            message,
            user:{
                id: user._id,
                email: user.email,
                contact: user.contact,
                fullname: user.fullname,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Error in sendTokenResponse:", error)
        res.status(500).json({message: "Error generating token"})
    }
}

export const register = async (req,res) =>{
    try{
        const {email, contact, password, fullname, isSeller} = req.body

        const existingUser = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })
        if(existingUser){
            return res.status(400).json({message: "User with this email or contact already exists."})
        }

        const user = new userModel({
            email,
            contact,    
            password,
            fullname,
            role : isSeller ? 'seller' : 'buyer'
        })
        await user.save()
        await sendTokenResponse(user, res, "User registered successfully")
    } 
    catch (error) {
        console.error("Error registering user:", error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export const login = async (req,res) => {
    const {email, password} = req.body
    try {
        const user = await userModel.findOne({email})   
        if(!user){
            return res.status(400).json({message: "Invalid email or password"})
        }
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"})
        }
        await sendTokenResponse(user, res, "User logged in successfully")
    }
    catch (error) {
        console.error("Error logging in user:", error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export const googleCallback = async (req,res) =>{
    try {
        const {id, displayName, emails, photos} = req.user
        const email = emails?.[0]?.value
        
        if (!email) {
            return res.redirect(`http://localhost:5173/login?error=No email provided by Google`)
        }

        let user = await userModel.findOne({email})
        
        if (!user) {
            user = new userModel({
                email,
                fullname: displayName || 'Google User',
                avatar: photos?.[0]?.value,
                googleId: id,
                role: 'buyer'
            })
            await user.save()
        }

        const token = jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRE
        })

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
            secure: config.NODE_ENV === 'production'
        })
        
        // Redirect to home page - token is in secure cookie
        res.redirect('http://localhost:5173/')
    } catch (error) {
        console.error("Error in googleCallback:", error)
        res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(error.message)}`)
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password')
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                contact: user.contact,
                fullname: user.fullname,
                role: user.role,
                avatar: user.avatar
            }
        })
    } catch (error) {
        console.error("Error in getCurrentUser:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}