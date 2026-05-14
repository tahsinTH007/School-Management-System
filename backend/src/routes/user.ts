import express from "express";

const userRoutes = express.Router();

import { register } from "../controllers/user.ts";

userRoutes.post("/register", register);

export default userRoutes;
