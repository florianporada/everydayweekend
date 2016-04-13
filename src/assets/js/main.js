(function($) {
    var html, body, content, toTop;

    $(document).ready(function(){
        initDOM();
        initFullPage(content);
        initBackgroundChanger(content);
        initPopover(content);
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
    
    function initBackgroundChanger(dom) {
        var el = dom.find('.bg-change'),
            bgs = [
                'https://media.giphy.com/media/xT1XGPm6RZ01MvmtNK/giphy.gif'
            ],
            bg = bgs[Math.floor(Math.random() * bgs.length)];

        el.each(function() {
            $(this).css({
                backgroundImage: 'url("' + bg + '")'
            })
        })
    }

    function initPopover(dom) {
        var popover = dom.find('.popover-footer');
        dom.find('.popover-open').clickToggle(function() {
            popover.fadeIn();
        }, function() {
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