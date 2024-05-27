import { Router } from "express";
import { upload } from "../middlewares/multer";
import { createBook } from "./bookController";
import authMiddleware from "../middlewares/authMiddleware";

const bookRoutes = Router();

bookRoutes.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRoutes;
