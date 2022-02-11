var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");

//以下routing
router.get('/new',userController.loginCheck,profileController.profileCheck,profileController.new);
router.post(
    '/create',
    userController.loginCheck,
    profileController.profileCheck,
    profileController.existProfile,
    profileController.objCheck,
    profileController.validation,
    profileController.validationCheck,
    profileController.create
);

router.get('/account',userController.loginCheck,profileController.profileCheck,profileController.account);
router.put(
    '/update',
    userController.loginCheck,
    profileController.validation,
    profileController.validationCheck,
    profileController.update
);

router.put(
    '/introUpdate',
    userController.loginCheck,
    profileController.validation,
    profileController.validationCheck,
    profileController.introUpdate
);

router.get('/account',userController.loginCheck,profileController.profileCheck,profileController.account);
router.get('/:id',userController.loginCheck,profileController.id);

module.exports = router;