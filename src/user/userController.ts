import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.js";

const createUSer = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All the fields are requires");
    return next(error);
  }

  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, "User all ready exist with this email.");
    return next(error);
  }

  res.json({ message: "User creates" });
};

export { createUSer };
