var User = require("../models/user");
var Profile = require("../models/profile");
const profile = require("../models/profile");

function getProfile(body) {
    return {
        intro : body.intro,
        country : body.country,
        address : body.address,
        professional : body.professional,
        belongings : body.belongings,
        site : body.site,
        gender : body.gender,
        age : body.age,
        birthday : body.birthday,   
    }
};

module.exports = {
    profileCheck : (req,res,next) => {
        try{
            const user = req.user;
            if(user.profile === undefined){
                next();
            }else{
                res.status(303).json({
                    status : 303,
                    redirectPath : '/profile/edit',
                    message : 'You have already created your profile!'
                });
            }
        }catch(err){
            next(err);
        }
    },
    new : (req,res,next) => {
        try{
            res.json(null);
        }catch(err){
            next(err);
        }
    },
    create : async(req,res,next) => {
        try{
            const user = req.user;
            var userId = user._id;
            var profileParams = getProfile(req.body);

            const createProfile = await Profile.create(profileParams); //profileの作成
            const updateUser = await User.findByIdAndUpdate(userId,{　//userの編集（profileを追加・結び付け）
                $addToSet : {
                    profile : profile._id
                }
            });
            res.json({
                redirectPath : '/users/mypage'
            });
        }catch(err){
            next(err);
        }
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
            const email = user.email;
            const profile = user.profile;
            res.json({
                email : email,
                profile : profile
            });
            
        });
    },
    introUpdate : (req,res) => {
        var id = req.user.profile;
        Profile.findByIdAndUpdate(id,{
            $set : {intro : req.body.intro}
        }).then(profile => {
            res.json({
                redirectPath : '/users/mypage'
            });
        }).catch(err => {
            next(err);
        })
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
    id : (req,res,next) => { //時々なのかはわからないが、userの検索ができなくなったことがあったので、エラー処理をするなどして、対処する必要がありそう
        var userId = req.params.id;
        User.findById(userId)
        .then((user) => { //なるほど、結果がなくても検索自体は一応できてしまうのか
            if(user.profile){
                User.findById(userId)
                .populate('profile')
                .exec((err,user) => {
                    if(err){
                        next(err);
                    }
                    res.json({
                        profileExist : true,
                        user : user
                    });
                });
            }else{
                res.json({
                    user : user
                });
            }
        }).catch((err) => {
            next(err); //ここだね。おそらくこのエラーが出たときに/mypageに飛ぶ
        })
    }
}