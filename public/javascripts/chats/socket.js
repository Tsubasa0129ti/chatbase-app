//これも未完　socketが完了したら取り掛かる
import {uuid4} from "https://cdn.jsdelivr.net/gh/tracker1/node-uuid4/browser.mjs";

window.addEventListener("DOMContentLoaded",() => {
    const socket = io();

    /* 送信時の共通項 */
    var currentUser_id = document.getElementById("userId").value;
    var chatId = window.location.pathname.split("/")[2];


    /* 無名関数　＋ その他の関数 */
    //ユーザー比較用関数
    function compare(msg){
        var userData = msg.firstElementChild.firstElementChild;
        var userId = userData.href.split("/")[4];
        if(userId === currentUser_id){
            return true;
        }else{
            return false;
        }    
    };
    //submitイベント

    //updateイベント
    var updateEvent = function() {
        var msg = this.closest(".chat-devider");
        if(!msg){
            msg = this.closest(".socket-saving");
        }
        console.log(msg);
        //初期定義
        var textToHide = msg.children[0].children[2];
        var selfMsgResponser =  msg.children[1];
        var updateForm = msg.children[3];
        var toCancel = updateForm.children[1];
        var toUpdate = updateForm.children[2];
        //UI設定
        textToHide.style.display = "none";
        selfMsgResponser.classList.remove("show");        
        updateForm.classList.add("show");
        //キャンセル時の処理
        toCancel.addEventListener("click",() => {
            updateForm.classList.remove("show");
            selfMsgResponser.classList.add("show");
            textToHide.style.display = "block";
        },false);
        //実行時の処理
        toUpdate.addEventListener("click",() => {
            var customId =  textToHide.nextElementSibling.value;

            var data = {
                chatId : chatId, //もしかしたら引数に必要かも
                newMsg : updateForm.children[0].value,
                index : getNumber(msg),
                customId : customId
            };
            console.log(data);
            socket.emit("update",data);

            //UIを戻す
            updateForm.classList.remove("show");
            selfMsgResponser.classList.add("show");
            textToHide.style.display = "block";
        },false);
    };

    function getNumber(msg) {
        var dbMsg = document.getElementsByClassName("chat-devider");
        var socketMsg = document.getElementsByClassName("socket-saving");

        if(msg.classList.value === "chat-devider"){
            //dbベース
            for(var i=0;i<dbMsg.length;i++){
                console.log(msg);
                if(dbMsg[i] === msg){
                    return i;
                }
            };
        }else{
            for(var i=0;i<socketMsg.length;i++){
                console.log(msg);
                if(socketMsg[i] === msg){
                    return i　+ dbMsg.length;
                }
            };
        }
    };

    //deleteイベント　修正点　UI cancel層の分離（もう一方作成するので、UIの後） UIの時にpopup出現時に他の要素の半透明化を図る
    var deleteEvent = function() {
        //初期定義
        var msg = this.closest(".chat-devider");
        if(!msg){
            msg = this.closest(".socket-saving");
        }

        //deletePopupの取得
        var deletePopup = document.getElementById("deletePopup");
        //var toCancel = deletePopup.children[1]; //一と４に関しては同様の変数名をつけた
        var deleteData = deletePopup.children[3];
        var toCancel = deletePopup.children[4]; //これで上書きされてしまっているだけか
        var toDelete = deletePopup.children[5];

        //msgからデータを取得する
        var userData = msg.children[0];
        var data = [];
        for(var i=0;i<userData.children.length;i++){
            data[i] = userData.children[i].textContent;
            console.log(data[i]);
            if(!data[i]){ //これに関しては分岐が正しく動作するのかを確認
                data[i] = userData.children[i].value;
            }
        };

        //そして、これをpopupに移す
        for(var i=0;i<deleteData.children.length;i++){
            deleteData.children[i].textContent = data[i];
        };

        //関数軍　UI変更関数　UI戻す関数　
        var hidePopup = function(){
            //ここにてpopupの消失する
            deletePopup.classList.remove("show-popup");
        };

        //popupの生成
        deletePopup.classList.add("show-popup");
        //追加で他の要素のopacityを下げるなどしたい

        //キャンセル等クリック時の処理を作る
        toCancel.addEventListener("click",hidePopup,false);
        //削除等クリック時の処理を作る
        toDelete.addEventListener("click",() => {
            //データの取得と送信
            var socketData = {
                chatId : chatId,
                customId : data[3],
                index : getNumber(msg)
            };
            console.log(socketData);
            socket.emit("delete",socketData);
            //UIを戻す
            hidePopup();
        },false);

    };


    
    /* 下記、チャットの作成処理　javascriptに変更するかも　ただし、画面固定をする */
    $("#chat-form").submit(() => {
        const customId = uuid4();
        var date = new Date();
        var dayGetter = ["日","月","火","水","木","金","土"]; 

        var message = {
            text : document.getElementById("chat-input").value,
            id : chatId,
            customId : customId,
            day : `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日(${dayGetter[date.getDay()]})`,
            time : `${date.getHours()}:${date.getMinutes()}`
        };

        if(message.text){
            socket.emit("message",message);
            $("#chat-input").val("");
            return false;
        } 
    });    

    socket.on("accepter",(message) => {
        var element = document.getElementById("chat");　//chat（親クラスの取得）
        var copied = element.lastElementChild.cloneNode(true);　//子クラスのコピー
        element.appendChild(copied);
        display(message); //中身の書き換えを行なっている

        var socketChat = document.querySelectorAll(".socket-saving");
        socketChat.forEach((msg) => {
            //共通定義
            var selfMsgResponser = msg.children[1];
            var msgResponser = msg.children[2];
            //mouseoverイベント
            msg.addEventListener("mouseenter",() => {
                console.log("aaa")
                if(compare(msg) ===true){
                    selfMsgResponser.classList.add("show");
                    var updateMsg = selfMsgResponser.children[2];
                    var deleteMsg = selfMsgResponser.children[3];

                    //イベントハンドラ
                    updateMsg.addEventListener("click",updateEvent,false);
                    deleteMsg.addEventListener("click",deleteEvent,false);
                }else{
                    msgResponser.classList.add("show");
                }
            },false);
            //mouseleaveイベント
            msg.addEventListener("mouseleave",() => {
                if(compare(msg) === true){
                    selfMsgResponser.classList.remove("show");
                }else{
                    msgResponser.classList.remove("show");
                }
            },false);
        });
        
    });

    //一旦ここにおく（多分修正する）
    function display(message){ //これ親要素のみ取得して配列として、それぞれに分配できない？
        var i = document.getElementsByClassName("socket-saving").length - 2;
        document.getElementsByClassName("socketUser")[i].innerHTML = message.user;
        document.getElementsByClassName("socketUser")[i].href = `/users/${message.userId}`;
        document.getElementsByClassName("socketTime")[i].innerHTML = message.time;
        document.getElementsByClassName("socketMsg")[i].innerHTML = message.text;
        document.getElementsByClassName("customId")[i].value = message.customId;
        //message.dateが送信された場合のみ
        if(message.date){
            document.getElementsByClassName("dateEmitter")[0].innerHTML = message.date;
        }
    };

    //chat-deviderに対応
    var chat = document.querySelectorAll(".chat-devider");
    chat.forEach((msg) => {
        //共通項
        var selfMsgResponser = msg.children[1]; 
        var msgResponser = msg.children[2];
        //mouseoverイベント（database）
        msg.addEventListener("mouseenter",() => {
            if(compare(msg) === true){
                //必要なデータの定義をしておく        
                selfMsgResponser.classList.add("show");
                var updateMsg = selfMsgResponser.children[2];
                var deleteMsg = selfMsgResponser.children[3];

                updateMsg.addEventListener("click",updateEvent,false);
                deleteMsg.addEventListener("click",deleteEvent,false);

            }else{
                msgResponser.classList.add("show");
            }
        },false);
        //mouseleaveイベント（database）
        msg.addEventListener("mouseleave",() => {
            if(compare(msg) === true){
                selfMsgResponser.classList.remove("show");
            }else{
                msgResponser.classList.remove("show");
            }
        },false);
    });

    socket.on("update",(message) => {
        var index = parseInt(message.index,10);
        var dbMsg = document.getElementsByClassName("chat-devider");
        var socketMsg = document.getElementsByClassName("socket-saving");

        var newIndex = index - dbMsg.length;
        if(newIndex <=-1){
            dbMsg[index].children[0].children[2].innerHTML = message.text;
        }else{
            socketMsg[newIndex].children[0].children[2].innerHTML = message.text;
        }
    });

    socket.on("delete",(message) => {　//今回もしデータが一件のみであった場合にはdateの表記も消すべき　これに関しては、一件のみであった時はemitで情報出力して、そのときに対応するdateを見えなくする
        var index = parseInt(message.index,10);
        var dbMsg = document.getElementsByClassName("chat-devider");
        var socketMsg = document.getElementsByClassName("socket-saving");

        var newIndex = index - dbMsg.length;
        if(newIndex <=-1){
            dbMsg[index].style.display = "none"; //特定の番号の要素を非表示化する
        }else{
            socketMsg[newIndex].style.display = "none";
        }
        
        //日付をsocketで出力している場合のみの処理
        if(message.confirm){
            if(newIndex <= -1){
                //この時データベース内の日付の不可視化を実行する
                var dateElement = dbMsg[index].previousElementSibling;
                dateElement.style.display = "none";
            }else{
                //socketの日付の削除を行う
                var dateElement = socketMsg[newIndex].previousElementSibling;
                dateElement.style.display = "none"
            }
        }
        //updateと統一化する
        /* if(compareData(message)){
            dbMsg[index].style.display = "none";
        }else{
            socketMsg[newIndex].style.display = "none";
        } */
    });

    function compareData(message){
        var index = parseInt(message.index,10);
        var dbMsg = document.getElementsByClassName("chat-devider");
        var socketMsg = document.getElementsByClassName("socket-saving");

        var newIndex = index - dbMsg.length;
        if(newIndex <=-1){
            return true;
        }else{
            return false;
        }
    }
           
},false);