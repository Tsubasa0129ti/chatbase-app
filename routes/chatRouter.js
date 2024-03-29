var express = require("express");
var router = express.Router();

const chatController = require("../controllers/chatController");
const userController = require("../controllers/userController");

//チャットのメインページ
router.get("/",userController.loginCheck,chatController.findNew);
//ポップアップからの作成ページ（未完）
router.post("/create",userController.loginCheck,chatController.valueCheck,chatController.validation,chatController.valdiationCheck,chatController.create);
//これの位置を下のものよりも下げた場合、なぜか読み込まれなくなる
router.get("/search",userController.loginCheck,chatController.search);
//チャットページへのルーティング
router.get("/:id",userController.loginCheck,chatController.talk);

module.exports = router;