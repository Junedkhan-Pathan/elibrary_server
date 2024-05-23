import express, { json, urlencoded } from "express";
// import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRoutes from "./users/userRouter";

const app = express();

app.use(json({ limit: "20kb" }));
app.use(urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
// app.use(globalErrorHandler);

export default app;
