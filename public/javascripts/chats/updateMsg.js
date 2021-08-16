//クラスから要素を取得して、カーソルを合わせた時に、popupが出現するように設定する
$(".message").mouseover(function(){
    $(".msgResponser").addClass(".show").fadeIn();
});

$(".message").mouseout(function(){
    $(".msgResponser").fadeOut();
})
