import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import console from "node:console";

export interface Authenticate extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authorization token is required."));
  }

  try {
    const parsedToken = token.split(" ")[1];
    const decoded = jwt.verify(
      parsedToken as string,
      config.jwtSecret as string,
    );

    const _req = req as Authenticate;

    _req.userId = decoded.sub as string;

    next();
  } catch (error) {
    console.error(error);
    return next(createHttpError(401, "Token expired."));
  }
};

export default authenticate;
