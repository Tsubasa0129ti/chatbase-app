$("#addChannel").on("click",function(){
    $(".popup").addClass("show").fadeIn();
});

$("#popup-end").on("click",function(){
    $(".popup").fadeOut();
});

$(".close-popup").on("click",function(){
    $(".popup").fadeOut();
});