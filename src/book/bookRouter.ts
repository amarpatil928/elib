import express from "express";
import { createBook } from "./bookController.js";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authenticate from "../middlewares/authenticate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fieldSize: 10 * 1024 * 1024 }, // 10mb
});

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook,
);

export default bookRouter;
