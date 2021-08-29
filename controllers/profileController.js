var User = require("../models/user");
var Profile = require("../models/profile");

function getProfile(body) {
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
    create : (req,res,next) => {　//一応短く分離することは可能ではあるものの、必要性を感じない（別に可読性が上がるわけではないと思う）ため、一旦保留
        if(req.isAuthenticated()){
            var currentUser = req.user;
            if(currentUser.profile===undefined){
                let profileParams = getProfile(req.body);
                Profile.create(profileParams)
                .then(profile => { 
                    var userId = currentUser._id;
                    User.findByIdAndUpdate(userId,{
                        $addToSet : {
                            profile : profile._id
                        }
                    })
                    .then(() => {
                        res.locals.redirect = "/users/mypage";
                        next();
                    })
                    .catch((err) => {
                        //user編集をする際のエラー
                        res.locals.redirect = "/users/mypage/profile";
                        res.locals.status = 500;
                        console.log(err.message);
                        next(err);
                    });
                })
                .catch(err => {
                    //profile作成のエラー
                    res.locals.redirect = "/users/mypage/profile";
                    res.locals.status = 500;
                    console.log(err.message);
                    next(err);
                });
            }else{
                req.flash("error","You have already created your profile. if you wanted to renew yours, go to edit page");
                res.locals.redirect = "/users/mypage";
                next();
            }
        }else{
            res.locals.redirect = "/users/login";
            next();
        }
    },
    redirectView : (req,res,next) => {
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
                res.locals.redirect = "/users/mypage";
                res.locals.status = 500;
                console.log(err.message)
                next(err);
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
                    res.locals.redirect = "/users/mypage";
                    res.locals.status = 500;
                    console.log(err.message)
                    next(err);
                }else{
                    res.render("profile/edit",{currentUser:user});
                }
            });
        }else{
            req.flash("error","profileを作成してください。");
            res.locals.redirect = "/users/mypage/profile";
            next();
        }
    },
    update : (req,res,next) => {
        let profileParams = getProfile(req.body);
        var id = req.user.profile;
        Profile.findByIdAndUpdate(id,{
            $set : profileParams
        }).then(profile => {
            req.flash("success","プロフィールの更新に成功しました。");
            res.locals.redirect = "/users/mypage";
            next();
        }).catch(err => {
            res.locals.redirect = "/users/mypage/edit";
            res.locals.status = 500;
            console.log(err);
            next();
        });
    }
}