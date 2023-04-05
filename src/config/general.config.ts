import dotenv from "dotenv";
dotenv.config();

const generalConfig = {
  port: process.env.PORT || "",
};
export default generalConfig;
