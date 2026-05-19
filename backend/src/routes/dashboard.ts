import express from "express";
import { getDashboardStats } from "../controllers/dashboard.ts";
import { protect } from "../middleware/auth.ts";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", protect, getDashboardStats);

export default dashboardRouter;
