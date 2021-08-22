window.addEventListener("DOMContentLoaded",() => {

    var urlParams = new URLSearchParams(window.location.search); //urlの取得
    var currentPage = parseInt(urlParams.get("page"));
    
    var searchResult = document.getElementsByClassName("searchResult")[0].value;
    var lastPage = Math.ceil(searchResult/5);

    //再検索の際のoptionの初期値の設定
    var initial = urlParams.get("sort");
    var search = urlParams.get("search");

    var select = document.getElementsByClassName("sort")[0];
    for(var i=0;i<3;i++){
        if(initial ===select.options[i].value){
            select.options[i].selected = true;
        }
    };

    //pagination
    var pagination = document.getElementsByClassName("pagination")[0];
    var next = document.getElementById("next");
    var previous = document.getElementById("previous");
    var current = document.getElementById("currentPage");

    if(currentPage!==lastPage){
        next.href = `/chat/channel?search=${search}&sort=${initial}&page=${currentPage+1}`;
    }
    
    if(currentPage!==1){
        previous.href =  `/chat/channel?search=${search}&sort=${initial}&page=${currentPage-1}`;
    }

    
    if(currentPage<=lastPage){
        current.innerHTML = `${currentPage}/${lastPage}`;
    }else{
        while(pagination.lastChild){
            pagination.removeChild(pagination.lastChild);
        }
        var error = document.createElement("p");
        error.innerHTML = "指定したページは存在しません。";
        pagination.appendChild(error);
    }

},false);