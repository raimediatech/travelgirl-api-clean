import express from "express";
import authUserRouter from "./auth.route.js";
import masterRouter from "./master.route.js";
import commonRouter from "./common.route.js";
import tripRouter from "./trip.route.js";
const router = express.Router();

router.use("/auth", authUserRouter);
router.use("/master", masterRouter);
router.use("/", commonRouter);
router.use("/trip", tripRouter);
export default router;
