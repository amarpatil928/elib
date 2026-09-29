import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRouter from "./user/userRouter.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use("/api/user", userRouter);

app.use(globalErrorHandler);
export default app;
