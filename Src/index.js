// require ('dotenv').config({path: './env'})

import dotenv from "dotenv"
// import mongoose from "mongoose";
// import{DB_Name} from "./constants";
//This code is use for the /* */ code
import connectDB from "./databass/index.js";

dotenv.config({
    path: './env'
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000)
    console.log(`server is runing at: ${process.env.PORT}`)
})

.catch((Error)=>{
    console.log("MongoDB connection failed:", Error)
})









/*
import express from "express"

const app = express()

(async ()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URL}/ ${DB_Name}`)
       application.on("error", (Error)=>{
        console.log("Error connecting to database");
        throw Error
       })

       app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
       })

    }
    catch(e){
        console.log("ERROR:", e)
        throw e
    }
})()
*/