/* モジュールのロード */
const User = require("../models/user"),
    Profile = require("../models/profile"),
    passport = require("passport"),

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
        User.register(newUser,req.body.password,(error,user) => {
            if(user) {
                req.flash("success","アカウント作成されました。");
                res.locals.result = "success";
                next();
            }else if(error){
                function getError(errMsg){
                    req.flash("error",errMsg)
                    res.locals.user = newUser;
                    next();
                };
                if(error.name === "UserExistsError"){
                    var errMsg = "このメールアドレスは、すでに使用されています。";
                    getError(errMsg);
                }else{
                    var errMsg = "不明なエラーが発生しました。";
                    getError(errMsg);
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
    authenticate : (req,res,next) => {
        passport.authenticate("local",(err,user,info) => {
            if(err){
                return next(err);
            }
            if(!user){
                req.flash("error","ログイン失敗");
                res.cookie("username",req.query.email,{
                    path : "/users/login",
                    maxAge : 60*60*1000
                });
                return res.redirect("/users/login");
            }
            req.login(user,function(err){
                if(err){
                    return next(err);
                }
                res.clearCookie("username",{path:"/users/login"});
                req.flash("success","ログイン成功");
                return res.redirect("/users/mypage");
            });
        })(req,res,next);
    },
    loginCheck : (req,res,next) => {
        if(req.isAuthenticated()){
            next();
        }else{
            req.flash("error","ログインしてください。");
            res.redirect("/users/login");
        }
    },
    logout : (req,res) => {
        req.logout();
        req.flash("success","ログアウトしました。");
        res.redirect("/");
    },
    mypageView : (req,res) => {
        res.render("users/mypage");
    },
    show : (req,res) => {
        res.render("users/mypage/show");
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
        }).catch(error =>{
            req.flash("error","アカウント情報の変更に失敗しました。"); //ここもエラー情報の分岐をするかも
            console.log(error.message);
        });
    },
    delete : (req,res,next) => {　　//詳細アカウントの作成をした場合、同時にこちらから消せるように設定する
        var userId = req.user._id;     
        User.findByIdAndDelete(userId)
        .then(() => {
            next();
        }).catch(error => {
            console.log(error.message);
        });
    },
    profileDelete : (req,res) => {
        var profileId = req.user.profile;
        Profile.findByIdAndDelete(profileId)
        .then(() => {
            req.flash("success","アカウントの消去が完了しました。");
            res.redirect("/users");
        }).catch(error => {
            console.log(error.message);
        });
    }
}