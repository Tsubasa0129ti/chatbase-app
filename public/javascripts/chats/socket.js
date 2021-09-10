//これも未完　socketが完了したら取り掛かる
import {uuid4} from "https://cdn.jsdelivr.net/gh/tracker1/node-uuid4/browser.mjs";

window.addEventListener("DOMContentLoaded",() => {
    const socket = io();
    //現在のログインユーザー
    var currentUser_id = document.getElementById("userId").value;
    
    //submit時の処理
    $("#chat-form").submit(() => {
        const customId = uuid4();
        var date = new Date();
        var dayGetter = ["日","月","火","水","木","金","土"]; 

        var message = {
            text : document.getElementById("chat-input").value,
            id : window.location.pathname.split("/")[2],
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

    function display(message){
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

    //chat-savingのmouseイベントハンドラ　かなりコンパクトにまとめたつもり
    var message = document.querySelectorAll(".message");
    message.forEach(function(msg){
        msg.addEventListener("mouseover",function(){
            if(compare(msg) === true){
                $(".selfMsgResponser").addClass(".show").fadeIn();
            }else{
                $(".msgResponser").addClass(".show").fadeIn();
            }
        },false);
        /* msg.addEventListener("mouseleave",function(){
            if(compare(msg) === true){
                $(".selfMsgResponser").fadeOut();
            }else{
                $(".msgResponser").fadeOut();
            }
        },false); */
    });

    //socket-savingのmouseイベントハンドラ　
    var socketMsg = document.querySelectorAll(".socketMsg");
    socketMsg.forEach(function(msg) {
        msg.addEventListener("mouseover",function(){
            if(compare(msg) === true){
                $(".selfMsgResponser").addClass(".show").fadeIn();
            }else{
                $(".msgResponser").addClass(".show").fadeIn();
            }
        });
        /* msg.addEventListener("mouseleave",function(){
            if(compare(msg) === true){
                $(".selfMsgResponser").fadeOut();
            }else{
                $(".msgResponser").fadeOut();
            }
        }); */
    });

    function compare(msg){
        var userData = msg.previousElementSibling.previousElementSibling;
        var userId = userData.href.split("/")[4];
        if(userId === currentUser_id){
            return true;
        }else{
            return false;
        }    
    }

    
    //編集時の処理
    let toUpdate = document.getElementsByClassName("updateMsg")[0];
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
                newMsg : newMsg,
                editPlace : editPlace
            };
            console.log(data);
            //socket.emit("update",data);
            $("toUpdate").fadeOut();
        },false);

    },false);

},false);