/* モジュールの読み込み */
const express = require("express"),
    http = require("http"),
    path = require("path"),
    logger = require("morgan"),  
    session = require("express-session"),　
    cookieParser = require("cookie-parser"), 
    layouts = require("express-ejs-layouts"),
    createError = require("http-errors"),
    httpStatus = require("http-status-codes"),
    methodOverride = require("method-override"),
    connectFlash = require("connect-flash"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    User = require("./models/user"),
    Chat = require("./models/chat");

/* rooting */
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/userRouter");
const errorRoutes = require("./routes/errorRouter");
const chatRoutes = require("./routes/chatRouter");
const profileRoutes = require("./routes/profileRouter");

/* appの指定 */
var app = express();

/* モジュールの使用 */
app.set("view engine","ejs");
app.set(express.static(path.join(__dirname,"views")));

app.use(logger("dev"));
app.use(layouts);
app.use(express.json());　//下記２行
app.use(express.urlencoded({extended:false}));
//method-overrideに関しては後で実験 一旦元のやつに似せた
app.use(
    methodOverride("_method",{
        methods : ["POST","GET"]
    })
);
app.use(cookieParser("secret_passcode"));
app.use(express.static(path.join(__dirname,"public")));
app.use(session({
    secret : "keyboard cat",
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 36000000
    }
}));

/* mongooseとの接続 */
mongoose.Promise = global.Promise;
mongoose.connect(
    "mongodb://localhost:27017/chatAppDB",
    {useUnifiedTopology : true},
    {useNewUrlParser : true}
);
mongoose.set("useCreateIndex",true);
const db = mongoose.connection;
db.once("open",() => {
    console.log("DB接続完了！");
});
/* connect-flashの設定 */
app.use(connectFlash());

/* passportの設定 */
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    var url = req.url;
    pathId = url.split("/"); //これをio内部で行いたい
    next();
});

/* routerの読み込み */
app.use("/",indexRoutes);
app.use("/users",userRoutes);
app.use("/chat",chatRoutes);
app.use("/users/mypage",profileRoutes);

/* errorハンドラー */
app.use(errorRoutes);

/* サーバーの起動 */
const PORT = 3000;
const server = http.createServer(app); //こいつの位置に注意

server.listen(PORT,() => {
    console.log("LOCAL接続");
});

/* socket.ioの設定（passportとの連結が必要かも） */
io = require("socket.io")(server);
/* controllerに移行する予定 */
io.on("connection",(socket) => {

    socket.on("message",(message) => {
        console.log(socket);
        if(!room){
            var room = message.id;
            socket.join(room);
            console.log(`${message.user}は、${message.id}に入室しました。`);
            console.log("ここ"+message.customId);
        }
        //データベースへの保管
        Chat.findByIdAndUpdate(message.id,{
            $push : {messages : {
                user : message.userId,
                userName : message.user,
                text : message.val,
                getTime : {
                    day : message.day,
                    time : message.time
                },
                customId : message.customId
            }}
        }).then(msg => {
            console.log("成功");
        }).catch(err=> {
            console.log(err);
        });

        //指定のroomへの送出を行う
        io.to(room).emit("accepter",{
            user : message.user,
            time : message.time,
            text : message.val,
            userId : message.userId,
            customId : message.customId
        });
    });

    socket.on("update",() => {
        //ここで変更を保存するからのデータを受け取り、ここで書き換え、さらにデータベースへの編集をする

    });


    socket.on("disconnect",(room) => { //これに関しては、切断処理を行う（これを前に指定しまうと、送信前に切断されてしまうことに注意）
        socket.leave(room.id);
        console.log("user disconnected");
    });
});
