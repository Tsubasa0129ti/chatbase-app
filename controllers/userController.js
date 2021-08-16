/* モジュールのロード */
const User = require("../models/user"),
    Profile = require("../models/profile"),
    passport = require("passport"),
    {body,validationResult} = require("express-validator"),
    getUserParams = body => {
        return {
            name : {
                first : body.first,
                last : body.last
            },
            email : body.email,
            age : body.age
        }
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
                res.locals.redirect = "/users";
                next();
            }else if(error){
                function getError(){
                    res.locals.redirect = "/users/new";
                    next()
                }
                //以下エラー時の分岐をして、日本語での表示に変更
                if(error.name === "UserExistsError"){
                    console.log("getName");
                    req.flash("error","このメールアドレスはすでに利用されています。");
                    getError();
                }else{
                    console.log("なんかエラー");
                    req.flash("error",error.message);
                    getError();
                }
            }
        });
    },
    redirectView : (req,res,next) => {
        var redirectPath = res.locals.redirect;
        if(redirectPath) {
            res.redirect(redirectPath);
        }else{
            next();  //一旦飛ばすがこの処理について後で戻る
        }
    },
    login : (req,res) => {
        res.render("users/login");
    },
    authenticate : passport.authenticate("local",{ //ok
        successRedirect : "/users/mypage",
        successFlash : "ログイン成功",
        failureRedirect : "/users/login",
        failureFlash : "ログイン失敗"
    }),
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