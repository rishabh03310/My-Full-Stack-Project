import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/appError.js"
import {User} from "../models/user.model.js"
import {uploadonCloud} from "../utils/FileUpload.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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

    const existdUser = await User.find({
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
    const coverImage= await uploadonCloud(coverImagelocalpath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
        username: username.tolowercase(),
        email,
        FullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
    })

    const createdUser = await user.findbyId(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered Successfully")
    )



})

export {
    registerUser,
}
