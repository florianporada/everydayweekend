(function($) {
    var html, body, content, toTop;

    $(document).ready(function(){
        initDOM();
        initFullPage(content);
        initGifs();
        initPopover(body);
    });

    function initDOM() {
        html = $('html');
        body = $('body');
        content = $('#content');
        toTop = $('#to-top');
    }

    function initFullPage(dom) {
        dom.fullpage({
            sectionSelector: 'section'
        });
    }

    function initGifs() {
        var xhr = $.get('http://api.giphy.com/v1/gifs/search?q=cinemagraph+movie&api_key=dc6zaTOxFJmzC'),
            fallback = [
                'assets/img/giphy_1.gif',
                'assets/img/giphy_2.gif',
                'assets/img/giphy_3.gif',
                'assets/img/giphy_4.gif'
            ];

        xhr.done(function(res) {
            var array = [];
            res.data.forEach(function(obj) {
                array.push(obj.images.original.url);
            });
            initBackgroundChanger(content, array);
        });

        xhr.fail(function() {
            initBackgroundChanger(content, fallback);
        });

    }
    
    function initBackgroundChanger(dom, array) {
        var el = dom.find('.bg-change'),
            change = function() {
                var bg = array[Math.floor(Math.random() * array.length)];
                el.each(function() {
                    $(this).css({
                        backgroundImage: 'url("' + bg + '")'
                    });
                });
                el.fadeTo(3000, 1);
            };

        change();
    }

    function initPopover(dom) {
        var popover = dom.find('.popover-footer');
        dom.find('.popover-open').click(function() {
            popover.fadeIn();
        });
        popover.click(function() {
            popover.fadeOut();
        });
    }

    //Spam protection
    $('a[href^="mailto:"]').each(function() {
        this.href = this.href.replace('(at)', '@').replace(/\(dot\)/g, '.');
    });

    //Click Toggle
    $.fn.clickToggle = function(func1, func2) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.click(function() {
            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };

}(jQuery));

// Facebook
(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.5&appId=211070032329860";
        fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Twitter
window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };

    return t;
}(document, "script", "twitter-wjs"));