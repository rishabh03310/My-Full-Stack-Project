import {asyncHandler} from "../utils/asyncHandler.js";

const registerUser = asyncHandler (async (error, req , res, next)=>{
    res.status(200).json({
        Message: "Ok"
    })
}
)

export {registerUser}
