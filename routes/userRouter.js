var express = require("express");
var router = express.Router();
var passport = require("passport");

const userControllers = require("../controllers/userController");
const profileController = require("../controllers/profileController");

//以下routeing処理
router.get("/loginCheck",userControllers.loginCheck,userControllers.resLoggedIn); //ここはreact側もOK ただし、headerは修正必須
router.post("/create",userControllers.checkBody,userControllers.createValidation,userControllers.create);

router.post("/auth",passport.authenticate("local"),userControllers.auth,userControllers.regenerateSessionId);

router.get("/logout",userControllers.logout);　

router.get("/mypage",userControllers.loginCheck,userControllers.mypageView);

router.get("/mypage/edit",userControllers.loginCheck,userControllers.edit);
router.put("/mypage/update",userControllers.loginCheck,userControllers.checkBody,userControllers.updateValidation,userControllers.update);

router.delete("/mypage/delete",userControllers.loginCheck,userControllers.delete,userControllers.profileDelete);

module.exports = router;