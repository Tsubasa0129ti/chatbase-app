var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var sessionSchema = new Schema(
    {

    }
);

module.exports = mongoose.model("session",sessionSchema);