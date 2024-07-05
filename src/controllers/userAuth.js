import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import {uploadOnFirebaseStorageBucket, deleteFromFirebaseStorageBucket} from '../config/firebase.js';
import jwt from 'jsonwebtoken';


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();


        user.refreshToken = refreshToken;
        await user.save( { validateBeforeSave: false } )

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, error.message)
    }
} 

const registerUser = asyncHandler(async (req, res, next) => {
    // 0. get user data from frontend
    // 1. middleware = for input validation (check if empty, check if user already exists (check by username and email))
    // check for images (avatar)
    // upload them to cloudinary - verify that images are finally uploaded

    // 2. create user object and push to db (db.create())
    // Do not pass password and refreshToken to the user = remove them from the response
    // check for user creation (if it is created successfullly)
    // 3. return response to the frontend
    const {fullName, username, email, password, address, contactNumber } = req.body

    if ([fullName, username, email, password, address, contactNumber].some((fields) => {return fields?.trim === ""})) {
        throw new ApiError(400, "Please fill all fields")
    }

    const existedUser = await User.findOne(
        {
            $or: [
                {username}, 
                {email}
            ]
        }
    )

    if (existedUser) {
        throw new ApiError(400, "User already exists")
    }
    console.log(req.body);
    console.log(req.file);
    const profilePictureLocalPath = req.file?.path
    console.log(profilePictureLocalPath);
    if (!profilePictureLocalPath) {
        throw new ApiError(400, "Please upload a profile picture")
    } 

    const profilePictureUrl = await uploadOnFirebaseStorageBucket(profilePictureLocalPath, `/userProfilePicture/${username}`)

    if (!profilePictureUrl) {
        throw new ApiError(500, "Error occurred while uploading profile picture")
    }
    
    const user = await User.create(
        {
            fullName, 
            username: username.toLowerCase(), 
            email, 
            password, 
            profilePicture: profilePictureUrl || "", 
            address, 
            contactNumber
        }
    )
    if (!user) {
        await deleteFromFirebaseStorageBucket('/userProfilePicture', username)
    }
    console.log(user);
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Error occurred while creating user")
    }
    
    return res.status(200)
    .json(
        new ApiResponse(
            200, 
            "User created successfully", 
            createdUser
        )
    )
})

const loginUser = asyncHandler(async (req,res, next) => {
    // get the data from the user (frontend)
    // authenticate user details (username and password) (check if user exists)
    // check if password is correct
    // if not authenticated, accesstoken and refreshtoken
    // send cookies
    // return response to the frontend
    const {username, email, password} = req.body
    console.log(req.body);
    if (!username || !email) {
        throw new ApiError(400, "Please enter username and password")
    }
    const user = await User.findOne(
        {
            $or: [
                {username}, 
                {email}
            ]
        }
    )
    console.log(user)
    if (!user) {
        throw new ApiError(400, "User DNE")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    console.log(refreshToken);
    const cookieOptions = {
        httpOnly: true, 
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
    res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json( new ApiResponse(200, "User logged in successfully", loggedInUser))
})

const logoutUser = asyncHandler(async (req, res, next) => {
    // clear the cookies
    // return response to the frontend
    await User.findByIdAndUpdate(req.user._id, 
        {
            $set: {
                refreshToken: undefined
            }
        }, 
        {
            new: true
        }
    )
    const cookieOptions = {
        httpOnly: true, 
        secure: false,
    }
    res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {} ,"User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req,res, next) => {
    // get the refresh token from the request
    // check if it is valid
    // generate a new access token
    // return response to the frontend
    const incomingRefreshToken  = req.cookies
    if (!incomingRefreshToken) {
        throw new ApiError(400, "Please provide a refresh token")
    }

    try {
        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (!decodedToken) {
            throw new ApiError(400, "Invalid refresh token")
        }
        const user = await User.findById(decodedToken._id)
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(400, "Invalid refresh token")
        }
        const cookieOptions = {
            httpOnly: true,
            secure: false
        }
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(new ApiResponse(200, 
            {accessToken, newRefreshToken},
            "Access token refreshed successfully"))
    } catch (error) {
        throw new ApiError(400, error.message || "Error occurred while refreshing access token")
    }
})

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user._id)
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password")
    }   
    user.password =  newPassword
    await user.save( {validateBeforeSave: false} )

    return res.status(200)
    .json(
        new ApiRresponse(
            200, 
            {}, 
            "Password changed Successfully"
        )
    )

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
    .json(
        new ApiRresponse(
            200, 
            req.user, 
            "Current User fetched Successfully"
        )
    )
})

const   updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullName, email, } = req.body
    if (!fullName && !email) {
        throw new ApiError(400, "All fields are requried")
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName, 
                email: email
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    return res.status(200)
    .json(
        new ApiRresponse(
            200, 
            user, 
            "Account details updated successfully"
        )
    )

})

const updateProfilePicture = asyncHandler(async(req,res, next) => {
    
    const userWithOldProfilePicture = await User.findById(req.user._id).select("-password -refreshToken")
    if (!userWithOldProfilePicture || !userWithOldProfilePicture.profilePicture) {
        throw new ApiError(400, "User not found")
    }
    const oldProfilePictureUrl = userWithOldProfilePicture.profilePicture
    console.log("Old profile picture url: ", oldProfilePictureUrl);
    const username = userWithOldProfilePicture.username
    const deletedOldProfilePicture = await deleteFromFirebaseStorageBucket('/userProfilePicture', username)
    if (!deletedOldProfilePicture) {
        throw new ApiError(500, "Error occurred while deleting old profile picture")
    }
    console.log("Old Profile Picture Url: ", oldProfilePictureUrl);
    console.log("Old profile picture deleted successfully", deletedOldProfilePicture);
    // GET THE NEW PROFILE PICTURE
    // UPLOAD THE NEW PROFILE PICTURE
    const profilePictureLocalPath = req.files?.profilePicture[0].path
    if (!profilePictureLocalPath) {
        throw new ApiError(400, "Please upload a profile picture")
    }
    const newProfilePictureUrl = await uploadOnFirebaseStorageBucket(profilePictureLocalPath, '/userProfilePicture/${username}')
    if (!newProfilePictureUrl) {
        throw new ApiError(500, "Error occurred while uploading new profile picture")
    }
    const user = await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {
                profilePicture: newProfilePictureUrl
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    return res.status(200)
    .json(
        new ApiResponse(
            200, 
            user, 
            "Profile picture updated successfully"
        )
    )
})

export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateProfilePicture
}