import mongoose, {Schema} from "mongoose";
// import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt";

const usershema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim: true,
            index: true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim: true,
        },
        FullName:{
            type:String,
            required:true,
            trim: true,
            index: true
        },
        avatar:{
            type:String,
            required: true
        },
        coverImage:{
            type:String,
        },
        watchHistory:{
            type: Schema.Types.ObjectId,
            ref: 'Video'
        },
        password:{
            type:String,
            required: [true, "Password is required"]
        },
        refreshToken:{
            type:String,
        }
    },
    {timestamps: true}
)

//Creating Password incryption with halp of bcrypt, this is storing the password in hash form in the database v.

usershema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

usershema.methods.isPasswordcorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

usershema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        FullName:this.FullName,
    },
        process.env. ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIREY
        }   
)
}

usershema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        FullName:this.FullName,
    },
        process.env. REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIREY
        }   
)
}

export const User = mongoose.model("User", usershema)