import express, { Application } from "express";
import dbConfig from "./config/db.config";
import * as bodyParser from "body-parser";
import * as mangoose from "mongoose";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public app: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeErrorHandling();
    this.initializeControllers(controllers);
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private connectToTheDatabase() {
    mangoose.connect(dbConfig.mongoUrl || "");
  }
}

export default App;
