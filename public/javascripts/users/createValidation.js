window.addEventListener("DOMContentLoaded",() => {
    
    var submit = document.querySelector(".submit");
    submit.addEventListener("click",(e) => {
        e.preventDefault();

        //エラーメッセージの取得
        const errorMsg = document.getElementsByClassName("errorMsg")[0];

        //エラーメッセージのクリアをする
        if(errorMsg.firstChild){
            errorMsg.removeChild(errorMsg.firstChild);
        }
        
        //バリデーション実行関数
        (function(){
            if(fnValidator()&&lnValidator()&&emailValidator()&&passValidator()&&pcValidator()){
                postForm();
            }else{
                throw new Error();
            }
        }());

        /* 以下、定義済関数 */
        //first name
        function fnValidator(){
            var firstName = document.getElementsByClassName("first")[0].value;
            if(nameChecker(firstName)){
                var msg = "First Name : 1文字目は大文字で全てアルファベットで記入してください。";
                errorCreater(msg);
            }else{
                return true;
            }
        };
        
        //last name
        function lnValidator(){
            var lastName = document.getElementsByClassName("last")[0].value;
            if(nameChecker(lastName)){
                var msg = "Last Name : 1文字目は大文字で全てアルファベットで記入してください。";
                errorCreater(msg);
            }else{
                return true;
            }
        };
        
        //email
        function emailValidator(){
            var email = document.getElementsByClassName("email")[0].value;
            if(emailChecker(email)){
                var msg = "Email : 正しいメールアドレスを記入してください。";
                errorCreater(msg);
            }else{
                return true;
            }
        };
        
        //password
        function passValidator(){
            var password = document.getElementsByClassName("password")[0].value;
            if(password.length>=8&&password.length<=16){
                if(isUpper(password)){
                    if(numIncluder(password)){
                        if(strChecker(password)){
                            console.log("Clear");
                            return true;
                        }else{
                            var msg = "Password : 半角英数字で設定してください。";
                            errorCreater(msg);
                        }
                    }else{
                        var msg = "Password : 数値も含めてください。";
                        errorCreater(msg);
                    }
                }else{
                    var msg = "Password : 最初の文字は大文字に設定してください。";
                    errorCreater(msg);
                }
            }else{
                var msg = "Password : ８文字以上16文字以下で設定してください。";
                errorCreater(msg);
            }
        };
        
        //password confirm
        function pcValidator(){
            var password = document.getElementsByClassName("password")[0].value;
            var passCheck = document.getElementsByClassName("passCheck")[0].value;
            if(password !== passCheck){
                var msg = "Password Confirm : パスワードとパスワードの確認が一致しません。";
                errorCreater(msg);
            }else{
                return true;
            }              
        };
        
        //check関数
        function nameChecker(str){
            var checker = str.match(/[A-Z]{1}[A-Za-z]*/);
            if(!checker){
                return true;
            }
        };

        function emailChecker(str){
            var checker = str.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/);
            if(!checker){
                return true;
            }else{
                return false;
            }
        };

        function isUpper(str){
            var checker = str.match(/^[A-Z]/);
            if(checker){
                return true; 
            }
        };

        function numIncluder(str){
            var checker = str.search(/[0-9]/);
            if(checker !== -1){
                return true;
            }
        };

        function strChecker(str){
            console.log(str);
            var checker = str.match(/^[A-Za-z0-9]+$/);
            console.log(checker);
            if(checker){
                console.log(checker);
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

        //formの送信 user作成の場合
        function postForm(){
            var form = document.getElementsByClassName("userCreate")[0];
            form.method = "POST";
            form.action = "/users/create";
            form.submit();
        };

    },false);
},false);
