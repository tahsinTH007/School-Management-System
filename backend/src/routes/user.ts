import express from "express";
import { login, register } from "../controllers/user";
import { authorize, protect } from "../middleware/auth";

const userRoutes = express.Router();

userRoutes.post(
  "/register",
  protect,
  authorize(["admin", "teacher"]),
  register,
);
userRoutes.post("/login", login);

export default userRoutes;
