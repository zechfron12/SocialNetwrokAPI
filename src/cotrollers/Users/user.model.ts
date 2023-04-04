import { Schema, model, Document } from "mongoose";
import User from "./user.interace";

const userSchema = new Schema({
  id: String,
  firends: [{ type: String, default: [] }],
});

const userModel = model<User & Document>("User", userSchema);

export default userModel;
