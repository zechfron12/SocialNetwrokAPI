import User from "./user.interace";
import { Request, Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import userModel from "./user.model";

export default class UsersController implements Controller {
  public path = "/users";
  public router = Router();
  private user = userModel;
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.patch(`${this.path}/:id`, this.modifyUser);
    this.router.delete(`${this.path}/:id`, this.deteleUser);
    this.router.post(this.path, this.createUser);
  }
  private getAllUsers = (request: Request, response: Response) => {
    this.user.find().then((users) => {
      response.send(users);
    });
  };

  private getUserById = (request: Request, response: Response) => {
    const id = request.params.id;
    this.user.findById(id).then((user) => {
      response.send(user);
    });
  };

  private modifyUser = (request: Request, response: Response) => {
    const id = request.params.id;
    const userData: User = request.body;
    this.user.findByIdAndUpdate(id, userData, { new: true }).then((user) => {
      response.send(user);
    });
  };

  private createUser = (request: Request, response: Response) => {
    const userData: User = request.body;
    const createUser = new this.user(userData);
    createUser.save().then((savedUser) => {
      response.send(savedUser);
    });
  };

  private deteleUser = (request: Request, response: Response) => {
    const id = request.params.id;
    this.user.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.send(200);
      } else {
        response.send(404);
      }
    });
  };
}
