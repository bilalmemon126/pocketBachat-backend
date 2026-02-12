import express from 'express'
import { ObjectId } from 'mongodb'
import { BillSummary } from '../../models/billSummary.model.js'
const router = express.Router()


router.get('/selectedbillsummary/:id', async (req, res) => {
    try {
        let summaryId = new ObjectId(req.params.id)
        
        let findSummary = await BillSummary.findOne({_id: summaryId})

        if (!findSummary) {
            return res.send({
                status: 0,
                message: "summary not found",
                data: []
            })
        }

        return res.send({
            status: 1,
            message: "summary fetched successfully",
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