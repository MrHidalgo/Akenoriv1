function scrollWindowNavigationFixedLarge() {
    var countScroll = $(window).scrollTop(),
        navigationBlock = $('.header__fixed'),
        body = $("body");

    if (countScroll > 150) {
        body.addClass("fixed");
        navigationBlock.addClass("slideInDown");
    } else {
        body.removeClass("fixed");
        navigationBlock.removeClass("slideInDown");
    }
}


$(window).on("load resize ready scroll", function(){
    if($(window).width() > '1024') {
        scrollWindowNavigationFixedLarge();
    } else {
        $("body").removeClass("fixed");
        $('.header__fixed').removeClass("slideInDown");
    }
});


$(document).ready(function() {


    /* LOGO CLICK SCROLL TO TOP */
    $(".logotype__img").on("click", function(e) {
        $('body,html').animate(
            {
                scrollTop: 0
            }, 1000
        );
    });


    /* BTN BURGER */
    $(".btn-menu_js").on("click", function() {
        $(this).toggleClass("active");
        $(".nav").slideToggle(300);
        $("body").toggleClass("open-menu");
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
    $(".device__btn").on("click", function() {
        var linkAttr = $(this).attr("data-more");

        $(".device__btn").removeClass("active");
        $(this).addClass("active");

        $(".device__carousel").css(
            {
                opacity: 0,
                height: 0,
                visibility: "hidden"
            }
        );
        $(".device__carousel-" + linkAttr).css(
            {
                opacity: 1,
                height: "auto",
                visibility: "visible"
            }
        );
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


    /* BTN HEADER ARROW */
    $(".btn-arrow").hover(function() {
        $(this).toggleClass("animated pulse infinite");
    });


    /* SMOOTH SCROLL */
    $(".nav, .header__arrow").on("click", "a", function (e) {
        e.preventDefault();

        var id          = $(this).attr('href'),
            navHeight   = $(".header__fixed").outerHeight();

        $(".btn-menu_js").removeClass("active");
        $(".nav").slideUp(300);
        $("body").removeClass("open-menu");

        if(id === "#top") {
            $('body, html').animate({
                scrollTop: 0
            }, 1000);
        } else {
            var top;
            if($(window).width() > '1024') {
                top = $(id).offset().top - navHeight;
            } else {
                top = $(id).offset().top;
            }

            $('body, html').animate({
                scrollTop: top
            }, 1000);
        }
    });


    /* MODAL VIDEO */
    $(document).on("keyup", function(e) {
        if (e.keyCode == 27) {
            $("body").removeClass("open-popup");
            $(".modal").fadeOut(300);
        }
    });
    $(".btn-close").on("click", function(e) {
        e.preventDefault();

        $("body").removeClass("open-popup");
        $(".modal").fadeOut(300);
    });
    $('.quality__night-js').on("click", function(e) {
        $("body").addClass("open-popup");
        $(".modal_night").fadeIn(300);
    });
    $('.quality__day-js').on("click", function(e) {
        $("body").addClass("open-popup");
        $(".modal_day").fadeIn(300);
    });


    /* ANIMATION - VIEW PORT CHECK PAGE */
    // if($(window).width() > '767') {
    //     var classNameSection    =   ".main__title, .main__list, .difference__img, " +
    //         ".innovation__img, .price__row, .quality__row, .quality__text, " +
    //         ".phone__img, .install__row, .position__wrap, .technical__img, " +
    //         ".offer__title, .offer__img, .offer__title-sub, .offer__price, " +
    //         ".offer__row, .device, .information__row-left, .information__row-right, " +
    //         ".testimonials__row, .delivery__row";
    //
    //     $(classNameSection).addClass('hidden').viewportChecker({
    //             classToAdd: 'visible animated slideInUp',
    //             classToRemove : 'hidden',
    //             removeClassAfterAnimation: true
    //         }
    //     );
    //
    //     $(".header__img-shadow").addClass('hidden').viewportChecker({
    //             classToAdd: 'visible active',
    //             classToRemove : 'hidden',
    //             offset: -100,
    //             removeClassAfterAnimation: true
    //         }
    //     );
    //     $(".header__img-register").addClass('hidden').viewportChecker({
    //             classToAdd: 'visible active',
    //             classToRemove : 'hidden',
    //             offset: -100,
    //             removeClassAfterAnimation: true
    //         }
    //     );
    // }
});