/* eslint-disable @typescript-eslint/ban-types */
import Controller from "../../interfaces/controller.interface";
import validationMiddleware from "../../middlewares/validation.middleware";
import CreateUserDto from "./createUserDto";
import UsersService from "../../services/users.services";
import { Router } from "express";
import validateId from "../../middlewares/id.middleware";

export default class UsersController implements Controller {
  public path = "/users";
  public router = Router();
  private usersService = new UsersService();
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.usersService.getAllUsers);
    this.router.get(
      `${this.path}/:id`,
      validateId(),
      this.usersService.getUserById
    );
    this.router.put(
      `${this.path}/:id`,
      validateId(),
      validationMiddleware(CreateUserDto, true),
      this.usersService.modifyUser
    );
    this.router.delete(
      `${this.path}/:id`,
      validateId(),
      this.usersService.deleteUser
    );
    this.router.post(
      this.path,
      validationMiddleware(CreateUserDto),
      this.usersService.createUser
    );
  }
}
