/* モジュールの読み込み */
const express = require("express"),
    http = require("http"),
    helmet = require("helmet"),
    path = require("path"),
    logger = require("morgan"),  
    session = require("express-session"),　
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    uuid = require("uuid"), 
    createError = require("http-errors"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    MongoStore = require("connect-mongo");
    User = require("./models/user"),
    Chat = require("./models/chat"),
    Message = require("./models/message");

/* rooting */
const indexRoutes = require("./routes/index");
var apiRoutes = require("./routes/apiRouter");
//const errorRoutes = require("./routes/errorRouter");

/* appの指定 */
var app = express();
app.use(helmet());

/* モジュールの使用 */
app.set("view engine","ejs");
app.set(express.static(path.join(__dirname,"views")));

app.use(logger("dev"));
app.use(express.json());　//下記２行
app.use(express.urlencoded({extended:false}));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

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
    rolling : false,
    cookie : {
        maxAge : 60 * 60 * 1000,
        //secure : true 本番環境での有効化をする これ分岐によって実現したい
        //expires : new Date(Date.now() + 30 * 1000)
    },
    name : '__session',
    store : MongoStore.create({
        mongoUrl : "mongodb://localhost:27017/chatAppDB"
    }),
    genid : function(req){
        console.log("new sessionID is created");
        return uuid.v4();
    },
});

app.use(sessionMiddleware);
app.use((req,res,next) => {
    //これの確認を忘れずに
    if(app.get("env") === "production") {
        req.session.cookie.secure = true;
    }
    next();
});

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

/* passportの設定 */
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.loggedIn = req.isAuthenticated();
    
    var url = req.url;
    pathId = url.split("/"); //これをio内部で行いたい   
    if(req.session.currentUser){
        res.locals.currentUser = req.session.currentUser.name.first + "_" + req.session.currentUser.name.last;
        res.locals.userId = req.session.currentUser._id;
    } 
    next();
});

/* routerの読み込み */
app.use("/",indexRoutes);
app.use("/api",apiRoutes);

/* errorハンドラー　一旦エラーハンドラはこちらで定義して、後に有効化する */
//app.use(errorRoutes);

app.use(function notFoundError(req,res,next){
    res.status(404);
});

app.use(function errorHandler(err,req,res,next){
    console.log(err.stack);
    res.status(err.status||500).json({
        status : err.status,
        error : err
    });
});

