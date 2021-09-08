const User = require("../models/user"),
    Profile = require("../models/profile"),
    passport = require("passport"),
    createError = require("http-errors");

function getUserParams(body){
    var obj = new Object();
    obj = {
        name : {
            first : body.first,
            last : body.last
        },
        email : body.email,
        age : body.age
    };
    return obj;
};

module.exports = {
    index : (req,res) => {   
        if(req.user){
            res.redirect("/users/mypage");
        }else{
            res.render("users/index");
        }
    },
    new : (req,res) => {
        res.render("users/new");
    },
    create : (req,res,next) => {
        let newUser = new User(getUserParams(req.body));
        User.register(newUser,req.body.password,(err,user) => {
            if(user) {
                req.flash("success","アカウント作成されました。");
                res.locals.result = "success";
                next();
            }else if(err){
                function getError(errMsg){
                    req.flash("error",errMsg)
                    res.locals.user = newUser;
                    next();
                };
                if(err.name === "UserExistsError"){ //その他のを用いる場合は,エラー分岐を追加可能
                    var errMsg = "このメールアドレスは、すでに使用されています。";
                    console.log(err);
                    getError(errMsg);
                }else{ //想定では、registerを行うことができない
                    req.flash("error","アカウントの作成に失敗しました。もう一度お試しください。");
                    res.locals.redirect = "/users/new";
                    res.locals.status = 500;
                    next(err);
                }
            }
        });
    },
    cookie : (req,res,next) => {
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
    redirectView : (req,res,next) => {
        var redirectPath = res.locals.redirect;
        if(redirectPath) {
            res.redirect(redirectPath);
        }else{
            next();
        }
    },
    login : (req,res) => {
        res.render("users/login");
    },
    authenticate : (req,res,next) => { //ログイン時のターミナルを参照　セキュアでないかも
        passport.authenticate("local",{session:true},(err,user,info) => {
            if(err){
                req.flash("error","サーバー内でエラーが発生しました。もう一度お試しください。");
                res.locals.redirect = "/users/login";
                res.locals.status = 500;
                return next(err);
            }
            if(!user){
                req.flash("error","ログイン失敗");
                res.cookie("username",req.query.email,{
                    path : "/users/login",
                    maxAge : 60*60*1000
                });
                return res.redirect("/users/login");
            }else{
                //ここに記載
                req.login(user,function(err){
                    if(err){
                        req.flash("error","サーバー内でのエラーが発生しました。もう一度お試しください。");
                        res.locals.redirect = "/users/login";
                        res.locals.status = 500;
                        return next(err);
                    }else{
                        User.find({email:req.session.passport.user})
                        .then(user => {
                            req.flash("success","ログインに成功しました。");
                            req.session.currentUser = user[0]; //なぜか配列形式になってしまっているため
                            res.clearCookie("username",{path:"/users/login"});
                            next();
                        }).catch(err => {
                            req.flash("error","サーバー内でエラーが発生しました。もう一度お試しください。");
                            res.locals.redirect = "/users/login";
                            res.locals.status = 500;
                            return next(err);
                        });
                    }
                })

            }
        })(req,res,next);
    },
    regenerateSessionId : (req,res,next) => {
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
            req.flash("error","ログインしてください。");
            res.locals.redirect = "/users/login";
            res.locals.status = 401; 
            var err = createError(401,"Please login to view this page.");
            next(err);
        }
    },
    logout : (req,res) => { //delete演算子
        req.logout();
        req.flash("success","ログアウトしました。");
        delete req.session.passport
        delete req.session.currentUser
        res.redirect("/");
    },
    mypageView : (req,res) => {
        res.render("users/mypage");
    },
    show : (req,res) => {
        var currentUser = req.user;
        User.findById(currentUser._id)
        .populate("profile")
        .exec((err,user) => {
            if(err){
                res.locals.redirect = "/users/mypage";
                res.locals.status = 500;
                console.log(err.message);
                next(err);
            }else{
                console.log(user);
                res.render("users/mypage/show",{currentUser:user});
            }
        })
    },
    edit : (req,res) => {
        res.render("users/mypage/edit");
    },
    update : (req,res) => {
        var newUser = {
            name : {
                first : req.body.first,
                last : req.body.last
            },
            age : req.body.age
        };
        var currentUser = req.user;
        User.findByIdAndUpdate(currentUser._id,{
            $set : newUser
        }).then(user=> {
            res.redirect("/users/mypage");
        }).catch(err =>{
            req.flash("error","アカウント情報の変更に失敗しました。"); //ここもエラー情報の分岐をするかも
            console.log(err.message);
            res.locals.redirect = "/users/edit";
            res.locals.status = 500;
            next(err);
        });
    },
    delete : (req,res,next) => {　　//詳細アカウントの作成をした場合、同時にこちらから消せるように設定する
        var userId = req.user._id;     
        User.findByIdAndDelete(userId)
        .then(() => {
            next();
        }).catch(err => {
            res.locals.redirect = "/users/mypage";
            res.locals.status = 500;
            console.log(err.message);
            next(err);
        });
    },
    profileDelete : (req,res) => {
        var profileId = req.user.profile;
        Profile.findByIdAndDelete(profileId)
        .then(() => {
            req.flash("success","アカウントの消去が完了しました。");
            res.redirect("/users");
        }).catch(err => {
            res.locals.redirect = "/users/mypage";
            res.locals.status = 500;
            console.log(err.message);
            next(err);
        });
    }
}