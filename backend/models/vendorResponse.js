import mongoose, { Schema } from "mongoose";

const vendorResponseSchema = new mongoose.Schema(
  {
    rfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rfps",
      required: true,
    },
    vendorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    structuredResponseData: {
      products: [
        {
          name: {
            type: String,
            required: true,
          },
          brand: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          specs: {
            type: Map,
            of: String,
            default: {},
          },
        },
      ],

      totalQuoteValue: {
        type: Number,
        required: true,
      },

      message: {
        type: String,
      },
    },

    evaluation: {
      finalScore: {
        type: Number,
        default: 0,
      },
      aiExplanationMessage: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const vendorResponse = mongoose.model("vendorResponse", vendorResponseSchema);
export default vendorResponse;
