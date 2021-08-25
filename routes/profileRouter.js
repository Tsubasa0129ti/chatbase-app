var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController"); //LOGINCHAECK用
const profileController = require("../controllers/profileController");

//以下routing
router.get("/profile",userController.loginCheck,userController.redirectView,profileController.index);
router.post("/profile/create",userController.loginCheck,userController.redirectView,profileController.create,profileController.redirectView);
router.get("/profile/edit",userController.loginCheck,userController.redirectView,profileController.edit,profileController.redirectView);
router.put("/profile/update",userController.loginCheck,userController.redirectView,profileController.update,profileController.redirectView);

module.exports = router;