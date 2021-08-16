var express = require("express");
var router = express.Router();

var errorController = require("../controllers/errorController");

router.use(errorController.notFoundError);
router.use(errorController.logError);
router.use(errorController.internalServerError);

module.exports = router;