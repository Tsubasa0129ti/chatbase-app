var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var profileSchema = new Schema(
    {
        intro : {
            type : String,
        },
        prefecture : {
            type : String,
        },
        address : {
            type : String,　//API（このアプリは適用しないかもだが）
        },
        birthday : {
            type : String
        },
        belongings : {
            type : String,
        }
    }
);

module.exports = mongoose.model("Profile",profileSchema);



