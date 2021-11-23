var express = require("express");
var router = express.Router();
const chatController = require("../controllers/chatController");
const userController = require("../controllers/userController");

//チャットのメインページ
router.get("/",chatController.loginCheck,chatController.findNew);
//ポップアップからの作成ページ（未完）
router.post("/create",chatController.loginCheck,chatController.create);
//これの位置を下のものよりも下げた場合、なぜか読み込まれなくなる
router.get("/search",chatController.loginCheck,chatController.search); //ok
//チャットページへのルーティング
router.get("/:id",userController.loginCheck,chatController.talk);

module.exports = router;