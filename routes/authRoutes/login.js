import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../../models/user.model.js'

const router = express.Router()

router.post("/login", async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        if (!req.body.email || !req.body.password) {
            return res.status(400).send({
                status: 0,
                message: "Both Fields are Required"
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

        let checkUser = await User.findOne({ email }).select("+password")
        if (!checkUser) {
            return res.status(400).send({
                status: 0,
                message: "Email or Password is Invalid"
            })
        }

        let hashedPassword = bcrypt.compareSync(req.body.password, checkUser.password);
        if (!hashedPassword) {
            return res.status(400).send({
                status: 0,
                message: "Email or Password is Invalid"
            })
        }

        if (!checkUser.isVerified) {
            return res.status(400).send({
                status: 0,
                message: "User Not Verified"
            })
        }

        if(checkUser.isBlocked){
            return res.status(400).send({
                status: 0,
                message: "your account is blocked"
            })
        }

        const oldToken = await req.cookies.token
        if (oldToken) {
            const decoded = jwt.verify(oldToken, process.env.MY_SECRET)
            if (decoded) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
            }
        }

        const token = jwt.sign({
            firstName: checkUser.firstName,
            userId: checkUser._id,
            email: checkUser.email
        }, process.env.MY_SECRET, { expiresIn: "1h" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        const sendUserData = await User.findOne({ _id: checkUser._id })
        return res.status(200).send({
            status: 1,
            message: "Login Successfully",
            data: sendUserData
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