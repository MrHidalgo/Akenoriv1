$(document).ready(function() {


    /* BTN BURGER */
    $(".btn-menu_js").on("click", function() {
        $(this).toggleClass("active");
    });


    /* SLIDER */
    $(".slider__carousel").owlCarousel({
        items:1,
        loop: true,
        dots: true,
        nav:true
    });
    var count = 1;
    $(".slider__carousel .owl-dot").each(function(){
        $(this).find("span").text("0" + count);
        count++;
    });


    /* DEVICE BTN */
    $(".device__btn").on("click", function(e) {
        e.preventDefault();

        $('.device__btn').removeClass("active");
        $(this).addClass("active");
    });
    $(".device__carousel").owlCarousel({
        items: 1,
        loop: true,
        dots: true,
        nav: true
    });


    /* TESTIMONIALS */
    $(".testimonials__carousel").owlCarousel({
        items: 1,
        loop: true,
        dots: true,
        nav: true
    });
    var count = 1;
    $(".testimonials__carousel .owl-dot").each(function(){
        $(this).find("span").text("0" + count);
        count++;
    });
});