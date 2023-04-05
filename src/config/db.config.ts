import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  mongoUrl:
    process.env.MONGO_URL ||
    "mongodb+srv://shoreline:shoreline@cluster0.1wvy3fn.mongodb.net/?retryWrites=true&w=majority",
};
export default dbConfig;
