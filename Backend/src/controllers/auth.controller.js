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

        res.cookie('token', token);

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
        const user = req.user;
        
        if(!user) {
            return res.redirect("http://localhost:5173/login");
        }
        
        const token = jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRE
        });
        
        res.cookie('token', token);
        
        // Redirect to frontend with success or send JSON
        res.redirect(`http://localhost:5173/?success=true`);
    } catch (error) {
        console.error("Error in googleCallback:", error);
        res.redirect("http://localhost:5173/login?error=auth_failed");
    }
}