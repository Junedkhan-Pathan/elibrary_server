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

const updateBook = asyncHandler(async (req, res) => {
  const _req = req as IUserAuth;
  const { _id } = _req.user;
  const { title, genre } = await req.body;
  const { coverImage, file } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const bookId = req.params?.bookId;

  const tobeUpdateBook = await Book.findOne({ _id: bookId });

  if (!tobeUpdateBook)
    res.status(401).json(new ApiError(401, "The book is not exist!!"));

  if (tobeUpdateBook?.author.toString() !== _id)
    res
      .status(403)
      .json(new ApiError(403, "You can't update the other books!!"));

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

  const updatedBook = await Book.findOneAndUpdate(
    { _id: bookId },
    {
      title,
      genre,
      coverImage: coverImageResult?.url,
      file: bookUpload?.url,
      author: _id,
    },
    { new: true }
  );

  if (!updatedBook)
    res.status(500).json(new ApiError(500, "Failed to update books!!"));

  res
    .status(201)
    .json(new ApiResponse(202, "Book updated successfully!!", updateBook));
});

const listBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();

  if (!books)
    res.status(402).json(new ApiError(402, "No any book available!!"));

  res.status(402).json(new ApiResponse(200, "All books!!", books));
});

const getOneBook = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId;

  const book = await Book.findOne({ _id: bookId });

  if (!book) res.status(402).json(new ApiError(402, "Book not found!!"));

  res
    .status(402)
    .json(new ApiResponse(200, "Book successfully fetched!!", book));
});

export { createBook, updateBook, listBooks, getOneBook };
