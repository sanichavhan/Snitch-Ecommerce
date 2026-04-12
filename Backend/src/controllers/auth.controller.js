import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

async function sendTokenResponse(user, res, message) {
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
}

export const registerUser = async (req,res) =>{
    try{
        const {email, contact, password, fullname, role} = req.body

        const existingUser = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })
        if(existingUser){
            return res.status(400).json({message: "User with this email or contact already exists."})
        }

        const user = await new userModel({
            email,
            contact,    
            password,
            fullname,
            role : isSeller ? 'seller' : 'buyer'
        })
        await sendTokenResponse(user, res, "User registered successfully")
    } catch (error) {
        console.error("Error registering user:", error)
        return res.status(500).json({message: "Internal server error"})
    }
}