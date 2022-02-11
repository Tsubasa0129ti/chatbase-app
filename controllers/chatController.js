var Chat = require("../models/chat");
var {check,validationResult} = require("express-validator");
const createError = require('http-errors');

function getNewChannel(body,user){
    return {
        channelName : body.channelName,
        channelDetail : body.channelDetail,
        createdBy : user._id 
    }
}

//各controllerでuseridとusernameが必要かどうかを判定（）

//コントローラーの不側点　③sortの引数がundefinedの時の対策（実用面は問題なし）　

const isEmpty = (obj) => {
    return !Object.keys(obj).length;
};

module.exports = {
    findNew : async(req,res,next) => {
        try{
            var page = req.query.page;
            if(page){
                var skipIndex = (page - 1) * 5;
            var skipIndex = (page - 1) * 5; 
                var skipIndex = (page - 1) * 5;
            var skipIndex = (page - 1) * 5; 
                var skipIndex = (page - 1) * 5;
            }else{
                var skipIndex = 0;
            }
            var count = await Chat.countDocuments().exec();
            var channel = await Chat.find().sort({updatedAt : -1}).limit(5).skip(skipIndex).exec();

            res.json({
                count : count,
                channel : channel
            });
        }catch(err){
            next(err);
        }
        
    },
    valueCheck : (req,res,next) => {
        var err = new createError.BadRequest();

        if(isEmpty(req.body)){
            return next(err);
        }

        var array = Object.values(req.body);

        for(var i=0;i<array.length;i++){
            var value = array[i];
            if(value){
                return next();
            }else{
                if(i === array.length -1){ 
                    return next(err);
                }
            }
        }
    },
    validation : [
        check("channelName")
            .notEmpty().withMessage('チャンネル名を記入してください。')
            .isLength({min:1,max:30}).withMessage('チャンネル名は1文字以上30字以内で設定してください。')
            .custom(value => {
                return Chat.findOne({channelName : value}).then(channel => {
                    if(channel){
                        return Promise.reject('this channelName has already existed');
                    }
                    return true;
                })
            }),
        check("channelDetail")
            .isLength({min:0,max:100}).withMessage('チャンネル詳細は100文字以内で設定してください。'),
    ],
    valdiationCheck : (req,res,next) => {
        try{
            const err = validationResult(req);
            if(!err.isEmpty()){
                return next(err);
            }
            next();
        }catch(err){
            next(err);
        }
    },
    create : async(req,res,next) => {
        try {
            var newChat = getNewChannel(req.body,req.user);
            console.log(newChat);
            var channel = await Chat.create(newChat);
            
            res.json({
                redirectPath : `/chat/page/${channel._id}`
            });
        }catch(err){
            next(err);
        }
    },
    talk : async(req,res,next) => { //もしセッションからデータの獲得ができるのであれば、コンポーネントで使用しているid以外は不要になるかも
        try{
            var userId = req.user._id;
            var username = req.user.name.first + ' ' + req.user.name.last;
            var id = req.params.id;

            var channel = await Chat.findById(id).populate("chatData.messages").exec();
            res.json({
                userId : userId,
                username : username,
                channel : channel
            });
        }catch(err){
            next(err);
        }
    },
    search : async(req,res,next) => { //ここについての注意したいポイント　sortの引数がundefindの時の扱い おそらく作成古い順に設定されている、
        try{
            var q = req.query.q;
            var sorting = req.query.sort;
            var sortVal = [{updatedAt : -1},{updatedAt : 1},{createdAt : -1},{createdAt :1}];
            var page = req.query.page;  
            var skipIndex = (page-1)*5;

            var count = await Chat.countDocuments(
                {$or : [
                    {channelName : new RegExp(".*" + q + ".*" , "i")},
                    {channelDetail : new RegExp(".*" + q + ".*" , "i")}
                ]}
            ).exec();

            var channel = await Chat.find(
                {$or : [
                    {channelName : new RegExp(".*" + q + ".*" , "i")},
                    {channelDetail : new RegExp(".*" + q + ".*" , "i")}
                ]}
            ).sort(sortVal[sorting]).limit(5).skip(skipIndex);

            res.json({
                count : count,
                channel : channel
            });
        }catch(err){
            next(err);
        }
        
    }
}