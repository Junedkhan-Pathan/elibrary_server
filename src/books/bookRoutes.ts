import { Router } from "express";
import { upload } from "../middlewares/multer";
import { createBook } from "./bookController";

const bookRoutes = Router();

bookRoutes.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRoutes;
