document.addEventListener("DOMContentLoaded", function(){
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
});
