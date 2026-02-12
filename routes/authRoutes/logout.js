import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post("/logout", async (req, res) => {
    try {
        const token = await req.cookies.token
        if (!token) {
            return res.status(401).send({
                status: 0,
                message: 'Unauthorized'
            })
        }
        else {
            const decoded = jwt.verify(token, process.env.MY_SECRET)
            if (decoded) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
                return res.status(200).send({
                    status: 1,
                    message: "logout successfully"
                })
            }
        }
    }
    catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router