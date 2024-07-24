import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/appError.js"
import {User} from "../models/user.model.js"
import {uploadonCloud} from "../utils/FileUpload.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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
            refreshToken: undefined
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




export {
    registerUser,
    loginUser,
    logoutUser
}
