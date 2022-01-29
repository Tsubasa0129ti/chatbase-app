var express = require("express");
var router = express.Router();

var errorController = require("../controllers/errorController");

router.use(errorController.NotFoundError);


module.exports = router;