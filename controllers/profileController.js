var User = require("../models/user");
var Profile = require("../models/profile");
var {check,validationResult} = require("express-validator");

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
        try {
            const user = req.user;
            user.profile === undefined ? res.locals.exist = false : res.locals.exist = true;
            next();
        }catch(err){
            next(err);
        }
    },
    new : (req,res,next) => {
        try{
            var exist = res.locals.exist;
            if(!exist){
                res.json(null);
            }else{
                res.status(303).json({
                    status : 303,
                    redirectPath : '/profile/edit',
                    message : 'You have alredy created your profile!'
                });
            }
        }catch(err){
            next(err);
        }
    },
    existProfile : (req,res,next) => {
        try{
            const exist = res.locals.exist;

            if(!exist){
                next();
            }else{
                res.status(303).json({
                    status : 303,
                    redirectPath : '/profile/new',
                    message : "You havn't had your profile yet. If you want to create your profile, please create here."
                });
            }
        }catch(err){
            next(err);
        }
    },
    validation : [
        check("intro")
            .isLength({min:0,max:100}).withMessage("メッセージの文字数は100文字以内に設定してください。"),
        check("site")
            .if(check("site").notEmpty())
            .isURL().withMessage("正しいURLを記入してください。"),
        check("gender")
            .isIn(["","male","female","no-answer"]).withMessage("正しく記入してください。"),
        check("age")
            .if(check("age").notEmpty())
            .isInt({min:0,max:120}).withMessage("正しい年齢を記入してください。")
    ],
    validationCheck : (req,res,next) => {
        try{
            const err = validationResult(req);
            if(!err.isEmpty()){
                return next(err);
            }
            next();
        }catch(err){
            next(err);
        }
    },
    create : async(req,res,next) => {
        try{
            const user = req.user;
            var userId = user._id;
            var profileParams = getProfile(req.body);

            const newProfile = await Profile.create(profileParams);
            const updateUser = await User.findByIdAndUpdate(userId,{
                $addToSet : {
                    profile : newProfile._id
                }
            }).exec();
            res.json({
                redirectPath : '/users/mypage'
            });  
        }catch(err){
            next(err);
        }
    },
    edit : async(req,res,next) => {
        try{
            var exist = res.locals.exist;
            if(exist){
                var currentUser = req.user;
                var user = await User.findById(currentUser._id).populate("profile").exec();
                res.json({
                    email : user.email,
                    profile : user.profile
                });
            }else{
                res.status(303).json({
                    status : 303,
                    redirectPath : '/profile/new',
                    message : "You havn't had your profile yet. If you want to create your profile, please create here."
                });
            }
        }catch(err){
            next(err);
        }
    },
    update : async(req,res,next) => {
        try{
            let profileParams = getProfile(req.body);
            var id = req.user.profile;
            var promise = await Profile.findByIdAndUpdate(id,{
                $set : profileParams
            }).exec();
            res.json({
                redirectPath : '/users/mypage'
            });
        }catch(err){
            next(err);
        }
    },
    introUpdate : async(req,res,next) => {
        try{
            var id = req.user.profile;
            var promise = await Profile.findByIdAndUpdate(id,{
                $set : {intro : req.body.intro}
            }).exec();
            res.json({
                redirectPath : '/users/mypage'
            });
        }catch(err){
            next(err);
        }
    },
    id : async(req,res,next) => { //時々なのかはわからないが、userの検索ができなくなったことがあったので、エラー処理をするなどして、対処する必要がありそう
        try{
            var userId = req.params.id;
            const user = await User.findById(userId).exec();
            if(user.profile){
                const result = await User.findById(userId).populate('profile').exec();
                res.json({
                    profileExist : true,
                    user : result
                });
            }else{
                res.json({
                    user : user
                })
            }
        }catch(err){
            next(err);
        }
    }
}