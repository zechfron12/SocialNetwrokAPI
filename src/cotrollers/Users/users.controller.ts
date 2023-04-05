/* eslint-disable @typescript-eslint/ban-types */
import Controller from "../../interfaces/controller.interface";
import validationMiddleware from "../../middlewares/validation.middleware";
import CreateUserDto from "./createUserDto";
import UsersService from "../../services/users.services";
import { Router } from "express";

export default class UsersController implements Controller {
  public path = "/users";
  public router = Router();
  private usersService = new UsersService();
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.usersService.getAllUsers);
    this.router.get(`${this.path}/:id`, this.usersService.getUserById);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreateUserDto, true),
      this.usersService.modifyUser
    );
    this.router.delete(`${this.path}/:id`, this.usersService.deleteUser);
    this.router.post(
      this.path,
      validationMiddleware(CreateUserDto),
      this.usersService.createUser
    );
    this.router.post(
      `${this.path}/:id/add-friends`,
      this.usersService.addFriends
    );
    this.router.get(
      `${this.path}/:id/find-path-to/:friendId`,
      this.usersService.findPathTo
    );
  }
}
