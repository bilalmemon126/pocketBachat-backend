import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    lastName: {
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
    phone: {
        type: Number,
        required: false,
        trim: true,
        default: null
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
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

export const User = mongoose.model('User', userSchema)