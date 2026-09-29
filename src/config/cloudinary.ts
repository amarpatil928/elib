import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.js";

// Configuration
const cloudinaryConfig = {
  cloud_name: config.cloudinaryCloud ?? "",
  api_key: config.cloudinaryApiKey ?? "",
  api_secret: config.cloudinarySecret ?? "",
};

cloudinary.config(cloudinaryConfig);

export default cloudinary;
