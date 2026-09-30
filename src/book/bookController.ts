import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";
import createHttpError from "http-errors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bookModel from "./bookModel.js";
import fs from "node:fs";
import type { Athenticate } from "../middlewares/authenticate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    const files = req.files as {
      [filename: string]: Express.Multer.File[];
    };

    const coverImage = files.coverImage?.[0];

    if (!coverImage) {
      return next(createHttpError(400, "Cover image is required"));
    }

    const fileName = coverImage.filename;

    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName,
    );

    console.log("filePath:", filePath);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-cover",
    });

    const bookFile = files.file?.[0];

    if (!bookFile) {
      return next(createHttpError(400, "Bool file is required"));
    }

    const bookFileName = bookFile.filename;

    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName,
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      },
    );

    console.log("uploadResult:", uploadResult);
    console.log("uploadResult:", bookFileUploadResult);

    const _req = req as Athenticate;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return next(createHttpError(500, "Error while uploading files."));
  }
};

export { createBook };
