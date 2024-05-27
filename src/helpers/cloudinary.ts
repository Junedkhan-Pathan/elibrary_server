import { v2 as cloudinary } from "cloudinary";
import { conf } from "../config/conf";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: conf.clodinary_name,
  api_key: conf.clodinary_key,
  api_secret: conf.clodinary_secret,
});

const uploadOnCloudinary = async (filename: string, format: string) => {
  const filePath = path.resolve(__dirname, "./../../public/data", filename);

  const opt: any = {
    use_filename: true,
    filename_override: filename,
    folder: format === "pdf" ? "all-books" : "books-cover",
    format,
  };

  if (format === "pdf") opt.resource_type = "raw";

  try {
    if (!filePath) return null;
    const response = await cloudinary.uploader.upload(filePath, opt);
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

const deleteFileFromCloudinary = async (filestring: string) => {
  const getPublicId = filestring?.split("/").at(-1);
  const [fileName, format] = getPublicId?.split(".") as string[];
  const publicId =
    format === "pdf" ? `all-books/${getPublicId}` : `books-cover/${fileName}`;
  try {
    if (!getPublicId) return null;
    const response =
      format === "pdf"
        ? await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw",
          })
        : await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
    return response;
  } catch (error) {
    console.log("Error while delete from the ocloudinary", error);
    return null;
  }
};
export { uploadOnCloudinary, deleteFileFromCloudinary };
