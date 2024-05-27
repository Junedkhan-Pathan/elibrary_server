import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { conf } from "../config/conf";
import { Request } from "express";

type tokenUser = {
  _id: string;
  username: string;
  email: string;
};
export interface IUserAuth extends Request {
  user: tokenUser;
}

const authMiddleware = asyncHandler((req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) res.status(401).json(new ApiError(401, "Unauthorized request"));

  const decodeToken = jwt.verify(token, conf.jwt_secret!);

  const _req = req as IUserAuth; // for extending the request of express with append out req.
  _req.user = decodeToken as tokenUser;

  next();
});

export default authMiddleware;
