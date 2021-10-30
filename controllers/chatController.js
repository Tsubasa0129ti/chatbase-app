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
        var newChat = new Chat({
            channelName : req.body.channelName,
            channelDetail : req.body.channelDetail,
            createdBy : req.session.currentUser._id
        });

        newChat.save((err,chat) => {
            if(chat){
                var channelName = req.body.channelName;
                Chat.findOne({channelName:channelName})
                .then(channel =>{
                    var id = channel._id;
                    res.locals.redirect = `/chat/${id}`;
                    next();
                }).catch(err => {
                    res.locals.status = 500;
                    res.locals.redirect = "/chat";
                    next(err);
                });
            }else if(err){
                if(err.name==="MongoError"){
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
        .populate("chatData.messages")
        .exec((err,channel) =>{
            if(err){
                res.locals.redirect = "/chat";
                res.locals.status = 500;
                console.log(err.message);
                next(err);
            }else{
                res.locals.channel = channel;
                res.render("chats/channel",channel);
            }
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