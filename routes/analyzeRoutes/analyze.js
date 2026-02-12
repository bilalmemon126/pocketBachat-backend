import express from "express";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { upload } from "../../config/multer.js";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post(
  "/analyze",
  upload.fields([{ name: "billImage", maxCount: 1 }]),
  async (req, res) => {
    try {
      const {
        type,
        units,
        trafic,
        extraCharges,
      } = req.body;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      let prompt = "";
      let result;

      if (type === "typemanually") {
        if (!units || !trafic || !extraCharges) {
          return res.status(400).send({
            status: 0,
            message: "All manual fields are required",
          });
        }

        prompt = `Analyze the following manually entered Electricity Bill details:

        Units Consumed: ${units}
        Tariff Rate: ${trafic}
        Extra Charges: ${extraCharges}

        Instructions:

        This is a manually entered Electricity Bill.

        Calculate:

        - Base cost = Units Consumed × Tariff Rate
        - Taxes = Extra Charges
        - Total amount = Base cost + Taxes

        Provide a short savings suggestion (maximum 4-5 lines).
        The FIRST line must clearly mention:

        Electricity Bill

        At the end of the response, display the following details in an ordered list format:

        1. Units consumed
        2. Base cost
        3. Taxes
        4. Total amount

        Important Rules:

        - Suggestion must be concise and practical.
        - The last four lines MUST strictly follow the ordered list format above.
        - Do not add any extra explanation.
        `;

        result = await model.generateContent(prompt);
      }

      else {
        if (!req.files || !req.files.billImage) {
          return res.status(400).json({
            status: 0,
            message: "Bill image is required",
          });
        }

        const file = req.files.billImage[0];
        const imageBuffer = fs.readFileSync(file.path);
        const base64Data = imageBuffer.toString("base64");

        prompt = `Analyze the following bill image.

        Instructions:

        Identify whether the bill is one of the following:

        - Electricity Bill
        - Gas Bill
        - Water Bill

        If the bill is NOT related to electricity, gas, or water, return exactly:

        I am just for these bills:
        - Electricity Bill
        - Gas Bill
        - Water Bill

        If the bill is valid (electricity, gas, or water), then:

        Provide a short savings suggestion (maximum 4-5 lines).
        The FIRST line must clearly mention the bill type.

        At the end of the response, display the following details in an ordered list format:

        1. Units consumed
        2. Base cost
        3. Taxes
        4. Total amount

        Important Rules:

        - Suggestion must be concise and practical.
        - The last four lines MUST strictly follow the ordered list format above.
        - Do not add any extra explanation.
        `;

        result = await model.generateContent([
          {
            inlineData: {
              mimeType: file.mimetype,
              data: base64Data,
            },
          },
          { text: prompt },
        ]);

        fs.unlinkSync(file.path);
      }

      const response = result.response.text();

      return res.json({
        status: 1,
        message: "Bill analyzed successfully",
        data: response,
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
