import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler( async (req, res, next) => {
    try {
        const token = req.cookies || req.header("Authorization")?.replace("Bearer", " ")
        if (!token) {
            throw new ApiError(401, "Access unauthorized")
        }
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // now we have decoded data (info of the user) in an object
        const user = await User.findById(
            decodedToken?._id
        )
        if (!user) {
            throw new ApiError(400, "No User found")
        }
        req.user = user;
        next()
    } catch (error) {
        console.log("Auth middleware error: ", error);
        throw new ApiError(500, error?.message || "Invalid access token")
    }
})