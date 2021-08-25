window.addEventListener("DOMContentLoaded",() => {
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
    var result = arr["first"];
    
    if(result){
        document.getElementsByClassName("first")[0].value = arr["first"];
        document.getElementsByClassName("last")[0].value = arr["last"];
        document.getElementsByClassName("email")[0].value = arr["email"];
        document.getElementsByClassName("age")[0].value = arr["age"];
    }
    
},false);