var User = require("../models/user");
var Profile = require("../models/profile");
var getProfile = body => {
    return {
        intro : body.intro,
        prefecture : body.prefecture,
        address : body.address,
        birthday : body.birthday,
        belongings : body.belongings
    }
};

module.exports = {
    index : (req,res) => {
        res.render("profile/index");
    },
    create : (req,res,next) => {
        if(req.isAuthenticated()){
            //ログイン時の処理
            var currentUser = req.user; //現在のuserとprofileの結び付けを行う（1対１）
            if(currentUser.profile===undefined){
                let profileParams = getProfile(req.body);
                Profile.create(profileParams)
                .then(profile => { 
                    //ここにデータベースへの干渉ができるものを入れる
                    var userId = currentUser._id;
                    User.findByIdAndUpdate(userId,{
                        $addToSet : {
                            profile : profile._id
                        }
                    })
                    .then(() => {
                        res.locals.redirect = "/users/mypage";
                        console.log("clear");
                        next();
                    })
                    .catch((err) => {
                        res.locals.redirect = "/users/mypage/profile";
                        console.log(err);
                        next();
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.locals.redirect = "/users/mypage/profile";
                    next();
                });
            }else{
                req.flash("error","You have already created your profile. if you wanted to renew yours, go to edit page");
                res.locals.redirect = "/users/mypage";
                next();
            }
        }
        else{
            res.redirect = "/users/login";
        }
    },
    show : (req,res) => {
        var currentUser = req.user;
        User.findById(currentUser._id)
        .populate("profile")
        .exec(function(err,user){
            if(err){
                console.log(err.message);
            }else{
                res.render("profile/view",{currentUser:user});
            }
        });
    },
    redirect : (req,res,next) => {
        var redirectPath = res.locals.redirect;
        if(redirectPath) {
            res.redirect(redirectPath);
        }else{
            next();
        }
    },
    profile : (req,res) => {
        var userId = req.params.id;
        User.findById(userId)
        .populate("profile")
        .exec(function(err,user){
            if(err){
                console.log(err.message);
            }else{
                res.render("profile/show",{User:user});
            }
        });   
    },
    edit : (req,res) => {
        var currentUser = req.user;

        if(currentUser.profile){
            User.findById(currentUser._id)
            .populate("profile")
            .exec(function(err,user){
                if(err){
                    console.log(err.message);
                }else{
                    res.render("profile/edit",{currentUser:user});
                }
            });
        }else{
            req.flash("error","profileを作成してください。");
            res.redirect("/users/mypage/profile");
        }
    },
    findByCurrent : (req,res,next) => {
        var currentUser = req.user;
        User.findById(currentUser._id)
        .populate("profile")
        .exec(function(err,user){
            if(err){
                next(err);
            }else{
                next(user);
            }
        });
    },
    update : (req,res,next) => {
        let profileParams = getProfile(req.body);
        console.log(profileParams);
        var id = req.user.profile;
        Profile.findByIdAndUpdate(id,{
            $set : profileParams
        }).then(profile => {
            res.redirect("/users/mypage");
        }).catch(err => {
            console.log(err);
        });
    }
}