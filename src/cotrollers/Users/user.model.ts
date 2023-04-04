import { Schema, model, Document } from "mongoose";
import User from "./user.interace";
import { ObjectId } from "mongodb";

const userSchema = new Schema({
  name: String,
  friends: [{ ObjectId, default: [] }],
});

const userModel = model<User & Document>("User", userSchema);

export default userModel;
