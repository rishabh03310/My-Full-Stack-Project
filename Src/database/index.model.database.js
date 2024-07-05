import {mongoose} from "mongoose";
import { DB } from "../../constants.js"
import  dotenv  from "dotenv";

dotenv.config({

   });

const connectDB = async () =>{
     try{
      const connectionInstsnce = await mongoose.connect(`${process.env.MONGODB_URI}/${DB}`)
      console.log(`\n MongoDB connected !! DB Host:${connectionInstsnce.connection.host}`);
      
     }
     catch(error){
        console.log("MongoDB connect FAILED", error);
         process.exit(1)
     }
     
}

export default connectDB