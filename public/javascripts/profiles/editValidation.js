window.addEventListener("DOMContentLoaded",() => {
    var submit = document.querySelector(".submit");
    submit.addEventListener("click",(e) => {
        e.preventDefault();

        //エラーメッセージの取得
        const errorMsg = document.getElementsByClassName("errorMsg")[0];
        console.log(errorMsg);

        //エラーメッセージのクリアをする
        if(errorMsg.firstChild){
            errorMsg.removeChild(errorMsg.firstChild);
        }

        //ひとことのvalidation
        function introValidator() {
            var intro = document.getElementsByClassName("intro")[0].value;
            if(intro>=100){
                var msg = "ひとこと　: ひとことは100文字以内に設定してください。";
                errorCreater(msg);
            }
        };
        introValidator();

        //住所の正規表現を用いたvalidation
        function addressValidator() {
            var address = document.getElementsByClassName("address")[0].value;
            console.log(address);
            if(addressChecker(address)){
                var msg = "ハイフンを含めた、正しい郵便番号を記入してください。";
                errorCreater(msg);
            }
        };
        addressValidator();

        //check関数
        function addressChecker(str) {
            var checker = str.match(/^[0-9]{3}-[0-9]{4}$/);
            if(!checker){
                return true;
            }
        };

        //error出力関数
        function errorCreater(msg){
            var errorElement = document.createElement("p");
            errorElement.innerHTML = msg;
            errorMsg.appendChild(errorElement);
            throw Error("エラー");
        };

        //formの送信 user作成の場合
        function postForm(){
            var form = document.getElementById("profileEdit");
            form.method = "POST";
            form.action = "/users/mypage/profile/update?_method=PUT";
            form.submit();
        };
        postForm();

    },false);
},false);