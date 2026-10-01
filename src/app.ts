import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRouter from "./user/userRouter.js";
import bookRouter from "./book/bookRouter.js";
import { config } from "./config/config.js";

const app = express();

app.use(
  cors({
    origin: config.fronendDomain,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);

app.use(globalErrorHandler);
export default app;
