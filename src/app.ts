import express, { json, urlencoded } from "express";
// import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRoutes from "./users/userRouter";
import bookRoutes from "./books/bookRoutes";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // for allowing the request
  })
);
app.use(json({ limit: "20kb" }));
app.use(urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/books", bookRoutes);

// app.use(globalErrorHandler);

export default app;
