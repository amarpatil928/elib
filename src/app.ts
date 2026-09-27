import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import createHttpError from "http-errors";

const app = express();

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use(globalErrorHandler);
export default app;
