import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const Connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    console.log("Connected to database successfully!");
  } catch (error) {
    console.log("Error connecting to Database", error);
  }
};

export default Connection;
