import mongoose from "mongoose";

import { DB_Name } from "../constants.js"

const connectDB = async () =>{
     try{
        const ConnectResponse= await mongoose.connect(`${process.env.MONGODB_URI}/ ${ DB_Name }`)
        console.log(`\n MongoDB connected !! DB Host:${ConnectResponse.connection.host}`);
     }
     catch(error){
        console.log("MongoDB connect FAILED", error);
        process.exit(1)
     }
}

export default connectDB