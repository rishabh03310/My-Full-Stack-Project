import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
}))   // this is the midllea

app.use(express.json({limit: "20kb"})) //json file data take and upload in json formate.//

app.use(express.urlencoded({extended:true, limit: "20kb"}))//URL file data take and upload in URL formate//

app.use(express.static("Public"))// this take the images like fill//

app.use(cookieParser())


//Routes import

import userRouter from "./src/routes/User.routes.js"

//Routes declaration
app.use('/api/v1/user', userRouter) // this is the route for user


//  http://localhost:port/api/v1/users/register


export {app}