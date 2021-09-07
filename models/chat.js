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
        createdBy : {
            type : String,
            required : true
        },
        users : [{
            type : Schema.Types.ObjectId,
            ref : "User"
        }],
        chatData : [{
            date : {
                type : String,
                required : true,
                unique : true
            },
            messages : [{
                userId : {
                    type : String,
                    required : true
                },
                username : {
                    type : String,
                    required : true
                },
                text : {
                    type : String,
                    required : true
                },
                time : {
                    type : String,
                    required : true
                },
                customId : {
                    type : String,
                    required : true
                }
            }]
        }]
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model("Chat",chatSchema);