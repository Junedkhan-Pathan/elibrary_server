import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import User, { IUser } from "./userModel";
import bcryptjs from "bcryptjs";

type User = {
  username: string;
  email: string;
  password: string;
};

//Register user...
const registerHandler = asyncHandler(async (req, res) => {
  const { username, email, password } = await req.body;

  if ([username, email, password].some((field) => field.trim() === ""))
    res.status(403).json(new ApiError(403, "All field required"));

  const isUserExist = await User.findOne({ email });

  if (isUserExist)
    res
      .status(409)
      .json(new ApiError(403, "User already exist with this email"));

  const hashPassword = await bcryptjs.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });

  const isUserCrated = await User.findById(user._id).select("-password");

  if (!isUserCrated)
    res.status(501).json(new ApiError(501, "User registration failed!!"));

  res
    .status(201)
    .json(new ApiResponse(201, "User created successfully!!", isUserCrated));
});

//user signin...
const signInHandler = asyncHandler(async (req, res) => {
  const { username, email, password } = await req.body;

  if (!(username || email) || !password)
    res.status(403).json(new ApiError(403, "Credential is required!!"));

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user)
    res
      .status(403)
      .json(new ApiError(403, "User not exist with this credential!!"));

  const isPasswordCorrect = await user!.isPasswordCorrect(password);
  if (!isPasswordCorrect)
    res.status(401).json(new ApiError(403, "Password is incorrect!!"));

  const accessToken = await user!.generateAccessToken();

  const userData = await User.findById({ _id: user?._id }).select("-password");

  res
    .cookie("token", accessToken)
    .status(200)
    .json(
      new ApiResponse(200, "Loggedin successfully!!", {
        userData,
        token: accessToken,
      })
    );
});

export { registerHandler, signInHandler };
