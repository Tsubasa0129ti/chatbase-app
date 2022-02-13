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
var errorRoutes = require("./routes/errorRouter");
var errorControllers = require("./controllers/errorController");

/* appの指定 */
var app = express();
app.use(helmet());

/* モジュールの使用 */
app.set("view engine","ejs");
app.set(express.static(path.join(__dirname,"views")));
app.use(express.static("public"))

app.use(logger("dev"));
app.use(express.json());
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
    rolling : true,
    cookie : {
        maxAge :  60 * 60 * 1000,
        //secure : true 本番環境での有効化をする これ分岐によって実現したい
    },
    name : 'user_session',
    store : MongoStore.create({
        mongoUrl : "mongodb://localhost:27017/chatAppDB"
    })/* ,
    genid : function(req){
        console.log("new sessionID is created");
        return uuid.v4();
    }, */
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
    console.log("DB接続完了");
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

/* errorハンドラー*/
app.use(errorRoutes);
app.use(errorControllers.ErrorHandler); //なぜかrouterとcontrollerを経て呼び出すことができないので、一旦controllerから直接呼び出している。

/* サーバーの起動 */
const PORT = process.env.PORT || 3001
const server = http.createServer(app); //こいつの位置に注意

io = require("socket.io")(server,{
    cors : { //これを設定しているため、別のサイトのsessionを取得してしまっている。
        origin : 'http://localhost:3000',
        methods : ['GET','POST']
    }
});
/* controllerに移行する予定 */
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res || {}, next); //ここで受け渡しているsessionが認証のものと異なっている
});

server.listen(PORT,() => {
    console.log("LOCAL接続");
});

io.on("connection",(socket) => {
    /* var userId = socket.request.session.currentUser._id;
    var username = socket.request.session.currentUser.name.first + "_" + socket.request.session.currentUser.name.last
    console.log(`userId : ${userId} && username : ${username}`); */

    //メッセージの作成処理
    socket.on("message",async(message) => {
        try {
            //ルームへの入室
            if(!room){
                var room = message.id;
                socket.join(room);
                console.log('入室')
            }
            
            var obj = {
                userId : message.userId,
                username : message.username,
                date : message.date,
                text : message.text,
                time : message.time,
                customId : message.customId
            }

            var newMessage = new Message(obj);//万能型messageの作成

            var chat = await Chat.findById(message.id);
            var newMsg = await Message.create(newMessage);

            var leng = chat.chatData.length;

            if(leng !== 0) {
                var latestDate = chat.chatData.slice(-1)[0].date;
            }

            if(leng === 0 || obj.date!==latestDate){
                var promise = await Chat.findByIdAndUpdate(message.id,{
                    $push : {
                        chatData : {
                            date : message.date,
                            messages : newMsg._id
                        }
                    }
                }).exec();
                io.to(room).emit("accepter",obj);
            }else{
                var promise = await Chat.updateOne(
                    {_id : message.id,"chatData.date":latestDate},
                    {
                        $push : {
                            "chatData.$.messages" : newMsg._id
                        }
                    }
                ).exec();
                delete obj.date;
                io.to(room).emit("accepter",obj);
            }
        }catch(err){
            console.log(err.message);//next関数がないので、エラー処理が不十分になってしまっている。sessionと同時に使用可能にする。
        }
    });

    //メッセージの編集処理
    socket.on("update",async(message) => {
        try{
            if(!room){
                var room = message.chatId;
                socket.join(room);
                console.log(`${message.userId}は、${message.chatId}に入室しました。`);
            }

            var promise = await Message.updateOne(
                {customId : message.customId},
                {
                    $set : {
                        text : message.newMsg
                    }
                }
            ).exec();
            io.to(room).emit("update",{
                text : message.newMsg
            });
        }catch(err){
            console.log(err.message);
        }
    });

    //メッセージの削除処理
    socket.on("delete",async(message) => {

        try {
            if(!room){
                var room = message.chatId;
                socket.join(room);
            }

            var msg = await Message.findOne({customId:message.customId}).exec();
            var chat = await Chat.findById(message.chatId).exec();

            chat.chatData.forEach(async(element) => {
                if(element.date === msg.date){
                    var leng = element.messages.length;

                    if(leng === 1){ //書き込みが一つしかない場合
                        console.log('書き込み件数一件');
                        var promise = await Chat.updateOne(
                            {_id : message.chatId},
                            {
                                $pull : {
                                    chatData : {
                                        date : msg.date
                                    }
                                }
                            }
                        ).exec();
                    }else{
                        console.log(`書き込み件数${leng}件`);
                        var promise = await Chat.updateOne(
                            {_id : message.chatId,"chatData.date" : msg.date},
                            {
                                $pull : {
                                    "chatData.$.messages" : msg._id
                                }
                            }
                        ).exec(); //ここでは従属されているidが消されるはず
                    }
                    var promiseDel = await Message.findByIdAndDelete(msg._id).exec();
                    io.to(room).emit("delete");
                }
            });
        }catch(err){
            console.log(err);
        }
    });

    //ルームの退出処理が不明瞭　つまり、一つのルームに入った後に他のルームに切断せずに移動することができるのではないかということ　→この場合、　socketが複数のルームへと適用されるかも
    socket.on("disconnect",(room) => { //これに関しては、切断処理を行う（これを前に指定しまうと、送信前に切断されてしまうことに注意）
        socket.leave(room.id);
        console.log("user disconnected");
    });
});

//残り　エラールーターを読み込んでも、これがミルウェアとして常に読み込まれない　ここの要素としてエラーハンドリングを記載し、nextで繋げることはできるが、errorRouterを読み込むだけだとこれがなされない
//結果としては、errorRouterをapp.js内部で読み込むことで、全てのcontrollerからのnext(error)からここに繋げるようにしたい
