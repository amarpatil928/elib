import type { NextFunction, Request, Response } from "express";

const createUSer = (req: Request, res: Response, next: NextFunction) => {
  res.send("User Created");
};

export { createUSer };
