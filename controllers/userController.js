const User = require("../models/user"),
    Profile = require("../models/profile"),
    passport = require("passport"),
    createError = require("http-errors"); 


/* function asyncWrap(fn) {
    return (req, res, next) => {
        return fn(req, res, next)
        .catch((error) => {
            next(error || 'ERROR IS NULL');
        });
    };
} */

/* 基本的にapp.jsのエラーハンドリングに到達するのは、next(err)であり、createError()をしているものは、その場で完結する。はず。。。 */

module.exports = {
    preLoginCheck : (req,res,next) => {//ログインページを修正する必要はあるものの、ここはとりあえずOK
        try{
            const loggedIn = req.isAuthenticated();
            if(loggedIn){
                var user = req.user;
                const username = user.name.first + ' ' + user.name.last;
                res.json({
                    result : 'Authenticated',
                    username : username,
                    redirectPath : '/users/mypage'
                });
            }else{
                var err = new createError.Unauthorized(); //後にreactを大幅に変える必要があるけど、一旦これに関してはOK　loginページが使えなくなった笑
                next(err);
            }
        }catch(err){
            console.log("koko");
            next(err);
        }
    },
    create : (req,res,next) => { //これは後テストをする。目的は、エラーの分岐を増やす　改善の余地あり
        try{
            var newUser = new User(req.body);
            User.register(newUser,req.body.password,(err,user) => {
                if(err){
                    return next(err);
                }else if(user){
                    res.json({
                        redirectPath : '/users/login'
                    });
                }
            });
        }catch(err){
            next(err);
        }
    },//テスト一覧　①通常のバリデーション　②required ③空白　④重複禁止　⑤500番台（これは普通に無理かも） ちなみにcreate自体はOK 値がおかしい場合のエラーに関しては、ここにいく前に処理されるようになっているな
    auth : (req,res,next) => {　//ここ何しているの。。。？
        next();
    },
    regenerateSessionId : (req,res,next) => { //ここもいまいちうまく機能していないので一旦飛ばす
        var sessions = {};
        for(var key in req.session){
            sessions[key] = req.session[key];
        }
        req.session.regenerate(function(err){
            if(err){
                next(err);
            }
            for(var key in sessions){
                req.session[key] = sessions[key];
            }
            
            User.findOne({email : req.session.passport.user})
            .then((user) => {
                req.session.currentUser = user;
                res.json({
                    redirectPath : '/users/mypage'
                });
            }).catch((err) => {
                next(err);
            })
        });
    },
    logout : (req,res) => { //OK
        try{
            req.logout();
            req.session.destroy();
            res.json({
                redirectPath : "/"
            });
        }catch(err){
            next(err);
        }
    },
    loginCheck : (req,res,next) => {//OK
        try{
            const loggedIn = req.isAuthenticated();
            if(loggedIn){
                next();
            }else{
                var err = new createError.Unauthorized();
                next(err);
            }
        }catch(err){
            next(err);
        }
    },
    mypageView : async(req,res,next) => { //OK
        try{
            var user = req.user;
            if(user.profile === undefined){
                const promise = await User.findById(user._id).exec();
                res.json({
                    profile : false,
                    user : promise
                });
            }else{
                const promise = await User.findById(user._id).populate("profile").exec();
                res.json({
                    profile : true,
                    user : promise
                });
            }
        }catch(err){
            console.log('pass');
            next(err);
        }
    },
    edit : async(req,res,next) => {//OK
        try{
            var currentUser = req.user;
            const user = await User.findById(currentUser._id).exec();
            res.json({
                name : user.name
            });
        }catch(err){
            next(err)
        }
    },
    update : async(req,res,next) => {//OK
        try{
            var currentUser = req.user;
            const promise = await User.findByIdAndUpdate(currentUser._id,{
                $set : req.body
            });
            console.log(promise);
            res.json({
                redirectPath : '/users/mypage'
            });
        }catch(err){
            next(err);
        }
    },
    delete : async(req,res,next) => {//OK
        try{
            var userId = req.user._id;     
            const promise = await User.findByIdAndDelete(userId);
            console.log(promise);
            next();
        }catch(err){
            next(err);
        }
    },
    profileDelete : async(req,res) => {//OK
        try{
            var profileId = req.user.profile;
            const promise = await Profile.findByIdAndDelete(profileId);
            console.log(promise);
            res.json({
                redirectPath : "/"
            });
        }catch(err){
            next(err);
        }
    },
    redirectView : (req,res,next) => { //これ消せるかも（Chat無くしたら）
        var redirectPath = res.locals.redirect;
        if(redirectPath) {
            res.redirect(redirectPath);
        }else{
            next();
        }
    },
}