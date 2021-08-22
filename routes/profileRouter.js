var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController"); //LOGINCHAECK用
const profileController = require("../controllers/profileController");

//以下routing
router.get("/profile",userController.loginCheck,userController.redirectView,profileController.index);
router.post("/profile/create",profileController.create,profileController.redirect);
router.get("/profile/edit",userController.loginCheck,userController.redirectView,profileController.edit);
router.put("/profile/update",profileController.update);

module.exports = router;