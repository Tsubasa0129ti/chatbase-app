var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController"); //LOGINCHAECK用
const profileController = require("../controllers/profileController");

//以下routing
router.get('/new',userController.loginCheck,profileController.profileCheck,profileController.new);
router.post('/create',userController.loginCheck,profileController.profileCheck,profileController.create);

router.get('/edit',userController.loginCheck,profileController.getProfile,profileController.edit);
router.put('/update',userController.loginCheck,profileController.update);

router.get('/:id',userController.loginCheck,profileController.id);

module.exports = router;