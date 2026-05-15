import express from "express";

import {
  deleteUser,
  getUserProfile,
  getUsers,
  login,
  logoutUser,
  register,
  updateUser,
} from "../controllers/user";

import { authorize, protect } from "../middleware/auth";

const userRoutes = express.Router();

userRoutes.post(
  "/register",
  protect,
  authorize(["admin", "teacher"]),
  register,
);
userRoutes.post("/login", login);

userRoutes.post("/logout", logoutUser);

userRoutes.get("/profile", protect, getUserProfile);

userRoutes.get("/", protect, authorize(["admin", "teacher"]), getUsers);

userRoutes.put(
  "/update/:id",
  protect,
  authorize(["admin", "teacher"]),
  updateUser,
);

userRoutes.delete(
  "/delete/:id",
  protect,
  authorize(["admin", "teacher"]),
  deleteUser,
);

export default userRoutes;
