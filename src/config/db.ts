import mongoose from "mongoose";
import { conf } from "./conf";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Mongodb Connection Established!!");
    });
    mongoose.connection.on("error", () => {
      console.log("Mongodb Connection Failed!!");
      process.exit(1);
    });

    //the above tho listner is event so we have to first register that's why we write first before db connection
    await mongoose.connect(conf.mongodbUrl!);
  } catch (error) {
    console.log("Database connection failed!!", error);
    process.exit(1);
  }
};

export default connectDB;
