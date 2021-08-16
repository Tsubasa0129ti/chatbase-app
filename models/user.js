/* モジュールのロード */
const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    passport = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose");

/* スキーマの作成 */
var userSchema = new Schema(  //スキーマ内のバリデーション機能でエラーログの出力をもう少し見直す
    {
        //具体的なカラムの追加
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
        profile : { //単数のため、配列形式ではない
            type : Schema.Types.ObjectId,
            ref : "Profile"
        }
    },
    {
        timestamps:true
    }
);

/* その他設定 */
userSchema.virtual("fullName").get(function(){
    return this.name.first + "_" + this.name.last;
});

userSchema.plugin(passportLocalMongoose,{
    usernameField : "email"
});

module.exports = mongoose.model("User",userSchema);