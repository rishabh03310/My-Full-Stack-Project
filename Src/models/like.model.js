import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    video:{
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    likedBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
},{timestamps:true})

export const Like = mongoose.model("Like", likeSchema)