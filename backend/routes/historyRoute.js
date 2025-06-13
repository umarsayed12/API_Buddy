import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  deleteHistory,
  getHistory,
  getHistoryById,
  saveHistory,
} from "../controllers/historyController.js";

const router = express.Router();

router.route("/save-history").post(isAuthenticated, saveHistory);
router.route("/get-history").get(isAuthenticated, getHistory);
router.route("/delete-history").delete(isAuthenticated, deleteHistory);
router.route("/:id").get(isAuthenticated, getHistoryById);

export default router;
