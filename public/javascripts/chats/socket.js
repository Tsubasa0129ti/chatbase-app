//これも未完　socketが完了したら取り掛かる
import {uuid4} from "https://cdn.jsdelivr.net/gh/tracker1/node-uuid4/browser.mjs";

window.addEventListener("DOMContentLoaded",() => {
    const socket = io();

    //送信時の共通項
    var currentUser_id = document.getElementById("userId").value;
    var chatId = window.location.pathname.split("/")[2];
    
    /* 下記、チャットの作成処理 */
    $("#chat-form").submit(() => {
        const customId = uuid4();
        var date = new Date();
        var dayGetter = ["日","月","火","水","木","金","土"]; 

        var message = {
            text : document.getElementById("chat-input").value,
            id : chatId,
            customId : customId, //将来的にはcustomIDのみの運用を考えている
            day : `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日(${dayGetter[date.getDay()]})`,
            time : `${date.getHours()}:${date.getMinutes()}`
        };

        if(message.text){
            socket.emit("message",message);
            $("#chat-input").val(""); //ここは後ほど直す
            return false;
        } 
    });

    socket.on("accepter",(message) => {
        var element = document.getElementById("chat");　//chat（親クラスの取得）
        var copied = element.lastElementChild.cloneNode(true);　//子クラスのコピー
        element.appendChild(copied);
        display(message); //中身の書き換えを行なっている
    });

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
    }
    
    /* 下記、チャットの更新処理 */
    var chat = document.querySelectorAll(".chat-devider");
    var socketChat = document.querySelectorAll(".socket-saving");
    //chat-deviderに対応
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
                //updateMsg.addEventLister("click",updateEvent(msg));→これが理想系　ただし、mouseover時に全ての処理をしてしまう。。。

                updateMsg.addEventListener("click",() => {
                    //初期定義
                    var textToHide = msg.children[0].children[2];
                    var selfMsgResponser =  msg.children[1];
                    var updateForm = msg.children[3];
                    var toCancel = updateForm.children[1];
                    var toUpdate = updateForm.children[2];
                    //UI設定
                    textToHide.style.display = "none"; //まずは、送信者と名前以外のdisplayをnoneに設定
                    selfMsgResponser.classList.remove("show");//その後で、念の為、selfMsgResponserのfadeout //この間は、showの無効化をしたい        
                    updateForm.classList.add("show");//そして最後に、updateFormの出現
                    //キャンセル時の処理
                    toCancel.addEventListener("click",() => {
                        updateForm.classList.remove("show");
                        selfMsgResponser.classList.add("show");
                        textToHide.style.display = "block";
                    },false);
                    //実行時の処理
                    toUpdate.addEventListener("click",() => {
                        //dataの作成 ①msgId ②chatId ③newMsg ④index
                        var msgId = textToHide.nextElementSibling.value;
                        //順番の取得
                        var dbMsg = document.getElementsByClassName("chat-devider");
                        function getNumber(msg){
                            for(var i=0;i<dbMsg.length;i++){
                                console.log(msg);
                                if(dbMsg[i] === msg){
                                    return i;
                                }
                            };
                        };
                        var data = {
                            chatId : chatId, //もしかしたら引数に必要かも
                            msgId : msgId,
                            newMsg : updateForm.children[0].value,
                            index : getNumber(msg)
                        };
                        console.log(data);
                        socket.emit("update",data);
            
                        //UIを戻す
                        updateForm.classList.remove("show");
                        selfMsgResponser.classList.add("show");
                        textToHide.style.display = "block";
                    },false);
                });
                //deleteMsg.addEventListener("click",deleteEvent(msg));

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
    
    //socket-savingに対応　
    socketChat.forEach((msg) => {
        //共通項
        var selfMsgResponser = msg.children[1];
        var msgResponser = msg.children[2];
        //mouseoverイベント（socket）
        msg.addEventListener("mouseenter",() => {
            if(compare(msg) === true){
                selfMsgResponser.classList.add("show");
                var updateMsg = selfMsgResponser.children[2];
                var deleteMsg = selfMsgResponser.children[3];

                //ここにupdateイベントを記載
                updateMsg.addEventListener("click",() => {
                    //初期定義
                    var textToHide = msg.children[0].children[2];
                    var selfMsgResponser =  msg.children[1];
                    var updateForm = msg.children[3];
                    var toCancel = updateForm.children[1];
                    var toUpdate = updateForm.children[2];
                    //UI設定
                    textToHide.style.display = "none"; //まずは、送信者と名前以外のdisplayをnoneに設定
                    selfMsgResponser.classList.remove("show");//その後で、念の為、selfMsgResponserのfadeout //この間は、showの無効化をしたい        
                    updateForm.classList.add("show");//そして最後に、updateFormの出現
                    //キャンセル時の処理
                    toCancel.addEventListener("click",() => {
                        updateForm.classList.remove("show");
                        selfMsgResponser.classList.add("show");
                        textToHide.style.display = "block";
                    },false);
                    //実行時の処理
                    toUpdate.addEventListener("click",() => {
                        //dataの作成 msgIdにはアクセスできないのでどうしようか　更新をした際に、customIdを検索に用いる
                        var customId =  textToHide.nextElementSibling.value;
                        //番号の取得
                        var dbLeng = document.getElementsByClassName("chat-devider").length;
                        var socketMsg = document.getElementsByClassName("socket-saving");
                        function getNumber(msg){
                            for(var i=0;i<socketMsg.length;i++){
                                console.log(msg);
                                if(socketMsg[i] === msg){
                                    return i;
                                }
                            };
                        };

                        var data = {
                            chatId : chatId, //もしかしたら引数に必要かも
                            newMsg : updateForm.children[0].value,
                            index : dbLeng + getNumber(msg),
                            customId : customId
                        };
                        console.log(data);
                        socket.emit("update",data);
            
                        //UIを戻す
                        updateForm.classList.remove("show");
                        selfMsgResponser.classList.add("show");
                        textToHide.style.display = "block";
                    },false);
                });

                
            }else{
                msgResponser.classList.add("show");
            }
        },false);
        //mouseleaveイベント（socket）
        msg.addEventListener("mouseleave",() => {
            if(compare(msg) === true){
               selfMsgResponser.classList.remove("show");
            }else{
                msgResponser.classList.remove("show");
            }
        },false);
    });

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

    
           
},false);