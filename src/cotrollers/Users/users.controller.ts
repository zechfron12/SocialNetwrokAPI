import User from "./user.interace";
import { NextFunction, Request, Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import userModel from "./user.model";
import HttpException from "../../exceptions/HttpException";
import UserNotFoundException from "../../exceptions/UserNotFoundExceptions";
import validationMiddleware from "../../middlewares/validation.middleware";
import CreateUserDto from "./createUserDto";

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
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreateUserDto, true),
      this.modifyUser
    );
    this.router.delete(`${this.path}/:id`, this.deteleUser);
    this.router.post(
      this.path,
      validationMiddleware(CreateUserDto),
      this.createUser
    );
  }
  private getAllUsers = (request: Request, response: Response) => {
    this.user.find().then((users) => {
      response.send(users);
    });
  };

  private getUserById = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    this.user.findById(id).then((user) => {
      if (user) response.send(user);
      else next(new UserNotFoundException(id));
    });
  };

  private modifyUser = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const userData: User = request.body;
    this.user.findByIdAndUpdate(id, userData, { new: true }).then((user) => {
      if (user) response.send(user);
      else next(new UserNotFoundException(id));
    });
  };

  private createUser = (request: Request, response: Response) => {
    const userData: CreateUserDto = request.body;
    const createUser = new this.user({ ...userData, friends: [] });
    createUser.save().then((savedUser) => {
      response.send(savedUser);
    });
  };

  private deteleUser = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    this.user.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) response.send(200);
      else next(new UserNotFoundException(id));
    });
  };
}
