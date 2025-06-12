import express from "express";
import { runTests } from "../controllers/testController.js";

const router = express.Router();

router.post("/", runTests);

export default router;
