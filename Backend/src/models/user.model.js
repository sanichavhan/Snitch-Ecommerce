import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact : { type: String, default: null },
    password: { type: String, default: null },
    fullname: { type: String, required: true },
    avatar: { type: String, default: null },
    googleId: { type: String, default: null },
    role:{
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer'
    },
    createdAt: { type: Date, default: Date.now }
})

userSchema.pre('save',async function() {
    if(!this.isModified('password') || !this.password) return;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
}

const userModel = mongoose.model('user', userSchema )

export default userModel