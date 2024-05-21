import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();



app.use(globalErrorHandler);

export default app;
