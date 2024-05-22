import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


type User = {
    username: string,
    email: string,
    password:string
}

 const registerHandler = asyncHandler(async (req, res) => {
     const data:User = await req.body;
     console.log("body data",data)
     if (data.password.length > 3) {
         console.log("::::::::in the error block:::::")
       throw new ApiError(200,"password error work")
     }
    res.status(200).json(new ApiResponse(200,"it's work",data))
 })

const signInHandler = asyncHandler(async (req, res) => {
     const data:User = await req.body;
     console.log("body data",data)
    res.status(200).json(new ApiResponse(200,"sign in work",data))
 })

export { registerHandler, signInHandler };