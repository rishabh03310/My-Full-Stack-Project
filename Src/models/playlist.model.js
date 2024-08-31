import { Schema } from "mongoose";


const playlistSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        video:[{
            type: Schema.Types.ObjectId,
            ref: "Video"
        }],
        ower:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps:true
    }
)