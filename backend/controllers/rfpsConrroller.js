import rfps from "../models/rfps.js";
import { parseRFP } from "../utils/openaiParser.js";
import nodemailer from "nodemailer";
import vendor from "../models/vendor.js";
import vendorResponse from "../models/vendorResponse.js";
import { generateEmailTemplate } from "../utils/emailTemplate.js";

export const createRFP = async (req, res) => {
  try {
    const { createdBy, title, originalQuery } = req.body;

    if (!createdBy || !title || !originalQuery) {
      return res.status(400).json({
        success: false,
        message: "createdBy, title and originalQuery are required",
      });
    }

    const structuredData = await parseRFP(originalQuery);
    const newRFP = await rfps.create({
      createdBy,
      title,
      originalQuery,
      structuredData,
    });

    return res.status(201).json({
      success: true,
      message: "RFP created successfully",
      rfp: newRFP,
    });
  } catch (error) {
    console.error("Error creating RFP:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const sendMail = async (req, res) => {
  try {
    const { rfpId, vendorEmails } = req.body;
    if (!rfpId || !vendorEmails || vendorEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "rfpId and vendorEmails are required",
      });
    }
    const rfp = await rfps.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({
        success: false,
        message: "RFP not found",
      });
    }

    const vendorDocs = await vendor.find({ email: { $in: vendorEmails } });
    const newVendorIds = vendorDocs.map((v) => v._id.toString());
    const newVendorEmails = vendorDocs.map((v) => v.email);
    const oldVendorIds = rfp.vendorsId?.map((id) => id.toString()) || [];
    const oldVendorEmails = rfp.vendorsEmail || [];

    const mergedVendorIds = [...new Set([...oldVendorIds, ...newVendorIds])];
    const mergedVendorEmails = [
      ...new Set([...oldVendorEmails, ...newVendorEmails]),
    ];

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const htmlContent = generateEmailTemplate(rfp);

    await transporter.sendMail({
      from: `"AI RFP System" <${process.env.MAIL_USER}>`,
      to: mergedVendorEmails.join(","),
      subject: "New RFP Requirement - Please Review",
      html: htmlContent,
    });

    rfp.vendorsId = mergedVendorIds;
    rfp.vendorsEmail = mergedVendorEmails;
    await rfp.save();

    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error("Error sending mail:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getRFPsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const arr_rfps = await rfps.find({ createdBy: userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: arr_rfps.length,
      rfps: arr_rfps,
    });
  } catch (error) {
    console.error("Error fetching RFPs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllRfpVendorDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const allRfps = await rfps.find({ createdBy: userId }).populate("vendorsId");

    let finalResult = [];
    for (const rfp of allRfps) {
      let vendorDetails = [];
      for (const vendorObj of rfp.vendorsId) {
        const response = await vendorResponse.findOne({
          rfpId: rfp._id,
          vendorUserId: vendorObj._id,
        });
        vendorDetails.push({
          vendor: vendorObj,
          vendorResponse: response || null,
        });
      }
      finalResult.push({
        rfp,
        vendors: vendorDetails,
      });
    }
    console.log(finalResult);

    return res.status(200).json({
      success: true,
      data: finalResult,
    });
  } catch (error) {
    console.error("Error in getAllRfpVendorDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};