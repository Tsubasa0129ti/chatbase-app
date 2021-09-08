var express = require("express");
var router = express.Router();

var indexController = require("../controllers/index");
var sessionModel = require("../models/session");

router.get("/",indexController.index);

router.get("/a",(req,res,next) => {
    var err = new Error();
    console.log("ssss");
    res.status(500);
    res.locals.status = 500; //仮　エラー時にlocal変数として、ステータスコードを書き込んでおく
    next(err);
});

router.get("/b",(req,res,next) => { //カート機能の作成例　一応sessionの時間設定の分離等ができるかは不明段階ではあるけど、session内に配列を用意してpushをすれば複数のデータを所有できるようになる
    /* req.session.cart = [];
    if(req.session.passport){ //カートの作成を自動的に行えていないという欠点がある
        var cart = req.session.cart || [];
        cart.push("item1");   
    } */
    /* var limit = req.session.cookie.expires;
    var str = limit.toLocaleString();
    //console.log(`1:${req.session}`);
    req.session.regenerate(function(err){
        if(err){
            console.log(err.message);
        }
        console.log(req.session);
    });
    res.send(str); */
    /* var sessions = {}
    for(var key in req.session){
        sessions[key] = req.session[key];
    } */

    /* req.session.regenerate(function(err){
        if(err){
            console.log(err.message);
            return;
        }
        for(var key in sessions){
            req.session[key] = sessions[key];
        }
        console.log(req.session);
        req.session.name = "namemfmfmfmf" ;
    }); */

    

    /* req.session.touch(function(err){
        if(err){
            console.log(err.message);
        }
        req.session.cookie.expires = 
    }) */
    var hour = 3600000 
    req.session.cookie.expires = new Date(Date.now() + hour);
    res.send(req.session);
}); //post処理にして、データを受け取るようにすれば、カートシステムの作成ができる

router.get("/c",(req,res,next) => {
    //sessionの再生成を行う
    var sessions = {}
    for(var key in req.session){
        sessions[key] = req.session[key];
    }
    console.log(sessions);

    //dreq.session.destroy();
    req.session.regenerate(function(err){
        if(err){
            console.log(err.message);
        }
        for(var key in sessions){
            req.session[key] = sessions[key];
        }
        res.send(req.session);
    });   
    
});

module.exports = router;