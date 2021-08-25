//edit Validationとまとめることも可能
window.addEventListener("DOMContentLoaded",() => {

    //都道府県の初期値設定
    var select = document.getElementsByClassName("prefecture")[0];
    var prefecture = document.getElementsByClassName("passer")[0].value;

    for(var i=0;i<=47;i++){
        if(select.options[i].value===prefecture){
            select.options[i].selected = true;
        }
    }

    //所属の初期値設定
    var radioSelect = document.getElementsByClassName("belongings");
    var belongings = document.getElementsByClassName("passer2")[0].value;

    for(var i=0;i<radioSelect.length;i++){
        if(radioSelect[i].value === belongings){
            radioSelect[i].checked = true
        }
    }


},false)