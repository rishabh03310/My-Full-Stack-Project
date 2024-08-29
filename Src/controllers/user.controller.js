import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/appError.js"
import {User} from "../models/user.model.js"
import {uploadonCloud} from "../utils/FileUpload.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

 
const generateAccessAndRefreshToken = async(userID)=>{
    try{
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ValidateBeforeSave: false})

        return {
            accessToken, 
            refreshToken
        }
    }
    catch(error){
        throw new ApiError(500, "something went wrong in Access and Refresh Token")
    }
}


const registerUser = asyncHandler (async (req , res)=>{
    
    const {username,email,FullName, password} = req.body
    // console.log("email", email);
    // console.log("username", username);

    if(
        [username,email,FullName, password].some((field)=>
        field?.trim()=== "")
    ){
        throw new ApiError(400, "Field is empty")
    }

    const existdUser = await User.findOne({
        $or:[{username}, {email}]
    })

    if(existdUser){
        throw new ApiError(409, "User is already exist")
    }


    const avatarlocalpath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    if(!avatarlocalpath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadonCloud (avatarlocalpath)
    const coverImage= await uploadonCloud(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
        username: username,
        email,
        FullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered Successfully")
    )
})


const loginUser = asyncHandler (async(req, res)=>{
        
    const {email, username, password} = req.body

    if(!(username && email)){
        throw new ApiError(400, "Username or email is requied")
    }

    const user = await User.findOne({
        $or: [{username},
             {email}]
    })

    if(!user){
        throw new ApiError(400, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordcorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Password incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options= {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged in successfully"
    ))
})

const logoutUser = asyncHandler(async(req, res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {$set: {
            refreshToken: 1
            }
        },
        {
            new: true,
        }
    )
    const options  = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken")
    .json(
            new ApiResponse(200, null || {}, "User logged out successfully")
        )
})


const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Invalid refresh token") 
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is used")
        }
  
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
        return res 
        .status (200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse (
                200, 
                {accessToken, newRefreshToken},
                "Access token generated successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refreshToken")
    }

})


const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword, confirmPassword} = req.body

    if(!(newPassword === confirmPassword)){
        throw new ApiError(400, "Passwords do not match")
    }

    const user = await User.findById(req.user._id)
    const isPasswordcorrect = await user.isPasswordcorrect(oldPassword)

    if(!isPasswordcorrect){
        throw new ApiError(401, "Old password is incorrect")
    }

    user.password = newPassword
    await user.save({ValidateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(200, req.user, "current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {FullName, email} = req.body

    if(!FullName || !email){
        throw new ApiError(400, "Please fill all fields")
    }
    const user = await User.findById(req.user?._id,
        {
            $set:{
                FullName:FullName,
                email:email
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res)=>{
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Please select an image")
    }

    const avatar = await uploadonCloud(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(500, "Failed to upload image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
                }
        },
        {new:true}
    ).select("-password")

    return res 
    .status(200)
    .json(
        new ApiResponse(200, user, "avatar  updated")
    )
})

const updateUserCoverImg = asyncHandler(async(req, res)=>{
    const coverImgLocalPath = req.file?.path
    if(!coverImgLocalPath){
        throw new ApiError(400, "Please select an image")
    }

    const cover = await uploadonCloud(coverImgLocalPath)
    if(!coverImage.url){
        throw new ApiError(500, "Failed to upload image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
                }
        },
        {new:true}
    ).select("-password")

    return res 
    .status(200)
    .json(
        new ApiResponse(200, user, "cover Img updated")
    )
})

const getUserChannelProfile = asyncHandler(async(req, res)=>{
    const {username} = req.params

    if(!username?.path()){
        throw new ApiError(400, "Invalid username")
    }

    const channel = await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from: "subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscription"
            }
        },
        {
            $lookup:{
                from:"subscription",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscriptionTo"
            }
        },
        {
            $addFields:{
                totalSubscriber:{
                    $size:"$subscription"
                },
                totalSubscriberTo:{ 
                    $size:"$subscriptionTo"
                },
                
                    isSubscribes:{
                        $cond:{
                            if:{$in: [req.user?._id, "$subscription.subscriber"]},
                            then: true,
                            else: false
                        }
                    }
            }
        },
        {
            $project:{
                FullName:1,
                username:1,
                totalSubscriber:1,
                totalSubscriberTo:1,
                isSubscribes:1,
                avatar:1,
                coverImage:1,
                email:1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(400, "channel does not exists")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel Fetched successfully")
    )
})

const getWatchHistory = asyncHandler(async(req, res)=>{
    const user = await req.user.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{ 
                from: "watchHistory",
                localField: "_id",
                foreignField: "_id",
                as: "watchHistory",

                pipeline:[{
                    $lookup:{
                        from: "videos",
                        localField: "videoId",
                        foreignField: "_id",
                        as: "video",
                        pipeline: [
                            {
                                $project:{
                                    FullName:1,
                                    username:1,
                                    avatar:1
                                }
                            },
                            {
                                $addFields:{
                                    owner:{
                                        $first: "$owner"
                                    }
                                }
                            }
                        ]
                    }
                }]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, 
        user[0].watchHistory, 
        "User watch history Fetched successfully")
    )

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateAccountDetails,
    updateUserCoverImg,
    getUserChannelProfile,
    getWatchHistory

}
