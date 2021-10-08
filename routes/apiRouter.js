var express = require("express");
var router = express.Router();

const errorRoutes = require("./errorRouter"),
    userRoutes = require("./userRouter"),
    profileRoutes = require("./profileRouter"),
    chatRoutes = require("./chatRouter");

//各routerへの中継点
router.get("/",(req,res) => {
    res.json({message : "new data2"});
});

router.use("/error",errorRoutes); //パスありか不明
router.use("/users",userRoutes);
router.use("/users/mypage",profileRoutes);
router.use("/chat",chatRoutes);

module.exports = router;