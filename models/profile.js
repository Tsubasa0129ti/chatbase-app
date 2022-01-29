var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var profileSchema = new Schema(
    {
        intro : {
            type : String,
        },
        country : {
            type : String
        },
        address : {
            type : String,　//API（このアプリは適用しないかもだが）
        },
        professional : {
            type : String
        },
        site : {
            type :String
        },
        gender : {
            type : String
        },
        age : {
            type: String
        },
        birthday : {
            type : String
        },
        
    }
);

module.exports = mongoose.model("Profile",profileSchema);



