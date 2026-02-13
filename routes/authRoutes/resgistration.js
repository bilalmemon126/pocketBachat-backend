import express from 'express'
import bcrypt from 'bcrypt'
import { sendOtp } from '../../config/sendOtp.js'
import jwt from 'jsonwebtoken'
import { User } from '../../models/user.model.js'

const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const token = await req.cookies.token
        if (token) {
            const decoded = jwt.verify(token, process.env.MY_SECRET)
            if (decoded) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
            }
        }
        if(!req.body.fullName || !req.body.email || !req.body.password){
            return res.status(400).send({
                statue: 0,
                message: "all fields are required"
            })
        }
        
        let email = req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email.match(emailFormat)) {
            return res.status(400).send({
                status: 0,
                message: "invalid email format"
            })
        }
        const checkUser = await User.findOne({ email: email })
        if (checkUser) {
            return res.status(409).send({
                status: 0,
                message: "email already exist"
            })
        }

        const hashedPassword = await bcrypt.hashSync(req.body.password, 10)
        let verificationOTP = Math.floor(100000 + Math.random() * 900000)
        const expiryOTP = Date.now() + 2 * 60 * 1000;
        const user = {
            fullName: req.body.fullName,
            email: email,
            password: hashedPassword,
            otp: verificationOTP,
            expiry: expiryOTP,
            isVerified: false
        }

        const insertUser = await User.create(user)
        if (!insertUser) {
            return res.status(400).send({
                status: 0,
                message: "something went wrong"
            })
        }

        const findUser = await User.findOne({ _id: insertUser._id })
        sendOtp(`${email}`, `${verificationOTP}`);
        return res.status(200).send({
            status: 1,
            message: "registered successfully",
            data: findUser
        })
    }
    catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router