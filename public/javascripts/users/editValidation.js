window.addEventListener("DOMContentLoaded",() => { //DOMContentLoaded これに関してはDOMツリーの解析が完了してから
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
        

        //first name
        function fnValidator(){
            var firstName = document.getElementsByClassName("first")[0].value;
            if(nameChecker(firstName)){
                var msg = "First Name : 1文字目は大文字で全てアルファベットで記入してください。";
                errorCreater(msg);
            }
        };
        fnValidator();

        //last name
        function lnValidator(){
            var lastName = document.getElementsByClassName("last")[0].value;
            if(nameChecker(lastName)){
                var msg = "Last Name : 1文字目は大文字で全てアルファベットで記入してください。";
                errorCreater(msg);
            }
        }
        lnValidator();

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
            throw Error("エラー");
        };

        //formの送信 user作成の場合
        function editForm(){
            var form = document.getElementById("userEdit");
            form.method = "POST";
            form.action = "/users/mypage/update?_method=PUT";
            form.submit();
        };
        editForm();

    },false);
},false);
