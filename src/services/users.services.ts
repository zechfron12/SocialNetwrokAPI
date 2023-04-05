/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import userModel from "../cotrollers/Users/user.model";
import { NextFunction, Request, Response } from "express";
import User from "../cotrollers/Users/user.interace";
import UserNotFoundException from "../exceptions/UserNotFoundExceptions";
import CreateUserDto from "../cotrollers/Users/createUserDto";
import HttpException from "../exceptions/HttpException";

export default class UsersService {
  public getAllUsers = (request: Request, response: Response) => {
    return userModel.find().then((userDocs) => {
      const users = userDocs.map((userDoc) => userDocumentToUser(userDoc));
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
        const user = userDocumentToUser(userDoc);
        response.send(user);
        return user;
      } else next(new UserNotFoundException(id));
    });
  };

  public modifyUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const userData: User = request.body;
    if (userData.friends && userData.friends.length > 0) {
      try {
        await userModel.find({
          _id: { $in: userData.friends },
        });
      } catch (err) {
        next(new HttpException(400, "List of friends is not valid"));
      }
    }
    return userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .then((userDoc) => {
        if (userDoc) {
          const user = userDocumentToUser(userDoc);
          response.send(user);
          return user;
        } else next(new UserNotFoundException(id));
      });
  };

  public createUser = async (request: Request, response: Response) => {
    const userData: CreateUserDto = request.body;
    const createUser = new userModel({ ...userData, friends: [] });
    const savedUser = await createUser.save();
    const user: User = userDocumentToUser(savedUser);
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
}

export const userDocumentToUser = (userDocument: any): User => {
  return {
    id: userDocument._id.toString(),
    name: userDocument.name,
    friends: userDocument.friends,
  };
};
