const User = require("../models/user"),
    Profile = require("../models/profile"),
    passport = require("passport"),
    createError = require("http-errors");

//リダイレクトなどのような、ページ変換の際のパスの変更とレンダリングをなくしてデータの送信のみを行う

module.exports = {
    create : (req,res,next) => {
        var newUser = new User(req.body);
        User.register(newUser,req.body.password,(err,user) => {
            if(user) {
                res.json({
                    redirectPath : "/users/login",
                    result : "success"
                });
            }else if(err){
                console.log(err.message);

                //多分ここでのエラーが出力されるのだが、正確にはエラー形式にしていないため、これをサーバー内のエラーとして認識していない。例えば、サーバー内でのエラーにしてしまう
                next(err);
            }
        });
    },
    cookie : (req,res,next) => { //現時点で未使用
        var success = res.locals.result;
        if(success){
            //cookieの削除 複数の削除の方法は不明
            res.clearCookie("first",{path:"/users/new"});
            /* res.clearCookie("last",{path:"/users/new"});
            res.clearCookie("email",{path:"/users/new"});
            res.clearCookie("age",{path:"/users/new"});
            res.redirect("/users",{path:"/users/new"}); */
            res.locals.redirect = "/users";
        }else{
            //cookieの作成 arrayに関してはオブジェクトからの変換をどうにかしたい
            var newUser = res.locals.user;
            var array = [
                ["first",`${newUser.name.first}`],["last",`${newUser.name.last}`],["email",`${newUser.email}`],["age",`${newUser.age}`]
            ];
            for(var i=0;i<array.length;i++){
                res.cookie(`${array[i][0]}`,array[i][1],{
                    path  : "/users/new",
                    maxAge : 60*60*1000
                });
            }
            res.locals.redirect = "/users/new";
        }
        next();
    },
    redirectView : (req,res,next) => { //これ消せるかも（profile無くしたら）
        var redirectPath = res.locals.redirect;
        if(redirectPath) {
            res.redirect(redirectPath);
        }else{
            next();
        }
    },
    auth : (req,res) => {
        res.json({
            result : "success",
            redirectPath : "/users/mypage",
            user : req.user
        });
    },
    regenerateSessionId : (req,res,next) => {//現時点で未使用
        var sessions = {};
        for(var key in req.session){
            sessions[key] = req.session[key];
        }
        req.session.regenerate(function(err){
            if(err){
                console.log(err.message);
            }
            for(var key in sessions){
                req.session[key] = sessions[key];
            }
            res.redirect("/users/mypage");
        })
    },
    loginCheck : (req,res,next) => {
        if(req.isAuthenticated()){
            next();
        }else{
            res.json({
                result : "Authentication Error",
                redirectPath : "/users/login"
            });
        }
    },
    preLoginCheck : (req,res) => {
        if(req.isAuthenticated()){
            var user = req.user;
            var username = user.name.first + ' ' +  user.name.last
            res.json({
                result : "Authenticated",
                redirectPath : "/users/mypage",
                username : username
            });
        }else{
            res.json({
                result : "success"
            });
        }
    },
    logout : (req,res) => { //delete演算子
        req.logout();
        delete req.session.passport
        delete req.session.currentUser
        res.json({
            redirectPath : '/',
            result : "success"
        });
    },
    mypageView : (req,res) => {
        res.json({
            result : "success",
            username : req.user.name
        });
    },
    show : (req,res) => {
        var user = req.user;
        if(user.profile === undefined){
            User.findById(user._id)
            .then((user) => {
                res.json({
                    profileExist : false,
                    user : user
                });
            }).catch((err) => {
                //ここは後で作る
                res.json({
                    result : 'Error',
                    redirectPath : '/users/mypage'
                });
            });
        }else{
            User.findById(user._id)
            .populate("profile")
            .exec((err,user) => {
                if(err){
                    res.json({
                        result : "Error",
                        error : err.message,
                        redirectPath : "/users/mypage"
                    });
                }else{
                    res.json({
                        profileExist : true,
                        user : user
                    });
                }
            });
        }
    },
    edit : (req,res) => {
        var currentUser = req.user;
        User.findById(currentUser._id)
        .then(user => {
            res.json({
                result : "success",
                name : user.name
            });
        }).catch(err => {　//ここにおけるエラーの分岐もする必要があるのではないか（現状は、検索エラーのみを考慮に入れているが他のエラーについては不明）
            res.json({
                result : "Error",
                error : err.message,
                redirectPath : "/users/mypage"
            });
        });
    },
    update : (req,res) => {
        var currentUser = req.user;
        User.findByIdAndUpdate(currentUser._id,{
            $set : req.body
        }).then(user=> {
            res.json({
                result : "success",
                redirectPath : "/users/mypage"
            });
        }).catch(err =>{
            res.json({
                result : "Update Error",
                error : err.message,
                redirectPath : "/users/mypage/edit",
            });
        });
    },
    delete : (req,res,next) => {　　//詳細アカウントの作成をした場合、同時にこちらから消せるように設定する
        var userId = req.user._id;     
        User.findByIdAndDelete(userId)
        .then(() => {
            next();
        }).catch(err => {
            res.json({
                result : error,
                error : err,
                redirectpath : '/users/mypage'
            })
        });
    },
    profileDelete : (req,res) => {
        var profileId = req.user.profile;
        Profile.findByIdAndDelete(profileId)
        .then(() => {
            res.json({
                result : 'success',
                redirectPath : '/'
            });
        }).catch(err => {
            res.json({
                result : error,
                error : err,
                redirectpath : '/users/mypage'
            });
        });
    }
}