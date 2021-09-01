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
    MongoStore = require("connect-mongo");
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
        maxAge : 60 * 60 * 1000,
        //secure : true 本番環境での有効化をする
    },
    store : MongoStore.create({
        mongoUrl : "mongodb://localhost:27017/chatAppDB"
    })
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
    console.log(url);
    next();
});

//test
var loginCheck = function(req,res,next) {
    if(req.session.user){
        next();
    }else{
        res.redirect("/users/login");
    }
}

/* routerの読み込み */
app.use("/",indexRoutes);
app.use("/users",userRoutes);
app.use("/chat",chatRoutes);
app.use("/users/mypage",profileRoutes);

/* errorハンドラー　一旦エラーハンドラはこちらで定義して、後に有効化する */
//app.use(errorRoutes);

app.use(function notFoundError(req,res,next){
    var url = req.url;
    res.status(404).render("errors/404",{url:url});
});

app.use(function(err,req,res,next){
    console.log(err.stack);
    next(err);
});

app.use(function customError(err,req,res,next) {
    var statusCode = res.locals.status;
    
    if(!statusCode){
        internalServerError(err,req,res,next);
    }else{
        switch(statusCode){
            case 400 :
                createError(400,"送信されたデータが無効です。");
                break;
            case 401 :
                Unauthorized(err,req,res,next);
                break;
            case 403 : 
                Forbidden(err,req,res,next);
                break;

            case 500 || undefined :
                internalServerError(err,req,res,next);
                break;
        }
    }
});

function internalServerError(err,req,res,next){
    console.log(`internalServerError:${err}`);
    var redirectPath = res.locals.redirect;
    if(!redirectPath){
        res.status(500).send(err);
        //ここに関しては、500.ejsに繋げる　そして、そこで元に戻る画面と、エラー詳細の記載などをつける
        /* res.status(500).render("errors/500",{
            err : err,
            status : 500
        }); */
    }else{
        res.status(500).redirect(redirectPath);
    }
};

function Unauthorized(err,req,res,next){
    console.log(`error:${err}`);
    res.status(401);
    //ここからリダイレクトを行うように設定とか？　ぶっちゃけやらない方がわかりやすいけど
    var redirectPath = res.locals.redirect;
    res.redirect(redirectPath);
};


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

//残り　エラールーターを読み込んでも、これがミドルウェアとして常に読み込まれない　ここの要素としてエラーハンドリングを記載し、nextで繋げることはできるが、errorRouterを読み込むだけだとこれがなされない
//結果としては、errorRouterをapp.js内部で読み込むことで、全てのcontrollerからのnext(error)からここに繋げるようにしたい
