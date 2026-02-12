import express from "express";
import { upload } from "../../config/multer.js";
import cloudinary from "../../config/cloudinary.js";
import { BillSummary } from "../../models/billSummary.model.js";
import fs from "fs";

const router = express.Router();

router.post(
  "/billsummary",
  upload.fields([{ name: "billImage", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { summary, billMonth } = req.body;

      if (!summary || !billMonth) {
        return res.status(400).json({
          status: 0,
          message: "Summary and bill month are required",
        });
      }

      const billTypeMatch = summary.match(
        /(Electricity Bill|Gas Bill|Water Bill)/i
      );
      const unitsMatch = summary.match(/1\.\s*Units consumed[:\-]?\s*(.*)/i);
      const baseCostMatch = summary.match(/2\.\s*Base cost[:\-]?\s*(.*)/i);
      const taxesMatch = summary.match(/3\.\s*Taxes[:\-]?\s*(.*)/i);
      const totalMatch = summary.match(/4\.\s*Total amount[:\-]?\s*(.*)/i);

      const billType = billTypeMatch ? billTypeMatch[0] : "";
      const units = unitsMatch ? unitsMatch[1].trim() : "";
      const baseCost = baseCostMatch ? baseCostMatch[1].trim() : "";
      const taxes = taxesMatch ? taxesMatch[1].trim() : "";
      const totalAmount = totalMatch ? totalMatch[1].trim() : "";

      if (!billType || !totalAmount) {
        return res.status(400).json({
          status: 0,
          message: "Invalid AI response format",
        });
      }

      let billImage = null;

      if (req.files && req.files.billImage) {
        const uploadResult = await cloudinary.uploader.upload(
          req.files.billImage[0].path,
          { folder: "bills" }
        );

        billImage = {
          public_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
        };

        fs.unlinkSync(req.files.billImage[0].path);
      }

      const newBill = await BillSummary.create({
        billImage,
        summary,
        billType,
        units,
        baseCost,
        taxes,
        totalAmount,
        billMonth: parseInt(billMonth),
      });

      return res.status(200).json({
        status: 1,
        message: "Bill saved successfully",
        insertedId: newBill._id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 0,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);

export default router;
