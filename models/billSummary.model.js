import mongoose from "mongoose";

const billSummarySchema = new mongoose.Schema(
  {
    billImage: {
      type: {
        public_id: { type: String, trim: true },
        secure_url: { type: String, trim: true },
      },
      required: false,
      default: null,
    },
    summary: {
      type: String,
      required: false,
      trim: true,
    },
    billType: {
      type: String,
      required: false,
      trim: true,
      enum: ["Electricity Bill", "Gas Bill", "Water Bill"],
    },
    units: {
      type: String,
      required: false,
      trim: true,
    },
    baseCost: {
      type: String,
      required: false,
      trim: true,
    },
    taxes: {
      type: String,
      required: false,
      trim: true,
    },
    totalAmount: {
      type: String,
      required: false,
      trim: true,
    },
    billMonth: {
      type: Number,
      required: false,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const BillSummary = mongoose.model("BillSummary", billSummarySchema);
