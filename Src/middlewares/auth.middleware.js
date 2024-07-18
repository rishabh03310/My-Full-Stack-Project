import { verifyJWT } from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import { User } from "../models/user.model";
import { ApiError } from "../utils/appError";


export const verifyJWT = asyncHandler(async(req, _, next)=>{
    
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace(  "Bearer ", "") || res.status(401).json({message: "Unauthorized"})

    if(!token){
        throw ApiError(401, "Unauthorized")
    }
    const decodedToken = JsonWebTokenError.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select( "-password -refreshToken" )
    if(!user){
        throw ApiError(401, "Invalid Access")
    }

    req.user = user;
    next()
    }
    catch(err){
        throw ApiError(401, err?.message || "Unauthorized access Token") 
    }


})