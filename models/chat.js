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
                type : Schema.Types.ObjectId,
                ref : "Message"
            }]
        }]
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model("Chat",chatSchema);