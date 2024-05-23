import { config } from "dotenv";

config()

export const conf = {
  port: process.env.PORT,
  mongodbUrl: process.env.MONGODB_URI,
  env: process.env.NODE_ENV,
  jwt_secret: process.env.JWT_SECRET_KEY,
  accessTokenExpiry:process.env.ACCESS_TOKEN_EXPIRY
};

Object.freeze(conf)