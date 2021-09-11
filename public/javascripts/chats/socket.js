//これも未完　socketが完了したら取り掛かる
import {uuid4} from "https://cdn.jsdelivr.net/gh/tracker1/node-uuid4/browser.mjs";

window.addEventListener("DOMContentLoaded",() => {
    const socket = io();

    //送信時の共通項
    var currentUser_id = document.getElementById("userId").value;
    var chatId = window.location.pathname.split("/")[2];
    
    //submit時の処理
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
            $("#chat-input").val("");
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
    
    /* 下記は編集時の動作であり、今後大幅に変更するため、一旦飛ばす */

    //今後やること　①カーソルを合わせた時にデータの取得をする　これにより、必要な場所にformの取得をするようにする　②socketでコピー用のものをどうにかするしかなさそう

    /* var chat = document.querySelectorAll(".chat-devider");
    chat.forEach((msg) => {
        msg.addEventListener("mouseover",function(){
            if(compare(msg) === true){          
                //$(".selfMsgResponser").addClass(".show").fadeIn();
                var self = document.querySelectorAll(".selfMsgResponser");
                var data = jQuery(":hover");
                console.log(data)
            }else{
                $(".msgResponser").addClass(".show").fadeIn();
            }
        },false);
        msg.addEventListener("mouseleave",function(){
            if(compare(msg) === true){
                $(".selfMsgResponser").fadeOut();
            }else{
                $(".msgResponser").fadeOut();
            }
        },false);
    }); */
    
    //socket-savingのmouseイベントハンドラ　
    /* var socketChat = document.querySelectorAll(".socket-saving");
    socketChat.forEach(function(msg) {
        //mouseoverイベント（socket）
        msg.addEventListener("mouseover",function(){
            if(compare(msg) === true){
                $(".selfMsgResponser").addClass(".show").fadeIn(); //fadeinを指定してしまう

                var self = document.querySelectorAll(".selfMsgResponser");
                self.forEach((node) => {
                    node.classList.add("show");
                })
            }else{
                $(".msgResponser").addClass(".show").fadeIn();
            }
        });
        //mouseleaveイベント（socket）
        msg.addEventListener("mouseleave",function(){
            if(compare(msg) === true){
                $(".selfMsgResponser").fadeOut();
            }else{
                $(".msgResponser").fadeOut();
            }
        });
    }); */

    function compare(msg){
        var userData = msg.firstElementChild;
        var userId = userData.href.split("/")[4];
        if(userId === currentUser_id){
            return true;
        }else{
            return false;
        }    
    }

    //編集時の処理
    /* let toUpdate = document.getElementsByClassName("updateMsg")[0];
    toUpdate.addEventListener("click",() => {

        //編集用pop-upの出現（これに関しては共通項）
        $(".toUpdate").addClass(".show").fadeIn();
        $(".selfMsgResponser").fadeOut();

        //キャンセルクリック時
        var close = document.getElementsByClassName("close-popup")[0];
        close.addEventListener("click",() => {
            $(".toUpdate").fadeOut();
        },false);

        //データ編集時の処理
        var update = document.getElementsByClassName("update")[0];
        update.addEventListener("click",() => {
            //update時の処理を実行する　①データを特定のsocketに送信　②データベースの書き換え　③最後にsocketでの変更表示のための割り込み(２、３に関してはここでやるのかは未定)
            var newMsg = document.getElementsByClassName("newMsg")[0].value;

            //これら二つの情報をsocketのupdateに対して送信する
            var data = {
                chatId : chatId,
                newMsg : newMsg,
                editPlace : editPlace
            };
            console.log(data);
            socket.emit("update",data);
            $("toUpdate").fadeOut();
        },false);

    },false); */


    //テスト用のmouseoverの作成 データベースの編集のマスターのために使用
    var update = document.getElementsByClassName("update")[0];
        update.addEventListener("click",() => {
            //update時の処理を実行する　①データを特定のsocketに送信　②データベースの書き換え　③最後にsocketでの変更表示のための割り込み(２、３に関してはここでやるのかは未定)
            var newMsg = document.getElementsByClassName("newMsg")[0].value;

            //これら二つの情報をsocketのupdateに対して送信する
            var data = {
                id : chatId,
                msgId : "613c23e0fd86b49ecf64f96f",
                newMsg : newMsg,
            };
            console.log(data);
            socket.emit("update",data);
            $("toUpdate").fadeOut();
        },false);

},false);