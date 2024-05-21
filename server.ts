import app from "./src/app";
import { conf } from "./src/config/conf";
import connectDB from "./src/config/db";

const startServer = async() => {
  await connectDB();
  app.listen(conf.port, () => {
    console.log(`app in running on port:${conf.port}`);
  });
};

startServer();
