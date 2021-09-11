var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = new Schema(
    {
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
        date : {
            type : String,
            required : true
        },
        time : {
            type : String,
            required : true
        },
        customId : { //これに関しては、使わなければ消す
            type : String,
            required : true
        }
    }
)

module.exports = mongoose.model("Message",messageSchema);