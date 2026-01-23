/*  Theme Name: Globing | Responsive Landing Page Template
    Author: Themesbrand
    Version: 1.0.0
    File Description:Main JS file of the template
*/

! function($) {
    "use strict";

    var GlobingApp = function() {};

    GlobingApp.prototype.initStickyMenu = function() {
        $(window).scroll(function() {
            var scroll = $(window).scrollTop();

            if (scroll >= 50) {
                $(".sticky").addClass("nav-sticky");
            } else {
                $(".sticky").removeClass("nav-sticky");
            }
        });
    },

    GlobingApp.prototype.initSmoothLink = function() {
        $('.navbar-nav a').on('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 0
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
    },

    GlobingApp.prototype.initScrollspy = function() {
        $("#navbarCollapse").scrollspy({ offset: 0 });
    },

    GlobingApp.prototype.initTestimonial = function() {
        if($('.test_slider').length){
            var slider4 = $('.test_slider');

            slider4.owlCarousel(
            {
                items:1,
                loop:true,
                dots:false,
                autoplay:true,
                navSpeed: 1000,
                smartSpeed: 1000,
                autoplaySpeed: 1000
            });

            if($('.test_nav_left').length && $('.test_nav_right').length)
            {
                var left = $('.test_nav_left');
                var right = $('.test_nav_right');

                left.on('click', function()
                {
                    slider4.trigger('prev.owl.carousel');
                });

                right.on('click', function()
                {
                    slider4.trigger('next.owl.carousel');
                });
            }
        }
    },

    GlobingApp.prototype.initContact = function() {
        $('#contact-form').submit(function() {

            var action = $(this).attr('action');

            $("#message").slideUp(750, function() {
                $('#message').hide();

                $('#submit')
                    .before('<img src="images/ajax-loader.gif" class="contact-loader" />')
                    .attr('disabled', 'disabled');

                $.post(action, {
                        name: $('#name').val(),
                        email: $('#email').val(),
                        comments: $('#comments').val(),
                    },
                    function(data) {
                        document.getElementById('message').innerHTML = data;
                        $('#message').slideDown('slow');
                        $('#cform img.contact-loader').fadeOut('slow', function() {
                            $(this).remove()
                        });
                        $('#submit').removeAttr('disabled');
                        if (data.match('success') != null) $('#cform').slideUp('slow');
                    }
                );

            });

            return false;

        });
    },

     GlobingApp.prototype.initBacktoTop = function() {
        $(window).scroll(function(){
            if ($(this).scrollTop() > 100) {
                $('.back-to-top').fadeIn();
            } else {
                $('.back-to-top').fadeOut();
            }
        });
        $('.back-to-top').click(function(){
            $("html, body").animate({ scrollTop: 0 }, 1000);
            return false;
        });
    },


    GlobingApp.prototype.init = function() {
        this.initStickyMenu();
        this.initSmoothLink();
        this.initScrollspy();
        this.initTestimonial();
        this.initContact();
        this.initBacktoTop();
    },

    //init
    $.GlobingApp = new GlobingApp, $.GlobingApp.Constructor = GlobingApp
}(window.jQuery),

//initializing
function($) {
    "use strict";
    $.GlobingApp.init();
}(window.jQuery);



