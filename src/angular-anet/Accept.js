var Accept = function () {
  "use strict";

  function a(a) {
    var b;
    ((b = g.hash(a.responseText)) && b ? b = "79ec52f0ce86fb27c47d1f860ba62d34ad5fe6cd3778ee0952ac698f52096e81" !== b : 0) && (console.warn("Library is not coming from Accept server--- " + g.hash(a.responseText)), setTimeout(f, 2e3)), a = void 0
  }

  function b(a, b) {
    var c = null;
    c = "undefined" != typeof XDomainRequest ? new XDomainRequest : new XMLHttpRequest, c.open("get", a, !0), c.send(), c.onload = function () {
      setTimeout(function () {
        b(c)
      })
    }
  }

  function c(a) {
    var b = document.createElement("script");
    b.type = "text/javascript", b.src = a, (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(b)
  }

  function d(a, b) {
    console.warn("Accept.js is not loaded correctly");
    var c = {
      messages: {
        resultCode: "Ok",
        message: []
      }
    };
    c.messages.resultCode = "Error", c.messages.message.push({
      code: "E_WC_03",
      text: "Accept.js is not loaded correctly"
    }), "function" == typeof b ? b.call(null, c) : window[b](c)
  }

  function e() {
    document.getElementsByTagName("body")[0].addEventListener("handshake", function () {
      window.isReady = !0
    }, !1)
  }
  window.cdnPath = "https://jstest.authorize.net", window.cdnPath = window.cdnPath + "/v1/", window.encryptEndPoint = "https://apitest.authorize.net";
  var f = function () {
      Accept.dispatchData = function (a, b) {
        var c = {
          messages: {
            resultCode: "Ok",
            message: []
          }
        };
        c.messages.resultCode = "Error", c.messages.message.push({
          code: "E_WC_03",
          text: "Accept.js is not loaded correctly"
        }), "function" == typeof b ? b.call(null, c) : window[b](c)
      }
    },
    g = {};
  return g.hash = function (a) {
    a = a.utf8Encode();
    var b = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
      c = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
    a += String.fromCharCode(128);
    for (var d = a.length / 4 + 2, e = Math.ceil(d / 16), f = new Array(e), h = 0; h < e; h++) {
      f[h] = new Array(16);
      for (var i = 0; i < 16; i++) f[h][i] = a.charCodeAt(64 * h + 4 * i) << 24 | a.charCodeAt(64 * h + 4 * i + 1) << 16 | a.charCodeAt(64 * h + 4 * i + 2) << 8 | a.charCodeAt(64 * h + 4 * i + 3)
    }
    f[e - 1][14] = 8 * (a.length - 1) / Math.pow(2, 32), f[e - 1][14] = Math.floor(f[e - 1][14]), f[e - 1][15] = 8 * (a.length - 1) & 4294967295;
    var j, k, l, m, n, o, p, q, r = new Array(64);
    for (h = 0; h < e; h++) {
      for (var s = 0; s < 16; s++) r[s] = f[h][s];
      for (s = 16; s < 64; s++) r[s] = g.σ1(r[s - 2]) + r[s - 7] + g.σ0(r[s - 15]) + r[s - 16] & 4294967295;
      for (j = c[0], k = c[1], l = c[2], m = c[3], n = c[4], o = c[5], p = c[6], q = c[7], s = 0; s < 64; s++) {
        var t = q + g.Σ1(n) + g.Ch(n, o, p) + b[s] + r[s],
          u = g.Σ0(j) + g.Maj(j, k, l);
        q = p, p = o, o = n, n = m + t & 4294967295, m = l, l = k, k = j, j = t + u & 4294967295
      }
      c[0] = c[0] + j & 4294967295, c[1] = c[1] + k & 4294967295, c[2] = c[2] + l & 4294967295, c[3] = c[3] + m & 4294967295, c[4] = c[4] + n & 4294967295, c[5] = c[5] + o & 4294967295, c[6] = c[6] + p & 4294967295, c[7] = c[7] + q & 4294967295
    }
    return g.toHexStr(c[0]) + g.toHexStr(c[1]) + g.toHexStr(c[2]) + g.toHexStr(c[3]) + g.toHexStr(c[4]) + g.toHexStr(c[5]) + g.toHexStr(c[6]) + g.toHexStr(c[7])
  }, g.ROTR = function (a, b) {
    return b >>> a | b << 32 - a
  }, g.Σ0 = function (a) {
    return g.ROTR(2, a) ^ g.ROTR(13, a) ^ g.ROTR(22, a)
  }, g.Σ1 = function (a) {
    return g.ROTR(6, a) ^ g.ROTR(11, a) ^ g.ROTR(25, a)
  }, g.σ0 = function (a) {
    return g.ROTR(7, a) ^ g.ROTR(18, a) ^ a >>> 3
  }, g.σ1 = function (a) {
    return g.ROTR(17, a) ^ g.ROTR(19, a) ^ a >>> 10
  }, g.Ch = function (a, b, c) {
    return a & b ^ ~a & c
  }, g.Maj = function (a, b, c) {
    return a & b ^ a & c ^ b & c
  }, g.toHexStr = function (a) {
    for (var b, c = "", d = 7; d >= 0; d--) b = a >>> 4 * d & 15, c += b.toString(16);
    return c
  }, "complete" === document.readyState ? e() : window.addEventListener ? window.addEventListener("load", e, !1) : window.attachEvent ? window.attachEvent("onload", e) : window.onLoad && (window.onload = e), void 0 === String.prototype.utf8Encode && (String.prototype.utf8Encode = function () {
    return unescape(encodeURIComponent(this))
  }), void 0 === String.prototype.utf8Decode && (String.prototype.utf8Decode = function () {
    try {
      return decodeURIComponent(escape(this))
    } catch (a) {
      return this
    }
  }), c(cdnPath + "AcceptCore.js"), b(cdnPath + "AcceptCore.js", a), {
    dispatchData: d
  }
}();
