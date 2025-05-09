import express from "express";
import authRouter from "./auth.route.js";
import adminCommonRouter from "./common.route.js";
import masterRouter from "./master.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/",adminCommonRouter);
router.use("/master",masterRouter)
export default router;
