import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/appError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloud} from "../utils/FileUpload.js"
import mongoose, { isValidObjectId } from "mongoose"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //get all videos based on query, sort//
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    //get video, upload to cloudinary, create video//
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //get video by id//
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //update video details like title, description, thumbnail//

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}