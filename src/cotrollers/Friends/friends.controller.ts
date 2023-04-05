import { Router } from "express";
import Controller from "../../interfaces/controller.interface";
import FriendsService from "../../services/friends.service";

export default class FriendsController implements Controller {
  public path = "/friends";
  public router = Router();
  private friendsService = new FriendsService();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.post(`${this.path}/add`, this.friendsService.addFriends);
    this.router.get(`${this.path}/find-path`, this.friendsService.findPathTo);
  }
}
