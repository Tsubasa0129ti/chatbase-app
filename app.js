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

const { decycle, encycle } = require('json-cyclic');

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

var sessionMiddleware = session({
    secret : "keyboard cat",
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 60 * 60 * 1000,　// 60 * 60 * 1000
        //secure : true 本番環境での有効化をする
    },
    store : MongoStore.create({
        mongoUrl : "mongodb://localhost:27017/chatAppDB"
    })
});
app.use(sessionMiddleware);

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
    if(req.session){
        var limit = req.session.cookie.expires;
        res.locals.sessionExpires = limit.toLocaleString();
    }
    next();
});

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

io = require("socket.io")(server);
/* controllerに移行する予定 */
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

server.listen(PORT,() => {
    console.log("LOCAL接続");
});

io.on("connection",(socket) => {
    console.log(socket.request.session);
    socket.on("message",(message) => {
        var userId = socket.request.session.currentUser._id;
        var username = socket.request.session.currentUser.name.first + "_" + socket.request.session.currentUser.name.last
        //ルームへの入室
        if(!room){
            var room = message.id;
            socket.join(room);
            console.log(`${userId}は、${message.id}に入室しました。`);
            console.log("ここ"+message.customId);
        }
        //データベースの保管層
        var newDate = message.day;
        //ここで判定までしてしまって、dateを送るかどうかを決める　この場合では、dateを新しく作っている時には、dateの放出もするという機構にする
        var dateEmitter;
        Chat.findById(message.id)
        .then(chat => {
            var latest = chat.chatData.length;
            if(latest === 0){
                Chat.update({_id : message.id},{
                    $push : {
                        chatData : {
                            date : message.day,
                            messages : [{
                                userId : userId,
                                username : username,
                                text : message.text,
                                time : message.time,
                                customId : message.customId
                            }]
                        }
                    }
                }).then(chatData => {
                    console.log("新しい日付、メッセージの作成に成功しました。");
                    /* test */
                    io.to(room).emit("accepter",{
                        userId : userId,
                        user : username,
                        time : message.time,
                        date : message.day,
                        text : message.text,
                        customId : message.customId,
                    });
                }).catch(err => {
                    console.log(err.message);
                });
            }else{
                var latestDate = chat.chatData[latest-1].date;
                console.log(`latest:${latest}//latestDate:${latestDate}//newDate${newDate}`); //latestDateが2回に一回undefinedとなっている
                if(newDate!==latestDate){
                    //ここはOK
                    Chat.update({_id : message.id},{
                        $push : {
                            chatData : {
                                date : message.day,
                                messages : [{
                                    userId : userId,
                                    username : username,
                                    text : message.text,
                                    time : message.time,
                                    customId : message.customId
                                }]
                            }
                        }
                    }).then(chatData => {
                        console.log("新しい日付、メッセージの作成に成功しました。");
                        io.to(room).emit("accepter",{
                            userId : userId,
                            user : username,
                            time : message.time,
                            date : message.day,
                            text : message.text,
                            customId : message.customId,
                        });
                    }).catch(err => {
                        console.log(err.message);
                    });
                }else{
                    //この部分で、同日のものは同様の配列の中に収納できるようにすればいい
                    Chat.update(
                        {_id : message.id,"chatData.date" : latestDate},
                        {
                            $push : {
                                "chatData.$.messages" : {
                                    userId : userId,
                                    username : username,
                                    text : message.text,
                                    time : message.time,
                                    customId : message.customId
                                }
                            }
                        }
                    ).then(chatData => {
                        console.log("メッセージの作成をしました。");
                        io.to(room).emit("accepter",{
                            userId : userId,
                            user : username,
                            time : message.time,
                            text : message.text,
                            customId : message.customId,
                        });
                    }).catch(err => {
                        console.log(err.message);
                    });
                    
                }
            }
        }).catch(err => {
            console.log(err.message);
        });

        //指定のroomへの送出を行う


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
