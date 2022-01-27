var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController"); //LOGINCHAECK用
const profileController = require("../controllers/profileController");

//以下routing
router.get('/new',userController.loginCheck,profileController.profileCheck,profileController.new); //OK
router.post('/create',userController.loginCheck,profileController.profileCheck,profileController.create);　//OK

router.get('/edit',userController.loginCheck,profileController.profileCheck,profileController.edit); //OK
router.put('/update',userController.loginCheck,profileController.update); //OK

router.put('/introUpdate',userController.loginCheck,profileController.introUpdate); //OK

router.get('/:id',userController.loginCheck,profileController.id); 

module.exports = router;

//profileが存在する場合のサーバー側からの拒否をできるようにする必要があるかも　curlからも作成できないように

/* 
    この後やること
    ①userControllersを含めてexecの検証　エラー時においてもpromiseが帰っているのか
    ②profile作成が複数回できないようにする（curlからも）
    ③バリデーションの作成（or処理などをつける）
*/