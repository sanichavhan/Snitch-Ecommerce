import mongoose from "mongoose";
import { config } from "./config.js"
const connectDB = async () => {
    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("Connected to MongoDB successfully")
    }catch(err){
        console.error("Error connecting to MongoDB:", err)
    }
}

export default connectDB