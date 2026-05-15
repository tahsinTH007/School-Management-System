import express from "express";

import { getAllActivities } from "../controllers/activitieslog.ts";
import { authorize, protect } from "../middleware/auth.ts";

const LogsRouter = express.Router();

LogsRouter.get("/", protect, authorize(["admin", "teacher"]), getAllActivities);

export default LogsRouter;
