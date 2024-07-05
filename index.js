// require ('dotenv').config({path: './env'})

import dotenv from "dotenv";
import connectDB from "./src/database/index.model.database.js";
import { app } from "./app.js";
import express from "express"


dotenv.config({
    path: './env'
})

connectDB()

const port = process.env.PORT || 8000

.then(()=>{
    app.listen(port, ()=>{
    console.log(`server is runing at: ${port}`)

    })
})

.catch((Error)=>{
    console.log("MongoDB connection failed:", Error);
})









/*
// import mongoose from "mongoose";
// import{DB_Name} from "./constants";


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