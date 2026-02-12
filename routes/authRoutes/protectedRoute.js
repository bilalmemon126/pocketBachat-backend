import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../models/user.model.js'


const router = express.Router()

router.get("/protected", async (req, res, next) => {
    try {
        const token = await req.cookies.token

        if (!token) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            return res.status(401).send({
                status: 0,
                myToken: token,
                message: "unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.MY_SECRET)

        if (!decoded) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            return res.status(400).send({
                status: 0,
                message: "something went wrong"
            })
        }

        let checkUser = await User.findOne({_id: decoded.userId})
        if(!checkUser){
            return res.status(400).send({
                status: 0,
                message: "please login your account"
            })
        }

        if(checkUser.isBlocked){
            return res.status(400).send({
                status: 0,
                message: "your account is blocked"
            })
        }

        return res.status(200).send({
            status: 1,
            message: "verified user"
        })
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})

export default router