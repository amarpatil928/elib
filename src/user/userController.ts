import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import type { User } from "./userTypes.js";

const { sign } = jwt;

const createUSer = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All the fields are requires");
    return next(error);
  }

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(
        400,
        "User all ready exist with this email.",
      );
      return next(error);
    }
  } catch {
    return next(createHttpError(500, "Error while getting user."));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch {
    return next(createHttpError(500, "Error while creating user."));
  }

  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.status(201).json({ accessToken: token });
  } catch {
    return next(createHttpError(500, "Error while signing the jwt token."));
  }
};

export { createUSer };
