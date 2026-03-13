import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username:{
            type:String,
            unique:[true,"Username is already taken"],
            required:true
        },
        email:{
            type:String,
            unique:[true,"Email is already registered"],
            required:true
        },
        password:{
            type:String,
            required:[true,"Password is required"]
        }
    },
    {timestamps:true}
)

const userModel = mongoose.model("users",userSchema)
export {userModel}