import express from 'express'
import addBillSummary from './addBillSummary.js'
import getBillSummary from './getBillSummary.js'
import getSelectedBillSummary from './getSelectedBillSummary.js'

const router = express.Router()

router.use(addBillSummary)
router.use(getBillSummary)
router.use(getSelectedBillSummary)

export default router