!function(t) {
    function e() {
        var t = document.getElementsByClassName("AcceptUI")[0]
          , e = "ontouchstart"in window || navigator.msMaxTouchPoints;
        g(t, e ? "touchend" : "click", n),
        g(window, "message", U),
        a(t, m),
        O(),
        i(),
        d()
    }
    function n() {
        o()
    }
    function i() {
        var t = document.createElement("style");
        t.type = "text/css",
        t.innerHTML = "#AcceptUIContainer {visibility: hidden;opacity: 0; z-index: -1;}#AcceptUIBackground {visibility: hidden;opacity: 0;z-index: -1; }#AcceptUIContainer.show {visibility: visible; z-index: 200;opacity: 1; top: 50%;}#AcceptUIBackground.show { opacity: .7;visibility: visible;z-index: 999998;}",
        document.getElementsByTagName("head")[0].appendChild(t)
    }
    function a(t, e) {
        e.billingAddressOptions = t.getAttribute("data-billingAddressOptions"),
        e.apiLoginID = t.getAttribute("data-apiLoginID"),
        e.clientKey = t.getAttribute("data-clientKey"),
        e.acceptUIFormBtnTxt = t.getAttribute("data-acceptUIFormBtnTxt"),
        e.acceptUIFormHeaderTxt = t.getAttribute("data-acceptUIFormHeaderTxt"),
        e.addressOption = t.getAttribute("data-addressOption"),
        e.parentUrl = window.location.href,
        s = t.getAttribute("data-responseHandler")
    }
    function o() {
        var t = B(y);
        t.className = t.className = "show",
        overlay = E(h),
        overlay.className = "show"
    }
    function d() {
        u = setInterval(function() {
            r(window.location.origin, "SYNC")
        }, 1e3)
    }
    function r(t, e) {
        var n = {
            verifyOrigin: "AcceptUI",
            type: e,
            pktData: t
        };
        B(y).firstChild.contentWindow.postMessage(n, x())
    }
    var c, l, s, u, m = {}, p = (window.onload,
    567), y = "AcceptUIContainer", h = "AcceptUIBackground", g = function(t, e, n) {
        t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent && t.attachEvent("on" + e, n)
    }, f = function(t, e, n) {
        t.removeEventListener && t.removeEventListener(e, n, !1),
        t.detachEvent && t.detachEvent("on" + e, n)
    }, v = function(t, e, n) {
        var i;
        return function() {
            var a = this
              , o = arguments;
            i ? clearTimeout(i) : n && t.apply(a, o),
            i = setTimeout(function() {
                n || t.apply(a, o),
                i = null
            }, e || 100)
        }
    }, b = function() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }, w = function() {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }, A = function() {
        var t = document.body
          , e = document.documentElement;
        return Math.max(t.scrollHeight, t.offsetHeight, e.clientHeight, e.scrollHeight, e.offsetHeight)
    }, I = function() {
        var t = B(y)
          , e = b()
          , n = w();
        T() ? (t.style.top = "0",
        t.style.marginLeft = "-10px",
        t.style.width = "100%",
        t.style.height = "100%") : (e <= 550 ? (t.style.left = "0",
        t.style.width = e + "px",
        t.style.marginLeft = "0") : (t.style.left = "50%",
        t.style.width = "550px",
        t.style.marginLeft = "-275px"),
        n <= p ? (t.style.top = "0",
        t.style.height = n + "px",
        t.style.marginTop = "0") : (t.style.top = "50%",
        t.style.height = p + "px",
        t.style.marginTop = p / 2 * -1 + "px"))
    }, E = function(t) {
        var e = document.getElementById(t)
          , n = {
            position: "fixed",
            top: "0",
            left: "0",
            background: "#000",
            opacity: "0.6",
            filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)",
            minWidth: "100%",
            minHeight: "100%",
            zIndex: "999998"
        };
        if (!e) {
            (e = document.createElement("div")).id = t;
            for (var i in n)
                e.style[i] = n[i]
        }
        return e
    }, x = function() {
        return "https://jstest.authorize.net"
    }, k = function(t) {
        var e = document.getElementById(h);
        e ? (e.style.display = "block",
        e.style.height = A() + "px") : ((e = document.createElement("div")).innerHTML = '<div id="' + h + '" style="opacity: 0.1; background: #000000; position: absolute;  left: 0; right: 0; top: 0; bottom: 0; min-height: 450px;"></div>',
        e = e.firstChild,
        document.addEventListener && (e.style.zIndex = "999998"),
        document.body.insertBefore(e, t))
    }, B = function(t) {
        var e, n = document.getElementById(t);
        if (n && "IFRAME" === n.tagName ? (n.id = t + "_inner",
        (e = document.createElement("div")).id = t,
        e.appendChild(n)) : e = n,
        !e) {
            var i = document.createElement("iframe");
            i.frameBorder = 0,
            (e = document.createElement("div")).name = "Accept UI Merchant Window.",
            e.id = t,
            e.appendChild(i)
        }
        return e
    }, C = function(t) {
        return x() + "/v3/acceptMain.html"
    }, T = function() {
        var t = function() {
            return t.any
        };
        return t.Android = !!navigator.userAgent.match(/Android/i),
        t.BlackBerry = !!navigator.userAgent.match(/BlackBerry/i),
        t.iOS = !!navigator.userAgent.match(/iPhone|iPad|iPod/i),
        t.Opera = !!navigator.userAgent.match(/Opera Mini/i),
        t.Windows = !!navigator.userAgent.match(/IEMobile/i),
        t.any = t.Android || t.BlackBerry || t.iOS || t.Opera || t.Windows,
        t
    }(), O = function(t) {
        var e = B(y)
          , n = e.firstChild
          , i = C()
          , a = E(h)
          , o = ~navigator.userAgent.indexOf("Android") && navigator.userAgent.match(/Chrome\/[.0-9]* Mobile/);
        T() ? (p = w(),
        e.style.borderRadius = "0px") : e.style.borderRadius = "6px",
        e.style.visibility = "",
        e.style.position = "absolute",
        e.style.boxShadow = "rgba(0, 0, 0, 0.40) 5px 5px 16px",
        e.style.zIndex = "999999",
        e.style.display = "block",
        o || (e.style.overflow = "hidden"),
        n.src = i,
        n.style.height = "100%",
        n.style.width = "100%",
        n.style.scrolling = "no",
        n.style.seamless = "seamless",
        n.style.overflowY = "hidden",
        n.style.overflowX = "hidden",
        document.body.appendChild(a),
        document.getElementById(y) || document.body.appendChild(e),
        c = v(I, 30),
        g(window, "resize", c),
        I(),
        k(document.getElementById(y));
        document.getElementById(h);
        window.scrollTo(0, 0)
    }, M = function() {
        var t, e;
        l ? (l.close(),
        l = null) : ((t = E(h)).parentElement === document.body && document.body.removeChild(t),
        (e = B(y)).parentElement === document.body && document.body.removeChild(e),
        c && f(window, "resize", c))
    }, U = function(t) {
        if ("object" == typeof t.data && t.data.verifyOrigin && "AcceptMain" === t.data.verifyOrigin)
            switch (t.data.type) {
            case "ACK":
                clearInterval(u),
                r(m, "INIT");
                break;
            case "FIT_WINDOW":
                t.data.pktData && t.data.pktData.height && (iframe = B(y),
                iframe.style.height = t.data.pktData.height + "px",
                iframe.firstChild.style.height = t.data.pktData.height + "px",
                p = t.data.pktData.height);
                break;
            case "RESPONSE":
                _sendRespondBackToMerchant(t.data.pktData),
                M(),
                O(),
                d();
                break;
            case "CLOSE_IFRAME":
                M(),
                O(),
                d()
            }
    };
    _sendRespondBackToMerchant = function(t) {
        "function" == typeof s ? s.call(null, t) : window[s](t)
    }
    ,
    "complete" === document.readyState ? e() : document.onreadystatechange = function() {
        "complete" == document.readyState && e()
    }
}(window.AcceptUI = window.AcceptUI || {});
