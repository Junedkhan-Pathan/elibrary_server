import {
  deleteFileFromCloudinary,
  uploadOnCloudinary,
} from "../helpers/cloudinary";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import Book, { IBook } from "./bookModel";

const createBook = asyncHandler(async (req, res) => {
  const { title, genre } = await req.body;
  const { coverImage, file } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  }; //this is the types for the multer file finded from the internet

  if (
    [title, genre].some((field) => field.trim() === "" || !coverImage || !file)
  )
    res.status(400).json(new ApiError(400, "All field required!!"));

  const coverImageResult: any = await uploadOnCloudinary(coverImage[0]);
  const bookUpload = coverImageResult?.url
    ? await uploadOnCloudinary(file[0])
    : await deleteFileFromCloudinary(coverImageResult?.public_id);

  if (!coverImageResult || !bookUpload)
    res.status(500).json(new ApiError(500, "Failed uploading files!!"));

  const newBook = await Book.create({
    title,
    genre,
    coverImage: coverImageResult?.url,
    file: bookUpload?.url,
    author: "664dcfb10e765178ac85d008",
  });

  if (!newBook)
    res.status(500).json(new ApiError(500, "Failed to create books!!"));

  await newBook.save();

  res.status(201).json(new ApiResponse(201, "New book created!!", newBook));
});

export { createBook };
