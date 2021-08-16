var Chat = require("../models/chat");
const getChatParams = body => {
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
    create : (req,res) => { //モーダル上の作成のため、一応これでよいはず。メソッドの間違いはあるかもしれないけど。flashと閉じるタイミングに注視
        let newChat = new Chat(getChatParams(req.body));
        newChat.save((err) => {
            if(!err){
                req.flash("success","チャンネルの作成ができました。");
            }else{
                req.flash("error","チャンネルの作成に失敗しました。");
                throw err;
            }
        });
    },
    findAll : (req,res,next) => {
        Chat.find().sort({updatedAt : -1}).limit(5)
        .then(channel => {
            res.locals.channel = channel;
            next();
        }).catch(err => {
            console.log(err.message);
        });
    },
    talk : (req,res) => {
        var id = req.params.id;
        Chat.findById(id)
        .then(channel => {
            res.locals.channel = channel;
            res.render("chats/channel",channel);
        }).catch(err => {
            res.send(err);
        });
    }
}


