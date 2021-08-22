window.addEventListener("DOMContentLoaded",() => {
    //pop-upの出現
    $("#addChannel").on("click",function(){
        $(".popup").addClass("show").fadeIn();
    });
    
    $(".close-popup").on("click",function(){
        $(".popup").fadeOut();
    });

    //チャンネル作成
    var addChan = document.getElementById("popup-end");
    addChan.addEventListener("click",(e) => {
        e.preventDefault();

        //エラーメッセージの重複解除
        var errorMsg = document.getElementById("errorMsg");
        if(errorMsg.firstChild){
            errorMsg.removeChild(errorMsg.firstChild);
        }

        //エラー回避のためのバリデーション
        var chanName = document.getElementById("chanName").value;
        var chanDetail = document.getElementById("chanDetail").value;

        function validator(){
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