var express = require("express");
var router = express.Router();
var passport = require("passport");

const userControllers = require("../controllers/userController");
const profileController = require("../controllers/profileController");

//以下routeing処理
router.get("/previousCheck",userControllers.preLoginCheck);
//これに関する不足点　④バリデーション（バックエンド）
router.post("/create",userControllers.create);

router.post("/auth",passport.authenticate("local"),userControllers.auth,userControllers.regenerateSessionId);

router.get("/logout",userControllers.logout);　

router.get("/mypage",userControllers.loginCheck,userControllers.mypageView);
router.get("/mypage/show",userControllers.loginCheck,userControllers.show);

router.get("/mypage/edit",userControllers.loginCheck,userControllers.edit);
router.put("/mypage/update",userControllers.loginCheck,userControllers.update);

router.delete("/mypage/delete",userControllers.delete,userControllers.profileDelete);

router.get('/session',(req,res,next) => {
    /* req.session.touch();
    console.log(`expires3 : ${req.session.cookie.expires}`); */

    var time = 30*1000
    req.session.cookie.maxAge = time;

    res.json({
        session : req.session
    });
    
})

module.exports = router;