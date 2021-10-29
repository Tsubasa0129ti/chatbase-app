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
    profileCheck : (req,res,next) => {
        var user = req.user;
        res.locals.username = user.name.first + ' ' + user.name.last;
        if(user.profile === undefined){
            next();
        }else{
            res.json({
                result : 'Profile Exist',
                redirectPath : '/users/mypage/show'
            });
        }
    },
    new : (req,res) => {
        var username = res.locals.username;
        res.json({
            result : 'success',
            username : username
        });
    },
    create : (req,res) => {
        const user = req.user;
        var profileParams = getProfile(req.body);
        Profile.create(profileParams)
        .then(profile => { 
            var userId = user._id;
            User.findByIdAndUpdate(userId,{
                $addToSet : {
                    profile : profile._id
                }
            })
            .then(() => {
                res.json({
                    result : 'success',
                    redirectPath : '/users/mypage'
                });
            })
            .catch((err) => { //下記二つのエラー処理は一旦飛ばす。最終的には、ステータスコードをもとに!res.ok内部でのエラー処理に移植する
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
        
    },
    getProfile : (req,res,next) => {
        var user = req.user;
        if(user.profile !== undefined){
            next();
        }else{
            res.json({
                result : 'Profile Not Exist',
                redirectPath : '/profile/new'
            });
        }
    },
    edit : (req,res) => {
        var currentUser = req.user;
        User.findById(currentUser._id)
        .populate("profile")
        .exec(function(err,user){
            if(err){ //ここのエラー処理は未完
                res.json({
                    result : 'error',
                    redirectPath : '/profile/edit'
                });
            }
            const username = user.name.first + ' ' + user.name.last;
            const profile = user.profile
            console.log(profile);
            res.json({
                result : 'success',
                username : username,
                profile : profile
            });
            
        });
    },
    update : (req,res,next) => {
        let profileParams = getProfile(req.body);
        var id = req.user.profile;
        Profile.findByIdAndUpdate(id,{
            $set : profileParams
        }).then(profile => {
            res.json({
                result : 'success',
                redirectPath : '/users/mypage'
            });
        }).catch(err => {
            res.json({
                result : 'error',
                redirectPath : '/profile/edit'
            });
        });
    },
    id : (req,res,next) => {
        var userId = req.params.id;
        User.findById(userId)
        .populate('profile')
        .exec(function(err,user) {
            if(err){
                console.error(err.message);
            }
            res.json({
                result : 'success',
                user : user
            });
        })
    }
}