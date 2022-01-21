const User = require("../models/user"),
    Profile = require("../models/profile"),
    passport = require("passport"),
    createError = require("http-errors"),
    {check,validationResult} = require("express-validator");


/* function asyncWrap(fn) {
    return (req, res, next) => {
        return fn(req, res, next)
        .catch((error) => {
            next(error || 'ERROR IS NULL');
        });
    };
}
https://neos21.net/blog/2020/06/14-02.html
*/

const startUpper = (value) => {
    var firstValue = value.charAt(0);
    
    if(!firstValue.match(/[A-Z]/)){
        return Promise.reject("error occured");
    }
    return true;
}

module.exports = {
    loginCheck : (req,res,next) => {
        try{
            const loggedIn = req.isAuthenticated();
            if(loggedIn){
                next();
            }else{
                var err = new createError.Unauthorized();
                next(err);
            }
        }catch(err){
            next(err);
        }
    },
    resLoggedIn : (req,res,next) => {
        try{
            res.json({
                result : "Authenticated",
                redirectPath : '/users/mypage'
            });
        }catch(err){
            next(err);
        }
    },
    createValidation : [
        check("name.first")
            .notEmpty().withMessage('')
            .isAlpha().withMessage('')
            .isLength({min:2,max:10}).withMessage('')
            .custom(startUpper),
        check("name.last")
            .notEmpty().withMessage('')
            .isAlpha().withMessage('')
            .isLength({min:2,max:10}).withMessage('')
            .custom(startUpper),
        check("email")
            .notEmpty().withMessage()
            .isEmail().withMessage("")
            .custom(value => {
                return User.findOne({email : value}).then(user => {
                    if(user){
                        return Promise.reject('this email has already existed');
                    }
                    return true;
                })
            }),
        check("password")
            .notEmpty().withMessage()
            .isAscii().withMessage()
            .matches(/[a-zA-Z]/).withMessage()
            .matches(/\d/).withMessage()
            .custom(startUpper)
            .isLength({min:8,max:16}).withMessage("")
    ],
    create : async(req,res,next) => { //これは後テストをする。目的は、エラーの分岐を増やす　改善の余地あり
        try{
            const err = await validationResult(req);
            if(!err.isEmpty()){
                console.log(JSON.stringify(err));
                return next(err);
            }
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
        }catch(err){
            next(err);
        }
    },//テスト一覧　①通常のバリデーション　②required ③空白　④重複禁止　⑤500番台（これは普通に無理かも） ちなみにcreate自体はOK 値がおかしい場合のエラーに関しては、ここにいく前に処理されるようになっているな
    auth : (req,res,next) => {　//ここ何しているの。。。？
        next();
    },
    regenerateSessionId : (req,res,next) => { //ここもいまいちうまく機能していないので一旦飛ばす
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
        try{
            req.logout();
            req.session.destroy();
            res.json({
                redirectPath : "/"
            });
        }catch(err){
            next(err);
        }
    },
    mypageView : async(req,res,next) => {
        try{
            var user = req.user;
            if(user.profile === undefined){
                const promise = await User.findById(user._id).exec();
                res.json({
                    profile : false,
                    user : promise
                });
            }else{
                const promise = await User.findById(user._id).populate("profile").exec();
                res.json({
                    profile : true,
                    user : promise
                });
            }
        }catch(err){
            next(err);
        }
    },
    edit : async(req,res,next) => {
        try{
            var currentUser = req.user;
            const user = await User.findById(currentUser._id).exec();
            res.json({
                name : user.name
            });
        }catch(err){
            next(err)
        }
    },
    updateValidation : [
        check("name.first")
            .notEmpty().withMessage('a')
            .isAlpha().withMessage('b')
            .isLength({min:2,max:10}).withMessage('c')
            .custom(startUpper),
        check("name.last")
            .notEmpty().withMessage('A')
            .isAlpha().withMessage('B')
            .isLength({min:2,max:10}).withMessage('C')
            .custom(startUpper)
    ],
    update : async(req,res,next) => {
        try{
            const err = await validationResult(req);
            if(!err.isEmpty()){
                console.log(JSON.stringify(err));
                return next(err);
            }

            var currentUser = req.user;
            const promise = await User.findByIdAndUpdate(currentUser._id,{
                $set : req.body
            });
            console.log(promise);
            res.json({
                redirectPath : '/users/mypage'
            });
        }catch(err){
            next(err);
        }
    },
    delete : async(req,res,next) => {
        try{
            var userId = req.user._id;     
            const promise = await User.findByIdAndDelete(userId);
            console.log(promise);
            next();
        }catch(err){
            next(err);
        }
    },
    profileDelete : async(req,res) => {
        try{
            var profileId = req.user.profile;
            const promise = await Profile.findByIdAndDelete(profileId);
            console.log(promise);
            res.json({
                redirectPath : "/"
            });
        }catch(err){
            next(err);
        }
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