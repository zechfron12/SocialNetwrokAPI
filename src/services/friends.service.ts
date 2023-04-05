import userModel from "../cotrollers/Users/user.model";
import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { userDocumentToUser } from "./users.services";
import { shortestChainLength } from "../utils/graph.utils";

export default class FriendsService {
  public addFriends = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userId = request.body.userId;
    let friendStringIds = request.body.friends as string[];

    if (!friendStringIds || !userId) {
      next(new HttpException(400, "Missing userId or friends"));
    }
    try {
      const myUser = await userModel.findById(userId);
      friendStringIds = friendStringIds.filter(
        (friendId) => myUser?.friends.indexOf(friendId) === -1
      );
      try {
        const existingUsers = await userModel.find({
          _id: { $in: friendStringIds },
        });

        for (const existingUser of existingUsers) {
          myUser?.friends.push(existingUser._id);
          if (existingUser.friends.indexOf(myUser?._id) === -1) {
            existingUser?.friends.push(myUser?._id);
            await existingUser.save();
          }
        }
        await myUser?.save();
        response.send(userDocumentToUser(myUser));
      } catch (err) {
        next(new HttpException(404, "One of the friends does not exist"));
      }
    } catch (err) {
      next(new HttpException(404, "User not found"));
    }
  };

  public findPathTo = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      userModel.find().then((userDocs) => {
        const users = userDocs.map((userDoc) => userDocumentToUser(userDoc));
        const graph: { [key: string]: string[] } = {};

        for (const user of users) {
          graph[user.id] = user.friends;
        }
        const start = request.body.idBegin;
        const end = request.body.idEnd;
        const path = shortestChainLength(graph, start, end);
        console.log(path);

        response
          .send("The lenght of the shortest path is: " + path)
          .sendStatus(200);
      });
    } catch (err) {
      next(new HttpException(500, "Internal Server Error"));
    }
  };
}
