var Chat = require("../models/chat");

module.exports = {
    index : (req,res) => {
        res.render("chats/index");
    },
    redirectView : (req,res,next) => {
        var redirectPath = res.locals.redirect;
        if(redirectPath){
            res.redirect(redirectPath);
        }else{
            next();
        }
    },
    guide : (req,res) => {
        res.render("chats/guide");
    },
    create : (req,res,next) => {
        console.log(req.session.currentUser[0]._id);
        var newChat = new Chat({
            channelName : req.body.channelName,
            channelDetail : req.body.channelDetail,
            createdBy : req.session.currentUser[0]._id //作成者の情報をsessionから与えるように変更
        });

        newChat.save((err,chat) => {
            if(chat){
                var channelName = req.body.channelName;
                Chat.findOne({channelName:channelName})
                .then(channel =>{
                    var id = channel._id;
                    req.flash("success","チャンネル作成に成功しました。");
                    res.locals.redirect = `/chat/${id}`;
                    next();
                }).catch(err => {
                    req.flash("error","チャンネル作成に失敗しました。");
                    res.locals.status = 500;
                    res.locals.redirect = "/chat";
                    next(err);
                });
            }else if(err){
                if(err.name==="MongoError"){
                    req.flash("error","このチャンネル名はすでに存在します。");
                    res.locals.redirect = "/chat";
                    next();
                }
            }
        });
    },
    findAll : (req,res,next) => {
        Chat.find().sort({updatedAt : -1}).limit(5)
        .then(channel => {
            res.locals.channel = channel;
            next();
        }).catch(err => {
            res.locals.redirect = "/"; //ホームに戻すかも
            res.locals.status = 500;
            console.log(err.message);
            next(err);
        });
    },
    talk : (req,res) => {
        var id = req.params.id;
        Chat.findById(id)
        .then(channel => {
            res.locals.channel = channel;
            res.render("chats/channel",channel);
        }).catch(err => {
            res.locals.redirect = "/chat";
            res.locals.status = 500;
            console.log(err.message);
            next(err);
        });
    },
    search : (req,res,next) => {
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
                res.locals.redirect = "/chat";
                res.locals.status = 500;
                console.log(err.message);
                next(err);
            });
        }).catch(err => {
            res.locals.redirect = "/chat";
            res.locals.status = 500;
            console.log(err.message);
            next(err);
        });
        
    }
}