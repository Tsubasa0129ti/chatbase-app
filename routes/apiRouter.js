var express = require("express");
var router = express.Router();

const userRoutes = require("./userRouter"),
    profileRoutes = require("./profileRouter"),
    chatRoutes = require("./chatRouter");

//各routerへの中継点
router.get("/",(req,res) => {
    res.json({message : "new data2"});
});

router.use("/users",userRoutes);
router.use("/profile",profileRoutes);
router.use("/chat",chatRoutes);

module.exports = router;