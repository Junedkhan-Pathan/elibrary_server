import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { conf } from "../config/conf";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isPasswordCorrect: (password:string) => boolean;
  generateAccessToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide username"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    conf.jwt_secret!,
    { expiresIn: conf.accessTokenExpiry }
  );
  return accessToken;
};

const User = mongoose.model<IUser>("user", userSchema);
export default User;
