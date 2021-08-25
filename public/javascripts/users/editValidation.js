window.addEventListener("DOMContentLoaded",() => {
    var submit = document.querySelector(".submit");
    submit.addEventListener("click",(e) => {
        e.preventDefault();

        //エラーメッセージのクリア
        const errorMsg = document.getElementsByClassName("errorMsg")[0];
        if(errorMsg.firstChild){
            errorMsg.removeChild(errorMsg.firstChild);
        }

        (function(){
            if(fnValidator()&&lnValidator()){
                editForm();
            }else{
                throw new Error();
            }
        }());

        /* 以下、定義済み関数 */
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

        //check関数
        function nameChecker(str){
            var checker = str.match(/[A-Z]{1}[A-Za-z]*/);
            if(!checker){
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

        //formの送信関数
        function editForm(){
            var form = document.getElementById("userEdit");
            form.method = "POST";
            form.action = "/users/mypage/update?_method=PUT";
            form.submit();
        };

    },false);
},false);
