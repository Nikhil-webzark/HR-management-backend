import {Schema,model} from "mongoose"

const eodSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    employeeName:{
        type:String,
        required:true,
        trim:true,
    },
    message:{
        type:String,
        required:true,
        trim:true,
    },
    date:{
        type:Date,
        required:true,
    },
    time:{
        type:String,
        required:true,
    },
},{timestamps:true});

const eodModel = model("EOD",eodSchema);
export default eodModel;