import mongoose, {Schema} from "mongoose";

const subscibtionSchema = new Schema({
    subsciber:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    channel:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},{timestamps: true})
