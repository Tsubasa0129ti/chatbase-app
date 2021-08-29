var express = require("express");
var router = express.Router();
var errorRouter = require("../controllers/errorController");

var indexController = require("../controllers/index");

router.get("/",indexController.index);

router.get("/a",(req,res,next) => {
    var err = new Error();
    console.log("ssss");
    res.status(500);
    res.locals.status = 500; //仮　エラー時にlocal変数として、ステータスコードを書き込んでおく
    next(err);
});

//router.use(errorRouter.internalServerError);

module.exports = router;