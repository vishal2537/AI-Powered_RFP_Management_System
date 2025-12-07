import express from "express";
import authRoute from "./authRoute.js";
import vendorRoute from "./vendorRoute.js";
import rfpsRoute from "./rfpsRoute.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", authMiddleware, vendorRoute);
router.use("/rfps", authMiddleware,  rfpsRoute);

export default router;
