import express from "express";
import {
  createAcademicYear,
  getAllAcademicYears,
} from "../controllers/academicYear.ts";

import { authorize, protect } from "../middleware/auth.ts";

const academicYearRouter = express.Router();

academicYearRouter
  .route("/")
  .get(protect, authorize(["admin"]), getAllAcademicYears);

academicYearRouter
  .route("/create")
  .post(protect, authorize(["admin"]), createAcademicYear);

export default academicYearRouter;
