import App from "./src/app";
import UsersController from "./src/cotrollers/Users/users.controller";
import dotenv from "dotenv";

dotenv.config();

const app = new App([new UsersController()], process.env?.PORT || "8000");

app.listen();
