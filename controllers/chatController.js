var Chat = require("../models/chat");

function getChatParams(body){
    return {
        channelName : body.channelName,
        channelDetail : body.channelDetail,
        createdBy : body.createdBy
    }
};

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
        let newChat = new Chat(getChatParams(req.body));
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
                    res.locals.redirect = "/chat";
                    res.locals.status = 500;
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