/* サーバーの起動 */
const PORT = process.env.PORT || 3001
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
    var userId = socket.request.session.currentUser._id;
    var username = socket.request.session.currentUser.name.first + "_" + socket.request.session.currentUser.name.last

    //メッセージの作成処理
    socket.on("message",(message) => {
        //ルームへの入室
        if(!room){
            var room = message.id;
            socket.join(room);
        }
        //データベースの保管層
        var newDate = message.day;
        var newMessage = new Message({
            userId : userId,
            username : username,
            date : message.day,
            text : message.text,
            time : message.time,
            customId : message.customId
        });

        Chat.findById(message.id)
        .then(chat => {
            var latest = chat.chatData.length;
            if(latest !== 0) {
                var latestDate = chat.chatData[latest-1].date;
            }

            if(latest === 0 || newDate!==latestDate){
                //パターン1
                Message.create(newMessage)
                .then(msg => {
                    Chat.findByIdAndUpdate(message.id,{
                        $push : {
                            chatData : {
                                date : message.day,
                                messages : msg._id
                            }
                        }
                    }).then(() => {
                        console.log("新しい日付、メッセージの作成に成功しました。");
                        io.to(room).emit("accepter",{
                            userId : userId,
                            user : username,
                            time : message.time,
                            date : message.day,
                            text : message.text,
                            customId : message.customId,
                        });
                    }).catch((err) => {
                        console.log(err.message);
                    });
                }).catch(err => {
                    console.log(err.message);
                });
            }else{
                Message.create(newMessage)
                .then(msg => {
                    Chat.update(
                        {_id : message.id,"chatData.date":latestDate},
                        {
                            $push : {
                                "chatData.$.messages" : msg._id
                            }
                        }
                    ).then(() => {
                        console.log("メッセージの作成に成功しました。");
                        io.to(room).emit("accepter",{
                            userId : userId,
                            user : username,
                            time : message.time,
                            text : message.text,
                            customId : message.customId,
                        });
                    }).catch((err) => {
                        console.log(err.message);
                    });
                }).catch(err => {
                    console.log(err.message);
                });
            }
        }).catch(err => {
            console.log(err.message);
        });
    });

    //メッセージの編集処理 エラー処理については後ほどやる
    socket.on("update",(message) => {
        //ルームへの入室
        if(!room){
            var room = message.chatId;
            socket.join(room);
            console.log(`${userId}は、${message.chatId}に入室しました。`);
        }

        Message.findOne({customId : message.customId},function(err,msg) {
            if(err || msg === null){
                console.log(err);
            }
            console.log(msg)
            Message.update(
                {customId : message.customId},
                {
                    $set : {
                        text : message.newMsg
                    }
                }
            ).then(msg => {
                io.to(room).emit("update",{
                    text : message.newMsg,
                    index : message.index
                });
                console.log("OK");
            }).catch(err => {
                console.log(err.message);
            });
            
        });
        
    });

    //メッセージの削除処理　これに関しては、Chatのデータベースの一つの連結の解除も必要（データベース二つに対応）
    socket.on("delete",(message) => {
        //ルームへの入室
        if(!room){
            var room = message.chatId;
            socket.join(room);
        }

        //削除機能　残りは配列の削除の場所のみ
        Message.findOne({customId : message.customId})
        .then(msg => {
            var msgId = msg._id;
            console.log(`msgId : ${msgId}`);
            var msgDate = msg.date;
            Chat.findOne({_id : message.chatId})
            .then(chat => {
                console.log(`chat :::::${chat}`);
                var leng = chat.chatData.length;
                for(var i=0;i<leng;i++){
                    if(chat.chatData[i].date === msgDate){
                        var msgLeng = chat.chatData[i].messages.length;
                        if(msgLeng <= 1){
                            //この時配列をそのまま削除する
                            console.log("結果1件未満");
                            Chat.updateOne(
                                {_id : message.chatId},
                                {
                                    $pull : {
                                        chatData : { //ここが消す対象になる
                                            date : msgDate
                                        }
                                    }
                                }
                            ).then(chat => {
                                console.log(`chatResult : ${chat}`);
                                Message.findByIdAndRemove(msgId,function(err,result){
                                    if(err){
                                        console.log(err.message);
                                    }
                                    io.to(room).emit("delete",{
                                        index : message.index, //これは取得してその番号を非表示化する
                                        confirm : "dateDeleted" //これを取得した際にはdateが消えるように作るためのもの
                                    });
                                    console.log("削除に成功");
                                });
                            }).catch(err => {
                                console.log(err.message);
                            })
                        }else if(msgLeng >= 2){
                            //配列の中身のみ削除する
                            console.log("結果2件以上");
                            Chat.update(
                                {_id : message.chatId,"chatData.date" : msgDate},
                                {
                                    $pull : {
                                        "chatData.$.messages" : msgId
                                    }
                                }
                            ).then(chat => {
                                Message.findByIdAndRemove(msgId,function(err,result){
                                    if(err){
                                        console.log(err.message);
                                    }
                                    io.to(room).emit("delete",{
                                        index : message.index //これは取得してその番号を非表示化する
                                    });
                                    console.log("削除に成功");
                                });
                            }).catch(err => {
                                console.log(err.message);
                            });
                        }else{
                            //エラー処理
                        }
                    }
                }
            }).catch(err => {
                console.log(err.message);
            });
        }).catch(err => {
            console.log(err.message);
        });

    });

    //ルームの退出処理が不明瞭　つまり、一つのルームに入った後に他のルームに切断せずに移動することができるのではないかということ　→この場合、　socketが複数のルームへと適用されるかも
    socket.on("disconnect",(room) => { //これに関しては、切断処理を行う（これを前に指定しまうと、送信前に切断されてしまうことに注意）
        socket.leave(room.id);
        console.log("user disconnected");
    });
});

//残り　エラールーターを読み込んでも、これがミルウェアとして常に読み込まれない　ここの要素としてエラーハンドリングを記載し、nextで繋げることはできるが、errorRouterを読み込むだけだとこれがなされない
//結果としては、errorRouterをapp.js内部で読み込むことで、全てのcontrollerからのnext(error)からここに繋げるようにしたい
