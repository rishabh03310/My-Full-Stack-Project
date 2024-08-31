import mongoose from "mongoose"


const postSchama = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        image: {
            type: String,
        },
        ower: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true
    }
)

export const Post = mongoose.model("Post", postSchama)