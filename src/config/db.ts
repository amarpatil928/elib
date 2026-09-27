import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database succssfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting the database.", err);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.error("Failed to connect to database.:", error);

    process.exit(1);
  }
};

export default connectDB;
