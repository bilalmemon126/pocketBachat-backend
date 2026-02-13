import express from 'express'
import { BillSummary } from '../../models/billSummary.model.js'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
const router = express.Router()


router.get('/billsummary/:userId', async (req, res) => {
    try {

        const userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({ _id: userId })

        if (!checkUser) {
            return res.status(400).send({
                status: 0,
                message: "something went wrong"
            })
        }
        let filter = {createdBy: userId}

        if (req.query.billType) {
            filter.billType = "Electricity Bill"
        }

        let findSummary = await BillSummary.find(filter)
            .sort({ billMonth: 1 })

        if (findSummary.length === 0) {
            return res.send({
                status: 0,
                message: "summary not found",
                data: []
            })
        }

        return res.send({
            status: 1,
            message: "all summary fetched successfully",
            data: findSummary
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