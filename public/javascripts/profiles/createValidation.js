window.addEventListener("DOMContentLoaded",() => {
    var submit = document.querySelector(".submit");
    submit.addEventListener("click",(e) => {
        e.preventDefault();

        //エラーメッセージをクリア
        const errorMsg = document.getElementsByClassName("errorMsg")[0];
        if(errorMsg.firstChild){
            errorMsg.removeChild(errorMsg.firstChild);
        }

        //form送信のためのメイン関数（バリデーション定義ずみ）
        (function(){
            if(introValidator()&&addressValidator()){
                postForm();
            }else{
                throw new Error();
            }
        }());

        /* 以下、定義済み関数 */
        //ひとことのvalidation
        function introValidator() {
            var intro = document.getElementsByClassName("intro")[0].value;
            if(intro>=100){
                var msg = "ひとこと　: ひとことは100文字以内に設定してください。";
                errorCreater(msg);
            }else{
                return true;
            }
        };
        //住所の正規表現を用いたvalidation
        function addressValidator() {
            var address = document.getElementsByClassName("address")[0].value;
            if(addressChecker(address)){
                var msg = "ハイフンを含めた、正しい郵便番号を記入してください。";
                errorCreater(msg);
            }else{
                return true;
            }
        };

        //check関数
        function addressChecker(str) {
            var checker = str.match(/^[0-9]{3}-[0-9]{4}$/);
            if(checker || str===""){
                return false;
            }else{
                return true;
            }
        };

        //error出力関数
        function errorCreater(msg){
            var errorElement = document.createElement("p");
            errorElement.innerHTML = msg;
            errorMsg.appendChild(errorElement);
            return false;
        };

        //form送信関数
        function postForm(){
            var form = document.getElementById("profileCreate");
            form.method = "POST";
            form.action = "/users/mypage/profile/create";
            form.submit();
        };

    },false);
},false);