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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    const bookId = req.params.bookId;

    if (typeof bookId !== "string" || !bookId.trim()) {
      return next(createHttpError(400, "Invalid book ID"));
    }

    const book = await bookModel.findById(bookId);

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as Athenticate;

    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You can not update others book."));
    }

    const files = req.files as {
      [filename: string]: Express.Multer.File[];
    };

    let completCoverImage = "";

    if (files.coverImage) {
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

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "book-cover",
      });

      completCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    let completeFileName = "";

    if (files.file) {
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

      completeFileName = bookFileUploadResult.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title,
        genre,
        coverImage: completCoverImage ? completCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
      },
      {
        new: true,
      },
    );

    res.json(updatedBook);
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return next(createHttpError(500, "Error while uploading files."));
  }
};

const listBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find();
    res.json(books);
  } catch (error) {
    console.error(error);
    next(createHttpError(500, "Error while getting books."));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookId = req.params.bookId;
    if (typeof bookId !== "string" || !bookId.trim()) {
      return next(createHttpError(400, "Invalid book ID"));
    }
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(500, "Book not found."));
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error while getting book."));
  }
};

export { createBook, updateBook, listBook, getSingleBook };
