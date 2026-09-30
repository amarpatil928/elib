import type { Types } from "mongoose";
// import type { User } from "../user/userTypes.js";

export interface Book {
  _id: string;
  title: string;
  author: Types.ObjectId;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
