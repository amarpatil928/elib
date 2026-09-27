import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import createHttpError from "http-errors";
import userRouter from "./user/userRouter.js";

const app = express();

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use("/api/user", userRouter);

app.use(globalErrorHandler);
export default app;
