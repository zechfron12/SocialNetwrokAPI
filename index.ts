import App from "./src/app";
import UsersController from "./src/cotrollers/Users/users.controller";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import fs from "fs";
import YAML from "yamljs";
import cors from "cors";

dotenv.config();

const file = fs.readFileSync("./src/doc/openapi.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

const app = new App([new UsersController()], process.env?.PORT || "8000");
app.app.use(cors());
app.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen();
