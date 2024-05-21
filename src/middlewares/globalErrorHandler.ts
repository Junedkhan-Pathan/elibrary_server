import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { conf } from "../config/conf";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status;

  return res.status(statusCode).json({
    message: err.message,
    error: conf.env === "development" ? err.stack : "",
  });
};

export default globalErrorHandler