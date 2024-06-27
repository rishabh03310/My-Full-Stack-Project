
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoshema = new Schema({
    videofile: {
        type: String, 
        required: true,
    },
    thumbnail:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    views: {
        type: Number,
        default: 0
    },
    duration:{
        type: Number,
        required:true
    },
    isPublished:{
        type:Boolean,
        default: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},
{timestamps:true}
)

videoshema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoshema)