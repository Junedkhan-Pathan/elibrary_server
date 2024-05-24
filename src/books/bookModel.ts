import mongoose, { Schema } from "mongoose";
import { IUser } from "../users/userModel";

export interface IBook {
  _id: string;
  title: string;
  author: IUser;
  genre: string;
  coverImage: string;
  file: string;
}

const bookSchema: Schema<IBook> = new mongoose.Schema({
  title: {
    type: String,
    maxlength: [25, "title length is too big"],
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  genre: {
    type: String,
  },
  coverImage: String,
  file: String,
},{timestamps:true});

const Book = mongoose.model<IBook>("book", bookSchema);

export default Book;
