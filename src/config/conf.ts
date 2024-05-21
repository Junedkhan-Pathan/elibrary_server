import { config } from "dotenv";

config()

export const conf = {
  port: process.env.PORT,
  mongodbUrl: process.env.MONGODB_URI,
  env:process.env.NODE_ENV
};
