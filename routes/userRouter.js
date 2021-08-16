var express = require("express");
var router = express.Router();

const userControllers = require("../controllers/userController");
const profileController = require("../controllers/profileController");

//以下routeing処理
router.get("/",userControllers.index);
router.get("/new",userControllers.new);
router.post("/create",userControllers.create,userControllers.redirectView);

router.get("/login",userControllers.login);
router.post("/auth",userControllers.authenticate);
router.get("/logout",userControllers.logout);

router.get("/mypage",userControllers.loginCheck,userControllers.redirectView,userControllers.mypageView);
router.get("/mypage/show",userControllers.loginCheck,userControllers.show);
router.get("/mypage/edit",userControllers.loginCheck,userControllers.redirectView,userControllers.edit);
router.put("/mypage/update",userControllers.update);
router.delete("/mypage/delete",userControllers.delete,userControllers.profileDelete);

router.get("/:id",profileController.profile);

module.exports = router;