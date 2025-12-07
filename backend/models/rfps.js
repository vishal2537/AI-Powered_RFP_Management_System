import mongoose, { Schema } from "mongoose";

const rfpSchema = new mongoose.Schema(
  {
    vendorsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "vendor",
      },
    ],
    vendorsEmail: [
      {
        type: String
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    originalQuery: {
      type: String,
      required: true,
    },
    structuredData: {
      products: [
        {
          name: {
            type: String,
            required: true,
          },
          quantity: {
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
      budget: {
        type: Number,
      },
      timeline: {
        type: String,
      },
      additionalNotes: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const rfps = mongoose.model("rfps", rfpSchema);
export default rfps;
