//チャンネル作成の際に用いるFormの出現の管理を行う 
window.addEventListener("DOMContentLoaded",() => {
    //pop-upの出現
    var showPopup = document.getElementById("addChannel");
    showPopup.onclick = function(){
        $(".popup").addClass("show").fadeIn();
    };
    //pop-upを閉じる
    var closePopup = document.getElementsByClassName("close-popup")[0];
    closePopup.onclick = function(){
        $(".popup").fadeOut();
    };

    //チャンネル作成
    var endPopup = document.getElementById("popup-end");
    endPopup.addEventListener("click",(e) => {
        e.preventDefault();

        //エラーメッセージの重複解除
        function deleteErrorMsg() {
            var errorMsg = document.getElementById("errorMsg");
            if(errorMsg.firstChild){
                errorMsg.removeChild(errorMsg.firstChild);
            }
        };
        deleteErrorMsg();
        
        function validator(){
            var chanName = document.getElementById("chanName").value;
            var chanDetail = document.getElementById("chanDetail").value;

            if(!chanName||!chanDetail){      
                var errorElement = document.createElement("p");
                errorElement.innerHTML = "チャンネル名、チャンネル詳細を入力してください。";
                errorMsg.appendChild(errorElement);    
                throw Error("errorです");
            }
        };
        validator();
        
        $(".popup").fadeOut();
        //formの送信
        var form = document.getElementById("popup");
        form.method = "POST";
        form.action = "/chat/create";
        form.submit();
        
        //最後にinputの中身の削除
        document.test.reset();
    });

},false);

/* 未完
    残りは、jqueryをjavascriptに変えること、関数化すると呼び出し元が気になってしまうので、それをなくすことができないのかと */