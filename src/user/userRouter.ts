import express from "express";
import { createUSer, loginUser } from "./userController.js";

const userRouter = express.Router();

userRouter.post("/register", createUSer);
userRouter.post("/login", loginUser);

export default userRouter;
