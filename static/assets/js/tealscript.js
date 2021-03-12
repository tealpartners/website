window.onload = function () {
    var toggles = document.getElementsByClassName('top-navigation__toggle');
    for (var i = 0; i < toggles.length; i++) {
        var toggle = toggles[i];
        toggle.onclick = function () {
            var navigations = document.getElementsByClassName('top-navigation');
            for (var i = 0; i < navigations.length; i++) {
                var navigation = navigations[i];
                navigation.classList.toggle("fullscreen");
            }
        }
    }

    if ((navigator.platform.indexOf('iPhone') != -1) || (navigator.platform.indexOf('iPad') != -1) || (navigator.platform.indexOf('iPod') != -1)) 
    {
        /* if we're on iOS, open in Apple Maps */
        const queryParam = encodeURIComponent('Van de Wervestraat 20 bus 206 2060 Antwerpen België');
        const href = 'http://maps.apple.com/?q=' + queryParam;
        var adresses = document.getElementsByClassName('map-link');
        for (var i = 0; i < adresses.length; i++) {
            var adress = adresses[i];
            adress.href = href;
        }
    }


    var storage = myStorage = window.localStorage;

    //3 possible values
    //1: null --> user did not accept or decline cookie statement 
    //2: 'true' --> user accepted cookie statement
    //3: 'false' --> user declined cookie statement
    var COOKIE_PERMISSION_KEY = 'cookiePermission'
    var cookiesAccepted = storage.getItem(COOKIE_PERMISSION_KEY);

    if (cookiesAccepted === null) {
        var cookieDialog = document.getElementById('cookieDialog');
        var cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
        var cookieDeclineBtn = document.getElementById('cookieDeclineBtn');

        if (cookieDialog) {
            cookieDialog.style.display = 'block';
        }

        if (cookieAcceptBtn) {
            cookieAcceptBtn.addEventListener("click", function() {
                storage.setItem(COOKIE_PERMISSION_KEY, 'true');
                cookieDialog.style.display = 'none';
            });
        }

        if (cookieDeclineBtn) {
            cookieDeclineBtn.addEventListener("click", function() {
                storage.setItem(COOKIE_PERMISSION_KEY, 'false');
                cookieDialog.style.display = 'none';
            });
        }
    }

    if (cookiesAccepted === 'true') {
        loadHotjar();
        loadGoogleAnalytics();
        loadLinkedIn();
    }


    function loadHotjar() {
        //<!-- Hotjar Tracking Code for http://www.tealpartners.com -->

        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:527886,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }

    function loadGoogleAnalytics() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-78961303-1';

        var tag = document.getElementsByTagName('script')[0];
        tag.parentNode.insertBefore(script, tag);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
    
        gtag('config', 'UA-78961303-1');
    }


    function loadLinkedIn() {
        _linkedin_partner_id = "2040706"; 
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []; window._linkedin_data_partner_ids.push(_linkedin_partner_id);

        (function(){var s = document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type = "text/javascript";b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js"; s.parentNode.insertBefore(b, s);})();
    }
}
