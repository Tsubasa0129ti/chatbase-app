var Chat = require("../models/chat");
const createError = require('http-errors');

module.exports = {
    loginCheck : (req,res,next) => {
        if(req.isAuthenticated()){
            res.locals.username = req.user.name.first + ' ' + req.user.name.last;
            next();
        }else{
            var err = new createError.Unauthorized('please login to view this pages');
            next(err);
        }
    },
    findNew : (req,res,next) => {
        var username = res.locals.username;
        var page = req.query.page;
        if(page){
            var skipIndex = (page - 1) * 5; 
        }else{
            var skipIndex = 0;
        }

        Chat.countDocuments()
        .then((count) => {
            Chat.find().sort({updatedAt : -1}).limit(5).skip(skipIndex)
            .then((channel) => {
                res.json({
                    isLoggedIn : true,
                    username : username,
                    count : count,
                    channel : channel
                });
            }).catch((err) => {
                next(err);
            });
        }).catch((err) => {
            next(err);
        });
        
    },
    create : (req,res,next) => {
        var newChat = new Chat({
            channelName : req.body.channelName,
            channelDetail : req.body.channelDetail,
            createdBy : res.locals.username
        });

        newChat.save((err,chat) => {
            if(err){
                console.error(err.message);
                next(err)
            }else{
                if(chat){
                    Chat.findOne({channelName:newChat.channelName})
                    .then(channel =>{
                        var id = channel._id;
                        res.json({
                            redirectPath : `/chat/${id}`
                        });
                    }).catch(err => {
                        next(err);
                    });
                }
            }

        });
    },
    talk : (req,res) => {
        var username = res.locals.username;
        var id = req.params.id;
        console.log(id);
        Chat.findById(id)
        .populate("chatData.messages")
        .exec((err,channel) =>{
            if(err){
                next(err);
            }else{
                res.json({
                    isLoggedIn : true,
                    username : username,
                    channel : channel
                });
            }
        });
    },
    search : (req,res,next) => {
        var username = res.locals.username;
        var q = req.query.q;
        var sorting = req.query.sort;
        var sortVal = [{updatedAt : -1},{updatedAt : 1},{createdAt : -1},{createdAt :1}];
        var page = req.query.page;  
        var skipIndex = (page-1)*5;
    
        Chat.countDocuments({$or : [{channelName : new RegExp(".*" + q + ".*" , "i")},{channelDetail : new RegExp(".*" + q + ".*" , "i")}]})
        .then(count => {
            Chat.find({$or : [{channelName : new RegExp(".*" + q + ".*" , "i")},{channelDetail : new RegExp(".*" + q + ".*" , "i")}]})
            .sort(sortVal[sorting]).limit(5).skip(skipIndex)
            .then(channel => {
                res.json({
                    isLoggedIn : true,
                    username : username,
                    count : count,
                    channel : channel
                });
            }).catch(err => {
                next(err);
            });
        }).catch(err => {
            next(err);
        });
        
    }
}