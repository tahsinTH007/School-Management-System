import express from "express";
import { triggerExamGeneration } from "../controllers/exam.ts";
import { protect, authorize } from "../middleware/auth.ts";

const examRouter = express.Router();

examRouter.post(
  "/generate",
  protect,
  authorize(["teacher", "admin"]),
  triggerExamGeneration,
);

export default examRouter;
