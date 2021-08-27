//ページネーションと検索の並び替えの初期値の設定をしている
window.addEventListener("DOMContentLoaded",() => {

    var urlParams = new URLSearchParams(window.location.search); //urlの取得
    var currentPage = parseInt(urlParams.get("page"));
    
    var searchResult = document.getElementsByClassName("searchResult")[0].value;
    var lastPage = Math.ceil(searchResult/5);

    //再検索の際のoptionの初期値の設定
    var initial = urlParams.get("sort");
    var search = urlParams.get("search");

    function initialValue(){
        var select = document.getElementsByClassName("sort")[0];
        var selectOptions = select.children.length
        for(var i=1;i<selectOptions;i++){
            if(initial ===select.options[i].value){
                select.options[i].selected = true;
            }
        };
    };
    initialValue();

    //pagination
    var pagination = document.getElementsByClassName("pagination")[0];
    var next = document.getElementById("next");
    var previous = document.getElementById("previous");
    var current = document.getElementById("currentPage");

    var previousPage = `/chat/channel?search=${search}&sort=${initial}&page=${currentPage-1}`;
    var nextPage = `/chat/channel?search=${search}&sort=${initial}&page=${currentPage+1}`;

    if(currentPage<=lastPage){
        current.innerHTML = `${currentPage}/${lastPage}`;
        if(currentPage===1&&lastPage===1){
            console.log("none");
        }else if(currentPage===1){
            next.href = nextPage;
        }else if(currentPage===lastPage){
            previous.href =  previousPage;
        }else{
            previous.href =  previousPage;
            next.href = nextPage;
        }

    }else{
        while(pagination.lastChild){
            pagination.removeChild(pagination.lastChild);
        }
        var error = document.createElement("p");
        error.innerHTML = "指定したページは存在しません。";
        pagination.appendChild(error);
    }

},false);

/* 不足点
    変数が多く、これをまとめるというか減らしたい
    さらに、分岐の順番を逆にしたい */