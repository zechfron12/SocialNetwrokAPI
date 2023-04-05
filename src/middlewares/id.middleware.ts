import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import HttpException from "../exceptions/HttpException";
import userModel from "../cotrollers/Users/user.model";
import { RequestHandler } from "express";

function validateIdMiddleware(): RequestHandler {
  return (req, res, next) => {
    const id = req.params.id;
    userModel
      .findById(id)
      .then((userDoc) => {
        if (userDoc) {
          next();
        } else next(new HttpException(404, "User not found"));
      })
      .catch(() => {
        next(new HttpException(404, "User not found"));
      });
  };
}

export default validateIdMiddleware;
