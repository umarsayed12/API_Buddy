import express from "express";
import { explainFailure } from "../controllers/aiController.js";
import { explainSecurityWarning } from "../controllers/aiWarningExplain.js";
const router = express.Router();

router.post("/explain", explainFailure);
router.post("/explain-security-warnings", explainSecurityWarning);

export default router;
