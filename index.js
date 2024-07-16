// require ('dotenv').config({path: './env'})

import dotenv from "dotenv";
import connectDB from "./src/database/index.model.database.js";
import { app } from "./app.js";
import express from "express"


dotenv.config({
    path: './.env'
})

connectDB()



.then(()=>{
    const port = process.env.PORT || 8000
    app.listen(port, ()=>{
    console.log(`server is runing at:${port} `)

    })
})

.catch((Error)=>{
    console.log("MongoDB connection failed:", Error);
})

