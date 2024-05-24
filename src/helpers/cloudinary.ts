import { v2 as cloudinary } from "cloudinary";
import { conf } from "../config/conf";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: conf.clodinary_name,
  api_key: conf.clodinary_key,
  api_secret: conf.clodinary_secret,
});

const uploadOnCloudinary = async (file: {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}) => {
  const { destination, filename, mimetype } = file;
  const formatType = mimetype?.split("/")?.at(-1);
  const filePath = path.resolve(__dirname + "./../../public/data", filename);

  try {
    if (!destination) return null;
    const response = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: formatType === "pdf" ? "all-books" : "books-cover",
      format: formatType,
    });
    fs.unlinkSync(filePath);
    return response;
  } catch (error) {
    console.log("Error of cloudinary", error);
    fs.unlinkSync(filePath); //here ,we can use also unlink but for the better to
    //to use unlinkSync to syncronisly flow.
    //it's for to remove the locally stored file if the the uploading got failed.
    return null;
  }
};

const deleteFileFromCloudinary = async (fileId: string) => {
  try {
    if (!fileId) return null;
    const response = await cloudinary.uploader.destroy(fileId);
    return response;
  } catch (error) {
    console.log("Error while delete from the ocloudinary", error);
    return null;
  }
};
export { uploadOnCloudinary, deleteFileFromCloudinary };
