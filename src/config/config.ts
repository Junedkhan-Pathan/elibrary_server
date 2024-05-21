import { config as conf } from "dotenv";
conf();

export const config = {
  port: process.env.PORT,
  mongodbUrl: process.env.MONGODB_URI,
};
