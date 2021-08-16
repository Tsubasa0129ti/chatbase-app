var express = require("express");
var router = express.Router();
const chatController = require("../controllers/chatController");
const userController = require("../controllers/userController");

var Chat = require("../models/chat");

//チャットのメインページ
router.get("/",userController.loginCheck,userController.redirectView,chatController.findAll,chatController.index);
//メインから飛べるガイドページ
router.get("/guide",userController.loginCheck,userController.redirectView,chatController.guide);
//ポップアップからの作成ページ（未完）
router.post("/create",chatController.create); //ここに関しては一応できたけれど、flashに不具合が発生　+ エラーの際にウィンドウを開いたままにしたい
//これの位置を下のものよりも下げた場合、なぜか読み込まれなくなる
router.get("/channel",(req,res) => {
    var q = req.query.search;
    var sorting = req.query.sort;
    var sortVal = [{updatedAt : -1},{updatedAt : 1},{createdAt : -1},{createdAt :1}];
    var page = req.query.page;  
    var skipIndex = (page-1)*5;

    Chat.countDocuments({$or : [{channelName : new RegExp(".*" + q + ".*" , "i")},{channelDetail : new RegExp(".*" + q + ".*" , "i")}]})
    .then(count => {
        res.locals.count = count;
        Chat.find({$or : [{channelName : new RegExp(".*" + q + ".*" , "i")},{channelDetail : new RegExp(".*" + q + ".*" , "i")}]})
        .sort(sortVal[sorting]).limit(5).skip(skipIndex)
        .then(channel => {
            res.locals.channel = channel;
            res.render("chats/result",channel);
        }).catch(err => {
            console.log(err.message);
        });
    }).catch(err => {
        console.log(err);
    });
    
});
//チャットページへのルーティング
router.get("/:id",userController.loginCheck,userController.redirectView,chatController.talk);

//一時的


module.exports = router;