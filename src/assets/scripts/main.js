function toggleMobileMenu(menu) {
    menu.classList.toggle('open');
}

$(window).scroll(function() {
    if ($(this).scrollTop() > 150){  
        $('header').addClass("fixed-header");
    }
    else{
        $('header').removeClass("fixed-header");
    }
});