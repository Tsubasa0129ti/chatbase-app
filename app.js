/* モジュールの読み込み */
const express = require("express"),
    http = require("http"), //これhttpsに切り替えなければならないな
    helmet = require("helmet"),
    logger = require("morgan"),  
    cookieParser = require("cookie-parser"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    session = require("express-session"),
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
var socketio = require('./socketio');

var app = express();
app.use(helmet()); //コレはまた今度やるけど、セキュリティ

/* モジュールの使用 */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride("_method"));
app.use(cookieParser());

var sessionMiddleware = session({
    secret : "keyboard cat",
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge :  60 * 60 * 1000,
        httpOnly : false
    }, //ちゃんとこれのsessionの設定は引き継いでいるみたいだな　じゃあ認証のためのcookieを送ることができていないのではないか
    name : 'user_session',
    store : MongoStore.create({
        mongoUrl : "mongodb://localhost:27017/chatAppDB"
    })
});

app.use((req,res,next) => {//実装段階でcookieの使用をsecureのみに制限するみたいな感じのはず
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
    {
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useFindAndModify: false
    }
);
mongoose.set("useCreateIndex",true);
const db = mongoose.connection;
db.once("open",() => {
    console.log("mongoose connected");
});

/* passportの設定 */
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* routerの読み込み */
app.use("/",indexRoutes);
app.use("/api",apiRoutes);

/* errorハンドラー*/
app.use(errorRoutes);
app.use(errorControllers.ErrorHandler); //なぜかrouterとcontrollerを経て呼び出すことができないので、一旦controllerから直接呼び出している。

/* サーバーの起動 */
const PORT = process.env.PORT || 3001
const server = http.createServer(app); //こいつの位置に注意

server.listen(PORT,() => {
    console.log("LOCAL接続");
});

//socketについて
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

const io = require('socket.io')(server,{
    cors : {
        origin : 'http://localhost:3000/chat/page/:id',
        method : ["GET","POST"],
        credentials : true
    }
});

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

socketio(io);
//残り　エラールーターを読み込んでも、これがミルウェアとして常に読み込まれない　ここの要素としてエラーハンドリングを記載し、nextで繋げることはできるが、errorRouterを読み込むだけだとこれがなされない
//結果としては、errorRouterをapp.js内部で読み込むことで、全てのcontrollerからのnext(error)からここに繋げるようにしたい
//環境変数を取り入れる。ないとdeployは不安だな。というかあまりgitにも上げない方がいいかもしれない