const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    passport = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new Schema(
    {
        name : {
            first : {
                type : String,
                trim : true
            },
            last : {
                type : String,
                trim : true
            }       
        },
        email : {
            type : String,
            unique : true
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