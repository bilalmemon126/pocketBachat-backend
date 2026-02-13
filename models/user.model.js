import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    email: {
        type: String,
        required: false,
        trim: true,
        default: null,
        lowercase: true
    },
    password: {
        type: String,
        required: false,
        default: null,
        trim: true,
        select: false
    },
    otp: {
        type: Number,
        required: false,
        trim: true,
        default: null
    },
    expiry: {
        type: Number,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

export const User = mongoose.model('User', userSchema)