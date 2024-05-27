import {
  deleteFileFromCloudinary,
  uploadOnCloudinary,
} from "../helpers/cloudinary";
import { IUserAuth } from "../middlewares/authMiddleware";

import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import Book from "./bookModel";

const createBook = asyncHandler(async (req, res) => {
  const _req = req as IUserAuth;
  const { _id } = _req.user;
  const { title, genre } = await req.body;
  const { coverImage, file } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  }; //this is the types for the multer file finded from the internet

  if (
    [title, genre].some((field) => field.trim() === "" || !coverImage || !file)
  )
    res.status(400).json(new ApiError(400, "All field required!!"));

  const imgageFormat = coverImage[0]?.mimetype.split("/")?.at(-1);
  const fileFormat = file[0]?.mimetype.split("/")?.at(-1);

  if (!(imgageFormat !== "pdf" && fileFormat === "pdf"))
    res
      .status(400)
      .json(new ApiError(400, "Image and file should be in correct format!!"));

  console.log("IMAGE:::::::::::", coverImage[0]);
  console.log("File:::::::::::", file[0]);
  const coverImageResult = await uploadOnCloudinary(
    coverImage[0].filename,
    imgageFormat!
  );
  const bookUpload = await uploadOnCloudinary(file[0].filename, fileFormat!);
  // const bookUpload = (await coverImageResult?.url)
  //   ? await uploadOnCloudinary(file[0])
  //   : await deleteFileFromCloudinary(coverImageResult?.public_id);

  if (!coverImageResult || !bookUpload)
    res.status(500).json(new ApiError(500, "Failed uploading files!!"));

  const newBook = await Book.create({
    title,
    genre,
    coverImage: coverImageResult?.url,
    file: bookUpload?.url,
    author: _id,
  });

  if (!newBook)
    res.status(500).json(new ApiError(500, "Failed to create books!!"));

  await newBook.save();

  res.status(201).json(new ApiResponse(201, "New book created!!", newBook));
});

export { createBook };
