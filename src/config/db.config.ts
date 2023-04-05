import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  mongoUrl: process.env.MONGO_URL || "",
};
export default dbConfig;
