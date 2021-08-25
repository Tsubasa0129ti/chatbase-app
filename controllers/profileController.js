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
                        console.log(err);
                        next();
                    });
                })
                .catch(err => {
                    //profile作成のエラー
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
            res.locals.redirect = "/users/mypage/profile";
        }
    },
    update : (req,res,next) => {
        let profileParams = getProfile(req.body);
        var id = req.user.profile;
        Profile.findByIdAndUpdate(id,{
            $set : profileParams
        }).then(profile => {
            res.locals.redirect = "/users/mypage";
            next();
        }).catch(err => {
            console.log(err);
            next();
        });
    }
}

//エラー処理がある場所　create profile edit update
/* 一応想定としては、ステータスコードを用いた分岐を行う　これには、errorControllerを作成して、これを呼び出す形にする　ステータスコード別のエラーページを作成 */