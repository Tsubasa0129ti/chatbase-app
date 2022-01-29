var express = require("express");
var router = express.Router();

const userControllers = require("../controllers/userController");

//以下routeing処理
router.get("/loginCheck",userControllers.isAuthenticated);
router.get("/setLoggedIn",userControllers.setLoggedIn);
router.post("/create",userControllers.checkBody,userControllers.nameValidation,userControllers.validation,userControllers.validationCheck,userControllers.create);

router.post("/auth",userControllers.auth,userControllers.regenerateSessionId);
router.get("/logout",userControllers.logout);　

router.get("/mypage",userControllers.loginCheck,userControllers.mypageView);

router.get("/mypage/edit",userControllers.loginCheck,userControllers.edit);
router.put("/mypage/update",userControllers.loginCheck,userControllers.checkBody,userControllers.nameValidation,userControllers.validationCheck,userControllers.update);

router.delete("/mypage/delete",userControllers.loginCheck,userControllers.delete,userControllers.profileDelete);

module.exports = router;