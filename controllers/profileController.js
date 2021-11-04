var User = require("../models/user");
var Profile = require("../models/profile");

function getProfile(body) {
    return {
        intro : body.intro,
        age : body.age,
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
                exist : true,
                redirectPath : '/users/mypage/show'
            });
        }
    },
    new : (req,res) => {
        var username = res.locals.username;
        res.json({
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
                    redirectPath : '/users/mypage'
                });
            })
            .catch((err) => {
                next(err);
            });
        })
        .catch(err => {
            next(err);
        });
        
    },
    getProfile : (req,res,next) => {
        var user = req.user;
        if(user.profile !== undefined){
            next();
        }else{
            res.json({
                notExist : true,
                redirectPath : '/profile/new'
            });
        }
    },
    edit : (req,res) => {
        var currentUser = req.user;
        User.findById(currentUser._id)
        .populate("profile")
        .exec(function(err,user){
            if(err){
                next(err);
            }
            const username = user.name.first + ' ' + user.name.last;
            const profile = user.profile
            res.json({
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
                redirectPath : '/users/mypage'
            });
        }).catch(err => {
            next(err);
        });
    },
    id : (req,res,next) => {
        var userId = req.params.id;
        User.findById(userId)
        .then((user) => {
            if(user.profile){
                User.findById(userId)
                .populate('profile')
                .exec((err,user) => {
                    if(err){
                        next(err);
                    }
                    res.json({
                        user : user
                    });
                });
            }else{
                const username = user.name.first + ' ' + user.name.last;
                res.json({
                    notExist : true,
                    username : username
                });
            }
        }).catch((err) => {
            next(err);
        })
    }
}