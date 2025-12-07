import express from "express";
import { createRFP, getRFPsByUser, sendMail, getAllRfpVendorDetails } from "../controllers/rfpsConrroller.js";
import { checkForAllRFP } from "../controllers/vendorController.js";

const router = express.Router();

router.post("/addRfp", createRFP);
router.get("/allRfpsByUserId/:userId", getRFPsByUser);
router.post("/sendMail", sendMail);
router.post("/checkForAllRFP", checkForAllRFP);
router.get("/getAllRfpVendorDetails/:userId", getAllRfpVendorDetails);

export default router;