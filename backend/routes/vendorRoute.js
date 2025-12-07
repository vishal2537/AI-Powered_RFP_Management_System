import express from "express";
import {
  createVendor,
  getVendorsByUser,
} from "../controllers/vendorController.js";
const router = express.Router();

router.post("/addVendor",  createVendor);
router.get("/:userId/vendors", getVendorsByUser);

export default router;
