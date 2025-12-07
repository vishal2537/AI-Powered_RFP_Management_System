import vendor from "../models/vendor.js";
import vendorResponse from "../models/vendorResponse.js";
import { extractPdfText } from "../utils/pdfReader.js";
import { parseVendorData } from "../utils/aiParser.js";
import rfps from "../models/rfps.js";
import imaps from "imap-simple";
import { evaluateVendorResponse } from "../utils/aiEvaluator.js";
  
export const createVendor = async (req, res) => {
  try {
    const { name, email, company, createdBy } = req.body;
    const existingVendor = await vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }
    const newVendor = await vendor.create({
      name: name,
      email: email,
      company: company,
      createdBy: createdBy,
    });

    return res.status(201).json({
      message: "Vendor created successfully",
      vendor: newVendor,
    });
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVendorsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const vendors = await vendor.find({ createdBy: userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      total: vendors.length,
      vendors: vendors,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkForAllRFP = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const allRfpsByUserId = await rfps.find({ createdBy: userId }).sort({});

    for (let rfp of allRfpsByUserId) {
      await processRfpInboxResponses(rfp);
    }

    return res
      .status(200)
      .json({ success: true, message: "Processed all RFP inboxes" });
  } catch (error) {
    console.error("Error in checkForAllRFP:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const processRfpInboxResponses = async (rfp) => {
  try {
    const rfpId = rfp._id;
    let vendorIds = rfp.vendorsId || [];
    let vendorEmails = rfp.vendorsEmail || [];
    if (vendorEmails.length === 0) return;
    const config = {
      imap: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false },
      },
    };

    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    for (let i = 0; i < vendorEmails.length; i++) {
      const email = vendorEmails[i];
      const vendorUserId = vendorIds[i];

      const searchCriteria = ["UNSEEN", ["FROM", email]];
      const fetchOptions = {
        bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
        markSeen: true,
      };

      const messages = await connection.search(searchCriteria, fetchOptions);

      if (!messages.length) continue;

      const message = messages[0];
      let rawText = message.parts.find((part) => part.which === "TEXT").body;

      if (message.pdfPath) {
        const pdfText = await extractPdfText(message.pdfPath);
        rawText += "\n\n" + pdfText;
      }

      const structured = await parseVendorData(rawText);
      if (!structured) continue;
      await saveVendorResponse(rfpId, vendorUserId, structured);
      vendorEmails.splice(i, 1);
      i--;
    }

    rfp.vendorsEmail = vendorEmails;
    await rfp.save();

    connection.end();
  } catch (err) {
    console.error("Error in processRfpInboxResponses:", err);
  }
};

async function saveVendorResponse(rfpId, vendorUserId, structured) {
  const rfp = await rfps.findById(rfpId);
  if (!rfp) throw new Error("RFP not found");

  const savedResponse = await vendorResponse.create({
    rfpId,
    vendorUserId,
    structuredResponseData: structured,
  });

  const aiEvaluation = await evaluateVendorResponse(rfp, savedResponse);

  console.log("AI Evaluation Result:", aiEvaluation);

  savedResponse.evaluation = {
    finalScore: aiEvaluation.finalScore,
    aiExplanationMessage: aiEvaluation.aiExplanationMessage,
  };

  await savedResponse.save();
  return savedResponse;
}
