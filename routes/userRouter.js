var express = require("express");
var router = express.Router();
var passport = require("passport");

const userControllers = require("../controllers/userController");
const profileController = require("../controllers/profileController");

//以下routeing処理
router.get("/",userControllers.index); //1 ok
router.get("/new",userControllers.new); //2 ok
//router.post("/create",userControllers.create,userControllers.cookie,userControllers.redirectView);

//これに関する不足点　②cookie ③エラー処理 ④バリデーション（フロントとバックの双方）
router.post("/create",(req,res) => {
    var newUser = new User(req.body);
    //この情報から、アカウントの作成をする
    User.register(newUser,req.body.password,(err,user) => { //newUserを登録するということにする
        if(user) {
            res.json({
                redirectPath : "/users",
                result : "success"
            });
        }else if(err){
            console.log(err.message);
            res.json({
                redirectPath : "/users/new",
                result : err
            });
        }
    });
});

router.get("/login",userControllers.login);　//これに関してはformの用意
router.get("/auth",userControllers.authenticate,userControllers.regenerateSessionId);//postでの送信を上と同様に行う
router.get("/logout",userControllers.logout);　//これはボタンを常時表示するので後回し

router.get("/mypage",userControllers.loginCheck,userControllers.redirectView,userControllers.mypageView);
router.get("/mypage/show",userControllers.loginCheck,userControllers.show);
router.get("/mypage/edit",userControllers.loginCheck,userControllers.redirectView,userControllers.edit);
router.put("/mypage/update",userControllers.update);
router.delete("/mypage/delete",userControllers.delete,userControllers.profileDelete);

router.get("/:id",profileController.profile);

module.exports = router;