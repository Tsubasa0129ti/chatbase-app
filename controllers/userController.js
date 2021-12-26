const User = require("../models/user"),
    Profile = require("../models/profile"),
    passport = require("passport"),
    createError = require("http-errors");

module.exports = {
    preLoginCheck : (req,res) => {
        if(req.isAuthenticated()){
            var user = req.user;
            const username = user.name.first + ' ' + user.name.last;
            res.json({
                result : "Authenticated",
                username : username,
                redirectPath : "/users/mypage",
            });
        }else{
           res.json('success'); 
        }  
    },
    create : (req,res,next) => {
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
    },
    auth : (req,res,next) => {
        next();
    },
    regenerateSessionId : (req,res,next) => {
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
    logout : (req,res) => {
        req.logout();
        req.session.destroy();
        res.json({
            redirectPath : '/',
        });
    },
    loginCheck : (req,res,next) => {
        if(req.isAuthenticated()){
            next();
        }else{
            var err = new createError.Unauthorized('please login to view this pages');
            next(err);
        }
    },
    mypageView : (req,res) => { //現状mypageに繋いだ時、usernameの情報のみしか送っていない。これを変えていく。まずは情報として、①userDataの全て②profileの有無③profileがある場合、その全て（＋アイコン情報）
        var user = req.user;
        if(user.profile === undefined) {
            User.findById(user._id)
            .then((user) => {
                res.json({
                    profile : false,
                    user : user
                });
            }).catch((err) => {
                return next(err);
            });
        }else{
            User.findById(user._id)
            .populate("profile")
            .exec((err,user) => {
                if(err){
                    return next(err);
                }else{
                    res.json({
                        profile : true,
                        user : user
                    });
                }
            })
        }
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
                return next(err);
            });
        }else{
            User.findById(user._id)
            .populate("profile")
            .exec((err,user) => {
                if(err){
                    return next(err);
                }
                res.json({
                    profileExist : true,
                    user : user
                });
            });
        }
    },
    edit : (req,res) => {
        var currentUser = req.user;
        User.findById(currentUser._id)
        .then(user => {
            res.json({
                name : user.name
            });
        }).catch(err => {
            next(err);
        });
    },
    update : (req,res) => {
        var currentUser = req.user;
        User.findByIdAndUpdate(currentUser._id,{
            $set : req.body
        }).then(user=> {
            res.json({
                redirectPath : "/users/mypage"
            });
        }).catch(err =>{
            next(err)
        });
    },
    delete : (req,res,next) => {
        var userId = req.user._id;     
        User.findByIdAndDelete(userId)
        .then(() => {
            next();
        }).catch(err => {
            next(err);
        });
    },
    profileDelete : (req,res) => {
        var profileId = req.user.profile;
        Profile.findByIdAndDelete(profileId)
        .then(() => {
            res.json({
                redirectPath : '/'
            });
        }).catch(err => {
            next(err);
        });
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