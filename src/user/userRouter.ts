import express from "express";
import { createUSer } from "./userController.js";

const userRouter = express.Router();

userRouter.post("/register", createUSer);

export default userRouter;
