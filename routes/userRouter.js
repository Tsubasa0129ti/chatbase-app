var express = require("express");
var router = express.Router();
var passport = require("passport");

const userControllers = require("../controllers/userController");
const profileController = require("../controllers/profileController");

//以下routeing処理
router.get("/",userControllers.index); //1 ok
router.get("/new",userControllers.new); //2 ok
router.post("/create",userControllers.create,userControllers.cookie,userControllers.redirectView);

router.get("/login",userControllers.login);
router.get("/auth",userControllers.authenticate,userControllers.regenerateSessionId);
router.get("/logout",userControllers.logout);

router.get("/mypage",userControllers.loginCheck,userControllers.redirectView,userControllers.mypageView);
router.get("/mypage/show",userControllers.loginCheck,userControllers.show);
router.get("/mypage/edit",userControllers.loginCheck,userControllers.redirectView,userControllers.edit);
router.put("/mypage/update",userControllers.update);
router.delete("/mypage/delete",userControllers.delete,userControllers.profileDelete);

router.get("/:id",profileController.profile);

module.exports = router;