//これも未完　socketが完了したら取り掛かる
import {uuid4} from "https://cdn.jsdelivr.net/gh/tracker1/node-uuid4/browser.mjs";

window.addEventListener("DOMContentLoaded",() => {
    const socket = io();
    //現在のログインユーザー
    var currentUser_id = document.getElementById("chat-id").value; //これの使用は、編集時のみのため、一旦保留（もちろん、これもsessionに変更予定 編集の作成時で可） 最悪比較の方法は変える　（）
    
    //submit時の処理
    $("#chat-form").submit(() => {
        const customId = uuid4();
        var date = new Date();
        var dayGetter = ["日","月","火","水","木","金","土"]; 

        var message = {
            text : document.getElementById("chat-input").value,
            id : window.location.pathname.split("/")[2],
            customId : customId,
            day : `${date.getFullYear()}年 ${date.getMonth()+1}月${date.getDate()}日(${dayGetter[date.getDay()]})`,
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
    }
    

    /* これかなり簡単に作ってしまっており、拡張性が皆無なため、後で修正する（とりあえず、今は先のが実行可能かを確かめる） */
    //下記は、カーソルを合わせた時の処理
    //下記は編集時の動作であり、今後大幅に変更するため、一旦飛ばす
    $(".message").mouseover(function(){
        var data = jQuery(":hover")[4];
        var cursolUser_id = data.children[0].href.split("/")[4];
        const editPlace = data.children[3].value; //編集場所 これらのデータを編集用などの関数に送る必要がある
        if(cursolUser_id===currentUser_id){
            $(".selfMsgResponser").addClass(".show").fadeIn();
            return true;
        }else{
            $(".msgResponser").addClass(".show").fadeIn();
            return false;
        }
        
    });

    //カーソルを離した時の処理
    $(".message").mouseout(function(){
        $(".msgResponser").fadeOut();
        $(".selfMsgResponser").fadeOut();
    });


    
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