var express = require("express");
var router = express.Router();
var passport = require("passport");

const userControllers = require("../controllers/userController");
const profileController = require("../controllers/profileController");

//以下routeing処理
router.get("/previousCheck",userControllers.preLoginCheck);
//これに関する不足点　②cookie ③エラー処理 ④バリデーション（フロントとバックの双方）
router.post("/create",userControllers.create);
//これの不足点は401のエラー取得
router.post("/auth",passport.authenticate("local"),userControllers.auth);

router.get("/logout",userControllers.logout);　//これはボタンを常時表示するので後回し

router.get("/mypage",userControllers.loginCheck,userControllers.mypageView);
router.get("/mypage/show",userControllers.loginCheck,userControllers.show);

router.get("/mypage/edit",userControllers.loginCheck,userControllers.edit);
router.put("/mypage/update",userControllers.loginCheck,userControllers.update);

router.delete("/mypage/delete",userControllers.delete,userControllers.profileDelete);

router.get("/:id",profileController.profile);

module.exports = router;