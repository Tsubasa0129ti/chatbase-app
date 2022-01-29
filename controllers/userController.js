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
        return Promise.reject("your initial must be upper case");
    }
    return true;
}

const isEmpty = (obj) => {
    return !Object.keys(obj).length;
};

module.exports = {
    isAuthenticated : (req,res,next) => {
        try{
            const loggedIn = req.isAuthenticated();
            if(loggedIn){
                res.status(303).json({
                    status : 303,
                    redirectPath : '/users/mypage'
                });
            }else{
                res.status(200).json(null);
            }
        }catch(err){
            next(err)
        }
    },
    setLoggedIn : (req,res,next) => {
        try{
            const loggedIn = req.isAuthenticated();
            if(loggedIn){
                res.status(200).json({
                    isAuthenticated : true
                });
            }else{
                res.status(200).json(null);
            }
        }catch(err){
            next(err);
        }
    },
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
    checkBody : (req,res,next) => { //これの改良をする必要がある。いずれかの値がからの時と言うふうに（authのも使えるようにしたい）
        if(isEmpty(req.body)){
            var err = new createError.BadRequest();
            return next(err);
        }
        next();
    },
    nameValidation : [
        check("name.first")
            .notEmpty().withMessage('input your first name!')
            .isAlpha().withMessage('please input with alphabet')
            .isLength({min:2,max:10}).withMessage('must be at least 2 characters in length, and no more than 10 characters')
            .custom(startUpper),
        check("name.last")
            .notEmpty().withMessage('input your last name!')
            .isAlpha().withMessage('please input with alphabet')
            .isLength({min:2,max:10}).withMessage('must be at least 2 characters in length, and no more than 10 characters')
            .custom(startUpper),
    ],
    validation : [
        check("email")
            .notEmpty().withMessage()
            .isEmail().withMessage("input your email!")
            .custom(value => {
                return User.findOne({email : value}).then(user => {
                    if(user){
                        return Promise.reject('this email has already existed');
                    }
                    return true;
                })
            }),
        check("password")
            .notEmpty().withMessage("input your password!")
            .isAscii().withMessage("your can use only Ascii code")
            .matches(/[a-zA-Z]/).withMessage("please contain alphabet")
            .matches(/\d/).withMessage("must contain number")
            .custom(startUpper)
            .isLength({min:8,max:16}).withMessage("must be at least 8 characters in length, and no more than 16 characters")
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
    create : async(req,res,next) => { //これは後テストをする。目的は、エラーの分岐を増やす　改善の余地あり
        try{
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
    auth : async(req,res,next) => {
        if(!req.body.email || !req.body.password){
            var err = new createError.BadRequest();
            return next(err);
        }

        const promise = await User.authenticate()(req.body.email,req.body.password);
        console.log(promise);

        if(promise.error){
            console.log(promise.error);
            var err = new createError.Unauthorized(promise.error);
            next(err); //①Unauthorizedしか対応することができない②エラーメッセージを送っても上書きされてしまう
        }

        if(promise.user){
            passport.authenticate('local')(req,res,function(){　
                next();
            });
        }
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
    logout : (req,res,next) => {
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
    update : async(req,res,next) => {
        try{
            var currentUser = req.user;
            const promise = await User.findByIdAndUpdate(currentUser._id,{
                $set : req.body
            }).exec();
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
            const promise = await User.findByIdAndDelete(userId).exec();
            console.log(promise);
            next();
        }catch(err){
            next(err);
        }
    },
    profileDelete : async(req,res,next) => {
        try{
            var profileId = req.user.profile;
            const promise = await Profile.findByIdAndDelete(profileId).exec();
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