var express = require("express");
var router = express.Router();
const chatController = require("../controllers/chatController");
const userController = require("../controllers/userController");

//チャットのメインページ
router.get("/",userController.loginCheck,userController.redirectView,chatController.findAll,chatController.index);
//メインから飛べるガイドページ
router.get("/guide",userController.loginCheck,userController.redirectView,chatController.guide);
//ポップアップからの作成ページ（未完）
router.post("/create",userController.loginCheck,userController.redirectView,chatController.create,chatController.redirectView);
//これの位置を下のものよりも下げた場合、なぜか読み込まれなくなる
router.get("/channel",chatController.search);
//チャットページへのルーティング
router.get("/:id",userController.loginCheck,userController.redirectView,chatController.talk);

module.exports = router;