const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

//スキーマの作成
var chatSchema = new Schema(
    {
        channelName : {
            type : String,
            required : true,
            unique : true
        },
        channelDetail : {
            type : String,
            required : true
        },
        user : [{
            type : Schema.Types.ObjectId,
            ref : "User"
        }],
        messages : [{
            userName : {
                type : String,
                required : true
            },
            user : {
                type : String,
                required : true
            },
            text : {
                type : String,
                required : true
            },
            getTime : {
                day : {
                    type : String
                },
                time : {
                    type : String
                }
            },
            customId : {
                type : String
            }
        }],
        createdBy : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
);


module.exports = mongoose.model("Chat",chatSchema);