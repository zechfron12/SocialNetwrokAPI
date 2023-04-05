/* eslint-disable @typescript-eslint/ban-types */
import userModel from "../cotrollers/Users/user.model";
import { NextFunction, Request, Response } from "express";
import User from "../cotrollers/Users/user.interace";
import UserNotFoundException from "../exceptions/UserNotFoundExceptions";
import CreateUserDto from "../cotrollers/Users/createUserDto";
import { Graph } from "../utils/graph.utils";

export default class UsersService {
  public getAllUsers = (request: Request, response: Response) => {
    return userModel.find().then((userDocs) => {
      const users = userDocs.map((userDoc) => this.userDocumentToUser(userDoc));
      response.send(users);
      return users;
    });
  };

  public getUserById = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    return userModel.findById(id).then((userDoc) => {
      if (userDoc) {
        const user = this.userDocumentToUser(userDoc);
        response.send(user);
        return user;
      } else next(new UserNotFoundException(id));
    });
  };

  public modifyUser = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const userData: User = request.body;
    return userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .then((userDoc) => {
        if (userDoc) {
          const user = this.userDocumentToUser(userDoc);
          response.send(user);
          return user;
        } else next(new UserNotFoundException(id));
      });
  };

  public createUser = async (request: Request, response: Response) => {
    const userData: CreateUserDto = request.body;
    const createUser = new userModel({ ...userData, friends: [] });
    const savedUser = await createUser.save();
    const user: User = this.userDocumentToUser(savedUser);
    response.send(user);
    return user;
  };

  public deleteUser = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    return userModel
      .findByIdAndDelete(id)
      .then((successResponse) => {
        if (successResponse) {
          response.send(200);
          return successResponse;
        } else next(new UserNotFoundException(id));
      })
      .catch((err) => {
        next(new UserNotFoundException(id));
      });
  };

  public addFriends = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    let friendStringIds: string[] = request.body;
    const myUser = await userModel.findById(id);
    friendStringIds = friendStringIds.filter(
      (friendId) =>
        myUser?.friends.find((friend) => friend.id === friendId) !== undefined
    );

    const existingUsers = await userModel.find({
      _id: { $in: friendStringIds },
    });

    for (const existingUser of existingUsers) {
      myUser?.friends.push(existingUser._id);
      if (existingUser.friends.indexOf(myUser?._id) === -1) {
        existingUser?.friends.push({
          id: myUser?._id,
          name: myUser?.name || "",
        });
        await existingUser.save();
      }
    }
    await myUser?.save();
    response.send(this.userDocumentToUser(myUser));
  };

  public findPathTo = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    return userModel.find().then((userDocs) => {
      const users = userDocs.map((userDoc) => this.userDocumentToUser(userDoc));

      const graph = new Graph(users);
      const path = graph.findPath(request.params.id, request.params.friendId);
      response.send(path);
      return users;
    });
  };

  private userDocumentToUser(userDocument: any): User {
    return {
      id: userDocument._id.toString(),
      name: userDocument.name,
      friends: userDocument.friends,
    };
  }
}
