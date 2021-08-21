window.addEventListener("DOMContentLoaded",() => {
    //ここにcookieを表示する層を
    function getCookieArray(){
        var arr = new Array();
        if(document.cookie != ''){
            var tmp = document.cookie.split('; ');
            for(var i=0;i<tmp.length;i++){
            var data = tmp[i].split('=');
            arr[data[0]] = decodeURIComponent(data[1]);
            }
        }
        return arr;
    };

    var arr = getCookieArray();
    var username = arr["username"];

    if(username){
        document.getElementsByClassName("username")[0].value = username;
    }

},false);