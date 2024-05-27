import { Router } from "express";
import { upload } from "../middlewares/multer";
import { createBook, updateBook, listBooks } from "./bookController";
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
bookRoutes.patch(
  "/:bookId",
  authMiddleware,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);
bookRoutes.get(
  "/",
  listBooks
);

export default bookRoutes;
