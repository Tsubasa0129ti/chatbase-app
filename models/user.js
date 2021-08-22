const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    passport = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new Schema(
    {
        name : {
            first : {
                type : String,
                trim : true,
                required : [true,"名字を入力してください。"]
            },
            last : {
                type : String,
                trim : true,
                required : [true,"名前を入力してください。"]
            }       
        },
        email : {
            type : String,
            required : [true,"E-mailを記入してください。"],
            unique : true
        },
        age : {
            type : Number,
            min : 15,
            max : 100
        },
        profile : {
            type : Schema.Types.ObjectId,
            ref : "Profile"
        }
    },
    {
        timestamps:true
    }
);

userSchema.virtual("fullName").get(function(){
    return this.name.first + "_" + this.name.last;
});

userSchema.plugin(passportLocalMongoose,{
    usernameField : "email"
});

module.exports = mongoose.model("User",userSchema);