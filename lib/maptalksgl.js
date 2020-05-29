/*!
 * @maptalks/gl v0.15.4
 * LICENSE : UNLICENSED
 * (c) 2016-2020 maptalks.org
 */
!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports, require("maptalks")) : "function" == typeof define && define.amd ? define([ "exports", "maptalks" ], t) : t((e = e || self).maptalksgl = {}, e.maptalks);
}(this, function(e, r) {
    "use strict";
    var t, c = (function(e) {
        e.exports = function() {
            var ne = function e(t) {
                return t instanceof Uint8Array || t instanceof Uint16Array || t instanceof Uint32Array || t instanceof Int8Array || t instanceof Int16Array || t instanceof Int32Array || t instanceof Float32Array || t instanceof Float64Array || t instanceof Uint8ClampedArray;
            }, ue = function e(t, n) {
                var r = Object.keys(n);
                for (var i = 0; i < r.length; ++i) {
                    t[r[i]] = n[r[i]];
                }
                return t;
            }, f = "\n";
            function l(e) {
                if (typeof atob !== "undefined") {
                    return atob(e);
                }
                return "base64:" + e;
            }
            function r(e) {
                var t = new Error("(regl) " + e);
                console.error(t);
                throw t;
            }
            function v(e, t) {
                if (!e) {
                    r(t);
                }
            }
            function i(e) {
                if (e) {
                    return ": " + e;
                }
                return "";
            }
            function e(e, t, n) {
                if (!(e in t)) {
                    r("unknown parameter (" + e + ")" + i(n) + ". possible values: " + Object.keys(t).join());
                }
            }
            function t(e, t) {
                if (!ne(e)) {
                    r("invalid parameter type" + i(t) + ". must be a typed array");
                }
            }
            function a(e, t) {
                switch (t) {
                  case "number":
                    return typeof e === "number";

                  case "object":
                    return typeof e === "object";

                  case "string":
                    return typeof e === "string";

                  case "boolean":
                    return typeof e === "boolean";

                  case "function":
                    return typeof e === "function";

                  case "undefined":
                    return typeof e === "undefined";

                  case "symbol":
                    return typeof e === "symbol";
                }
            }
            function n(e, t, n) {
                if (!a(e, t)) {
                    r("invalid parameter type" + i(n) + ". expected " + t + ", got " + typeof e);
                }
            }
            function o(e, t) {
                if (!(e >= 0 && (e | 0) === e)) {
                    r("invalid parameter type, (" + e + ")" + i(t) + ". must be a nonnegative integer");
                }
            }
            function s(e, t, n) {
                if (t.indexOf(e) < 0) {
                    r("invalid value" + i(n) + ". must be one of: " + t);
                }
            }
            var u = [ "gl", "canvas", "container", "attributes", "pixelRatio", "extensions", "optionalExtensions", "profile", "onDone" ];
            function c(e) {
                Object.keys(e).forEach(function(e) {
                    if (u.indexOf(e) < 0) {
                        r('invalid regl constructor argument "' + e + '". must be one of ' + u);
                    }
                });
            }
            function h(e, t) {
                e = e + "";
                while (e.length < t) {
                    e = " " + e;
                }
                return e;
            }
            function d() {
                this.name = "unknown";
                this.lines = [];
                this.index = {};
                this.hasErrors = false;
            }
            function p(e, t) {
                this.number = e;
                this.line = t;
                this.errors = [];
            }
            function m(e, t, n) {
                this.file = e;
                this.line = t;
                this.message = n;
            }
            function _() {
                var e = new Error();
                var t = (e.stack || e).toString();
                var n = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(t);
                if (n) {
                    return n[1];
                }
                var r = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(t);
                if (r) {
                    return r[1];
                }
                return "unknown";
            }
            function g() {
                var e = new Error();
                var t = (e.stack || e).toString();
                var n = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(t);
                if (n) {
                    return n[1];
                }
                var r = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(t);
                if (r) {
                    return r[1];
                }
                return "unknown";
            }
            function x(e, t) {
                var n = e.split("\n");
                var r = 1;
                var i = 0;
                var a = {
                    unknown: new d(),
                    0: new d()
                };
                a.unknown.name = a[0].name = t || _();
                a.unknown.lines.push(new p(0, ""));
                for (var o = 0; o < n.length; ++o) {
                    var s = n[o];
                    var u = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(s);
                    if (u) {
                        switch (u[1]) {
                          case "line":
                            var f = /(\d+)(\s+\d+)?/.exec(u[2]);
                            if (f) {
                                r = f[1] | 0;
                                if (f[2]) {
                                    i = f[2] | 0;
                                    if (!(i in a)) {
                                        a[i] = new d();
                                    }
                                }
                            }
                            break;

                          case "define":
                            var c = /SHADER_NAME(_B64)?\s+(.*)$/.exec(u[2]);
                            if (c) {
                                a[i].name = c[1] ? l(c[2]) : c[2];
                            }
                            break;
                        }
                    }
                    a[i].lines.push(new p(r++, s));
                }
                Object.keys(a).forEach(function(e) {
                    var t = a[e];
                    t.lines.forEach(function(e) {
                        t.index[e.number] = e;
                    });
                });
                return a;
            }
            function b(e) {
                var n = [];
                e.split("\n").forEach(function(e) {
                    if (e.length < 5) {
                        return;
                    }
                    var t = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(e);
                    if (t) {
                        n.push(new m(t[1] | 0, t[2] | 0, t[3].trim()));
                    } else if (e.length > 0) {
                        n.push(new m("unknown", 0, e));
                    }
                });
                return n;
            }
            function y(r, e) {
                e.forEach(function(e) {
                    var t = r[e.file];
                    if (t) {
                        var n = t.index[e.line];
                        if (n) {
                            n.errors.push(e);
                            t.hasErrors = true;
                            return;
                        }
                    }
                    r.unknown.hasErrors = true;
                    r.unknown.lines[0].errors.push(e);
                });
            }
            function T(e, t, n, r, i) {
                if (!e.getShaderParameter(t, e.COMPILE_STATUS)) {
                    var a = e.getShaderInfoLog(t);
                    var o = r === e.FRAGMENT_SHADER ? "fragment" : "vertex";
                    O(n, "string", o + " shader source must be a string", i);
                    var s = x(n, i);
                    var u = b(a);
                    y(s, u);
                    Object.keys(s).forEach(function(e) {
                        var t = s[e];
                        if (!t.hasErrors) {
                            return;
                        }
                        var n = [ "" ];
                        var r = [ "" ];
                        function o(e, t) {
                            n.push(e);
                            r.push(t || "");
                        }
                        o("file number " + e + ": " + t.name + "\n", "color:red;text-decoration:underline;font-weight:bold");
                        t.lines.forEach(function(i) {
                            if (i.errors.length > 0) {
                                o(h(i.number, 4) + "|  ", "background-color:yellow; font-weight:bold");
                                o(i.line + f, "color:red; background-color:yellow; font-weight:bold");
                                var a = 0;
                                i.errors.forEach(function(e) {
                                    var t = e.message;
                                    var n = /^\s*'(.*)'\s*:\s*(.*)$/.exec(t);
                                    if (n) {
                                        var r = n[1];
                                        t = n[2];
                                        switch (r) {
                                          case "assign":
                                            r = "=";
                                            break;
                                        }
                                        a = Math.max(i.line.indexOf(r, a), 0);
                                    } else {
                                        a = 0;
                                    }
                                    o(h("| ", 6));
                                    o(h("^^^", a + 3) + f, "font-weight:bold");
                                    o(h("| ", 6));
                                    o(t + f, "font-weight:bold");
                                });
                                o(h("| ", 6) + f);
                            } else {
                                o(h(i.number, 4) + "|  ");
                                o(i.line + f, "color:red");
                            }
                        });
                        if (typeof document !== "undefined" && !window.chrome) {
                            r[0] = n.join("%c");
                            console.log.apply(console, r);
                        } else {
                            console.log(n.join(""));
                        }
                    });
                    v.raise("Error compiling " + o + " shader, " + s[0].name);
                }
            }
            function w(e, t, n, r, i) {
                if (!e.getProgramParameter(t, e.LINK_STATUS)) {
                    var a = e.getProgramInfoLog(t);
                    var o = x(n, i);
                    var s = x(r, i);
                    var u = 'Error linking program with vertex shader, "' + s[0].name + '", and fragment shader "' + o[0].name + '"';
                    if (typeof document !== "undefined") {
                        console.log("%c" + u + f + "%c" + a, "color:red;text-decoration:underline;font-weight:bold", "color:red");
                    } else {
                        console.log(u + f + a);
                    }
                    v.raise(u);
                }
            }
            function E(e) {
                e._commandRef = _();
            }
            function S(e, t, n, r) {
                E(e);
                function i(e) {
                    if (e) {
                        return r.id(e);
                    }
                    return 0;
                }
                e._fragId = i(e["static"].frag);
                e._vertId = i(e["static"].vert);
                function a(t, e) {
                    Object.keys(e).forEach(function(e) {
                        t[r.id(e)] = true;
                    });
                }
                var o = e._uniformSet = {};
                a(o, t["static"]);
                a(o, t.dynamic);
                var s = e._attributeSet = {};
                a(s, n["static"]);
                a(s, n.dynamic);
                e._hasCount = "count" in e["static"] || "count" in e.dynamic || "elements" in e["static"] || "elements" in e.dynamic;
            }
            function A(e, t) {
                var n = g();
                r(e + " in command " + (t || _()) + (n === "unknown" ? "" : " called from " + n));
            }
            function M(e, t, n) {
                if (!e) {
                    A(t, n || _());
                }
            }
            function R(e, t, n, r) {
                if (!(e in t)) {
                    A("unknown parameter (" + e + ")" + i(n) + ". possible values: " + Object.keys(t).join(), r || _());
                }
            }
            function O(e, t, n, r) {
                if (!a(e, t)) {
                    A("invalid parameter type" + i(n) + ". expected " + t + ", got " + typeof e, r || _());
                }
            }
            function B(e) {
                e();
            }
            function C(e, t, n) {
                if (e.texture) {
                    s(e.texture._texture.internalformat, t, "unsupported texture format for attachment");
                } else {
                    s(e.renderbuffer._renderbuffer.format, n, "unsupported renderbuffer format for attachment");
                }
            }
            var F = 33071, I = 9728, P = 9984, D = 9985, N = 9986, L = 9987, q, Z = 5121, z = 5122, U = 5123, G = 5124, H = 5125, k = 5126, j = 32819, V = 32820, X = 33635, W = 34042, K = 36193, Y = {};
            function Q(e, t) {
                if (e === V || e === j || e === X) {
                    return 2;
                } else if (e === W) {
                    return 4;
                } else {
                    return Y[e] * t;
                }
            }
            function J(e) {
                return !(e & e - 1) && !!e;
            }
            function $(e, t, n) {
                var r;
                var i = t.width;
                var a = t.height;
                var o = t.channels;
                v(i > 0 && i <= n.maxTextureSize && a > 0 && a <= n.maxTextureSize, "invalid texture shape");
                if (e.wrapS !== F || e.wrapT !== F) {
                    v(J(i) && J(a), "incompatible wrap mode for texture, both width and height must be power of 2");
                }
                if (t.mipmask === 1) {
                    if (i !== 1 && a !== 1) {
                        v(e.minFilter !== P && e.minFilter !== N && e.minFilter !== D && e.minFilter !== L, "min filter requires mipmap");
                    }
                } else {
                    v(J(i) && J(a), "texture must be a square power of 2 to support mipmapping");
                    v(t.mipmask === (i << 1) - 1, "missing or incomplete mipmap data");
                }
                if (t.type === k) {
                    if (n.extensions.indexOf("oes_texture_float_linear") < 0) {
                        v(e.minFilter === I && e.magFilter === I, "filter not supported, must enable oes_texture_float_linear");
                    }
                    v(!e.genMipmaps, "mipmap generation not supported with float textures");
                }
                var s = t.images;
                for (r = 0; r < 16; ++r) {
                    if (s[r]) {
                        var u = i >> r;
                        var f = a >> r;
                        v(t.mipmask & 1 << r, "missing mipmap data");
                        var c = s[r];
                        v(c.width === u && c.height === f, "invalid shape for mip images");
                        v(c.format === t.format && c.internalformat === t.internalformat && c.type === t.type, "incompatible type for mip image");
                        if (c.compressed) ; else if (c.data) {
                            var l = Math.ceil(Q(c.type, o) * u / c.unpackAlignment) * c.unpackAlignment;
                            v(c.data.byteLength === l * f, "invalid data for image, buffer size is inconsistent with image format");
                        } else if (c.element) ; else if (c.copy) ;
                    } else if (!e.genMipmaps) {
                        v((t.mipmask & 1 << r) === 0, "extra mipmap data");
                    }
                }
                if (t.compressed) {
                    v(!e.genMipmaps, "mipmap generation for compressed images not supported");
                }
            }
            function ee(e, t, n, r) {
                var i = e.width;
                var a = e.height;
                var o = e.channels;
                v(i > 0 && i <= r.maxTextureSize && a > 0 && a <= r.maxTextureSize, "invalid texture shape");
                v(i === a, "cube map must be square");
                v(t.wrapS === F && t.wrapT === F, "wrap mode not supported by cube map");
                for (var s = 0; s < n.length; ++s) {
                    var u = n[s];
                    v(u.width === i && u.height === a, "inconsistent cube map face shape");
                    if (t.genMipmaps) {
                        v(!u.compressed, "can not generate mipmap for compressed textures");
                        v(u.mipmask === 1, "can not specify mipmaps and generate mipmaps");
                    }
                    var f = u.images;
                    for (var c = 0; c < 16; ++c) {
                        var l = f[c];
                        if (l) {
                            var h = i >> c;
                            var d = a >> c;
                            v(u.mipmask & 1 << c, "missing mipmap data");
                            v(l.width === h && l.height === d, "invalid shape for mip images");
                            v(l.format === e.format && l.internalformat === e.internalformat && l.type === e.type, "incompatible type for mip image");
                            if (l.compressed) ; else if (l.data) {
                                v(l.data.byteLength === h * d * Math.max(Q(l.type, o), l.unpackAlignment), "invalid data for image, buffer size is inconsistent with image format");
                            } else if (l.element) ; else if (l.copy) ;
                        }
                    }
                }
            }
            Y[5120] = Y[Z] = 1, Y[z] = Y[U] = Y[K] = Y[X] = Y[j] = Y[V] = 2, Y[G] = Y[H] = Y[k] = Y[W] = 4;
            var fe = ue(v, {
                optional: B,
                raise: r,
                commandRaise: A,
                command: M,
                parameter: e,
                commandParameter: R,
                constructor: c,
                type: n,
                commandType: O,
                isTypedArray: t,
                nni: o,
                oneOf: s,
                shaderError: T,
                linkError: w,
                callSite: g,
                saveCommandRef: E,
                saveDrawInfo: S,
                framebufferFormat: C,
                guessCommand: _,
                texture2D: $,
                textureCube: ee
            }), te = 0, re = 0;
            function ie(e, t) {
                this.id = te++;
                this.type = e;
                this.data = t;
            }
            function ae(e) {
                return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
            }
            function oe(e) {
                if (e.length === 0) {
                    return [];
                }
                var t = e.charAt(0);
                var n = e.charAt(e.length - 1);
                if (e.length > 1 && t === n && (t === '"' || t === "'")) {
                    return [ '"' + ae(e.substr(1, e.length - 2)) + '"' ];
                }
                var r = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(e);
                if (r) {
                    return oe(e.substr(0, r.index)).concat(oe(r[1])).concat(oe(e.substr(r.index + r[0].length)));
                }
                var i = e.split(".");
                if (i.length === 1) {
                    return [ '"' + ae(e) + '"' ];
                }
                var a = [];
                for (var o = 0; o < i.length; ++o) {
                    a = a.concat(oe(i[o]));
                }
                return a;
            }
            function se(e) {
                return "[" + oe(e).join("][") + "]";
            }
            function ce(e, t) {
                return new ie(e, se(t + ""));
            }
            function le(e) {
                return typeof e === "function" && !e._reglType || e instanceof ie;
            }
            function he(e, t) {
                if (typeof e === "function") {
                    return new ie(re, e);
                }
                return e;
            }
            var de = {
                DynamicVariable: ie,
                define: ce,
                isDynamic: le,
                unbox: he,
                accessor: se
            }, ve = {
                next: typeof requestAnimationFrame === "function" ? function(e) {
                    return requestAnimationFrame(e);
                } : function(e) {
                    return setTimeout(e, 16);
                },
                cancel: typeof cancelAnimationFrame === "function" ? function(e) {
                    return cancelAnimationFrame(e);
                } : clearTimeout
            }, pe = typeof performance !== "undefined" && performance.now ? function() {
                return performance.now();
            } : function() {
                return +new Date();
            };
            function me() {
                var r = {
                    "": 0
                };
                var i = [ "" ];
                return {
                    id: function e(t) {
                        var n = r[t];
                        if (n) {
                            return n;
                        }
                        n = r[t] = i.length;
                        i.push(t);
                        return n;
                    },
                    str: function e(t) {
                        return i[t];
                    }
                };
            }
            function _e(r, e, i) {
                var a = document.createElement("canvas");
                ue(a.style, {
                    border: 0,
                    margin: 0,
                    padding: 0,
                    top: 0,
                    left: 0
                });
                r.appendChild(a);
                if (r === document.body) {
                    a.style.position = "absolute";
                    ue(r.style, {
                        margin: 0,
                        padding: 0
                    });
                }
                function t() {
                    var e = window.innerWidth;
                    var t = window.innerHeight;
                    if (r !== document.body) {
                        var n = r.getBoundingClientRect();
                        e = n.right - n.left;
                        t = n.bottom - n.top;
                    }
                    a.width = i * e;
                    a.height = i * t;
                    ue(a.style, {
                        width: e + "px",
                        height: t + "px"
                    });
                }
                var n;
                if (r !== document.body && typeof ResizeObserver === "function") {
                    n = new ResizeObserver(function() {
                        setTimeout(t);
                    });
                    n.observe(r);
                } else {
                    window.addEventListener("resize", t, false);
                }
                function o() {
                    if (n) {
                        n.disconnect();
                    } else {
                        window.removeEventListener("resize", t);
                    }
                    r.removeChild(a);
                }
                t();
                return {
                    canvas: a,
                    onDestroy: o
                };
            }
            function ge(t, n) {
                function e(e) {
                    try {
                        return t.getContext(e, n);
                    } catch (e) {
                        return null;
                    }
                }
                return e("webgl") || e("experimental-webgl") || e("webgl-experimental");
            }
            function xe(e) {
                return typeof e.nodeName === "string" && typeof e.appendChild === "function" && typeof e.getBoundingClientRect === "function";
            }
            function be(e) {
                return typeof e.drawArrays === "function" || typeof e.drawElements === "function";
            }
            function ye(e) {
                if (typeof e === "string") {
                    return e.split();
                }
                fe(Array.isArray(e), "invalid extension array");
                return e;
            }
            function Te(e) {
                if (typeof e === "string") {
                    fe(typeof document !== "undefined", "not supported outside of DOM");
                    return document.querySelector(e);
                }
                return e;
            }
            function we(e) {
                var t = e || {};
                var n, r, i, a;
                var o = {};
                var s = [];
                var u = [];
                var f = typeof window === "undefined" ? 1 : window.devicePixelRatio;
                var c = false;
                var l = function e(t) {
                    if (t) {
                        fe.raise(t);
                    }
                };
                var h = function e() {};
                if (typeof t === "string") {
                    fe(typeof document !== "undefined", "selector queries only supported in DOM enviroments");
                    n = document.querySelector(t);
                    fe(n, "invalid query string for element");
                } else if (typeof t === "object") {
                    if (xe(t)) {
                        n = t;
                    } else if (be(t)) {
                        a = t;
                        i = a.canvas;
                    } else {
                        fe.constructor(t);
                        if ("gl" in t) {
                            a = t.gl;
                        } else if ("canvas" in t) {
                            i = Te(t.canvas);
                        } else if ("container" in t) {
                            r = Te(t.container);
                        }
                        if ("attributes" in t) {
                            o = t.attributes;
                            fe.type(o, "object", "invalid context attributes");
                        }
                        if ("extensions" in t) {
                            s = ye(t.extensions);
                        }
                        if ("optionalExtensions" in t) {
                            u = ye(t.optionalExtensions);
                        }
                        if ("onDone" in t) {
                            fe.type(t.onDone, "function", "invalid or missing onDone callback");
                            l = t.onDone;
                        }
                        if ("profile" in t) {
                            c = !!t.profile;
                        }
                        if ("pixelRatio" in t) {
                            f = +t.pixelRatio;
                            fe(f > 0, "invalid pixel ratio");
                        }
                    }
                } else {
                    fe.raise("invalid arguments to regl");
                }
                if (n) {
                    if (n.nodeName.toLowerCase() === "canvas") {
                        i = n;
                    } else {
                        r = n;
                    }
                }
                if (!a) {
                    if (!i) {
                        fe(typeof document !== "undefined", "must manually specify webgl context outside of DOM environments");
                        var d = _e(r || document.body, l, f);
                        if (!d) {
                            return null;
                        }
                        i = d.canvas;
                        h = d.onDestroy;
                    }
                    o.premultipliedAlpha = o.premultipliedAlpha || false;
                    a = ge(i, o);
                }
                if (!a) {
                    h();
                    l("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org");
                    return null;
                }
                return {
                    gl: a,
                    canvas: i,
                    container: r,
                    extensions: s,
                    optionalExtensions: u,
                    pixelRatio: f,
                    profile: c,
                    onDone: l,
                    onDestroy: h
                };
            }
            function Ee(r, e) {
                var i = {};
                function t(e) {
                    fe.type(e, "string", "extension name must be string");
                    var t = e.toLowerCase();
                    var n;
                    try {
                        n = i[t] = r.getExtension(t);
                    } catch (e) {}
                    return !!n;
                }
                for (var n = 0; n < e.extensions.length; ++n) {
                    var a = e.extensions[n];
                    if (!t(a)) {
                        e.onDestroy();
                        e.onDone('"' + a + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
                        return null;
                    }
                }
                e.optionalExtensions.forEach(t);
                return {
                    extensions: i,
                    restore: function e() {
                        Object.keys(i).forEach(function(e) {
                            if (i[e] && !t(e)) {
                                throw new Error("(regl): error restoring extension " + e);
                            }
                        });
                    }
                };
            }
            function Se(e, t) {
                var n = Array(e);
                for (var r = 0; r < e; ++r) {
                    n[r] = t(r);
                }
                return n;
            }
            var Ae = 5120, Me = 5121, Re = 5122, Oe = 5123, Be = 5124, Ce = 5125, Fe = 5126;
            function Ie(e) {
                for (var t = 16; t <= 1 << 28; t *= 16) {
                    if (e <= t) {
                        return t;
                    }
                }
                return 0;
            }
            function Pe(e) {
                var t, n;
                t = (e > 65535) << 4;
                e >>>= t;
                n = (e > 255) << 3;
                e >>>= n;
                t |= n;
                n = (e > 15) << 2;
                e >>>= n;
                t |= n;
                n = (e > 3) << 1;
                e >>>= n;
                t |= n;
                return t | e >> 1;
            }
            function De() {
                var r = Se(8, function() {
                    return [];
                });
                function i(e) {
                    var t = Ie(e);
                    var n = r[Pe(t) >> 2];
                    if (n.length > 0) {
                        return n.pop();
                    }
                    return new ArrayBuffer(t);
                }
                function t(e) {
                    r[Pe(e.byteLength) >> 2].push(e);
                }
                function e(e, t) {
                    var n = null;
                    switch (e) {
                      case Ae:
                        n = new Int8Array(i(t), 0, t);
                        break;

                      case Me:
                        n = new Uint8Array(i(t), 0, t);
                        break;

                      case Re:
                        n = new Int16Array(i(2 * t), 0, t);
                        break;

                      case Oe:
                        n = new Uint16Array(i(2 * t), 0, t);
                        break;

                      case Be:
                        n = new Int32Array(i(4 * t), 0, t);
                        break;

                      case Ce:
                        n = new Uint32Array(i(4 * t), 0, t);
                        break;

                      case Fe:
                        n = new Float32Array(i(4 * t), 0, t);
                        break;

                      default:
                        return null;
                    }
                    if (n.length !== t) {
                        return n.subarray(0, t);
                    }
                    return n;
                }
                function n(e) {
                    t(e.buffer);
                }
                return {
                    alloc: i,
                    free: t,
                    allocType: e,
                    freeType: n
                };
            }
            var Ne = De();
            Ne.zero = De();
            var Le = 6402, qe = 34041, Ze = 36193, ze = {
                WEBGL_depth_texture: {
                    UNSIGNED_INT_24_8_WEBGL: 34042
                },
                OES_element_index_uint: {},
                OES_texture_float: {},
                OES_texture_float_linear: {},
                OES_texture_half_float: {
                    HALF_FLOAT_OES: 36193
                },
                OES_texture_half_float_linear: {},
                EXT_color_buffer_float: {},
                OES_standard_derivatives: {},
                EXT_frag_depth: {},
                EXT_blend_minmax: {
                    MIN_EXT: 32775,
                    MAX_EXT: 32776
                },
                EXT_shader_texture_lod: {}
            }, Ue = {
                gl2: function e(t, n) {
                    t[this.versionProperty] = 2;
                    for (var r in ze) {
                        n[r.toLowerCase()] = ze[r];
                    }
                    t.getExtension("EXT_color_buffer_float");
                    n["webgl_draw_buffers"] = {
                        drawBuffersWEBGL: function e() {
                            return t.drawBuffers.apply(t, arguments);
                        }
                    };
                    n["oes_vertex_array_object"] = {
                        VERTEX_ARRAY_BINDING_OES: 34229,
                        createVertexArrayOES: function e() {
                            return t.createVertexArray();
                        },
                        deleteVertexArrayOES: function e() {
                            return t.deleteVertexArray.apply(t, arguments);
                        },
                        isVertexArrayOES: function e() {
                            return t.isVertexArray.apply(t, arguments);
                        },
                        bindVertexArrayOES: function e() {
                            return t.bindVertexArray.apply(t, arguments);
                        }
                    };
                    n["angle_instanced_arrays"] = {
                        VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 35070,
                        drawArraysInstancedANGLE: function e() {
                            return t.drawArraysInstanced.apply(t, arguments);
                        },
                        drawElementsInstancedANGLE: function e() {
                            return t.drawElementsInstanced.apply(t, arguments);
                        },
                        vertexAttribDivisorANGLE: function e() {
                            return t.vertexAttribDivisor.apply(t, arguments);
                        }
                    };
                },
                versionProperty: "___regl_gl_version___",
                getInternalFormat: function e(t, n, r) {
                    if (t[this.versionProperty] !== 2) {
                        return n;
                    }
                    if (n === Le) {
                        return 33190;
                    } else if (n === qe) {
                        return 35056;
                    } else if (r === Ze && n === t.RGBA) {
                        return 34842;
                    } else if (r === Ze && n === t.RGB) {
                        return 34843;
                    } else if (r === t.FLOAT && n === t.RGBA) {
                        return 34836;
                    } else if (r === t.FLOAT && n === t.RGB) {
                        return 34837;
                    }
                    return n;
                },
                getTextureType: function e(t, n) {
                    if (t[this.versionProperty] !== 2) {
                        return n;
                    }
                    if (n === Ze) {
                        return t.HALF_FLOAT;
                    }
                    return n;
                }
            }, Ge = 3408, He = 3410, ke = 3411, je = 3412, Ve = 3413, Xe = 3414, We = 3415, Ke = 33901, Ye = 33902, Qe = 3379, Je = 3386, $e = 34921, et = 36347, tt = 36348, nt = 35661, rt = 35660, it = 34930, at = 36349, ot = 34076, st = 34024, ut = 7936, ft = 7937, ct = 7938, lt = 35724, ht = 34047, dt = 36063, vt = 34852, pt = 3553, mt = 34067, _t = 34069, gt = 33984, xt = 6408, bt = 5126, yt = 5121, Tt = 36160, wt = 36053, Et = 36064, St = 16384, At = function e(t, n) {
                var r = 1;
                if (n.ext_texture_filter_anisotropic) {
                    r = t.getParameter(ht);
                }
                var i = 1;
                var a = 1;
                if (n.webgl_draw_buffers) {
                    i = t.getParameter(vt);
                    a = t.getParameter(dt);
                }
                var o = !!n.oes_texture_float;
                if (o) {
                    var s = t.createTexture();
                    t.bindTexture(pt, s);
                    var u = Ue.getInternalFormat(t, xt, bt);
                    t.texImage2D(pt, 0, u, 1, 1, 0, xt, bt, null);
                    var f = t.createFramebuffer();
                    t.bindFramebuffer(Tt, f);
                    t.framebufferTexture2D(Tt, Et, pt, s, 0);
                    t.bindTexture(pt, null);
                    if (t.checkFramebufferStatus(Tt) !== wt) o = false; else {
                        t.viewport(0, 0, 1, 1);
                        t.clearColor(1, 0, 0, 1);
                        t.clear(St);
                        var c = Ne.allocType(bt, 4);
                        t.readPixels(0, 0, 1, 1, xt, bt, c);
                        if (t.getError()) o = false; else {
                            t.deleteFramebuffer(f);
                            t.deleteTexture(s);
                            o = c[0] === 1;
                        }
                        Ne.freeType(c);
                    }
                }
                var l = typeof navigator !== "undefined" && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent));
                var h = true;
                if (!l) {
                    var d = t.createTexture();
                    var v = Ne.allocType(yt, 36);
                    t.activeTexture(gt);
                    t.bindTexture(mt, d);
                    t.texImage2D(_t, 0, xt, 3, 3, 0, xt, yt, v);
                    Ne.freeType(v);
                    t.bindTexture(mt, null);
                    t.deleteTexture(d);
                    h = !t.getError();
                }
                return {
                    colorBits: [ t.getParameter(He), t.getParameter(ke), t.getParameter(je), t.getParameter(Ve) ],
                    depthBits: t.getParameter(Xe),
                    stencilBits: t.getParameter(We),
                    subpixelBits: t.getParameter(Ge),
                    extensions: Object.keys(n).filter(function(e) {
                        return !!n[e];
                    }),
                    maxAnisotropic: r,
                    maxDrawbuffers: i,
                    maxColorAttachments: a,
                    pointSizeDims: t.getParameter(Ke),
                    lineWidthDims: t.getParameter(Ye),
                    maxViewportDims: t.getParameter(Je),
                    maxCombinedTextureUnits: t.getParameter(nt),
                    maxCubeMapSize: t.getParameter(ot),
                    maxRenderbufferSize: t.getParameter(st),
                    maxTextureUnits: t.getParameter(it),
                    maxTextureSize: t.getParameter(Qe),
                    maxAttributes: t.getParameter($e),
                    maxVertexUniforms: t.getParameter(et),
                    maxVertexTextureUnits: t.getParameter(rt),
                    maxVaryingVectors: t.getParameter(tt),
                    maxFragmentUniforms: t.getParameter(at),
                    glsl: t.getParameter(lt),
                    renderer: t.getParameter(ft),
                    vendor: t.getParameter(ut),
                    version: t.getParameter(ct),
                    readFloat: o,
                    npotTextureCube: h
                };
            };
            function Mt(e) {
                return !!e && typeof e === "object" && Array.isArray(e.shape) && Array.isArray(e.stride) && typeof e.offset === "number" && e.shape.length === e.stride.length && (Array.isArray(e.data) || ne(e.data));
            }
            var Rt = function e(t) {
                return Object.keys(t).map(function(e) {
                    return t[e];
                });
            }, Ot = {
                shape: Dt,
                flatten: Pt
            };
            function Bt(e, t, n) {
                for (var r = 0; r < t; ++r) {
                    n[r] = e[r];
                }
            }
            function Ct(e, t, n, r) {
                var i = 0;
                for (var a = 0; a < t; ++a) {
                    var o = e[a];
                    for (var s = 0; s < n; ++s) {
                        r[i++] = o[s];
                    }
                }
            }
            function Ft(e, t, n, r, i, a) {
                var o = a;
                for (var s = 0; s < t; ++s) {
                    var u = e[s];
                    for (var f = 0; f < n; ++f) {
                        var c = u[f];
                        for (var l = 0; l < r; ++l) {
                            i[o++] = c[l];
                        }
                    }
                }
            }
            function It(e, t, n, r, i) {
                var a = 1;
                for (var o = n + 1; o < t.length; ++o) {
                    a *= t[o];
                }
                var s = t[n];
                if (t.length - n === 4) {
                    var u = t[n + 1];
                    var f = t[n + 2];
                    var c = t[n + 3];
                    for (o = 0; o < s; ++o) {
                        Ft(e[o], u, f, c, r, i);
                        i += a;
                    }
                } else {
                    for (o = 0; o < s; ++o) {
                        It(e[o], t, n + 1, r, i);
                        i += a;
                    }
                }
            }
            function Pt(e, t, n, r) {
                var i = 1;
                if (t.length) {
                    for (var a = 0; a < t.length; ++a) {
                        i *= t[a];
                    }
                } else {
                    i = 0;
                }
                var o = r || Ne.allocType(n, i);
                switch (t.length) {
                  case 0:
                    break;

                  case 1:
                    Bt(e, t[0], o);
                    break;

                  case 2:
                    Ct(e, t[0], t[1], o);
                    break;

                  case 3:
                    Ft(e, t[0], t[1], t[2], o, 0);
                    break;

                  default:
                    It(e, t, 0, o, 0);
                }
                return o;
            }
            function Dt(e) {
                var t = [];
                for (var n = e; n.length; n = n[0]) {
                    t.push(n.length);
                }
                return t;
            }
            var Nt = {
                "[object Int8Array]": 5120,
                "[object Int16Array]": 5122,
                "[object Int32Array]": 5124,
                "[object Uint8Array]": 5121,
                "[object Uint8ClampedArray]": 5121,
                "[object Uint16Array]": 5123,
                "[object Uint32Array]": 5125,
                "[object Float32Array]": 5126,
                "[object Float64Array]": 5121,
                "[object ArrayBuffer]": 5121
            }, Lt, qt, Zt, zt, Ut, Gt, Ht, kt, jt = {
                int8: 5120,
                int16: 5122,
                int32: 5124,
                uint8: 5121,
                uint16: 5123,
                uint32: 5125,
                float: 5126,
                float32: 5126
            }, Vt, Xt, Wt = {
                dynamic: 35048,
                stream: 35040,
                static: 35044
            }, Kt = Ot.flatten, Yt = Ot.shape, Qt = 35044, Jt = 35040, $t = 5121, en = 5126, tn = [];
            function nn(e) {
                return Nt[Object.prototype.toString.call(e)] | 0;
            }
            function rn(e, t) {
                for (var n = 0; n < t.length; ++n) {
                    e[n] = t[n];
                }
            }
            function an(e, t, n, r, i, a, o) {
                var s = 0;
                for (var u = 0; u < n; ++u) {
                    for (var f = 0; f < r; ++f) {
                        e[s++] = t[i * u + a * f + o];
                    }
                }
            }
            function on(s, i, u, n) {
                var t = 0;
                var a = {};
                function f(e) {
                    this.id = t++;
                    this.buffer = s.createBuffer();
                    this.type = e;
                    this.usage = Qt;
                    this.byteLength = 0;
                    this.dimension = 1;
                    this.dtype = $t;
                    this.persistentData = null;
                    if (u.profile) {
                        this.stats = {
                            size: 0
                        };
                    }
                }
                f.prototype.bind = function() {
                    s.bindBuffer(this.type, this.buffer);
                };
                f.prototype.destroy = function() {
                    l(this);
                };
                var r = [];
                function e(e, t) {
                    var n = r.pop();
                    if (!n) {
                        n = new f(e);
                    }
                    n.bind();
                    c(n, t, Jt, 0, 1, false);
                    return n;
                }
                function o(e) {
                    r.push(e);
                }
                function g(e, t, n) {
                    e.byteLength = t.byteLength;
                    s.bufferData(e.type, t, n);
                }
                function c(e, t, n, r, i, a) {
                    var o;
                    e.usage = n;
                    if (Array.isArray(t)) {
                        e.dtype = r || en;
                        if (t.length > 0) {
                            var s;
                            if (Array.isArray(t[0])) {
                                o = Yt(t);
                                var u = 1;
                                for (var f = 1; f < o.length; ++f) {
                                    u *= o[f];
                                }
                                e.dimension = u;
                                s = Kt(t, o, e.dtype);
                                g(e, s, n);
                                if (a) {
                                    e.persistentData = s;
                                } else {
                                    Ne.freeType(s);
                                }
                            } else if (typeof t[0] === "number") {
                                e.dimension = i;
                                var c = Ne.allocType(e.dtype, t.length);
                                rn(c, t);
                                g(e, c, n);
                                if (a) {
                                    e.persistentData = c;
                                } else {
                                    Ne.freeType(c);
                                }
                            } else if (ne(t[0])) {
                                e.dimension = t[0].length;
                                e.dtype = r || nn(t[0]) || en;
                                s = Kt(t, [ t.length, t[0].length ], e.dtype);
                                g(e, s, n);
                                if (a) {
                                    e.persistentData = s;
                                } else {
                                    Ne.freeType(s);
                                }
                            } else {
                                fe.raise("invalid buffer data");
                            }
                        }
                    } else if (ne(t)) {
                        e.dtype = r || nn(t);
                        e.dimension = i;
                        g(e, t, n);
                        if (a) {
                            e.persistentData = new Uint8Array(new Uint8Array(t.buffer));
                        }
                    } else if (Mt(t)) {
                        o = t.shape;
                        var l = t.stride;
                        var h = t.offset;
                        var d = 0;
                        var v = 0;
                        var p = 0;
                        var m = 0;
                        if (o.length === 1) {
                            d = o[0];
                            v = 1;
                            p = l[0];
                            m = 0;
                        } else if (o.length === 2) {
                            d = o[0];
                            v = o[1];
                            p = l[0];
                            m = l[1];
                        } else {
                            fe.raise("invalid shape");
                        }
                        e.dtype = r || nn(t.data) || en;
                        e.dimension = v;
                        var _ = Ne.allocType(e.dtype, d * v);
                        an(_, t.data, d, v, p, m, h);
                        g(e, _, n);
                        if (a) {
                            e.persistentData = _;
                        } else {
                            Ne.freeType(_);
                        }
                    } else if (t instanceof ArrayBuffer) {
                        e.dtype = $t;
                        e.dimension = i;
                        g(e, t, n);
                        if (a) {
                            e.persistentData = new Uint8Array(new Uint8Array(t));
                        }
                    } else {
                        fe.raise("invalid buffer data");
                    }
                }
                function l(e) {
                    i.bufferCount--;
                    n(e);
                    var t = e.buffer;
                    fe(t, "buffer must not be deleted already");
                    s.deleteBuffer(t);
                    e.buffer = null;
                    delete a[e.id];
                }
                function h(e, t, n, o) {
                    i.bufferCount++;
                    var d = new f(t);
                    a[d.id] = d;
                    function v(e) {
                        var t = Qt;
                        var n = null;
                        var r = 0;
                        var i = 0;
                        var a = 1;
                        if (Array.isArray(e) || ne(e) || Mt(e) || e instanceof ArrayBuffer) {
                            n = e;
                        } else if (typeof e === "number") {
                            r = e | 0;
                        } else if (e) {
                            fe.type(e, "object", "buffer arguments must be an object, a number or an array");
                            if ("data" in e) {
                                fe(n === null || Array.isArray(n) || ne(n) || Mt(n), "invalid data for buffer");
                                n = e.data;
                            }
                            if ("usage" in e) {
                                fe.parameter(e.usage, Wt, "invalid buffer usage");
                                t = Wt[e.usage];
                            }
                            if ("type" in e) {
                                fe.parameter(e.type, jt, "invalid buffer type");
                                i = jt[e.type];
                            }
                            if ("dimension" in e) {
                                fe.type(e.dimension, "number", "invalid dimension");
                                a = e.dimension | 0;
                            }
                            if ("length" in e) {
                                fe.nni(r, "buffer length must be a nonnegative integer");
                                r = e.length | 0;
                            }
                        }
                        d.bind();
                        if (!n) {
                            if (r) s.bufferData(d.type, r, t);
                            d.dtype = i || $t;
                            d.usage = t;
                            d.dimension = a;
                            d.byteLength = r;
                        } else {
                            c(d, n, t, i, a, o);
                        }
                        if (u.profile) {
                            d.stats.size = d.byteLength * tn[d.dtype];
                        }
                        return v;
                    }
                    function p(e, t) {
                        fe(t + e.byteLength <= d.byteLength, "invalid buffer subdata call, buffer is too small. " + " Can't write data of size " + e.byteLength + " starting from offset " + t + " to a buffer of size " + d.byteLength);
                        s.bufferSubData(d.type, t, e);
                    }
                    function r(e, t) {
                        var n = (t || 0) | 0;
                        var r;
                        d.bind();
                        if (ne(e) || e instanceof ArrayBuffer) {
                            p(e, n);
                        } else if (Array.isArray(e)) {
                            if (e.length > 0) {
                                if (typeof e[0] === "number") {
                                    var i = Ne.allocType(d.dtype, e.length);
                                    rn(i, e);
                                    p(i, n);
                                    Ne.freeType(i);
                                } else if (Array.isArray(e[0]) || ne(e[0])) {
                                    r = Yt(e);
                                    var a = Kt(e, r, d.dtype);
                                    p(a, n);
                                    Ne.freeType(a);
                                } else {
                                    fe.raise("invalid buffer data");
                                }
                            }
                        } else if (Mt(e)) {
                            r = e.shape;
                            var o = e.stride;
                            var s = 0;
                            var u = 0;
                            var f = 0;
                            var c = 0;
                            if (r.length === 1) {
                                s = r[0];
                                u = 1;
                                f = o[0];
                                c = 0;
                            } else if (r.length === 2) {
                                s = r[0];
                                u = r[1];
                                f = o[0];
                                c = o[1];
                            } else {
                                fe.raise("invalid shape");
                            }
                            var l = Array.isArray(e.data) ? d.dtype : nn(e.data);
                            var h = Ne.allocType(l, s * u);
                            an(h, e.data, s, u, f, c, e.offset);
                            p(h, n);
                            Ne.freeType(h);
                        } else {
                            fe.raise("invalid data for buffer subdata");
                        }
                        return v;
                    }
                    if (!n) {
                        v(e);
                    }
                    v._reglType = "buffer";
                    v._buffer = d;
                    v.subdata = r;
                    if (u.profile) {
                        v.stats = d.stats;
                    }
                    v.destroy = function() {
                        l(d);
                    };
                    return v;
                }
                function d() {
                    Rt(a).forEach(function(e) {
                        e.buffer = s.createBuffer();
                        s.bindBuffer(e.type, e.buffer);
                        s.bufferData(e.type, e.persistentData || e.byteLength, e.usage);
                    });
                }
                if (u.profile) {
                    i.getTotalBufferSize = function() {
                        var t = 0;
                        Object.keys(a).forEach(function(e) {
                            t += a[e].stats.size;
                        });
                        return t;
                    };
                }
                return {
                    create: h,
                    createStream: e,
                    destroyStream: o,
                    clear: function e() {
                        Rt(a).forEach(l);
                        r.forEach(l);
                    },
                    getBuffer: function e(t) {
                        if (t && t._buffer instanceof f) {
                            return t._buffer;
                        }
                        return null;
                    },
                    restore: d,
                    _initBuffer: c
                };
            }
            tn[5120] = 1, tn[5122] = 2, tn[5124] = 4, tn[5121] = 1, tn[5123] = 2, tn[5125] = 4;
            var sn, un, fn, cn, ln, hn, dn = {
                points: 0,
                point: 0,
                lines: 1,
                line: 1,
                triangles: tn[5126] = 4,
                triangle: 4,
                "line loop": 2,
                "line strip": 3,
                "triangle strip": 5,
                "triangle fan": 6
            }, vn = 0, pn = 1, mn = 4, _n = 5120, gn = 5121, xn = 5122, bn = 5123, yn = 5124, Tn = 5125, wn = 34963, En = 35040, Sn = 35044;
            function An(h, d, v, n) {
                var t = {};
                var r = 0;
                var c = {
                    uint8: gn,
                    uint16: bn
                };
                if (d.oes_element_index_uint) {
                    c.uint32 = Tn;
                }
                function i(e) {
                    this.id = r++;
                    t[this.id] = this;
                    this.buffer = e;
                    this.primType = mn;
                    this.vertCount = 0;
                    this.type = 0;
                }
                i.prototype.bind = function() {
                    this.buffer.bind();
                };
                var a = [];
                function e(e) {
                    var t = a.pop();
                    if (!t) {
                        t = new i(v.create(null, wn, true, false)._buffer);
                    }
                    l(t, e, En, -1, -1, 0, 0);
                    return t;
                }
                function o(e) {
                    a.push(e);
                }
                function l(e, t, n, r, i, a, o) {
                    e.buffer.bind();
                    var s;
                    if (t) {
                        var u = o;
                        if (!o && (!ne(t) || Mt(t) && !ne(t.data))) {
                            u = d.oes_element_index_uint ? Tn : bn;
                        }
                        v._initBuffer(e.buffer, t, n, u, 3);
                    } else {
                        h.bufferData(wn, a, n);
                        e.buffer.dtype = s || gn;
                        e.buffer.usage = n;
                        e.buffer.dimension = 3;
                        e.buffer.byteLength = a;
                    }
                    s = o;
                    if (!o) {
                        switch (e.buffer.dtype) {
                          case gn:
                          case _n:
                            s = gn;
                            break;

                          case bn:
                          case xn:
                            s = bn;
                            break;

                          case Tn:
                          case yn:
                            s = Tn;
                            break;

                          default:
                            fe.raise("unsupported type for element array");
                        }
                        e.buffer.dtype = s;
                    }
                    e.type = s;
                    fe(s !== Tn || !!d.oes_element_index_uint, "32 bit element buffers not supported, enable oes_element_index_uint first");
                    var f = i;
                    if (f < 0) {
                        f = e.buffer.byteLength;
                        if (s === bn) {
                            f >>= 1;
                        } else if (s === Tn) {
                            f >>= 2;
                        }
                    }
                    e.vertCount = f;
                    var c = r;
                    if (r < 0) {
                        c = mn;
                        var l = e.buffer.dimension;
                        if (l === 1) c = vn;
                        if (l === 2) c = pn;
                        if (l === 3) c = mn;
                    }
                    e.primType = c;
                }
                function p(e) {
                    n.elementsCount--;
                    fe(e.buffer !== null, "must not double destroy elements");
                    delete t[e.id];
                    e.buffer.destroy();
                    e.buffer = null;
                }
                function s(e, t) {
                    var s = v.create(null, wn, true);
                    var u = new i(s._buffer);
                    n.elementsCount++;
                    function f(e) {
                        if (!e) {
                            s();
                            u.primType = mn;
                            u.vertCount = 0;
                            u.type = gn;
                        } else if (typeof e === "number") {
                            s(e);
                            u.primType = mn;
                            u.vertCount = e | 0;
                            u.type = gn;
                        } else {
                            var t = null;
                            var n = Sn;
                            var r = -1;
                            var i = -1;
                            var a = 0;
                            var o = 0;
                            if (Array.isArray(e) || ne(e) || Mt(e)) {
                                t = e;
                            } else {
                                fe.type(e, "object", "invalid arguments for elements");
                                if ("data" in e) {
                                    t = e.data;
                                    fe(Array.isArray(t) || ne(t) || Mt(t), "invalid data for element buffer");
                                }
                                if ("usage" in e) {
                                    fe.parameter(e.usage, Wt, "invalid element buffer usage");
                                    n = Wt[e.usage];
                                }
                                if ("primitive" in e) {
                                    fe.parameter(e.primitive, dn, "invalid element buffer primitive");
                                    r = dn[e.primitive];
                                }
                                if ("count" in e) {
                                    fe(typeof e.count === "number" && e.count >= 0, "invalid vertex count for elements");
                                    i = e.count | 0;
                                }
                                if ("type" in e) {
                                    fe.parameter(e.type, c, "invalid buffer type");
                                    o = c[e.type];
                                }
                                if ("length" in e) {
                                    a = e.length | 0;
                                } else {
                                    a = i;
                                    if (o === bn || o === xn) {
                                        a *= 2;
                                    } else if (o === Tn || o === yn) {
                                        a *= 4;
                                    }
                                }
                            }
                            l(u, t, n, r, i, a, o);
                        }
                        return f;
                    }
                    f(e);
                    f._reglType = "elements";
                    f._elements = u;
                    f.subdata = function(e, t) {
                        s.subdata(e, t);
                        return f;
                    };
                    f.destroy = function() {
                        p(u);
                    };
                    return f;
                }
                return {
                    create: s,
                    createStream: e,
                    destroyStream: o,
                    getElements: function e(t) {
                        if (typeof t === "function" && t._elements instanceof i) {
                            return t._elements;
                        }
                        return null;
                    },
                    clear: function e() {
                        Rt(t).forEach(p);
                    }
                };
            }
            var Mn = new Float32Array(1), Rn = new Uint32Array(Mn.buffer), On = 5123;
            function Bn(e) {
                var t = Ne.allocType(On, e.length);
                for (var n = 0; n < e.length; ++n) {
                    if (isNaN(e[n])) {
                        t[n] = 65535;
                    } else if (e[n] === Infinity) {
                        t[n] = 31744;
                    } else if (e[n] === -Infinity) {
                        t[n] = 64512;
                    } else {
                        Mn[0] = e[n];
                        var r = Rn[0];
                        var i = r >>> 31 << 15;
                        var a = (r << 1 >>> 24) - 127;
                        var o = r >> 13 & (1 << 10) - 1;
                        if (a < -24) {
                            t[n] = i;
                        } else if (a < -14) {
                            var s = -14 - a;
                            t[n] = i + (o + (1 << 10) >> s);
                        } else if (a > 15) {
                            t[n] = i + 31744;
                        } else {
                            t[n] = i + (a + 15 << 10) + o;
                        }
                    }
                }
                return t;
            }
            function Cn(e) {
                return Array.isArray(e) || ne(e);
            }
            var Fn = function e(t) {
                return !(t & t - 1) && !!t;
            }, In = 34467, Pn = 3553, Dn = 34067, Nn = 34069, Ln = 6408, qn = 6406, Zn = 6407, zn = 6409, Un = 6410, Gn = 32854, Hn = 32855, kn = 36194, jn = 32819, Vn = 32820, Xn = 33635, Wn = 34042, Kn = 6402, Yn = 34041, Qn = 35904, Jn = 35906, $n = 36193, er = 33776, tr = 33777, nr = 33778, rr = 33779, ir = 35986, ar = 35987, or = 34798, sr = 35840, ur = 35841, fr = 35842, cr = 35843, lr = 36196, hr = 5121, dr = 5123, vr = 5125, pr = 5126, mr = 10242, _r = 10243, gr = 10497, xr = 33071, br = 33648, yr = 10240, Tr = 10241, wr = 9728, Er = 9729, Sr = 9984, Ar = 9985, Mr = 9986, Rr = 9987, Or = 33170, Br = 4352, Cr = 4353, Fr = 4354, Ir = 34046, Pr = 3317, Dr = 37440, Nr = 37441, Lr = 37443, qr = 37444, Zr = 33984, zr = [ Sr, Mr, Ar, Rr ], Ur = [ 0, zn, Un, Zn, Ln ], Gr = {};
            function Hr(e) {
                return "[object " + e + "]";
            }
            Gr[zn] = Gr[qn] = Gr[Kn] = 1, Gr[Yn] = Gr[Un] = 2, Gr[Zn] = Gr[Qn] = 3, Gr[Ln] = Gr[Jn] = 4;
            var kr = Hr("HTMLCanvasElement"), jr = Hr("OffscreenCanvas"), Vr = Hr("CanvasRenderingContext2D"), Xr = Hr("ImageBitmap"), Wr = Hr("HTMLImageElement"), Kr = Hr("HTMLVideoElement"), Yr = Object.keys(Nt).concat([ kr, jr, Vr, Xr, Wr, Kr ]), Qr = [];
            Qr[hr] = 1, Qr[pr] = 4, Qr[$n] = 2, Qr[dr] = 2, Qr[vr] = 4;
            var Jr = [];
            function $r(e) {
                return Array.isArray(e) && (e.length === 0 || typeof e[0] === "number");
            }
            function ei(e) {
                if (!Array.isArray(e)) {
                    return false;
                }
                var t = e.length;
                if (t === 0 || !Cn(e[0])) {
                    return false;
                }
                return true;
            }
            function ti(e) {
                return Object.prototype.toString.call(e);
            }
            function ni(e) {
                return ti(e) === kr;
            }
            function ri(e) {
                return ti(e) === jr;
            }
            function ii(e) {
                return ti(e) === Vr;
            }
            function ai(e) {
                return ti(e) === Xr;
            }
            function oi(e) {
                return ti(e) === Wr;
            }
            function si(e) {
                return ti(e) === Kr;
            }
            function ui(e) {
                if (!e) {
                    return false;
                }
                var t = ti(e);
                if (Yr.indexOf(t) >= 0) {
                    return true;
                }
                return $r(e) || ei(e) || Mt(e);
            }
            function fi(e) {
                return Nt[Object.prototype.toString.call(e)] | 0;
            }
            function ci(e, t) {
                var n = t.length;
                switch (e.type) {
                  case hr:
                  case dr:
                  case vr:
                  case pr:
                    var r = Ne.allocType(e.type, n);
                    r.set(t);
                    e.data = r;
                    break;

                  case $n:
                    e.data = Bn(t);
                    break;

                  default:
                    fe.raise("unsupported texture type, must specify a typed array");
                }
            }
            function li(e, t) {
                return Ne.allocType(e.type === $n ? pr : e.type, t);
            }
            function hi(e, t) {
                if (e.type === $n) {
                    e.data = Bn(t);
                    Ne.freeType(t);
                } else {
                    e.data = t;
                }
            }
            function di(e, t, n, r, i, a) {
                var o = e.width;
                var s = e.height;
                var u = e.channels;
                var f = o * s * u;
                var c = li(e, f);
                var l = 0;
                for (var h = 0; h < s; ++h) {
                    for (var d = 0; d < o; ++d) {
                        for (var v = 0; v < u; ++v) {
                            c[l++] = t[n * d + r * h + i * v + a];
                        }
                    }
                }
                hi(e, c);
            }
            function vi(e, t, n, r, i, a) {
                var o;
                if (typeof Jr[e] !== "undefined") {
                    o = Jr[e];
                } else {
                    o = Gr[e] * Qr[t];
                }
                if (a) {
                    o *= 6;
                }
                if (i) {
                    var s = 0;
                    var u = n;
                    while (u >= 1) {
                        s += o * u * u;
                        u /= 2;
                    }
                    return s;
                } else {
                    return o * n * r;
                }
            }
            function pi(d, c, y, h, T, u, v) {
                var l = {
                    "don't care": Br,
                    "dont care": Br,
                    nice: Fr,
                    fast: Cr
                };
                var p = {
                    repeat: gr,
                    clamp: xr,
                    mirror: br
                };
                var m = {
                    nearest: wr,
                    linear: Er
                };
                var _ = ue({
                    mipmap: Rr,
                    "nearest mipmap nearest": Sr,
                    "linear mipmap nearest": Ar,
                    "nearest mipmap linear": Mr,
                    "linear mipmap linear": Rr
                }, m);
                var g = {
                    none: 0,
                    browser: qr
                };
                var x = {
                    uint8: hr,
                    rgba4: jn,
                    rgb565: Xn,
                    "rgb5 a1": Vn
                };
                var b = {
                    alpha: qn,
                    luminance: zn,
                    "luminance alpha": Un,
                    rgb: Zn,
                    rgba: Ln,
                    rgba4: Gn,
                    "rgb5 a1": Hn,
                    rgb565: kn
                };
                var w = {};
                if (c.ext_srgb) {
                    b.srgb = Qn;
                    b.srgba = Jn;
                }
                if (c.oes_texture_float) {
                    x.float32 = x["float"] = pr;
                }
                if (c.oes_texture_half_float) {
                    x["float16"] = x["half float"] = $n;
                }
                if (c.webgl_depth_texture) {
                    ue(b, {
                        depth: Kn,
                        "depth stencil": Yn
                    });
                    ue(x, {
                        uint16: dr,
                        uint32: vr,
                        "depth stencil": Wn
                    });
                }
                if (c.webgl_compressed_texture_s3tc) {
                    ue(w, {
                        "rgb s3tc dxt1": er,
                        "rgba s3tc dxt1": tr,
                        "rgba s3tc dxt3": nr,
                        "rgba s3tc dxt5": rr
                    });
                }
                if (c.webgl_compressed_texture_atc) {
                    ue(w, {
                        "rgb atc": ir,
                        "rgba atc explicit alpha": ar,
                        "rgba atc interpolated alpha": or
                    });
                }
                if (c.webgl_compressed_texture_pvrtc) {
                    ue(w, {
                        "rgb pvrtc 4bppv1": sr,
                        "rgb pvrtc 2bppv1": ur,
                        "rgba pvrtc 4bppv1": fr,
                        "rgba pvrtc 2bppv1": cr
                    });
                }
                if (c.webgl_compressed_texture_etc1) {
                    w["rgb etc1"] = lr;
                }
                var n = Array.prototype.slice.call(d.getParameter(In));
                Object.keys(w).forEach(function(e) {
                    var t = w[e];
                    if (n.indexOf(t) >= 0) {
                        b[e] = t;
                    }
                });
                var e = Object.keys(b);
                y.textureFormats = e;
                var E = [];
                Object.keys(b).forEach(function(e) {
                    var t = b[e];
                    E[t] = e;
                });
                var S = [];
                Object.keys(x).forEach(function(e) {
                    var t = x[e];
                    S[t] = e;
                });
                var A = [];
                Object.keys(m).forEach(function(e) {
                    var t = m[e];
                    A[t] = e;
                });
                var M = [];
                Object.keys(_).forEach(function(e) {
                    var t = _[e];
                    M[t] = e;
                });
                var R = [];
                Object.keys(p).forEach(function(e) {
                    var t = p[e];
                    R[t] = e;
                });
                var O = e.reduce(function(e, t) {
                    var n = b[t];
                    if (n === zn || n === qn || n === zn || n === Un || n === Kn || n === Yn || c.ext_srgb && (n === Qn || n === Jn)) {
                        e[n] = n;
                    } else if (n === Hn || t.indexOf("rgba") >= 0) {
                        e[n] = Ln;
                    } else {
                        e[n] = Zn;
                    }
                    return e;
                }, {});
                function r() {
                    this.internalformat = Ln;
                    this.format = Ln;
                    this.type = hr;
                    this.compressed = false;
                    this.premultiplyAlpha = false;
                    this.flipY = false;
                    this.unpackAlignment = 1;
                    this.colorSpace = qr;
                    this.width = 0;
                    this.height = 0;
                    this.channels = 0;
                }
                function B(e, t) {
                    e.internalformat = t.internalformat;
                    e.format = t.format;
                    e.type = t.type;
                    e.compressed = t.compressed;
                    e.premultiplyAlpha = t.premultiplyAlpha;
                    e.flipY = t.flipY;
                    e.unpackAlignment = t.unpackAlignment;
                    e.colorSpace = t.colorSpace;
                    e.width = t.width;
                    e.height = t.height;
                    e.channels = t.channels;
                }
                function C(e, t) {
                    if (typeof t !== "object" || !t) {
                        return;
                    }
                    if ("premultiplyAlpha" in t) {
                        fe.type(t.premultiplyAlpha, "boolean", "invalid premultiplyAlpha");
                        e.premultiplyAlpha = t.premultiplyAlpha;
                    }
                    if ("flipY" in t) {
                        fe.type(t.flipY, "boolean", "invalid texture flip");
                        e.flipY = t.flipY;
                    }
                    if ("alignment" in t) {
                        fe.oneOf(t.alignment, [ 1, 2, 4, 8 ], "invalid texture unpack alignment");
                        e.unpackAlignment = t.alignment;
                    }
                    if ("colorSpace" in t) {
                        fe.parameter(t.colorSpace, g, "invalid colorSpace");
                        e.colorSpace = g[t.colorSpace];
                    }
                    if ("type" in t) {
                        var n = t.type;
                        fe(c.oes_texture_float || !(n === "float" || n === "float32"), "you must enable the OES_texture_float extension in order to use floating point textures.");
                        fe(c.oes_texture_half_float || !(n === "half float" || n === "float16"), "you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.");
                        fe(c.webgl_depth_texture || !(n === "uint16" || n === "uint32" || n === "depth stencil"), "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.");
                        fe.parameter(n, x, "invalid texture type");
                        e.type = x[n];
                    }
                    var r = e.width;
                    var i = e.height;
                    var a = e.channels;
                    var o = false;
                    if ("shape" in t) {
                        fe(Array.isArray(t.shape) && t.shape.length >= 2, "shape must be an array");
                        r = t.shape[0];
                        i = t.shape[1];
                        if (t.shape.length === 3) {
                            a = t.shape[2];
                            fe(a > 0 && a <= 4, "invalid number of channels");
                            o = true;
                        }
                        fe(r >= 0 && r <= y.maxTextureSize, "invalid width");
                        fe(i >= 0 && i <= y.maxTextureSize, "invalid height");
                    } else {
                        if ("radius" in t) {
                            r = i = t.radius;
                            fe(r >= 0 && r <= y.maxTextureSize, "invalid radius");
                        }
                        if ("width" in t) {
                            r = t.width;
                            fe(r >= 0 && r <= y.maxTextureSize, "invalid width");
                        }
                        if ("height" in t) {
                            i = t.height;
                            fe(i >= 0 && i <= y.maxTextureSize, "invalid height");
                        }
                        if ("channels" in t) {
                            a = t.channels;
                            fe(a > 0 && a <= 4, "invalid number of channels");
                            o = true;
                        }
                    }
                    e.width = r | 0;
                    e.height = i | 0;
                    e.channels = a | 0;
                    var s = false;
                    if ("format" in t) {
                        var u = t.format;
                        fe(c.webgl_depth_texture || !(u === "depth" || u === "depth stencil"), "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.");
                        fe.parameter(u, b, "invalid texture format");
                        var f = e.internalformat = b[u];
                        e.format = O[f];
                        if (u in x) {
                            if (!("type" in t)) {
                                e.type = x[u];
                            }
                        }
                        if (u in w) {
                            e.compressed = true;
                        }
                        s = true;
                    }
                    if (!o && s) {
                        e.channels = Gr[e.format];
                    } else if (o && !s) {
                        if (e.channels !== Ur[e.format]) {
                            e.format = e.internalformat = Ur[e.channels];
                        }
                    } else if (s && o) {
                        fe(e.channels === Gr[e.format], "number of channels inconsistent with specified format");
                    }
                }
                function F(e) {
                    d.pixelStorei(Dr, e.flipY);
                    d.pixelStorei(Nr, e.premultiplyAlpha);
                    d.pixelStorei(Lr, e.colorSpace);
                    d.pixelStorei(Pr, e.unpackAlignment);
                }
                function t() {
                    r.call(this);
                    this.xOffset = 0;
                    this.yOffset = 0;
                    this.data = null;
                    this.needsFree = false;
                    this.element = null;
                    this.needsCopy = false;
                }
                function I(e, t) {
                    var n = null;
                    if (ui(t)) {
                        n = t;
                    } else if (t) {
                        fe.type(t, "object", "invalid pixel data type");
                        C(e, t);
                        if ("x" in t) {
                            e.xOffset = t.x | 0;
                        }
                        if ("y" in t) {
                            e.yOffset = t.y | 0;
                        }
                        if (ui(t.data)) {
                            n = t.data;
                        }
                    }
                    fe(!e.compressed || n instanceof Uint8Array, "compressed texture data must be stored in a uint8array");
                    if (t.copy) {
                        fe(!n, "can not specify copy and data field for the same texture");
                        var r = T.viewportWidth;
                        var i = T.viewportHeight;
                        e.width = e.width || r - e.xOffset;
                        e.height = e.height || i - e.yOffset;
                        e.needsCopy = true;
                        fe(e.xOffset >= 0 && e.xOffset < r && e.yOffset >= 0 && e.yOffset < i && e.width > 0 && e.width <= r && e.height > 0 && e.height <= i, "copy texture read out of bounds");
                    } else if (!n) {
                        e.width = e.width || 1;
                        e.height = e.height || 1;
                        e.channels = e.channels || 4;
                    } else if (ne(n)) {
                        e.channels = e.channels || 4;
                        e.data = n;
                        if (!("type" in t) && e.type === hr) {
                            e.type = fi(n);
                        }
                    } else if ($r(n)) {
                        e.channels = e.channels || 4;
                        ci(e, n);
                        e.alignment = 1;
                        e.needsFree = true;
                    } else if (Mt(n)) {
                        var a = n.data;
                        if (!Array.isArray(a) && e.type === hr) {
                            e.type = fi(a);
                        }
                        var o = n.shape;
                        var s = n.stride;
                        var u, f, c, l, h, d;
                        if (o.length === 3) {
                            c = o[2];
                            d = s[2];
                        } else {
                            fe(o.length === 2, "invalid ndarray pixel data, must be 2 or 3D");
                            c = 1;
                            d = 1;
                        }
                        u = o[0];
                        f = o[1];
                        l = s[0];
                        h = s[1];
                        e.alignment = 1;
                        e.width = u;
                        e.height = f;
                        e.channels = c;
                        e.format = e.internalformat = Ur[c];
                        e.needsFree = true;
                        di(e, a, l, h, d, n.offset);
                    } else if (ni(n) || ri(n) || ii(n)) {
                        if (ni(n) || ri(n)) {
                            e.element = n;
                        } else {
                            e.element = n.canvas;
                        }
                        e.width = e.element.width;
                        e.height = e.element.height;
                        e.channels = 4;
                    } else if (ai(n)) {
                        e.element = n;
                        e.width = n.width;
                        e.height = n.height;
                        e.channels = 4;
                    } else if (oi(n)) {
                        e.element = n;
                        e.width = n.naturalWidth;
                        e.height = n.naturalHeight;
                        e.channels = 4;
                    } else if (si(n)) {
                        e.element = n;
                        e.width = n.videoWidth;
                        e.height = n.videoHeight;
                        e.channels = 4;
                    } else if (ei(n)) {
                        var v = e.width || n[0].length;
                        var p = e.height || n.length;
                        var m = e.channels;
                        if (Cn(n[0][0])) {
                            m = m || n[0][0].length;
                        } else {
                            m = m || 1;
                        }
                        var _ = Ot.shape(n);
                        var g = 1;
                        for (var x = 0; x < _.length; ++x) {
                            g *= _[x];
                        }
                        var b = li(e, g);
                        Ot.flatten(n, _, "", b);
                        hi(e, b);
                        e.alignment = 1;
                        e.width = v;
                        e.height = p;
                        e.channels = m;
                        e.format = e.internalformat = Ur[m];
                        e.needsFree = true;
                    }
                    if (e.type === pr) {
                        fe(y.extensions.indexOf("oes_texture_float") >= 0, "oes_texture_float extension not enabled");
                    } else if (e.type === $n) {
                        fe(y.extensions.indexOf("oes_texture_half_float") >= 0, "oes_texture_half_float extension not enabled");
                    }
                }
                function i(e, t, n) {
                    var r = e.element;
                    var i = e.data;
                    var a = e.internalformat;
                    var o = e.format;
                    var s = e.type;
                    var u = e.width;
                    var f = e.height;
                    a = Ue.getInternalFormat(d, o, s);
                    s = Ue.getTextureType(d, s);
                    F(e);
                    if (r) {
                        d.texImage2D(t, n, a, o, s, r);
                    } else if (e.compressed) {
                        d.compressedTexImage2D(t, n, a, u, f, 0, i);
                    } else if (e.needsCopy) {
                        h();
                        d.copyTexImage2D(t, n, o, e.xOffset, e.yOffset, u, f, 0);
                    } else {
                        d.texImage2D(t, n, a, u, f, 0, o, s, i || null);
                    }
                }
                function P(e, t, n, r, i) {
                    var a = e.element;
                    var o = e.data;
                    var s = e.internalformat;
                    var u = e.format;
                    var f = e.type;
                    var c = e.width;
                    var l = e.height;
                    F(e);
                    if (a) {
                        d.texSubImage2D(t, i, n, r, u, f, a);
                    } else if (e.compressed) {
                        d.compressedTexSubImage2D(t, i, n, r, s, c, l, o);
                    } else if (e.needsCopy) {
                        h();
                        d.copyTexSubImage2D(t, i, n, r, e.xOffset, e.yOffset, c, l);
                    } else {
                        d.texSubImage2D(t, i, n, r, c, l, u, f, o);
                    }
                }
                var a = [];
                function D() {
                    return a.pop() || new t();
                }
                function N(e) {
                    if (e.needsFree) {
                        Ne.freeType(e.data);
                    }
                    t.call(e);
                    a.push(e);
                }
                function o() {
                    r.call(this);
                    this.genMipmaps = false;
                    this.mipmapHint = Br;
                    this.mipmask = 0;
                    this.images = Array(16);
                }
                function L(e, t, n) {
                    var r = e.images[0] = D();
                    e.mipmask = 1;
                    r.width = e.width = t;
                    r.height = e.height = n;
                    r.channels = e.channels = 4;
                }
                function q(e, t) {
                    var n = null;
                    if (ui(t)) {
                        n = e.images[0] = D();
                        B(n, e);
                        I(n, t);
                        e.mipmask = 1;
                    } else {
                        C(e, t);
                        if (Array.isArray(t.mipmap)) {
                            var r = t.mipmap;
                            for (var i = 0; i < r.length; ++i) {
                                n = e.images[i] = D();
                                B(n, e);
                                n.width >>= i;
                                n.height >>= i;
                                I(n, r[i]);
                                e.mipmask |= 1 << i;
                            }
                        } else {
                            n = e.images[0] = D();
                            B(n, e);
                            I(n, t);
                            e.mipmask = 1;
                        }
                    }
                    B(e, e.images[0]);
                    if (e.compressed && (e.internalformat === er || e.internalformat === tr || e.internalformat === nr || e.internalformat === rr)) {
                        fe(e.width % 4 === 0 && e.height % 4 === 0, "for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4");
                    }
                }
                function Z(e, t) {
                    var n = e.images;
                    for (var r = 0; r < n.length; ++r) {
                        if (!n[r]) {
                            return;
                        }
                        i(n[r], t, r);
                    }
                }
                var s = [];
                function z() {
                    var e = s.pop() || new o();
                    r.call(e);
                    e.mipmask = 0;
                    for (var t = 0; t < 16; ++t) {
                        e.images[t] = null;
                    }
                    return e;
                }
                function U(e) {
                    var t = e.images;
                    for (var n = 0; n < t.length; ++n) {
                        if (t[n]) {
                            N(t[n]);
                        }
                        t[n] = null;
                    }
                    s.push(e);
                }
                function G() {
                    this.minFilter = wr;
                    this.magFilter = wr;
                    this.wrapS = xr;
                    this.wrapT = xr;
                    this.anisotropic = 1;
                    this.genMipmaps = false;
                    this.mipmapHint = Br;
                }
                function H(e, t) {
                    if ("min" in t) {
                        var n = t.min;
                        fe.parameter(n, _);
                        e.minFilter = _[n];
                        if (zr.indexOf(e.minFilter) >= 0 && !("faces" in t)) {
                            e.genMipmaps = true;
                        }
                    }
                    if ("mag" in t) {
                        var r = t.mag;
                        fe.parameter(r, m);
                        e.magFilter = m[r];
                    }
                    var i = e.wrapS;
                    var a = e.wrapT;
                    if ("wrap" in t) {
                        var o = t.wrap;
                        if (typeof o === "string") {
                            fe.parameter(o, p);
                            i = a = p[o];
                        } else if (Array.isArray(o)) {
                            fe.parameter(o[0], p);
                            fe.parameter(o[1], p);
                            i = p[o[0]];
                            a = p[o[1]];
                        }
                    } else {
                        if ("wrapS" in t) {
                            var s = t.wrapS;
                            fe.parameter(s, p);
                            i = p[s];
                        }
                        if ("wrapT" in t) {
                            var u = t.wrapT;
                            fe.parameter(u, p);
                            a = p[u];
                        }
                    }
                    e.wrapS = i;
                    e.wrapT = a;
                    if ("anisotropic" in t) {
                        var f = t.anisotropic;
                        fe(typeof f === "number" && f >= 1 && f <= y.maxAnisotropic, "aniso samples must be between 1 and ");
                        e.anisotropic = t.anisotropic;
                    }
                    if ("mipmap" in t) {
                        var c = false;
                        switch (typeof t.mipmap) {
                          case "string":
                            fe.parameter(t.mipmap, l, "invalid mipmap hint");
                            e.mipmapHint = l[t.mipmap];
                            e.genMipmaps = true;
                            c = true;
                            break;

                          case "boolean":
                            c = e.genMipmaps = t.mipmap;
                            break;

                          case "object":
                            fe(Array.isArray(t.mipmap), "invalid mipmap type");
                            e.genMipmaps = false;
                            c = true;
                            break;

                          default:
                            fe.raise("invalid mipmap type");
                        }
                        if (c && !("min" in t)) {
                            e.minFilter = Sr;
                        }
                    }
                }
                function k(e, t) {
                    d.texParameteri(t, Tr, e.minFilter);
                    d.texParameteri(t, yr, e.magFilter);
                    d.texParameteri(t, mr, e.wrapS);
                    d.texParameteri(t, _r, e.wrapT);
                    if (c.ext_texture_filter_anisotropic) {
                        d.texParameteri(t, Ir, e.anisotropic);
                    }
                    if (e.genMipmaps) {
                        d.hint(Or, e.mipmapHint);
                        d.generateMipmap(t);
                    }
                }
                var f = 0;
                var j = {};
                var V = y.maxTextureUnits;
                var X = Array(V).map(function() {
                    return null;
                });
                function W(e) {
                    r.call(this);
                    this.mipmask = 0;
                    this.internalformat = Ln;
                    this.id = f++;
                    this.refCount = 1;
                    this.target = e;
                    this.texture = d.createTexture();
                    this.unit = -1;
                    this.bindCount = 0;
                    this.texInfo = new G();
                    if (v.profile) {
                        this.stats = {
                            size: 0
                        };
                    }
                }
                function K(e) {
                    d.activeTexture(Zr);
                    d.bindTexture(e.target, e.texture);
                }
                function Y() {
                    var e = X[0];
                    if (e) {
                        d.bindTexture(e.target, e.texture);
                    } else {
                        d.bindTexture(Pn, null);
                    }
                }
                function Q(e) {
                    var t = e.texture;
                    fe(t, "must not double destroy texture");
                    var n = e.unit;
                    var r = e.target;
                    if (n >= 0) {
                        d.activeTexture(Zr + n);
                        d.bindTexture(r, null);
                        X[n] = null;
                    }
                    d.deleteTexture(t);
                    e.texture = null;
                    e.params = null;
                    e.pixels = null;
                    e.refCount = 0;
                    delete j[e.id];
                    u.textureCount--;
                }
                ue(W.prototype, {
                    bind: function e() {
                        var t = this;
                        t.bindCount += 1;
                        var n = t.unit;
                        if (n < 0) {
                            for (var r = 0; r < V; ++r) {
                                var i = X[r];
                                if (i) {
                                    if (i.bindCount > 0) {
                                        continue;
                                    }
                                    i.unit = -1;
                                }
                                X[r] = t;
                                n = r;
                                break;
                            }
                            if (n >= V) {
                                fe.raise("insufficient number of texture units");
                            }
                            if (v.profile && u.maxTextureUnits < n + 1) {
                                u.maxTextureUnits = n + 1;
                            }
                            t.unit = n;
                            d.activeTexture(Zr + n);
                            d.bindTexture(t.target, t.texture);
                        }
                        return n;
                    },
                    unbind: function e() {
                        this.bindCount -= 1;
                    },
                    decRef: function e() {
                        if (--this.refCount <= 0) {
                            Q(this);
                        }
                    }
                });
                function J(e, t) {
                    var f = new W(Pn);
                    j[f.id] = f;
                    u.textureCount++;
                    function c(e, t) {
                        var n = f.texInfo;
                        G.call(n);
                        var r = z();
                        if (typeof e === "number") {
                            if (typeof t === "number") {
                                L(r, e | 0, t | 0);
                            } else {
                                L(r, e | 0, e | 0);
                            }
                        } else if (e) {
                            fe.type(e, "object", "invalid arguments to regl.texture");
                            H(n, e);
                            q(r, e);
                        } else {
                            L(r, 1, 1);
                        }
                        if (n.genMipmaps) {
                            r.mipmask = (r.width << 1) - 1;
                        }
                        f.mipmask = r.mipmask;
                        B(f, r);
                        fe.texture2D(n, r, y);
                        f.internalformat = r.internalformat;
                        c.width = r.width;
                        c.height = r.height;
                        K(f);
                        Z(r, Pn);
                        k(n, Pn);
                        Y();
                        U(r);
                        if (v.profile) {
                            f.stats.size = vi(f.internalformat, f.type, r.width, r.height, n.genMipmaps, false);
                        }
                        c.format = E[f.internalformat];
                        c.type = S[f.type];
                        c.mag = A[n.magFilter];
                        c.min = M[n.minFilter];
                        c.wrapS = R[n.wrapS];
                        c.wrapT = R[n.wrapT];
                        return c;
                    }
                    function n(e, t, n, r) {
                        fe(!!e, "must specify image data");
                        var i = t | 0;
                        var a = n | 0;
                        var o = r | 0;
                        var s = D();
                        B(s, f);
                        s.width = 0;
                        s.height = 0;
                        I(s, e);
                        s.width = s.width || (f.width >> o) - i;
                        s.height = s.height || (f.height >> o) - a;
                        fe(f.type === s.type && f.format === s.format && f.internalformat === s.internalformat, "incompatible format for texture.subimage");
                        fe(i >= 0 && a >= 0 && i + s.width <= f.width && a + s.height <= f.height, "texture.subimage write out of bounds");
                        fe(f.mipmask & 1 << o, "missing mipmap data");
                        fe(s.data || s.element || s.needsCopy, "missing image data");
                        K(f);
                        P(s, Pn, i, a, o);
                        Y();
                        N(s);
                        return c;
                    }
                    function r(e, t) {
                        var n = e | 0;
                        var r = t | 0 || n;
                        if (n === f.width && r === f.height) {
                            return c;
                        }
                        c.width = f.width = n;
                        c.height = f.height = r;
                        K(f);
                        var i = Ue.getInternalFormat(d, f.format, f.type);
                        var a = Ue.getTextureType(d, f.type);
                        for (var o = 0; f.mipmask >> o; ++o) {
                            var s = n >> o;
                            var u = r >> o;
                            if (!s || !u) break;
                            d.texImage2D(Pn, o, i, s, u, 0, f.format, a, null);
                        }
                        Y();
                        if (v.profile) {
                            f.stats.size = vi(f.internalformat, f.type, n, r, false, false);
                        }
                        return c;
                    }
                    c(e, t);
                    c.subimage = n;
                    c.resize = r;
                    c._reglType = "texture2d";
                    c._texture = f;
                    if (v.profile) {
                        c.stats = f.stats;
                    }
                    c.destroy = function() {
                        f.decRef();
                    };
                    return c;
                }
                function $(e, t, n, r, i, a) {
                    var c = new W(Dn);
                    j[c.id] = c;
                    u.cubeCount++;
                    var l = new Array(6);
                    function h(e, t, n, r, i, a) {
                        var o;
                        var s = c.texInfo;
                        G.call(s);
                        for (o = 0; o < 6; ++o) {
                            l[o] = z();
                        }
                        if (typeof e === "number" || !e) {
                            var u = e | 0 || 1;
                            for (o = 0; o < 6; ++o) {
                                L(l[o], u, u);
                            }
                        } else if (typeof e === "object") {
                            if (t) {
                                q(l[0], e);
                                q(l[1], t);
                                q(l[2], n);
                                q(l[3], r);
                                q(l[4], i);
                                q(l[5], a);
                            } else {
                                H(s, e);
                                C(c, e);
                                if ("faces" in e) {
                                    var f = e.faces;
                                    fe(Array.isArray(f) && f.length === 6, "cube faces must be a length 6 array");
                                    for (o = 0; o < 6; ++o) {
                                        fe(typeof f[o] === "object" && !!f[o], "invalid input for cube map face");
                                        B(l[o], c);
                                        q(l[o], f[o]);
                                    }
                                } else {
                                    for (o = 0; o < 6; ++o) {
                                        q(l[o], e);
                                    }
                                }
                            }
                        } else {
                            fe.raise("invalid arguments to cube map");
                        }
                        B(c, l[0]);
                        if (!y.npotTextureCube) {
                            fe(Fn(c.width) && Fn(c.height), "your browser does not support non power or two texture dimensions");
                        }
                        if (s.genMipmaps) {
                            c.mipmask = (l[0].width << 1) - 1;
                        } else {
                            c.mipmask = l[0].mipmask;
                        }
                        fe.textureCube(c, s, l, y);
                        c.internalformat = l[0].internalformat;
                        h.width = l[0].width;
                        h.height = l[0].height;
                        K(c);
                        for (o = 0; o < 6; ++o) {
                            Z(l[o], Nn + o);
                        }
                        k(s, Dn);
                        Y();
                        if (v.profile) {
                            c.stats.size = vi(c.internalformat, c.type, h.width, h.height, s.genMipmaps, true);
                        }
                        h.format = E[c.internalformat];
                        h.type = S[c.type];
                        h.mag = A[s.magFilter];
                        h.min = M[s.minFilter];
                        h.wrapS = R[s.wrapS];
                        h.wrapT = R[s.wrapT];
                        for (o = 0; o < 6; ++o) {
                            U(l[o]);
                        }
                        return h;
                    }
                    function o(e, t, n, r, i) {
                        fe(!!t, "must specify image data");
                        fe(typeof e === "number" && e === (e | 0) && e >= 0 && e < 6, "invalid face");
                        var a = n | 0;
                        var o = r | 0;
                        var s = i | 0;
                        var u = D();
                        B(u, c);
                        u.width = 0;
                        u.height = 0;
                        I(u, t);
                        u.width = u.width || (c.width >> s) - a;
                        u.height = u.height || (c.height >> s) - o;
                        fe(c.type === u.type && c.format === u.format && c.internalformat === u.internalformat, "incompatible format for texture.subimage");
                        fe(a >= 0 && o >= 0 && a + u.width <= c.width && o + u.height <= c.height, "texture.subimage write out of bounds");
                        fe(c.mipmask & 1 << s, "missing mipmap data");
                        fe(u.data || u.element || u.needsCopy, "missing image data");
                        K(c);
                        P(u, Nn + e, a, o, s);
                        Y();
                        N(u);
                        return h;
                    }
                    function s(e) {
                        var t = e | 0;
                        if (t === c.width) {
                            return;
                        }
                        h.width = c.width = t;
                        h.height = c.height = t;
                        K(c);
                        for (var n = 0; n < 6; ++n) {
                            for (var r = 0; c.mipmask >> r; ++r) {
                                d.texImage2D(Nn + n, r, c.format, t >> r, t >> r, 0, c.format, c.type, null);
                            }
                        }
                        Y();
                        if (v.profile) {
                            c.stats.size = vi(c.internalformat, c.type, h.width, h.height, false, true);
                        }
                        return h;
                    }
                    h(e, t, n, r, i, a);
                    h.subimage = o;
                    h.resize = s;
                    h._reglType = "textureCube";
                    h._texture = c;
                    if (v.profile) {
                        h.stats = c.stats;
                    }
                    h.destroy = function() {
                        c.decRef();
                    };
                    return h;
                }
                function ee() {
                    for (var e = 0; e < V; ++e) {
                        d.activeTexture(Zr + e);
                        d.bindTexture(Pn, null);
                        X[e] = null;
                    }
                    Rt(j).forEach(Q);
                    u.cubeCount = 0;
                    u.textureCount = 0;
                }
                if (v.profile) {
                    u.getTotalTextureSize = function() {
                        var t = 0;
                        Object.keys(j).forEach(function(e) {
                            t += j[e].stats.size;
                        });
                        return t;
                    };
                }
                function te() {
                    for (var e = 0; e < V; ++e) {
                        var t = X[e];
                        if (t) {
                            t.bindCount = 0;
                            t.unit = -1;
                            X[e] = null;
                        }
                    }
                    Rt(j).forEach(function(e) {
                        e.texture = d.createTexture();
                        d.bindTexture(e.target, e.texture);
                        var t = Ue.getInternalFormat(d, e.format, e.type);
                        var n = Ue.getTextureType(d, e.type);
                        for (var r = 0; r < 32; ++r) {
                            if ((e.mipmask & 1 << r) === 0) {
                                continue;
                            }
                            if (e.target === Pn) {
                                d.texImage2D(Pn, r, t, e.width >> r, e.height >> r, 0, e.format, n, null);
                            } else {
                                for (var i = 0; i < 6; ++i) {
                                    d.texImage2D(Nn + i, r, t, e.width >> r, e.height >> r, 0, e.format, n, null);
                                }
                            }
                        }
                        k(e.texInfo, e.target);
                    });
                }
                return {
                    create2D: J,
                    createCube: $,
                    clear: ee,
                    getTexture: function e(t) {
                        return null;
                    },
                    restore: te
                };
            }
            Jr[Gn] = 2, Jr[Hn] = 2, Jr[kn] = 2, Jr[Yn] = 4, Jr[er] = .5, Jr[tr] = .5, Jr[nr] = 1, 
            Jr[rr] = 1, Jr[ir] = .5, Jr[ar] = 1, Jr[or] = 1, Jr[sr] = .5, Jr[ur] = .25, Jr[fr] = .5, 
            Jr[cr] = .25, Jr[lr] = .5;
            var mi = 36161, _i = 32854, gi = 32855, xi = 36194, bi = 33189, yi = 36168, Ti = 34041, wi = 35907, Ei = 34836, Si = 34842, Ai = 34843, Mi = [];
            function Ri(e, t, n) {
                return Mi[e] * t * n;
            }
            Mi[_i] = 2, Mi[gi] = 2, Mi[xi] = 2, Mi[bi] = 2, Mi[yi] = 1, Mi[Ti] = 4, Mi[wi] = 4, 
            Mi[Ei] = 16, Mi[Si] = 8, Mi[Ai] = 6;
            var Oi = function e(f, t, c, r, l) {
                var h = {
                    rgba4: _i,
                    rgb565: xi,
                    "rgb5 a1": gi,
                    depth: bi,
                    stencil: yi,
                    "depth stencil": Ti
                };
                if (t.ext_srgb) {
                    h["srgba"] = wi;
                }
                if (t.ext_color_buffer_half_float) {
                    h["rgba16f"] = Si;
                    h["rgb16f"] = Ai;
                }
                if (t.webgl_color_buffer_float) {
                    h["rgba32f"] = Ei;
                }
                var d = [];
                Object.keys(h).forEach(function(e) {
                    var t = h[e];
                    d[t] = e;
                });
                var n = 0;
                var i = {};
                function a(e) {
                    this.id = n++;
                    this.refCount = 1;
                    this.renderbuffer = e;
                    this.format = _i;
                    this.width = 0;
                    this.height = 0;
                    if (l.profile) {
                        this.stats = {
                            size: 0
                        };
                    }
                }
                a.prototype.decRef = function() {
                    if (--this.refCount <= 0) {
                        o(this);
                    }
                };
                function o(e) {
                    var t = e.renderbuffer;
                    fe(t, "must not double destroy renderbuffer");
                    f.bindRenderbuffer(mi, null);
                    f.deleteRenderbuffer(t);
                    e.renderbuffer = null;
                    e.refCount = 0;
                    delete i[e.id];
                    r.renderbufferCount--;
                }
                function s(e, t) {
                    var s = new a(f.createRenderbuffer());
                    i[s.id] = s;
                    r.renderbufferCount++;
                    function u(e, t) {
                        var n = 0;
                        var r = 0;
                        var i = _i;
                        if (typeof e === "object" && e) {
                            var a = e;
                            if ("shape" in a) {
                                var o = a.shape;
                                fe(Array.isArray(o) && o.length >= 2, "invalid renderbuffer shape");
                                n = o[0] | 0;
                                r = o[1] | 0;
                            } else {
                                if ("radius" in a) {
                                    n = r = a.radius | 0;
                                }
                                if ("width" in a) {
                                    n = a.width | 0;
                                }
                                if ("height" in a) {
                                    r = a.height | 0;
                                }
                            }
                            if ("format" in a) {
                                fe.parameter(a.format, h, "invalid renderbuffer format");
                                i = h[a.format];
                            }
                        } else if (typeof e === "number") {
                            n = e | 0;
                            if (typeof t === "number") {
                                r = t | 0;
                            } else {
                                r = n;
                            }
                        } else if (!e) {
                            n = r = 1;
                        } else {
                            fe.raise("invalid arguments to renderbuffer constructor");
                        }
                        fe(n > 0 && r > 0 && n <= c.maxRenderbufferSize && r <= c.maxRenderbufferSize, "invalid renderbuffer size");
                        if (n === s.width && r === s.height && i === s.format) {
                            return;
                        }
                        u.width = s.width = n;
                        u.height = s.height = r;
                        s.format = i;
                        f.bindRenderbuffer(mi, s.renderbuffer);
                        f.renderbufferStorage(mi, i, n, r);
                        fe(f.getError() === 0, "invalid render buffer format");
                        if (l.profile) {
                            s.stats.size = Ri(s.format, s.width, s.height);
                        }
                        u.format = d[s.format];
                        return u;
                    }
                    function n(e, t) {
                        var n = e | 0;
                        var r = t | 0 || n;
                        if (n === s.width && r === s.height) {
                            return u;
                        }
                        fe(n > 0 && r > 0 && n <= c.maxRenderbufferSize && r <= c.maxRenderbufferSize, "invalid renderbuffer size");
                        u.width = s.width = n;
                        u.height = s.height = r;
                        f.bindRenderbuffer(mi, s.renderbuffer);
                        f.renderbufferStorage(mi, s.format, n, r);
                        fe(f.getError() === 0, "invalid render buffer format");
                        if (l.profile) {
                            s.stats.size = Ri(s.format, s.width, s.height);
                        }
                        return u;
                    }
                    u(e, t);
                    u.resize = n;
                    u._reglType = "renderbuffer";
                    u._renderbuffer = s;
                    if (l.profile) {
                        u.stats = s.stats;
                    }
                    u.destroy = function() {
                        s.decRef();
                    };
                    return u;
                }
                if (l.profile) {
                    r.getTotalRenderbufferSize = function() {
                        var t = 0;
                        Object.keys(i).forEach(function(e) {
                            t += i[e].stats.size;
                        });
                        return t;
                    };
                }
                function u() {
                    Rt(i).forEach(function(e) {
                        e.renderbuffer = f.createRenderbuffer();
                        f.bindRenderbuffer(mi, e.renderbuffer);
                        f.renderbufferStorage(mi, e.format, e.width, e.height);
                    });
                    f.bindRenderbuffer(mi, null);
                }
                return {
                    create: s,
                    clear: function e() {
                        Rt(i).forEach(o);
                    },
                    restore: u
                };
            }, Bi = 36160, Ci = 36161, Fi = 3553, Ii = 34069, Pi = 36064, Di = 36096, Ni = 36128, Li = 33306, qi = 36053, Zi = 36054, zi = 36055, Ui = 36057, Gi = 36061, Hi = 36193, ki = 5121, ji = 5126, Vi = 6407, Xi = 6408, Wi = 6402, Ki = [ Vi, Xi ], Yi = [];
            Yi[Xi] = 4, Yi[Vi] = 3;
            var Qi = [];
            Qi[ki] = 1, Qi[ji] = 4, Qi[Hi] = 2;
            var Ji, $i, ea, ta = 33189, na = 36168, ra = 34041, ia, aa, oa, sa, ua = [ 32854, 32855, 36194, 35907, 34842, 34843, 34836 ], fa = {};
            function ca(i, A, M, m, s, r) {
                var R = {
                    cur: null,
                    next: null,
                    dirty: false,
                    setFBO: null
                };
                var O = [ "rgba" ];
                var B = [ "rgba4", "rgb565", "rgb5 a1" ];
                if (A.ext_srgb) {
                    B.push("srgba");
                }
                if (A.ext_color_buffer_half_float) {
                    B.push("rgba16f", "rgb16f");
                }
                if (A.webgl_color_buffer_float) {
                    B.push("rgba32f");
                }
                var C = [ "uint8" ];
                if (A.oes_texture_half_float) {
                    C.push("half float", "float16");
                }
                if (A.oes_texture_float) {
                    C.push("float", "float32");
                }
                function u(e, t, n) {
                    this.target = e;
                    this.texture = t;
                    this.renderbuffer = n;
                    var r = 0;
                    var i = 0;
                    if (t) {
                        r = t.width;
                        i = t.height;
                    } else if (n) {
                        r = n.width;
                        i = n.height;
                    }
                    this.width = r;
                    this.height = i;
                }
                function t(e) {
                    if (e) {
                        if (e.texture) {
                            e.texture._texture.decRef();
                        }
                        if (e.renderbuffer) {
                            e.renderbuffer._renderbuffer.decRef();
                        }
                    }
                }
                function F(e, t, n) {
                    if (!e) {
                        return;
                    }
                    if (e.texture) {
                        var r = e.texture._texture;
                        var i = Math.max(1, r.width);
                        var a = Math.max(1, r.height);
                        fe(i === t && a === n, "inconsistent width/height for supplied texture");
                        r.refCount += 1;
                    } else {
                        var o = e.renderbuffer._renderbuffer;
                        fe(o.width === t && o.height === n, "inconsistent width/height for renderbuffer");
                        o.refCount += 1;
                    }
                }
                function a(e, t) {
                    if (t) {
                        if (t.texture) {
                            i.framebufferTexture2D(Bi, e, t.target, t.texture._texture.texture, 0);
                        } else {
                            i.framebufferRenderbuffer(Bi, e, Ci, t.renderbuffer._renderbuffer.renderbuffer);
                        }
                    }
                }
                function I(e) {
                    var t = Fi;
                    var n = null;
                    var r = null;
                    var i = e;
                    if (typeof e === "object") {
                        i = e.data;
                        if ("target" in e) {
                            t = e.target | 0;
                        }
                    }
                    fe.type(i, "function", "invalid attachment data");
                    var a = i._reglType;
                    if (a === "texture2d") {
                        n = i;
                        fe(t === Fi);
                    } else if (a === "textureCube") {
                        n = i;
                        fe(t >= Ii && t < Ii + 6, "invalid cube map target");
                    } else if (a === "renderbuffer") {
                        r = i;
                        t = Ci;
                    } else {
                        fe.raise("invalid regl object for attachment");
                    }
                    return new u(t, n, r);
                }
                function P(e, t, n, r, i) {
                    if (n) {
                        var a = m.create2D({
                            width: e,
                            height: t,
                            format: r,
                            type: i
                        });
                        a._texture.refCount = 0;
                        return new u(Fi, a, null);
                    } else {
                        var o = s.create({
                            width: e,
                            height: t,
                            format: r
                        });
                        o._renderbuffer.refCount = 0;
                        return new u(Ci, null, o);
                    }
                }
                function D(e) {
                    return e && (e.texture || e.renderbuffer);
                }
                function o(e, t, n) {
                    if (e) {
                        if (e.texture) {
                            e.texture.resize(t, n);
                        } else if (e.renderbuffer) {
                            e.renderbuffer.resize(t, n);
                        }
                        e.width = t;
                        e.height = n;
                    }
                }
                var e = 0;
                var n = {};
                function f() {
                    this.id = e++;
                    n[this.id] = this;
                    this.framebuffer = i.createFramebuffer();
                    this.width = 0;
                    this.height = 0;
                    this.colorAttachments = [];
                    this.depthAttachment = null;
                    this.stencilAttachment = null;
                    this.depthStencilAttachment = null;
                }
                function N(e) {
                    e.colorAttachments.forEach(t);
                    t(e.depthAttachment);
                    t(e.stencilAttachment);
                    t(e.depthStencilAttachment);
                }
                function c(e) {
                    var t = e.framebuffer;
                    fe(t, "must not double destroy framebuffer");
                    i.deleteFramebuffer(t);
                    e.framebuffer = null;
                    r.framebufferCount--;
                    delete n[e.id];
                }
                function L(e) {
                    var t;
                    i.bindFramebuffer(Bi, e.framebuffer);
                    var n = e.colorAttachments;
                    for (t = 0; t < n.length; ++t) {
                        a(Pi + t, n[t]);
                    }
                    for (t = n.length; t < M.maxColorAttachments; ++t) {
                        i.framebufferTexture2D(Bi, Pi + t, Fi, null, 0);
                    }
                    i.framebufferTexture2D(Bi, Li, Fi, null, 0);
                    i.framebufferTexture2D(Bi, Di, Fi, null, 0);
                    i.framebufferTexture2D(Bi, Ni, Fi, null, 0);
                    a(Di, e.depthAttachment);
                    a(Ni, e.stencilAttachment);
                    a(Li, e.depthStencilAttachment);
                    var r = i.checkFramebufferStatus(Bi);
                    if (!i.isContextLost() && r !== qi) {
                        fe.raise("framebuffer configuration not supported, status = " + fa[r]);
                    }
                    i.bindFramebuffer(Bi, R.next ? R.next.framebuffer : null);
                    R.cur = R.next;
                    i.getError();
                }
                function _(e, t) {
                    var E = new f();
                    r.framebufferCount++;
                    function S(e, t) {
                        var n;
                        fe(R.next !== E, "can not update framebuffer which is currently in use");
                        var r = 0;
                        var i = 0;
                        var a = true;
                        var o = true;
                        var s = null;
                        var u = true;
                        var f = "rgba";
                        var c = "uint8";
                        var l = 1;
                        var h = null;
                        var d = null;
                        var v = null;
                        var p = false;
                        if (typeof e === "number") {
                            r = e | 0;
                            i = t | 0 || r;
                        } else if (!e) {
                            r = i = 1;
                        } else {
                            fe.type(e, "object", "invalid arguments for framebuffer");
                            var m = e;
                            if ("shape" in m) {
                                var _ = m.shape;
                                fe(Array.isArray(_) && _.length >= 2, "invalid shape for framebuffer");
                                r = _[0];
                                i = _[1];
                            } else {
                                if ("radius" in m) {
                                    r = i = m.radius;
                                }
                                if ("width" in m) {
                                    r = m.width;
                                }
                                if ("height" in m) {
                                    i = m.height;
                                }
                            }
                            if ("color" in m || "colors" in m) {
                                s = m.color || m.colors;
                                if (Array.isArray(s)) {
                                    fe(s.length === 1 || A.webgl_draw_buffers, "multiple render targets not supported");
                                }
                            }
                            if (!s) {
                                if ("colorCount" in m) {
                                    l = m.colorCount | 0;
                                    fe(l > 0, "invalid color buffer count");
                                }
                                if ("colorTexture" in m) {
                                    u = !!m.colorTexture;
                                    f = "rgba4";
                                }
                                if ("colorType" in m) {
                                    c = m.colorType;
                                    if (!u) {
                                        if (c === "half float" || c === "float16") {
                                            fe(A.ext_color_buffer_half_float, "you must enable EXT_color_buffer_half_float to use 16-bit render buffers");
                                            f = "rgba16f";
                                        } else if (c === "float" || c === "float32") {
                                            fe(A.webgl_color_buffer_float, "you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers");
                                            f = "rgba32f";
                                        }
                                    } else {
                                        fe(A.oes_texture_float || !(c === "float" || c === "float32"), "you must enable OES_texture_float in order to use floating point framebuffer objects");
                                        fe(A.oes_texture_half_float || !(c === "half float" || c === "float16"), "you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects");
                                    }
                                    fe.oneOf(c, C, "invalid color type");
                                }
                                if ("colorFormat" in m) {
                                    f = m.colorFormat;
                                    if (O.indexOf(f) >= 0) {
                                        u = true;
                                    } else if (B.indexOf(f) >= 0) {
                                        u = false;
                                    } else {
                                        if (u) {
                                            fe.oneOf(m.colorFormat, O, "invalid color format for texture");
                                        } else {
                                            fe.oneOf(m.colorFormat, B, "invalid color format for renderbuffer");
                                        }
                                    }
                                }
                            }
                            if ("depthTexture" in m || "depthStencilTexture" in m) {
                                p = !!(m.depthTexture || m.depthStencilTexture);
                                fe(!p || A.webgl_depth_texture, "webgl_depth_texture extension not supported");
                            }
                            if ("depth" in m) {
                                if (typeof m.depth === "boolean") {
                                    a = m.depth;
                                } else {
                                    h = m.depth;
                                    o = false;
                                }
                            }
                            if ("stencil" in m) {
                                if (typeof m.stencil === "boolean") {
                                    o = m.stencil;
                                } else {
                                    d = m.stencil;
                                    a = false;
                                }
                            }
                            if ("depthStencil" in m) {
                                if (typeof m.depthStencil === "boolean") {
                                    a = o = m.depthStencil;
                                } else {
                                    v = m.depthStencil;
                                    a = false;
                                    o = false;
                                }
                            }
                        }
                        var g = null;
                        var x = null;
                        var b = null;
                        var y = null;
                        if (Array.isArray(s)) {
                            g = s.map(I);
                        } else if (s) {
                            g = [ I(s) ];
                        } else {
                            g = new Array(l);
                            for (n = 0; n < l; ++n) {
                                g[n] = P(r, i, u, f, c);
                            }
                        }
                        fe(A.webgl_draw_buffers || g.length <= 1, "you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.");
                        fe(g.length <= M.maxColorAttachments, "too many color attachments, not supported");
                        r = r || g[0].width;
                        i = i || g[0].height;
                        if (h) {
                            x = I(h);
                        } else if (a && !o) {
                            x = P(r, i, p, "depth", "uint32");
                        }
                        if (d) {
                            b = I(d);
                        } else if (o && !a) {
                            b = P(r, i, false, "stencil", "uint8");
                        }
                        if (v) {
                            y = I(v);
                        } else if (!h && !d && o && a) {
                            y = P(r, i, p, "depth stencil", "depth stencil");
                        }
                        fe(!!h + !!d + !!v <= 1, "invalid framebuffer configuration, can specify exactly one depth/stencil attachment");
                        var T = null;
                        for (n = 0; n < g.length; ++n) {
                            F(g[n], r, i);
                            fe(!g[n] || g[n].texture && Ki.indexOf(g[n].texture._texture.format) >= 0 || g[n].renderbuffer && ua.indexOf(g[n].renderbuffer._renderbuffer.format) >= 0, "framebuffer color attachment " + n + " is invalid");
                            if (g[n] && g[n].texture) {
                                var w = Yi[g[n].texture._texture.format] * Qi[g[n].texture._texture.type];
                                if (T === null) {
                                    T = w;
                                } else {
                                    fe(T === w, "all color attachments much have the same number of bits per pixel.");
                                }
                            }
                        }
                        F(x, r, i);
                        fe(!x || x.texture && x.texture._texture.format === Wi || x.renderbuffer && x.renderbuffer._renderbuffer.format === ta, "invalid depth attachment for framebuffer object");
                        F(b, r, i);
                        fe(!b || b.renderbuffer && b.renderbuffer._renderbuffer.format === na, "invalid stencil attachment for framebuffer object");
                        F(y, r, i);
                        fe(!y || y.texture && y.texture._texture.format === ra || y.renderbuffer && y.renderbuffer._renderbuffer.format === ra, "invalid depth-stencil attachment for framebuffer object");
                        N(E);
                        E.width = r;
                        E.height = i;
                        E.colorAttachments = g;
                        E.depthAttachment = x;
                        E.stencilAttachment = b;
                        E.depthStencilAttachment = y;
                        S.color = g.map(D);
                        S.depth = D(x);
                        S.stencil = D(b);
                        S.depthStencil = D(y);
                        S.width = E.width;
                        S.height = E.height;
                        L(E);
                        return S;
                    }
                    function n(e, t) {
                        fe(R.next !== E, "can not resize a framebuffer which is currently in use");
                        var n = Math.max(e | 0, 1);
                        var r = Math.max(t | 0 || n, 1);
                        if (n === E.width && r === E.height) {
                            return S;
                        }
                        var i = E.colorAttachments;
                        for (var a = 0; a < i.length; ++a) {
                            o(i[a], n, r);
                        }
                        o(E.depthAttachment, n, r);
                        o(E.stencilAttachment, n, r);
                        o(E.depthStencilAttachment, n, r);
                        E.width = S.width = n;
                        E.height = S.height = r;
                        L(E);
                        return S;
                    }
                    S(e, t);
                    return ue(S, {
                        resize: n,
                        _reglType: "framebuffer",
                        _framebuffer: E,
                        destroy: function e() {
                            c(E);
                            N(E);
                        },
                        use: function e(t) {
                            R.setFBO({
                                framebuffer: S
                            }, t);
                        }
                    });
                }
                function l(e) {
                    var v = Array(6);
                    function p(e) {
                        var t;
                        fe(v.indexOf(R.next) < 0, "can not update framebuffer which is currently in use");
                        var n = {
                            color: null
                        };
                        var r = 0;
                        var i = null;
                        var a = "rgba";
                        var o = "uint8";
                        var s = 1;
                        if (typeof e === "number") {
                            r = e | 0;
                        } else if (!e) {
                            r = 1;
                        } else {
                            fe.type(e, "object", "invalid arguments for framebuffer");
                            var u = e;
                            if ("shape" in u) {
                                var f = u.shape;
                                fe(Array.isArray(f) && f.length >= 2, "invalid shape for framebuffer");
                                fe(f[0] === f[1], "cube framebuffer must be square");
                                r = f[0];
                            } else {
                                if ("radius" in u) {
                                    r = u.radius | 0;
                                }
                                if ("width" in u) {
                                    r = u.width | 0;
                                    if ("height" in u) {
                                        fe(u.height === r, "must be square");
                                    }
                                } else if ("height" in u) {
                                    r = u.height | 0;
                                }
                            }
                            if ("color" in u || "colors" in u) {
                                i = u.color || u.colors;
                                if (Array.isArray(i)) {
                                    fe(i.length === 1 || A.webgl_draw_buffers, "multiple render targets not supported");
                                }
                            }
                            if (!i) {
                                if ("colorCount" in u) {
                                    s = u.colorCount | 0;
                                    fe(s > 0, "invalid color buffer count");
                                }
                                if ("colorType" in u) {
                                    fe.oneOf(u.colorType, C, "invalid color type");
                                    o = u.colorType;
                                }
                                if ("colorFormat" in u) {
                                    a = u.colorFormat;
                                    fe.oneOf(u.colorFormat, O, "invalid color format for texture");
                                }
                            }
                            if ("depth" in u) {
                                n.depth = u.depth;
                            }
                            if ("stencil" in u) {
                                n.stencil = u.stencil;
                            }
                            if ("depthStencil" in u) {
                                n.depthStencil = u.depthStencil;
                            }
                        }
                        var c;
                        if (i) {
                            if (Array.isArray(i)) {
                                c = [];
                                for (t = 0; t < i.length; ++t) {
                                    c[t] = i[t];
                                }
                            } else {
                                c = [ i ];
                            }
                        } else {
                            c = Array(s);
                            var l = {
                                radius: r,
                                format: a,
                                type: o
                            };
                            for (t = 0; t < s; ++t) {
                                c[t] = m.createCube(l);
                            }
                        }
                        n.color = Array(c.length);
                        for (t = 0; t < c.length; ++t) {
                            var h = c[t];
                            fe(typeof h === "function" && h._reglType === "textureCube", "invalid cube map");
                            r = r || h.width;
                            fe(h.width === r && h.height === r, "invalid cube map shape");
                            n.color[t] = {
                                target: Ii,
                                data: c[t]
                            };
                        }
                        for (t = 0; t < 6; ++t) {
                            for (var d = 0; d < c.length; ++d) {
                                n.color[d].target = Ii + t;
                            }
                            if (t > 0) {
                                n.depth = v[0].depth;
                                n.stencil = v[0].stencil;
                                n.depthStencil = v[0].depthStencil;
                            }
                            if (v[t]) {
                                v[t](n);
                            } else {
                                v[t] = _(n);
                            }
                        }
                        return ue(p, {
                            width: r,
                            height: r,
                            color: c
                        });
                    }
                    function t(e) {
                        var t;
                        var n = e | 0;
                        fe(n > 0 && n <= M.maxCubeMapSize, "invalid radius for cube fbo");
                        if (n === p.width) {
                            return p;
                        }
                        var r = p.color;
                        for (t = 0; t < r.length; ++t) {
                            r[t].resize(n);
                        }
                        for (t = 0; t < 6; ++t) {
                            v[t].resize(n);
                        }
                        p.width = p.height = n;
                        return p;
                    }
                    p(e);
                    return ue(p, {
                        faces: v,
                        resize: t,
                        _reglType: "framebufferCube",
                        destroy: function e() {
                            v.forEach(function(e) {
                                e.destroy();
                            });
                        }
                    });
                }
                function h() {
                    R.cur = null;
                    R.next = null;
                    R.dirty = true;
                    Rt(n).forEach(function(e) {
                        e.framebuffer = i.createFramebuffer();
                        L(e);
                    });
                }
                return ue(R, {
                    getFramebuffer: function e(t) {
                        if (typeof t === "function" && t._reglType === "framebuffer") {
                            var n = t._framebuffer;
                            if (n instanceof f) {
                                return n;
                            }
                        }
                        return null;
                    },
                    create: _,
                    createCube: l,
                    clear: function e() {
                        Rt(n).forEach(c);
                    },
                    restore: h
                });
            }
            fa[qi] = "complete", fa[Zi] = "incomplete attachment", fa[Ui] = "incomplete dimensions", 
            fa[zi] = "incomplete, missing attachment", fa[Gi] = "unsupported";
            var la = 5126, ha = 34962;
            function da() {
                this.state = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;
                this.buffer = null;
                this.size = 0;
                this.normalized = false;
                this.type = la;
                this.offset = 0;
                this.stride = 0;
                this.divisor = 0;
            }
            function va(a, f, e, t, c) {
                var l = e.maxAttributes;
                var i = new Array(l);
                for (var n = 0; n < l; ++n) {
                    i[n] = new da();
                }
                var r = 0;
                var o = {};
                var s = {
                    Record: da,
                    scope: {},
                    state: i,
                    currentVAO: null,
                    targetVAO: null,
                    restore: h() ? x : function() {},
                    createVAO: b,
                    getVAO: v,
                    destroyBuffer: u,
                    setVAO: h() ? p : m,
                    clear: h() ? _ : function() {}
                };
                function u(e) {
                    for (var t = 0; t < i.length; ++t) {
                        var n = i[t];
                        if (n.buffer === e) {
                            a.disableVertexAttribArray(t);
                            n.buffer = null;
                        }
                    }
                }
                function h() {
                    return f.oes_vertex_array_object;
                }
                function d() {
                    return f.angle_instanced_arrays;
                }
                function v(e) {
                    if (typeof e === "function" && e._vao) {
                        return e._vao;
                    }
                    return null;
                }
                function p(e) {
                    if (e === s.currentVAO) {
                        return;
                    }
                    var t = h();
                    if (e) {
                        t.bindVertexArrayOES(e.vao);
                    } else {
                        t.bindVertexArrayOES(null);
                    }
                    s.currentVAO = e;
                }
                function m(e) {
                    if (e === s.currentVAO) {
                        return;
                    }
                    if (e) {
                        e.bindAttrs();
                    } else {
                        var t = d();
                        for (var n = 0; n < i.length; ++n) {
                            var r = i[n];
                            if (r.buffer) {
                                a.enableVertexAttribArray(n);
                                a.vertexAttribPointer(n, r.size, r.type, r.normalized, r.stride, r.offfset);
                                if (t) {
                                    t.vertexAttribDivisorANGLE(n, r.divisor);
                                }
                            } else {
                                a.disableVertexAttribArray(n);
                                a.vertexAttrib4f(n, r.x, r.y, r.z, r.w);
                            }
                        }
                    }
                    s.currentVAO = e;
                }
                function _(e) {
                    Rt(o).forEach(function(e) {
                        e.destroy();
                    });
                }
                function g() {
                    this.id = ++r;
                    this.attributes = [];
                    var e = h();
                    if (e) {
                        this.vao = e.createVertexArrayOES();
                    } else {
                        this.vao = null;
                    }
                    o[this.id] = this;
                    this.buffers = [];
                }
                g.prototype.bindAttrs = function() {
                    var e = d();
                    var t = this.attributes;
                    for (var n = 0; n < t.length; ++n) {
                        var r = t[n];
                        if (r.buffer) {
                            a.enableVertexAttribArray(n);
                            a.bindBuffer(ha, r.buffer.buffer);
                            a.vertexAttribPointer(n, r.size, r.type, r.normalized, r.stride, r.offset);
                            if (e) {
                                e.vertexAttribDivisorANGLE(n, r.divisor);
                            }
                        } else {
                            a.disableVertexAttribArray(n);
                            a.vertexAttrib4f(n, r.x, r.y, r.z, r.w);
                        }
                    }
                    for (var i = t.length; i < l; ++i) {
                        a.disableVertexAttribArray(i);
                    }
                };
                g.prototype.refresh = function() {
                    var e = h();
                    if (e) {
                        e.bindVertexArrayOES(this.vao);
                        this.bindAttrs();
                        s.currentVAO = this;
                    }
                };
                g.prototype.destroy = function() {
                    if (this.vao) {
                        var e = h();
                        if (this === s.currentVAO) {
                            s.currentVAO = null;
                            e.bindVertexArrayOES(null);
                        }
                        e.deleteVertexArrayOES(this.vao);
                        this.vao = null;
                    }
                    if (o[this.id]) {
                        delete o[this.id];
                        t.vaoCount -= 1;
                    }
                };
                function x() {
                    var e = h();
                    if (e) {
                        Rt(o).forEach(function(e) {
                            e.refresh();
                        });
                    }
                }
                function b(e) {
                    var s = new g();
                    t.vaoCount += 1;
                    function u(e) {
                        fe(Array.isArray(e), "arguments to vertex array constructor must be an array");
                        fe(e.length < l, "too many attributes");
                        fe(e.length > 0, "must specify at least one attribute");
                        for (var t = 0; t < s.buffers.length; ++t) {
                            s.buffers[t].destroy();
                        }
                        s.buffers.length = 0;
                        var n = s.attributes;
                        n.length = e.length;
                        for (var r = 0; r < e.length; ++r) {
                            var i = e[r];
                            var a = n[r] = new da();
                            if (Array.isArray(i) || ne(i) || Mt(i)) {
                                var o = c.create(i, ha, false, true);
                                a.buffer = c.getBuffer(o);
                                a.size = a.buffer.dimension | 0;
                                a.normalized = false;
                                a.type = a.buffer.dtype;
                                a.offset = 0;
                                a.stride = 0;
                                a.divisor = 0;
                                a.state = 1;
                                s.buffers.push(o);
                            } else if (c.getBuffer(i)) {
                                a.buffer = c.getBuffer(i);
                                a.size = a.buffer.dimension | 0;
                                a.normalized = false;
                                a.type = a.buffer.dtype;
                                a.offset = 0;
                                a.stride = 0;
                                a.divisor = 0;
                                a.state = 1;
                            } else if (c.getBuffer(i.buffer)) {
                                a.buffer = c.getBuffer(i.buffer);
                                a.size = (+i.size || a.buffer.dimension) | 0;
                                a.normalized = !!i.normalized || false;
                                if ("type" in i) {
                                    fe.parameter(i.type, jt, "invalid buffer type");
                                    a.type = jt[i.type];
                                } else {
                                    a.type = a.buffer.dtype;
                                }
                                a.offset = (i.offset || 0) | 0;
                                a.stride = (i.stride || 0) | 0;
                                a.divisor = (i.divisor || 0) | 0;
                                a.state = 1;
                                fe(a.size >= 1 && a.size <= 4, "size must be between 1 and 4");
                                fe(a.offset >= 0, "invalid offset");
                                fe(a.stride >= 0 && a.stride <= 255, "stride must be between 0 and 255");
                                fe(a.divisor >= 0, "divisor must be positive");
                                fe(!a.divisor || !!f.angle_instanced_arrays, "ANGLE_instanced_arrays must be enabled to use divisor");
                            } else if ("x" in i) {
                                fe(r > 0, "first attribute must not be a constant");
                                a.x = +i.x || 0;
                                a.y = +i.y || 0;
                                a.z = +i.z || 0;
                                a.w = +i.w || 0;
                                a.state = 2;
                            } else {
                                fe(false, "invalid attribute spec for location " + r);
                            }
                        }
                        s.refresh();
                        return u;
                    }
                    u.destroy = function() {
                        s.destroy();
                    };
                    u._vao = s;
                    u._reglType = "vao";
                    return u(e);
                }
                return s;
            }
            var pa = 35632, ma = 35633, _a = 35718, ga = 35721;
            function xa(m, _, s, g) {
                var u = {};
                var f = {};
                function x(e, t, n, r) {
                    this.name = e;
                    this.id = t;
                    this.location = n;
                    this.info = r;
                }
                function b(e, t) {
                    for (var n = 0; n < e.length; ++n) {
                        if (e[n].id === t.id) {
                            e[n].location = t.location;
                            return;
                        }
                    }
                    e.push(t);
                }
                function y(e, t, n) {
                    var r = e === pa ? u : f;
                    var i = r[t];
                    if (!i) {
                        var a = _.str(t);
                        i = m.createShader(e);
                        m.shaderSource(i, a);
                        m.compileShader(i);
                        fe.shaderError(m, i, a, e, n);
                        r[t] = i;
                    }
                    return i;
                }
                var c = {};
                var l = [];
                var n = 0;
                function h(e, t) {
                    this.id = n++;
                    this.fragId = e;
                    this.vertId = t;
                    this.program = null;
                    this.uniforms = [];
                    this.attributes = [];
                    this.refCount = 1;
                    if (g.profile) {
                        this.stats = {
                            uniformsCount: 0,
                            attributesCount: 0
                        };
                    }
                }
                function d(e, t, n) {
                    var r, i;
                    var a = y(pa, e.fragId);
                    var o = y(ma, e.vertId);
                    var s = e.program = m.createProgram();
                    m.attachShader(s, a);
                    m.attachShader(s, o);
                    if (n) {
                        for (var u = 0; u < n.length; ++u) {
                            var f = n[u];
                            m.bindAttribLocation(s, f[0], f[1]);
                        }
                    }
                    m.linkProgram(s);
                    fe.linkError(m, s, _.str(e.fragId), _.str(e.vertId), t);
                    var c = m.getProgramParameter(s, _a);
                    if (g.profile) {
                        e.stats.uniformsCount = c;
                    }
                    var l = e.uniforms;
                    for (r = 0; r < c; ++r) {
                        i = m.getActiveUniform(s, r);
                        if (i) {
                            if (i.size > 1) {
                                for (var h = 0; h < i.size; ++h) {
                                    var d = i.name.replace("[0]", "[" + h + "]");
                                    b(l, new x(d, _.id(d), m.getUniformLocation(s, d), i));
                                }
                            } else {
                                b(l, new x(i.name, _.id(i.name), m.getUniformLocation(s, i.name), i));
                            }
                        }
                    }
                    var v = m.getProgramParameter(s, ga);
                    if (g.profile) {
                        e.stats.attributesCount = v;
                    }
                    var p = e.attributes;
                    for (r = 0; r < v; ++r) {
                        i = m.getActiveAttrib(s, r);
                        if (i) {
                            b(p, new x(i.name, _.id(i.name), m.getAttribLocation(s, i.name), i));
                        }
                    }
                }
                if (g.profile) {
                    s.getMaxUniformsCount = function() {
                        var t = 0;
                        l.forEach(function(e) {
                            if (e.stats.uniformsCount > t) {
                                t = e.stats.uniformsCount;
                            }
                        });
                        return t;
                    };
                    s.getMaxAttributesCount = function() {
                        var t = 0;
                        l.forEach(function(e) {
                            if (e.stats.attributesCount > t) {
                                t = e.stats.attributesCount;
                            }
                        });
                        return t;
                    };
                }
                function e() {
                    u = {};
                    f = {};
                    for (var e = 0; e < l.length; ++e) {
                        d(l[e], null, l[e].attributes.map(function(e) {
                            return [ e.location, e.name ];
                        }));
                    }
                }
                return {
                    clear: function e() {
                        var t = m.deleteShader.bind(m);
                        Rt(u).forEach(t);
                        u = {};
                        Rt(f).forEach(t);
                        f = {};
                        l.forEach(function(e) {
                            m.deleteProgram(e.program);
                        });
                        l.length = 0;
                        c = {};
                        s.shaderCount = 0;
                    },
                    program: function n(e, t, r, i) {
                        fe.command(e >= 0, "missing vertex shader", r);
                        fe.command(t >= 0, "missing fragment shader", r);
                        var a = c[t];
                        if (!a) {
                            a = c[t] = {};
                        }
                        var o = a[e];
                        if (o) {
                            o.refCount++;
                            if (!i) {
                                return o;
                            }
                        }
                        var n = new h(t, e);
                        s.shaderCount++;
                        d(n, r, i);
                        if (!o) {
                            a[e] = n;
                        }
                        l.push(n);
                        return ue(n, {
                            destroy: function e() {
                                n.refCount--;
                                if (n.refCount <= 0) {
                                    m.deleteProgram(n.program);
                                    var t = l.indexOf(n);
                                    l.splice(t, 1);
                                    s.shaderCount--;
                                }
                                if (a[n.vertId].refCount <= 0) {
                                    m.deleteShader(f[n.vertId]);
                                    delete f[n.vertId];
                                    delete c[n.fragId][n.vertId];
                                }
                                if (!Object.keys(c[n.fragId]).length) {
                                    m.deleteShader(u[n.fragId]);
                                    delete u[n.fragId];
                                    delete c[n.fragId];
                                }
                            }
                        });
                    },
                    restore: e,
                    shader: y,
                    frag: -1,
                    vert: -1
                };
            }
            var ba = 6408, ya = 5121, Ta = 3333, wa = 5126;
            function Ea(u, f, c, l, h, d, v) {
                function n(e) {
                    var t;
                    if (f.next === null) {
                        fe(h.preserveDrawingBuffer, 'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer');
                        t = ya;
                    } else {
                        fe(f.next.colorAttachments[0].texture !== null, "You cannot read from a renderbuffer");
                        t = f.next.colorAttachments[0].texture._texture.type;
                        if (d.oes_texture_float) {
                            fe(t === ya || t === wa, "Reading from a framebuffer is only allowed for the types 'uint8' and 'float'");
                            if (t === wa) {
                                fe(v.readFloat, "Reading 'float' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float");
                            }
                        } else {
                            fe(t === ya, "Reading from a framebuffer is only allowed for the type 'uint8'");
                        }
                    }
                    var n = 0;
                    var r = 0;
                    var i = l.framebufferWidth;
                    var a = l.framebufferHeight;
                    var o = null;
                    if (ne(e)) {
                        o = e;
                    } else if (e) {
                        fe.type(e, "object", "invalid arguments to regl.read()");
                        n = e.x | 0;
                        r = e.y | 0;
                        fe(n >= 0 && n < l.framebufferWidth, "invalid x offset for regl.read");
                        fe(r >= 0 && r < l.framebufferHeight, "invalid y offset for regl.read");
                        i = (e.width || l.framebufferWidth - n) | 0;
                        a = (e.height || l.framebufferHeight - r) | 0;
                        o = e.data || null;
                    }
                    if (o) {
                        if (t === ya) {
                            fe(o instanceof Uint8Array, "buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'");
                        } else if (t === wa) {
                            fe(o instanceof Float32Array, "buffer must be 'Float32Array' when reading from a framebuffer of type 'float'");
                        }
                    }
                    fe(i > 0 && i + n <= l.framebufferWidth, "invalid width for read pixels");
                    fe(a > 0 && a + r <= l.framebufferHeight, "invalid height for read pixels");
                    c();
                    var s = i * a * 4;
                    if (!o) {
                        if (t === ya) {
                            o = new Uint8Array(s);
                        } else if (t === wa) {
                            o = o || new Float32Array(s);
                        }
                    }
                    fe.isTypedArray(o, "data buffer for regl.read() must be a typedarray");
                    fe(o.byteLength >= s, "data buffer for regl.read() too small");
                    u.pixelStorei(Ta, 4);
                    u.readPixels(n, r, i, a, ba, t, o);
                    return o;
                }
                function t(e) {
                    var t;
                    f.setFBO({
                        framebuffer: e.framebuffer
                    }, function() {
                        t = n(e);
                    });
                    return t;
                }
                function e(e) {
                    if (!e || !("framebuffer" in e)) {
                        return n(e);
                    } else {
                        return t(e);
                    }
                }
                return e;
            }
            function Sa(e) {
                return Array.prototype.slice.call(e);
            }
            function Aa(e) {
                return Sa(e).join("");
            }
            function Ma() {
                var i = 0;
                var r = [];
                var a = [];
                function e(e) {
                    for (var t = 0; t < a.length; ++t) {
                        if (a[t] === e) {
                            return r[t];
                        }
                    }
                    var n = "g" + i++;
                    r.push(n);
                    a.push(e);
                    return n;
                }
                function o() {
                    var t = [];
                    function e() {
                        t.push.apply(t, Sa(arguments));
                    }
                    var n = [];
                    function r() {
                        var e = "v" + i++;
                        n.push(e);
                        if (arguments.length > 0) {
                            t.push(e, "=");
                            t.push.apply(t, Sa(arguments));
                            t.push(";");
                        }
                        return e;
                    }
                    return ue(e, {
                        def: r,
                        toString: function e() {
                            return Aa([ n.length > 0 ? "var " + n.join(",") + ";" : "", Aa(t) ]);
                        }
                    });
                }
                function u() {
                    var i = o();
                    var n = o();
                    var t = i.toString;
                    var r = n.toString;
                    function a(e, t) {
                        n(e, t, "=", i.def(e, t), ";");
                    }
                    return ue(function() {
                        i.apply(i, Sa(arguments));
                    }, {
                        def: i.def,
                        entry: i,
                        exit: n,
                        save: a,
                        set: function e(t, n, r) {
                            a(t, n);
                            i(t, n, "=", r, ";");
                        },
                        toString: function e() {
                            return t() + r();
                        }
                    });
                }
                function t() {
                    var n = Aa(arguments);
                    var t = u();
                    var r = u();
                    var i = t.toString;
                    var a = r.toString;
                    return ue(t, {
                        then: function e() {
                            t.apply(t, Sa(arguments));
                            return this;
                        },
                        else: function e() {
                            r.apply(r, Sa(arguments));
                            return this;
                        },
                        toString: function e() {
                            var t = a();
                            if (t) {
                                t = "else{" + t + "}";
                            }
                            return Aa([ "if(", n, "){", i(), "}", t ]);
                        }
                    });
                }
                var s = o();
                var f = {};
                function n(e, t) {
                    var n = [];
                    function r() {
                        var e = "a" + n.length;
                        n.push(e);
                        return e;
                    }
                    t = t || 0;
                    for (var i = 0; i < t; ++i) {
                        r();
                    }
                    var a = u();
                    var o = a.toString;
                    var s = f[e] = ue(a, {
                        arg: r,
                        toString: function e() {
                            return Aa([ "function(", n.join(), "){", o(), "}" ]);
                        }
                    });
                    return s;
                }
                function c() {
                    var t = [ '"use strict";', s, "return {" ];
                    Object.keys(f).forEach(function(e) {
                        t.push('"', e, '":', f[e].toString(), ",");
                    });
                    t.push("}");
                    var e = Aa(t).replace(/;/g, ";\n").replace(/}/g, "}\n").replace(/{/g, "{\n");
                    var n = Function.apply(null, r.concat(e));
                    return n.apply(null, a);
                }
                return {
                    global: s,
                    link: e,
                    block: o,
                    proc: n,
                    scope: u,
                    cond: t,
                    compile: c
                };
            }
            var Ra = "xyzw".split(""), Oa = 5121, Ba = 1, Ca = 2, Fa = 0, Ia = 1, Pa = 2, Da = 3, Na = 4, La = "dither", qa = "blend.enable", Za = "blend.color", za = "blend.equation", Ua = "blend.func", Ga = "depth.enable", Ha = "depth.func", ka = "depth.range", ja = "depth.mask", Va = "colorMask", Xa = "cull.enable", Wa = "cull.face", Ka = "frontFace", Ya = "lineWidth", Qa = "polygonOffset.enable", Ja = "polygonOffset.offset", $a = "sample.alpha", eo = "sample.enable", to = "sample.coverage", no = "stencil.enable", ro = "stencil.mask", io = "stencil.func", ao = "stencil.opFront", oo = "stencil.opBack", so = "scissor.enable", uo = "scissor.box", fo = "viewport", co = "profile", lo = "framebuffer", ho = "vert", vo = "frag", po = "elements", mo = "primitive", _o = "count", go = "offset", xo = "instances", bo = "vao", yo = "Width", To = "Height", wo = lo + yo, Eo = lo + To, So = fo + yo, Ao = fo + To, Mo = "drawingBuffer", Ro = Mo + yo, Oo = Mo + To, Bo = [ Ua, za, io, ao, oo, to, fo, uo, Ja ], Co = 34962, Fo = 34963, Io, Po, Do = 3553, No = 34067, Lo = 2884, qo = 3042, Zo = 3024, zo = 2960, Uo = 2929, Go = 3089, Ho = 32823, ko = 32926, jo = 32928, Vo = 5126, Xo = 35664, Wo = 35665, Ko = 35666, Yo = 5124, Qo = 35667, Jo = 35668, $o = 35669, es = 35670, ts = 35671, ns = 35672, rs = 35673, is = 35674, as = 35675, os = 35676, ss = 35678, us = 35680, fs = 4, cs = 1028, ls = 1029, hs = 2304, ds = 2305, vs = 32775, ps = 32776, ms = 519, _s = 7680, gs = 0, xs = 1, bs = 32774, ys = 513, Ts = 36160, ws = 36064, Es = {
                0: 0,
                1: 1,
                zero: 0,
                one: 1,
                "src color": 768,
                "one minus src color": 769,
                "src alpha": 770,
                "one minus src alpha": 771,
                "dst color": 774,
                "one minus dst color": 775,
                "dst alpha": 772,
                "one minus dst alpha": 773,
                "constant color": 32769,
                "one minus constant color": 32770,
                "constant alpha": 32771,
                "one minus constant alpha": 32772,
                "src alpha saturate": 776
            }, Ss = [ "constant color, constant alpha", "one minus constant color, constant alpha", "constant color, one minus constant alpha", "one minus constant color, one minus constant alpha", "constant alpha, constant color", "constant alpha, one minus constant color", "one minus constant alpha, constant color", "one minus constant alpha, one minus constant color" ], As = {
                never: 512,
                less: 513,
                "<": 513,
                equal: 514,
                "=": 514,
                "==": 514,
                "===": 514,
                lequal: 515,
                "<=": 515,
                greater: 516,
                ">": 516,
                notequal: 517,
                "!=": 517,
                "!==": 517,
                gequal: 518,
                ">=": 518,
                always: 519
            }, Ms = {
                0: 0,
                zero: 0,
                keep: 7680,
                replace: 7681,
                increment: 7682,
                decrement: 7683,
                "increment wrap": 34055,
                "decrement wrap": 34056,
                invert: 5386
            }, Rs = {
                frag: 35632,
                vert: 35633
            }, Os = {
                cw: hs,
                ccw: ds
            };
            function Bs(e) {
                return Array.isArray(e) || ne(e) || Mt(e);
            }
            function Cs(e) {
                return e.sort(function(e, t) {
                    if (e === fo) {
                        return -1;
                    } else if (t === fo) {
                        return 1;
                    }
                    return e < t ? -1 : 1;
                });
            }
            function Fs(e, t, n, r) {
                this.thisDep = e;
                this.contextDep = t;
                this.propDep = n;
                this.append = r;
            }
            function Is(e) {
                return e && !(e.thisDep || e.contextDep || e.propDep);
            }
            function Ps(e) {
                return new Fs(false, false, false, e);
            }
            function Ds(e, t) {
                var n = e.type;
                if (n === Fa) {
                    var r = e.data.length;
                    return new Fs(true, r >= 1, r >= 2, t);
                } else if (n === Na) {
                    var i = e.data;
                    return new Fs(i.thisDep, i.contextDep, i.propDep, t);
                } else {
                    return new Fs(n === Da, n === Pa, n === Ia, t);
                }
            }
            var Ns = new Fs(false, false, false, function() {});
            function Ls(e, E, x, v, p, c, t, i, n, b, l, r, a, y, o) {
                var m = b.Record;
                var f = {
                    add: 32774,
                    subtract: 32778,
                    "reverse subtract": 32779
                };
                if (x.ext_blend_minmax) {
                    f.min = vs;
                    f.max = ps;
                }
                var T = x.angle_instanced_arrays;
                var h = x.webgl_draw_buffers;
                var _ = {
                    dirty: true,
                    profile: o.profile
                };
                var s = {};
                var w = [];
                var g = {};
                var S = {};
                function A(e) {
                    return e.replace(".", "_");
                }
                function u(e, t, n) {
                    var r = A(e);
                    w.push(e);
                    s[r] = _[r] = !!n;
                    g[r] = t;
                }
                function d(e, t, n) {
                    var r = A(e);
                    w.push(e);
                    if (Array.isArray(n)) {
                        _[r] = n.slice();
                        s[r] = n.slice();
                    } else {
                        _[r] = s[r] = n;
                    }
                    S[r] = t;
                }
                u(La, Zo);
                u(qa, qo);
                d(Za, "blendColor", [ 0, 0, 0, 0 ]);
                d(za, "blendEquationSeparate", [ bs, bs ]);
                d(Ua, "blendFuncSeparate", [ xs, gs, xs, gs ]);
                u(Ga, Uo, true);
                d(Ha, "depthFunc", ys);
                d(ka, "depthRange", [ 0, 1 ]);
                d(ja, "depthMask", true);
                d(Va, Va, [ true, true, true, true ]);
                u(Xa, Lo);
                d(Wa, "cullFace", ls);
                d(Ka, Ka, ds);
                d(Ya, Ya, 1);
                u(Qa, Ho);
                d(Ja, "polygonOffset", [ 0, 0 ]);
                u($a, ko);
                u(eo, jo);
                d(to, "sampleCoverage", [ 1, false ]);
                u(no, zo);
                d(ro, "stencilMask", -1);
                d(io, "stencilFunc", [ ms, 0, -1 ]);
                d(ao, "stencilOpSeparate", [ cs, _s, _s, _s ]);
                d(oo, "stencilOpSeparate", [ ls, _s, _s, _s ]);
                u(so, Go);
                d(uo, "scissor", [ 0, 0, e.drawingBufferWidth, e.drawingBufferHeight ]);
                d(fo, fo, [ 0, 0, e.drawingBufferWidth, e.drawingBufferHeight ]);
                var M = {
                    gl: e,
                    context: a,
                    strings: E,
                    next: s,
                    current: _,
                    draw: r,
                    elements: c,
                    buffer: p,
                    shader: l,
                    attributes: b.state,
                    vao: b,
                    uniforms: n,
                    framebuffer: i,
                    extensions: x,
                    timer: y,
                    isBufferArgs: Bs
                };
                var R = {
                    primTypes: dn,
                    compareFuncs: As,
                    blendFuncs: Es,
                    blendEquations: f,
                    stencilOps: Ms,
                    glTypes: jt,
                    orientationType: Os
                };
                fe.optional(function() {
                    M.isArrayLike = Cn;
                });
                if (h) {
                    R.backBuffer = [ ls ];
                    R.drawBuffer = Se(v.maxDrawbuffers, function(e) {
                        if (e === 0) {
                            return [ 0 ];
                        }
                        return Se(e, function(e) {
                            return ws + e;
                        });
                    });
                }
                var O = 0;
                function B() {
                    var r = Ma();
                    var i = r.link;
                    var t = r.global;
                    r.id = O++;
                    r.batchId = "0";
                    var n = i(M);
                    var a = r.shared = {
                        props: "a0"
                    };
                    Object.keys(M).forEach(function(e) {
                        a[e] = t.def(n, ".", e);
                    });
                    fe.optional(function() {
                        r.CHECK = i(fe);
                        r.commandStr = fe.guessCommand();
                        r.command = i(r.commandStr);
                        r.assert = function(e, t, n) {
                            e("if(!(", t, "))", this.CHECK, ".commandRaise(", i(n), ",", this.command, ");");
                        };
                        R.invalidBlendCombinations = Ss;
                    });
                    var o = r.next = {};
                    var s = r.current = {};
                    Object.keys(S).forEach(function(e) {
                        if (Array.isArray(_[e])) {
                            o[e] = t.def(a.next, ".", e);
                            s[e] = t.def(a.current, ".", e);
                        }
                    });
                    var u = r.constants = {};
                    Object.keys(R).forEach(function(e) {
                        u[e] = t.def(JSON.stringify(R[e]));
                    });
                    r.invoke = function(e, t) {
                        switch (t.type) {
                          case Fa:
                            var n = [ "this", a.context, a.props, r.batchId ];
                            return e.def(i(t.data), ".call(", n.slice(0, Math.max(t.data.length + 1, 4)), ")");

                          case Ia:
                            return e.def(a.props, t.data);

                          case Pa:
                            return e.def(a.context, t.data);

                          case Da:
                            return e.def("this", t.data);

                          case Na:
                            t.data.append(r, e);
                            return t.data.ref;
                        }
                    };
                    r.attribCache = {};
                    var f = {};
                    r.scopeAttrib = function(e) {
                        var t = E.id(e);
                        if (t in f) {
                            return f[t];
                        }
                        var n = b.scope[t];
                        if (!n) {
                            n = b.scope[t] = new m();
                        }
                        var r = f[t] = i(n);
                        return r;
                    };
                    return r;
                }
                function C(e) {
                    var t = e["static"];
                    var n = e.dynamic;
                    var r;
                    if (co in t) {
                        var i = !!t[co];
                        r = Ps(function(e, t) {
                            return i;
                        });
                        r.enable = i;
                    } else if (co in n) {
                        var a = n[co];
                        r = Ds(a, function(e, t) {
                            return e.invoke(t, a);
                        });
                    }
                    return r;
                }
                function F(e, t) {
                    var n = e["static"];
                    var r = e.dynamic;
                    if (lo in n) {
                        var a = n[lo];
                        if (a) {
                            a = i.getFramebuffer(a);
                            fe.command(a, "invalid framebuffer object");
                            return Ps(function(e, t) {
                                var n = e.link(a);
                                var r = e.shared;
                                t.set(r.framebuffer, ".next", n);
                                var i = r.context;
                                t.set(i, "." + wo, n + ".width");
                                t.set(i, "." + Eo, n + ".height");
                                return n;
                            });
                        } else {
                            return Ps(function(e, t) {
                                var n = e.shared;
                                t.set(n.framebuffer, ".next", "null");
                                var r = n.context;
                                t.set(r, "." + wo, r + "." + Ro);
                                t.set(r, "." + Eo, r + "." + Oo);
                                return "null";
                            });
                        }
                    } else if (lo in r) {
                        var s = r[lo];
                        return Ds(s, function(e, t) {
                            var n = e.invoke(t, s);
                            var r = e.shared;
                            var i = r.framebuffer;
                            var a = t.def(i, ".getFramebuffer(", n, ")");
                            fe.optional(function() {
                                e.assert(t, "!" + n + "||" + a, "invalid framebuffer object");
                            });
                            t.set(i, ".next", a);
                            var o = r.context;
                            t.set(o, "." + wo, a + "?" + a + ".width:" + o + "." + Ro);
                            t.set(o, "." + Eo, a + "?" + a + ".height:" + o + "." + Oo);
                            return a;
                        });
                    } else {
                        return null;
                    }
                }
                function I(e, n, r) {
                    var i = e["static"];
                    var h = e.dynamic;
                    function t(u) {
                        if (u in i) {
                            var a = i[u];
                            fe.commandType(a, "object", "invalid " + u, r.commandStr);
                            var e = true;
                            var o = a.x | 0;
                            var s = a.y | 0;
                            var f, c;
                            if ("width" in a) {
                                f = a.width | 0;
                                fe.command(f >= 0, "invalid " + u, r.commandStr);
                            } else {
                                e = false;
                            }
                            if ("height" in a) {
                                c = a.height | 0;
                                fe.command(c >= 0, "invalid " + u, r.commandStr);
                            } else {
                                e = false;
                            }
                            return new Fs(!e && n && n.thisDep, !e && n && n.contextDep, !e && n && n.propDep, function(e, t) {
                                var n = e.shared.context;
                                var r = f;
                                if (!("width" in a)) {
                                    r = t.def(n, ".", wo, "-", o);
                                }
                                var i = c;
                                if (!("height" in a)) {
                                    i = t.def(n, ".", Eo, "-", s);
                                }
                                return [ o, s, r, i ];
                            });
                        } else if (u in h) {
                            var l = h[u];
                            var t = Ds(l, function(e, t) {
                                var n = e.invoke(t, l);
                                fe.optional(function() {
                                    e.assert(t, n + "&&typeof " + n + '==="object"', "invalid " + u);
                                });
                                var r = e.shared.context;
                                var i = t.def(n, ".x|0");
                                var a = t.def(n, ".y|0");
                                var o = t.def('"width" in ', n, "?", n, ".width|0:", "(", r, ".", wo, "-", i, ")");
                                var s = t.def('"height" in ', n, "?", n, ".height|0:", "(", r, ".", Eo, "-", a, ")");
                                fe.optional(function() {
                                    e.assert(t, o + ">=0&&" + s + ">=0", "invalid " + u);
                                });
                                return [ i, a, o, s ];
                            });
                            if (n) {
                                t.thisDep = t.thisDep || n.thisDep;
                                t.contextDep = t.contextDep || n.contextDep;
                                t.propDep = t.propDep || n.propDep;
                            }
                            return t;
                        } else if (n) {
                            return new Fs(n.thisDep, n.contextDep, n.propDep, function(e, t) {
                                var n = e.shared.context;
                                return [ 0, 0, t.def(n, ".", wo), t.def(n, ".", Eo) ];
                            });
                        } else {
                            return null;
                        }
                    }
                    var a = t(fo);
                    if (a) {
                        var o = a;
                        a = new Fs(a.thisDep, a.contextDep, a.propDep, function(e, t) {
                            var n = o.append(e, t);
                            var r = e.shared.context;
                            t.set(r, "." + So, n[2]);
                            t.set(r, "." + Ao, n[3]);
                            return n;
                        });
                    }
                    return {
                        viewport: a,
                        scissor_box: t(uo)
                    };
                }
                function P(e, t) {
                    var n = e["static"];
                    var r = typeof n[vo] === "string" && typeof n[ho] === "string";
                    if (r) {
                        if (Object.keys(t.dynamic).length > 0) {
                            return null;
                        }
                        var i = t["static"];
                        var a = Object.keys(i);
                        if (a.length > 0 && typeof i[a[0]] === "number") {
                            var o = [];
                            for (var s = 0; s < a.length; ++s) {
                                fe(typeof i[a[s]] === "number", "must specify all vertex attribute locations when using vaos");
                                o.push([ i[a[s]] | 0, a[s] ]);
                            }
                            return o;
                        }
                    }
                    return null;
                }
                function D(e, t, n) {
                    var r = e["static"];
                    var o = e.dynamic;
                    function i(i) {
                        if (i in r) {
                            var e = E.id(r[i]);
                            fe.optional(function() {
                                l.shader(Rs[i], e, fe.guessCommand());
                            });
                            var t = Ps(function() {
                                return e;
                            });
                            t.id = e;
                            return t;
                        } else if (i in o) {
                            var a = o[i];
                            return Ds(a, function(e, t) {
                                var n = e.invoke(t, a);
                                var r = t.def(e.shared.strings, ".id(", n, ")");
                                fe.optional(function() {
                                    t(e.shared.shader, ".shader(", Rs[i], ",", r, ",", e.command, ");");
                                });
                                return r;
                            });
                        }
                        return null;
                    }
                    var s = i(vo);
                    var u = i(ho);
                    var a = null;
                    var f;
                    if (Is(s) && Is(u)) {
                        a = l.program(u.id, s.id, null, n);
                        f = Ps(function(e, t) {
                            return e.link(a);
                        });
                    } else {
                        f = new Fs(s && s.thisDep || u && u.thisDep, s && s.contextDep || u && u.contextDep, s && s.propDep || u && u.propDep, function(e, t) {
                            var n = e.shared.shader;
                            var r;
                            if (s) {
                                r = s.append(e, t);
                            } else {
                                r = t.def(n, ".", vo);
                            }
                            var i;
                            if (u) {
                                i = u.append(e, t);
                            } else {
                                i = t.def(n, ".", ho);
                            }
                            var a = n + ".program(" + i + "," + r;
                            fe.optional(function() {
                                a += "," + e.command;
                            });
                            return t.def(a + ")");
                        });
                    }
                    return {
                        frag: s,
                        vert: u,
                        progVar: f,
                        program: a
                    };
                }
                function N(e, o) {
                    var s = e["static"];
                    var u = e.dynamic;
                    function t() {
                        if (po in s) {
                            var r = s[po];
                            if (Bs(r)) {
                                r = c.getElements(c.create(r, true));
                            } else if (r) {
                                r = c.getElements(r);
                                fe.command(r, "invalid elements", o.commandStr);
                            }
                            var e = Ps(function(e, t) {
                                if (r) {
                                    var n = e.link(r);
                                    e.ELEMENTS = n;
                                    return n;
                                }
                                e.ELEMENTS = null;
                                return null;
                            });
                            e.value = r;
                            return e;
                        } else if (po in u) {
                            var f = u[po];
                            return Ds(f, function(e, t) {
                                var n = e.shared;
                                var r = n.isBufferArgs;
                                var i = n.elements;
                                var a = e.invoke(t, f);
                                var o = t.def("null");
                                var s = t.def(r, "(", a, ")");
                                var u = e.cond(s).then(o, "=", i, ".createStream(", a, ");")["else"](o, "=", i, ".getElements(", a, ");");
                                fe.optional(function() {
                                    e.assert(u["else"], "!" + a + "||" + o, "invalid elements");
                                });
                                t.entry(u);
                                t.exit(e.cond(s).then(i, ".destroyStream(", o, ");"));
                                e.ELEMENTS = o;
                                return o;
                            });
                        }
                        return null;
                    }
                    var f = t();
                    function n() {
                        if (mo in s) {
                            var n = s[mo];
                            fe.commandParameter(n, dn, "invalid primitve", o.commandStr);
                            return Ps(function(e, t) {
                                return dn[n];
                            });
                        } else if (mo in u) {
                            var i = u[mo];
                            return Ds(i, function(e, t) {
                                var n = e.constants.primTypes;
                                var r = e.invoke(t, i);
                                fe.optional(function() {
                                    e.assert(t, r + " in " + n, "invalid primitive, must be one of " + Object.keys(dn));
                                });
                                return t.def(n, "[", r, "]");
                            });
                        } else if (f) {
                            if (Is(f)) {
                                if (f.value) {
                                    return Ps(function(e, t) {
                                        return t.def(e.ELEMENTS, ".primType");
                                    });
                                } else {
                                    return Ps(function() {
                                        return fs;
                                    });
                                }
                            } else {
                                return new Fs(f.thisDep, f.contextDep, f.propDep, function(e, t) {
                                    var n = e.ELEMENTS;
                                    return t.def(n, "?", n, ".primType:", fs);
                                });
                            }
                        }
                        return null;
                    }
                    function r(r, i) {
                        if (r in s) {
                            var n = s[r] | 0;
                            fe.command(!i || n >= 0, "invalid " + r, o.commandStr);
                            return Ps(function(e, t) {
                                if (i) {
                                    e.OFFSET = n;
                                }
                                return n;
                            });
                        } else if (r in u) {
                            var a = u[r];
                            return Ds(a, function(e, t) {
                                var n = e.invoke(t, a);
                                if (i) {
                                    e.OFFSET = n;
                                    fe.optional(function() {
                                        e.assert(t, n + ">=0", "invalid " + r);
                                    });
                                }
                                return n;
                            });
                        } else if (i && f) {
                            return Ps(function(e, t) {
                                e.OFFSET = "0";
                                return 0;
                            });
                        }
                        return null;
                    }
                    var i = r(go, true);
                    function a() {
                        if (_o in s) {
                            var e = s[_o] | 0;
                            fe.command(typeof e === "number" && e >= 0, "invalid vertex count", o.commandStr);
                            return Ps(function() {
                                return e;
                            });
                        } else if (_o in u) {
                            var r = u[_o];
                            return Ds(r, function(e, t) {
                                var n = e.invoke(t, r);
                                fe.optional(function() {
                                    e.assert(t, "typeof " + n + '==="number"&&' + n + ">=0&&" + n + "===(" + n + "|0)", "invalid vertex count");
                                });
                                return n;
                            });
                        } else if (f) {
                            if (Is(f)) {
                                if (f) {
                                    if (i) {
                                        return new Fs(i.thisDep, i.contextDep, i.propDep, function(e, t) {
                                            var n = t.def(e.ELEMENTS, ".vertCount-", e.OFFSET);
                                            fe.optional(function() {
                                                e.assert(t, n + ">=0", "invalid vertex offset/element buffer too small");
                                            });
                                            return n;
                                        });
                                    } else {
                                        return Ps(function(e, t) {
                                            return t.def(e.ELEMENTS, ".vertCount");
                                        });
                                    }
                                } else {
                                    var t = Ps(function() {
                                        return -1;
                                    });
                                    fe.optional(function() {
                                        t.MISSING = true;
                                    });
                                    return t;
                                }
                            } else {
                                var n = new Fs(f.thisDep || i.thisDep, f.contextDep || i.contextDep, f.propDep || i.propDep, function(e, t) {
                                    var n = e.ELEMENTS;
                                    if (e.OFFSET) {
                                        return t.def(n, "?", n, ".vertCount-", e.OFFSET, ":-1");
                                    }
                                    return t.def(n, "?", n, ".vertCount:-1");
                                });
                                fe.optional(function() {
                                    n.DYNAMIC = true;
                                });
                                return n;
                            }
                        }
                        return null;
                    }
                    return {
                        elements: f,
                        primitive: n(),
                        count: a(),
                        instances: r(xo, false),
                        offset: i
                    };
                }
                function L(e, o) {
                    var i = e["static"];
                    var s = e.dynamic;
                    var u = {};
                    w.forEach(function(l) {
                        var a = A(l);
                        function e(e, n) {
                            if (l in i) {
                                var t = e(i[l]);
                                u[a] = Ps(function() {
                                    return t;
                                });
                            } else if (l in s) {
                                var r = s[l];
                                u[a] = Ds(r, function(e, t) {
                                    return n(e, t, e.invoke(t, r));
                                });
                            }
                        }
                        switch (l) {
                          case Xa:
                          case qa:
                          case La:
                          case no:
                          case Ga:
                          case so:
                          case Qa:
                          case $a:
                          case eo:
                          case ja:
                            return e(function(e) {
                                fe.commandType(e, "boolean", l, o.commandStr);
                                return e;
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, "typeof " + n + '==="boolean"', "invalid flag " + l, e.commandStr);
                                });
                                return n;
                            });

                          case Ha:
                            return e(function(e) {
                                fe.commandParameter(e, As, "invalid " + l, o.commandStr);
                                return As[e];
                            }, function(e, t, n) {
                                var r = e.constants.compareFuncs;
                                fe.optional(function() {
                                    e.assert(t, n + " in " + r, "invalid " + l + ", must be one of " + Object.keys(As));
                                });
                                return t.def(r, "[", n, "]");
                            });

                          case ka:
                            return e(function(e) {
                                fe.command(Cn(e) && e.length === 2 && typeof e[0] === "number" && typeof e[1] === "number" && e[0] <= e[1], "depth range is 2d array", o.commandStr);
                                return e;
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, e.shared.isArrayLike + "(" + n + ")&&" + n + ".length===2&&" + "typeof " + n + '[0]==="number"&&' + "typeof " + n + '[1]==="number"&&' + n + "[0]<=" + n + "[1]", "depth range must be a 2d array");
                                });
                                var r = t.def("+", n, "[0]");
                                var i = t.def("+", n, "[1]");
                                return [ r, i ];
                            });

                          case Ua:
                            return e(function(e) {
                                fe.commandType(e, "object", "blend.func", o.commandStr);
                                var t = "srcRGB" in e ? e.srcRGB : e.src;
                                var n = "srcAlpha" in e ? e.srcAlpha : e.src;
                                var r = "dstRGB" in e ? e.dstRGB : e.dst;
                                var i = "dstAlpha" in e ? e.dstAlpha : e.dst;
                                fe.commandParameter(t, Es, a + ".srcRGB", o.commandStr);
                                fe.commandParameter(n, Es, a + ".srcAlpha", o.commandStr);
                                fe.commandParameter(r, Es, a + ".dstRGB", o.commandStr);
                                fe.commandParameter(i, Es, a + ".dstAlpha", o.commandStr);
                                fe.command(Ss.indexOf(t + ", " + r) === -1, "unallowed blending combination (srcRGB, dstRGB) = (" + t + ", " + r + ")", o.commandStr);
                                return [ Es[t], Es[r], Es[n], Es[i] ];
                            }, function(r, i, a) {
                                var o = r.constants.blendFuncs;
                                fe.optional(function() {
                                    r.assert(i, a + "&&typeof " + a + '==="object"', "invalid blend func, must be an object");
                                });
                                function e(e, t) {
                                    var n = i.def('"', e, t, '" in ', a, "?", a, ".", e, t, ":", a, ".", e);
                                    fe.optional(function() {
                                        r.assert(i, n + " in " + o, "invalid " + l + "." + e + t + ", must be one of " + Object.keys(Es));
                                    });
                                    return n;
                                }
                                var t = e("src", "RGB");
                                var n = e("dst", "RGB");
                                fe.optional(function() {
                                    var e = r.constants.invalidBlendCombinations;
                                    r.assert(i, e + ".indexOf(" + t + '+", "+' + n + ") === -1 ", "unallowed blending combination for (srcRGB, dstRGB)");
                                });
                                var s = i.def(o, "[", t, "]");
                                var u = i.def(o, "[", e("src", "Alpha"), "]");
                                var f = i.def(o, "[", n, "]");
                                var c = i.def(o, "[", e("dst", "Alpha"), "]");
                                return [ s, f, u, c ];
                            });

                          case za:
                            return e(function(e) {
                                if (typeof e === "string") {
                                    fe.commandParameter(e, f, "invalid " + l, o.commandStr);
                                    return [ f[e], f[e] ];
                                } else if (typeof e === "object") {
                                    fe.commandParameter(e.rgb, f, l + ".rgb", o.commandStr);
                                    fe.commandParameter(e.alpha, f, l + ".alpha", o.commandStr);
                                    return [ f[e.rgb], f[e.alpha] ];
                                } else {
                                    fe.commandRaise("invalid blend.equation", o.commandStr);
                                }
                            }, function(r, e, t) {
                                var i = r.constants.blendEquations;
                                var n = e.def();
                                var a = e.def();
                                var o = r.cond("typeof ", t, '==="string"');
                                fe.optional(function() {
                                    function e(e, t, n) {
                                        r.assert(e, n + " in " + i, "invalid " + t + ", must be one of " + Object.keys(f));
                                    }
                                    e(o.then, l, t);
                                    r.assert(o["else"], t + "&&typeof " + t + '==="object"', "invalid " + l);
                                    e(o["else"], l + ".rgb", t + ".rgb");
                                    e(o["else"], l + ".alpha", t + ".alpha");
                                });
                                o.then(n, "=", a, "=", i, "[", t, "];");
                                o["else"](n, "=", i, "[", t, ".rgb];", a, "=", i, "[", t, ".alpha];");
                                e(o);
                                return [ n, a ];
                            });

                          case Za:
                            return e(function(t) {
                                fe.command(Cn(t) && t.length === 4, "blend.color must be a 4d array", o.commandStr);
                                return Se(4, function(e) {
                                    return +t[e];
                                });
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, e.shared.isArrayLike + "(" + n + ")&&" + n + ".length===4", "blend.color must be a 4d array");
                                });
                                return Se(4, function(e) {
                                    return t.def("+", n, "[", e, "]");
                                });
                            });

                          case ro:
                            return e(function(e) {
                                fe.commandType(e, "number", a, o.commandStr);
                                return e | 0;
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, "typeof " + n + '==="number"', "invalid stencil.mask");
                                });
                                return t.def(n, "|0");
                            });

                          case io:
                            return e(function(e) {
                                fe.commandType(e, "object", a, o.commandStr);
                                var t = e.cmp || "keep";
                                var n = e.ref || 0;
                                var r = "mask" in e ? e.mask : -1;
                                fe.commandParameter(t, As, l + ".cmp", o.commandStr);
                                fe.commandType(n, "number", l + ".ref", o.commandStr);
                                fe.commandType(r, "number", l + ".mask", o.commandStr);
                                return [ As[t], n, r ];
                            }, function(t, n, r) {
                                var i = t.constants.compareFuncs;
                                fe.optional(function() {
                                    function e() {
                                        t.assert(n, Array.prototype.join.call(arguments, ""), "invalid stencil.func");
                                    }
                                    e(r + "&&typeof ", r, '==="object"');
                                    e('!("cmp" in ', r, ")||(", r, ".cmp in ", i, ")");
                                });
                                var e = n.def('"cmp" in ', r, "?", i, "[", r, ".cmp]", ":", _s);
                                var a = n.def(r, ".ref|0");
                                var o = n.def('"mask" in ', r, "?", r, ".mask|0:-1");
                                return [ e, a, o ];
                            });

                          case ao:
                          case oo:
                            return e(function(e) {
                                fe.commandType(e, "object", a, o.commandStr);
                                var t = e.fail || "keep";
                                var n = e.zfail || "keep";
                                var r = e.zpass || "keep";
                                fe.commandParameter(t, Ms, l + ".fail", o.commandStr);
                                fe.commandParameter(n, Ms, l + ".zfail", o.commandStr);
                                fe.commandParameter(r, Ms, l + ".zpass", o.commandStr);
                                return [ l === oo ? ls : cs, Ms[t], Ms[n], Ms[r] ];
                            }, function(t, n, r) {
                                var i = t.constants.stencilOps;
                                fe.optional(function() {
                                    t.assert(n, r + "&&typeof " + r + '==="object"', "invalid " + l);
                                });
                                function e(e) {
                                    fe.optional(function() {
                                        t.assert(n, '!("' + e + '" in ' + r + ")||" + "(" + r + "." + e + " in " + i + ")", "invalid " + l + "." + e + ", must be one of " + Object.keys(Ms));
                                    });
                                    return n.def('"', e, '" in ', r, "?", i, "[", r, ".", e, "]:", _s);
                                }
                                return [ l === oo ? ls : cs, e("fail"), e("zfail"), e("zpass") ];
                            });

                          case Ja:
                            return e(function(e) {
                                fe.commandType(e, "object", a, o.commandStr);
                                var t = e.factor | 0;
                                var n = e.units | 0;
                                fe.commandType(t, "number", a + ".factor", o.commandStr);
                                fe.commandType(n, "number", a + ".units", o.commandStr);
                                return [ t, n ];
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, n + "&&typeof " + n + '==="object"', "invalid " + l);
                                });
                                var r = t.def(n, ".factor|0");
                                var i = t.def(n, ".units|0");
                                return [ r, i ];
                            });

                          case Wa:
                            return e(function(e) {
                                var t = 0;
                                if (e === "front") {
                                    t = cs;
                                } else if (e === "back") {
                                    t = ls;
                                }
                                fe.command(!!t, a, o.commandStr);
                                return t;
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, n + '==="front"||' + n + '==="back"', "invalid cull.face");
                                });
                                return t.def(n, '==="front"?', cs, ":", ls);
                            });

                          case Ya:
                            return e(function(e) {
                                fe.command(typeof e === "number" && e >= v.lineWidthDims[0] && e <= v.lineWidthDims[1], "invalid line width, must be a positive number between " + v.lineWidthDims[0] + " and " + v.lineWidthDims[1], o.commandStr);
                                return e;
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, "typeof " + n + '==="number"&&' + n + ">=" + v.lineWidthDims[0] + "&&" + n + "<=" + v.lineWidthDims[1], "invalid line width");
                                });
                                return n;
                            });

                          case Ka:
                            return e(function(e) {
                                fe.commandParameter(e, Os, a, o.commandStr);
                                return Os[e];
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, n + '==="cw"||' + n + '==="ccw"', "invalid frontFace, must be one of cw,ccw");
                                });
                                return t.def(n + '==="cw"?' + hs + ":" + ds);
                            });

                          case Va:
                            return e(function(e) {
                                fe.command(Cn(e) && e.length === 4, "color.mask must be length 4 array", o.commandStr);
                                return e.map(function(e) {
                                    return !!e;
                                });
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, e.shared.isArrayLike + "(" + n + ")&&" + n + ".length===4", "invalid color.mask");
                                });
                                return Se(4, function(e) {
                                    return "!!" + n + "[" + e + "]";
                                });
                            });

                          case to:
                            return e(function(e) {
                                fe.command(typeof e === "object" && e, a, o.commandStr);
                                var t = "value" in e ? e.value : 1;
                                var n = !!e.invert;
                                fe.command(typeof t === "number" && t >= 0 && t <= 1, "sample.coverage.value must be a number between 0 and 1", o.commandStr);
                                return [ t, n ];
                            }, function(e, t, n) {
                                fe.optional(function() {
                                    e.assert(t, n + "&&typeof " + n + '==="object"', "invalid sample.coverage");
                                });
                                var r = t.def('"value" in ', n, "?+", n, ".value:1");
                                var i = t.def("!!", n, ".invert");
                                return [ r, i ];
                            });
                        }
                    });
                    return u;
                }
                function q(e, i) {
                    var a = e["static"];
                    var t = e.dynamic;
                    var o = {};
                    Object.keys(a).forEach(function(n) {
                        var r = a[n];
                        var e;
                        if (typeof r === "number" || typeof r === "boolean") {
                            e = Ps(function() {
                                return r;
                            });
                        } else if (typeof r === "function") {
                            var t = r._reglType;
                            if (t === "texture2d" || t === "textureCube") {
                                e = Ps(function(e) {
                                    return e.link(r);
                                });
                            } else if (t === "framebuffer" || t === "framebufferCube") {
                                fe.command(r.color.length > 0, 'missing color attachment for framebuffer sent to uniform "' + n + '"', i.commandStr);
                                e = Ps(function(e) {
                                    return e.link(r.color[0]);
                                });
                            } else {
                                fe.commandRaise('invalid data for uniform "' + n + '"', i.commandStr);
                            }
                        } else if (Cn(r)) {
                            e = Ps(function(t) {
                                var e = t.global.def("[", Se(r.length, function(e) {
                                    fe.command(typeof r[e] === "number" || typeof r[e] === "boolean", "invalid uniform " + n, t.commandStr);
                                    return r[e];
                                }), "]");
                                return e;
                            });
                        } else {
                            fe.commandRaise('invalid or missing data for uniform "' + n + '"', i.commandStr);
                        }
                        e.value = r;
                        o[n] = e;
                    });
                    Object.keys(t).forEach(function(e) {
                        var n = t[e];
                        o[e] = Ds(n, function(e, t) {
                            return e.invoke(t, n);
                        });
                    });
                    return o;
                }
                function Z(e, h) {
                    var d = e["static"];
                    var t = e.dynamic;
                    var v = {};
                    Object.keys(d).forEach(function(r) {
                        var e = d[r];
                        var i = E.id(r);
                        var a = new m();
                        if (Bs(e)) {
                            a.state = Ba;
                            a.buffer = p.getBuffer(p.create(e, Co, false, true));
                            a.type = 0;
                        } else {
                            var t = p.getBuffer(e);
                            if (t) {
                                a.state = Ba;
                                a.buffer = t;
                                a.type = 0;
                            } else {
                                fe.command(typeof e === "object" && e, "invalid data for attribute " + r, h.commandStr);
                                if ("constant" in e) {
                                    var n = e.constant;
                                    a.buffer = "null";
                                    a.state = Ca;
                                    if (typeof n === "number") {
                                        a.x = n;
                                    } else {
                                        fe.command(Cn(n) && n.length > 0 && n.length <= 4, "invalid constant for attribute " + r, h.commandStr);
                                        Ra.forEach(function(e, t) {
                                            if (t < n.length) {
                                                a[e] = n[t];
                                            }
                                        });
                                    }
                                } else {
                                    if (Bs(e.buffer)) {
                                        t = p.getBuffer(p.create(e.buffer, Co, false, true));
                                    } else {
                                        t = p.getBuffer(e.buffer);
                                    }
                                    fe.command(!!t, 'missing buffer for attribute "' + r + '"', h.commandStr);
                                    var o = e.offset | 0;
                                    fe.command(o >= 0, 'invalid offset for attribute "' + r + '"', h.commandStr);
                                    var s = e.stride | 0;
                                    fe.command(s >= 0 && s < 256, 'invalid stride for attribute "' + r + '", must be integer betweeen [0, 255]', h.commandStr);
                                    var u = e.size | 0;
                                    fe.command(!("size" in e) || u > 0 && u <= 4, 'invalid size for attribute "' + r + '", must be 1,2,3,4', h.commandStr);
                                    var f = !!e.normalized;
                                    var c = 0;
                                    if ("type" in e) {
                                        fe.commandParameter(e.type, jt, "invalid type for attribute " + r, h.commandStr);
                                        c = jt[e.type];
                                    }
                                    var l = e.divisor | 0;
                                    if ("divisor" in e) {
                                        fe.command(l === 0 || T, 'cannot specify divisor for attribute "' + r + '", instancing not supported', h.commandStr);
                                        fe.command(l >= 0, 'invalid divisor for attribute "' + r + '"', h.commandStr);
                                    }
                                    fe.optional(function() {
                                        var t = h.commandStr;
                                        var n = [ "buffer", "offset", "divisor", "normalized", "type", "size", "stride" ];
                                        Object.keys(e).forEach(function(e) {
                                            fe.command(n.indexOf(e) >= 0, 'unknown parameter "' + e + '" for attribute pointer "' + r + '" (valid parameters are ' + n + ")", t);
                                        });
                                    });
                                    a.buffer = t;
                                    a.state = Ba;
                                    a.size = u;
                                    a.normalized = f;
                                    a.type = c || t.dtype;
                                    a.offset = o;
                                    a.stride = s;
                                    a.divisor = l;
                                }
                            }
                        }
                        v[r] = Ps(function(e, t) {
                            var n = e.attribCache;
                            if (i in n) {
                                return n[i];
                            }
                            var r = {
                                isStream: false
                            };
                            Object.keys(a).forEach(function(e) {
                                r[e] = a[e];
                            });
                            if (a.buffer) {
                                r.buffer = e.link(a.buffer);
                                r.type = r.type || r.buffer + ".dtype";
                            }
                            n[i] = r;
                            return r;
                        });
                    });
                    Object.keys(t).forEach(function(h) {
                        var d = t[h];
                        function e(e, t) {
                            var n = e.invoke(t, d);
                            var r = e.shared;
                            var i = e.constants;
                            var a = r.isBufferArgs;
                            var o = r.buffer;
                            fe.optional(function() {
                                e.assert(t, n + "&&(typeof " + n + '==="object"||typeof ' + n + '==="function")&&(' + a + "(" + n + ")||" + o + ".getBuffer(" + n + ")||" + o + ".getBuffer(" + n + ".buffer)||" + a + "(" + n + ".buffer)||" + '("constant" in ' + n + "&&(typeof " + n + '.constant==="number"||' + r.isArrayLike + "(" + n + ".constant))))", 'invalid dynamic attribute "' + h + '"');
                            });
                            var s = {
                                isStream: t.def(false)
                            };
                            var u = new m();
                            u.state = Ba;
                            Object.keys(u).forEach(function(e) {
                                s[e] = t.def("" + u[e]);
                            });
                            var f = s.buffer;
                            var c = s.type;
                            t("if(", a, "(", n, ")){", s.isStream, "=true;", f, "=", o, ".createStream(", Co, ",", n, ");", c, "=", f, ".dtype;", "}else{", f, "=", o, ".getBuffer(", n, ");", "if(", f, "){", c, "=", f, ".dtype;", '}else if("constant" in ', n, "){", s.state, "=", Ca, ";", "if(typeof " + n + '.constant === "number"){', s[Ra[0]], "=", n, ".constant;", Ra.slice(1).map(function(e) {
                                return s[e];
                            }).join("="), "=0;", "}else{", Ra.map(function(e, t) {
                                return s[e] + "=" + n + ".constant.length>" + t + "?" + n + ".constant[" + t + "]:0;";
                            }).join(""), "}}else{", "if(", a, "(", n, ".buffer)){", f, "=", o, ".createStream(", Co, ",", n, ".buffer);", "}else{", f, "=", o, ".getBuffer(", n, ".buffer);", "}", c, '="type" in ', n, "?", i.glTypes, "[", n, ".type]:", f, ".dtype;", s.normalized, "=!!", n, ".normalized;");
                            function l(e) {
                                t(s[e], "=", n, ".", e, "|0;");
                            }
                            l("size");
                            l("offset");
                            l("stride");
                            l("divisor");
                            t("}}");
                            t.exit("if(", s.isStream, "){", o, ".destroyStream(", f, ");", "}");
                            return s;
                        }
                        v[h] = Ds(d, e);
                    });
                    return v;
                }
                function z(e, t) {
                    var n = e["static"];
                    var r = e.dynamic;
                    if (bo in n) {
                        var i = n[bo];
                        if (i !== null && b.getVAO(i) === null) {
                            i = b.createVAO(i);
                        }
                        return Ps(function(e) {
                            return e.link(b.getVAO(i));
                        });
                    } else if (bo in r) {
                        var a = r[bo];
                        return Ds(a, function(e, t) {
                            var n = e.invoke(t, a);
                            return t.def(e.shared.vao + ".getVAO(" + n + ")");
                        });
                    }
                    return null;
                }
                function U(e) {
                    var t = e["static"];
                    var r = e.dynamic;
                    var i = {};
                    Object.keys(t).forEach(function(e) {
                        var n = t[e];
                        i[e] = Ps(function(e, t) {
                            if (typeof n === "number" || typeof n === "boolean") {
                                return "" + n;
                            } else {
                                return e.link(n);
                            }
                        });
                    });
                    Object.keys(r).forEach(function(e) {
                        var n = r[e];
                        i[e] = Ds(n, function(e, t) {
                            return e.invoke(t, n);
                        });
                    });
                    return i;
                }
                function G(e, n, t, r, i) {
                    var a = e["static"];
                    var o = e.dynamic;
                    fe.optional(function() {
                        var t = [ lo, ho, vo, po, mo, go, _o, xo, co, bo ].concat(w);
                        function e(e) {
                            Object.keys(e).forEach(function(e) {
                                fe.command(t.indexOf(e) >= 0, 'unknown parameter "' + e + '"', i.commandStr);
                            });
                        }
                        e(a);
                        e(o);
                    });
                    var s = P(e, n);
                    var u = F(e);
                    var f = I(e, u, i);
                    var c = N(e, i);
                    var l = L(e, i);
                    var h = D(e, i, s);
                    function d(e) {
                        var t = f[e];
                        if (t) {
                            l[e] = t;
                        }
                    }
                    d(fo);
                    d(A(uo));
                    var v = Object.keys(l).length > 0;
                    var p = {
                        framebuffer: u,
                        draw: c,
                        shader: h,
                        state: l,
                        dirty: v,
                        scopeVAO: null,
                        drawVAO: null,
                        useVAO: false,
                        attributes: {}
                    };
                    p.profile = C(e);
                    p.uniforms = q(t, i);
                    p.drawVAO = p.scopeVAO = z(e);
                    if (!p.drawVAO && h.program && !s && x.angle_instanced_arrays) {
                        var m = true;
                        var _ = h.program.attributes.map(function(e) {
                            var t = n["static"][e];
                            m = m && !!t;
                            return t;
                        });
                        if (m && _.length > 0) {
                            var g = b.getVAO(b.createVAO(_));
                            p.drawVAO = new Fs(null, null, null, function(e, t) {
                                return e.link(g);
                            });
                            p.useVAO = true;
                        }
                    }
                    if (s) {
                        p.useVAO = true;
                    } else {
                        p.attributes = Z(n, i);
                    }
                    p.context = U(r);
                    return p;
                }
                function H(n, r, i) {
                    var e = n.shared;
                    var a = e.context;
                    var o = n.scope();
                    Object.keys(i).forEach(function(e) {
                        r.save(a, "." + e);
                        var t = i[e];
                        o(a, ".", e, "=", t.append(n, r), ";");
                    });
                    r(o);
                }
                function k(e, t, n, r) {
                    var i = e.shared;
                    var a = i.gl;
                    var o = i.framebuffer;
                    var s;
                    if (h) {
                        s = t.def(i.extensions, ".webgl_draw_buffers");
                    }
                    var u = e.constants;
                    var f = u.drawBuffer;
                    var c = u.backBuffer;
                    var l;
                    if (n) {
                        l = n.append(e, t);
                    } else {
                        l = t.def(o, ".next");
                    }
                    if (!r) {
                        t("if(", l, "!==", o, ".cur){");
                    }
                    t("if(", l, "){", a, ".bindFramebuffer(", Ts, ",", l, ".framebuffer);");
                    if (h) {
                        t(s, ".drawBuffersWEBGL(", f, "[", l, ".colorAttachments.length]);");
                    }
                    t("}else{", a, ".bindFramebuffer(", Ts, ",null);");
                    if (h) {
                        t(s, ".drawBuffersWEBGL(", c, ");");
                    }
                    t("}", o, ".cur=", l, ";");
                    if (!r) {
                        t("}");
                    }
                }
                function j(o, e, s) {
                    var t = o.shared;
                    var u = t.gl;
                    var f = o.current;
                    var c = o.next;
                    var l = t.current;
                    var h = t.next;
                    var d = o.cond(l, ".dirty");
                    w.forEach(function(e) {
                        var t = A(e);
                        if (t in s.state) {
                            return;
                        }
                        var n, r;
                        if (t in c) {
                            n = c[t];
                            r = f[t];
                            var i = Se(_[t].length, function(e) {
                                return d.def(n, "[", e, "]");
                            });
                            d(o.cond(i.map(function(e, t) {
                                return e + "!==" + r + "[" + t + "]";
                            }).join("||")).then(u, ".", S[t], "(", i, ");", i.map(function(e, t) {
                                return r + "[" + t + "]=" + e;
                            }).join(";"), ";"));
                        } else {
                            n = d.def(h, ".", t);
                            var a = o.cond(n, "!==", l, ".", t);
                            d(a);
                            if (t in g) {
                                a(o.cond(n).then(u, ".enable(", g[t], ");")["else"](u, ".disable(", g[t], ");"), l, ".", t, "=", n, ";");
                            } else {
                                a(u, ".", S[t], "(", n, ");", l, ".", t, "=", n, ";");
                            }
                        }
                    });
                    if (Object.keys(s.state).length === 0) {
                        d(l, ".dirty=false;");
                    }
                    e(d);
                }
                function V(a, o, s, u) {
                    var e = a.shared;
                    var f = a.current;
                    var c = e.current;
                    var l = e.gl;
                    Cs(Object.keys(s)).forEach(function(e) {
                        var t = s[e];
                        if (u && !u(t)) {
                            return;
                        }
                        var n = t.append(a, o);
                        if (g[e]) {
                            var r = g[e];
                            if (Is(t)) {
                                if (n) {
                                    o(l, ".enable(", r, ");");
                                } else {
                                    o(l, ".disable(", r, ");");
                                }
                            } else {
                                o(a.cond(n).then(l, ".enable(", r, ");")["else"](l, ".disable(", r, ");"));
                            }
                            o(c, ".", e, "=", n, ";");
                        } else if (Cn(n)) {
                            var i = f[e];
                            o(l, ".", S[e], "(", n, ");", n.map(function(e, t) {
                                return i + "[" + t + "]=" + e;
                            }).join(";"), ";");
                        } else {
                            o(l, ".", S[e], "(", n, ");", c, ".", e, "=", n, ";");
                        }
                    });
                }
                function X(e, t) {
                    if (T) {
                        e.instancing = t.def(e.shared.extensions, ".angle_instanced_arrays");
                    }
                }
                function W(e, n, t, r, i) {
                    var a = e.shared;
                    var o = e.stats;
                    var s = a.current;
                    var u = a.timer;
                    var f = t.profile;
                    function c() {
                        if (typeof performance === "undefined") {
                            return "Date.now()";
                        } else {
                            return "performance.now()";
                        }
                    }
                    var l, h;
                    function d(e) {
                        l = n.def();
                        e(l, "=", c(), ";");
                        if (typeof i === "string") {
                            e(o, ".count+=", i, ";");
                        } else {
                            e(o, ".count++;");
                        }
                        if (y) {
                            if (r) {
                                h = n.def();
                                e(h, "=", u, ".getNumPendingQueries();");
                            } else {
                                e(u, ".beginQuery(", o, ");");
                            }
                        }
                    }
                    function v(e) {
                        e(o, ".cpuTime+=", c(), "-", l, ";");
                        if (y) {
                            if (r) {
                                e(u, ".pushScopeStats(", h, ",", u, ".getNumPendingQueries(),", o, ");");
                            } else {
                                e(u, ".endQuery();");
                            }
                        }
                    }
                    function p(e) {
                        var t = n.def(s, ".profile");
                        n(s, ".profile=", e, ";");
                        n.exit(s, ".profile=", t, ";");
                    }
                    var m;
                    if (f) {
                        if (Is(f)) {
                            if (f.enable) {
                                d(n);
                                v(n.exit);
                                p("true");
                            } else {
                                p("false");
                            }
                            return;
                        }
                        m = f.append(e, n);
                        p(m);
                    } else {
                        m = n.def(s, ".profile");
                    }
                    var _ = e.block();
                    d(_);
                    n("if(", m, "){", _, "}");
                    var g = e.block();
                    v(g);
                    n.exit("if(", m, "){", g, "}");
                }
                function K(h, d, a, e, o) {
                    var v = h.shared;
                    function s(e) {
                        switch (e) {
                          case Xo:
                          case Qo:
                          case ts:
                            return 2;

                          case Wo:
                          case Jo:
                          case ns:
                            return 3;

                          case Ko:
                          case $o:
                          case rs:
                            return 4;

                          default:
                            return 1;
                        }
                    }
                    function u(e, r, i) {
                        var a = v.gl;
                        var o = d.def(e, ".location");
                        var s = d.def(v.attributes, "[", o, "]");
                        var t = i.state;
                        var u = i.buffer;
                        var n = [ i.x, i.y, i.z, i.w ];
                        var f = [ "buffer", "normalized", "offset", "stride" ];
                        function c() {
                            d("if(!", s, ".buffer){", a, ".enableVertexAttribArray(", o, ");}");
                            var e = i.type;
                            var t;
                            if (!i.size) {
                                t = r;
                            } else {
                                t = d.def(i.size, "||", r);
                            }
                            d("if(", s, ".type!==", e, "||", s, ".size!==", t, "||", f.map(function(e) {
                                return s + "." + e + "!==" + i[e];
                            }).join("||"), "){", a, ".bindBuffer(", Co, ",", u, ".buffer);", a, ".vertexAttribPointer(", [ o, t, e, i.normalized, i.stride, i.offset ], ");", s, ".type=", e, ";", s, ".size=", t, ";", f.map(function(e) {
                                return s + "." + e + "=" + i[e] + ";";
                            }).join(""), "}");
                            if (T) {
                                var n = i.divisor;
                                d("if(", s, ".divisor!==", n, "){", h.instancing, ".vertexAttribDivisorANGLE(", [ o, n ], ");", s, ".divisor=", n, ";}");
                            }
                        }
                        function l() {
                            d("if(", s, ".buffer){", a, ".disableVertexAttribArray(", o, ");", s, ".buffer=null;", "}if(", Ra.map(function(e, t) {
                                return s + "." + e + "!==" + n[t];
                            }).join("||"), "){", a, ".vertexAttrib4f(", o, ",", n, ");", Ra.map(function(e, t) {
                                return s + "." + e + "=" + n[t] + ";";
                            }).join(""), "}");
                        }
                        if (t === Ba) {
                            c();
                        } else if (t === Ca) {
                            l();
                        } else {
                            d("if(", t, "===", Ba, "){");
                            c();
                            d("}else{");
                            l();
                            d("}");
                        }
                    }
                    e.forEach(function(e) {
                        var t = e.name;
                        var n = a.attributes[t];
                        var r;
                        if (n) {
                            if (!o(n)) {
                                return;
                            }
                            r = n.append(h, d);
                        } else {
                            if (!o(Ns)) {
                                return;
                            }
                            var i = h.scopeAttrib(t);
                            fe.optional(function() {
                                h.assert(d, i + ".state", "missing attribute " + t);
                            });
                            r = {};
                            Object.keys(new m()).forEach(function(e) {
                                r[e] = d.def(i, ".", e);
                            });
                        }
                        u(h.link(e), s(e.info.type), r);
                    });
                }
                function Y(i, a, e, t, n) {
                    var o = i.shared;
                    var r = o.gl;
                    var s;
                    for (var u = 0; u < t.length; ++u) {
                        var f = t[u];
                        var c = f.name;
                        var l = f.info.type;
                        var h = e.uniforms[c];
                        var d = i.link(f);
                        var v = d + ".location";
                        var p;
                        if (h) {
                            if (!n(h)) {
                                continue;
                            }
                            if (Is(h)) {
                                var m = h.value;
                                fe.command(m !== null && typeof m !== "undefined", 'missing uniform "' + c + '"', i.commandStr);
                                if (l === ss || l === us) {
                                    fe.command(typeof m === "function" && (l === ss && (m._reglType === "texture2d" || m._reglType === "framebuffer") || l === us && (m._reglType === "textureCube" || m._reglType === "framebufferCube")), "invalid texture for uniform " + c, i.commandStr);
                                    var _ = i.link(m._texture || m.color[0]._texture);
                                    a(r, ".uniform1i(", v, ",", _ + ".bind());");
                                    a.exit(_, ".unbind();");
                                } else if (l === is || l === as || l === os) {
                                    fe.optional(function() {
                                        fe.command(Cn(m), "invalid matrix for uniform " + c, i.commandStr);
                                        fe.command(l === is && m.length === 4 || l === as && m.length === 9 || l === os && m.length === 16, "invalid length for matrix uniform " + c, i.commandStr);
                                    });
                                    var g = i.global.def("new Float32Array([" + Array.prototype.slice.call(m) + "])");
                                    var x = 2;
                                    if (l === as) {
                                        x = 3;
                                    } else if (l === os) {
                                        x = 4;
                                    }
                                    a(r, ".uniformMatrix", x, "fv(", v, ",false,", g, ");");
                                } else {
                                    switch (l) {
                                      case Vo:
                                        fe.commandType(m, "number", "uniform " + c, i.commandStr);
                                        s = "1f";
                                        break;

                                      case Xo:
                                        fe.command(Cn(m) && m.length === 2, "uniform " + c, i.commandStr);
                                        s = "2f";
                                        break;

                                      case Wo:
                                        fe.command(Cn(m) && m.length === 3, "uniform " + c, i.commandStr);
                                        s = "3f";
                                        break;

                                      case Ko:
                                        fe.command(Cn(m) && m.length === 4, "uniform " + c, i.commandStr);
                                        s = "4f";
                                        break;

                                      case es:
                                        fe.commandType(m, "boolean", "uniform " + c, i.commandStr);
                                        s = "1i";
                                        break;

                                      case Yo:
                                        fe.commandType(m, "number", "uniform " + c, i.commandStr);
                                        s = "1i";
                                        break;

                                      case ts:
                                        fe.command(Cn(m) && m.length === 2, "uniform " + c, i.commandStr);
                                        s = "2i";
                                        break;

                                      case Qo:
                                        fe.command(Cn(m) && m.length === 2, "uniform " + c, i.commandStr);
                                        s = "2i";
                                        break;

                                      case ns:
                                        fe.command(Cn(m) && m.length === 3, "uniform " + c, i.commandStr);
                                        s = "3i";
                                        break;

                                      case Jo:
                                        fe.command(Cn(m) && m.length === 3, "uniform " + c, i.commandStr);
                                        s = "3i";
                                        break;

                                      case rs:
                                        fe.command(Cn(m) && m.length === 4, "uniform " + c, i.commandStr);
                                        s = "4i";
                                        break;

                                      case $o:
                                        fe.command(Cn(m) && m.length === 4, "uniform " + c, i.commandStr);
                                        s = "4i";
                                        break;
                                    }
                                    a(r, ".uniform", s, "(", v, ",", Cn(m) ? Array.prototype.slice.call(m) : m, ");");
                                }
                                continue;
                            } else {
                                p = h.append(i, a);
                            }
                        } else {
                            if (!n(Ns)) {
                                continue;
                            }
                            p = a.def(o.uniforms, "[", E.id(c), "]");
                        }
                        if (l === ss) {
                            a("if(", p, "&&", p, '._reglType==="framebuffer"){', p, "=", p, ".color[0];", "}");
                        } else if (l === us) {
                            a("if(", p, "&&", p, '._reglType==="framebufferCube"){', p, "=", p, ".color[0];", "}");
                        }
                        fe.optional(function() {
                            function n(e, t) {
                                i.assert(a, e, 'bad data or missing for uniform "' + c + '".  ' + t);
                            }
                            function e(e) {
                                n("typeof " + p + '==="' + e + '"', "invalid type, expected " + e);
                            }
                            function t(e, t) {
                                n(o.isArrayLike + "(" + p + ")&&" + p + ".length===" + e, "invalid vector, should have length " + e, i.commandStr);
                            }
                            function r(e) {
                                n("typeof " + p + '==="function"&&' + p + '._reglType==="texture' + (e === Do ? "2d" : "Cube") + '"', "invalid texture type", i.commandStr);
                            }
                            switch (l) {
                              case Yo:
                                e("number");
                                break;

                              case Qo:
                                t(2);
                                break;

                              case Jo:
                                t(3);
                                break;

                              case $o:
                                t(4);
                                break;

                              case Vo:
                                e("number");
                                break;

                              case Xo:
                                t(2);
                                break;

                              case Wo:
                                t(3);
                                break;

                              case Ko:
                                t(4);
                                break;

                              case es:
                                e("boolean");
                                break;

                              case ts:
                                t(2);
                                break;

                              case ns:
                                t(3);
                                break;

                              case rs:
                                t(4);
                                break;

                              case is:
                                t(4);
                                break;

                              case as:
                                t(9);
                                break;

                              case os:
                                t(16);
                                break;

                              case ss:
                                r(Do);
                                break;

                              case us:
                                r(No);
                                break;
                            }
                        });
                        var b = 1;
                        switch (l) {
                          case ss:
                          case us:
                            var y = a.def(p, "._texture");
                            a(r, ".uniform1i(", v, ",", y, ".bind());");
                            a.exit(y, ".unbind();");
                            continue;

                          case Yo:
                          case es:
                            s = "1i";
                            break;

                          case Qo:
                          case ts:
                            s = "2i";
                            b = 2;
                            break;

                          case Jo:
                          case ns:
                            s = "3i";
                            b = 3;
                            break;

                          case $o:
                          case rs:
                            s = "4i";
                            b = 4;
                            break;

                          case Vo:
                            s = "1f";
                            break;

                          case Xo:
                            s = "2f";
                            b = 2;
                            break;

                          case Wo:
                            s = "3f";
                            b = 3;
                            break;

                          case Ko:
                            s = "4f";
                            b = 4;
                            break;

                          case is:
                            s = "Matrix2fv";
                            break;

                          case as:
                            s = "Matrix3fv";
                            break;

                          case os:
                            s = "Matrix4fv";
                            break;
                        }
                        a(r, ".uniform", s, "(", v, ",");
                        if (s.charAt(0) === "M") {
                            var T = Math.pow(l - is + 2, 2);
                            var w = i.global.def("new Float32Array(", T, ")");
                            a("false,(Array.isArray(", p, ")||", p, " instanceof Float32Array)?", p, ":(", Se(T, function(e) {
                                return w + "[" + e + "]=" + p + "[" + e + "]";
                            }), ",", w, ")");
                        } else if (b > 1) {
                            a(Se(b, function(e) {
                                return p + "[" + e + "]";
                            }));
                        } else {
                            a(p);
                        }
                        a(");");
                    }
                }
                function Q(r, i, a, o) {
                    var e = r.shared;
                    var s = e.gl;
                    var u = e.draw;
                    var f = o.draw;
                    function t() {
                        var e = f.elements;
                        var t;
                        var n = i;
                        if (e) {
                            if (e.contextDep && o.contextDynamic || e.propDep) {
                                n = a;
                            }
                            t = e.append(r, n);
                        } else {
                            t = n.def(u, ".", po);
                        }
                        if (t) {
                            n("if(" + t + ")" + s + ".bindBuffer(" + Fo + "," + t + ".buffer.buffer);");
                        }
                        return t;
                    }
                    function n() {
                        var e = f.count;
                        var t;
                        var n = i;
                        if (e) {
                            if (e.contextDep && o.contextDynamic || e.propDep) {
                                n = a;
                            }
                            t = e.append(r, n);
                            fe.optional(function() {
                                if (e.MISSING) {
                                    r.assert(i, "false", "missing vertex count");
                                }
                                if (e.DYNAMIC) {
                                    r.assert(n, t + ">=0", "missing vertex count");
                                }
                            });
                        } else {
                            t = n.def(u, ".", _o);
                            fe.optional(function() {
                                r.assert(n, t + ">=0", "missing vertex count");
                            });
                        }
                        return t;
                    }
                    var c = t();
                    function l(e) {
                        var t = f[e];
                        if (t) {
                            if (t.contextDep && o.contextDynamic || t.propDep) {
                                return t.append(r, a);
                            } else {
                                return t.append(r, i);
                            }
                        } else {
                            return i.def(u, ".", e);
                        }
                    }
                    var h = l(mo);
                    var d = l(go);
                    var v = n();
                    if (typeof v === "number") {
                        if (v === 0) {
                            return;
                        }
                    } else {
                        a("if(", v, "){");
                        a.exit("}");
                    }
                    var p, m;
                    if (T) {
                        p = l(xo);
                        m = r.instancing;
                    }
                    var _ = c + ".type";
                    var g = f.elements && Is(f.elements);
                    function x() {
                        function e() {
                            a(m, ".drawElementsInstancedANGLE(", [ h, v, _, d + "<<((" + _ + "-" + Oa + ")>>1)", p ], ");");
                        }
                        function t() {
                            a(m, ".drawArraysInstancedANGLE(", [ h, d, v, p ], ");");
                        }
                        if (c) {
                            if (!g) {
                                a("if(", c, "){");
                                e();
                                a("}else{");
                                t();
                                a("}");
                            } else {
                                e();
                            }
                        } else {
                            t();
                        }
                    }
                    function b() {
                        function e() {
                            a(s + ".drawElements(" + [ h, v, _, d + "<<((" + _ + "-" + Oa + ")>>1)" ] + ");");
                        }
                        function t() {
                            a(s + ".drawArrays(" + [ h, d, v ] + ");");
                        }
                        if (c) {
                            if (!g) {
                                a("if(", c, "){");
                                e();
                                a("}else{");
                                t();
                                a("}");
                            } else {
                                e();
                            }
                        } else {
                            t();
                        }
                    }
                    if (T && (typeof p !== "number" || p >= 0)) {
                        if (typeof p === "string") {
                            a("if(", p, ">0){");
                            x();
                            a("}else if(", p, "<0){");
                            b();
                            a("}");
                        } else {
                            x();
                        }
                    } else {
                        b();
                    }
                }
                function J(e, t, n, r, i) {
                    var a = B();
                    var o = a.proc("body", i);
                    fe.optional(function() {
                        a.commandStr = t.commandStr;
                        a.command = a.link(t.commandStr);
                    });
                    if (T) {
                        a.instancing = o.def(a.shared.extensions, ".angle_instanced_arrays");
                    }
                    e(a, o, n, r);
                    return a.compile().body;
                }
                function $(e, t, n, r) {
                    X(e, t);
                    if (n.useVAO) {
                        if (n.drawVAO) {
                            t(e.shared.vao, ".setVAO(", n.drawVAO.append(e, t), ");");
                        } else {
                            t(e.shared.vao, ".setVAO(", e.shared.vao, ".targetVAO);");
                        }
                    } else {
                        t(e.shared.vao, ".setVAO(null);");
                        K(e, t, n, r.attributes, function() {
                            return true;
                        });
                    }
                    Y(e, t, n, r.uniforms, function() {
                        return true;
                    });
                    Q(e, t, t, n);
                }
                function ee(t, n) {
                    var e = t.proc("draw", 1);
                    X(t, e);
                    H(t, e, n.context);
                    k(t, e, n.framebuffer);
                    j(t, e, n);
                    V(t, e, n.state);
                    W(t, e, n, false, true);
                    var r = n.shader.progVar.append(t, e);
                    e(t.shared.gl, ".useProgram(", r, ".program);");
                    if (n.shader.program) {
                        $(t, e, n, n.shader.program);
                    } else {
                        e(t.shared.vao, ".setVAO(null);");
                        var i = t.global.def("{}");
                        var a = e.def(r, ".id");
                        var o = e.def(i, "[", a, "]");
                        e(t.cond(o).then(o, ".call(this,a0);")["else"](o, "=", i, "[", a, "]=", t.link(function(e) {
                            return J($, t, n, e, 1);
                        }), "(", r, ");", o, ".call(this,a0);"));
                    }
                    if (Object.keys(n.state).length > 0) {
                        e(t.shared.current, ".dirty=true;");
                    }
                }
                function te(e, t, n, r) {
                    e.batchId = "a1";
                    X(e, t);
                    function i() {
                        return true;
                    }
                    K(e, t, n, r.attributes, i);
                    Y(e, t, n, r.uniforms, i);
                    Q(e, t, t, n);
                }
                function ne(t, e, n, r) {
                    X(t, e);
                    var i = n.contextDep;
                    var a = e.def();
                    var o = "a0";
                    var s = "a1";
                    var u = e.def();
                    t.shared.props = u;
                    t.batchId = a;
                    var f = t.scope();
                    var c = t.scope();
                    e(f.entry, "for(", a, "=0;", a, "<", s, ";++", a, "){", u, "=", o, "[", a, "];", c, "}", f.exit);
                    function l(e) {
                        return e.contextDep && i || e.propDep;
                    }
                    function h(e) {
                        return !l(e);
                    }
                    if (n.needsContext) {
                        H(t, c, n.context);
                    }
                    if (n.needsFramebuffer) {
                        k(t, c, n.framebuffer);
                    }
                    V(t, c, n.state, l);
                    if (n.profile && l(n.profile)) {
                        W(t, c, n, false, true);
                    }
                    if (!r) {
                        var d = t.global.def("{}");
                        var v = n.shader.progVar.append(t, c);
                        var p = c.def(v, ".id");
                        var m = c.def(d, "[", p, "]");
                        c(t.shared.gl, ".useProgram(", v, ".program);", "if(!", m, "){", m, "=", d, "[", p, "]=", t.link(function(e) {
                            return J(te, t, n, e, 2);
                        }), "(", v, ");}", m, ".call(this,a0[", a, "],", a, ");");
                    } else {
                        if (n.useVAO) {
                            if (n.drawVAO) {
                                if (l(n.drawVAO)) {
                                    c(t.shared.vao, ".setVAO(", n.drawVAO.append(t, c), ");");
                                } else {
                                    f(t.shared.vao, ".setVAO(", n.drawVAO.append(t, f), ");");
                                }
                            } else {
                                f(t.shared.vao, ".setVAO(", t.shared.vao, ".targetVAO);");
                            }
                        } else {
                            f(t.shared.vao, ".setVAO(null);");
                            K(t, f, n, r.attributes, h);
                            K(t, c, n, r.attributes, l);
                        }
                        Y(t, f, n, r.uniforms, h);
                        Y(t, c, n, r.uniforms, l);
                        Q(t, f, c, n);
                    }
                }
                function re(t, n) {
                    var e = t.proc("batch", 2);
                    t.batchId = "0";
                    X(t, e);
                    var r = false;
                    var i = true;
                    Object.keys(n.context).forEach(function(e) {
                        r = r || n.context[e].propDep;
                    });
                    if (!r) {
                        H(t, e, n.context);
                        i = false;
                    }
                    var a = n.framebuffer;
                    var o = false;
                    if (a) {
                        if (a.propDep) {
                            r = o = true;
                        } else if (a.contextDep && r) {
                            o = true;
                        }
                        if (!o) {
                            k(t, e, a);
                        }
                    } else {
                        k(t, e, null);
                    }
                    if (n.state.viewport && n.state.viewport.propDep) {
                        r = true;
                    }
                    function s(e) {
                        return e.contextDep && r || e.propDep;
                    }
                    j(t, e, n);
                    V(t, e, n.state, function(e) {
                        return !s(e);
                    });
                    if (!n.profile || !s(n.profile)) {
                        W(t, e, n, false, "a1");
                    }
                    n.contextDep = r;
                    n.needsContext = i;
                    n.needsFramebuffer = o;
                    var u = n.shader.progVar;
                    if (u.contextDep && r || u.propDep) {
                        ne(t, e, n, null);
                    } else {
                        var f = u.append(t, e);
                        e(t.shared.gl, ".useProgram(", f, ".program);");
                        if (n.shader.program) {
                            ne(t, e, n, n.shader.program);
                        } else {
                            e(t.shared.vao, ".setVAO(null);");
                            var c = t.global.def("{}");
                            var l = e.def(f, ".id");
                            var h = e.def(c, "[", l, "]");
                            e(t.cond(h).then(h, ".call(this,a0,a1);")["else"](h, "=", c, "[", l, "]=", t.link(function(e) {
                                return J(ne, t, n, e, 2);
                            }), "(", f, ");", h, ".call(this,a0,a1);"));
                        }
                    }
                    if (Object.keys(n.state).length > 0) {
                        e(t.shared.current, ".dirty=true;");
                    }
                }
                function ie(r, i) {
                    var a = r.proc("scope", 3);
                    r.batchId = "a2";
                    var o = r.shared;
                    var e = o.current;
                    H(r, a, i.context);
                    if (i.framebuffer) {
                        i.framebuffer.append(r, a);
                    }
                    Cs(Object.keys(i.state)).forEach(function(n) {
                        var e = i.state[n];
                        var t = e.append(r, a);
                        if (Cn(t)) {
                            t.forEach(function(e, t) {
                                a.set(r.next[n], "[" + t + "]", e);
                            });
                        } else {
                            a.set(o.next, "." + n, t);
                        }
                    });
                    W(r, a, i, true, true);
                    [ po, go, _o, xo, mo ].forEach(function(e) {
                        var t = i.draw[e];
                        if (!t) {
                            return;
                        }
                        a.set(o.draw, "." + e, "" + t.append(r, a));
                    });
                    Object.keys(i.uniforms).forEach(function(e) {
                        a.set(o.uniforms, "[" + E.id(e) + "]", i.uniforms[e].append(r, a));
                    });
                    Object.keys(i.attributes).forEach(function(e) {
                        var t = i.attributes[e].append(r, a);
                        var n = r.scopeAttrib(e);
                        Object.keys(new m()).forEach(function(e) {
                            a.set(n, "." + e, t[e]);
                        });
                    });
                    if (i.scopeVAO) {
                        a.set(o.vao, ".targetVAO", i.scopeVAO.append(r, a));
                    }
                    function t(e) {
                        var t = i.shader[e];
                        if (t) {
                            a.set(o.shader, "." + e, t.append(r, a));
                        }
                    }
                    t(ho);
                    t(vo);
                    if (Object.keys(i.state).length > 0) {
                        a(e, ".dirty=true;");
                        a.exit(e, ".dirty=true;");
                    }
                    a("a1(", r.shared.context, ",a0,", r.batchId, ");");
                }
                function ae(e) {
                    if (typeof e !== "object" || Cn(e)) {
                        return;
                    }
                    var t = Object.keys(e);
                    for (var n = 0; n < t.length; ++n) {
                        if (de.isDynamic(e[t[n]])) {
                            return true;
                        }
                    }
                    return false;
                }
                function oe(r, e, t) {
                    var a = e["static"][t];
                    if (!a || !ae(a)) {
                        return;
                    }
                    var i = r.global;
                    var n = Object.keys(a);
                    var o = false;
                    var s = false;
                    var u = false;
                    var f = r.global.def("{}");
                    n.forEach(function(e) {
                        var t = a[e];
                        if (de.isDynamic(t)) {
                            if (typeof t === "function") {
                                t = a[e] = de.unbox(t);
                            }
                            var n = Ds(t, null);
                            o = o || n.thisDep;
                            u = u || n.propDep;
                            s = s || n.contextDep;
                        } else {
                            i(f, ".", e, "=");
                            switch (typeof t) {
                              case "number":
                                i(t);
                                break;

                              case "string":
                                i('"', t, '"');
                                break;

                              case "object":
                                if (Array.isArray(t)) {
                                    i("[", t.join(), "]");
                                }
                                break;

                              default:
                                i(r.link(t));
                                break;
                            }
                            i(";");
                        }
                    });
                    function c(r, i) {
                        n.forEach(function(e) {
                            var t = a[e];
                            if (!de.isDynamic(t)) {
                                return;
                            }
                            var n = r.invoke(i, t);
                            i(f, ".", e, "=", n, ";");
                        });
                    }
                    e.dynamic[t] = new de.DynamicVariable(Na, {
                        thisDep: o,
                        contextDep: s,
                        propDep: u,
                        ref: f,
                        append: c
                    });
                    delete e["static"][t];
                }
                function se(t, n, e, r, i) {
                    var a = B();
                    a.stats = a.link(i);
                    Object.keys(n["static"]).forEach(function(e) {
                        oe(a, n, e);
                    });
                    Bo.forEach(function(e) {
                        oe(a, t, e);
                    });
                    var o = G(t, n, e, r, a);
                    ee(a, o);
                    ie(a, o);
                    re(a, o);
                    return ue(a.compile(), {
                        destroy: function e() {
                            o.shader.program.destroy();
                        }
                    });
                }
                return {
                    next: s,
                    current: _,
                    procs: function() {
                        var s = B();
                        var u = s.proc("poll");
                        var f = s.proc("refresh");
                        var c = s.block();
                        u(c);
                        f(c);
                        var e = s.shared;
                        var l = e.gl;
                        var h = e.next;
                        var d = e.current;
                        c(d, ".dirty=false;");
                        k(s, u);
                        k(s, f, null, true);
                        var t;
                        if (T) {
                            t = s.link(T);
                        }
                        if (x.oes_vertex_array_object) {
                            f(s.link(x.oes_vertex_array_object), ".bindVertexArrayOES(null);");
                        }
                        for (var n = 0; n < v.maxAttributes; ++n) {
                            var r = f.def(e.attributes, "[", n, "]");
                            var i = s.cond(r, ".buffer");
                            i.then(l, ".enableVertexAttribArray(", n, ");", l, ".bindBuffer(", Co, ",", r, ".buffer.buffer);", l, ".vertexAttribPointer(", n, ",", r, ".size,", r, ".type,", r, ".normalized,", r, ".stride,", r, ".offset);")["else"](l, ".disableVertexAttribArray(", n, ");", l, ".vertexAttrib4f(", n, ",", r, ".x,", r, ".y,", r, ".z,", r, ".w);", r, ".buffer=null;");
                            f(i);
                            if (T) {
                                f(t, ".vertexAttribDivisorANGLE(", n, ",", r, ".divisor);");
                            }
                        }
                        f(s.shared.vao, ".currentVAO=null;", s.shared.vao, ".setVAO(", s.shared.vao, ".targetVAO);");
                        Object.keys(g).forEach(function(e) {
                            var t = g[e];
                            var n = c.def(h, ".", e);
                            var r = s.block();
                            r("if(", n, "){", l, ".enable(", t, ")}else{", l, ".disable(", t, ")}", d, ".", e, "=", n, ";");
                            f(r);
                            u("if(", n, "!==", d, ".", e, "){", r, "}");
                        });
                        Object.keys(S).forEach(function(e) {
                            var t = S[e];
                            var n = _[e];
                            var r, i;
                            var a = s.block();
                            a(l, ".", t, "(");
                            if (Cn(n)) {
                                var o = n.length;
                                r = s.global.def(h, ".", e);
                                i = s.global.def(d, ".", e);
                                a(Se(o, function(e) {
                                    return r + "[" + e + "]";
                                }), ");", Se(o, function(e) {
                                    return i + "[" + e + "]=" + r + "[" + e + "];";
                                }).join(""));
                                u("if(", Se(o, function(e) {
                                    return r + "[" + e + "]!==" + i + "[" + e + "]";
                                }).join("||"), "){", a, "}");
                            } else {
                                r = c.def(h, ".", e);
                                i = c.def(d, ".", e);
                                a(r, ");", d, ".", e, "=", r, ";");
                                u("if(", r, "!==", i, "){", a, "}");
                            }
                            f(a);
                        });
                        return s.compile();
                    }(),
                    compile: se
                };
            }
            function qs() {
                return {
                    vaoCount: 0,
                    bufferCount: 0,
                    elementsCount: 0,
                    framebufferCount: 0,
                    shaderCount: 0,
                    textureCount: 0,
                    cubeCount: 0,
                    renderbufferCount: 0,
                    maxTextureUnits: 0
                };
            }
            var Zs = 34918, zs = 34919, Us = 35007, Gs = function e(t, c) {
                if (!c.ext_disjoint_timer_query) {
                    return null;
                }
                var n = [];
                function r() {
                    return n.pop() || c.ext_disjoint_timer_query.createQueryEXT();
                }
                function l(e) {
                    n.push(e);
                }
                var h = [];
                function i(e) {
                    var t = r();
                    c.ext_disjoint_timer_query.beginQueryEXT(Us, t);
                    h.push(t);
                    f(h.length - 1, h.length, e);
                }
                function a() {
                    c.ext_disjoint_timer_query.endQueryEXT(Us);
                }
                function o() {
                    this.startQueryIndex = -1;
                    this.endQueryIndex = -1;
                    this.sum = 0;
                    this.stats = null;
                }
                var s = [];
                function u() {
                    return s.pop() || new o();
                }
                function d(e) {
                    s.push(e);
                }
                var v = [];
                function f(e, t, n) {
                    var r = u();
                    r.startQueryIndex = e;
                    r.endQueryIndex = t;
                    r.sum = 0;
                    r.stats = n;
                    v.push(r);
                }
                var p = [];
                var m = [];
                function _() {
                    var e, t;
                    var n = h.length;
                    if (n === 0) {
                        return;
                    }
                    m.length = Math.max(m.length, n + 1);
                    p.length = Math.max(p.length, n + 1);
                    p[0] = 0;
                    m[0] = 0;
                    var r = 0;
                    e = 0;
                    for (t = 0; t < h.length; ++t) {
                        var i = h[t];
                        if (c.ext_disjoint_timer_query.getQueryObjectEXT(i, zs)) {
                            r += c.ext_disjoint_timer_query.getQueryObjectEXT(i, Zs);
                            l(i);
                        } else {
                            h[e++] = i;
                        }
                        p[t + 1] = r;
                        m[t + 1] = e;
                    }
                    h.length = e;
                    e = 0;
                    for (t = 0; t < v.length; ++t) {
                        var a = v[t];
                        var o = a.startQueryIndex;
                        var s = a.endQueryIndex;
                        a.sum += p[s] - p[o];
                        var u = m[o];
                        var f = m[s];
                        if (f === u) {
                            a.stats.gpuTime += a.sum / 1e6;
                            d(a);
                        } else {
                            a.startQueryIndex = u;
                            a.endQueryIndex = f;
                            v[e++] = a;
                        }
                    }
                    v.length = e;
                }
                return {
                    beginQuery: i,
                    endQuery: a,
                    pushScopeStats: f,
                    update: _,
                    getNumPendingQueries: function e() {
                        return h.length;
                    },
                    clear: function e() {
                        n.push.apply(n, h);
                        for (var t = 0; t < n.length; t++) {
                            c.ext_disjoint_timer_query.deleteQueryEXT(n[t]);
                        }
                        h.length = 0;
                        n.length = 0;
                    },
                    restore: function e() {
                        h.length = 0;
                        n.length = 0;
                    }
                };
            }, Hs = 16384, ks = 256, js = 1024, Vs = 34962, Xs = "webglcontextlost", Ws = "webglcontextrestored", Ks = 1, Ys = 2, Qs = 3;
            function Js(e, t) {
                for (var n = 0; n < e.length; ++n) {
                    if (e[n] === t) {
                        return n;
                    }
                }
                return -1;
            }
            function $s(e) {
                var t = we(e);
                if (!t) {
                    return null;
                }
                var i = t.gl;
                var n = i.getContextAttributes();
                var p = i.isContextLost();
                var r = Ee(i, t);
                if (!r) {
                    return null;
                }
                var a = me();
                var o = qs();
                var s = r.extensions;
                if (i.getParameter(i.VERSION).indexOf("WebGL 2.0") >= 0) {
                    Ue.gl2(i, s);
                }
                var u = Gs(i, s);
                var f = pe();
                var c = i.drawingBufferWidth;
                var l = i.drawingBufferHeight;
                var h = {
                    tick: 0,
                    time: 0,
                    viewportWidth: c,
                    viewportHeight: l,
                    framebufferWidth: c,
                    framebufferHeight: l,
                    drawingBufferWidth: c,
                    drawingBufferHeight: l,
                    pixelRatio: t.pixelRatio
                };
                var d = {};
                var v = {
                    elements: null,
                    primitive: 4,
                    count: -1,
                    offset: 0,
                    instances: -1
                };
                var m = At(i, s);
                var _ = on(i, o, t, x);
                var g = va(i, s, m, o, _);
                function x(e) {
                    return g.destroyBuffer(e);
                }
                var b = An(i, s, _, o);
                var y = xa(i, a, o, t);
                var T = pi(i, s, m, function() {
                    S.procs.poll();
                }, h, o, t);
                var w = Oi(i, s, m, o, t);
                var E = ca(i, s, m, T, w, o);
                var S = Ls(i, a, s, m, _, b, T, E, d, g, y, v, h, u, t);
                var A = Ea(i, E, S.procs.poll, h, n, s, m);
                var M = S.next;
                var R = i.canvas;
                var O = [];
                var B = [];
                var C = [];
                var F = [ t.onDestroy ];
                var I = null;
                function P() {
                    if (O.length === 0) {
                        if (u) {
                            u.update();
                        }
                        I = null;
                        return;
                    }
                    I = ve.next(P);
                    V();
                    for (var e = O.length - 1; e >= 0; --e) {
                        var t = O[e];
                        if (t) {
                            t(h, null, 0);
                        }
                    }
                    i.flush();
                    if (u) {
                        u.update();
                    }
                }
                function D() {
                    if (!I && O.length > 0) {
                        I = ve.next(P);
                    }
                }
                function N() {
                    if (I) {
                        ve.cancel(P);
                        I = null;
                    }
                }
                function L(e) {
                    e.preventDefault();
                    p = true;
                    N();
                    B.forEach(function(e) {
                        e();
                    });
                }
                function q(e) {
                    i.getError();
                    p = false;
                    r.restore();
                    y.restore();
                    _.restore();
                    T.restore();
                    w.restore();
                    E.restore();
                    g.restore();
                    if (u) {
                        u.restore();
                    }
                    S.procs.refresh();
                    D();
                    C.forEach(function(e) {
                        e();
                    });
                }
                if (R) {
                    R.addEventListener(Xs, L, false);
                    R.addEventListener(Ws, q, false);
                }
                function Z() {
                    O.length = 0;
                    N();
                    if (R) {
                        R.removeEventListener(Xs, L);
                        R.removeEventListener(Ws, q);
                    }
                    y.clear();
                    E.clear();
                    w.clear();
                    T.clear();
                    b.clear();
                    _.clear();
                    g.clear();
                    if (u) {
                        u.clear();
                    }
                    F.forEach(function(e) {
                        e();
                    });
                }
                function z(e) {
                    fe(!!e, "invalid args to regl({...})");
                    fe.type(e, "object", "invalid args to regl({...})");
                    function t(e) {
                        var r = ue({}, e);
                        delete r.uniforms;
                        delete r.attributes;
                        delete r.context;
                        delete r.vao;
                        if ("stencil" in r && r.stencil.op) {
                            r.stencil.opBack = r.stencil.opFront = r.stencil.op;
                            delete r.stencil.op;
                        }
                        function t(t) {
                            if (t in r) {
                                var n = r[t];
                                delete r[t];
                                Object.keys(n).forEach(function(e) {
                                    r[t + "." + e] = n[e];
                                });
                            }
                        }
                        t("blend");
                        t("depth");
                        t("cull");
                        t("stencil");
                        t("polygonOffset");
                        t("scissor");
                        t("sample");
                        if ("vao" in e) {
                            r.vao = e.vao;
                        }
                        return r;
                    }
                    function n(n) {
                        var r = {};
                        var i = {};
                        Object.keys(n).forEach(function(e) {
                            var t = n[e];
                            if (de.isDynamic(t)) {
                                i[e] = de.unbox(t, e);
                            } else {
                                r[e] = t;
                            }
                        });
                        return {
                            dynamic: i,
                            static: r
                        };
                    }
                    var r = n(e.context || {});
                    var i = n(e.uniforms || {});
                    var a = n(e.attributes || {});
                    var o = n(t(e));
                    var s = {
                        gpuTime: 0,
                        cpuTime: 0,
                        count: 0
                    };
                    var u = S.compile(o, a, i, r, s);
                    var f = u.draw;
                    var c = u.batch;
                    var l = u.scope;
                    var h = [];
                    function d(e) {
                        while (h.length < e) {
                            h.push(null);
                        }
                        return h;
                    }
                    function v(e, t) {
                        var n;
                        if (p) {
                            fe.raise("context lost");
                        }
                        if (typeof e === "function") {
                            return l.call(this, null, e, 0);
                        } else if (typeof t === "function") {
                            if (typeof e === "number") {
                                for (n = 0; n < e; ++n) {
                                    l.call(this, null, t, n);
                                }
                            } else if (Array.isArray(e)) {
                                for (n = 0; n < e.length; ++n) {
                                    l.call(this, e[n], t, n);
                                }
                            } else {
                                return l.call(this, e, t, 0);
                            }
                        } else if (typeof e === "number") {
                            if (e > 0) {
                                return c.call(this, d(e | 0), e | 0);
                            }
                        } else if (Array.isArray(e)) {
                            if (e.length) {
                                return c.call(this, e, e.length);
                            }
                        } else {
                            return f.call(this, e);
                        }
                    }
                    return ue(v, {
                        stats: s,
                        destroy: function e() {
                            u.destroy();
                        }
                    });
                }
                var U = E.setFBO = z({
                    framebuffer: de.define.call(null, Ks, "framebuffer")
                });
                function G(e, t) {
                    var n = 0;
                    S.procs.poll();
                    var r = t.color;
                    if (r) {
                        i.clearColor(+r[0] || 0, +r[1] || 0, +r[2] || 0, +r[3] || 0);
                        n |= Hs;
                    }
                    if ("depth" in t) {
                        i.clearDepth(+t.depth);
                        n |= ks;
                    }
                    if ("stencil" in t) {
                        i.clearStencil(t.stencil | 0);
                        n |= js;
                    }
                    fe(!!n, "called regl.clear with no buffer specified");
                    i.clear(n);
                }
                function H(e) {
                    fe(typeof e === "object" && e, "regl.clear() takes an object as input");
                    if ("framebuffer" in e) {
                        if (e.framebuffer && e.framebuffer_reglType === "framebufferCube") {
                            for (var t = 0; t < 6; ++t) {
                                U(ue({
                                    framebuffer: e.framebuffer.faces[t]
                                }, e), G);
                            }
                        } else {
                            U(e, G);
                        }
                    } else {
                        G(null, e);
                    }
                }
                function k(n) {
                    fe.type(n, "function", "regl.frame() callback must be a function");
                    O.push(n);
                    function e() {
                        var e = Js(O, n);
                        fe(e >= 0, "cannot cancel a frame twice");
                        function t() {
                            var e = Js(O, t);
                            O[e] = O[O.length - 1];
                            O.length -= 1;
                            if (O.length <= 0) {
                                N();
                            }
                        }
                        O[e] = t;
                    }
                    D();
                    return {
                        cancel: e
                    };
                }
                function j() {
                    var e = M.viewport;
                    var t = M.scissor_box;
                    e[0] = e[1] = t[0] = t[1] = 0;
                    h.viewportWidth = h.framebufferWidth = h.drawingBufferWidth = e[2] = t[2] = i.drawingBufferWidth;
                    h.viewportHeight = h.framebufferHeight = h.drawingBufferHeight = e[3] = t[3] = i.drawingBufferHeight;
                }
                function V() {
                    h.tick += 1;
                    h.time = W();
                    j();
                    S.procs.poll();
                }
                function X() {
                    j();
                    S.procs.refresh();
                    if (u) {
                        u.update();
                    }
                }
                function W() {
                    return (pe() - f) / 1e3;
                }
                X();
                function K(e, n) {
                    fe.type(n, "function", "listener callback must be a function");
                    var r;
                    switch (e) {
                      case "frame":
                        return k(n);

                      case "lost":
                        r = B;
                        break;

                      case "restore":
                        r = C;
                        break;

                      case "destroy":
                        r = F;
                        break;

                      default:
                        fe.raise("invalid event, must be one of frame,lost,restore,destroy");
                    }
                    r.push(n);
                    return {
                        cancel: function e() {
                            for (var t = 0; t < r.length; ++t) {
                                if (r[t] === n) {
                                    r[t] = r[r.length - 1];
                                    r.pop();
                                    return;
                                }
                            }
                        }
                    };
                }
                var Y = ue(z, {
                    clear: H,
                    prop: de.define.bind(null, Ks),
                    context: de.define.bind(null, Ys),
                    this: de.define.bind(null, Qs),
                    draw: z({}),
                    buffer: function e(t) {
                        return _.create(t, Vs, false, false);
                    },
                    elements: function e(t) {
                        return b.create(t, false);
                    },
                    texture: T.create2D,
                    cube: T.createCube,
                    renderbuffer: w.create,
                    framebuffer: E.create,
                    framebufferCube: E.createCube,
                    vao: g.createVAO,
                    attributes: n,
                    frame: k,
                    on: K,
                    limits: m,
                    hasExtension: function e(t) {
                        return m.extensions.indexOf(t.toLowerCase()) >= 0;
                    },
                    read: A,
                    destroy: Z,
                    _gl: i,
                    _refresh: X,
                    poll: function e() {
                        V();
                        if (u) {
                            u.update();
                        }
                    },
                    now: W,
                    stats: o
                });
                t.onDone(null, Y);
                return Y;
            }
            return $s;
        }();
    }(t = {
        exports: {}
    }), t.exports);
    function n(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
            Object.defineProperty(e, r.key, r);
        }
    }
    function o(e, t) {
        e.prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t;
    }
    function i(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
    }
    function a(e) {
        var t = 0;
        if ("undefined" != typeof Symbol && null != e[Symbol.iterator]) return (t = e[Symbol.iterator]()).next.bind(t);
        if (Array.isArray(e) || (e = function(e, t) {
            if (e) {
                if ("string" == typeof e) return i(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i(e, t) : void 0;
            }
        }(e))) return function() {
            return t >= e.length ? {
                done: !0
            } : {
                done: !1,
                value: e[t++]
            };
        };
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var w = 1e-6, s = "undefined" != typeof Float32Array ? Float32Array : Array, f = Math.random;
    function u(e, t) {
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[4], e[4] = t[5], e[5] = t[6], 
        e[6] = t[8], e[7] = t[9], e[8] = t[10], e;
    }
    function l(e, t) {
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], 
        e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], 
        e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e;
    }
    function X(e) {
        return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, 
        e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, 
        e;
    }
    function h(e, t) {
        if (e === t) {
            var n = t[1], r = t[2], i = t[3], a = t[6], o = t[7], s = t[11];
            e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = n, e[6] = t[9], e[7] = t[13], e[8] = r, 
            e[9] = a, e[11] = t[14], e[12] = i, e[13] = o, e[14] = s;
        } else e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = t[1], e[5] = t[5], 
        e[6] = t[9], e[7] = t[13], e[8] = t[2], e[9] = t[6], e[10] = t[10], e[11] = t[14], 
        e[12] = t[3], e[13] = t[7], e[14] = t[11], e[15] = t[15];
        return e;
    }
    function x(e, t) {
        var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], u = t[6], f = t[7], c = t[8], l = t[9], h = t[10], d = t[11], v = t[12], p = t[13], m = t[14], _ = t[15], g = n * s - r * o, x = n * u - i * o, b = n * f - a * o, y = r * u - i * s, T = r * f - a * s, w = i * f - a * u, E = c * p - l * v, S = c * m - h * v, A = c * _ - d * v, M = l * m - h * p, R = l * _ - d * p, O = h * _ - d * m, B = g * O - x * R + b * M + y * A - T * S + w * E;
        return B ? (B = 1 / B, e[0] = (s * O - u * R + f * M) * B, e[1] = (i * R - r * O - a * M) * B, 
        e[2] = (p * w - m * T + _ * y) * B, e[3] = (h * T - l * w - d * y) * B, e[4] = (u * A - o * O - f * S) * B, 
        e[5] = (n * O - i * A + a * S) * B, e[6] = (m * b - v * w - _ * x) * B, e[7] = (c * w - h * b + d * x) * B, 
        e[8] = (o * R - s * A + f * E) * B, e[9] = (r * A - n * R - a * E) * B, e[10] = (v * T - p * b + _ * g) * B, 
        e[11] = (l * b - c * T - d * g) * B, e[12] = (s * S - o * M - u * E) * B, e[13] = (n * M - r * S + i * E) * B, 
        e[14] = (p * x - v * y - m * g) * B, e[15] = (c * y - l * x + h * g) * B, e) : null;
    }
    function W(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = t[9], d = t[10], v = t[11], p = t[12], m = t[13], _ = t[14], g = t[15], x = n[0], b = n[1], y = n[2], T = n[3];
        return e[0] = x * r + b * s + y * l + T * p, e[1] = x * i + b * u + y * h + T * m, 
        e[2] = x * a + b * f + y * d + T * _, e[3] = x * o + b * c + y * v + T * g, x = n[4], 
        b = n[5], y = n[6], T = n[7], e[4] = x * r + b * s + y * l + T * p, e[5] = x * i + b * u + y * h + T * m, 
        e[6] = x * a + b * f + y * d + T * _, e[7] = x * o + b * c + y * v + T * g, x = n[8], 
        b = n[9], y = n[10], T = n[11], e[8] = x * r + b * s + y * l + T * p, e[9] = x * i + b * u + y * h + T * m, 
        e[10] = x * a + b * f + y * d + T * _, e[11] = x * o + b * c + y * v + T * g, x = n[12], 
        b = n[13], y = n[14], T = n[15], e[12] = x * r + b * s + y * l + T * p, e[13] = x * i + b * u + y * h + T * m, 
        e[14] = x * a + b * f + y * d + T * _, e[15] = x * o + b * c + y * v + T * g, e;
    }
    function d(e, t) {
        return e[0] = t[12], e[1] = t[13], e[2] = t[14], e;
    }
    function v(e, t) {
        var n = t[0], r = t[1], i = t[2], a = t[4], o = t[5], s = t[6], u = t[8], f = t[9], c = t[10];
        return e[0] = Math.sqrt(n * n + r * r + i * i), e[1] = Math.sqrt(a * a + o * o + s * s), 
        e[2] = Math.sqrt(u * u + f * f + c * c), e;
    }
    function p(e, t) {
        var n = t[0] + t[5] + t[10], r = 0;
        return 0 < n ? (r = 2 * Math.sqrt(n + 1), e[3] = .25 * r, e[0] = (t[6] - t[9]) / r, 
        e[1] = (t[8] - t[2]) / r, e[2] = (t[1] - t[4]) / r) : t[0] > t[5] && t[0] > t[10] ? (r = 2 * Math.sqrt(1 + t[0] - t[5] - t[10]), 
        e[3] = (t[6] - t[9]) / r, e[0] = .25 * r, e[1] = (t[1] + t[4]) / r, e[2] = (t[8] + t[2]) / r) : t[5] > t[10] ? (r = 2 * Math.sqrt(1 + t[5] - t[0] - t[10]), 
        e[3] = (t[8] - t[2]) / r, e[0] = (t[1] + t[4]) / r, e[1] = .25 * r, e[2] = (t[6] + t[9]) / r) : (r = 2 * Math.sqrt(1 + t[10] - t[0] - t[5]), 
        e[3] = (t[1] - t[4]) / r, e[0] = (t[8] + t[2]) / r, e[1] = (t[6] + t[9]) / r, e[2] = .25 * r), 
        e;
    }
    function m(e, t, n, r) {
        var i = t[0], a = t[1], o = t[2], s = t[3], u = i + i, f = a + a, c = o + o, l = i * u, h = i * f, d = i * c, v = a * f, p = a * c, m = o * c, _ = s * u, g = s * f, x = s * c, b = r[0], y = r[1], T = r[2];
        return e[0] = (1 - (v + m)) * b, e[1] = (h + x) * b, e[2] = (d - g) * b, e[3] = 0, 
        e[4] = (h - x) * y, e[5] = (1 - (l + m)) * y, e[6] = (p + _) * y, e[7] = 0, e[8] = (d + g) * T, 
        e[9] = (p - _) * T, e[10] = (1 - (l + v)) * T, e[11] = 0, e[12] = n[0], e[13] = n[1], 
        e[14] = n[2], e[15] = 1, e;
    }
    function _(e, t, n, r, i) {
        var a = 1 / Math.tan(t / 2), o = void 0;
        return e[0] = a / n, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = a, e[6] = 0, 
        e[7] = 0, e[8] = 0, e[9] = 0, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, null != i && i !== 1 / 0 ? (o = 1 / (r - i), 
        e[10] = (i + r) * o, e[14] = 2 * i * r * o) : (e[10] = -1, e[14] = -2 * r), e;
    }
    function K(e, t, n, r) {
        var i = void 0, a = void 0, o = void 0, s = void 0, u = void 0, f = void 0, c = void 0, l = void 0, h = void 0, d = void 0, v = t[0], p = t[1], m = t[2], _ = r[0], g = r[1], x = r[2], b = n[0], y = n[1], T = n[2];
        return Math.abs(v - b) < w && Math.abs(p - y) < w && Math.abs(m - T) < w ? X(e) : (c = v - b, 
        l = p - y, h = m - T, i = g * (h *= d = 1 / Math.sqrt(c * c + l * l + h * h)) - x * (l *= d), 
        a = x * (c *= d) - _ * h, o = _ * l - g * c, (d = Math.sqrt(i * i + a * a + o * o)) ? (i *= d = 1 / d, 
        a *= d, o *= d) : o = a = i = 0, s = l * o - h * a, u = h * i - c * o, f = c * a - l * i, 
        (d = Math.sqrt(s * s + u * u + f * f)) ? (s *= d = 1 / d, u *= d, f *= d) : f = u = s = 0, 
        e[0] = i, e[1] = s, e[2] = c, e[3] = 0, e[4] = a, e[5] = u, e[6] = l, e[7] = 0, 
        e[8] = o, e[9] = f, e[10] = h, e[11] = 0, e[12] = -(i * v + a * p + o * m), e[13] = -(s * v + u * p + f * m), 
        e[14] = -(c * v + l * p + h * m), e[15] = 1, e);
    }
    function g() {
        var e = new s(3);
        return s != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0), e;
    }
    function b(e) {
        var t = e[0], n = e[1], r = e[2];
        return Math.sqrt(t * t + n * n + r * r);
    }
    function y(e, t, n) {
        var r = new s(3);
        return r[0] = e, r[1] = t, r[2] = n, r;
    }
    function B(e, t) {
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e;
    }
    function C(e, t, n, r) {
        return e[0] = t, e[1] = n, e[2] = r, e;
    }
    function Y(e, t, n) {
        return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e;
    }
    function T(e, t, n) {
        return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e;
    }
    function E(e, t, n) {
        return e[0] = t[0] * n[0], e[1] = t[1] * n[1], e[2] = t[2] * n[2], e;
    }
    function S(e, t, n) {
        return e[0] = t[0] / n[0], e[1] = t[1] / n[1], e[2] = t[2] / n[2], e;
    }
    function Q(e, t, n) {
        return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e;
    }
    function A(e, t, n, r) {
        return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e;
    }
    function M(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2];
        return Math.sqrt(n * n + r * r + i * i);
    }
    function R(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2];
        return n * n + r * r + i * i;
    }
    function O(e) {
        var t = e[0], n = e[1], r = e[2];
        return t * t + n * n + r * r;
    }
    function J(e, t) {
        var n = t[0], r = t[1], i = t[2], a = n * n + r * r + i * i;
        return 0 < a && (a = 1 / Math.sqrt(a), e[0] = t[0] * a, e[1] = t[1] * a, e[2] = t[2] * a), 
        e;
    }
    function F(e, t) {
        return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
    }
    function I(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = n[0], s = n[1], u = n[2];
        return e[0] = i * u - a * s, e[1] = a * o - r * u, e[2] = r * s - i * o, e;
    }
    function P(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = n[3] * r + n[7] * i + n[11] * a + n[15];
        return o = o || 1, e[0] = (n[0] * r + n[4] * i + n[8] * a + n[12]) / o, e[1] = (n[1] * r + n[5] * i + n[9] * a + n[13]) / o, 
        e[2] = (n[2] * r + n[6] * i + n[10] * a + n[14]) / o, e;
    }
    function D(e, t) {
        var n = e[0], r = e[1], i = e[2], a = t[0], o = t[1], s = t[2];
        return Math.abs(n - a) <= w * Math.max(1, Math.abs(n), Math.abs(a)) && Math.abs(r - o) <= w * Math.max(1, Math.abs(r), Math.abs(o)) && Math.abs(i - s) <= w * Math.max(1, Math.abs(i), Math.abs(s));
    }
    var N, L = T, q = E, Z = S, z = M, U = R, G = b, H = O, k = (N = g(), function(e, t, n, r, i, a) {
        var o = void 0, s = void 0;
        for (t = t || 3, n = n || 0, s = r ? Math.min(r * t + n, e.length) : e.length, o = n; o < s; o += t) N[0] = e[o], 
        N[1] = e[o + 1], N[2] = e[o + 2], i(N, N, a), e[o] = N[0], e[o + 1] = N[1], e[o + 2] = N[2];
        return e;
    }), j = Object.freeze({
        __proto__: null,
        create: g,
        clone: function(e) {
            var t = new s(3);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t;
        },
        length: b,
        fromValues: y,
        copy: B,
        set: C,
        add: Y,
        subtract: T,
        multiply: E,
        divide: S,
        ceil: function(e, t) {
            return e[0] = Math.ceil(t[0]), e[1] = Math.ceil(t[1]), e[2] = Math.ceil(t[2]), e;
        },
        floor: function(e, t) {
            return e[0] = Math.floor(t[0]), e[1] = Math.floor(t[1]), e[2] = Math.floor(t[2]), 
            e;
        },
        min: function(e, t, n) {
            return e[0] = Math.min(t[0], n[0]), e[1] = Math.min(t[1], n[1]), e[2] = Math.min(t[2], n[2]), 
            e;
        },
        max: function(e, t, n) {
            return e[0] = Math.max(t[0], n[0]), e[1] = Math.max(t[1], n[1]), e[2] = Math.max(t[2], n[2]), 
            e;
        },
        round: function(e, t) {
            return e[0] = Math.round(t[0]), e[1] = Math.round(t[1]), e[2] = Math.round(t[2]), 
            e;
        },
        scale: Q,
        scaleAndAdd: A,
        distance: M,
        squaredDistance: R,
        squaredLength: O,
        negate: function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e;
        },
        inverse: function(e, t) {
            return e[0] = 1 / t[0], e[1] = 1 / t[1], e[2] = 1 / t[2], e;
        },
        normalize: J,
        dot: F,
        cross: I,
        lerp: function(e, t, n, r) {
            var i = t[0], a = t[1], o = t[2];
            return e[0] = i + r * (n[0] - i), e[1] = a + r * (n[1] - a), e[2] = o + r * (n[2] - o), 
            e;
        },
        hermite: function(e, t, n, r, i, a) {
            var o = a * a, s = o * (2 * a - 3) + 1, u = o * (a - 2) + a, f = o * (a - 1), c = o * (3 - 2 * a);
            return e[0] = t[0] * s + n[0] * u + r[0] * f + i[0] * c, e[1] = t[1] * s + n[1] * u + r[1] * f + i[1] * c, 
            e[2] = t[2] * s + n[2] * u + r[2] * f + i[2] * c, e;
        },
        bezier: function(e, t, n, r, i, a) {
            var o = 1 - a, s = o * o, u = a * a, f = s * o, c = 3 * a * s, l = 3 * u * o, h = u * a;
            return e[0] = t[0] * f + n[0] * c + r[0] * l + i[0] * h, e[1] = t[1] * f + n[1] * c + r[1] * l + i[1] * h, 
            e[2] = t[2] * f + n[2] * c + r[2] * l + i[2] * h, e;
        },
        random: function(e, t) {
            t = t || 1;
            var n = 2 * f() * Math.PI, r = 2 * f() - 1, i = Math.sqrt(1 - r * r) * t;
            return e[0] = Math.cos(n) * i, e[1] = Math.sin(n) * i, e[2] = r * t, e;
        },
        transformMat4: P,
        transformMat3: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2];
            return e[0] = r * n[0] + i * n[3] + a * n[6], e[1] = r * n[1] + i * n[4] + a * n[7], 
            e[2] = r * n[2] + i * n[5] + a * n[8], e;
        },
        transformQuat: function(e, t, n) {
            var r = n[0], i = n[1], a = n[2], o = n[3], s = t[0], u = t[1], f = t[2], c = i * f - a * u, l = a * s - r * f, h = r * u - i * s, d = i * h - a * l, v = a * c - r * h, p = r * l - i * c, m = 2 * o;
            return c *= m, l *= m, h *= m, d *= 2, v *= 2, p *= 2, e[0] = s + c + d, e[1] = u + l + v, 
            e[2] = f + h + p, e;
        },
        rotateX: function(e, t, n, r) {
            var i = [], a = [];
            return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[0], 
            a[1] = i[1] * Math.cos(r) - i[2] * Math.sin(r), a[2] = i[1] * Math.sin(r) + i[2] * Math.cos(r), 
            e[0] = a[0] + n[0], e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
        },
        rotateY: function(e, t, n, r) {
            var i = [], a = [];
            return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[2] * Math.sin(r) + i[0] * Math.cos(r), 
            a[1] = i[1], a[2] = i[2] * Math.cos(r) - i[0] * Math.sin(r), e[0] = a[0] + n[0], 
            e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
        },
        rotateZ: function(e, t, n, r) {
            var i = [], a = [];
            return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[0] * Math.cos(r) - i[1] * Math.sin(r), 
            a[1] = i[0] * Math.sin(r) + i[1] * Math.cos(r), a[2] = i[2], e[0] = a[0] + n[0], 
            e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
        },
        angle: function(e, t) {
            var n = y(e[0], e[1], e[2]), r = y(t[0], t[1], t[2]);
            J(n, n), J(r, r);
            var i = F(n, r);
            return 1 < i ? 0 : i < -1 ? Math.PI : Math.acos(i);
        },
        str: function(e) {
            return "vec3(" + e[0] + ", " + e[1] + ", " + e[2] + ")";
        },
        exactEquals: function(e, t) {
            return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
        },
        equals: D,
        sub: L,
        mul: q,
        div: Z,
        dist: z,
        sqrDist: U,
        len: G,
        sqrLen: H,
        forEach: k
    });
    function V() {
        var e = new s(4);
        return s != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0), e;
    }
    function $(e, t) {
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
    }
    function ee(e, t, n, r, i) {
        return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e;
    }
    function te(e, t, n) {
        return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], 
        e;
    }
    function ne(e, t, n) {
        return e[0] = t[0] * n[0], e[1] = t[1] * n[1], e[2] = t[2] * n[2], e[3] = t[3] * n[3], 
        e;
    }
    function re(e, t, n) {
        return e[0] = t[0] / n[0], e[1] = t[1] / n[1], e[2] = t[2] / n[2], e[3] = t[3] / n[3], 
        e;
    }
    function ie(e, t, n) {
        return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e;
    }
    function ae(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2], a = t[3] - e[3];
        return Math.sqrt(n * n + r * r + i * i + a * a);
    }
    function oe(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2], a = t[3] - e[3];
        return n * n + r * r + i * i + a * a;
    }
    function se(e) {
        var t = e[0], n = e[1], r = e[2], i = e[3];
        return Math.sqrt(t * t + n * n + r * r + i * i);
    }
    function ue(e) {
        var t = e[0], n = e[1], r = e[2], i = e[3];
        return t * t + n * n + r * r + i * i;
    }
    function fe(e, t) {
        var n = t[0], r = t[1], i = t[2], a = t[3], o = n * n + r * r + i * i + a * a;
        return 0 < o && (o = 1 / Math.sqrt(o), e[0] = n * o, e[1] = r * o, e[2] = i * o, 
        e[3] = a * o), e;
    }
    function ce(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = t[3];
        return e[0] = n[0] * r + n[4] * i + n[8] * a + n[12] * o, e[1] = n[1] * r + n[5] * i + n[9] * a + n[13] * o, 
        e[2] = n[2] * r + n[6] * i + n[10] * a + n[14] * o, e[3] = n[3] * r + n[7] * i + n[11] * a + n[15] * o, 
        e;
    }
    function le(e, t) {
        var n = e[0], r = e[1], i = e[2], a = e[3], o = t[0], s = t[1], u = t[2], f = t[3];
        return Math.abs(n - o) <= w * Math.max(1, Math.abs(n), Math.abs(o)) && Math.abs(r - s) <= w * Math.max(1, Math.abs(r), Math.abs(s)) && Math.abs(i - u) <= w * Math.max(1, Math.abs(i), Math.abs(u)) && Math.abs(a - f) <= w * Math.max(1, Math.abs(a), Math.abs(f));
    }
    var he, de = te, ve = ne, pe = re, me = ae, _e = oe, ge = se, xe = ue, be = (he = V(), 
    function(e, t, n, r, i, a) {
        var o = void 0, s = void 0;
        for (t = t || 4, n = n || 0, s = r ? Math.min(r * t + n, e.length) : e.length, o = n; o < s; o += t) he[0] = e[o], 
        he[1] = e[o + 1], he[2] = e[o + 2], he[3] = e[o + 3], i(he, he, a), e[o] = he[0], 
        e[o + 1] = he[1], e[o + 2] = he[2], e[o + 3] = he[3];
        return e;
    }), ye = Object.freeze({
        __proto__: null,
        create: V,
        clone: function(e) {
            var t = new s(4);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;
        },
        fromValues: function(e, t, n, r) {
            var i = new s(4);
            return i[0] = e, i[1] = t, i[2] = n, i[3] = r, i;
        },
        copy: $,
        set: ee,
        add: function(e, t, n) {
            return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], 
            e;
        },
        subtract: te,
        multiply: ne,
        divide: re,
        ceil: function(e, t) {
            return e[0] = Math.ceil(t[0]), e[1] = Math.ceil(t[1]), e[2] = Math.ceil(t[2]), e[3] = Math.ceil(t[3]), 
            e;
        },
        floor: function(e, t) {
            return e[0] = Math.floor(t[0]), e[1] = Math.floor(t[1]), e[2] = Math.floor(t[2]), 
            e[3] = Math.floor(t[3]), e;
        },
        min: function(e, t, n) {
            return e[0] = Math.min(t[0], n[0]), e[1] = Math.min(t[1], n[1]), e[2] = Math.min(t[2], n[2]), 
            e[3] = Math.min(t[3], n[3]), e;
        },
        max: function(e, t, n) {
            return e[0] = Math.max(t[0], n[0]), e[1] = Math.max(t[1], n[1]), e[2] = Math.max(t[2], n[2]), 
            e[3] = Math.max(t[3], n[3]), e;
        },
        round: function(e, t) {
            return e[0] = Math.round(t[0]), e[1] = Math.round(t[1]), e[2] = Math.round(t[2]), 
            e[3] = Math.round(t[3]), e;
        },
        scale: ie,
        scaleAndAdd: function(e, t, n, r) {
            return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, 
            e;
        },
        distance: ae,
        squaredDistance: oe,
        length: se,
        squaredLength: ue,
        negate: function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = -t[3], e;
        },
        inverse: function(e, t) {
            return e[0] = 1 / t[0], e[1] = 1 / t[1], e[2] = 1 / t[2], e[3] = 1 / t[3], e;
        },
        normalize: fe,
        dot: function(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3];
        },
        lerp: function(e, t, n, r) {
            var i = t[0], a = t[1], o = t[2], s = t[3];
            return e[0] = i + r * (n[0] - i), e[1] = a + r * (n[1] - a), e[2] = o + r * (n[2] - o), 
            e[3] = s + r * (n[3] - s), e;
        },
        random: function(e, t) {
            var n, r, i, a, o, s;
            for (t = t || 1; 1 <= (o = (n = 2 * f() - 1) * n + (r = 2 * f() - 1) * r); ) ;
            for (;1 <= (s = (i = 2 * f() - 1) * i + (a = 2 * f() - 1) * a); ) ;
            var u = Math.sqrt((1 - o) / s);
            return e[0] = t * n, e[1] = t * r, e[2] = t * i * u, e[3] = t * a * u, e;
        },
        transformMat4: ce,
        transformQuat: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = n[0], s = n[1], u = n[2], f = n[3], c = f * r + s * a - u * i, l = f * i + u * r - o * a, h = f * a + o * i - s * r, d = -o * r - s * i - u * a;
            return e[0] = c * f + d * -o + l * -u - h * -s, e[1] = l * f + d * -s + h * -o - c * -u, 
            e[2] = h * f + d * -u + c * -s - l * -o, e[3] = t[3], e;
        },
        str: function(e) {
            return "vec4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
        },
        exactEquals: function(e, t) {
            return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3];
        },
        equals: le,
        sub: de,
        mul: ve,
        div: pe,
        dist: me,
        sqrDist: _e,
        len: ge,
        sqrLen: xe,
        forEach: be
    });
    function Te() {
        var e = new s(4);
        return s != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0), e[3] = 1, e;
    }
    function we(e, t, n, r) {
        var i = t[0], a = t[1], o = t[2], s = t[3], u = n[0], f = n[1], c = n[2], l = n[3], h = void 0, d = void 0, v = void 0, p = void 0, m = void 0;
        return (d = i * u + a * f + o * c + s * l) < 0 && (d = -d, u = -u, f = -f, c = -c, 
        l = -l), m = w < 1 - d ? (h = Math.acos(d), v = Math.sin(h), p = Math.sin((1 - r) * h) / v, 
        Math.sin(r * h) / v) : (p = 1 - r, r), e[0] = p * i + m * u, e[1] = p * a + m * f, 
        e[2] = p * o + m * c, e[3] = p * s + m * l, e;
    }
    function Ee(e, t) {
        var n = t[0] + t[4] + t[8], r = void 0;
        if (0 < n) r = Math.sqrt(n + 1), e[3] = .5 * r, r = .5 / r, e[0] = (t[5] - t[7]) * r, 
        e[1] = (t[6] - t[2]) * r, e[2] = (t[1] - t[3]) * r; else {
            var i = 0;
            t[4] > t[0] && (i = 1), t[8] > t[3 * i + i] && (i = 2);
            var a = (i + 1) % 3, o = (i + 2) % 3;
            r = Math.sqrt(t[3 * i + i] - t[3 * a + a] - t[3 * o + o] + 1), e[i] = .5 * r, r = .5 / r, 
            e[3] = (t[3 * a + o] - t[3 * o + a]) * r, e[a] = (t[3 * a + i] + t[3 * i + a]) * r, 
            e[o] = (t[3 * o + i] + t[3 * i + o]) * r;
        }
        return e;
    }
    var Se, Ae, Me, Re, Oe, Be, Ce, Fe = $, Ie = ie, Pe = fe, De = le;
    Se = g(), Ae = y(1, 0, 0), Me = y(0, 1, 0), Re = Te(), Oe = Te(), Be = new s(9), 
    s != Float32Array && (Be[1] = 0, Be[2] = 0, Be[3] = 0, Be[5] = 0, Be[6] = 0, Be[7] = 0), 
    Be[0] = 1, Be[4] = 1, Be[8] = 1, Ce = Be;
    function Ne(e, t, n) {
        return e[0] = t, e[1] = n, e;
    }
    var Le, qe;
    Le = new s(2), s != Float32Array && (Le[0] = 0, Le[1] = 0), qe = Le;
    function Ze(e) {
        return !ze(e) && ("string" == typeof e || null !== e.constructor && e.constructor === String);
    }
    function ze(e) {
        return null == e;
    }
    function Ue(e) {
        return !ze(e);
    }
    function Ge(e) {
        return !ze(e) && ("function" == typeof e || null !== e.constructor && e.constructor === Function);
    }
    var He = "function" == typeof Object.assign;
    function ke(e) {
        if (He) Object.assign.apply(Object, arguments); else for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) e[r] = n[r];
        }
        return e;
    }
    function je(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) void 0 !== n[r] && null !== n[r] && (e[r] = n[r]);
        }
        return e;
    }
    function Ve(e) {
        return "number" == typeof e && !isNaN(e);
    }
    function Xe(e, t, n) {
        return e * (1 - n) + t * n;
    }
    function We(e) {
        return Array.isArray(e) || e instanceof Uint8Array || e instanceof Int8Array || e instanceof Uint16Array || e instanceof Int16Array || e instanceof Uint32Array || e instanceof Int32Array || e instanceof Uint8ClampedArray || e instanceof Float32Array || e instanceof Float64Array;
    }
    function Ke(e) {
        return (e = Math.abs(e)) < 128 ? Int8Array : e < 32768 ? Int16Array : Float32Array;
    }
    function Ye(e, t, n) {
        return Math.min(n, Math.max(t, e));
    }
    function Qe(e) {
        return function(e) {
            function t() {
                return e.apply(this, arguments) || this;
            }
            o(t, e);
            var n = t.prototype;
            return n.on = function(e, t) {
                return this._events || (this._events = {
                    type: [ t ]
                }), this._events[e] = this._events[e] || [], this._events[e].push(t), this;
            }, n.once = function(e, t) {
                return this.on(e, this._wrapOnce(e, t));
            }, n.off = function(e, t) {
                return this._events && this._events[e] && this._events[e].splice(this._events[e].indexOf(t), 1), 
                this;
            }, n.fire = function(e, t) {
                if (void 0 === t && (t = {}), !this._events || !this._events[e]) return this;
                t.target || (t.target = this);
                for (var n, r = a(this._events[e].slice(0)); !(n = r()).done; ) {
                    (0, n.value)(t);
                }
                return this;
            }, n._wrapOnce = function(n, r) {
                var i = this, a = !1;
                return function e(t) {
                    a || (a = !0, r(t), i.off(n, e));
                };
            }, t;
        }(e);
    }
    var Je, $e = Object.freeze({
        __proto__: null,
        isString: Ze,
        isNil: ze,
        defined: Ue,
        isFunction: Ge,
        extend: ke,
        extend1: je,
        extend2: function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) void 0 === e[r] && (e[r] = n[r]);
            }
            return e;
        },
        isNumber: Ve,
        log2: function(e) {
            if (Math.log2) return Math.log2(e);
            var t = Math.log(e) * Math.LOG2E, n = Math.round(t);
            return Math.abs(n - t) < 1e-14 ? n : t;
        },
        normalize: function(e, t) {
            for (var n = 0, r = 0, i = t.length; r < i; r++) n += t[r];
            for (var a = 0, o = t.length; a < o; a++) e[a] = t[a] / n;
            return e;
        },
        interpolate: Xe,
        isArray: We,
        lerp: function(e, t, n, r) {
            for (var i = 0; i < e.length; i++) e[i] = t[i] + r * (n[i] - t[i]);
            return e;
        },
        set: function(e, t) {
            for (var n = 0; n < e.length; n++) e[n] = t[n];
            return e;
        },
        getPosArrayType: Ke,
        clamp: Ye
    }), et = "__reshader_disposed", tt = Object.freeze({
        __proto__: null,
        KEY_DISPOSED: et,
        WEBGL_EXTENSIONS: [ "ANGLE_instanced_arrays", "OES_element_index_uint", "OES_standard_derivatives" ],
        WEBGL_OPTIONAL_EXTENSIONS: [ "OES_vertex_array_object", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_texture_float", "OES_texture_float_linear", "WEBGL_depth_texture", "EXT_shader_texture_lod", "EXT_texture_filter_anisotropic" ]
    }), nt = Qe(((Je = rt.prototype).isReady = function() {
        return !this._loading;
    }, Je.set = function(e, t) {
        return this.config[e] = t, this.dirty = !0, this;
    }, Je.get = function(e) {
        return this.config[e];
    }, Je.getREGLTexture = function(e) {
        return this._texture || (this._texture = this.createREGLTexture(e)), this.dirty && this._updateREGL(), 
        this._texture;
    }, Je._updateREGL = function() {
        this._texture && this._texture(this.config), this.dirty = !1;
    }, Je.dispose = function() {
        this.config && this.config.url && this.resLoader.disposeRes(this.config.url), this._texture && !this._texture[et] && (this._texture.destroy(), 
        this._texture[et] = !0), delete this.resLoader, this.fire("disposed", {
            target: this,
            url: this.config && this.config.url
        }), delete this.config;
    }, Je._needPowerOf2 = function() {
        var e = this.config;
        return e.wrap && "clamp" !== e.wrap || e.wrapS && "clamp" !== e.wrapS || e.wrapT && "clamp" !== e.wrapT || e.min && "nearest" !== e.min && "linear" !== e.min;
    }, rt));
    function rt(e, t) {
        var n = this;
        if (Ge(e)) for (var r in this._texture = e, e = this.config = {}, this._texture) this._texture.hasOwnProperty(r) && (Ge(this._texture[r]) || (e[r] = this._texture[r])); else if (this.config = e || {}, 
        this.resLoader = t, (e.url || e.promise) && !e.data) {
            this._loading = !0;
            var i, a = this;
            if (e.promise) i = e.promise; else i = (e.arrayBuffer ? t.getArrayBuffer : t.get).call(t, e.url);
            e.data = t.getDefaultTexture(e.url), (this.promise = i).then(function(e) {
                return n.config && (e.data instanceof Image && n._needPowerOf2() && (e.data = function(e) {
                    if (it(e.width) && it(e.height)) return e;
                    var t = e.width, n = e.height;
                    it(t) || (t = at(t)), it(n) || (n = at(n));
                    var r = document.createElement("canvas");
                    r.width = t, r.height = n, r.getContext("2d").drawImage(e, 0, 0, t, n);
                    var i = e.src, a = i.lastIndexOf("/") + 1, o = i.substring(a);
                    return console.warn("Texture(" + o + ")'s size is not power of two, resize from (" + e.width + ", " + e.height + ") to (" + t + ", " + n + ")"), 
                    r;
                }(e.data)), delete n.promise, a._loading = !1, a.config && (a.onLoad(e), Array.isArray(e) || (e = [ e ]), 
                a.fire("complete", {
                    target: n,
                    resources: e
                }))), e;
            }).catch(function(e) {
                console.error("error when loading texture image.", e);
            });
        }
    }
    function it(e) {
        return 0 == (e & e - 1) && 0 !== e;
    }
    function at(e) {
        return Math.pow(2, Math.floor(Math.log(e) / Math.LN2));
    }
    var ot, st = ((ot = ut.prototype).render = function(e, t, n, r) {
        if (e.setUniforms(t || {}), e.setFramebuffer(r), n) {
            var i = n.getSortedMeshes(), a = i.opaques, o = i.transparents;
            e.draw(this.regl, a), e.draw(this.regl, o);
        } else e.draw(this.regl);
        return this;
    }, ot.clear = function(e) {
        this.regl.clear(e);
    }, ut);
    function ut(e) {
        this.regl = e;
    }
    var ft, ct = (o(lt, ft = st), lt);
    function lt() {
        return ft.apply(this, arguments) || this;
    }
    var ht = (dt.prototype.addUniqueNeighbor = function(e) {
        -1 === this.neighbors.indexOf(e) && this.neighbors.push(e);
    }, dt);
    function dt(e, t) {
        this.position = e, this.index = t, this.faces = [], this.neighbors = [];
    }
    var vt, pt = ((vt = mt.prototype).computeNormal = function() {
        var e = this.v1.position, t = this.v2.position, n = this.v3.position, r = I([], L([], n, t), L([], e, t));
        J(this.normal, r);
    }, vt.hasVertex = function(e) {
        return e === this.v1 || e === this.v2 || e === this.v3;
    }, mt);
    function mt(e, t, n, r) {
        this.a = r.a, this.b = r.b, this.c = r.c, this.v1 = e, this.v2 = t, this.v3 = n, 
        this.normal = [], this.computeNormal(), e.faces.push(this), e.addUniqueNeighbor(t), 
        e.addUniqueNeighbor(n), t.faces.push(this), t.addUniqueNeighbor(e), t.addUniqueNeighbor(n), 
        n.faces.push(this), n.addUniqueNeighbor(e), n.addUniqueNeighbor(t);
    }
    var _t = 8, gt = [], xt = [], bt = [], yt = [];
    function Tt(e, t, n) {
        var r, i = I(xt, t, n);
        e = Ee(e, function(e, t, n, r, i, a, o, s, u, f) {
            return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e[4] = a, e[5] = o, e[6] = s, e[7] = u, 
            e[8] = f, e;
        }.apply(void 0, [ gt, n[0], n[1], n[2] ].concat(i, t))), e = (r = e = Pe(e, e))[3] < 0 ? Ie(r, r, -1) : r;
        var a = 1 / ((1 << 2 * _t - 1) - 1);
        if (e[3] < a) {
            e[3] = a;
            var o = Math.sqrt(1 - a * a);
            e[0] *= o, e[1] *= o, e[2] *= o;
        }
        var s = 0 < n[3] ? I(bt, n, t) : I(bt, t, n);
        return F(I(yt, n, t), s) < 0 && Ie(e, e, -1), e;
    }
    function wt(e, t, n) {
        return e[0] = t[n], e[1] = t[n + 1], e[2] = t[n + 2], e;
    }
    function Et(e, t, n) {
        return e[0] = t[n], e[1] = t[n + 1], e;
    }
    var St, At, Mt = ((At = Rt.prototype).dirty = function() {
        return this._dirty = !0, this;
    }, At.getCenter = function() {
        return this.center || (this.center = [], this._dirty = !0), this._dirty && (Y(this.center, this.min, this.max), 
        Q(this.center, this.center, .5)), this._dirty = !1, this.center;
    }, At.containPoint = function(e) {
        var t = this.min, n = this.max;
        return t[0] <= e[0] && t[1] <= e[1] && t[2] <= e[2] && n[0] >= e[0] && n[1] >= e[1] && n[2] >= e[2];
    }, At.isFinite = (St = function() {
        var e = this.min, t = this.max;
        return isFinite(e[0]) && isFinite(e[1]) && isFinite(e[2]) && isFinite(t[0]) && isFinite(t[1]) && isFinite(t[2]);
    }, Ot.toString = function() {
        return St.toString();
    }, Ot), Rt);
    function Rt(e, t) {
        this.min = e || [ 1 / 0, 1 / 0, 1 / 0 ], this.max = t || [ -1 / 0, -1 / 0, -1 / 0 ];
    }
    function Ot() {
        return St.apply(this, arguments);
    }
    var Bt, Ct = {
        positionSize: 3,
        primitive: "triangles",
        positionAttribute: "aPosition",
        normalAttribute: "aNormal",
        uv0Attribute: "aTexCoord",
        uv1Attribute: "aTexCoord1",
        tangentAttribute: "aTangent"
    }, Ft = ((Bt = It.prototype).getREGLData = function() {
        if (!this._reglData) {
            var e = this.data, t = this.desc, n = t.positionAttribute, r = t.normalAttribute, i = t.uv0Attribute, a = t.uv1Attribute, o = t.tangentAttribute;
            this._reglData = ke({}, this.data), delete this._reglData[n], this._reglData.aPosition = e[n], 
            e[r] && (delete this._reglData[r], this._reglData.aNormal = e[r]), e[i] && (delete this._reglData[i], 
            this._reglData.aTexCoord = e[i]), e[a] && (delete this._reglData[a], this._reglData.aTexCoord1 = e[a]), 
            e[o] && (delete this._reglData[o], this._reglData.aTangent = e[o]);
        }
        return this._reglData;
    }, Bt.generateBuffers = function(e) {
        var t = this._buffers;
        for (var n in t) t[n].buffer || (t[n].buffer = e.buffer(t[n].data)), delete t[n].data;
        var r = this.data, i = {};
        for (var a in r) r[a] && (!r[a].buffer || r[a].buffer instanceof ArrayBuffer ? i[a] = {
            buffer: e.buffer(r[a])
        } : r[a].buffer.destroy ? i[a] = r[a] : t[r[a].buffer] && (i[a] = ke({}, r[a]), 
        i[a].buffer = t[r[a].buffer].buffer));
        this.data = i, delete this._reglData, this.elements && !Ve(this.elements) && (this.elements = this.elements.destroy ? this.elements : e.elements({
            primitive: this.getPrimitive(),
            data: this.elements
        }));
    }, Bt.addBuffer = function(e, t) {
        return this._buffers[e] = {
            data: t
        }, delete this._reglData, this;
    }, Bt.updateBuffer = function(e, t) {
        if (!this._buffers[e]) throw new Error("invalid buffer " + e + " in geometry");
        return this._buffers[e].buffer ? this._buffers[e].buffer.subdata(t) : this._buffers[e].data = t, 
        delete this._reglData, this;
    }, Bt.updateData = function(e, t) {
        var n, r = this.data[e];
        return r && (this.data[e] = t, r.buffer && r.buffer.destroy && (n = r), e === this.desc.positionAttribute && this.updateBoundingBox(), 
        n && (n.buffer.subdata(t), this.data[e] = n), delete this._reglData), this;
    }, Bt.getPrimitive = function() {
        return this.desc.primitive;
    }, Bt.getAttributes = function() {
        return Object.keys(this.getREGLData());
    }, Bt.getElements = function() {
        return this.elements;
    }, Bt.setElements = function(e, t) {
        if (!e) throw new Error("elements data is invalid");
        var n = this.elements;
        return this.count = void 0 === t ? Pt(e) : t, n.destroy ? this.elements = n(e) : this.elements = e, 
        this;
    }, Bt.setDrawCount = function(e) {
        return this.count1 = e, this;
    }, Bt.getDrawCount = function() {
        return this.count1 || this.count;
    }, Bt.setDrawOffset = function(e) {
        return this.offset = e, this;
    }, Bt.getDrawOffset = function() {
        return this.offset || 0;
    }, Bt.dispose = function() {
        this._forEachBuffer(function(e) {
            e[et] || (e[et] = !0, e.destroy());
        }), this.data = {}, this._buffers = {}, delete this._reglData, this.count = 0, this.elements = [], 
        this._disposed = !0;
    }, Bt.isDisposed = function() {
        return !!this._disposed;
    }, Bt.updateBoundingBox = function() {
        var e = this.boundingBox;
        e = e || (this.boundingBox = new Mt());
        var t = this.desc.positionAttribute, n = this.data[t];
        if (We(n) || (n = n.data), n && n.length) {
            var r = e.min, i = e.max;
            C(r, n[0], n[1], n[2]), C(i, n[0], n[1], n[2]);
            for (var a = 3; a < n.length; ) {
                var o = n[a++], s = n[a++], u = n[a++];
                o < r[0] && (r[0] = o), s < r[1] && (r[1] = s), u < r[2] && (r[2] = u), o > i[0] && (i[0] = o), 
                s > i[1] && (i[1] = s), u > i[2] && (i[2] = u);
            }
            e.dirty();
        }
    }, Bt.createTangent = function(e) {
        void 0 === e && (e = "aTangent");
        for (var t = this.desc, n = t.normalAttribute, r = t.positionAttribute, i = t.uv0Attribute, a = this.data[n], o = function(v, t, p, e) {
            for (var n = v.length / 3, r = new Array(4 * n), m = [], _ = [], i = 0; i < n; i++) m[i] = [ 0, 0, 0 ], 
            _[i] = [ 0, 0, 0 ];
            var g = [ 0, 0, 0 ], x = [ 0, 0, 0 ], b = [ 0, 0, 0 ], y = [ 0, 0 ], T = [ 0, 0 ], w = [ 0, 0 ], E = [ 0, 0, 0 ], S = [ 0, 0, 0 ];
            function a(e, t, n) {
                wt(g, v, 3 * e), wt(x, v, 3 * t), wt(b, v, 3 * n), Et(y, p, 2 * e), Et(T, p, 2 * t), 
                Et(w, p, 2 * n);
                var r = x[0] - g[0], i = b[0] - g[0], a = x[1] - g[1], o = b[1] - g[1], s = x[2] - g[2], u = b[2] - g[2], f = T[0] - y[0], c = w[0] - y[0], l = T[1] - y[1], h = w[1] - y[1], d = 1 / (f * h - c * l);
                C(E, (h * r - l * i) * d, (h * a - l * o) * d, (h * s - l * u) * d), C(S, (f * i - c * r) * d, (f * o - c * a) * d, (f * u - c * s) * d), 
                Y(m[e], m[e], E), Y(m[t], m[t], E), Y(m[n], m[n], E), Y(_[e], _[e], S), Y(_[t], _[t], S), 
                Y(_[n], _[n], S);
            }
            for (var o = 0, s = e.length; o < s; o += 3) a(e[o + 0], e[o + 1], e[o + 2]);
            var u, f, c, l = [], h = [], d = [], A = [];
            function M(e) {
                wt(d, t, 3 * e), B(A, d), f = m[e], B(l, f), L(l, l, Q(d, d, F(d, f))), J(l, l), 
                I(h, A, f), c = F(h, _[e]), u = c < 0 ? -1 : 1, r[4 * e] = l[0], r[4 * e + 1] = l[1], 
                r[4 * e + 2] = l[2], r[4 * e + 3] = u;
            }
            for (var R = 0, O = e.length; R < O; R += 3) M(e[R + 0]), M(e[R + 1]), M(e[R + 2]);
            return r;
        }(this.data[r], a, this.data[i], this.elements), s = this.data[e] = new Float32Array(o.length), u = [], f = [], c = [], l = 0; l < o.length; l += 4) {
            var h = l / 4 * 3;
            C(f, a[h], a[1 + h], a[2 + h]), ee(u, o[l], o[l + 1], o[l + 2], o[l + 3]), Tt(c, f, u), 
            $(s.subarray(l, l + 4), c);
        }
    }, Bt.createNormal = function(e) {
        void 0 === e && (e = "aNormal");
        var t = this.data[this.desc.positionAttribute];
        this.data[e] = function(e, t) {
            var n = [], r = [], i = 0;
            for (i = 0; i < t.length / 3; i++) {
                var a = new ht([ e[3 * i], e[3 * i + 1], e[3 * i + 2] ], i);
                n.push(a);
            }
            for (i = 0; i < t.length / 3; i++) {
                var o = {
                    a: t[3 * i],
                    b: t[3 * i + 1],
                    c: t[3 * i + 2]
                };
                new pt(n[o.a], n[o.b], n[o.c], o);
            }
            var s = [];
            for (i = 0; i < n.length; i++) {
                for (var u = n[i], f = u.index, c = [ 0, 0, 0 ], l = u.faces.length, h = 0; h < l; h++) Y(c, c, u.faces[h].normal);
                C(s, l, l, l), S(c, c, s), r[3 * f] = c[0], r[3 * f + 1] = c[1], r[3 * f + 2] = c[2];
            }
            return r;
        }(t, this.elements);
    }, Bt.createBarycentric = function(e) {
        void 0 === e && (e = "aBarycentric");
        var t = this.data[this.desc.positionAttribute];
        if (!We(t)) throw new Error("Position data must be an array to create bary centric data");
        if ("triangles" !== this.desc.primitive) throw new Error("Primitive must be triangles to create bary centric data");
        for (var n = new Uint8Array(t.length / this.desc.positionSize * 3), r = 0, i = this.elements.length; r < i; ) for (var a = 0; a < 3; a++) n[3 * this.elements[r++] + a] = 1;
        this.data[e] = n;
    }, Bt.buildUniqueVertex = function() {
        var e = this.data, t = this.elements;
        if (!We(t)) throw new Error("elements must be array to build unique vertex.");
        var n = Object.keys(e), r = {}, i = e[this.desc.positionAttribute];
        if (!We(i)) throw new Error(this.desc.positionAttribute + " must be array to build unique vertex.");
        for (var a = i.length / this.desc.positionSize, o = t.length, s = 0; s < n.length; s++) {
            var u = n[s], f = e[u].length / a;
            if (!We(e[u])) throw new Error(u + " must be array to build unique vertex.");
            r[u] = e[u], r[u].size = f, e[u] = new e[u].constructor(o * f);
        }
        for (var c = 0, l = 0; l < o; l++) {
            for (var h = t[l], d = 0; d < n.length; d++) for (var v = n[d], p = e[v], m = r[v].size, _ = 0; _ < m; _++) p[c * m + _] = r[v][h * m + _];
            t[l] = c++;
        }
    }, Bt.getMemorySize = function() {
        var e = 0;
        for (var t in this.data) if (this.data.hasOwnProperty(t)) {
            var n = this.data[t];
            n.data ? e += n.data.length * n.data.BYTES_PER_ELEMENT : e += n.length * n.BYTES_PER_ELEMENT;
        }
        return e;
    }, Bt._forEachBuffer = function(e) {
        for (var t in this.elements && this.elements.destroy && e(this.elements), this.data) this.data.hasOwnProperty(t) && this.data[t] && this.data[t].buffer && this.data[t].buffer.destroy && e(this.data[t].buffer);
        for (var n in this._buffers) this._buffers.hasOwnProperty(n) && this._buffers[n] && this._buffers[n].buffer && this._buffers[n].buffer.destroy && e(this._buffers[n].buffer);
    }, It);
    function It(e, t, n, r) {
        this.data = e, this.elements = t, this.desc = ke({}, Ct, r);
        var i = e[this.desc.positionAttribute];
        n || (t ? n = Pt(t) : i && i.length && (n = i.length / this.desc.positionSize)), 
        this.count = n, this.elements || (this.elements = n), this.properties = {}, this._buffers = {}, 
        this.updateBoundingBox();
    }
    function Pt(e) {
        if (Ve(e)) return e;
        if (void 0 !== e.length) return e.length;
        if (e.data) return e.data.length;
        throw new Error("invalid elements length");
    }
    var Dt, Nt = Qe(((Dt = Lt.prototype).isReady = function() {
        return this._loadingCount <= 0;
    }, Dt.set = function(e, t) {
        return this.uniforms[e] = t, (e.length < 2 || "u" !== e.charAt(0) || e.charAt(1) !== e.charAt(1).toUpperCase()) && (this.uniforms["u" + qt(e)] = t), 
        this._dirtyUniforms = this.isTexture(e) ? "texture" : "primitive", "texture" === this._dirtyUniforms && this._checkTextures(), 
        this;
    }, Dt.get = function(e) {
        return this.uniforms[e];
    }, Dt.isDirty = function() {
        return this._dirtyUniforms || this._dirtyDefines;
    }, Dt.getDefines = function() {
        return this._dirtyDefines && (this.createDefines ? this._defines = this.createDefines() : this._defines = {}, 
        this._dirtyDefines = !1), this._defines;
    }, Dt.createDefines = function() {
        var e = this.uniforms, t = {};
        return e.jointTexture && (t.HAS_SKIN = 1), e.morphWeights && (t.HAS_MORPH = 1), 
        t;
    }, Dt.getUniforms = function(n) {
        var r = this;
        if (!this._dirtyUniforms) return this._reglUniforms;
        function e(e) {
            var t = r.uniforms[e];
            r.isTexture(e) ? "primitive" === r._dirtyUniforms && r._reglUniforms[e] ? a[e] = r._reglUniforms[e] : (r._reglUniforms[e] && r._reglUniforms[e].destroy(), 
            a[e] = t.getREGLTexture(n)) : Object.defineProperty(a, e, {
                enumerable: !0,
                configurable: !0,
                get: function() {
                    return i && i[e];
                }
            });
        }
        var i = this.uniforms, a = {};
        for (var t in i) e(t);
        return this._reglUniforms = a, this._dirtyUniforms = !1, a;
    }, Dt.isTexture = function(e) {
        return this.uniforms[e] instanceof nt;
    }, Dt.dispose = function() {
        for (var e in this.uniforms) {
            var t = this.uniforms[e];
            t && (t.dispose ? t.dispose() : t.destroy && !t[et] && (t.destroy(), t[et] = !0));
        }
        delete this.uniforms, delete this._reglUniforms, this._disposed = !0;
    }, Dt.isDisposed = function() {
        return !!this._disposed;
    }, Dt._checkTextures = function() {
        for (var e in this._loadingCount = 0, this.uniforms) if (this.isTexture(e)) {
            var t = this.uniforms[e];
            t.isReady() || (this._loadingCount++, t.on("complete", this._bindedOnTextureComplete));
        }
    }, Dt._onTextureComplete = function() {
        this._loadingCount--, this._loadingCount <= 0 && this.fire("complete");
    }, Lt));
    function Lt(e, t) {
        for (var n in void 0 === e && (e = {}), this.uniforms = je({}, t || {}, e), e) {
            var r = Object.getOwnPropertyDescriptor(e, n).get;
            if (r && Object.defineProperty(this.uniforms, n, {
                get: r
            }), n.length < 2 || "u" !== n.charAt(0) || n.charAt(1) !== n.charAt(1).toUpperCase()) {
                var i = "u" + qt(n);
                this.uniforms[i] = e[n], r && Object.defineProperty(this.uniforms, i, {
                    get: r
                });
            }
        }
        this._dirtyUniforms = "texture", this._dirtyDefines = !0, this._reglUniforms = {}, 
        this.refCount = 0, this._bindedOnTextureComplete = this._onTextureComplete.bind(this), 
        this._checkTextures();
    }
    function qt(e) {
        return e.charAt(0).toUpperCase() + e.substring(1);
    }
    var Zt, zt = {
        time: 0,
        seeThrough: !0,
        thickness: .03,
        fill: [ 1, .5137254902, .98, 1 ],
        stroke: [ .7019607843, .9333333333, .2274509804, 1 ],
        dashEnabled: !1,
        dashAnimate: !1,
        dashRepeats: 1,
        dashLength: .8,
        dashOverlap: !0,
        insideAltColor: !1,
        squeeze: !1,
        squeezeMin: .5,
        squeezeMax: 1,
        dualStroke: !1,
        secondThickness: .05,
        opacity: 1
    }, Ut = (o(Gt, Zt = Nt), Gt);
    function Gt(e) {
        return Zt.call(this, e, zt) || this;
    }
    var Ht, kt = {
        baseColorFactor: [ 1, 1, 1, 1 ],
        materialShininess: 32,
        ambientStrength: 1,
        specularStrength: 32,
        opacity: 1,
        extrusionOpacity: 0,
        extrusionOpacityRange: [ 0, 1.8 ],
        baseColorTexture: null,
        normalTexture: null,
        emissiveTexture: null,
        uOcclusionTexture: null,
        uvScale: [ 1, 1 ],
        uvOffset: [ 0, 0 ],
        lineColor: [ 1, 1, 1, 1 ],
        lineOpacity: 1,
        polygonFill: [ 1, 1, 1, 1 ],
        polygonOpacity: 1
    }, jt = (o(Vt, Ht = Nt), Vt.prototype.createDefines = function() {
        var e = Ht.prototype.createDefines.call(this), t = this.uniforms;
        return t.baseColorTexture && (e.HAS_BASECOLOR_MAP = 1), t.extrusionOpacity && (e.HAS_EXTRUSION_OPACITY = 1), 
        t.occlusionTexture && (e.HAS_AO_MAP = 1), t.emissiveTexture && (e.HAS_EMISSIVE_MAP = 1), 
        t.normalTexture && (e.HAS_NORMAL_MAP = 1), (e.HAS_BASECOLOR_MAP || e.HAS_AO_MAP || e.HAS_EMISSIVE_MAP || e.HAS_NORMAL_MAP) && (e.HAS_MAP = 1), 
        e;
    }, Vt);
    function Vt(e) {
        return Ht.call(this, e, kt) || this;
    }
    var Xt, Wt = {
        toons: 4,
        specularToons: 2
    }, Kt = (o(Yt, Xt = jt), Yt);
    function Yt(e) {
        return Xt.call(this, e, Wt) || this;
    }
    function Qt(e) {
        return o(t, n = e), t.prototype.createDefines = function() {
            var e = n.prototype.createDefines.call(this);
            e.SHADING_MODEL_SPECULAR_GLOSSINESS = 1;
            var t = this.uniforms;
            return t.diffuseTexture && (e.HAS_DIFFUSE_MAP = 1), t.specularGlossinessTexture && (e.HAS_SPECULARGLOSSINESS_MAP = 1), 
            (e.HAS_SPECULARGLOSSINESS_MAP || e.HAS_DIFFUSE_MAP) && (e.HAS_MAP = 1), e;
        }, t;
        function t(e) {
            return n.call(this, e = ke({}, $t, e || {})) || this;
        }
        var n;
    }
    var Jt, $t = {
        diffuseFactor: [ 1, 1, 1, 1 ],
        specularFactor: [ 1, 1, 1 ],
        glossinessFactor: 1,
        diffuseTexture: null,
        specularGlossinessTexture: null,
        normalTexture: null,
        emissiveTexture: null,
        occlusionTexture: null
    }, en = (o(tn, Jt = Qt(jt)), tn);
    function tn() {
        return Jt.apply(this, arguments) || this;
    }
    var nn, rn, an = [], on = ((nn = sn.prototype).setMaterial = function(e) {
        return this.material = e, this._dirtyUniforms = !0, this.dirtyDefines = !0, this;
    }, nn.setParent = function() {
        return this.parent = parent, this;
    }, nn.setLocalTransform = function(e) {
        return this.localTransform = e, this;
    }, nn.setPositionMatrix = function(e) {
        this.positionMatrix = e;
    }, nn.setUniform = function(e, t) {
        return void 0 === this.uniforms[e] && (this._dirtyUniforms = !0), this.uniforms[e] = t, 
        this;
    }, nn.getUniform = function(e) {
        return this.uniforms[e];
    }, nn.getDefines = function() {
        var e = {};
        if (this.defines && ke(e, this.defines), this.material) {
            var t = this.material.getDefines();
            t && ke(e, t);
        }
        return e;
    }, nn.setDefines = function(e) {
        return this.defines = e, this.dirtyDefines = !0, this;
    }, nn.getDefinesKey = function() {
        return (void 0 === this._definesKey || this.dirtyDefines || this.material && this.material.dirtyDefines) && (this._definesKey = this._createDefinesKey(this.getDefines()), 
        this.dirtyDefines = !1), this._definesKey;
    }, nn.getUniforms = function(r) {
        var i = this;
        return (this._dirtyUniforms || this.material && this.material.isDirty()) && function() {
            function e(e) {
                i.uniforms.hasOwnProperty(e) && Object.defineProperty(i._realUniforms, e, {
                    enumerable: !0,
                    configurable: !0,
                    get: function() {
                        return t && t[e];
                    }
                });
            }
            i._realUniforms = {}, i.material && function() {
                function e(e) {
                    t.hasOwnProperty(e) && Object.defineProperty(i._realUniforms, e, {
                        enumerable: !0,
                        configurable: !0,
                        get: function() {
                            return t && t[e];
                        }
                    });
                }
                var t = i.material.getUniforms(r);
                for (var n in t) e(n);
            }();
            var t = i.uniforms;
            for (var n in i.uniforms) e(n);
            i._dirtyUniforms = !1;
        }(), this._realUniforms.modelMatrix = this.localTransform, this._realUniforms.positionMatrix = this.positionMatrix, 
        this._realUniforms;
    }, nn.getMaterial = function() {
        return this.material;
    }, nn.getAttributes = function() {
        return this.geometry.getAttributes();
    }, nn.getElements = function() {
        return this.geometry.getElements();
    }, nn.getREGLProps = function(e) {
        var t = this.getUniforms(e);
        return ke(t, this.geometry.getREGLData()), t.elements = this.geometry.getElements(), 
        t.count = this.geometry.getDrawCount(), t.offset = this.geometry.getDrawOffset(), 
        t.primitive = this.geometry.getPrimitive(), t;
    }, nn.dispose = function() {
        return delete this.geometry, delete this.material, this.uniforms = {}, this;
    }, nn.isValid = function() {
        return this.geometry && !this.geometry.isDisposed() && (!this.material || !this.material.isDisposed());
    }, nn.getBoundingBox = function() {
        return this._bbox || this.updateBoundingBox(), this._bbox;
    }, nn.updateBoundingBox = function() {
        this._bbox || (this._bbox = [ [], [] ]);
        var e = this.geometry.boundingBox, t = e.min, n = e.max;
        ee(this._bbox[0], t[0], t[1], t[2], 1), ee(this._bbox[1], n[0], n[1], n[2], 1);
        var r = W(an, this.localTransform, this.positionMatrix);
        return ce(this._bbox[0], this._bbox[0], r), ce(this._bbox[1], this._bbox[1], r), 
        this._bbox;
    }, nn._createDefinesKey = function(e) {
        var t = [];
        for (var n in e) t.push(n, e[n]);
        return t.join(",");
    }, sn);
    function sn(e, t, n) {
        void 0 === n && (n = {}), this.geometry = e, this.material = t, this.config = n, 
        this.transparent = !!n.transparent, this.castShadow = ze(n.castShadow) || n.castShadow, 
        this.picking = !!n.picking, this.uniforms = {}, this.localTransform = X(new Array(16)), 
        this.positionMatrix = X(new Array(16)), this.properties = {}, this._dirtyUniforms = !0;
    }
    on.prototype.getWorldTransform = (rn = [], function() {
        return parent ? W(rn, parent.getWorldTransform(), this.localTransform) : this.localTransform;
    });
    var un, fn, cn, ln, hn, dn, vn, pn, mn, _n = [], gn = [], xn = [], bn = function(M) {
        function e(e, t, n, r, i) {
            var a;
            return void 0 === i && (i = {}), (a = M.call(this, n, r, i) || this).instanceCount = t, 
            a.instancedData = e || {}, a._checkInstancedProp(), a;
        }
        o(e, M);
        var t = e.prototype;
        return t._checkInstancedProp = function() {
            for (var e in this.instancedData) if (this.geometry.data[e]) throw new Error("Duplicate attribute " + e + " defined in geometry and instanced data");
        }, t.getAttributes = function() {
            var e = M.prototype.getAttributes.call(this);
            for (var t in this.instancedData) e.push(t);
            return e;
        }, t.getDefines = function() {
            var e = M.prototype.getDefines.call(this);
            return e.HAS_INSTANCE = 1, e;
        }, t.updateInstancedData = function(e, t) {
            var n = this.instancedData[e];
            return n && (this.instancedData[e] = t, n.buffer && n.buffer.destroy && n.buffer.destroy()), 
            this;
        }, t.generateInstancedBuffers = function(e) {
            var t = this.instancedData, n = {};
            for (var r in t) t[r] && (void 0 !== t[r].buffer && t[r].buffer.destroy ? (n[r] = t[r], 
            n[r].divisor && (n[r].divisor = 1)) : t[r].destroy ? n[r] = {
                buffer: t[r],
                divisor: 1
            } : n[r] = {
                buffer: e.buffer(t[r]),
                divisor: 1
            });
            return this.instancedData = n, this;
        }, t.getREGLProps = function(e) {
            var t = M.prototype.getREGLProps.call(this, e);
            return ke(t, this.instancedData), t.instances = this.instanceCount, t;
        }, t.disposeInstanceData = function() {
            var e = this.instancedData;
            if (e) for (var t in e) e[t] && e[t].destroy && !e[t][et] && (e[t][et] = 1, e[t].destroy());
            delete this.instancedData;
        }, t.getBoundingBox = function() {
            return this._bbox || this.updateBoundingBox(), this._bbox;
        }, t.updateBoundingBox = function() {
            var e = this.instancedData, t = e.instance_vectorA, n = e.instance_vectorB, r = e.instance_vectorC, i = e.instance_vectorD;
            if (!(t && n && r && i)) return M.prototype.updateBoundingBox.call(this);
            this._bbox || (this._bbox = [ [ 1 / 0, 1 / 0, 1 / 0 ], [ -1 / 0, -1 / 0, -1 / 0 ] ]);
            for (var a, o, s, u, f, c, l, h, d, v, p, m, _, g, x, b, y, T = this.geometry.boundingBox, w = T.min, E = T.max, S = 0; S < t.length; S += 4) {
                a = _n, o = t[S], s = t[S + 1], u = t[S + 2], f = t[S + 3], c = n[S], l = n[S + 1], 
                h = n[S + 2], d = n[S + 3], v = r[S], p = r[S + 1], m = r[S + 2], _ = r[S + 3], 
                g = i[S], x = i[S + 1], b = i[S + 2], y = i[S + 3], a[0] = o, a[1] = s, a[2] = u, 
                a[3] = f, a[4] = c, a[5] = l, a[6] = h, a[7] = d, a[8] = v, a[9] = p, a[10] = m, 
                a[11] = _, a[12] = g, a[13] = x, a[14] = b, a[15] = y, W(_n, _n, this.positionMatrix);
                var A = W(_n, this.localTransform, _n);
                ee(gn, w[0], w[1], w[2], 1), ee(xn, E[0], E[1], E[2], 1), ce(gn, gn, A), ce(xn, xn, A), 
                this._bbox[0][0] = Math.min(this._bbox[0][0], gn[0]), this._bbox[0][1] = Math.min(this._bbox[0][1], gn[1]), 
                this._bbox[0][2] = Math.min(this._bbox[0][2], gn[2]), this._bbox[1][0] = Math.max(this._bbox[1][0], gn[0]), 
                this._bbox[1][1] = Math.max(this._bbox[1][1], gn[1]), this._bbox[1][2] = Math.max(this._bbox[1][2], gn[2]);
            }
            return this._bbox;
        }, t._getBytesPerElement = function(e) {
            switch (e) {
              case 5120:
              case 5121:
                return 1;

              case 5122:
              case 5123:
                return 2;

              case 5124:
              case 5125:
              case 5126:
                return 4;
            }
            throw new Error("unsupported data type: " + e);
        }, e;
    }(on), yn = {
        getArrayBuffer: function(e, t) {
            return yn.get(e, {
                responseType: "arraybuffer"
            }, t);
        },
        get: function(e, t, n) {
            var r = yn._getClient(n);
            if (r.open("GET", e, !0), t) {
                for (var i in t.headers) r.setRequestHeader(i, t.headers[i]);
                r.withCredentials = "include" === t.credentials, t.responseType && (r.responseType = t.responseType);
            }
            return r.send(null), r;
        },
        _wrapCallback: function(e, t) {
            return function() {
                4 === e.readyState && (200 === e.status ? "arraybuffer" === e.responseType ? 0 === e.response.byteLength ? t(new Error("http status 200 returned without content.")) : t(null, {
                    data: e.response,
                    cacheControl: e.getResponseHeader("Cache-Control"),
                    expires: e.getResponseHeader("Expires"),
                    contentType: e.getResponseHeader("Content-Type")
                }) : t(null, e.responseText) : t(new Error(e.statusText + "," + e.status)));
            };
        },
        _getClient: function(e) {
            var t;
            try {
                t = new XMLHttpRequest();
            } catch (e) {
                try {
                    t = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        t = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e) {}
                }
            }
            return t.onreadystatechange = yn._wrapCallback(t, e), t;
        }
    }, Tn = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, wn = (fn = un = {
        exports: {}
    }, cn = Tn, pn = "undefined", hn = [], dn = 0, vn = function() {
        if (typeof MutationObserver == pn) return typeof process != pn && "function" == typeof process.nextTick ? function() {
            process.nextTick(En);
        } : typeof setImmediate != pn ? function() {
            setImmediate(En);
        } : function() {
            setTimeout(En, 0);
        };
        var e = document.createElement("div");
        return new MutationObserver(En).observe(e, {
            attributes: !0
        }), function() {
            e.setAttribute("a", 0);
        };
    }(), mn = function(e) {
        hn.push(e), hn.length - dn == 1 && vn();
    }, Sn.prototype = {
        resolve: function(n) {
            if (void 0 === this.state) {
                if (n === this) return this.reject(new TypeError("Attempt to resolve promise with self"));
                var r = this;
                if (n && ("function" == typeof n || "object" == typeof n)) try {
                    var t = !0, e = n.then;
                    if ("function" == typeof e) return void e.call(n, function(e) {
                        t && (t = !1, r.resolve(e));
                    }, function(e) {
                        t && (t = !1, r.reject(e));
                    });
                } catch (e) {
                    return void (t && this.reject(e));
                }
                this.state = "fulfilled", this.v = n, r.c && mn(function() {
                    for (var e = 0, t = r.c.length; e < t; e++) An(r.c[e], n);
                });
            }
        },
        reject: function(n) {
            if (void 0 === this.state) {
                var e = this;
                this.state = "rejected", this.v = n;
                var r = this.c;
                mn(r ? function() {
                    for (var e = 0, t = r.length; e < t; e++) Mn(r[e], n);
                } : function() {
                    e.handled || !Sn.suppressUncaughtRejectionError && cn.console && Sn.warn("You upset Zousan. Please catch rejections: ", n, n ? n.stack : null);
                });
            }
        },
        then: function(e, t) {
            var n = new Sn(), r = {
                y: e,
                n: t,
                p: n
            };
            if (void 0 === this.state) this.c ? this.c.push(r) : this.c = [ r ]; else {
                var i = this.state, a = this.v;
                this.handled = !0, mn(function() {
                    ("fulfilled" === i ? An : Mn)(r, a);
                });
            }
            return n;
        },
        catch: function(e) {
            return this.then(null, e);
        },
        finally: function(e) {
            return this.then(e, e);
        },
        timeout: function(e, r) {
            r = r || "Timeout";
            var i = this;
            return new Sn(function(t, n) {
                setTimeout(function() {
                    n(Error(r));
                }, e), i.then(function(e) {
                    t(e);
                }, function(e) {
                    n(e);
                });
            });
        }
    }, Sn.resolve = function(e) {
        var t = new Sn();
        return t.resolve(e), t;
    }, Sn.reject = function(e) {
        var t = new Sn();
        return t.c = [], t.reject(e), t;
    }, Sn.all = function(n) {
        var r = [], i = 0, a = new Sn();
        function e(e, t) {
            e && "function" == typeof e.then || (e = Sn.resolve(e)), e.then(function(e) {
                r[t] = e, ++i == n.length && a.resolve(r);
            }, function(e) {
                a.reject(e);
            });
        }
        for (var t = 0; t < n.length; t++) e(n[t], t);
        return n.length || a.resolve(r), a;
    }, Sn.warn = console.warn, fn.exports && (fn.exports = Sn), cn.define && cn.define.amd && cn.define([], function() {
        return Sn;
    }), (cn.Zousan = Sn).soon = mn, un.exports);
    function En() {
        for (;hn.length - dn; ) {
            try {
                hn[dn]();
            } catch (e) {
                cn.console && cn.console.error(e);
            }
            hn[dn++] = ln, 1024 == dn && (hn.splice(0, 1024), dn = 0);
        }
    }
    function Sn(e) {
        if (!(this instanceof Sn)) throw new TypeError("Zousan must be created with the new keyword");
        if ("function" == typeof e) {
            var t = this;
            try {
                e(function(e) {
                    t.resolve(e);
                }, function(e) {
                    t.reject(e);
                });
            } catch (e) {
                t.reject(e);
            }
        } else if (0 < arguments.length) throw new TypeError("Zousan resolver " + e + " is not a function");
    }
    function An(e, t) {
        if ("function" == typeof e.y) try {
            var n = e.y.call(ln, t);
            e.p.resolve(n);
        } catch (t) {
            e.p.reject(t);
        } else e.p.resolve(t);
    }
    function Mn(e, t) {
        if ("function" == typeof e.n) try {
            var n = e.n.call(ln, t);
            e.p.resolve(n);
        } catch (t) {
            e.p.reject(t);
        } else e.p.reject(t);
    }
    var Rn, On = "undefined" != typeof Promise ? Promise : wn, Bn = Qe(((Rn = Cn.prototype).get = function(e) {
        return Array.isArray(e) ? this._loadImages(e) : this._loadImage(e);
    }, Rn.getArrayBuffer = function(i) {
        var t = this;
        if (Array.isArray(i)) {
            var e = i.map(function(e) {
                return t.getArrayBuffer(e);
            });
            return On.all(e);
        }
        return new On(function(n, r) {
            yn.getArrayBuffer(i, function(e, t) {
                e ? r(e) : n({
                    url: i,
                    data: t
                });
            });
        });
    }, Rn.disposeRes = function(e) {
        var t = this;
        return Array.isArray(e) ? e.forEach(function(e) {
            return t._disposeOne(e);
        }) : this._disposeOne(e), this;
    }, Rn.isLoading = function() {
        return this._count && 0 < this._count;
    }, Rn.getDefaultTexture = function(e) {
        return Array.isArray(e) ? this._getBlankTextures(e.length) : this.defaultTexture;
    }, Rn._disposeOne = function(e) {
        var t = this.resources;
        t[e] && (t[e].count--, t[e.count] <= 0 && delete t[e]);
    }, Rn._loadImage = function(r) {
        var i = this.resources;
        return i[r] ? On.resolve({
            url: r,
            data: i[r].image
        }) : new On(function(e, t) {
            var n = new Image();
            n.crossOrigin = "anonymous", n.onload = function() {
                i[r] = {
                    image: n,
                    count: 1
                }, e({
                    url: r,
                    data: n
                });
            }, n.onerror = function(e) {
                t(e);
            }, n.onabort = function() {
                t("image(" + r + ") loading aborted.");
            }, n.src = r;
        });
    }, Rn._loadImages = function(e) {
        var t = this, n = e.map(function(e) {
            return t._loadImage(e, !0);
        });
        return On.all(n);
    }, Rn._getBlankTextures = function(e) {
        for (var t = new Array(e), n = 0; n < 6; n++) t.push(this.defaultTexture);
        return t;
    }, Cn));
    function Cn(e) {
        this.defaultTexture = e, this.defaultCubeTexture = new Array(6), this.resources = {};
    }
    var Fn, In = [], Pn = [], Dn = 0, Nn = ((Fn = Ln.prototype).setMeshes = function(e) {
        if (this.clear(), !e || Array.isArray(e) && !e.length || e === this.meshes) return this;
        e = Array.isArray(e) ? e : [ e ], this.meshes = [];
        for (var t = 0; t < e.length; t++) {
            var n = e[t];
            n && (n._scenes = n._scenes || {}, n._scenes[this._id] = 1, this.meshes.push(n));
        }
        return this.dirty(), this;
    }, Fn.addMesh = function(e) {
        var t = this;
        return !e || Array.isArray(e) && !e.length || (Array.isArray(e) ? e.forEach(function(e) {
            e._scenes = e._scenes || {}, e._scenes[t._id] || (e._scenes[t._id] = 1, t.meshes.push(e), 
            t.dirty());
        }) : (e._scenes = e._scenes || {}, e._scenes[this._id] || (e._scenes[this._id] = 1, 
        this.meshes.push(e), this.dirty()))), this;
    }, Fn.removeMesh = function(t) {
        if (!t || Array.isArray(t) && !t.length) return this;
        if (Array.isArray(t)) {
            for (var e = !1, n = 0; n < t.length; n++) t[n]._scenes && t[n]._scenes[this._id] && (e = !0, 
            this.dirty(), delete t[n]._scenes[this._id]);
            e && (this.meshes = this.meshes.filter(function(e) {
                return t.indexOf(e) < 0;
            }));
        } else {
            if (!t._scenes || !t._scenes[this._id]) return this;
            var r = this.meshes.indexOf(t);
            0 <= r && this.meshes.splice(r, 1), delete t._scenes[this._id], this.dirty();
        }
        return this;
    }, Fn.getMeshes = function() {
        return this.meshes;
    }, Fn.clear = function() {
        if (this.meshes) for (var e = 0; e < this.meshes.length; e++) delete this.meshes[e]._scenes[this._id];
        return this.meshes = [], this.sortedMeshes.opaques = [], this.sortedMeshes.transparents = [], 
        this;
    }, Fn.dirty = function() {
        return this._dirty = !0, this;
    }, Fn.sortMeshes = function(e) {
        var t = this.meshes, n = this.sortedMeshes.transparents;
        if (this._dirty) {
            var r = this.sortedMeshes.opaques = [];
            n = this.sortedMeshes.transparents = [];
            for (var i = 0, a = t.length; i < a; i++) t[i].transparent ? n.push(t[i]) : r.push(t[i]);
        }
        e && 1 < n.length && (this._cameraPosition = e, n.sort(this._compareBinded), delete this._cameraPosition), 
        this._dirty = !1;
    }, Fn.getSortedMeshes = function() {
        return this._dirty && this.sortMeshes(), this.sortedMeshes;
    }, Fn._compare = function(e, t) {
        return P(In, e.geometry.boundingBox.getCenter(), e.localTransform), P(Pn, t.geometry.boundingBox.getCenter(), t.localTransform), 
        z(Pn, this._cameraPosition) - z(In, this._cameraPosition);
    }, Ln);
    function Ln(e) {
        this._id = Dn++, this.sortedMeshes = {}, this.setMeshes(e), this._compareBinded = this._compare.bind(this), 
        this.dirty();
    }
    var qn = String.fromCharCode, Zn = 8, zn = 32767;
    function Un(e, t, n, r) {
        if (0 < e[3]) {
            var i = Math.pow(2, e[3] - 128 - 8 + r);
            t[n + 0] = e[0] * i, t[n + 1] = e[1] * i, t[n + 2] = e[2] * i;
        } else t[n + 0] = 0, t[n + 1] = 0, t[n + 2] = 0;
        return t[n + 3] = 1, t;
    }
    function Gn(e, t, n, r) {
        for (var i, a, o = 0, s = 0, u = r; 0 < u; ) if (e[s][0] = t[n++], e[s][1] = t[n++], 
        e[s][2] = t[n++], e[s][3] = t[n++], 1 === e[s][0] && 1 === e[s][1] && 1 === e[s][2]) {
            for (var f = e[s][3] << o >>> 0; 0 < f; f--) i = e[s - 1], (a = e[s])[0] = i[0], 
            a[1] = i[1], a[2] = i[2], a[3] = i[3], s++, u--;
            o += 8;
        } else s++, u--, o = 0;
        return n;
    }
    function Hn(e, t, n, r) {
        if (r < Zn | zn < r) return Gn(e, t, n, r);
        var i = t[n++];
        if (2 !== i) return Gn(e, t, n - 1, r);
        if (e[0][1] = t[n++], e[0][2] = t[n++], i = t[n++], (e[0][2] << 8 >>> 0 | i) >>> 0 !== r) return null;
        for (var a = 0; a < 4; a++) for (var o = 0; o < r; ) {
            var s = t[n++];
            if (128 < s) {
                s = (127 & s) >>> 0;
                for (var u = t[n++]; s--; ) e[o++][a] = u;
            } else for (;s--; ) e[o++][a] = t[n++];
        }
        return n;
    }
    function kn(e, t, n) {
        void 0 === t && (t = 0), void 0 === n && (n = 9);
        var r = new Uint8Array(e), i = r.length;
        if ("#?" !== function(e) {
            for (var t = "", n = 0; n < 2; n++) t += qn(e[n]);
            return t;
        }(r)) return null;
        for (var a = 2; a < i && ("\n" !== qn(r[a]) || "\n" !== qn(r[a + 1])); a++) ;
        if (i <= a) return null;
        a += 2;
        for (var o = ""; a < i; a++) {
            var s = qn(r[a]);
            if ("\n" === s) break;
            o += s;
        }
        var u = o.split(" "), f = parseInt(u[1]), c = parseInt(u[3]);
        if (!c || !f) return null;
        for (var l = a + 1, h = [], d = 0; d < c; d++) {
            h[d] = [];
            for (var v = 0; v < 4; v++) h[d][v] = 0;
        }
        for (var p, m, _, g, x, b, y, T = 0, w = new Array(c * f * 4), E = 0, S = 0; S < f; S++) {
            if (!(l = Hn(h, r, l, c))) return null;
            for (var A = 0; A < c; A++) Un(h[A], w, E, t), T = Math.max(T, w[E], w[E + 1], w[E + 2], w[E + 3]), 
            E += 4;
        }
        T = Math.min(T, n);
        for (var M = E = 0; M < f; M++) for (var R = 0; R < c; R++) _ = T, y = void 0, g = (p = w)[m = E] / _, 
        x = p[m + 1] / _, b = p[m + 2] / _, y = Ye(Math.max(Math.max(g, x), Math.max(b, 1e-6)), 0, 1), 
        y = Math.ceil(255 * y) / 255, p[m] = Math.min(255, g / y * 255), p[m + 1] = Math.min(255, x / y * 255), 
        p[m + 2] = Math.min(255, b / y * 255), p[m + 3] = Math.min(255, 255 * y), E += 4;
        return {
            width: c,
            height: f,
            pixels: w,
            rgbmRange: T
        };
    }
    var jn, Vn = function(e) {
        function t() {
            return e.apply(this, arguments) || this;
        }
        o(t, e);
        var n = t.prototype;
        return n.onLoad = function(e) {
            var t = e.data, n = this.config;
            n.hdr ? (t = kn(t.data, 0, n.maxRange), this.rgbmRange = t.rgbmRange, n.data = t.pixels) : n.data = t, 
            n.width = n.width || t.width, n.height = n.height || t.height, this._updateREGL();
        }, n.createREGLTexture = function(e) {
            return e.texture(this.config);
        }, t;
    }(nt), Xn = function(e) {
        function t() {
            return e.apply(this, arguments) || this;
        }
        o(t, e);
        var n = t.prototype;
        return n.onLoad = function(e) {
            var t = this.config, n = this._createFaces(e);
            t.faces = n.map(function(e) {
                return e.data;
            }), this._updateREGL();
        }, n.createREGLTexture = function(e) {
            return e.cube(this.config);
        }, n._createFaces = function() {
            return [];
        }, t;
    }(nt), Wn = (o(Kn, jn = Ft), Kn);
    function Kn(e) {
        return jn.call(this, {
            aPosition: new (Ke(e = e || 0))([ -1, -1, e, 1, -1, e, -1, 1, e, 1, 1, e ]),
            aNormal: new Int8Array([ 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1 ])
        }, [ 0, 1, 3, 3, 2, 0 ]) || this;
    }
    var Yn = {
        vsm_shadow_vert: "\nuniform mat4 shadow_lightProjViewModelMatrix;\nvarying vec4 shadow_vLightSpacePos;\nvoid shadow_computeShadowPars(vec4 position) {\n    shadow_vLightSpacePos = shadow_lightProjViewModelMatrix * position;\n}",
        vsm_shadow_frag: "\nuniform sampler2D shadow_shadowMap;\nuniform float shadow_opacity;\nuniform vec3 shadow_color;\n#if defined(USE_ESM)\n    uniform float esm_shadow_threshold;\n#endif\nvarying vec4 shadow_vLightSpacePos;\n#ifdef PACK_FLOAT\n    #include <common_pack_float>\n#endif\n#if defined(USE_ESM)\nfloat esm(vec3 projCoords, vec4 shadowTexel) {\n    float compare = projCoords.z;\n    float c = 120.0;\n    #ifdef PACK_FLOAT\n        float depth = common_decodeDepth(shadowTexel);\n        if (depth >= 1.0 - 1E-6 || compare <= depth) {\n            return 1.0;\n        }\n    #else\n        float depth = shadowTexel.r;\n    #endif\n    depth = exp(-c * min(compare - depth, 0.05));\n    return clamp(depth, esm_shadow_threshold, 1.0);\n}\n#endif\n#if defined(USE_VSM)\nfloat vsm_shadow_chebyshevUpperBound(vec3 projCoords, vec4 shadowTexel){\n    vec2 moments = shadowTexel.rg;\n    float distance = projCoords.z;\n    if (distance >= 1.0 || distance <= moments.x)\n        return 1.0 ;\n    float variance = moments.y - (moments.x * moments.x);\n    variance = max(variance, 0.00002);\n    float d = distance - moments.x;\n    float p_max = variance / (variance + d * d);\n    return p_max;\n}\n#endif\nfloat shadow_computeShadow_coeff(sampler2D shadowMap, vec3 projCoords) {\n    vec2 uv = projCoords.xy;\n    vec4 shadowTexel = texture2D(shadowMap, uv);\n    #if defined(USE_ESM)\n        float esm_coeff = esm(projCoords, shadowTexel);\n        float coeff = esm_coeff * esm_coeff;\n    #endif\n    #if defined(USE_VSM)\n        float vsm_coeff = vsm_shadow_chebyshevUpperBound(projCoords, shadowTexel);\n        float coeff = vsm_coeff;\n    #endif\n    return 1.0 - (1.0 - coeff) * shadow_opacity;\n}\nfloat shadow_computeShadow() {\n    vec3 projCoords = shadow_vLightSpacePos.xyz / shadow_vLightSpacePos.w;\n    projCoords = projCoords * 0.5 + 0.5;\n    if(projCoords.z >= 1.0 || projCoords.x < 0.0 || projCoords.x > 1.0 || projCoords.y < 0.0 || projCoords.y > 1.0) return 1.0;\n    return shadow_computeShadow_coeff(shadow_shadowMap, projCoords);\n}\nvec3 shadow_blend(vec3 color, float coeff) {\n    color = color * coeff + shadow_color * shadow_opacity * (1.0 - coeff);\n    return color;\n}",
        fbo_picking_vert: "\n#ifdef ENABLE_PICKING\n#if HAS_PICKING_ID == 1\nattribute float aPickingId;\n#elif HAS_PICKING_ID == 2\nuniform float uPickingId;\n#endif\nvarying float vPickingId;\nvarying float vFbo_picking_viewZ;\nvarying float vFbo_picking_visible;\n#endif\nvoid fbo_picking_setData(float viewPosZ, bool visible) {\n    #ifdef ENABLE_PICKING\n    #if HAS_PICKING_ID == 1\n       vPickingId = aPickingId;\n    #elif HAS_PICKING_ID == 2\n        vPickingId = uPickingId;\n    #endif\n        vFbo_picking_viewZ = viewPosZ;\n    #endif\n    vFbo_picking_visible = visible ? 1.0 : 0.0;\n}",
        common_pack_float: "const float COMMON_FLOAT_MAX =  1.70141184e38;\nconst float COMMON_FLOAT_MIN = 1.17549435e-38;\nfloat common_packFloat(vec4 val){\n    vec4 scl = floor(255.0 * val + 0.5);\n    float sgn = (scl.a < 128.0) ? 1.0 : -1.0;\n    float exn = mod(scl.a * 2.0, 256.0) + floor(scl.b / 128.0) - 127.0;\n    float man = 1.0 +\n        (scl.r / 8388608.0) +\n        (scl.g / 32768.0) +\n        mod(scl.b, 128.0) / 128.0;\n    return sgn * man * pow(2.0, exn);\n}\nvec4 common_unpackFloat(highp float v) {\n    highp float av = abs(v);\n    if(av < COMMON_FLOAT_MIN) {\n        return vec4(0.0, 0.0, 0.0, 0.0);\n    } else if(v > COMMON_FLOAT_MAX) {\n        return vec4(127.0, 128.0, 0.0, 0.0) / 255.0;\n    } else if(v < -COMMON_FLOAT_MAX) {\n        return vec4(255.0, 128.0, 0.0, 0.0) / 255.0;\n    }\n    highp vec4 c = vec4(0,0,0,0);\n    highp float e = floor(log2(av));\n    highp float m = av * pow(2.0, -e) - 1.0;\n    c[1] = floor(128.0 * m);\n    m -= c[1] / 128.0;\n    c[2] = floor(32768.0 * m);\n    m -= c[2] / 32768.0;\n    c[3] = floor(8388608.0 * m);\n    highp float ebias = e + 127.0;\n    c[0] = floor(ebias / 2.0);\n    ebias -= c[0] * 2.0;\n    c[1] += floor(ebias) * 128.0;\n    c[0] += 128.0 * step(0.0, -v);\n    return c / 255.0;\n}\nvec4 common_encodeDepth(const in float depth) {\n    float alpha = 1.0;\n    vec4 pack = vec4(0.0);\n    pack.a = alpha;\n    const vec3 code = vec3(1.0, 255.0, 65025.0);\n    pack.rgb = vec3(code * depth);\n    pack.gb = fract(pack.gb);\n    pack.rg -= pack.gb * (1.0 / 256.0);\n    pack.b -= mod(pack.b, 4.0 / 255.0);\n    return pack;\n}\nfloat common_decodeDepth(const in vec4 pack) {\n    return pack.r + pack.g / 255.0;\n}",
        invert_matrix: "mat4 invert_matrix(mat4 matrix) {\n    vec4 vector1 = matrix[0], vector2 = matrix[1], vector3 = matrix[2], vector4 = matrix[3];\n    float a00 = vector1.x, a01 = vector1.y, a02 = vector1.z, a03 = vector1.w;\n    float a10 = vector2.x, a11 = vector2.y, a12 = vector2.z, a13 = vector2.w;\n    float a20 = vector3.x, a21 = vector3.y, a22 = vector3.z, a23 = vector3.w;\n    float a30 = vector4.x, a31 = vector4.y, a32 = vector4.z, a33 = vector4.w;\n    float b00 = a00 * a11 - a01 * a10;\n    float b01 = a00 * a12 - a02 * a10;\n    float b02 = a00 * a13 - a03 * a10;\n    float b03 = a01 * a12 - a02 * a11;\n    float b04 = a01 * a13 - a03 * a11;\n    float b05 = a02 * a13 - a03 * a12;\n    float b06 = a20 * a31 - a21 * a30;\n    float b07 = a20 * a32 - a22 * a30;\n    float b08 = a20 * a33 - a23 * a30;\n    float b09 = a21 * a32 - a22 * a31;\n    float b10 = a21 * a33 - a23 * a31;\n    float b11 = a22 * a33 - a23 * a32;\n    float det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n    det = 1.0 / det;\n    mat4 m = mat4(\n        (a11 * b11 - a12 * b10 + a13 * b09) * det,\n        (a02 * b10 - a01 * b11 - a03 * b09) * det,\n        (a31 * b05 - a32 * b04 + a33 * b03) * det,\n        (a22 * b04 - a21 * b05 - a23 * b03) * det,\n        (a12 * b08 - a10 * b11 - a13 * b07) * det,\n        (a00 * b11 - a02 * b08 + a03 * b07) * det,\n        (a32 * b02 - a30 * b05 - a33 * b01) * det,\n        (a20 * b05 - a22 * b02 + a23 * b01) * det,\n        (a10 * b10 - a11 * b08 + a13 * b06) * det,\n        (a01 * b08 - a00 * b10 - a03 * b06) * det,\n        (a30 * b04 - a31 * b02 + a33 * b00) * det,\n        (a21 * b02 - a20 * b04 - a23 * b00) * det,\n        (a11 * b07 - a10 * b09 - a12 * b06) * det,\n        (a00 * b09 - a01 * b07 + a02 * b06) * det,\n        (a31 * b01 - a30 * b03 - a32 * b00) * det,\n        (a20 * b03 - a21 * b01 + a22 * b00) * det\n    );\n    return m;\n}\nmat4 transpose_matrix(mat4 matrix) {\n    vec4 vector1 = matrix[0], vector2 = matrix[1], vector3 = matrix[2], vector4 = matrix[3];\n    float a01 = vector1.y, a02 = vector1.z, a03 = vector1.w;\n    float a12 = vector2.z, a13 = vector2.w;\n    float a23 = vector3.w;\n    mat4 m = mat4(\n        vector1.x,\n        vector2.x,\n        vector3.x,\n        vector4.x,\n        a01,\n        vector2.y,\n        vector3.y,\n        vector4.y,\n        a02,\n        a12,\n        vector3.z,\n        vector4.z,\n        a03,\n        a13,\n        a23,\n        vector4.w\n    );\n    return m;\n}",
        get_output: "#include <invert_matrix>\n#ifdef HAS_INSTANCE\n    #include <instance_vert>\n    #ifdef HAS_INSTANCE_COLOR\n        varying vec4 vInstanceColor;\n    #endif\n#endif\n#ifdef HAS_SKIN\n    uniform int skinAnimation;\n    #include <skin_vert>\n#endif\n#ifdef HAS_MORPH\n    attribute vec3 POSITION_0;\n    attribute vec3 POSITION_1;\n    attribute vec3 POSITION_2;\n    attribute vec3 POSITION_3;\n    #ifdef HAS_MORPHNORMALS\n        attribute vec3 NORMAL_0;\n        attribute vec3 NORMAL_1;\n        attribute vec3 NORMAL_2;\n        attribute vec3 NORMAL_3;\n    #endif\n    uniform vec4 morphWeights;\n#endif\nmat4 getPositionMatrix() {\n    mat4 worldMatrix;\n    #ifdef HAS_INSTANCE\n        #ifdef HAS_INSTANCE_COLOR\n            vInstanceColor = instance_getInstanceColor();\n        #endif\n        mat4 attributeMatrix = instance_getAttributeMatrix();\n        #ifdef HAS_SKIN\n            if (skinAnimation == 1) {\n                worldMatrix = attributeMatrix * positionMatrix * skin_getSkinMatrix();\n            } else {\n                worldMatrix = attributeMatrix * positionMatrix;\n            }\n        #else\n            worldMatrix = attributeMatrix * positionMatrix;\n        #endif\n    #else\n        #ifdef HAS_SKIN\n            if (skinAnimation == 1) {\n                worldMatrix = skin_getSkinMatrix() * positionMatrix;\n            } else {\n                worldMatrix = positionMatrix;\n            }\n        #else\n            worldMatrix = positionMatrix;\n        #endif\n    #endif\n    return worldMatrix;\n}\nvec4 getPosition(vec3 position) {\n    #ifdef HAS_MORPH\n        vec4 POSITION = vec4(position + morphWeights.x * POSITION_0 + morphWeights.y * POSITION_1 + morphWeights.z * POSITION_2 + morphWeights.w * POSITION_3, 1.0);\n   #else\n        vec4 POSITION = vec4(position, 1.0);\n    #endif\n    return POSITION;\n}\nmat4 getNormalMatrix(mat4 worldMatrix) {\n    mat4 inverseMat = invert_matrix(worldMatrix);\n    mat4 normalMat = transpose_matrix(inverseMat);\n    return normalMat;\n}\nvec4 getNormal(vec3 NORMAL) {\n    #ifdef HAS_MORPHNORMALS\n        vec4 normal = vec4(NORMAL + morphWeights.x * NORMAL_0 + morphWeights.y * NORMAL_1 + morphWeights.z * NORMAL_2 + morphWeights.w * NORMAL_3, 1.0);\n    #else\n        vec4 normal = vec4(NORMAL, 1.0);\n    #endif\n    return normal;\n}",
        instance_vert: "attribute vec4 instance_vectorA;\nattribute vec4 instance_vectorB;\nattribute vec4 instance_vectorC;\nattribute vec4 instance_vectorD;\nattribute vec4 instance_color;\nmat4 instance_getAttributeMatrix() {\n    mat4 mat = mat4(\n        instance_vectorA,\n        instance_vectorB,\n        instance_vectorC,\n        instance_vectorD\n    );\n    return mat;\n}\nvec4 instance_getInstanceColor() {\n    return instance_color;\n}",
        skin_vert: "attribute vec4 WEIGHTS_0;\nattribute vec4 JOINTS_0;\nuniform sampler2D jointTexture;\nuniform vec2 jointTextureSize;\nuniform float numJoints;\n#define ROW0_U ((0.5 + 0.0) / 4.)\n#define ROW1_U ((0.5 + 1.0) / 4.)\n#define ROW2_U ((0.5 + 2.0) / 4.)\n#define ROW3_U ((0.5 + 3.0) / 4.)\nmat4 skin_getBoneMatrix(float jointNdx) {\n    float v = (jointNdx + 0.5) / numJoints;\n    return mat4(\n        texture2D(jointTexture, vec2(ROW0_U, v)),\n        texture2D(jointTexture, vec2(ROW1_U, v)),\n        texture2D(jointTexture, vec2(ROW2_U, v)),\n        texture2D(jointTexture, vec2(ROW3_U, v)));\n}\nmat4 skin_getSkinMatrix() {\n        mat4 skinMatrix = skin_getBoneMatrix(JOINTS_0[0]) * WEIGHTS_0[0] +\n                        skin_getBoneMatrix(JOINTS_0[1]) * WEIGHTS_0[1] +\n                        skin_getBoneMatrix(JOINTS_0[2]) * WEIGHTS_0[2] +\n                        skin_getBoneMatrix(JOINTS_0[3]) * WEIGHTS_0[3];\n        return skinMatrix;\n}",
        viewshed_frag: "#ifdef HAS_VIEWSHED\n    uniform sampler2D viewshed_depthMapFromViewpoint;\n    uniform vec4 viewshed_visibleColor;\n    uniform vec4 viewshed_invisibleColor;\n    varying vec4 viewshed_positionFromViewpoint;\nfloat viewshed_unpack(const in vec4 rgbaDepth) {\n    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));\n    float depth = dot(rgbaDepth, bitShift);\n    return depth;\n}\nvec4 viewshed_draw(vec4 color) {\n    vec3 shadowCoord = (viewshed_positionFromViewpoint.xyz / viewshed_positionFromViewpoint.w)/2.0 + 0.5;\n    vec4 rgbaDepth = texture2D(viewshed_depthMapFromViewpoint, shadowCoord.xy);\n    float depth = viewshed_unpack(rgbaDepth);    if (shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0 && shadowCoord.z <= 1.0) {\n        if (shadowCoord.z <= depth + 0.002) {\n            color = viewshed_visibleColor;\n        } else {\n            color = viewshed_invisibleColor;\n        }\n    }\n    return color;\n}\n#endif",
        viewshed_vert: "#ifdef HAS_VIEWSHED\n        uniform mat4 viewshed_projViewMatrixFromViewpoint;\n        varying vec4 viewshed_positionFromViewpoint;\n        void viewshed_getPositionFromViewpoint(vec4 scenePosition) {\n            viewshed_positionFromViewpoint = viewshed_projViewMatrixFromViewpoint * scenePosition;\n        }\n    #endif",
        flood_frag: "#ifdef HAS_FLOODANALYSE\n    varying float flood_height;\n    uniform float flood_waterHeight;\n    uniform vec3 flood_waterColor;\n    vec4 draw_floodAnalyse(vec4 color) {\n        if (flood_height < flood_waterHeight) {\n           color = vec4(mix(flood_waterColor, color.rgb, 0.6), color.a);\n        }\n        return color;\n    }\n#endif",
        flood_vert: "#ifdef HAS_FLOODANALYSE\n    varying float flood_height;\n    void flood_getHeight(vec4 worldPosition) {\n        flood_height = worldPosition.z;\n    }\n#endif",
        heatmap_render_vert: "#ifdef HAS_HEATMAP\nvarying vec2 heatmap_vTexCoord;\nvoid heatmap_compute(mat4 matrix, vec3 position) {\n    vec4 pos = matrix * vec4(position.xy, 0., 1.);\n    heatmap_vTexCoord = (1. + pos.xy / pos.w) / 2.;\n}\n#endif",
        heatmap_render_frag: "#ifdef HAS_HEATMAP\nuniform sampler2D heatmap_inputTexture;\nuniform sampler2D heatmap_colorRamp;\nuniform float heatmap_heatmapOpacity;\nvarying vec2 heatmap_vTexCoord;\nvec4 heatmap_getColor(vec4 color) {\n    float t = texture2D(heatmap_inputTexture, heatmap_vTexCoord).r;\n    vec4 heatmapColor = texture2D(heatmap_colorRamp, vec2(t, 0.5)) * heatmap_heatmapOpacity;\n    return color * (1.0 - heatmapColor.a) + heatmapColor * heatmapColor.a;\n}\n#endif",
        line_extrusion_vert: "#ifdef IS_LINE_EXTRUSION\n    #define EXTRUDE_SCALE 63.0;\n    attribute vec2 aExtrude;\n    #ifdef HAS_LINE_WIDTH\n        attribute float aLineWidth;\n    #else\n        uniform float lineWidth;\n    #endif\n    #ifdef HAS_LINE_HEIGHT\n        attribute float aLineHeight;\n    #else\n        uniform float lineHeight;\n    #endif\n    uniform float linePixelScale;\n    vec3 getLineExtrudePosition(vec3 position) {\n        #ifdef HAS_LINE_WIDTH\n            float lineWidth = aLineWidth / 2.0;\n        #endif\n        #ifdef HAS_LINE_HEIGHT\n            float lineHeight = aLineHeight;\n        #endif\n        float halfwidth = lineWidth / 2.0;\n        float outset = halfwidth;\n        vec2 dist = outset * aExtrude / EXTRUDE_SCALE;\n        position.z *= lineHeight;\n        return position + vec3(dist, 0.0) * linePixelScale;\n    }\n#endif",
        fog_render_vert: "#ifdef HAS_FOG\n    varying float vFog_Dist;\n    void fog_getDist(vec4 worldPosition) {\n        vFog_Dist = worldPosition.y;\n    }\n#endif",
        fog_render_frag: "#ifdef HAS_FOG\n    varying float vFog_Dist;\n    uniform vec2 fog_Dist;\n    uniform vec3 fog_Color;\n    vec4 draw_fog(vec4 color) {\n        float fogFactor = clamp((vFog_Dist - fog_Dist.x) / (fog_Dist.y - fog_Dist.x), 0.0, 1.0);\n        vec3 color = mix(fog_Color, gl_FragColor.rgb, fogFactor);\n        color = vec4(color, gl_FragColor.a);\n        return color;\n    }\n#endif",
        gl2_vert: "#if __VERSION__ == 300\n    #define texture2D(tex, uv) texture(tex, uv)\n    #define varying out\n    #define attribute in\n#endif",
        gl2_frag: "#if __VERSION__ == 300\n    #define texture2D(tex, uv) texture(tex, uv)\n    #define varying in\n    out vec4 glFragColor;\n#else\n    vec4 glFragColor;\n#endif"
    }, Qn = function(e) {
        return $n(e);
    }, Jn = /^[ \t]*#include +<([\w\d.]+)>/gm;
    function $n(e) {
        return e.replace(Jn, er);
    }
    function er(e, t) {
        var n = Yn[t];
        if (!n) throw new Error("Can not resolve #include <" + t + ">");
        return $n(n);
    }
    var tr, nr = "function", rr = "array", ir = ((tr = ar.prototype).setFramebuffer = function(e) {
        return this.context.framebuffer = e, this;
    }, tr.appendRenderUniforms = function(e) {
        var t = this.context, n = ke(e, t), r = n, i = this.contextDesc;
        for (var a in i) if (i[a] && "array" === i[a].type) {
            var o = a, s = i[a].length, u = t[a];
            if (i[a].fn && (u = i[a].fn(t, n)), !u) continue;
            if (u.length !== s) throw new Error(o + " uniform's length is not " + s);
            r[o] = r[o] || {};
            for (var f = 0; f < s; f++) r[o]["" + f] = u[f];
        }
        return r;
    }, tr.setUniforms = function(e) {
        return this.context = e, this;
    }, tr.getVersion = function(e, t) {
        return "#version" === t.substring(0, 8) ? "" : 0 === e.limits.version.indexOf("WebGL 2.0") && 300 === this.version ? "#version 300 es\n" : "#version 100\n";
    }, tr.createREGLCommand = function(t, e, n, r, i, a) {
        r = r || [], n = n || [];
        var o = ke({}, this.shaderDefines || {}, e || {}), s = this._insertDefines(this.vert, o), u = this.getVersion(t, s) + s, f = this._insertDefines(this.frag, o), c = this.getVersion(t, f) + f, l = {};
        n.forEach(function(e) {
            l[e] = t.prop(e);
        });
        var h = {};
        r.forEach(function(e) {
            h[e] = t.prop(e);
        });
        var d = this.contextDesc;
        for (var v in d) if (d[v] && d[v].type === nr) h[v] = d[v].fn; else if (d[v] && d[v].type === rr) for (var p = d[v].name, m = d[v].length, _ = 0; _ < m; _++) {
            var g = p + "[" + _ + "]";
            h[g] = t.prop(g);
        } else h[v] = t.prop(v);
        var x = {
            vert: u,
            frag: c,
            uniforms: h,
            attributes: l
        };
        return i && !Ve(i) && (x.elements = t.prop("elements")), x.count = t.prop("count"), 
        x.offset = t.prop("offset"), x.primitive = t.prop("primitive"), x.framebuffer = t.prop("framebuffer"), 
        a && (x.instances = t.prop("instances")), ke(x, this.extraCommandProps), t(x);
    }, tr.dispose = function() {
        for (var e in this.commands) this.commands[e].destroy && this.commands[e].destroy();
        this.commands = {}, delete this.vert, delete this.frag;
    }, tr._insertDefines = function(e, t) {
        var n = [];
        for (var r in t) t.hasOwnProperty(r) && !Ge(t[r]) && n.push("#define " + r + " " + t[r] + "\n");
        return n.join("") + e;
    }, tr._compileSource = function() {
        this.vert = Qn(this.vert), this.frag = Qn(this.frag);
    }, ar);
    function ar(e) {
        var t = e.vert, n = e.frag, r = e.uniforms, i = e.defines, a = e.extraCommandProps;
        this.vert = t, this.frag = n, this.shaderDefines = i && ke({}, i) || {}, r = this.uniforms = r || [], 
        this.contextDesc = {};
        for (var o = 0, s = r.length; o < s; o++) {
            var u = r[o];
            if (Ze(u)) if (0 < u.indexOf("[")) {
                var f = or(u), c = f.name, l = f.len;
                this.contextDesc[c] = {
                    name: c,
                    type: "array",
                    length: l
                };
            } else this.contextDesc[u] = null; else if (0 < u.name.indexOf("[")) {
                var h = or(u.name), d = h.name, v = h.len;
                this.contextDesc[d] = {
                    name: d,
                    type: "array",
                    length: v,
                    fn: u.fn
                };
            } else this.contextDesc[u.name] = u;
        }
        this.extraCommandProps = a && ke({}, a) || {}, this.commands = {}, this._compileSource();
    }
    function or(e) {
        var t = e.indexOf("["), n = e.indexOf("]");
        return {
            name: e.substring(0, t),
            len: +e.substring(t + 1, n)
        };
    }
    var sr, ur = function(e) {
        function t() {
            return e.apply(this, arguments) || this;
        }
        o(t, e);
        var n = t.prototype;
        return n.draw = function(e, t) {
            if (!t || !t.length) return this;
            for (var n, r = [], i = 0, a = t.length; i < a; i++) if (t[i].isValid()) if (t[i].geometry.getDrawCount() && this._runFilter(t[i])) {
                var o = this.getMeshCommand(e, t[i]);
                r.length && n !== o && (n(r), r.length = 0);
                var s = t[i].getREGLProps(e);
                this.appendRenderUniforms(s), r.push(s), i < a - 1 ? n = o : i === a - 1 && o(r);
            } else i === a - 1 && n && r.length && n(r); else i === a - 1 && n && r.length && n(r);
            return this;
        }, n._runFilter = function(e) {
            var t = this.filter;
            if (!t) return !0;
            if (Array.isArray(t)) {
                for (var n = 0; n < t.length; n++) if (!t[n](e)) return !1;
                return !0;
            }
            return t(e);
        }, n.getMeshCommand = function(e, t) {
            var n = t.getDefinesKey(), r = t.getDefines();
            n += "_" + (Ve(t.getElements()) ? "count" : "elements"), t instanceof bn && (n += "_instanced");
            var i = this.commands[n];
            if (!i) {
                var a = Object.keys(t.getUniforms(e));
                i = this.commands[n] = this.createREGLCommand(e, r, t.getAttributes(), a, t.getElements(), t instanceof bn);
            }
            return i;
        }, t;
    }(ir), fr = (o(cr, sr = ur), cr);
    function cr(e) {
        void 0 === e && (e = {});
        var t = e.extraCommandProps || {};
        return t = ke({}, t, {
            blend: {
                enable: !0,
                func: {
                    src: "src alpha",
                    dst: "one minus src alpha"
                },
                equation: "add"
            },
            sample: {
                alpha: !0
            }
        }), sr.call(this, {
            vert: "attribute vec3 aPosition;\nattribute vec3 aBarycentric;\nvarying vec3 vBarycentric;\nuniform mat4 modelMatrix;\nuniform mat4 projViewMatrix;\nuniform mat4 projViewModelMatrix;\nuniform mat4 positionMatrix;\n#include <get_output>\n#include <viewshed_vert>\n#include <flood_vert>\n#include <fog_render_vert>\nvoid main() {\n  mat4 pn = getPositionMatrix();\n  vec4 pm = getPosition(aPosition);\n  gl_Position = projViewMatrix * modelMatrix * pn * pm;\n  vBarycentric = aBarycentric;\n#ifdef HAS_VIEWSHED\nviewshed_getPositionFromViewpoint(modelMatrix * pn * pm);\n#endif\n#ifdef HAS_FLOODANALYSE\nflood_getHeight(modelMatrix * pn * pm);\n#endif\n#ifdef HAS_FOG\nfog_getDist(modelMatrix * pn * pm);\n#endif\n}",
            frag: "precision mediump float;\n#include <gl2_frag>\nvarying vec3 vBarycentric;\nuniform float time;\nuniform float thickness;\nuniform float secondThickness;\nuniform float dashRepeats;\nuniform float dashLength;\nuniform bool dashOverlap;\nuniform bool dashEnabled;\nuniform bool dashAnimate;\nuniform bool seeThrough;\nuniform bool insideAltColor;\nuniform bool dualStroke;\nuniform bool squeeze;\nuniform float squeezeMin;\nuniform float squeezeMax;\nuniform vec4 stroke;\nuniform vec4 fill;\nuniform float opacity;\n#ifdef HAS_INSTANCE\nvarying vec4 vInstanceColor;\n#endif\n#extension GL_OES_standard_derivatives : enable\n#include <viewshed_frag>\n#include <flood_frag>\n#include <fog_render_frag>\nconst float nx = 3.14159265;\nfloat ps(float pt, float pu) {\n  float pv = fwidth(pu) * .5;\n  return smoothstep(pt - pv, pt + pv, pu);\n}\nvec4 pw(vec3 px) {\n  float py = min(min(px.x, px.y), px.z);\n  float pz = max(px.x, px.y);\n  if(px.y < px.x && px.y < px.z) {\n    pz = 1. - pz;\n  }\n  float pA = thickness;\n  if(squeeze) {\n    pA *= mix(squeezeMin, squeezeMax, (1. - sin(pz * nx)));\n  }\n  if(dashEnabled) {\n    float pB = 1. / dashRepeats * dashLength / 2.;\n    if(!dashOverlap) {\n      pB += 1. / dashRepeats / 2.;\n    }\n    if(dashAnimate) {\n      pB += time * .22;\n    }\n    float pC = fract((pz + pB) * dashRepeats);\n    pA *= 1. - ps(dashLength, pC);\n  }\n  float pD = 1. - ps(pA, py);\n#ifdef HAS_INSTANCE\nvec4 pE = vInstanceColor;\n#else\nvec4 pE = stroke;\n#endif\nvec4 pF = vec4(.0);\n  if(seeThrough) {\n    pF = vec4(pE.xyz, pD);\n    if(insideAltColor && !gl_FrontFacing) {\n      pF.rgb = fill.xyz;\n    }\n  } else {\n    vec3 pG = mix(fill.xyz, pE.xyz, pD);\n    pF.a = fill.a;\n    if(dualStroke) {\n      float pH = 1. - ps(secondThickness, py);\n      vec3 pI = mix(fill.xyz, stroke.xyz, abs(pH - pD));\n      pF.rgb = pI;\n    } else {\n      pF.rgb = pG;\n    }\n  }\n  return pF;\n}\nvoid main() {\n  glFragColor = pw(vBarycentric) * opacity;\n#ifdef HAS_VIEWSHED\nglFragColor = viewshed_draw(glFragColor);\n#endif\n#ifdef HAS_FLOODANALYSE\nglFragColor = draw_floodAnalyse(glFragColor);\n#endif\n#ifdef HAS_FOG\nglFragColor = draw_fog(glFragColor);\n#endif\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}",
            uniforms: [ "time", "fill", "stroke", "dualStroke", "seeThrough", "insideAltColor", "thickness", "secondThickness", "dashEnabled", "dashRepeats", "dashOverlap", "dashLength", "dashAnimate", "squeeze", "squeezeMin", "squeezeMax", "opacity", "projViewMatrix", {
                name: "projViewModelMatrix",
                type: "function",
                fn: function(e, t) {
                    return W([], t.projViewMatrix, t.modelMatrix);
                }
            }, "viewshed_depthMapFromViewpoint", "viewshed_projViewMatrixFromViewpoint", "viewshed_visibleColor", "viewshed_invisibleColor", "flood_waterHeight", "flood_waterColor", "fog_Dist", "fog_Color" ],
            extraCommandProps: t
        }) || this;
    }
    var lr, hr = "precision mediump float;\n#include <gl2_frag>\nuniform vec4 baseColorFactor;\nuniform float materialShininess;\nuniform float opacity;\nuniform float ambientStrength;\nuniform float specularStrength;\nuniform vec3 lightDirection;\nuniform vec3 lightAmbient;\nuniform vec3 lightDiffuse;\nuniform vec3 lightSpecular;\nuniform vec3 cameraPosition;\n#ifdef HAS_TOON\nuniform float toons;\nuniform float specularToons;\n#endif\n#ifdef HAS_TANGENT\nvarying vec4 vTangent;\n#endif\n#ifdef HAS_MAP\nvarying vec2 vTexCoord;\n#endif\nvarying vec3 vNormal;\nvarying vec3 vFragPos;\n#ifdef HAS_INSTANCE_COLOR\nvarying vec4 vInstanceColor;\n#endif\n#ifdef HAS_BASECOLOR_MAP\nuniform sampler2D baseColorTexture;\n#endif\n#ifdef HAS_EXTRUSION_OPACITY\nuniform vec2 extrusionOpacityRange;\nvarying float vExtrusionOpacity;\n#endif\n#if defined(HAS_COLOR)\nvarying vec4 vColor;\n#elif defined(IS_LINE_EXTRUSION)\nuniform vec4 lineColor;\n#else\nuniform vec4 polygonFill;\n#endif\n#ifdef IS_LINE_EXTRUSION\nuniform float lineOpacity;\n#else\nuniform float polygonOpacity;\n#endif\n#ifdef HAS_OCCLUSION_MAP\nuniform sampler2D occlusionTexture;\n#endif\n#ifdef HAS_NORMAL_MAP\nuniform sampler2D normalTexture;\n#endif\n#ifdef HAS_EMISSIVE_MAP\nuniform sampler2D emissiveTexture;\n#endif\n#ifdef SHADING_MODEL_SPECULAR_GLOSSINESS\nuniform vec4 diffuseFactor;\nuniform vec3 specularFactor;\n#ifdef HAS_DIFFUSE_MAP\nuniform sampler2D diffuseTexture;\n#endif\n#ifdef HAS_SPECULARGLOSSINESS_MAP\nuniform sampler2D specularGlossinessTexture;\n#endif\n#endif\n#include <viewshed_frag>\n#include <flood_frag>\n#include <heatmap_render_frag>\n#include <fog_render_frag>\nvec3 oO() {\n  \n#if defined(HAS_NORMAL_MAP)\nvec3 om = normalize(vNormal);\n  vec3 oP = texture2D(normalTexture, vTexCoord).xyz * 2. - 1.;\n#if defined(HAS_TANGENT)\nvec3 t = normalize(vTangent.xyz);\n  vec3 b = normalize(cross(om, t) * sign(vTangent.w));\n  mat3 oQ = mat3(t, b, om);\n  return normalize(oQ * oP);\n#else\nreturn normalize(oP);\n#endif\n#else\nreturn normalize(vNormal);\n#endif\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nvec4 oS() {\n  \n#if defined(HAS_BASECOLOR_MAP)\nreturn texture2D(baseColorTexture, vTexCoord);\n#elif defined(HAS_DIFFUSE_MAP)\nreturn texture2D(diffuseTexture, vTexCoord);\n#elif defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nreturn diffuseFactor;\n#else\nreturn baseColorFactor;\n#endif\n}\nvec3 oT() {\n  \n#if defined(HAS_SPECULARGLOSSINESS_MAP)\nreturn texture2D(specularGlossinessTexture, vTexCoord).rgb;\n#elif defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nreturn specularFactor;\n#else\nreturn vec3(1.);\n#endif\n}\nvoid main() {\n  vec4 oU = oS();\n  vec3 oV = ambientStrength * lightAmbient * oU.rgb;\n#ifdef HAS_INSTANCE_COLOR\noV *= vInstanceColor.rgb;\n#endif\nvec3 oW = oO();\n  vec3 oX = normalize(-lightDirection);\n  float oY = max(dot(oW, oX), .0);\n#ifdef HAS_TOON\nfloat oZ = floor(oY * toons);\n  oY = oZ / toons;\n#endif\nvec3 pa = lightDiffuse * oY * oU.rgb;\n#if defined(HAS_COLOR)\nvec3 nZ = vColor.rgb;\n#elif defined(IS_LINE_EXTRUSION)\nvec3 nZ = lineColor.rgb;\n#else\nvec3 nZ = polygonFill.rgb;\n#endif\noV *= nZ.rgb;\n  pa *= nZ.rgb;\n  vec3 pb = normalize(cameraPosition - vFragPos);\n  vec3 pc = normalize(oX + pb);\n  float pd = pow(max(dot(oW, pc), .0), materialShininess);\n#ifdef HAS_TOON\nfloat pe = floor(pd * specularToons);\n  pd = pe / specularToons;\n#endif\nvec3 oB = specularStrength * lightSpecular * pd * oT();\n#ifdef HAS_OCCLUSION_MAP\nfloat pf = texture2D(occlusionTexture, vTexCoord).r;\n  oV *= pf;\n#endif\nvec3 ng = oV + pa + oB;\n#ifdef HAS_EMISSIVE_MAP\nvec3 pg = texture2D(emissiveTexture, vTexCoord).rgb;\n  ng += pg;\n#endif\nglFragColor = vec4(ng, opacity);\n#if defined(HAS_COLOR)\nfloat ph = vColor.a;\n#elif defined(IS_LINE_EXTRUSION)\nfloat ph = lineColor.a;\n#else\nfloat ph = polygonFill.a;\n#endif\nglFragColor *= ph;\n#ifdef HAS_EXTRUSION_OPACITY\nfloat pi = extrusionOpacityRange.x;\n  float pj = extrusionOpacityRange.y;\n  float pk = pi + vExtrusionOpacity * (pj - pi);\n  pk = clamp(pk, .0, 1.);\n  glFragColor *= pk;\n#endif\n#ifdef HAS_HEATMAP\nglFragColor = heatmap_getColor(glFragColor);\n#endif\n#ifdef HAS_VIEWSHED\nglFragColor = viewshed_draw(glFragColor);\n#endif\n#ifdef HAS_FLOODANALYSE\nglFragColor = draw_floodAnalyse(glFragColor);\n#endif\n#ifdef HAS_FOG\nglFragColor = draw_fog(glFragColor);\n#endif\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}", dr = "attribute vec3 aPosition;\n#include <line_extrusion_vert>\n#ifdef HAS_MAP\nuniform vec2 uvScale;\nuniform vec2 uvOffset;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\n#endif\n#ifdef HAS_COLOR\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n#if defined(HAS_TANGENT)\nattribute vec4 aTangent;\n#else\nattribute vec3 aNormal;\n#endif\nvarying vec3 vFragPos;\nvarying vec3 vNormal;\nuniform mat4 projMatrix;\nuniform mat4 viewModelMatrix;\nuniform mat4 normalMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 positionMatrix;\nuniform vec2 halton;\nuniform vec2 globalTexSize;\nuniform mat4 projViewMatrix;\n#include <get_output>\n#include <viewshed_vert>\n#include <flood_vert>\n#include <heatmap_render_vert>\n#include <fog_render_vert>\n#ifdef HAS_FLOODANALYSE\nvarying float vHeight;\n#endif\n#ifdef HAS_EXTRUSION_OPACITY\nattribute float aExtrusionOpacity;\nvarying float vExtrusionOpacity;\n#endif\n#if defined(HAS_TANGENT)\nvarying vec4 vTangent;\n#endif\nvoid pl(const highp vec4 q, out highp vec3 om) {\n  om = vec3(.0, .0, 1.) + vec3(2., -2., -2.) * q.x * q.zwx + vec3(2., 2., -2.) * q.y * q.wzy;\n}\nvoid pl(const highp vec4 q, out highp vec3 om, out highp vec3 t) {\n  pl(q, om);\n  t = vec3(1., .0, .0) + vec3(-2., 2., -2.) * q.y * q.yxw + vec3(-2., 2., 2.) * q.z * q.zwx;\n}\nvoid main() {\n  \n#ifdef IS_LINE_EXTRUSION\nvec4 pm = getPosition(getLineExtrudePosition(aPosition));\n#else\nvec4 pm = getPosition(aPosition);\n#endif\nmat4 pn = getPositionMatrix();\n  mat4 po = getNormalMatrix(pn);\n  vFragPos = vec3(modelMatrix * pn * pm);\n  vec3 pp;\n#if defined(HAS_TANGENT)\nvec3 t;\n  pl(aTangent, pp, t);\n  vTangent = vec4(po * t, aTangent.w);\n#else\npp = aNormal;\n#endif\nvec4 pq = getNormal(pp);\n  vNormal = normalize(vec3(po * pq));\n  mat4 pr = projMatrix;\n  pr[2].xy += halton.xy / globalTexSize.xy;\n  gl_Position = pr * viewModelMatrix * pn * pm;\n#ifdef HAS_MAP\nvTexCoord = (aTexCoord + uvOffset) * uvScale;\n#endif\n#ifdef HAS_EXTRUSION_OPACITY\nvExtrusionOpacity = aExtrusionOpacity;\n#endif\n#ifdef HAS_COLOR\nvColor = aColor / 255.;\n#endif\n#ifdef HAS_VIEWSHED\nviewshed_getPositionFromViewpoint(modelMatrix * pn * pm);\n#endif\n#ifdef HAS_FLOODANALYSE\nflood_getHeight(modelMatrix * pn * pm);\n#endif\n#ifdef HAS_HEATMAP\nheatmap_compute(projMatrix * viewModelMatrix * pn, pm);\n#endif\n#ifdef HAS_FOG\nfog_getDist(modelMatrix * pn * pm);\n#endif\n}", vr = (o(pr, lr = ur), 
    pr);
    function pr(e) {
        return void 0 === e && (e = {}), lr.call(this, {
            vert: dr,
            frag: hr,
            uniforms: [ "halton", "globalTexSize", "cameraPosition", "lightAmbient", "lightDiffuse", "lightSpecular", "lightDirection", "ambientStrength", "specularStrength", "materialShininess", "projViewMatrix", "opacity", "baseColorTexture", "baseColorFactor", "bloom", "projMatrix", "viewMatrix", "positionMatrix", {
                name: "normalMatrix",
                type: "function",
                fn: function(e, t) {
                    var n = [];
                    return x(n, t.modelMatrix), h(n, n), n;
                }
            }, {
                name: "viewModelMatrix",
                type: "function",
                fn: function(e, t) {
                    return W([], t.viewMatrix, t.modelMatrix);
                }
            }, "diffuseFactor", "specularFactor", "glossinessFactor", "diffuseTexture", "specularGlossinessTexture", "viewshed_depthMapFromViewpoint", "viewshed_projViewMatrixFromViewpoint", "viewshed_visibleColor", "viewshed_invisibleColor", "flood_waterHeight", "flood_waterColor", "fog_Dist", "fog_Color", "lineColor", "lineOpacity", "polygonFill", "polygonOpacity" ],
            defines: e.defines || {},
            extraCommandProps: e.extraCommandProps || {}
        }) || this;
    }
    var mr, _r = (o(gr, mr = vr), gr);
    function gr(e) {
        return void 0 === e && (e = {}), mr.call(this, {
            vert: dr,
            frag: hr,
            uniforms: [ "toons", "specularToons" ],
            defines: e.defines || {},
            extraCommandProps: e.extraCommandProps || {}
        }) || this;
    }
    var xr, br = "#if __VERSION__ == 300\n#define attribute in\n#define varying out\n#endif\nattribute vec2 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = vec4(aPosition, 0., 1.);\n  vTexCoord = aTexCoord;\n}", yr = new Int8Array([ -1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, -1 ]), Tr = new Uint8Array([ 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0 ]), wr = function(t) {
        function e(e) {
            return e.vert = e.vert || br, e.extraCommandProps = e.extraCommandProps || {}, e.extraCommandProps.depth || (e.extraCommandProps.depth = {
                enable: !1,
                mask: !1
            }), e.extraCommandProps.stencil || (e.extraCommandProps.stencil = {
                enable: !1
            }), t.call(this, e) || this;
        }
        o(e, t);
        var n = e.prototype;
        return n.draw = function(e) {
            return this._quadMesh || this._createQuadMesh(e), t.prototype.draw.call(this, e, this._quadMesh);
        }, n.getMeshCommand = function(e) {
            return this.commands.quad || (this.commands.quad = this.createREGLCommand(e, null, this._quadMesh[0].getAttributes(), null, this._quadMesh[0].getElements())), 
            this.commands.quad;
        }, n._createQuadMesh = function(e) {
            var t = new Ft({
                aPosition: yr,
                aTexCoord: Tr
            }, null, yr.length / 2, {
                primitive: "triangles"
            });
            t.generateBuffers(e), this._quadMesh = [ new on(t) ];
        }, n.dispose = function() {
            if (this._quadMesh) {
                var e = this._quadMesh[0];
                e.geometry.dispose(), e.dispose();
            }
            return delete this._quadMesh, t.prototype.dispose.call(this);
        }, e;
    }(ur), Er = (o(Sr, xr = wr), Sr.prototype.getMeshCommand = function(e, t) {
        return this.commands.fxaa || (this.commands.fxaa = this.createREGLCommand(e, null, [ "aPosition", "aTexCoord" ], null, t.getElements())), 
        this.commands.fxaa;
    }, Sr);
    function Sr() {
        return xr.call(this, {
            vert: br,
            frag: "#define SHADER_NAME FXAA\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#define FXAA_SPAN_MAX     8.0\nprecision mediump float;\nvarying vec2 vTexCoord;\nuniform float enableFXAA;\nuniform float enableToneMapping;\nuniform float enableSharpen;\nuniform vec2 resolution;\nuniform sampler2D textureSource;\nuniform sampler2D noAaTextureSource;\nuniform float pixelRatio;\nuniform float sharpFactor;\nvec2 rb;\nvec2 rc;\nvec2 rd;\nvec4 re(vec2 pK, sampler2D qK) {\n  vec4 nZ;\n  mediump vec2 rf = vec2(1. / resolution.x, 1. / resolution.y);\n  vec3 rg = texture2D(qK, (pK + vec2(-1., -1.)) * rf).xyz;\n  vec3 rh = texture2D(qK, (pK + vec2(1., -1.)) * rf).xyz;\n  vec3 ri = texture2D(qK, (pK + vec2(-1., 1.)) * rf).xyz;\n  vec3 rj = texture2D(qK, (pK + vec2(1.)) * rf).xyz;\n  vec4 rk = texture2D(qK, pK * rf);\n  vec3 rl = rk.xyz;\n  vec3 rm = vec3(.299, .587, .114);\n  float rn = dot(rg, rm);\n  float ro = dot(rh, rm);\n  float rp = dot(ri, rm);\n  float rq = dot(rj, rm);\n  float rr = dot(rl, rm);\n  float rs = min(rr, min(min(rn, ro), min(rp, rq)));\n  float rt = max(rr, max(max(rn, ro), max(rp, rq)));\n  mediump vec2 qO;\n  qO.x = -((rn + ro) - (rp + rq));\n  qO.y = (rn + rp) - (ro + rq);\n  float ru = max((rn + ro + rp + rq) * (.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n  float rv = 1. / (min(abs(qO.x), abs(qO.y)) + ru);\n  qO = min(vec2(FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), qO * rv)) * rf;\n  vec4 rw = .5 * (texture2D(qK, pK * rf + qO * (1. / 3. - .5)) + texture2D(qK, pK * rf + qO * (2. / 3. - .5)));\n  vec4 rx = rw * .5 + .25 * (texture2D(qK, pK * rf + qO * -.5) + texture2D(qK, pK * rf + qO * .5));\n  float ry = dot(rx.xyz, rm);\n  if(ry < rs || ry > rt)\n    nZ = rw;\n  else\n    nZ = rx;\n  return nZ;\n}\nvec3 rz(const in vec3 nZ, const float rA) {\n  vec2 rB = pixelRatio / rc.xy;\n  float rC = .0;\n  vec4 rg = texture2D(textureSource, rb + rB * vec2(-1., -1.));\n  rg.rgb = mix(vec3(.0), rg.rgb, sign(rg.a));\n  rC += mix(.0, 1., sign(rg.a));\n  vec4 rj = texture2D(textureSource, rb + rB * vec2(1.));\n  rj.rgb = mix(vec3(.0), rj.rgb, sign(rj.a));\n  rC += mix(.0, 1., sign(rj.a));\n  vec4 rh = texture2D(textureSource, rb + rB * vec2(1., -1.));\n  rh.rgb = mix(vec3(.0), rh.rgb, sign(rh.a));\n  rC += mix(.0, 1., sign(rh.a));\n  vec4 ri = texture2D(textureSource, rb + rB * vec2(-1., 1.));\n  ri.rgb = mix(vec3(.0), ri.rgb, sign(ri.a));\n  rC += mix(.0, 1., sign(ri.a));\n  return nZ + rA * (rC * nZ - rg.rgb - rh.rgb - ri.rgb - rj.rgb);\n}\nvec4 rD(const in vec4 nZ) {\n  return vec4(rz(nZ.rgb, sharpFactor), nZ.a);\n}\nvec3 rE(const vec3 x) {\n  const float a = 2.51;\n  const float b = .03;\n  const float qk = 2.43;\n  const float py = .59;\n  const float rF = .14;\n  return (x * (a * x + b)) / (x * (qk * x + py) + rF);\n}\nvec3 rG(vec3 nZ) {\n  nZ = nZ / (nZ + vec3(1.));\n  return nZ = pow(nZ, vec3(1. / 2.2));\n}\nvoid main() {\n  rc = resolution;\n  rd = vec2(1.);\n  rb = vTexCoord;\n  vec4 nZ;\n  if(enableFXAA == 1.) {\n    nZ = re(rb * resolution, textureSource);\n  } else {\n    nZ = texture2D(textureSource, vTexCoord);\n  }\n  if(enableSharpen == 1.) {\n    nZ = rD(nZ);\n  }\n  vec4 rH = texture2D(noAaTextureSource, vTexCoord);\n  nZ = rH * rH.a + nZ * (1. - rH.a);\n  if(enableToneMapping == 1.) {\n    nZ.rgb = rG(nZ.rgb);\n  }\n  gl_FragColor = nZ;\n}",
            uniforms: [ "enableFXAA", "enableSSAO", "enableToneMapping", "textureSource", "noAaTextureSource", "resolution", "enableSharpen", "pixelRatio", "sharpFactor" ],
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: function(e, t) {
                        return t.resolution[0];
                    },
                    height: function(e, t) {
                        return t.resolution[1];
                    }
                }
            }
        }) || this;
    }
    var Ar, Mr = (o(Rr, Ar = wr), Rr.prototype.getMeshCommand = function(e, t) {
        return this.commands.box_color_blur || (this.commands.box_color_blur = this.createREGLCommand(e, null, [ "aPosition", "aTexCoord" ], null, t.getElements())), 
        this.commands.box_color_blur;
    }, Rr);
    function Rr(e) {
        var t = e.blurOffset;
        return Ar.call(this, {
            vert: br,
            frag: "precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D textureSource;\nuniform vec2 resolution;\nvoid main() {\n  vec4 qk = vec4(.0);\n  float nf = .0;\n  for(int x = -BOXBLUR_OFFSET; x <= BOXBLUR_OFFSET; ++x)\n    for(int y = -BOXBLUR_OFFSET; y <= BOXBLUR_OFFSET; ++y) {\n      vec2 mS = vTexCoord.st + vec2(float(x) / resolution.x, float(y) / resolution.y);\n      mS = clamp(mS, .0, 1.);\n      vec4 ql = texture2D(textureSource, mS);\n      float pQ = sign(ql.a);\n      nf += pQ * 1.;\n      qk += pQ * ql;\n    }\n  gl_FragColor = qk / max(nf, 1.);\n}",
            uniforms: [ "textureSource", "resolution" ],
            defines: {
                BOXBLUR_OFFSET: t || 2
            }
        }) || this;
    }
    var Or, Br = (o(Cr, Or = wr), Cr.prototype.getMeshCommand = function(e, t) {
        return this.commands.ssao_blur || (this.commands.ssao_blur = this.createREGLCommand(e, null, [ "aPosition", "aTexCoord" ], null, t.getElements())), 
        this.commands.ssao_blur;
    }, Cr);
    function Cr() {
        return Or.call(this, {
            vert: br,
            frag: "precision mediump float;\n#define SHADER_NAME SSAO_BLUR\nstruct MaterialParams {\n  float farPlaneOverEdgeDistance;\n  vec2 axis;\n  vec2 resolution;\n};\nuniform sampler2D materialParams_ssao;\nuniform sampler2D TextureInput;\nuniform MaterialParams materialParams;\nvarying vec2 vTexCoord;\nconst int sT = 4;\nfloat sU[8];\nvoid sV() {\n  sU[0] = .199471;\n  sU[1] = .176033;\n  sU[2] = .120985;\n  sU[3] = .064759;\n  sU[4] = .026995;\n  sU[5] = .008764;\n  sU[6] = .002216;\n  sU[7] = .000436;\n}\nfloat sW(vec2 qA) {\n  return (qA.x * (256. / 257.) + qA.y * (1. / 257.));\n}\nfloat sX(in float qA, in float sY) {\n  float oY = (sY - qA) * materialParams.farPlaneOverEdgeDistance;\n  return max(.0, 1. - oY * oY);\n}\nvoid tap(inout float sZ, inout float sB, float nf, float qA, vec2 ta) {\n  vec3 tb = texture2D(materialParams_ssao, ta).rgb;\n  float tc = sX(qA, sW(tb.gb));\n  tc *= nf;\n  sZ += tb.r * tc;\n  sB += tc;\n}\nvoid main() {\n  sV();\n  highp vec2 mS = vTexCoord;\n  vec3 tb = texture2D(materialParams_ssao, mS).rgb;\n  if(tb.g * tb.b == 1.) {\n    if(materialParams.axis.y > .0) {\n      vec4 nZ = texture2D(TextureInput, mS);\n      gl_FragColor = nZ;\n    } else {\n      gl_FragColor = vec4(tb, 1.);\n    }\n    return;\n  }\n  float qA = sW(tb.gb);\n  float sB = sU[0];\n  float sZ = tb.r * sB;\n  vec2 td = materialParams.axis / materialParams.resolution;\n  vec2 pB = td;\n  for(int ss = 1; ss < sT; ss++) {\n    float nf = sU[ss];\n    tap(sZ, sB, nf, qA, mS + pB);\n    tap(sZ, sB, nf, qA, mS - pB);\n    pB += td;\n  }\n  float te = sZ * (1. / sB);\n  vec2 gb = tb.gb;\n  if(materialParams.axis.y > .0) {\n    vec4 nZ = texture2D(TextureInput, mS);\n    gl_FragColor = vec4(nZ.rgb * te, nZ.a);\n  } else {\n    gl_FragColor = vec4(te, gb, 1.);\n  }\n}",
            uniforms: [ "materialParams_ssao", "materialParams.farPlaneOverEdgeDistance", "materialParams.axis", "materialParams.resolution", "TextureInput" ],
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: function(e, t) {
                        return t.materialParams.resolution[0];
                    },
                    height: function(e, t) {
                        return t.materialParams.resolution[1];
                    }
                }
            }
        }) || this;
    }
    var Fr, Ir = [ [ -2e-6, 0, 2e-6 ], [ -.095089, .004589, -.031253 ], [ .01518, -.025586, .003765 ], [ .073426, .021802, .002778 ], [ .094587, .043218, .089148 ], [ -.009509, .051369, .019673 ], [ .139973, -.101685, .10857 ], [ -.103804, .219853, -.043016 ], [ .004841, -.033988, .094187 ], [ .028011, .058466, -.25711 ], [ -.051031, .074993, .259843 ], [ .118822, -.186537, -.134192 ], [ .063949, -.094894, -.072683 ], [ .108176, .327108, -.254058 ], [ -.04718, .21918, .263895 ], [ -.407709, .240834, -.200352 ] ], Pr = (o(Dr, Fr = wr), 
    Dr.prototype.getMeshCommand = function(e, t) {
        return this.commands.ssao_extract || (this.commands.ssao_extract = this.createREGLCommand(e, null, [ "aPosition", "aTexCoord" ], null, t.getElements())), 
        this.commands.ssao_extract;
    }, Dr);
    function Dr() {
        var e;
        return (e = Fr.call(this, {
            vert: br,
            frag: "#if __VERSION__ == 100\n#if defined(GL_OES_standard_derivatives)\n#extension GL_OES_standard_derivatives : enable\n#endif\n#endif\nprecision highp float;\n#include <gl2_frag>\n#define saturate(x)        clamp(x, 0.0, 1.0)\n#define SHADER_NAME SSAO_EXTRACT\n#define PI 3.14159265359\nconst float uw = .0625;\nstruct MaterialParams {\n  mat4 projMatrix;\n  mat4 invProjMatrix;\n  vec4 resolution;\n  float radius;\n  float bias;\n  float power;\n  float invFarPlane;\n};\nuniform MaterialParams materialParams;\nuniform sampler2D materialParams_depth;\n#define NOISE_NONE      0\n#define NOISE_PATTERN   1\n#define NOISE_RANDOM    2\n#define NOISE_TYPE      NOISE_PATTERN\nconst int ux = 16;\nuniform vec3 kSphereSamples[16];\nvec3 uy(const int x) {\n  if(x == 0) {\n    return vec3(-.078247, -.749924, -.656880);\n  } else if(x == 1) {\n    return vec3(-.572319, -.102379, -.813615);\n  } else if(x == 2) {\n    return vec3(.048653, -.380791, .923380);\n  } else if(x == 3) {\n    return vec3(.281202, -.656664, -.699799);\n  } else if(x == 4) {\n    return vec3(.711911, -.235841, -.661485);\n  } else if(x == 5) {\n    return vec3(-.445893, .611063, .654050);\n  } else if(x == 6) {\n    return vec3(-.703598, .674837, .222587);\n  } else if(x == 7) {\n    return vec3(.768236, .507457, .390257);\n  } else if(x == 8) {\n    return vec3(-.670286, -.470387, .573980);\n  } else if(x == 9) {\n    return vec3(.199235, .849336, -.488808);\n  } else if(x == 10) {\n    return vec3(-.768068, -.583633, -.263520);\n  } else if(x == 11) {\n    return vec3(-.897330, .328853, .294372);\n  } else if(x == 12) {\n    return vec3(-.570930, -.531056, -.626114);\n  } else if(x == 13) {\n    return vec3(.699014, .063283, -.712303);\n  } else if(x == 14) {\n    return vec3(.207495, .976129, -.064172);\n  } else if(x == 15) {\n    return vec3(-.060901, -.869738, -.489742);\n  } else {\n    return vec3(.0);\n  }\n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n}\nvec2 qz(highp float qA) {\n  highp float z = clamp(qA * materialParams.invFarPlane, .0, 1.);\n  highp float t = floor(256. * z);\n  mediump float uz = t * (1. / 256.);\n  mediump float uA = 256. * z - t;\n  return vec2(uz, uA);\n}\nfloat uB(highp vec2 om) {\n  om = fract(om * vec2(5.3987, 5.4421));\n  om += dot(om.yx, om.xy + vec2(21.5351, 14.3137));\n  highp float xy = om.x * om.y;\n  return fract(xy * 95.4307) + fract(xy * 75.04961) * .5;\n}\nvec3 uC(const vec2 mS) {\n  \n#if NOISE_TYPE == NOISE_RANDOM\nreturn normalize(2. * vec3(uB(mS), uB(mS * 2.), uB(mS * 4.)) - vec3(1.));\n#elif NOISE_TYPE == NOISE_PATTERN\nvec2 xy = floor(gl_FragCoord.xy);\n  float uD = mod(xy.x, 4.);\n  float uE = mod(xy.y, 4.);\n  return uy(int(uD + uE * 4.));\n  return uy(15);\n#else\nreturn vec3(.0);\n#endif\n}\nhighp mat4 uF() {\n  return materialParams.projMatrix;\n}\nhighp mat4 uG() {\n  return materialParams.invProjMatrix;\n}\nhighp float tq(highp float qA) {\n  highp mat4 tr = uF();\n  highp float z = qA * 2. - 1.;\n  return -tr[3].z / (z + tr[2].z);\n}\nhighp float uH(const vec2 mS) {\n  return tq(texture2D(materialParams_depth, mS).r);\n}\nhighp vec3 uI(in vec2 p, highp float uJ) {\n  p = p * 2. - 1.;\n  highp mat4 uK = uG();\n  p.x *= uK[0].x;\n  p.y *= uK[1].y;\n  return vec3(p * -uJ, uJ);\n}\nhighp vec3 uL(const highp vec3 ta) {\n  highp vec3 uM = dFdx(ta);\n  highp vec3 uN = dFdy(ta);\n  return cross(uM, uN);\n}\nhighp vec3 uL(const highp vec3 ta, const vec2 mS) {\n  vec2 uO = mS + vec2(materialParams.resolution.z, .0);\n  vec2 uP = mS + vec2(.0, materialParams.resolution.w);\n  highp vec3 px = uI(uO, uH(uO));\n  highp vec3 py = uI(uP, uH(uP));\n  highp vec3 uM = px - ta;\n  highp vec3 uN = py - ta;\n  return cross(uM, uN);\n}\nfloat uQ(const highp vec3 oL, const vec3 oP, const vec3 uR, const vec3 uS) {\n  highp mat4 tr = uF();\n  float uT = materialParams.radius;\n  float uU = materialParams.bias;\n  vec3 r = uS * uT;\n  r = reflect(r, uR);\n  r = sign(dot(r, oP)) * r;\n  highp vec3 uV = oL + r;\n  highp vec4 uW = tr * vec4(uV, 1.);\n  uW.xy = uW.xy * (.5 / uW.w) + .5;\n  highp float uX = uH(uW.xy);\n  float t = saturate(uT / abs(oL.z - uX));\n  float uY = t * t * (3. - 2. * t);\n  float py = uV.z - uX;\n  return (py >= -uU ? .0 : uY);\n}\nvoid main() {\n  highp vec2 mS = gl_FragCoord.xy / materialParams.resolution.xy;\n  highp float qA = uH(mS);\n  highp vec3 oL = uI(mS, qA);\n  highp vec3 oP = uL(oL, mS);\n  oP = normalize(oP);\n  vec3 uR = uC(mS);\n  float te = .0;\n  for(int ss = 0; ss < ux; ss++) {\n    te += uQ(oL, oP, uR, kSphereSamples[ss]);\n  }\n  float pf = 1. - te / float(ux);\n  pf = mix(pf, pf * pf, materialParams.power);\n  vec2 uZ = floor(gl_FragCoord.xy);\n  pf += (1. - step(uw, abs(dFdx(oL.z)))) * dFdx(pf) * (.5 - mod(uZ.x, 2.));\n  pf += (1. - step(uw, abs(dFdy(oL.z)))) * dFdy(pf) * (.5 - mod(uZ.y, 2.));\n  glFragColor = vec4(pf, qz(oL.z), 1.);\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}",
            uniforms: [ "materialParams_depth", "materialParams.projMatrix", "materialParams.invProjMatrix", "materialParams.resolution", "materialParams.radius", "materialParams.bias", "materialParams.power", "materialParams.invFarPlane", {
                name: "kSphereSamples",
                type: "array",
                length: 16,
                fn: function() {
                    return Ir;
                }
            } ],
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: function(e, t) {
                        return t.materialParams.resolution[0];
                    },
                    height: function(e, t) {
                        return t.materialParams.resolution[1];
                    }
                }
            }
        }) || this).version = 300, e;
    }
    var Nr, Lr = [], qr = ((Nr = Zr.prototype).render = function(e, t, n) {
        var r = n.width, i = n.height;
        return this._initShaders(), this._extractFBO || this._createTextures(n), this._extract(e, r, i, n), 
        this._blurAndCombine(t, e.cameraFar, r, i);
    }, Nr._blurAndCombine = function(e, t, n, r) {
        this._blurHTex.width === n && this._blurHTex.h === r || (this._blurHFBO.resize(n, r), 
        this._blurVFBO.resize(n, r));
        var i = [ n, r ], a = [ 2, 0 ];
        return this._renderer.render(this._ssaoBlurShader, {
            TextureInput: e,
            materialParams_ssao: this._extractTex,
            materialParams: {
                axis: a,
                farPlaneOverEdgeDistance: -t / .0625,
                resolution: i
            }
        }, null, this._blurHFBO), a[0] = 0, a[1] = 2, this._renderer.render(this._ssaoBlurShader, {
            TextureInput: e,
            materialParams_ssao: this._blurHTex,
            materialParams: {
                axis: a,
                farPlaneOverEdgeDistance: -t / .0625,
                resolution: i
            }
        }, null, this._blurVFBO), this._blurVTex;
    }, Nr._extract = function(e, t, n, r) {
        this._extractFBO.width === t && this._extractFBO.height === n || this._extractFBO.resize(t, n);
        var i = e.projMatrix, a = x(Lr, i), o = e.power || 1;
        this._renderer.render(this._ssaoExtractShader, {
            materialParams_depth: r,
            materialParams: {
                projMatrix: i,
                invProjMatrix: a,
                resolution: [ t, n, 1 / t, 1 / n ],
                radius: e.radius,
                bias: e.bias,
                power: o,
                invFarPlane: 1 / -e.cameraFar
            }
        }, null, this._extractFBO);
    }, Nr._createTextures = function(e) {
        var t = e.width, n = e.height;
        this._extractTex = this._createTex(t, n, "uint8"), this._extractFBO = this._createFBO(this._extractTex), 
        this._blurHTex = this._createTex(t, n, "uint8"), this._blurHFBO = this._createFBO(this._blurHTex), 
        this._blurVTex = this._createTex(t, n, "uint8"), this._blurVFBO = this._createFBO(this._blurVTex);
    }, Nr._createTex = function(e, t, n) {
        return this._renderer.regl.texture({
            min: "linear",
            mag: "linear",
            wrap: "clamp",
            type: n,
            width: e,
            height: t
        });
    }, Nr._createFBO = function(e) {
        return this._renderer.regl.framebuffer({
            width: e.width,
            height: e.height,
            colors: [ e ],
            depth: !1,
            stencil: !1
        });
    }, Nr.dispose = function() {
        this._extractFBO && (this._extractFBO.destroy(), delete this._extractFBO, this._blurVFBO.destroy(), 
        this._blurHFBO.destroy(), this._ssaoExtractShader.dispose(), this._ssaoBlurShader.dispose(), 
        delete this._ssaoExtractShader);
    }, Nr._initShaders = function() {
        this._ssaoExtractShader || (this._ssaoExtractShader = new Pr(), this._ssaoBlurShader = new Br());
    }, Zr);
    function Zr(e) {
        this._renderer = e;
    }
    var zr, Ur = (o(Gr, zr = wr), Gr.prototype.getMeshCommand = function(e, t) {
        return this.commands.postprocess || (this.commands.postprocess = this.createREGLCommand(e, null, [ "aPosition", "aTexCoord" ], null, t.getElements())), 
        this.commands.postprocess;
    }, Gr);
    function Gr() {
        return zr.call(this, {
            vert: br,
            frag: "precision mediump float;\nvarying vec2 vTexCoord;\nuniform vec2 resolution;\nuniform sampler2D textureSource;\nuniform float enableVignette;\nuniform float enableGrain;\nuniform float enableLut;\nuniform float timeGrain;\nuniform float grainFactor;\nuniform vec2 lensRadius;\nuniform float frameMod;\nuniform sampler2D lookupTable;\nfloat pJ(const in vec2 pK) {\n  vec3 pL = fract(vec3(pK.xyx) * .1031);\n  pL += dot(pL, pL.yzx + 19.19);\n  return fract((pL.x + pL.y) * pL.z);\n}\nfloat pM() {\n  float pN = pJ(gl_FragCoord.xy + 1000.0 * fract(timeGrain));\n  float pO = pN * 2. - 1.;\n  pN = pO * inversesqrt(abs(pO));\n  pN = max(-1., pN);\n  pN = pN - sign(pO) + .5;\n  return (pN + .5) * .5;\n}\nvec4 pP(const in vec4 nZ) {\n  float pQ = pM();\n  return vec4(mix(nZ.rgb, nZ.rgb * (nZ.rgb + (1. - nZ.rgb) * 2. * pQ), grainFactor), nZ.a);\n}\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nfloat pS(const in vec2 pK, const in float pT) {\n  vec3 pU = vec3(.06711056, .00583715, 52.9829189);\n  return fract(pU.z * fract(dot(pK.xy + pT * vec2(47., 17.) * .695, pU.xy)));\n}\nfloat pV() {\n  vec2 pW = lensRadius;\n  pW.y = min(pW.y, pW.x - 1e-4);\n  float pX = pS(gl_FragCoord.xy, frameMod);\n  pX = (pW.x - pW.y) * (pW.x + pW.y) * .07 * (pX - .5);\n  return smoothstep(pW.x, pW.y, pX + distance(vTexCoord, vec2(.5)));\n}\nvec4 pY(const in vec4 nZ) {\n  float pQ = pV();\n  return vec4(oR(pR(nZ.rgb) * pQ), clamp(nZ.a + (1. - pQ), .0, 1.));\n}\nvec4 pZ(in vec4 qa, in sampler2D qb) {\n  mediump float qc = qa.b * 63.;\n  mediump vec2 qd;\n  qd.y = floor(floor(qc) / 8.);\n  qd.x = floor(qc) - qd.y * 8.;\n  mediump vec2 qe;\n  qe.y = floor(ceil(qc) / 8.);\n  qe.x = ceil(qc) - qe.y * 8.;\n  highp vec2 qf;\n  qf.x = qd.x * .125 + .5 / 512. + (.125 - 1. / 512.) * qa.r;\n  qf.y = qd.y * .125 + .5 / 512. + (.125 - 1. / 512.) * qa.g;\n#ifdef LUT_FLIP_Y\nqf.y = 1. - qf.y;\n#endif\nhighp vec2 qg;\n  qg.x = qe.x * .125 + .5 / 512. + (.125 - 1. / 512.) * qa.r;\n  qg.y = qe.y * .125 + .5 / 512. + (.125 - 1. / 512.) * qa.g;\n#ifdef LUT_FLIP_Y\nqg.y = 1. - qg.y;\n#endif\nlowp vec4 qh = texture2D(qb, qf);\n  lowp vec4 qi = texture2D(qb, qg);\n  lowp vec4 qj = mix(qh, qi, fract(qc));\n  return qj;\n}\nvoid main() {\n  vec4 nZ = texture2D(textureSource, vTexCoord);\n  if(enableLut == 1.) {\n    nZ = pZ(nZ, lookupTable);\n  }\n  if(enableVignette == 1.) {\n    nZ = pY(nZ);\n  }\n  if(enableGrain == 1.) {\n    nZ = pP(nZ);\n  }\n  gl_FragColor = nZ;\n}",
            uniforms: [ "textureSource", "resolution", "enableGrain", "timeGrain", "grainFactor", "enableVignette", "lensRadius", "frameMod", "enableLut", "lookupTable" ],
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: function(e, t) {
                        return t.resolution[0];
                    },
                    height: function(e, t) {
                        return t.resolution[1];
                    }
                }
            }
        }) || this;
    }
    var Hr, kr = (o(jr, Hr = wr), jr.prototype.getMeshCommand = function(e, t) {
        return this.commands.taa || (this.commands.taa = this.createREGLCommand(e, null, [ "aPosition", "aTexCoord" ], null, t.getElements())), 
        this.commands.taa;
    }, jr);
    function jr() {
        var i = [ [], [] ];
        return Hr.call(this, {
            vert: br,
            frag: "precision highp float;\nuniform float uSSAARestart;\nuniform float uTaaEnabled;\nuniform float uClipAABBEnabled;\nuniform mat4 uProjectionMatrix;\nuniform mat4 uTaaCurrentFramePVLeft;\nuniform mat4 uTaaInvViewMatrixLeft;\nuniform mat4 uTaaLastFramePVLeft;\nuniform sampler2D TextureDepth;\nuniform sampler2D TextureInput;\nuniform sampler2D TexturePrevious;\nuniform vec2 uTextureDepthRatio;\nuniform vec2 uTextureDepthSize;\nuniform vec2 uTextureInputRatio;\nuniform vec2 uTextureInputSize;\nuniform vec2 uTextureOutputRatio;\nuniform vec2 uTextureOutputSize;\nuniform vec2 uTexturePreviousRatio;\nuniform vec2 uTexturePreviousSize;\nuniform vec4 uHalton;\nuniform vec4 uTaaCornersCSLeft[2];\n#define SHADER_NAME supersampleTaa\nvec2 rb;\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nfloat sI(const in vec3 nZ) {\n  const vec3 sH = vec3(.2126, .7152, .0722);\n  return dot(nZ, sH);\n}\nint tn(const in vec4 qz) {\n  float to = floor(qz.b * 255. + .5);\n  float tp = mod(to, 2.);\n  tp += mod(to - tp, 4.);\n  return int(tp);\n}\nfloat tq(float qA) {\n  highp mat4 tr = uProjectionMatrix;\n  highp float z = qA * 2. - 1.;\n  return -tr[3].z / (z + tr[2].z);\n}\nfloat ts(const in vec4 qz) {\n  return qz.x;\n}\nfloat tt(const in vec4 qz) {\n  return qz.a;\n}\nvec3 tu(const in vec2 mS, const in vec4 tv, const in vec4 tw, const in mat4 tx, const in float qA) {\n  vec2 ty = mS;\n  vec4 tz = mix(tv, tw, vec4(ty.x));\n  vec3 tA = vec3(mix(tz.xy, tz.zw, vec2(ty.y)), 1.) * qA;\n  return (tx * vec4(tA, 1.)).xyz;\n}\nvec3 tB(in vec2 mS, const in vec2 tC) {\n  float qA = ts(texture2D(TextureDepth, min(mS, 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  return vec3(mS, qA);\n}\nvec4 tD(const in vec4 tE, const in vec4 tF, const in vec4 nZ) {\n  const float tG = .00000001;\n  vec4 tH = .5 * (tF + tE);\n  vec4 tI = .5 * (tF - tE) + tG;\n  vec4 pB = nZ - tH;\n  vec4 ts = abs(pB / tI);\n  float t = max(max(ts.r, ts.g), max(ts.b, ts.a));\n  return tH + pB / max(1., t);\n}\nvec4 tJ(const in vec2 tC, const in vec4 tK, out vec4 tL, bool rD) {\n  vec2 mS = rb;\n  vec4 tM = (texture2D(TextureInput, min(mS + vec2(-tC.x, tC.y), 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  vec4 t = (texture2D(TextureInput, min(mS + vec2(.0, tC.y), 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  vec4 tr = (texture2D(TextureInput, min(mS + vec2(tC.x, tC.y), 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  vec4 tN = (texture2D(TextureInput, min(mS + vec2(-tC.x, .0), 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  vec4 tO = (texture2D(TextureInput, min(mS + vec2(tC.x, .0), 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  vec4 tP = (texture2D(TextureInput, min(mS + vec2(-tC.x, -tC.y), 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  vec4 b = (texture2D(TextureInput, min(mS + vec2(.0, -tC.y), 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  vec4 br = (texture2D(TextureInput, min(mS + vec2(tC.x, -tC.y), 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  if(rD) {\n    vec4 tQ = 2. * (tr + tP + br + tM) - 2. * tL;\n    tL += (tL - tQ * .166667) * 2.718282 * .3;\n    tL = max(vec4(.0), tL);\n  }\n  vec4 tR = min(tO, min(tL, min(tN, min(t, b))));\n  vec4 tS = min(tR, min(tM, min(tr, min(tP, br))));\n  vec4 tT = max(tO, max(tL, max(tN, max(t, b))));\n  vec4 tU = max(tT, max(tM, max(tr, max(tP, br))));\n  tS = .5 * (tS + tR);\n  tU = .5 * (tU + tT);\n  return tD(tS, tU, tK);\n}\nvec4 taa(const in vec2 tV, const in vec2 tC) {\n  vec2 mS = rb;\n  vec4 tL = (texture2D(TextureInput, min(mS, 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n  vec4 tW = (texture2D(TexturePrevious, min(mS - tV, 1. - 1e+0 / uTexturePreviousSize.xy) * uTexturePreviousRatio));\n  tW = tJ(tC, tW, tL, true);\n  float tX = sI(tL.rgb);\n  float tY = sI(tW.rgb);\n  float oY = abs(tX - tY) / max(tX, max(tY, .2));\n  float tZ = 1. - oY;\n  float ua = mix(.88, .97, tZ * tZ);\n  return mix(tL, tW, ua);\n}\nvec2 ub(const in vec3 uc, const in mat4 ud, const in mat4 ue, const in bool uf) {\n  vec4 ug = ud * vec4(uc, 1.);\n  vec4 uh = ue * vec4(uc, 1.);\n  vec2 ui = ug.xy / ug.w;\n  vec2 uj = uh.xy / uh.w;\n  if(uj.x >= 1. || uj.x <= -1. || uj.x >= 1. || uj.y <= -1.)\n    return vec2(.0);\n  return .5 * (ui - uj);\n}\nvec4 uk() {\n  vec4 ul = (texture2D(TextureInput, min(rb, 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio)).rgba;\n  float um = abs(uHalton.z);\n  if(um == 1.) {\n    return ul;\n  }\n  vec4 un = (texture2D(TexturePrevious, (floor(min(rb, 1. - 1e+0 / uTexturePreviousSize.xy) * uTexturePreviousSize) + .5) * uTexturePreviousRatio / uTexturePreviousSize, -99999.)).rgba;\n  if(uClipAABBEnabled == 1.) {\n    vec2 tC = vec2(1.) / uTextureInputSize;\n    un = tJ(tC, un, ul, false);\n  }\n  float uo = 1. / uHalton.w;\n  return mix(un, ul, uo);\n}\nvec4 up(const in mat4 tx, const in mat4 ud, const in mat4 ue, const in vec4 tv, const in vec4 tw) {\n  vec2 mS = rb;\n  float um = abs(uHalton.z);\n  if(um == 1.) {\n    vec2 tC = vec2(1.) / uTextureInputSize;\n    vec3 uq = tB(mS, tC);\n    if(uq.z >= 1.) {\n      return (texture2D(TextureInput, min(mS - .5 * uHalton.xy * tC, 1. - 1e+0 / uTextureInputSize.xy) * uTextureInputRatio));\n    }\n    float qA = tq(uq.z);\n    vec3 ws = tu(uq.xy, tv, tw, tx, qA);\n    vec2 tV = ub(ws, ud, ue, mS.x >= .5);\n    return taa(tV, tC);\n  }\n  return uk();\n}\nvec4 ur() {\n  if(uTaaEnabled == .0) {\n    return uk();\n  }\n  return up(uTaaInvViewMatrixLeft, uTaaCurrentFramePVLeft, uTaaLastFramePVLeft, uTaaCornersCSLeft[0], uTaaCornersCSLeft[1]);\n}\nvoid main(void) {\n  rb = gl_FragCoord.xy / uTextureOutputSize.xy;\n  vec4 nZ = ur();\n  gl_FragColor = nZ;\n}",
            uniforms: [ "uProjectionMatrix", "uTaaCurrentFramePVLeft", "uTaaInvViewMatrixLeft", "uTaaLastFramePVLeft", "TextureDepth", "TextureInput", "TexturePrevious", "uTextureDepthRatio", "uTextureDepthSize", "uTextureInputRatio", "uTextureInputSize", "uTextureOutputRatio", "uTextureOutputSize", "uTexturePreviousRatio", "uTexturePreviousSize", "uHalton", "uSSAARestart", "uTaaEnabled", "uClipAABBEnabled", {
                name: "uTaaCornersCSLeft",
                type: "array",
                length: 2,
                fn: function(e, t) {
                    var n = Math.tan(.5 * t.fov), r = t.uTextureOutputSize[0] / t.uTextureOutputSize[1] * n;
                    return ee(i[0], r, n, r, -n), ee(i[1], -r, n, -r, -n), i;
                }
            } ],
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: function(e, t) {
                        return t.uTextureOutputSize[0];
                    },
                    height: function(e, t) {
                        return t.uTextureOutputSize[1];
                    }
                },
                blend: {
                    enable: !1
                },
                dither: !0
            }
        }) || this;
    }
    var Vr, Xr = [], Wr = ((Vr = Kr.prototype).needToRedraw = function() {
        return this._counter < this._jitter.getSampleCount();
    }, Vr.render = function(e, t, n, r, i, a, o, s, u, f) {
        var c = this._jitter, l = c.getJitter(Xr);
        this._initShaders(), this._createTextures(e), u && (this._counter = 0), this._counter++;
        var h = c.getSampleCount();
        if (this._counter >= h) return this._prevTex;
        this._fbo.width === e.width && this._fbo.height === e.height || this._fbo.resize(e.width, e.height);
        var d = this._outputTex, v = this._prevTex, p = this._uniforms || {
            uTextureDepthSize: [ t.width, t.height ],
            uTextureDepthRatio: [ 1, 1 ],
            uTextureInputRatio: [ 1, 1 ],
            uTextureInputSize: [ e.width, e.height ],
            uTextureOutputRatio: [ 1, 1 ],
            uTextureOutputSize: [ e.width, e.height ],
            uTexturePreviousRatio: [ 1, 1 ],
            uTexturePreviousSize: [ v.width, v.height ],
            uSSAARestart: 0,
            uClipAABBEnabled: 0
        };
        p.uTaaEnabled = +!!f, p.fov = a, p.uProjectionMatrix = n, p.uTaaCurrentFramePVLeft = r, 
        p.uTaaInvViewMatrixLeft = i, p.uTaaLastFramePVLeft = this._prevPvMatrix || r, p.TextureDepth = t, 
        p.TextureInput = e, p.TexturePrevious = v, p.uHalton = ee(this._halton, l[0], l[1], u ? 1 : 2, this._counter), 
        Ne(p.uTextureDepthSize, t.width, t.height), Ne(p.uTextureInputSize, e.width, e.height), 
        Ne(p.uTextureOutputSize, d.width, d.height), Ne(p.uTexturePreviousSize, v.width, v.height), 
        this._renderer.render(this._shader, p, null, this._fbo);
        var m = this._outputTex, _ = this._fbo;
        return this._outputTex = this._prevTex, this._fbo = this._prevFbo, this._prevTex = m, 
        this._prevFbo = _, this._prevPvMatrix = r, d;
    }, Vr.dispose = function() {
        this._shader && (this._shader.dispose(), delete this._shader), this._fbo && this._fbo.destroy(), 
        this._prevFbo && this._prevFbo.destroy(), delete this._uniforms;
    }, Vr._createTextures = function(e) {
        if (!this._outputTex) {
            var t = this._renderer.regl;
            this._outputTex = this._createColorTex(e), this._fbo = t.framebuffer({
                width: e.width,
                height: e.height,
                colors: [ this._outputTex ],
                depth: !1,
                stencil: !1
            }), this._prevTex = this._createColorTex(e), this._prevFbo = t.framebuffer({
                width: e.width,
                height: e.height,
                colors: [ this._prevTex ],
                depth: !1,
                stencil: !1
            });
        }
    }, Vr._createColorTex = function(e) {
        var t = this._renderer.regl, n = e.width, r = e.height;
        return t.texture({
            min: "linear",
            mag: "linear",
            type: "uint8",
            width: n,
            height: r
        });
    }, Vr._initShaders = function() {
        this._shader || (this._shader = new kr());
    }, Kr);
    function Kr(e, t) {
        this._jitter = t, this._renderer = e, this._halton = [], this._counter = 0;
    }
    var Yr, Qr = [ [ .263385, -.0252475 ], [ -.38545, .054485 ], [ -.139795, -.5379925 ], [ -.2793775, .6875475 ], [ .7139025, .4710925 ], [ .90044, -.16422 ], [ .4481775, -.82799 ], [ -.9253375, -.2910625 ], [ .3468025, 1.02292 ], [ -1.13742, .33522 ], [ -.7676225, -.9123175 ], [ -.2005775, -1.1774125 ], [ -.926525, .96876 ], [ 1.12909, -.7500325 ], [ .9603, 1.14625 ] ], Jr = Qr.length, $r = ((Yr = ei.prototype).reset = function() {
        this._frameNum = 0;
    }, Yr.getJitter = function(e) {
        var t = this._frameNum % Jr, n = this._ratio;
        return Ne(e, Qr[t][0] * n, Qr[t][1] * n), e;
    }, Yr.frame = function() {
        this._frameNum++, this._frameNum % Jr == 0 && (this._frameNum = 0);
    }, Yr.getSampleCount = function() {
        return Jr;
    }, ei);
    function ei(e) {
        this._frameNum = 0, this._ratio = e || .05;
    }
    var ti, ni = ((ti = ri.prototype).render = function(e, t, n) {
        return this._initShaders(), this._createTextures(e.width, e.height), this._blur(e, t, n), 
        {
            blurTex0: this._blur01Tex,
            blurTex1: this._blur11Tex
        };
    }, ti._blur = function(e, t, n) {
        this._blurOnce(e, this._blur00FBO, this._blur01FBO, t, n, .3), this._blurOnce(this._blur01FBO, this._blur10FBO, this._blur11FBO, t, 0, .6);
    }, ti._blurOnce = function(e, t, n, r, i, a) {
        a *= r;
        var o = this._blurShader, s = Math.floor(.5 * e.width), u = Math.floor(.5 * e.height);
        t.width === s && t.height === u || t.resize(s, u), n.width === s && n.height === u || n.resize(s, u);
        var f = this._blurUniforms = this._blurUniforms || {
            textureSampler: e,
            bloomThreshold: i,
            resolution: [ 0, 0 ],
            direction: [ 0, 0 ]
        };
        f.bloomThreshold = i, f.textureSampler = e, Ne(f.resolution, s, u), Ne(f.direction, a, 0), 
        this._renderer.render(o, f, null, t), f.textureSampler = t, f.bloomThreshold = 0, 
        Ne(f.direction, 0, a), this._renderer.render(o, f, null, n);
    }, ti.dispose = function() {
        this._blurShader && (this._blurShader.dispose(), delete this._blurShader), this._blur00Tex && (delete this._blur00Tex, 
        this._blur00FBO.destroy(), this._blur01FBO.destroy(), this._blur10FBO.destroy(), 
        this._blur11FBO.destroy());
    }, ti._createTextures = function(e, t) {
        this._blur00Tex || (e = Math.floor(e / 2), t = Math.floor(t / 2), this._blur00Tex = this._createColorTex(e, t, "uint8"), 
        this._blur00FBO = this._createBlurFBO(this._blur00Tex), this._blur01Tex = this._createColorTex(e, t, "uint8"), 
        this._blur01FBO = this._createBlurFBO(this._blur01Tex), e = Math.floor(e / 2), t = Math.floor(t / 2), 
        this._blur10Tex = this._createColorTex(e, t, "uint8"), this._blur10FBO = this._createBlurFBO(this._blur10Tex), 
        this._blur11Tex = this._createColorTex(e, t, "uint8"), this._blur11FBO = this._createBlurFBO(this._blur11Tex));
    }, ti._createColorTex = function(e, t, n) {
        var r = n;
        return this._regl.texture({
            min: "linear",
            mag: "linear",
            type: r,
            width: e,
            height: t
        });
    }, ti._createBlurFBO = function(e) {
        return this._regl.framebuffer({
            width: e.width,
            height: e.height,
            colors: [ e ],
            depth: !1,
            stencil: !1
        });
    }, ti._initShaders = function() {
        if (!this._blur0Shader) {
            var e = {
                frag: "#define SHADER_NAME BLOOM_BLUR\nprecision highp float;\nuniform sampler2D textureSampler;\nuniform float bloomThreshold;\nuniform vec2 resolution;\nuniform vec2 direction;\nconst vec3 sH = vec3(.2126, .7152, .0722);\nfloat sI(const in vec3 nZ) {\n  return dot(nZ, sH);\n}\nvec4 sJ(vec4 nZ) {\n  float sK = sign(clamp(sI(nZ.rgb) - bloomThreshold, .0, 1.));\n  return nZ * sK;\n}\nvec4 sL(const in sampler2D sM, const in vec2 mS) {\n  vec4 ql = texture2D(sM, mS);\n  return sJ(ql);\n}\nvec4 sN(sampler2D sM, vec2 mS, vec2 sO, vec2 sP) {\n  vec4 nZ = vec4(.0);\n  vec2 sQ = vec2(1.411764705882353) * sP;\n  vec2 sR = vec2(3.2941176470588234) * sP;\n  vec2 sS = vec2(5.176470588235294) * sP;\n  nZ += sL(sM, mS) * .1964825501511404;\n  nZ += sL(sM, mS + sQ / sO) * .2969069646728344;\n  nZ += sL(sM, mS - sQ / sO) * .2969069646728344;\n  nZ += sL(sM, mS + sR / sO) * .09447039785044732;\n  nZ += sL(sM, mS - sR / sO) * .09447039785044732;\n  nZ += sL(sM, mS + sS / sO) * .010381362401148057;\n  nZ += sL(sM, mS - sS / sO) * .010381362401148057;\n  return nZ;\n}\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_FragColor = sN(textureSampler, vTexCoord, resolution, direction);\n}",
                uniforms: [ "textureSampler", "bloomThreshold", "resolution", "direction" ],
                extraCommandProps: {
                    viewport: {
                        x: 0,
                        y: 0,
                        width: function(e, t) {
                            return t.resolution[0];
                        },
                        height: function(e, t) {
                            return t.resolution[1];
                        }
                    }
                }
            };
            this._blurShader = new wr(e);
        }
    }, ri);
    function ri(e) {
        this._regl = e, this._renderer = new st(e);
    }
    var ii, ai = ((ii = oi.prototype).render = function(e, t, n, r, i, a) {
        this._initShaders(), this._createTextures(e);
        var o = this._blurPass.render(t, i, n);
        return this._combine(e, o, t, r, a);
    }, ii._combine = function(e, t, n, r, i) {
        i || this._combineTex.width === e.width && this._combineTex.height === e.height || this._combineFBO.resize(e.width, e.height);
        var a = this._combineUniforms, o = t.blurTex0, s = t.blurTex1;
        return (a = a || (this._combineUniforms = {})).textureBloomBlur1 = o, a.textureBloomBlur2 = s, 
        a.factor = r, a.textureInput = n, a.textureSource = e, this._renderer.render(this._combineShader, a, null, i ? null : this._combineFBO), 
        i ? null : this._combineTex;
    }, ii.dispose = function() {
        this._targetFBO && (this._targetFBO.destroy(), this._combineFBO.destroy(), delete this._targetFBO, 
        delete this._combineFBO), this._combineShader && (this._combineShader.dispose(), 
        delete this._combineShader), this._blurPass && (this._blurPass.dispose(), delete this._blurPass), 
        delete this._uniforms;
    }, ii._createTextures = function(e) {
        if (!this._outputTex) {
            var t = this._renderer.regl, n = this._outputTex = this._createColorTex(e);
            this._targetFBO = t.framebuffer({
                width: n.width,
                height: n.height,
                colors: [ n ],
                depth: !1,
                stencil: !1
            });
            var r = e.width, i = e.height;
            this._combineTex = this._createColorTex(e, r, i, "uint8"), this._combineFBO = this._createBlurFBO(this._combineTex);
        }
    }, ii._createColorTex = function(e, t, n, r) {
        var i = this._renderer.regl, a = r || (i.hasExtension("OES_texture_half_float") ? "float16" : "float"), o = t || e.width, s = n || e.height;
        return i.texture({
            min: "linear",
            mag: "linear",
            type: a,
            width: o,
            height: s
        });
    }, ii._createBlurFBO = function(e) {
        return this._renderer.regl.framebuffer({
            width: e.width,
            height: e.height,
            colors: [ e ],
            depth: !1,
            stencil: !1
        });
    }, ii._initShaders = function() {
        this._blurPass || (this._blurPass = new ni(this._regl), this._combineShader = new wr({
            vert: br,
            frag: "#define SHADER_NAME BLOOM_COMBINE\nprecision mediump float;\nvarying vec2 vTexCoord;\nuniform sampler2D textureSource;\nuniform sampler2D textureInput;\nuniform sampler2D textureBloomBlur1;\nuniform sampler2D textureBloomBlur2;\nuniform float factor;\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nvoid main() {\n  vec4 nZ = texture2D(textureInput, vTexCoord);\n  vec4 qm = texture2D(textureSource, vTexCoord);\n  nZ = vec4(qm.rgb * qm.a + nZ.rgb * (1. - qm.a), qm.a + (1. - qm.a) * nZ.a);\n  vec4 qn = texture2D(textureBloomBlur1, vTexCoord);\n  qn += texture2D(textureBloomBlur2, vTexCoord);\n  qn.rgb *= factor;\n  qn = oR(qn);\n  gl_FragColor = vec4(nZ.rgb * nZ.a + qn.rgb, nZ.a * nZ.a + qn.a);\n}",
            uniforms: [ "factor", "textureBloomBlur1", "textureBloomBlur2", "textureInput", "textureSource" ],
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: function(e, t) {
                        return t.textureInput.width;
                    },
                    height: function(e, t) {
                        return t.textureInput.height;
                    }
                }
            }
        }));
    }, oi);
    function oi(e) {
        this._regl = e, this._renderer = new st(e);
    }
    var si, ui = (o(fi, si = wr), fi.prototype.getMeshCommand = function(e, t) {
        return this.commands.ssr_mimap || (this.commands.ssr_mimap = this.createREGLCommand(e, null, [ "aPosition", "aTexCoord" ], null, t.getElements())), 
        this.commands.ssr_mimap;
    }, fi);
    function fi() {
        return si.call(this, {
            vert: br,
            frag: "#version 100\nprecision highp float;\nuniform float inputRGBM;\nuniform float uRGBMRange;\nuniform sampler2D TextureInput;\nuniform sampler2D TextureRefractionBlur0;\nuniform sampler2D TextureRefractionBlur1;\nuniform sampler2D TextureRefractionBlur2;\nuniform sampler2D TextureRefractionBlur3;\nuniform sampler2D TextureRefractionBlur4;\nuniform sampler2D TextureRefractionBlur5;\nuniform sampler2D TextureRefractionBlur6;\nuniform sampler2D TextureRefractionBlur7;\nuniform vec2 uTextureOutputRatio;\nuniform vec2 uTextureOutputSize;\nuniform vec2 uTextureRefractionBlur0Ratio;\nuniform vec2 uTextureRefractionBlur0Size;\nuniform vec2 uTextureRefractionBlur1Ratio;\nuniform vec2 uTextureRefractionBlur1Size;\nuniform vec2 uTextureRefractionBlur2Ratio;\nuniform vec2 uTextureRefractionBlur2Size;\nuniform vec2 uTextureRefractionBlur3Ratio;\nuniform vec2 uTextureRefractionBlur3Size;\nuniform vec2 uTextureRefractionBlur4Ratio;\nuniform vec2 uTextureRefractionBlur4Size;\nuniform vec2 uTextureRefractionBlur5Ratio;\nuniform vec2 uTextureRefractionBlur5Size;\nuniform vec2 uTextureRefractionBlur6Ratio;\nuniform vec2 uTextureRefractionBlur6Size;\nuniform vec2 uTextureRefractionBlur7Ratio;\nuniform vec2 uTextureRefractionBlur7Size;\n#define SHADER_NAME TextureToBeRefracted\nvec2 rb;\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 us() {\n  vec4 ng = vec4(.0, .0, .0, 1.);\n  rb.y /= uTextureOutputRatio.y;\n  float ut = -log2(1. - rb.y) + 1.;\n  float uu = floor(ut) - 1.;\n  float uv = pow(2., uu + 1.);\n  rb.x = uv * rb.x * .5;\n  rb.y = uv * (1. - rb.y) - 1.;\n  if(rb.x > 1. || rb.y > 1.)\n    return ng;\n  if(uu < .1) {\n    if(inputRGBM == .0) {\n      ng.rgb = texture2D(TextureRefractionBlur0, min(rb, 1. - 1e+0 / uTextureRefractionBlur0Size.xy) * uTextureRefractionBlur0Ratio).rgb;\n    } else {\n      ng.rgb = (vec4(qI(texture2D(TextureRefractionBlur0, min(rb, 1. - 1e+0 / uTextureRefractionBlur0Size.xy) * uTextureRefractionBlur0Ratio), uRGBMRange), 1.)).rgb;\n    }\n  } else if(uu < 1.1)\n    ng.rgb = (vec4(qI(texture2D(TextureRefractionBlur1, min(rb, 1. - 1e+0 / uTextureRefractionBlur1Size.xy) * uTextureRefractionBlur1Ratio), uRGBMRange), 1.)).rgb;\n  else if(uu < 2.1)\n    ng.rgb = (vec4(qI(texture2D(TextureRefractionBlur2, min(rb, 1. - 1e+0 / uTextureRefractionBlur2Size.xy) * uTextureRefractionBlur2Ratio), uRGBMRange), 1.)).rgb;\n  else if(uu < 3.1)\n    ng.rgb = (vec4(qI(texture2D(TextureRefractionBlur3, min(rb, 1. - 1e+0 / uTextureRefractionBlur3Size.xy) * uTextureRefractionBlur3Ratio), uRGBMRange), 1.)).rgb;\n  else if(uu < 4.1)\n    ng.rgb = (vec4(qI(texture2D(TextureRefractionBlur4, min(rb, 1. - 1e+0 / uTextureRefractionBlur4Size.xy) * uTextureRefractionBlur4Ratio), uRGBMRange), 1.)).rgb;\n  else if(uu < 5.1)\n    ng.rgb = (vec4(qI(texture2D(TextureRefractionBlur5, min(rb, 1. - 1e+0 / uTextureRefractionBlur5Size.xy) * uTextureRefractionBlur5Ratio), uRGBMRange), 1.)).rgb;\n  else if(uu < 6.1)\n    ng.rgb = (vec4(qI(texture2D(TextureRefractionBlur6, min(rb, 1. - 1e+0 / uTextureRefractionBlur6Size.xy) * uTextureRefractionBlur6Ratio), uRGBMRange), 1.)).rgb;\n  else if(uu < 7.1)\n    ng.rgb = (vec4(qI(texture2D(TextureRefractionBlur7, min(rb, 1. - 1e+0 / uTextureRefractionBlur7Size.xy) * uTextureRefractionBlur7Ratio), uRGBMRange), 1.)).rgb;\n  \n  \n  \n  \n  \n  \n  \n  return ng;\n}\nvoid main(void) {\n  rb = gl_FragCoord.xy / uTextureOutputSize.xy;\n  vec4 nZ = us();\n  nZ = qE(nZ.rgb, uRGBMRange);\n  gl_FragColor = nZ;\n}",
            uniforms: [ "inputRGBM", "uRGBMRange", "TextureRefractionBlur0", "TextureRefractionBlur1", "TextureRefractionBlur2", "TextureRefractionBlur3", "TextureRefractionBlur4", "TextureRefractionBlur5", "TextureRefractionBlur6", "TextureRefractionBlur7", "uTextureOutputRatio", "uTextureOutputSize", "uTextureRefractionBlur0Ratio", "uTextureRefractionBlur0Size", "uTextureRefractionBlur1Ratio", "uTextureRefractionBlur1Size", "uTextureRefractionBlur2Ratio", "uTextureRefractionBlur2Size", "uTextureRefractionBlur3Ratio", "uTextureRefractionBlur3Size", "uTextureRefractionBlur4Ratio", "uTextureRefractionBlur4Size", "uTextureRefractionBlur5Ratio", "uTextureRefractionBlur5Size", "uTextureRefractionBlur6Ratio", "uTextureRefractionBlur6Size", "uTextureRefractionBlur7Ratio", "uTextureRefractionBlur7Size" ],
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: function(e, t) {
                        return t.uTextureOutputSize[0];
                    },
                    height: function(e, t) {
                        return t.uTextureOutputSize[1];
                    }
                }
            }
        }) || this;
    }
    var ci, li = (o(hi, ci = wr), hi.prototype.getMeshCommand = function(e, t) {
        return this.commands.ssr_combine || (this.commands.ssr_combine = this.createREGLCommand(e, null, [ "aPosition", "aTexCoord" ], null, t.getElements())), 
        this.commands.ssr_combine;
    }, hi);
    function hi() {
        return ci.call(this, {
            vert: br,
            frag: "#define SHADER_NAME SSR_COMBINE\nprecision mediump float;\nuniform sampler2D TextureInput;\nuniform sampler2D TextureSSR;\nuniform vec2 uTextureOutputSize;\nvoid main() {\n  vec2 mS = gl_FragCoord.xy / uTextureOutputSize;\n  vec4 va = texture2D(TextureInput, mS);\n  vec4 vb = texture2D(TextureSSR, mS);\n  gl_FragColor = mix(va, vb, vb.a);\n}",
            uniforms: [ "uTextureOutputSize", "TextureInput", "TextureSSR" ],
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: function(e, t) {
                        return t.uTextureOutputSize[0];
                    },
                    height: function(e, t) {
                        return t.uTextureOutputSize[1];
                    }
                }
            }
        }) || this;
    }
    var di, vi = ((di = pi.prototype).render = function(e) {
        this._initShaders(), this._createTextures(e), this._blur(e);
        var t = {
            blurTex0: this._blur01Tex,
            blurTex1: this._blur11Tex,
            blurTex2: this._blur21Tex,
            blurTex3: this._blur31Tex,
            blurTex4: this._blur41Tex
        };
        return 5 < this._level && (t.blurTex5 = this._blur51Tex, t.blurTex6 = this._blur61Tex), 
        t;
    }, di._blur = function(e) {
        var t = this._blurUniforms;
        Ne((t = t || (this._blurUniforms = {
            uRGBMRange: 7,
            uBlurDir: [ 0, 0 ],
            uGlobalTexSize: [ 0, 0 ],
            uPixelRatio: [ 1, 1 ],
            uTextureBlurInputRatio: [ 1, 1 ],
            uTextureBlurInputSize: [ 0, 0 ],
            uTextureOutputRatio: [ 1, 1 ],
            uTextureOutputSize: [ 0, 0 ]
        })).uGlobalTexSize, e.width, e.height), this._blurOnce(this._blur0Shader, e, this._blur00FBO, this._blur01FBO, 5 < this._level ? .5 : 1), 
        this._blurOnce(this._blur1Shader, this._blur01FBO.color[0], this._blur10FBO, this._blur11FBO, .5), 
        this._blurOnce(this._blur2Shader, this._blur11FBO.color[0], this._blur20FBO, this._blur21FBO, .5), 
        this._blurOnce(this._blur3Shader, this._blur21FBO.color[0], this._blur30FBO, this._blur31FBO, .5), 
        this._blurOnce(this._blur4Shader, this._blur31FBO.color[0], this._blur40FBO, this._blur41FBO, .5), 
        5 < this._level && (this._blurOnce(this._blur5Shader, this._blur41FBO.color[0], this._blur50FBO, this._blur51FBO, .5), 
        this._blurOnce(this._blur6Shader, this._blur51FBO.color[0], this._blur60FBO, this._blur51FBO, .5));
    }, di._blurOnce = function(e, t, n, r, i) {
        var a = Math.ceil(i * t.width), o = Math.ceil(i * t.height);
        n.width === a && n.height === o || n.resize(a, o), r.width === a && r.height === o || r.resize(a, o);
        var s = this._blurUniforms;
        s.TextureBlurInput = t, s.inputRGBM = +this._inputRGBM, Ne(s.uBlurDir, 0, 1), Ne(s.uTextureBlurInputSize, t.width, t.height), 
        Ne(s.uTextureOutputSize, n.width, n.height), this._renderer.render(e, s, null, n), 
        s.inputRGBM = 1, Ne(s.uBlurDir, 1, 0), s.TextureBlurInput = n.color[0], Ne(s.uTextureBlurInputSize, n.width, n.height), 
        this._renderer.render(e, s, null, r);
    }, di.dispose = function() {
        this._blur0Shader && (this._blur0Shader.dispose(), delete this._blur0Shader, this._blur1Shader.dispose(), 
        this._blur2Shader.dispose(), this._blur3Shader.dispose(), this._blur4Shader.dispose(), 
        this._blur5Shader && (this._blur5Shader.dispose(), this._blur6Shader.dispose(), 
        delete this._blur5Shader)), this._blur00Tex && (delete this._blur00Tex, this._blur00FBO.destroy(), 
        this._blur01FBO.destroy(), this._blur10FBO.destroy(), this._blur11FBO.destroy(), 
        this._blur20FBO.destroy(), this._blur21FBO.destroy(), this._blur30FBO.destroy(), 
        this._blur31FBO.destroy(), this._blur40FBO.destroy(), this._blur41FBO.destroy(), 
        this._blur50FBO && (this._blur50FBO.destroy(), this._blur51FBO.destroy(), this._blur60FBO.destroy(), 
        this._blur61FBO.destroy()));
    }, di._createTextures = function(e) {
        if (!this._blur00Tex) {
            var t = e.width, n = e.height;
            this._blur00Tex = this._createColorTex(e, t, n), this._blur00FBO = this._createBlurFBO(this._blur00Tex), 
            this._blur01Tex = this._createColorTex(e), this._blur01FBO = this._createBlurFBO(this._blur01Tex), 
            t = Math.ceil(t / 2), n = Math.ceil(n / 2), this._blur10Tex = this._createColorTex(e, t, n), 
            this._blur10FBO = this._createBlurFBO(this._blur10Tex), this._blur11Tex = this._createColorTex(e, t, n), 
            this._blur11FBO = this._createBlurFBO(this._blur11Tex), t = Math.ceil(t / 2), n = Math.ceil(n / 2), 
            this._blur20Tex = this._createColorTex(e, t, n), this._blur20FBO = this._createBlurFBO(this._blur20Tex), 
            this._blur21Tex = this._createColorTex(e, t, n), this._blur21FBO = this._createBlurFBO(this._blur21Tex), 
            t = Math.ceil(t / 2), n = Math.ceil(n / 2), this._blur30Tex = this._createColorTex(e, t, n), 
            this._blur30FBO = this._createBlurFBO(this._blur30Tex), this._blur31Tex = this._createColorTex(e, t, n), 
            this._blur31FBO = this._createBlurFBO(this._blur31Tex), t = Math.ceil(t / 2), n = Math.ceil(n / 2), 
            this._blur40Tex = this._createColorTex(e, t, n), this._blur40FBO = this._createBlurFBO(this._blur40Tex), 
            this._blur41Tex = this._createColorTex(e, t, n), this._blur41FBO = this._createBlurFBO(this._blur41Tex), 
            5 < this._level && (t = Math.ceil(t / 2), n = Math.ceil(n / 2), this._blur50Tex = this._createColorTex(e, t, n), 
            this._blur50FBO = this._createBlurFBO(this._blur50Tex), this._blur51Tex = this._createColorTex(e, t, n), 
            this._blur51FBO = this._createBlurFBO(this._blur51Tex), t = Math.ceil(t / 2), n = Math.ceil(n / 2), 
            this._blur60Tex = this._createColorTex(e, t, n), this._blur60FBO = this._createBlurFBO(this._blur60Tex), 
            this._blur61Tex = this._createColorTex(e, t, n), this._blur61FBO = this._createBlurFBO(this._blur61Tex));
        }
    }, di._createColorTex = function(e, t, n) {
        var r = this._regl, i = t || e.width, a = n || e.height;
        return r.texture({
            min: "linear",
            mag: "linear",
            type: "uint8",
            width: i,
            height: a
        });
    }, di._createBlurFBO = function(e) {
        return this._regl.framebuffer({
            width: e.width,
            height: e.height,
            colors: [ e ],
            depth: !1,
            stencil: !1
        });
    }, di._initShaders = function() {
        if (!this._blur0Shader) {
            var e = {
                vert: br,
                uniforms: [ "inputRGBM", "uRGBMRange", "TextureBlurInput", "uBlurDir", "uGlobalTexSize", "uPixelRatio", "uTextureBlurInputRatio", "uTextureBlurInputSize", "uTextureOutputRatio", "uTextureOutputSize" ],
                extraCommandProps: {
                    viewport: {
                        x: 0,
                        y: 0,
                        width: function(e, t) {
                            return t.uTextureOutputSize[0];
                        },
                        height: function(e, t) {
                            return t.uTextureOutputSize[1];
                        }
                    }
                },
                frag: "#version 100\nprecision highp float;\nuniform float uRGBMRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 uBlurDir;\nuniform vec2 uPixelRatio;\nuniform vec2 uTextureBlurInputRatio;\nuniform vec2 uTextureBlurInputSize;\nuniform vec2 uTextureOutputRatio;\nuniform vec2 uTextureOutputSize;\nuniform float inputRGBM;\n#define SHADER_NAME TextureBlurTemp0\nvec2 rb;\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(inputRGBM == .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 vc() {\n  vec3 vd = .375 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vec2 pB;\n  vec2 ve = uPixelRatio.xy * uBlurDir.xy / uTextureOutputSize.xy;\n  pB = ve * 1.2;\n  vd += .3125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .3125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  return vec4(vd, 1.);\n}\nvoid main(void) {\n  rb = gl_FragCoord.xy / uTextureOutputSize.xy;\n  vec4 nZ = vc();\n  nZ = qE(nZ.rgb, uRGBMRange);\n  gl_FragColor = nZ;\n}"
            };
            this._blur0Shader = new wr(e), e.frag = "#version 100\nprecision highp float;\nuniform float uRGBMRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 uBlurDir;\nuniform vec2 uPixelRatio;\nuniform vec2 uTextureBlurInputRatio;\nuniform vec2 uTextureBlurInputSize;\nuniform vec2 uTextureOutputRatio;\nuniform vec2 uTextureOutputSize;\n#define SHADER_NAME TextureBlurTemp1\nvec2 rb;\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 vc() {\n  vec3 vd = .3125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vec2 pB;\n  vec2 ve = uPixelRatio.xy * uBlurDir.xy / uTextureOutputSize.xy;\n  pB = ve * 1.2857142857142858;\n  vd += .328125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .328125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  return vec4(vd, 1.);\n}\nvoid main(void) {\n  rb = gl_FragCoord.xy / uTextureOutputSize.xy;\n  vec4 nZ = vc();\n  nZ = qE(nZ.rgb, uRGBMRange);\n  gl_FragColor = nZ;\n}", 
            this._blur1Shader = new wr(e), e.frag = "#version 100\nprecision highp float;\nuniform float uRGBMRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 uBlurDir;\nuniform vec2 uPixelRatio;\nuniform vec2 uTextureBlurInputRatio;\nuniform vec2 uTextureBlurInputSize;\nuniform vec2 uTextureOutputRatio;\nuniform vec2 uTextureOutputSize;\n#define SHADER_NAME TextureBlurTemp2\nvec2 rb;\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 vc() {\n  vec3 vd = .2734375 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vec2 pB;\n  vec2 ve = uPixelRatio.xy * uBlurDir.xy / uTextureOutputSize.xy;\n  pB = ve * 1.3333333333333333;\n  vd += .328125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .328125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  pB = ve * 3.111111111111111;\n  vd += .03515625 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .03515625 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  return vec4(vd, 1.);\n}\nvoid main(void) {\n  rb = gl_FragCoord.xy / uTextureOutputSize.xy;\n  vec4 nZ = vc();\n  nZ = qE(nZ.rgb, uRGBMRange);\n  gl_FragColor = nZ;\n}", 
            this._blur2Shader = new wr(e), e.frag = "#version 100\nprecision highp float;\nuniform float uRGBMRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 uBlurDir;\nuniform vec2 uPixelRatio;\nuniform vec2 uTextureBlurInputRatio;\nuniform vec2 uTextureBlurInputSize;\nuniform vec2 uTextureOutputRatio;\nuniform vec2 uTextureOutputSize;\n#define SHADER_NAME TextureBlurTemp3\nvec2 rb;\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 vc() {\n  vec3 vd = .24609375 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vec2 pB;\n  vec2 ve = uPixelRatio.xy * uBlurDir.xy / uTextureOutputSize.xy;\n  pB = ve * 1.3636363636363635;\n  vd += .322265625 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .322265625 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  pB = ve * 3.1818181818181817;\n  vd += .0537109375 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .0537109375 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  return vec4(vd, 1.);\n}\nvoid main(void) {\n  rb = gl_FragCoord.xy / uTextureOutputSize.xy;\n  vec4 nZ = vc();\n  nZ = qE(nZ.rgb, uRGBMRange);\n  gl_FragColor = nZ;\n}", 
            this._blur3Shader = new wr(e), e.frag = "#version 100\nprecision highp float;\nuniform float uRGBMRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 uBlurDir;\nuniform vec2 uPixelRatio;\nuniform vec2 uTextureBlurInputRatio;\nuniform vec2 uTextureBlurInputSize;\nuniform vec2 uTextureOutputRatio;\nuniform vec2 uTextureOutputSize;\n#define SHADER_NAME TextureBlurTemp4\nvec2 rb;\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 vc() {\n  vec3 vd = .2255859375 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vec2 pB;\n  vec2 ve = uPixelRatio.xy * uBlurDir.xy / uTextureOutputSize.xy;\n  pB = ve * 1.3846153846153846;\n  vd += .314208984375 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .314208984375 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  pB = ve * 3.230769230769231;\n  vd += .06982421875 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .06982421875 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  pB = ve * 5.076923076923077;\n  vd += .003173828125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .003173828125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  return vec4(vd, 1.);\n}\nvoid main(void) {\n  rb = gl_FragCoord.xy / uTextureOutputSize.xy;\n  vec4 nZ = vc();\n  nZ = qE(nZ.rgb, uRGBMRange);\n  gl_FragColor = nZ;\n}", 
            this._blur4Shader = new wr(e), 5 < this._level && (e.frag = "#version 100\nprecision highp float;\nuniform float uRGBMRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 uBlurDir;\nuniform vec2 uGlobalTexSize;\nuniform vec2 uPixelRatio;\nuniform vec2 uTextureBlurInputRatio;\nuniform vec2 uTextureBlurInputSize;\nuniform vec2 uTextureOutputRatio;\nuniform vec2 uTextureOutputSize;\n#define SHADER_NAME TextureBlurTemp5\nvec2 rb;\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 vc() {\n  vec3 vd = .20947265625 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vec2 pB;\n  vec2 ve = uPixelRatio.xy * uBlurDir.xy / uTextureOutputSize.xy;\n  ve *= uGlobalTexSize.y * .00075;\n  pB = ve * 1.4;\n  vd += .30548095703125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .30548095703125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  pB = ve * 3.2666666666666666;\n  vd += .08331298828125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .08331298828125 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  pB = ve * 5.133333333333334;\n  vd += .00640869140625 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .00640869140625 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  return vec4(vd, 1.);\n}\nvoid main(void) {\n  rb = gl_FragCoord.xy / uTextureOutputSize.xy;\n  vec4 nZ = vc();\n  nZ = qE(nZ.rgb, uRGBMRange);\n  gl_FragColor = nZ;\n}", 
            this._blur5Shader = new wr(e), e.frag = "#version 100\nprecision highp float;\nuniform float uRGBMRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 uBlurDir;\nuniform vec2 uGlobalTexSize;\nuniform vec2 uPixelRatio;\nuniform vec2 uTextureBlurInputRatio;\nuniform vec2 uTextureBlurInputSize;\nuniform vec2 uTextureOutputRatio;\nuniform vec2 uTextureOutputSize;\n#define SHADER_NAME TextureBlurTemp6\nvec2 rb;\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 vc() {\n  vec3 vd = .196380615234375 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vec2 pB;\n  vec2 ve = uPixelRatio.xy * uBlurDir.xy / uTextureOutputSize.xy;\n  ve *= uGlobalTexSize.y * .00075;\n  pB = ve * 1.411764705882353;\n  vd += .2967529296875 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .2967529296875 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  pB = ve * 3.2941176470588234;\n  vd += .09442138671875 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .09442138671875 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  pB = ve * 5.176470588235294;\n  vd += .0103759765625 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy + pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  vd += .0103759765625 * (vec4(qI(texture2D(TextureBlurInput, min(rb.xy - pB.xy, 1. - 1e+0 / uTextureBlurInputSize.xy) * uTextureBlurInputRatio), uRGBMRange), 1.)).rgb;\n  return vec4(vd, 1.);\n}\nvoid main(void) {\n  rb = gl_FragCoord.xy / uTextureOutputSize.xy;\n  vec4 nZ = vc();\n  nZ = qE(nZ.rgb, uRGBMRange);\n  gl_FragColor = nZ;\n}", 
            this._blur6Shader = new wr(e));
        }
    }, pi);
    function pi(e, t, n) {
        void 0 === n && (n = 5), this._regl = e, this._renderer = new st(e), this._inputRGBM = t, 
        this._level = n;
    }
    var mi, _i = function() {
        function e(e) {
            this._regl = e, this._renderer = new st(e);
        }
        e.getUniformDeclares = function() {
            var i = [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ], n = new Array(16);
            return [ "TextureDepthTest", "TextureDepth", "uGlobalTexSize", "uSsrFactor", "uSsrQuality", "uPreviousGlobalTexSize", "TextureToBeRefracted", "uTextureToBeRefractedSize", {
                name: "uInvProjMatrix",
                type: "function",
                fn: function(e, t) {
                    return x(n, t.projMatrix);
                }
            }, {
                name: "uTaaCornersCSLeft",
                type: "array",
                length: 2,
                fn: function(e, t) {
                    var n = Math.tan(.5 * t.fov), r = t.uGlobalTexSize[0] / t.uGlobalTexSize[1] * n;
                    return ee(i[0], r, n, r, -n), ee(i[1], -r, n, -r, -n), i;
                }
            }, {
                name: "uReprojectViewProj",
                type: "function",
                fn: function(e, t) {
                    return W([], t.prevProjViewMatrix, t.cameraWorldMatrix);
                }
            } ];
        }, e.getDefines = function() {
            return {
                HAS_SSR: 1
            };
        };
        var t = e.prototype;
        return t._blur = function(e) {
            return this._initShaders(), this._createTextures(e), this._blurFBO.width === e.width && this._blurFBO.height === e.height || this._blurFBO.resize(e.width, e.height), 
            this._renderer.render(this._blurShader, {
                resolution: [ e.width, e.height ],
                textureSource: e
            }, null, this._blurFBO), this._blurFBO.color[0];
        }, t.combine = function(e, t) {
            return this._initShaders(), this._createTextures(e), this._combineFBO.width === e.width && this._combineFBO.height === e.height || this._combineFBO.resize(e.width, e.height), 
            t = this._blur(t), this._renderer.render(this._combineShader, {
                TextureInput: e,
                TextureSSR: t,
                uTextureOutputSize: [ e.width, e.height ]
            }, null, this._combineFBO), this._combineTex;
        }, t.genMipMap = function(e) {
            var t = this._blurPass.render(e), n = t.blurTex0, r = t.blurTex1, i = t.blurTex2, a = t.blurTex3, o = t.blurTex4, s = t.blurTex5, u = t.blurTex6, f = this._uniforms || {
                inputRGBM: 0,
                uRGBMRange: 7,
                TextureRefractionBlur0: null,
                TextureRefractionBlur1: null,
                TextureRefractionBlur2: null,
                TextureRefractionBlur3: null,
                TextureRefractionBlur4: null,
                TextureRefractionBlur5: null,
                TextureRefractionBlur6: null,
                TextureRefractionBlur7: null,
                uTextureOutputRatio: [ 1, 1 ],
                uTextureOutputSize: [ 0, 0 ],
                uTextureRefractionBlur0Ratio: [ 1, 1 ],
                uTextureRefractionBlur0Size: [ 0, 0 ],
                uTextureRefractionBlur1Ratio: [ 1, 1 ],
                uTextureRefractionBlur1Size: [ 0, 0 ],
                uTextureRefractionBlur2Ratio: [ 1, 1 ],
                uTextureRefractionBlur2Size: [ 0, 0 ],
                uTextureRefractionBlur3Ratio: [ 1, 1 ],
                uTextureRefractionBlur3Size: [ 0, 0 ],
                uTextureRefractionBlur4Ratio: [ 1, 1 ],
                uTextureRefractionBlur4Size: [ 0, 0 ],
                uTextureRefractionBlur5Ratio: [ 1, 1 ],
                uTextureRefractionBlur5Size: [ 0, 0 ],
                uTextureRefractionBlur6Ratio: [ 1, 1 ],
                uTextureRefractionBlur6Size: [ 0, 0 ],
                uTextureRefractionBlur7Ratio: [ 1, 1 ],
                uTextureRefractionBlur7Size: [ 0, 0 ]
            };
            f.TextureRefractionBlur0 = e, f.TextureRefractionBlur1 = n, f.TextureRefractionBlur2 = r, 
            f.TextureRefractionBlur3 = i, f.TextureRefractionBlur4 = a, f.TextureRefractionBlur5 = o, 
            f.TextureRefractionBlur6 = s, f.TextureRefractionBlur7 = u, Ne(f.uTextureRefractionBlur0Size, e.width, e.height), 
            Ne(f.uTextureRefractionBlur1Size, n.width, n.height), Ne(f.uTextureRefractionBlur2Size, r.width, r.height), 
            Ne(f.uTextureRefractionBlur3Size, i.width, i.height), Ne(f.uTextureRefractionBlur4Size, a.width, a.height), 
            Ne(f.uTextureRefractionBlur5Size, o.width, o.height), Ne(f.uTextureRefractionBlur6Size, s.width, s.height), 
            Ne(f.uTextureRefractionBlur7Size, u.width, u.height);
            var c = this._targetFBO, l = Math.ceil(2 * e.height);
            return c.width === e.width && c.height === l || c.resize(e.width, l), Ne(f.uTextureOutputSize, c.width, c.height), 
            this._renderer.render(this._mipmapShader, f, null, c), this._outputTex;
        }, t.getMipmapTexture = function() {
            return this._outputTex || (this._outputTex = this._renderer.regl.texture({
                min: "linear",
                mag: "linear",
                type: "uint8",
                width: 2,
                height: 2
            })), this._outputTex;
        }, t.dispose = function() {
            this._blurPass && (this._blurPass.dispose(), delete this._blurPass, this._mipmapShader.dispose(), 
            this._blurShader.dispose(), this._targetFBO.destroy(), this._combineFBO.destroy(), 
            this._blurFBO.destroy());
        }, t._initShaders = function() {
            this._blurPass || (this._blurPass = new vi(this._regl, !1, 7), this._mipmapShader = new ui(), 
            this._combineShader = new li(), this._blurShader = new Mr({
                blurOffset: 2
            }));
        }, t._createTextures = function(e) {
            if (!this._targetFBO) {
                var t = this._regl, n = Math.ceil(2 * e.height);
                this._outputTex = this._outputTex || t.texture({
                    min: "linear",
                    mag: "linear",
                    type: "uint8",
                    width: e.width,
                    height: n
                }), this._outputTex.resize(e.width, n), this._targetFBO = t.framebuffer({
                    width: e.width,
                    height: n,
                    colors: [ this._outputTex ],
                    depth: !1,
                    stencil: !1
                }), this._combineTex = t.texture({
                    min: "linear",
                    mag: "linear",
                    type: "uint8",
                    width: e.width,
                    height: e.height
                }), this._combineFBO = t.framebuffer({
                    width: e.width,
                    height: e.height,
                    colors: [ this._combineTex ],
                    depth: !1,
                    stencil: !1
                }), this._blurTex = t.texture({
                    min: "linear",
                    mag: "linear",
                    type: "uint8",
                    width: e.width,
                    height: e.height
                }), this._blurFBO = t.framebuffer({
                    width: e.width,
                    height: e.height,
                    colors: [ this._blurTex ],
                    depth: !1,
                    stencil: !1
                });
            }
        }, e;
    }(), gi = ((mi = xi.prototype).render = function(e, t, n) {
        var r = n.projViewMatrix, i = n.lineColor, a = n.lineWidth;
        this._clear(), this._resize();
        var o = new Nn(e);
        this._drawExtentFBO(o, r), this._drawOutlineFBO(i, a, t);
    }, mi._init = function() {
        this.fboExtent = this._createFBO(), this.extentShader = new ur({
            vert: "attribute vec3 aPosition;\nuniform mat4 projViewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 positionMatrix;\n#include <get_output>  \nvoid main() {\n  mat4 pn = getPositionMatrix();\n  gl_Position = projViewMatrix * modelMatrix * pn * getPosition(aPosition);\n}",
            frag: "precision highp float;\nvoid main() {\n  gl_FragColor = vec4(.0, .0, .0, 1.);\n}",
            uniforms: [ "projViewMatrix", "positionMatrix" ],
            positionAttribute: "POSITION",
            extraCommandProps: {
                viewport: this._viewport,
                cull: {
                    enable: !1
                }
            }
        }), this.outlineShader = new wr({
            vert: br,
            frag: "precision highp float;\nprecision highp int;\nvarying vec2 vTexCoord;\nuniform sampler2D maskTexture;\nuniform vec2 texSize;\nuniform vec3 visibleEdgeColor;\nuniform float lineWidth;\nvoid main() {\n  vec2 qo = (1. / texSize) * lineWidth;\n  vec4 qp = vec4(1., .0, .0, 1.) * vec4(qo.x, qo.y, qo.x, qo.y);\n  vec4 qq = texture2D(maskTexture, vTexCoord + qp.xy);\n  vec4 qr = texture2D(maskTexture, vTexCoord - qp.xy);\n  vec4 qs = texture2D(maskTexture, vTexCoord + qp.yw);\n  vec4 qt = texture2D(maskTexture, vTexCoord - qp.yw);\n  float qu = (qq.r - qr.r) * .7;\n  float qv = (qs.r - qt.r) * .7;\n  float py = length(vec2(qu, qv));\n  float qw = min(qq.g, qr.g);\n  float qx = min(qs.g, qt.g);\n  float qy = min(qw, qx);\n  gl_FragColor = 1. - qy > .001 ? vec4(visibleEdgeColor, 1.) * vec4(py) : vec4(.0);\n}",
            uniforms: [ "texSize", "visibleEdgeColor", "maskTexture", "lineWidth" ],
            positionAttribute: "POSITION",
            extraCommandProps: {
                viewport: this._viewport,
                depth: {
                    enable: !0,
                    mask: !1,
                    func: "always"
                },
                blend: {
                    enable: !0,
                    func: {
                        src: "one",
                        dst: "one minus src alpha"
                    },
                    equation: "add"
                }
            }
        });
    }, mi._drawExtentFBO = function(e, t) {
        this._renderer.render(this.extentShader, {
            projViewMatrix: t
        }, e, this.fboExtent);
    }, mi._drawOutlineFBO = function(e, t, n) {
        this._renderer.render(this.outlineShader, {
            texSize: [ this._width / 2, 2 * this._height / 2 ],
            visibleEdgeColor: e || [ 1, 0, 0 ],
            maskTexture: this.fboExtent,
            lineWidth: t || 1
        }, null, n);
    }, mi._createFBO = function() {
        return this.regl.framebuffer({
            color: this.regl.texture({
                width: this._width,
                height: this._height,
                wrap: "clamp",
                mag: "linear",
                min: "linear"
            }),
            depth: !0
        });
    }, mi._clear = function() {
        this.regl.clear({
            color: [ 1, 1, 1, 1 ],
            depth: 1,
            framebuffer: this.fboExtent
        });
    }, mi.dispose = function() {
        this.fboExtent && this.fboExtent.destroy();
    }, mi._resize = function() {
        this._width = Ge(this._viewport.width.data) ? this._viewport.width.data() : this._viewport.width, 
        this._height = Ge(this._viewport.height.data) ? this._viewport.height.data() : this._viewport.height, 
        !this.fboExtent || this.fboExtent.width === this._width && this.fboExtent.height === this._height || this.fboExtent.resize(this._width, this._height);
    }, xi);
    function xi(e, t) {
        this._renderer = e, this.regl = e.regl, this._viewport = t, this._width = 1, this._height = 1, 
        this._init();
    }
    var bi, yi = ((bi = Ti.prototype)._init = function() {
        this._depthFBOViewport = this._viewport, this._depthShader = new ur({
            vert: "attribute vec3 aPosition;\nuniform mat4 projViewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 positionMatrix;\n#include <get_output>\nvoid main() {\n  mat4 pn = getPositionMatrix();\n  gl_Position = projViewMatrix * modelMatrix * pn * getPosition(aPosition);\n}",
            frag: "#ifdef GL_ES\nprecision highp float;\n#endif\nvec4 qz(float qA) {\n  const vec4 qB = vec4(1., 256., 256. * 256., 256. * 256. * 256.);\n  const vec4 qC = vec4(1. / 256., 1. / 256., 1. / 256., .0);\n  vec4 qD = fract(qA * qB);\n  qD -= qD.gbaa * qC;\n  return qD;\n}\nvoid main() {\n  gl_FragColor = qz(gl_FragCoord.z);\n}",
            uniforms: [ "projViewMatrix" ],
            extraCommandProps: {
                viewport: this._depthFBOViewport
            }
        }), this._depthFBO = this.renderer.regl.framebuffer({
            color: this.renderer.regl.texture({
                width: this._width,
                height: this._height,
                wrap: "clamp",
                mag: "linear",
                min: "linear"
            }),
            depth: !0
        });
    }, bi.render = function(e, t) {
        this._resize(), this.renderer.clear({
            color: [ 1, 0, 0, 1 ],
            depth: 1,
            framebuffer: this._depthFBO
        });
        var n = new Nn(e), r = t.eyePos, i = t.lookPoint, a = t.verticalAngle, o = t.horizonAngle, s = this._createProjViewMatrix(r, i, a, o);
        return this._renderDepth(n, s), {
            depthMap: this._depthFBO,
            projViewMatrixFromViewpoint: s
        };
    }, bi._renderDepth = function(e, t) {
        var n = {
            projViewMatrix: t
        };
        this.renderer.render(this._depthShader, n, e, this._depthFBO);
    }, bi._createProjViewMatrix = function(e, t, n, r) {
        var i = n / r, a = Math.sqrt(Math.pow(e[0] - t[0], 2) + Math.pow(e[1] - t[1], 2) + Math.pow(e[2] - t[2], 2));
        return W([], _([], r * Math.PI / 180, i, 1, a), K([], e, t, [ 0, 1, 0 ]));
    }, bi.dispose = function() {
        this._depthFBO && this._depthFBO.destroy();
    }, bi._resize = function() {
        this._width = Ge(this._viewport.width.data) ? this._viewport.width.data() : this._viewport.width, 
        this._height = Ge(this._viewport.height.data) ? this._viewport.height.data() : this._viewport.height, 
        !this._depthFBO || this._depthFBO.width === this._width && this._depthFBO.height === this._height || this._depthFBO.resize(this._width, this._height);
    }, Ti);
    function Ti(e, t) {
        this.renderer = e, this._viewport = t, this._width = 1, this._height = 1, this._init();
    }
    var wi, Ei = (o(Si, wi = ur), Si);
    function Si(e) {
        var t = e && e.extraCommandProps || {};
        return wi.call(this, {
            vert: "#define SHADER_NAME HEATMAP\nfloat rI(const vec2 rJ, const float t) {\n  return mix(rJ[0], rJ[1], t);\n}\nuniform mat4 projViewModelMatrix;\nuniform float extrudeScale;\nuniform float heatmapIntensity;\nattribute vec3 aPosition;\nvarying vec2 vExtrude;\n#ifdef HAS_HEAT_WEIGHT\nuniform lowp float heatmapWeightT;\nattribute highp vec2 aWeight;\nvarying highp float weight;\n#else\nuniform highp float heatmapWeight;\n#endif\nuniform mediump float heatmapRadius;\nconst highp float rK = 1. / 255. / 16.;\n#define GAUSS_COEF 0.3989422804014327\nvoid main(void) {\n  \n#ifdef HAS_HEAT_WEIGHT\nweight = rI(aWeight, heatmapWeightT);\n#else\nhighp float nf = heatmapWeight;\n#endif\nmediump float rL = heatmapRadius;\n  vec2 rM = vec2(mod(aPosition.xy, 2.) * 2. - 1.);\n  float rN = sqrt(-2. * log(rK / nf / heatmapIntensity / GAUSS_COEF)) / 3.;\n  vExtrude = rN * rM;\n  vec2 rO = vExtrude * rL * extrudeScale;\n  vec4 oJ = vec4(floor(aPosition.xy * .5) + rO, aPosition.z, 1);\n  gl_Position = projViewModelMatrix * oJ;\n}",
            frag: "#define SHADER_NAME HEATMAP\nprecision mediump float;\nuniform highp float heatmapIntensity;\nvarying vec2 vExtrude;\n#ifdef HAS_HEAT_WEIGHT\nvarying highp float weight;\n#else\nuniform highp float heatmapWeight;\n#endif\n#define GAUSS_COEF 0.3989422804014327\nvoid main() {\n  \n#ifndef HAS_HEAT_WEIGHT\nhighp float nf = heatmapWeight;\n#endif\nfloat py = -.5 * 3. * 3. * dot(vExtrude, vExtrude);\n  float rP = nf * heatmapIntensity * GAUSS_COEF * exp(py);\n  gl_FragColor = vec4(rP, 1., 1., 1.);\n}",
            uniforms: [ "heatmapRadius", "heatmapIntensity", "heatmapWeight", "extrudeScale", {
                name: "extrudeScale",
                type: "function",
                fn: function(e, t) {
                    return t.resolution / t.dataResolution * t.tileRatio;
                }
            }, {
                name: "projViewModelMatrix",
                type: "function",
                fn: function(e, t) {
                    return W([], t.projViewMatrix, t.modelMatrix);
                }
            } ],
            extraCommandProps: ke({}, t, {
                blend: {
                    enable: !0,
                    func: {
                        src: "one",
                        dst: "one"
                    },
                    equation: "add"
                }
            })
        }) || this;
    }
    var Ai, Mi = [ -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, 1, -1, 1 ], Ri = "#ifdef GL_EXT_shader_texture_lod\n#extension GL_EXT_shader_texture_lod : enable\n#define textureCubeLod(tex, uv, lod) textureCubeLodEXT(tex, uv, lod)\n#else\n#define textureCubeLod(tex, uv, lod) textureCube(tex, uv, lod)\n#endif\nprecision highp float;\nvarying vec3 vWorldPos;\n#ifdef USE_AMBIENT\nuniform vec3 diffuseSPH[9];\n#else\nuniform samplerCube cubeMap;\nuniform float bias;\nuniform float size;\nuniform float environmentExposure;\n#endif\n#if defined(INPUT_RGBM) || defined(ENC_RGBM)\nuniform float rgbmRange;\n#endif\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 qJ(const in samplerCube qK, const in vec3 qL, const in float qM, const in float qN) {\n  vec3 qO = qL;\n  float qP = 1. - 1. / qM;\n  vec3 qQ = abs(qO);\n  float qR = max(max(qQ.x, qQ.y), qQ.z);\n  if(qQ.x != qR)\n    qO.x *= qP;\n  if(qQ.y != qR)\n    qO.y *= qP;\n  if(qQ.z != qR)\n    qO.z *= qP;\n  return textureCubeLod(qK, qO, qN);\n}\nvec3 qS(const in vec3 oP, const in vec3 qT[9]) {\n  float x = oP.x;\n  float y = oP.y;\n  float z = oP.z;\n  vec3 ng = (qT[0] + qT[1] * x + qT[2] * y + qT[3] * z + qT[4] * z * x + qT[5] * y * z + qT[6] * y * x + qT[7] * (3. * z * z - 1.) + qT[8] * (x * x - y * y));\n  return max(ng, vec3(.0));\n}\nfloat pJ(const in vec2 pK) {\n  vec3 pL = fract(vec3(pK.xyx) * .1031);\n  pL += dot(pL, pL.yzx + 19.19);\n  return fract((pL.x + pL.y) * pL.z);\n}\nvoid main() {\n  vec4 qU;\n#ifdef USE_AMBIENT\nvec3 oP = normalize(vWorldPos + mix(-.5 / 255., .5 / 255., pJ(gl_FragCoord.xy)) * 2.);\n  qU = vec4(qS(oP, diffuseSPH), 1.);\n#ifdef ENC_RGBM\nqU = qE(qU.rgb, rgbmRange);\n#endif\n#else\nqU = qJ(cubeMap, normalize(vWorldPos), size, bias);\n  qU.rgb *= environmentExposure;\n#endif\n#ifdef ENC_RGBM\ngl_FragColor = vec4(qU.rgb, 1.);\n#elif !defined(USE_AMBIENT) && defined(INPUT_RGBM)\ngl_FragColor = vec4(qI(qU, rgbmRange), 1.);\n#else\ngl_FragColor = qU;\n#endif\n#ifdef USE_HDR\nvec3 nZ = gl_FragColor.rgb;\n  nZ = nZ / (nZ.rgb + vec3(1.));\n  nZ = pow(nZ, vec3(1. / 2.2));\n  gl_FragColor.rgb = nZ;\n#endif\n}", Oi = function(t) {
        function e() {
            return t.call(this, {
                vert: "attribute vec3 aPosition;\nuniform mat4 projMatrix;\nuniform mat4 viewMatrix;\nvarying vec3 vWorldPos;\nvoid main() {\n  vWorldPos = aPosition;\n  mat4 rQ = mat4(mat3(viewMatrix));\n  vec4 rR = projMatrix * rQ * vec4(vWorldPos, 1.);\n  gl_Position = rR.xyww;\n}",
                frag: Ri,
                uniforms: [ "rgbmRange", "cubeMap", "bias", "size", "environmentExposure", "diffuseSPH[9]", "viewMatrix", "projMatrix" ],
                extraCommandProps: {
                    depth: {
                        enable: !0,
                        range: [ 1, 1 ],
                        func: "lequal"
                    },
                    viewport: {
                        x: 0,
                        y: 0,
                        width: function(e, t) {
                            return t.resolution[0];
                        },
                        height: function(e, t) {
                            return t.resolution[1];
                        }
                    }
                }
            }) || this;
        }
        o(e, t);
        var n = e.prototype;
        return n.setMode = function(e, t, n) {
            var r = {};
            return e && (r.INPUT_RGBM = 1), t && (r.ENC_RGBM = 1), 0 === n && (r.USE_AMBIENT = 1), 
            this._skyboxMesh ? this._skyboxMesh[0].setDefines(r) : this._meshDefines = r, this;
        }, n.draw = function(e) {
            return this._skyboxMesh || this._createSkyboxMesh(e), t.prototype.draw.call(this, e, this._skyboxMesh);
        }, n._createSkyboxMesh = function(e) {
            var t = new Ft({
                aPosition: new Int8Array(Mi)
            }, null, Mi.length / 3);
            t.generateBuffers(e), this._skyboxMesh = [ new on(t) ], this._meshDefines && (this._skyboxMesh[0].setDefines(this._meshDefines), 
            delete this._meshDefines);
        }, n.dispose = function() {
            if (this._skyboxMesh) {
                var e = this._skyboxMesh[0];
                e.geometry.dispose(), e.dispose();
            }
            return delete this._skyboxMesh, t.prototype.dispose.call(this);
        }, e;
    }(ur), Bi = (o(Ci, Ai = ur), Ci);
    function Ci(e) {
        var t = {
            blend: {
                enable: !0,
                func: {
                    src: "one",
                    dst: "one minus src alpha"
                },
                equation: "add"
            },
            viewport: {
                x: 0,
                y: 0,
                width: function(e, t) {
                    return t.inputTexture.width;
                },
                height: function(e, t) {
                    return t.inputTexture.height;
                }
            }
        };
        return e && e.extraCommandProps && ke(t, e.extraCommandProps), Ai.call(this, {
            vert: "#define SHADER_NAME HEATMAP_DISPLAY\nuniform mat4 projViewModelMatrix;\nattribute vec3 aPosition;\nvoid main() {\n  gl_Position = projViewModelMatrix * vec4(aPosition, 1.);\n}",
            frag: "#define SHADER_NAME HEATMAP_DISPLAY\nprecision mediump float;\nuniform sampler2D inputTexture;\nuniform sampler2D colorRamp;\nuniform vec2 textureOutputSize;\nuniform float heatmapOpacity;\nvoid main() {\n  vec2 rb = gl_FragCoord.xy / textureOutputSize.xy;\n  float t = texture2D(inputTexture, rb).r;\n  vec4 nZ = texture2D(colorRamp, vec2(t, .5));\n  gl_FragColor = nZ * heatmapOpacity;\n}",
            uniforms: [ "heatmapOpacity", "colorRamp", "inputTexture", {
                name: "projViewModelMatrix",
                type: "function",
                fn: function(e, t) {
                    return W([], t.projViewMatrix, t.modelMatrix);
                }
            }, {
                name: "textureOutputSize",
                type: "function",
                fn: function(e) {
                    return [ e.drawingBufferWidth, e.drawingBufferHeight ];
                }
            } ],
            extraCommandProps: t
        }) || this;
    }
    var Fi, Ii = (o(Pi, Fi = ur), Pi);
    function Pi(e) {
        return void 0 === e && (e = {}), Fi.call(this, {
            vert: "precision highp float;\nprecision highp sampler2D;\nconst float nx = 3.141592653589793;\nuniform mat4 projMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelMatrix;\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nattribute vec3 aNormal;\nvarying vec2 vuv;\nvarying vec3 vpos;\nvarying vec3 vnormal;\nvarying mat3 vtbnMatrix;\nvec4 oG(mat4 oH, mat4 oI, vec3 oJ) {\n  return oH * modelMatrix * oI * vec4(oJ, 1.);\n}\nvec3 oK(in vec3 oJ, in vec3 oL) {\n  return normalize(oJ + oL);\n}\nmat3 oM(in vec3 om) {\n  vec3 t = normalize(cross(vec3(.0, .0, 1.), om));\n  vec3 b = normalize(cross(om, t));\n  return mat3(t, b, om);\n}\nvoid oN() {\n  \n}\nvoid main(void) {\n  vuv = aTexCoord;\n  vpos = (modelMatrix * vec4(aPosition, 1.)).xyz;\n  vnormal = aNormal;\n  vtbnMatrix = oM(vnormal);\n  gl_Position = oG(projMatrix, viewMatrix, vpos);\n  oN();\n}",
            frag: "precision highp float;\nprecision highp sampler2D;\nuniform sampler2D texWaveNormal;\nuniform sampler2D texWavePerturbation;\nuniform vec3 octaveTextureRepeat;\nuniform vec4 waveParams;\nuniform vec2 waveDirection;\nuniform vec4 waterColor;\nuniform vec3 lightingDirection;\nuniform vec3 lightingIntensity;\nuniform vec3 camPos;\nuniform float timeElapsed;\nvarying vec2 vuv;\nvarying vec3 vpos;\nvarying vec3 vnormal;\nvarying mat3 vtbnMatrix;\nconst vec2 mP = vec2(6. / 25., 5. / 24.);\nvec2 mQ(sampler2D mR, vec2 mS) {\n  return 2. * texture2D(mR, mS).rg - 1.;\n}\nfloat mT(vec2 mS) {\n  return texture2D(texWavePerturbation, mS).b;\n}\nvec3 mU(sampler2D mR, vec2 mS) {\n  return 2. * texture2D(mR, mS).rgb - 1.;\n}\nfloat mV(vec2 mS, float mW) {\n  return fract(mW);\n}\nfloat mX(vec2 mS, float mW) {\n  float mY = mV(mS, mW);\n  return 1. - abs(1. - 2. * mY);\n}\nvec3 mZ(sampler2D na, vec2 mS, float mW, float nb) {\n  float nc = waveParams[2];\n  float nd = waveParams[3];\n  vec2 ne = mQ(na, mS) * nc;\n  float mY = mV(mS, mW + nb);\n  float nf = mX(mS, mW + nb);\n  vec2 ng = mS;\n  ng -= ne * (mY + nd);\n  ng += nb;\n  ng += (mW - mY) * mP;\n  return vec3(ng, nf);\n}\nconst float nh = .3737;\nconst float ni = 7.77;\nvec3 nj(sampler2D nk, sampler2D nl, vec2 mS, vec2 nm, float mW) {\n  float nn = waveParams[0];\n  vec2 no = mW * -nm;\n  float np = mT(mS * nh) * ni;\n  vec3 nq = mZ(nl, mS + no, mW + np, .0);\n  vec3 nr = mZ(nl, mS + no, mW + np, .5);\n  vec3 ns = mU(nk, nq.xy) * nq.z;\n  vec3 nt = mU(nk, nr.xy) * nr.z;\n  vec3 nu = normalize(ns + nt);\n  nu.xy *= nn;\n  nu.z = sqrt(1. - dot(nu.xy, nu.xy));\n  return nu;\n}\nvec3 nv(vec2 mS, float mW) {\n  float nw = waveParams[1];\n  return nj(texWaveNormal, texWavePerturbation, mS * nw, waveDirection, mW);\n}\nconst float nx = 3.141592653589793;\nconst float ny = 1. / nx;\nconst float nz = .3183098861837907;\nconst float nA = 1.570796326794897;\nstruct PBRShadingWater {\n  float NdotL;\n  float NdotV;\n  float NdotH;\n  float VdotH;\n  float LdotH;\n  float VdotN;\n};\nfloat nB = 2.2;\nvec3 nC(float nD, vec3 nE, float nF) {\n  return nE + (nF - nE) * pow(1. - nD, 5.);\n}\nfloat nG(float nH, float nI) {\n  float nJ = nI * nI;\n  float nK = nH * nH;\n  float nL = pow((nK * (nJ - 1.) + 1.), nB) * nx;\n  return nJ / nL;\n}\nfloat nM(float nN) {\n  return .25 / (nN * nN);\n}\nvec3 nO(in PBRShadingWater nP, float nI, vec3 nQ, float nR) {\n  vec3 nS = nC(nP.VdotH, nQ, nR);\n  float nT = nG(nP.NdotH, nI);\n  float nU = nM(nP.LdotH);\n  return (nT * nU) * nS;\n}\nvec3 nV(const vec3 x) {\n  return (x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14);\n}\nconst float nW = 2.2;\nconst float nX = .4545454545;\nvec4 nY(vec4 nZ) {\n  return vec4(pow(nZ.rgb, vec3(nX)), nZ.w);\n}\nvec3 oa(vec3 nZ) {\n  return pow(nZ, vec3(nW));\n}\nconst vec3 ob = vec3(.02, 1., 5.);\nconst vec2 oc = vec2(.02, .1);\nconst float nI = .06;\nconst vec3 od = vec3(0, .6, .9);\nconst vec3 oe = vec3(.72, .92, 1.);\nPBRShadingWater of;\nvec3 og(in float oh, in vec3 oi, in vec3 oj) {\n  float ok = pow((1. - oh), ob[2]);\n  return mix(oj, oi, ok);\n}\nvec3 ol(in vec3 om, in vec3 on, in vec3 oo, vec3 nZ, in vec3 op, in vec3 oq, in float or) {\n  vec3 os = oa(nZ);\n  vec3 ot = normalize(oo + on);\n  of.NdotL = clamp(dot(om, oo), .0, 1.);\n  of.NdotV = clamp(dot(om, on), .001, 1.);\n  of.VdotN = clamp(dot(on, om), .001, 1.);\n  of.NdotH = clamp(dot(om, ot), .0, 1.);\n  of.VdotH = clamp(dot(on, ot), .0, 1.);\n  of.LdotH = clamp(dot(oo, ot), .0, 1.);\n  float ou = max(dot(oq, on), .0);\n  vec3 ov = oa(oe);\n  vec3 ow = oa(od);\n  vec3 oe = og(ou, ov, ow);\n  float ox = max(dot(oq, oo), .0);\n  oe *= .1 + ox * .9;\n  float oy = clamp(or, .8, 1.);\n  vec3 oz = nC(of.VdotN, vec3(ob[0]), ob[1]) * oe * oy;\n  vec3 oA = os * mix(oe, ox * op * ny, 2. / 3.) * oy;\n  vec3 oB = vec3(.0);\n  if(ou > .0 && ox > .0) {\n    vec3 oC = nO(of, nI, vec3(oc[0]), oc[1]);\n    vec3 oD = op * ny * or;\n    oB = of.NdotL * oD * oC;\n  }\n  return nV(oz + oA + oB);\n}\nvoid main() {\n  vec3 oq = vnormal;\n  vec3 oE = nv(vuv, timeElapsed);\n  vec3 om = normalize(vtbnMatrix * oE);\n  vec3 on = -normalize(vpos - camPos);\n  vec3 oo = normalize(-lightingDirection);\n  float or = 1.;\n  vec4 oF = vec4(ol(om, on, oo, waterColor.rgb, lightingIntensity, oq, or), waterColor.w);\n  gl_FragColor = nY(oF);\n}",
            uniforms: [ "projMatrix", "viewMatrix", "camPos", "timeElapsed", "waveParams", "waveDirection", "waterColor", "lightingDirection", "lightingIntensity", "texWaveNormal", "texWavePerturbation" ],
            defines: e.defines || {},
            extraCommandProps: e.extraCommandProps || {}
        }) || this;
    }
    var Di = "undefined" != typeof Promise ? Promise : wn, Ni = {
        get: function(t, i) {
            var a = Ni._getClient(), e = new Di(function(n, r) {
                if (a.open("GET", t, !0), i) {
                    for (var e in i.headers) a.setRequestHeader(e, i.headers[e]);
                    a.withCredentials = "include" === i.credentials, i.responseType && (a.responseType = i.responseType);
                }
                a.onreadystatechange = Ni._wrapCallback(a, function(e, t) {
                    e ? r(e) : n(t);
                }), a.send(null);
            });
            return e.xhr = a, e;
        },
        _wrapCallback: function(e, t) {
            return function() {
                if (4 === e.readyState) if (200 === e.status) "arraybuffer" === e.responseType ? 0 === e.response.byteLength ? t(new Error("http status 200 returned without content.")) : t(null, {
                    data: e.response,
                    cacheControl: e.getResponseHeader("Cache-Control"),
                    expires: e.getResponseHeader("Expires"),
                    contentType: e.getResponseHeader("Content-Type")
                }) : t(null, e.responseText); else {
                    if (0 === e.status) return;
                    t(new Error(e.statusText + "," + e.status));
                }
            };
        },
        _getClient: function() {
            var t;
            try {
                t = new XMLHttpRequest();
            } catch (e) {
                try {
                    t = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        t = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (t) {}
                }
            }
            return t;
        },
        getArrayBuffer: function(e, t) {
            return (t = t || {}).responseType = "arraybuffer", Ni.get(e, t);
        }
    };
    function Li(e) {
        return null == e;
    }
    function qi(e) {
        return !Li(e);
    }
    function Zi(e) {
        return "number" == typeof e && isFinite(e);
    }
    function zi(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) e[r] = n[r];
        }
        return e;
    }
    Ni.getJSON = function(e, t) {
        var n = Ni.get(e, t), r = n.then(function(e) {
            return e ? JSON.parse(e) : null;
        });
        return r.xhr = n.xhr, r;
    };
    var Ui, Gi = ((Ui = Hi.prototype).iterate = function(e, t) {
        var n = this.gltf[t];
        if (n) {
            var r = 0;
            for (var i in n) e(i, n[i], r++);
        }
    }, Ui.createNode = function(e, t) {
        var n = {};
        return qi(e.name) && (n.name = e.name), qi(e.children) && (n.children = e.children), 
        qi(e.jointName) && (n.jointName = e.jointName), qi(e.matrix) && (n.matrix = e.matrix), 
        qi(e.rotation) && (n.rotation = e.rotation), qi(e.scale) && (n.scale = e.scale), 
        qi(e.translation) && (n.translation = e.translation), qi(e.extras) && (n.extras = e.extras), 
        qi(e.meshes) && (n.meshes = e.meshes.map(function(e) {
            return t[e];
        })), n;
    }, Ui.getBaseColorTexture = function(e) {
        var t, n, r = this.gltf.materials[e];
        if (void 0 === (n = r.instanceTechnique && r.instanceTechnique.values ? (t = r.instanceTechnique).values.diffuse : (t = r).values.tex || t.values.diffuseTex || t.values.diffuse) || void 0 === this.gltf.textures) return null;
        var i = this.gltf.textures[n];
        if (!i) return null;
        var a = this.gltf.samplers[i.sampler];
        return {
            format: i.format || 6408,
            internalFormat: i.internalFormat || 6408,
            type: i.type || 5121,
            sampler: a,
            source: this.gltf.images[i.source]
        };
    }, Ui.getMaterial = function() {
        return null;
    }, Ui.getAnimations = function() {
        return null;
    }, Hi);
    function Hi(e, t) {
        this.rootPath = e, this.gltf = t;
    }
    var ki, ji = [ "SCALAR", 1, "VEC2", 2, "VEC3", 3, "VEC4", 4, "MAT2", 4, "MAT3", 9, "MAT4", 16 ], Vi = ((ki = Xi.prototype)._requestData = function(a, o) {
        var s = this, e = this.gltf, t = e.accessors[o], n = e.bufferViews[t.bufferView], r = e.buffers[n.buffer];
        if ("binary_glTF" !== n.buffer && "KHR_binary_glTF" !== n.buffer && r.uri) {
            var i = r.uri, u = 0 === r.uri.indexOf("data:application/") ? r.uri : this.rootPath + "/" + i;
            return this.requests[u] ? this.requests[u].then(function() {
                var e = s._toTypedArray(o, s.buffers[u]), t = e.array, n = e.itemSize;
                return {
                    name: a,
                    accessorName: o,
                    array: t,
                    itemSize: n
                };
            }) : this.requests[u] = Ni.getArrayBuffer(u, null).then(function(e) {
                var t = e.data;
                s.buffers[u] = t;
                var n = s._toTypedArray(o, t), r = n.array, i = n.itemSize;
                return {
                    name: a,
                    accessorName: o,
                    array: r,
                    itemSize: i
                };
            });
        }
        var f = this._toTypedArray(o, this.glbBuffer.buffer, this.ignoreGLBOffset ? 0 : this.glbBuffer.byteOffset), c = f.array, l = f.itemSize;
        return Di.resolve({
            name: a,
            accessorName: o,
            array: c,
            itemSize: l
        });
    }, ki._toTypedArray = function(e, t, n) {
        void 0 === n && (n = 0);
        var r = this.gltf, i = r.accessors[e], a = (r.bufferViews[i.bufferView].byteOffset || 0) + (i.byteOffset || 0) + n, o = this._getTypeItemSize(i.type), s = this._getArrayCtor(i.componentType), u = i.byteStride;
        return u && u !== o * s.BYTES_PER_ELEMENT ? (console.warn("GLTF interleaved accessors not supported"), 
        new s([])) : (a % s.BYTES_PER_ELEMENT != 0 && (t = t.slice(a, a + i.count * o * s.BYTES_PER_ELEMENT), 
        a = 0), {
            array: new s(t, a, i.count * o),
            itemSize: o
        });
    }, ki._getArrayCtor = function(e) {
        switch (e) {
          case 5120:
            return Int8Array;

          case 5121:
            return Uint8Array;

          case 5122:
            return Int16Array;

          case 5123:
            return Uint16Array;

          case 5124:
            return Int32Array;

          case 5125:
            return Uint32Array;

          case 5126:
            return Float32Array;
        }
        throw new Error("unsupported bufferView's componeng type: " + e);
    }, ki._getTypeItemSize = function(e) {
        var t = ji.indexOf(e);
        return ji[t + 1];
    }, Xi);
    function Xi(e, t, n, r) {
        this.rootPath = e, this.gltf = t, this.glbBuffer = n, this.buffers = {}, this.requests = {}, 
        this.ignoreGLBOffset = r;
    }
    var Wi, Ki = ((Wi = Yi.prototype).iterate = function(e, t) {
        var n = this.gltf[t];
        if (n) for (var r = 0; r < n.length; r++) e(r, n[r], r);
    }, Wi.createNode = function(e, t, n) {
        var r = {};
        return zi(r, e), qi(e.mesh) && (r.meshes = [ t[e.mesh] ]), qi(e.skin) && (r.skin = n[e.skin], 
        r.skinIndex = e.skin), !qi(e.weights) && r.meshes ? r.weights = r.meshes[0].weights : r.weights = e.weights, 
        r;
    }, Wi.getMaterial = function(e) {
        var i = this.gltf.materials[e], t = i.pbrMetallicRoughness, n = i.normalTexture, r = i.occlusionTexture, a = i.emissiveTexture, o = i.extensions, s = [];
        if (t && (t.name = "pbrMetallicRoughness", s.push(this._getPBRMaterial(t, [ "baseColorTexture", "metallicRoughnessTexture" ]))), 
        n && s.push(this._getTextureInfo(n, "normalTexture")), r && s.push(this._getTextureInfo(r, "occlusionTexture")), 
        a && s.push(this._getTextureInfo(a, "emissiveTexture")), o) {
            var u = o.KHR_materials_pbrSpecularGlossiness;
            u && (u.name = "pbrSpecularGlossiness", s.push(this._getPBRMaterial(u, [ "diffuseTexture", "specularGlossinessTexture" ])));
        }
        return Di.all(s).then(function(e) {
            var t = {};
            zi(t, i);
            for (var n = 0; n < e.length; n++) t[e[n].name] = e[n];
            if (t.extensions) {
                var r = t.extensions.KHR_materials_unlit;
                r && (t.unlit = r), delete t.extensions;
            }
            return {
                material: t
            };
        });
    }, Wi._getPBRMaterial = function(r, e) {
        for (var t = [], n = 0; n < e.length; n++) {
            var i = r[e[n]];
            i && t.push(this._getTextureInfo(i, e[n]));
        }
        return Di.all(t).then(function(e) {
            var t = {};
            zi(t, r);
            for (var n = 0; n < e.length; n++) delete e[n].index, t[e[n].name] = e[n];
            return t;
        });
    }, Wi._getTextureInfo = function(n, e) {
        var t = n.index, r = n.extensions;
        return qi(t) ? (r && r.KHR_texture_transform && (n.KHR_texture_transform = {}, zi(n.KHR_texture_transform, r.KHR_texture_transform), 
        delete n.extensions), n.name = e, this._getTexture(t).then(function(e) {
            var t = {
                texture: e
            };
            return zi(t, n), delete t.index, t;
        })) : null;
    }, Wi._getTexture = function(e) {
        var r = this, i = this.gltf.textures[e];
        if (!i) return null;
        var a = this.gltf.images[i.source];
        return this._loadImage(a).then(function(e) {
            var t = {
                image: {
                    array: e.data,
                    width: e.width,
                    height: e.height,
                    index: i.source,
                    mimeType: a.mimeType,
                    name: a.name,
                    extensions: a.extensions,
                    extras: a.extras
                }
            };
            zi(t, i), delete t.sampler;
            var n = qi(i.sampler) ? r.gltf.samplers[i.sampler] : void 0;
            return n && (t.sampler = n), t;
        });
    }, Wi._loadImage = function(e) {
        if (!qi(e.bufferView)) {
            var t = e.uri, n = 0 === t.indexOf("data:image/") ? t : this.rootPath + "/" + t;
            return this._requestFromUrl(n);
        }
        var r = this.gltf.bufferViews[e.bufferView];
        if (this.buffers[e.bufferView]) return Di.resolve(this.buffers[e.bufferView]);
        var i = this.gltf.buffers[r.buffer];
        return i.uri ? this._requestFromArrayBuffer(i.uri, r, e) : this.glbBuffer ? this._requestFromGlbBuffer(r, e) : null;
    }, Wi._requestFromUrl = function(e) {
        var t = this;
        return this.requests[e] ? this.requests[e].then(function() {
            return t.buffers[e];
        }) : this.requests[e] = this._getImageInfo(e, e);
    }, Wi._requestFromArrayBuffer = function(e, a, o) {
        var s = this, u = o.bufferView;
        return this.requests[e] ? this.requests[e].then(function() {
            return s.buffers[u];
        }) : Ni.getArrayBuffer(e, null).then(function(e) {
            var t = e.data, n = s._createDataView(a, t), r = new Blob([ n ], {
                type: o.mimeType
            }), i = URL.createObjectURL(r);
            return s._getImageInfo(u, i);
        });
    }, Wi._requestFromGlbBuffer = function(e, t) {
        var n = this._createDataView(e, this.glbBuffer.buffer), r = new Blob([ n ], {
            type: t.mimeType
        }), i = URL.createObjectURL(r);
        return this._getImageInfo(t.bufferView, i);
    }, Wi._getImageInfo = function(i, e) {
        var a = this;
        return new Di(function(n, r) {
            a._requestImage(e, function(e, t) {
                e ? r(e) : (a.buffers[i] = t, n(a.buffers[i]));
            });
        });
    }, Wi._createDataView = function(e, t, n) {
        n = n || 0;
        var r = e.byteOffset + n, i = e.byteLength;
        return t.slice(r, r + i);
    }, Wi._transformArrayBufferToBase64 = function(e, t) {
        for (var n = new Array(e.byteLength), r = 0; r < e.byteLength; r++) n[r] = String.fromCharCode(e[r]);
        return n.join(""), "data:" + (t = t || "image/png") + ";base64," + window.btoa(unescape(encodeURIComponent(n)));
    }, Wi.getAnimations = function(n) {
        var t = this, r = [];
        return n.forEach(function(e) {
            r.push(t.getSamplers(e.samplers));
        }), Di.all(r).then(function(e) {
            for (var t = 0; t < e.length; t++) n[t].samplers = e[t];
            return n;
        });
    }, Wi.getSamplers = function(n) {
        for (var e = [], t = 0; t < n.length; t++) (qi(n[t].input) || qi(n[t].output)) && (e.push(this.accessor._requestData("input", n[t].input)), 
        e.push(this.accessor._requestData("output", n[t].output)));
        return Di.all(e).then(function(e) {
            for (var t = 0; t < e.length / 2; t++) n[t].input = e[2 * t], n[t].output = e[2 * t + 1], 
            n[t].interpolation || (n[t].interpolation = "LINEAR");
            return n;
        });
    }, Yi);
    function Yi(e, t, n, r) {
        this.rootPath = e, this.gltf = t, this.glbBuffer = n, this.buffers = {}, this.requests = {}, 
        this._requestImage = r, this.accessor = new Vi(e, t, n);
    }
    var Qi = "undefined" != typeof TextDecoder ? new TextDecoder("utf-8") : null, Ji = 1313821514, $i = 5130562, ea = (ta.read = function(e, t) {
        void 0 === t && (t = 0);
        var n = new DataView(e, t), r = n.getUint32(4, !0);
        if (1 === r) return ta.readV1(n, t);
        if (2 === r) return ta.readV2(e, t);
        throw new Error("Unsupported glb version : " + r);
    }, ta.readV1 = function(e, t) {
        var n = e.getUint32(8, !0), r = e.getUint32(12, !0);
        if (n !== e.buffer.byteLength - t) throw new Error("Length in GLB header is inconsistent with glb's byte length.");
        var i = na(e.buffer, 20 + t, r);
        return {
            json: JSON.parse(i),
            glbBuffer: {
                byteOffset: 20 + t + r,
                buffer: e.buffer
            }
        };
    }, ta.readV2 = function(e, t) {
        for (var n, r, i = new DataView(e, t + 12), a = 0; a < i.byteLength; ) {
            var o = i.getUint32(a, !0);
            a += 4;
            var s = i.getUint32(a, !0);
            if (a += 4, s === Ji) n = na(e, t + 12 + a, o); else if (s === $i) {
                var u = t + 12 + a;
                r = e.slice(u, u + o);
            }
            a += o;
        }
        return {
            json: JSON.parse(n),
            glbBuffer: {
                byteOffset: t,
                buffer: r
            }
        };
    }, ta);
    function ta() {}
    function na(e, t, n) {
        if (Qi) {
            var r = new Uint8Array(e, t, n);
            return Qi.decode(r);
        }
        return function(e) {
            for (var t = e.length, n = "", r = 0; r < t; ) {
                var i = e[r++];
                if (128 & i) {
                    var a = ia[i >> 3 & 7];
                    if (!(64 & i) || !a || t < r + a) return null;
                    for (i &= 63 >> a; 0 < a; --a) {
                        var o = e[r++];
                        if (128 != (192 & o)) return null;
                        i = i << 6 | 63 & o;
                    }
                }
                n += String.fromCharCode(i);
            }
            return n;
        }(new Uint8Array(e, t, n));
    }
    var ra, ia = [ 1, 1, 1, 1, 2, 2, 3, 0 ], aa = [ 0, 0, 0 ], oa = [ 0, 0, 0, 1 ], sa = [ 1, 1, 1 ], ua = [ 0, 0, 0 ], fa = [ 0, 0, 0, 1 ], ca = [ 1, 1, 1 ], la = {
        PREVIOUS: null,
        NEXT: null,
        PREINDEX: null,
        NEXTINDEX: null,
        INTERPOLATION: null
    }, ha = {
        _getTRSW: function(e, t, n, r, i, a, o) {
            for (var s = e.animations, u = 0; u < s.length; u++) for (var f = s[u], c = f.channels, l = 0; l < c.length; l++) {
                var h = c[l];
                h.target.node === t && ("translation" === h.target.path ? this._getAnimateData(r, f.samplers[h.sampler], n, 1) : "rotation" === h.target.path ? this._getQuaternion(i, f.samplers[h.sampler], n, 1) : "scale" === h.target.path ? this._getAnimateData(a, f.samplers[h.sampler], n, 1) : "weights" === h.target.path && o && this._getAnimateData(o, f.samplers[h.sampler], n, o.length));
            }
        },
        _getAnimateData: function(e, t, n, r) {
            switch (t.interpolation) {
              case "LINEAR":
                var i = this._getPreNext(la, t, n, +r);
                i && (e = function(e, t, n, r) {
                    for (var i = 0; i < e.length; i++) e[i] = t[i] + r * (n[i] - t[i]);
                    return e;
                }(e, i.PREVIOUS, i.NEXT, i.INTERPOLATION));
                break;

              case "STEP":
                var a = this._getPreNext(la, t, n, +r);
                a && (e = function(e, t) {
                    for (var n = 0; n < e.length; n++) e[n] = t[n];
                    return e;
                }.apply(void 0, [ e ].concat(a.PREVIOUS)));
                break;

              case "CUBICSPLINE":
                var o = this._getPreNext(la, t, n, 3 * r);
                o && (e = this._getCubicSpline(e, o, t.input.array, 3 * r));
            }
            return e;
        },
        _getQuaternion: function(e, t, n) {
            switch (t.interpolation) {
              case "LINEAR":
                var r = this._getPreNext(la, t, n, 1);
                r && we(e, r.PREVIOUS, r.NEXT, r.INTERPOLATION);
                break;

              case "STEP":
                var i = this._getPreNext(la, t, n, 1);
                i && (e = ee.apply(ye, [ e ].concat(i.PREVIOUS)));
                break;

              case "CUBICSPLINE":
                var a = this._getPreNext(la, t, n, 3);
                if (a) {
                    for (var o = 0; o < a.PREVIOUS.length; o++) a.PREVIOUS[o] = Math.acos(a.PREVIOUS[o]), 
                    a.NEXT[o] = Math.acos(a.NEXT[o]);
                    e = this._getCubicSpline(e, a, t.input.array, 3);
                    for (var s = 0; s < e.length; s++) e[s] = Math.cos(e[s]);
                }
            }
            return e;
        },
        _getPreNext: function(e, t, n, r) {
            var i, a, o, s = t.input.array, u = t.output.array, f = t.output.itemSize;
            (n < s[0] || n > s[s.length - 1]) && (n = Math.max(s[0], Math.min(s[s.length - 1], n))), 
            n === s[s.length - 1] && (n = s[0]);
            for (var c = 0; c < s.length - 1; c++) if (n >= s[c] && n < s[c + 1]) {
                var l = s[c];
                o = (n - l) / (s[a = (i = c) + 1] - l);
                break;
            }
            if (!a) return null;
            e.PREINDEX = i, e.NEXTINDEX = a, e.INTERPOLATION = o;
            var h = f * r;
            return e.PREVIOUS = u.subarray(e.PREINDEX * h, (e.PREINDEX + 1) * h), e.NEXT = u.subarray(e.NEXTINDEX * h, (e.NEXTINDEX + 1) * h), 
            e;
        },
        _getCubicSpline: function(e, t, n, r) {
            for (var i = t.INTERPOLATION, a = n[t.PREINDEX], o = n[t.NEXTINDEX], s = 0; s < 3; s++) {
                var u = t.PREVIOUS[r + s], f = (o - a) * t.PREVIOUS[2 * r + s], c = t.NEXT[3 + s], l = (o - a) * t.NEXT[s], h = (2 * Math.pow(i, 3) - 3 * Math.pow(i, 2) + 1) * u + (Math.pow(i, 3) - 2 * Math.pow(i, 2) + i) * f + (2 * -Math.pow(i, 3) + 3 * Math.pow(i, 2)) * c + (Math.pow(i, 3) - Math.pow(i, 2)) * l;
                e[s] = h;
            }
            return e;
        },
        getAnimationClip: function(e, t, n, r) {
            var i = t.nodes[n] && t.nodes[n].weights;
            C.apply(j, [ aa ].concat(ua)), ee.apply(ye, [ oa ].concat(fa)), C.apply(j, [ sa ].concat(ca)), 
            this._getTRSW(t, n, r, aa, oa, sa, i), m(e, oa, aa, sa);
        },
        getTimeSpan: function(e) {
            if (!e.animations) return null;
            var a = -1 / 0, o = 1 / 0;
            return e.animations.forEach(function(e) {
                for (var t = e.channels, n = 0; n < t.length; n++) {
                    var r = t[n], i = e.samplers[r.sampler].input.array;
                    i[i.length - 1] > a && (a = i[i.length - 1]), i[0] < o && (o = i[0]);
                }
            }), {
                max: a,
                min: o
            };
        }
    }, da = "undefined" == typeof document ? null : document.createElement("canvas"), va = ((ra = pa.prototype).load = function() {
        var e = this._loadScene(), t = this._loadAnimations();
        return Di.all([ e, t ]).then(function(e) {
            return e[0].animations = e[1], e[0];
        });
    }, pa.getAnimationClip = function(e, t, n, r) {
        return ha.getAnimationClip(e, t, n, r);
    }, pa.getAnimationTimeSpan = function(e) {
        return ha.getTimeSpan(e);
    }, ra._init = function(e, t, n) {
        this.gltf = t, this.version = t.asset ? +t.asset.version : 1, this.rootPath = e, 
        this.glbBuffer = n, this.buffers = {}, this.requests = {}, this.options.requestImage = this.options.requestImage || ma, 
        2 === this.version ? (this.accessor = new Vi(e, t, n, !0), this.adapter = new Ki(e, t, n, this.options.requestImage)) : (this.accessor = new Vi(e, t, n), 
        this.adapter = new Gi(e, t));
    }, ra._parseNodes = function(e, n) {
        var t, r = this;
        if (e.children && 0 < e.children.length) {
            if (!Zi(e.children[0]) && (Li(t = e.children[0]) || "string" != typeof t && (null === t.constructor || t.constructor !== String))) return e;
            var i = e.children.map(function(e) {
                var t = n[e];
                return t.nodeIndex = e, r._parseNodes(t, n);
            });
            e.children = i;
        }
        if (qi(e.skin)) {
            var a = e.skin.joints;
            if (a && a.length && Zi(a[0])) {
                var o = e.skin.joints.map(function(e) {
                    return n[e];
                });
                e.skin.joints = o;
            }
        }
        return e;
    }, ra._loadScene = function() {
        var s = this;
        return this._loadNodes().then(function(i) {
            var a, o = s.scenes = [];
            for (var e in i) i[e] = s._parseNodes(i[e], i), i[e].nodeIndex = Number(e) ? Number(e) : e;
            s.adapter.iterate(function(e, t, n) {
                var r = {};
                t.name && (r.name = t.name), t.nodes && (r.nodes = t.nodes.map(function(e) {
                    return i[e];
                })), s.gltf.scene === e && (a = n), o.push(r);
            }, "scenes");
            var t = {
                scene: a,
                scenes: o,
                nodes: i,
                meshes: s.meshes,
                skins: s.skins
            };
            return s.gltf.extensions && (t.extensions = s.gltf.extensions), t;
        });
    }, ra._loadNodes = function() {
        var i = this;
        return this._loadMeshes().then(function() {
            var r = i.nodes = {};
            return i.adapter.iterate(function(e, t) {
                var n = i.adapter.createNode(t, i.meshes, i.skins);
                r[e] = n;
            }, "nodes"), r;
        });
    }, ra._loadSkins = function() {
        var r = this;
        this.skins = {};
        var i = [];
        return this.adapter.iterate(function(t, e, n) {
            i.push(r._loadSkin(e).then(function(e) {
                e.index = n, r.skins[t] = e;
            }));
        }, "skins"), i;
    }, ra._loadSkin = function(t) {
        var e = t.inverseBindMatrices;
        return this.accessor._requestData("inverseBindMatrices", e).then(function(e) {
            return t.inverseBindMatrices = e, t;
        });
    }, ra._loadAnimations = function() {
        var e = this.gltf.animations;
        return qi(e) ? this.adapter.getAnimations(e) : null;
    }, ra._loadMeshes = function() {
        var r = this;
        this.meshes = {};
        var i = [];
        return this.adapter.iterate(function(t, e, n) {
            i.push(r._loadMesh(e).then(function(e) {
                e.index = n, r.meshes[t] = e;
            }));
        }, "meshes"), i = i.concat(this._loadSkins()), Di.all(i);
    }, ra._loadMesh = function(n) {
        var t = this, e = n.primitives.map(function(e) {
            return t._loadPrimitive(e);
        });
        return Di.all(e).then(function(e) {
            var t = {};
            return zi(t, n), t.primitives = e, t;
        });
    }, ra._loadPrimitive = function(r) {
        var i = this, e = [], t = r.attributes, n = this._loadMaterial(r);
        n && e.push(n);
        var a = null;
        for (var o in t) {
            var s = this.accessor._requestData(o, t[o]);
            s && e.push(s);
        }
        if (qi(r.indices)) {
            var u = this.accessor._requestData("indices", r.indices);
            u && e.push(u);
        }
        if (qi(r.targets)) for (var f = 0; f < r.targets.length; f++) {
            var c = r.targets[f];
            for (var l in c) {
                var h = this.accessor._requestData(l + "_" + f, c[l]);
                h && e.push(h);
            }
        }
        return Di.all(e).then(function(e) {
            var n;
            i.transferables = [];
            var t = {
                attributes: e.reduce(function(e, t) {
                    return t.material ? (a = t.material, t.transferables && t.transferables.forEach(function(e) {
                        i.transferables.indexOf(e) < 0 && i.transferables.push(e);
                    })) : ("indices" === t.name ? n = t.array : e[t.name] = {
                        array: t.array,
                        itemSize: t.itemSize,
                        accessorName: t.accessorName
                    }, i.transferables.indexOf(t.array.buffer) < 0 && i.transferables.push(t.array.buffer)), 
                    e;
                }, {}),
                material: a
            };
            return n && (t.indices = n), t.mode = qi(r.mode) ? r.mode : 4, qi(r.extras) && (t.extras = r.extras), 
            t;
        });
    }, ra._loadMaterial = function(e) {
        var i = e.material;
        if (2 === this.version) return qi(i) ? this.adapter.getMaterial(i) : null;
        var a = this.adapter.getBaseColorTexture(i);
        return a ? this._loadImage(a.source).then(function(e) {
            var t = [ e.buffer ], n = a.source;
            e.index = n, zi(a.source, n), a.source.image = e;
            var r = {
                baseColorTexture: a
            };
            return i.name && (r.name = i.name), i.extensions && (r.extensions = i.extensions), 
            r.extensions && (delete r.extensions.KHR_binary_glTF, delete r.extensions.binary_glTF, 
            0 === Object.keys(r.extensions).length && delete r.extensions), i.extras && (r.extras = i.extras), 
            {
                material: r,
                transferables: t
            };
        }) : null;
    }, ra._loadImage = function(e) {
        var n = this;
        if (e.bufferView || e.extensions && (e.extensions.KHR_binary_glTF || e.extensions.binary_glTF)) {
            var t = e.bufferView ? e : e.extensions.KHR_binary_glTF || e.extensions.binary_glTF;
            if (e.extensions && (e.mimeType = t.mimeType, e.width = t.width, e.height = t.height), 
            this.buffers[t.bufferView]) return Di.resolve(this.buffers[t.bufferView]);
            var r = this.gltf.bufferViews[t.bufferView], i = (r.byteOffset || 0) + this.glbBuffer.byteOffset, a = r.byteLength, o = this.buffers[t.bufferView] = new Uint8Array(this.glbBuffer.buffer, i, a);
            return Di.resolve(o);
        }
        var s = e.uri, u = this.rootPath + "/" + s;
        return this.requests[u] ? this.requests[u].then(function() {
            return n.buffers[u];
        }) : this.requests[u] = Ni.getArrayBuffer(u, null).then(function(e) {
            var t = e.data;
            return n.buffers[u] = t, new Uint8Array(t);
        });
    }, pa);
    function pa(e, t, n) {
        if (this.options = n || {}, t.buffer instanceof ArrayBuffer) {
            var r = ea.read(t.buffer, t.byteOffset), i = r.json, a = r.glbBuffer;
            this._init(e, i, a);
        } else this._init(e, t);
    }
    function ma(e, r) {
        var i = new Image();
        i.crossOrigin = "", i.onload = function() {
            if (da) {
                da.width = i.width, da.height = i.height;
                var e = da.getContext("2d");
                e.drawImage(i, 0, 0, i.width, i.height);
                var t = e.getImageData(0, 0, i.width, i.height), n = {
                    width: i.width,
                    height: i.height,
                    data: new Uint8Array(t.data)
                };
                r(null, n);
            } else r(new Error("There is no canvas to draw image!"));
        }, i.onerror = function(e) {
            r(e);
        }, i.src = e;
    }
    var _a, ga = [], xa = ((_a = ba.prototype).setJointTexture = function(e) {
        this.jointTexture = e;
    }, _a.update = function(e) {
        x(ga, e);
        for (var t = 0; t < this.joints.length; ++t) {
            var n = this.joints[t], r = this.jointMatrices[t];
            W(r, ga, n.nodeMatrix), W(r, r, this.inverseBindMatrices[t]);
        }
        this.jointTexture({
            width: 4,
            type: "float",
            height: this.joints.length,
            data: this.jointData
        });
    }, _a.dispose = function() {
        this.jointTexture.destroy();
    }, ba);
    function ba(e, t, n) {
        this._regl = e, this.joints = t, this.inverseBindMatrices = [], this.jointMatrices = [], 
        this.jointData = new Float32Array(16 * t.length);
        for (var r = 0; r < t.length; ++r) this.inverseBindMatrices.push(new Float32Array(n.buffer, n.byteOffset + 16 * Float32Array.BYTES_PER_ELEMENT * r, 16)), 
        this.jointMatrices.push(new Float32Array(this.jointData.buffer, 16 * Float32Array.BYTES_PER_ELEMENT * r, 16));
        this.jointTexture = e.texture(), this.jointTextureSize = [ 4, 6 ];
    }
    var ya, Ta = [ 0, 0, 0 ], wa = [ 0, 0, 0, 1 ], Ea = [ 1, 1, 1 ], Sa = [ 0, 0, 0 ], Aa = [ 0, 0, 0, 1 ], Ma = [ 1, 1, 1 ], Ra = ((ya = Oa.prototype).setMatrix = function(e) {
        return m(e = e || [], this.rotation, this.translation, this.scale), e;
    }, ya.decompose = function(e) {
        d(this.translation, e), p(this.rotation, e), v(this.scale, e);
    }, ya.update = function(e) {
        d(Sa, e), p(Aa, e), v(Ma, e), D(Sa, Ta) || B(this.translation, Sa), De(Aa, wa) || Fe(this.rotation, Aa), 
        D(Ma, Ea) || B(this.scale, Ma);
    }, Oa);
    function Oa(e, t, n) {
        void 0 === e && (e = [ 0, 0, 0 ]), void 0 === t && (t = [ 0, 0, 0, 1 ]), void 0 === n && (n = [ 1, 1, 1 ]), 
        this.translation = e, this.rotation = t, this.scale = n;
    }
    var Ba, Ca = [], Fa = 0, Ia = [ "points", "lines", "line strip", "line loop", "triangles", "triangle strip", "triangle fan" ], Pa = {
        9728: "nearest",
        9729: "linear",
        9984: "nearest mipmap nearest",
        9985: "linear mipmap nearest",
        9986: "nearest mipmap linear",
        9987: "linear mipmap linear",
        33071: "clamp ro edge",
        33684: "mirrored repeat",
        10497: "repeat"
    }, Da = ((Ba = Na.prototype).getMeshesInfo = function() {
        var t = this;
        return this.geometries.length || this.gltf.scenes[0].nodes.forEach(function(e) {
            t._parserNode(e, t.geometries);
        }), this.geometries;
    }, Ba.dispose = function() {
        for (var e in this.getMeshesInfo().forEach(function(e) {
            for (var t in e.geometry.dispose(), e.materialInfo) e.materialInfo[t].destroy && e.materialInfo[t].destroy();
        }), this.gltf.nodes) {
            var t = this.gltf.nodes[e];
            t.skin && t.skin.jointTexture && t.skin.jointTexture.destroy();
        }
    }, Ba.updateAnimation = function(e, t, n) {
        var r = this, i = this.gltf;
        Fa = i.animations ? va.getAnimationTimeSpan(i) : null;
        var a = (t ? .001 * e % (Fa.max - Fa.min) : .001 * e) * n;
        for (var o in i.scenes[0].nodes.forEach(function(e) {
            r._updateNodeMatrix(a, e);
        }), this.gltf.nodes) {
            var s = this.gltf.nodes[o];
            s.skin && s.skin.update(s.nodeMatrix), s.weights && this._fillMorphWeights(s.morphWeights);
        }
    }, Ba._updateNodeMatrix = function(t, e, n) {
        var r = this, i = e.trs;
        i && i.setMatrix(e.localMatrix), n ? W(e.nodeMatrix, n, e.localMatrix) : l(e.nodeMatrix, e.localMatrix);
        var a = e.nodeMatrix;
        if (e.children && e.children.forEach(function(e) {
            r._updateNodeMatrix(t, e, a);
        }), va.getAnimationClip(Ca, this.gltf, Number(e.nodeIndex), t), e.trs.update(Ca), 
        e.weights) for (var o = 0; o < e.weights.length; o++) e.morphWeights[o] = e.weights[o];
    }, Ba._parserNode = function(n, r, e) {
        var i = this;
        if (!n.isParsed) {
            n.nodeMatrix = n.nodeMatrix || X([]), n.localMatrix = n.localMatrix || X([]), n.matrix ? (n.trs = new Ra(), 
            n.trs.decompose(n.matrix)) : n.trs = new Ra(n.translation, n.rotation, n.scale);
            var t = n.trs;
            t && t.setMatrix(n.localMatrix), e ? W(n.nodeMatrix, e, n.localMatrix) : l(n.nodeMatrix, n.localMatrix);
            var a = n.nodeMatrix;
            if (n.children) for (var o = 0; o < n.children.length; o++) {
                var s = n.children[o];
                this._parserNode(s, r, a);
            }
            if (n.skin) {
                var u = n.skin;
                n.trs = new Ra(), n.skin = new xa(this.regl, u.joints, u.inverseBindMatrices.array);
            }
            n.weights && (n.morphWeights = [ 0, 0, 0, 0 ]), Ue(n.mesh) && (n.mesh = n.meshes[0], 
            (n.mesh.node = n).mesh.primitives.forEach(function(e) {
                var t = function(e) {
                    var t = {};
                    for (var n in e.attributes) t[n] = e.attributes[n].array;
                    if (t.POSITION_0) for (var r = 0; r < 4; r++) t["POSITION_" + r] || (t["POSITION_" + r] = new Array(t.POSITION.length).fill(0));
                    var i = new Ft(t, e.indices, 0, {
                        primitive: Ve(e.mode) ? Ia[e.mode] : e.mode,
                        positionAttribute: "POSITION",
                        normalAttribute: "NORMAL",
                        uv0Attribute: "TEXCOORD_0",
                        uv1Attribute: "TEXCOORD_1"
                    });
                    return i.data.NORMAL || i.createNormal("NORMAL"), i;
                }(e);
                r.push({
                    geometry: t,
                    nodeMatrix: a,
                    materialInfo: i._createMaterialInfo(e.material, n),
                    animationMatrix: n.trs.setMatrix()
                });
            })), n.isParsed = !0;
        }
    }, Ba._createMaterialInfo = function(e, t) {
        var n = {
            baseColorFactor: [ 1, 1, 1, 1 ]
        };
        if (t.skin && (n.skinAnimation = 1, n.jointTextureSize = [ 4, 6 ], n.numJoints = t.skin.joints.length, 
        n.jointTexture = t.skin.jointTexture), t.morphWeights && (n.morphWeights = t.morphWeights), 
        e) {
            var r = e.pbrMetallicRoughness;
            if (r) {
                var i = r.metallicRoughnessTexture, a = r.baseColorTexture;
                if (a) {
                    var o = this._toTexture(a);
                    n.baseColorTexture = o;
                } else r.baseColorFactor && (n.baseColorFactor = r.baseColorFactor);
                if (i) {
                    var s = this._toTexture(i);
                    n.metallicRoughnessTexture = s;
                } else Ue(r.metallicFactor) && (n.metallicFactor = r.metallicFactor), Ue(r.roughnessFactor) && (n.roughnessFactor = r.roughnessFactor);
            }
            var u = e.pbrSpecularGlossiness;
            if (u) for (var f in u) u[f].texture ? n[f] = this._toTexture(u[f]) : n[f] = u[f];
            if (e.normalTexture) {
                var c = this._toTexture(e.normalTexture);
                n.normalTexture = c;
            }
            if (e.occlusionTexture) {
                var l = this._toTexture(e.occlusionTexture);
                n.occlusionTexture = l;
            }
            if (e.emissiveTexture) {
                var h = this._toTexture(e.emissiveTexture);
                n.emissiveTexture = h;
            }
            e.emissiveFactor && (n.emissiveFactor = e.emissiveFactor);
        }
        return n;
    }, Ba._toTexture = function(e) {
        var t = e.texture.image.array, n = e.texture.sampler || {}, r = e.texture.image.width, i = e.texture.image.height;
        return this.regl.texture({
            width: r,
            height: i,
            data: t,
            mag: Pa[n.magFilter] || Pa[9729],
            min: Pa[n.minFilter] || Pa[9729],
            wrapS: Pa[n.wrapS] || Pa[10497],
            wrapT: Pa[n.wrapT] || Pa[10497]
        });
    }, Ba._fillMorphWeights = function(e) {
        if (e.length < 4) for (var t = 0; t < 4; t++) Ue(e[t]) || (e[t] = 0);
        return e;
    }, Na);
    function Na(e, t) {
        this.gltf = e, this.regl = t, this.geometries = [];
    }
    function La(e, t) {
        return new va(e, t).load();
    }
    var qa, Za, za, Ua, Ga, Ha = Object.freeze({
        __proto__: null,
        load: function(e) {
            var t, n, r = e.lastIndexOf("/"), i = e.slice(0, r), a = e.slice(e.lastIndexOf(".")).toLowerCase();
            return ".gltf" === a ? (n = e, Ni.getJSON(n, {}).then(function(e) {
                return La(i, e);
            })) : ".glb" === a ? (t = e, Ni.getArrayBuffer(t, {}).then(function(e) {
                return La(i, {
                    buffer: e.data,
                    byteOffset: 0
                });
            })) : null;
        },
        exportGLTFPack: function(e, t) {
            return new Da(e, t);
        }
    }), ka = (Za = [ K([], qa = [ 0, 0, 0 ], [ 1, 0, 0 ], [ 0, -1, 0 ]), K([], qa, [ -1, 0, 0 ], [ 0, -1, 0 ]), K([], qa, [ 0, 1, 0 ], [ 0, 0, 1 ]), K([], qa, [ 0, -1, 0 ], [ 0, 0, -1 ]), K([], qa, [ 0, 0, 1 ], [ 0, -1, 0 ]), K([], qa, [ 0, 0, -1 ], [ 0, -1, 0 ]) ], 
    za = 90 * Math.PI / 180, Ua = [ 0, 0, 0, 0 ], Ga = new Array(16), function(i, a, o, s, u) {
        var e = {
            context: {
                viewMatrix: function(e, t, n) {
                    return Za[n];
                },
                projMatrix: _(Ga, za, 1, .5, 1.1)
            }
        };
        return a && (a.faces ? e.framebuffer = function(e, t, n) {
            return a.faces[n];
        } : e.framebuffer = a), i(e)(6, function(e, t, n) {
            var r = {
                color: Ua,
                depth: 1
            };
            a && (r.framebuffer = a.faces ? a.faces[n] : a), i.clear(r), o(s), u && u();
        }), a;
    }), ja = {
        vertices: [ 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1 ],
        textures: [ 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0 ],
        indices: [ 0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23 ]
    }, Va = "attribute vec3 aPosition;\nvarying vec3 vWorldPos;\nuniform mat4 projMatrix;\nuniform mat4 viewMatrix;\nvoid main() {\n  vWorldPos = aPosition;\n  gl_Position = projMatrix * viewMatrix * vec4(vWorldPos, 1.);\n}", Xa = "precision highp float;\n#define PI 3.1415926\nvarying vec3 vWorldPos;\nuniform sampler2D equirectangularMap;\nconst vec2 rS = vec2(.1591, .3183);\nvec2 rT(vec3 on) {\n  vec2 mS = vec2(atan(on.y, on.x), asin(on.z));\n  mS *= rS;\n  mS += .5;\n  return mS;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  return qF * nZ.rgb * nZ.a;\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvoid main() {\n  vec2 mS = rT(normalize(vWorldPos));\n  vec4 nZ = texture2D(equirectangularMap, mS);\n#ifdef INPUT_RGBM\ngl_FragColor = nZ;\n#else\ngl_FragColor = vec4(qI(nZ, 7.), 1.);\n#endif\n}";
    var Wa = {
        px: [ 2, 1, 0, -1, -1, 1 ],
        nx: [ 2, 1, 0, 1, -1, -1 ],
        py: [ 0, 2, 1, 1, -1, -1 ],
        ny: [ 0, 2, 1, 1, 1, 1 ],
        pz: [ 0, 1, 2, -1, -1, -1 ],
        nz: [ 0, 1, 2, 1, -1, 1 ]
    }, Ka = [ "px", "nx", "py", "ny", "pz", "nz" ];
    function Ya(t, e, n) {
        var r = t({
            frag: Ri,
            vert: Va,
            attributes: {
                aPosition: ja.vertices
            },
            uniforms: {
                projMatrix: t.context("projMatrix"),
                viewMatrix: t.context("viewMatrix"),
                cubeMap: e,
                environmentExposure: 1,
                bias: 0,
                size: n
            },
            elements: ja.indices
        }), i = [], a = t.framebuffer(n);
        return ka(t, a, r, {
            size: n
        }, function() {
            var e = t.read();
            i.push(new e.constructor(e));
        }), a.destroy(), i;
    }
    var Qa = [ -1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0 ], Ja = [ 0, 1, 0, 0, 1, 1, 1, 0 ];
    function $a(e, t) {
        for (var n, r, i = new Array(e * t * 4), a = 0; a < e; a++) for (var o = (r = void 0, 
        {
            x: (n = a) / e,
            y: r = (((16711935 & (r = ((252645135 & (r = ((858993459 & (r = ((1431655765 & (r = (n << 16 | n >>> 16) >>> 0)) << 1 | (2863311530 & r) >>> 1) >>> 0)) << 2 | (3435973836 & r) >>> 2) >>> 0)) << 4 | (4042322160 & r) >>> 4) >>> 0)) << 8 | (4278255360 & r) >>> 8) >>> 0) / 4294967296
        }), s = o.x, u = o.y, f = 0; f < t; f++) {
            var c = f / t, l = c * c, h = 2 * Math.PI * s, d = Math.sqrt((1 - u) / (1 + (l * l - 1) * u)), v = Math.sqrt(1 - d * d), p = 4 * (a * t + f), m = v * Math.cos(h), _ = v * Math.sin(h);
            i[p] = Math.abs(255 * m), i[1 + p] = Math.abs(255 * _), i[2 + p] = 255 * d, i[3 + p] = (0 < m ? 200 : 0) + (0 < _ ? 55 : 0);
        }
        return i;
    }
    var eo, to, no = Object.freeze({
        __proto__: null,
        createIBLMaps: function(e, t) {
            void 0 === t && (t = {});
            var n, r = t.envTexture, i = t.envCubeSize || 512, a = t.sampleSize || 1024, o = t.roughnessLevels || 256, s = t.prefilterCubeSize || 256;
            if (Array.isArray(r)) {
                var u = e.cube.apply(e, r);
                n = function(t, e, n) {
                    var r = t({
                        frag: "#define ENC_RGBM 1\n" + Ri,
                        vert: Va,
                        attributes: {
                            aPosition: ja.vertices
                        },
                        uniforms: {
                            projMatrix: t.context("projMatrix"),
                            viewMatrix: t.context("viewMatrix"),
                            cubeMap: e
                        },
                        elements: ja.indices
                    }), i = [], a = t.framebufferCube({
                        radius: n
                    });
                    ka(t, a, r, {
                        size: n
                    }, function() {
                        var e = t.read();
                        i.push(e);
                    });
                    var o = t.cube({
                        radius: n,
                        min: "linear mipmap linear",
                        mag: "linear",
                        faces: i,
                        mipmap: !0
                    });
                    return a.destroy(), o;
                }(e, u, i), u.destroy();
            } else n = function(e, t, n) {
                n = n || 512;
                var r = e({
                    frag: "#define INPUT_RGBM 1\n" + Xa,
                    vert: Va,
                    attributes: {
                        aPosition: ja.vertices
                    },
                    uniforms: {
                        projMatrix: e.context("projMatrix"),
                        viewMatrix: e.context("viewMatrix"),
                        equirectangularMap: t
                    },
                    elements: ja.indices
                }), i = e.cube({
                    width: n,
                    height: n,
                    min: "linear",
                    mag: "linear",
                    format: "rgba"
                }), a = e.framebufferCube({
                    radius: n,
                    color: i
                });
                return ka(e, a, r), a;
            }(e, r, i);
            var f, c, l, h, d, v, p = (f = e, c = n, l = t.rgbmRange, d = function(n, e, t, r, i, a) {
                for (var o = $a(i = i || 1024, a = a || 256), s = n.texture({
                    data: o,
                    width: a,
                    height: i,
                    min: "nearest",
                    mag: "nearest"
                }), u = n({
                    frag: "#define SHADER_NAME PBR_prefilter\nprecision highp float;\nvarying vec3 vWorldPos;\nuniform samplerCube environmentMap;\nuniform sampler2D distributionMap;\nuniform float roughness;\nuniform float resolution;\nuniform float rgbmRange;\nconst float nx = 3.14159265359;\nfloat sz(vec3 rX, vec3 rZ, float nI) {\n  float a = nI * nI;\n  float qx = a * a;\n  float nH = max(dot(rX, rZ), .0);\n  float nK = nH * nH;\n  float sj = qx;\n  float nL = (nK * (qx - 1.) + 1.);\n  nL = nx * nL * nL;\n  return sj / nL;\n}\nvec3 rV(float rW, vec3 rX, float nI) {\n  vec4 rY = texture2D(distributionMap, vec2(nI, rW));\n  vec3 rZ = rY.xyz;\n  float sa = sign(rY.w - .5);\n  float sb = sign(rY.w - 200.0 / 255. * clamp(sa, .0, 1.) - .15);\n  rZ.x *= sa;\n  rZ.y *= sb;\n  vec3 sc = abs(rX.z) < .999 ? vec3(.0, .0, 1.) : vec3(1., .0, .0);\n  vec3 sd = normalize(cross(sc, rX));\n  vec3 se = cross(rX, sd);\n  vec3 sf = sd * rZ.x + se * rZ.y + rX * rZ.z;\n  return normalize(sf);\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvoid main() {\n  vec3 rX = normalize(vWorldPos);\n  vec3 qL = rX;\n  vec3 nU = qL;\n  const int sr = 1024;\n  vec3 sA = vec3(.0);\n  float sB = .0;\n  for(int ss = 0; ss < sr; ++ss) {\n    vec3 rZ = rV(float(ss) / float(sr), rX, roughness);\n    vec3 st = normalize(2. * dot(nU, rZ) * rZ - nU);\n    float sl = max(dot(rX, st), .0);\n    if(sl > .0) {\n      sA += qI(textureCube(environmentMap, st), rgbmRange).rgb * sl;\n      sB += sl;\n    }\n  }\n  sA = sA / sB;\n  gl_FragColor = qE(sA, rgbmRange);\n}",
                    vert: Va,
                    attributes: {
                        aPosition: ja.vertices
                    },
                    uniforms: {
                        projMatrix: n.context("projMatrix"),
                        viewMatrix: n.context("viewMatrix"),
                        environmentMap: e,
                        distributionMap: s,
                        roughness: n.prop("roughness"),
                        resolution: r,
                        rgbmRange: t || 7
                    },
                    elements: ja.indices,
                    viewport: {
                        x: 0,
                        y: 0,
                        width: n.prop("size"),
                        height: n.prop("size")
                    }
                }), f = r, c = n.texture({
                    radius: r,
                    min: "linear",
                    mag: "linear"
                }), l = n.framebuffer({
                    radius: r,
                    color: c
                }), h = Math.log(f) / Math.log(2), d = [], v = function(e) {
                    var t = 0;
                    ka(n, l, u, {
                        roughness: e / (h - 1),
                        size: f
                    }, function() {
                        var e = n.read({
                            framebuffer: l
                        });
                        d[t] || (d[t] = {
                            mipmap: []
                        }), d[t].mipmap.push(e), t++;
                    }), f /= 2, l.resize(f);
                }, p = 0; p <= h; p++) v(p);
                return l.destroy(), d;
            }(f, c, l, h = s, a, o), {
                prefilterMap: f.cube({
                    radius: h,
                    min: "linear mipmap linear",
                    mag: "linear",
                    faces: d
                }),
                prefilterMipmap: d
            }), m = p.prefilterMap, _ = p.prefilterMipmap;
            if (!t.ignoreSH) {
                var g = s;
                v = function(e, t, n) {
                    for (var r = new Array(9), i = [], a = [], o = [], s = 0; s < 9; s++) {
                        for (var u = [ 0, 0, 0 ], f = 0; f < Ka.length; f++) {
                            for (var c = e[f], l = [ 0, 0, 0 ], h = 0, d = 0, v = Wa[Ka[f]], p = 0; p < n; p++) for (var m = 0; m < t; m++) {
                                i[0] = m / (t - 1) * 2 - 1, i[1] = p / (n - 1) * 2 - 1, i[2] = -1, J(i, i), o[0] = i[v[0]] * v[3], 
                                o[1] = i[v[1]] * v[4], o[2] = i[v[2]] * v[5], a[0] = c[d++] / 255, a[1] = c[d++] / 255, 
                                a[2] = c[d++] / 255;
                                var _ = c[d++] / 255 * 7;
                                a[0] *= _, a[1] *= _, a[2] *= _, A(l, l, a, (x = s, 0, b = (g = o)[0], y = g[1], 
                                T = g[2], (0 === x ? 1 : 1 === x ? b : 2 === x ? y : 3 === x ? T : 4 === x ? b * T : 5 === x ? y * T : 6 === x ? b * y : 7 === x ? 3 * T * T - 1 : b * b - y * y) * -i[2])), 
                                h += -i[2];
                            }
                            A(u, u, l, 1 / h);
                        }
                        r[s] = Q(u, u, 1 / 6);
                    }
                    var g, x, b, y, T;
                    return r;
                }(Ya(e, m, g), g, g);
            }
            var x = {
                rgbmRange: t.rgbmRange,
                envMap: n,
                prefilterMap: m
            };
            return v && (x.sh = v), "array" === t.format && (x.envMap = {
                width: n.width,
                height: n.height,
                faces: Ya(e, n, i)
            }, x.prefilterMap = {
                width: m.width,
                height: m.height,
                faces: _
            }, n.destroy(), m.destroy()), x;
        },
        generateDFGLUT: function(e, t, n, r) {
            t = t || 256;
            var i = $a(n = n || 1024, r = r || 256), a = e.texture({
                data: i,
                width: r,
                height: n,
                min: "nearest",
                mag: "nearest"
            }), o = e.buffer(Qa), s = e.buffer(Ja), u = e.framebuffer({
                radius: t,
                colorType: "uint8",
                colorFormat: "rgba",
                min: "linear",
                mag: "linear"
            });
            return e({
                frag: "precision mediump float;\nvarying vec2 vTexCoords;\nuniform sampler2D distributionMap;\nconst float nx = 3.14159265359;\nvec4 rU(float a, float b) {\n  a *= 65535.;\n  b *= 65535.;\n  vec4 rgba;\n  rgba[0] = mod(a, 255.);\n  rgba[1] = (a - rgba[0]) / 65280.0;\n  rgba[2] = mod(b, 255.);\n  rgba[3] = (b - rgba[2]) / 65280.0;\n  return rgba;\n}\nvec3 rV(float rW, vec3 rX, float nI) {\n  vec4 rY = texture2D(distributionMap, vec2(nI, rW));\n  vec3 rZ = rY.xyz;\n  float sa = sign(rY.w - .5);\n  float sb = sign(rY.w - clamp(sa, .0, 1.) * 200.0 / 255. - .15);\n  rZ.x *= sa;\n  rZ.y *= sb;\n  vec3 sc = abs(rX.z) < .999 ? vec3(.0, .0, 1.) : vec3(1., .0, .0);\n  vec3 sd = normalize(cross(sc, rX));\n  vec3 se = cross(rX, sd);\n  vec3 sf = sd * rZ.x + se * rZ.y + rX * rZ.z;\n  return normalize(sf);\n}\nfloat sg(float sh, float nI) {\n  float a = nI;\n  float si = (a * a) / 2.;\n  float sj = sh;\n  float nL = sh * (1. - si) + si;\n  return sj / nL;\n}\nfloat sk(float sh, float sl, float nI) {\n  float sm = sg(sh, nI);\n  float sn = sg(sl, nI);\n  return sn * sm;\n}\nvec2 so(float sh, float nI) {\n  vec3 nU;\n  nU.x = sqrt(1. - sh * sh);\n  nU.y = .0;\n  nU.z = sh;\n  float sp = .0;\n  float sq = .0;\n  vec3 rX = vec3(.0, .0, 1.);\n  const int sr = 1024;\n  for(int ss = 0; ss < sr; ++ss) {\n    vec3 rZ = rV(float(ss) / float(sr), rX, nI);\n    vec3 st = normalize(2. * dot(nU, rZ) * rZ - nU);\n    float sl = max(st.z, .0);\n    float nH = max(rZ.z, .0);\n    float su = max(dot(nU, rZ), .0);\n    float sh = max(dot(rX, nU), .0);\n    if(sl > .0) {\n      float sv = sk(sh, sl, nI);\n      float sw = (sv * su) / (nH * sh);\n      float sx = pow(1. - su, 5.);\n      sp += (1. - sx) * sw;\n      sq += sx * sw;\n    }\n  }\n  sp /= float(sr);\n  sq /= float(sr);\n  return vec2(sp, sq);\n}\nvoid main() {\n  vec2 sy = so(vTexCoords.x, vTexCoords.y);\n  gl_FragColor = rU(sy.x, sy.y);\n}",
                vert: "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoords;\nvoid main() {\n  vTexCoords = aTexCoord;\n  gl_Position = vec4(aPosition, 1.);\n}",
                attributes: {
                    aPosition: {
                        buffer: o
                    },
                    aTexCoord: {
                        buffer: s
                    }
                },
                uniforms: {
                    distributionMap: a
                },
                framebuffer: u,
                viewport: {
                    x: 0,
                    y: 0,
                    width: t,
                    height: t
                },
                count: Qa.length / 3,
                primitive: "triangle strip"
            })(), o.destroy(), s.destroy(), a.destroy(), u;
        }
    }), ro = {
        uvScale: [ 1, 1 ],
        uvOffset: [ 0, 0 ],
        uBaseColorFactor: [ 1, 1, 1, 1 ],
        uEmitColor: [ 0, 0, 0 ],
        uAlbedoPBRFactor: 1,
        uAnisotropyDirection: 0,
        uAnisotropyFactor: 0,
        uClearCoatF0: .04,
        uClearCoatFactor: 0,
        uClearCoatIor: 1.4,
        uClearCoatRoughnessFactor: .04,
        uClearCoatThickness: 5,
        uEmitColorFactor: 1,
        uRoughnessFactor: .4,
        uMetallicFactor: 0,
        uNormalMapFactor: 1,
        uSpecularF0Factor: .5,
        uSubsurfaceTranslucencyFactor: 1,
        uEmitMultiplicative: 0,
        uNormalMapFlipY: 0,
        uOutputLinear: 0,
        uEnvironmentTransform: ((eo = [])[0] = 1, eo[1] = 0, eo[2] = 0, eo[3] = 0, eo[4] = 1, 
        eo[5] = 0, eo[6] = 0, eo[7] = 0, eo[8] = 1, eo),
        uBaseColorTexture: null,
        uNormalTexture: null,
        uOcclusionTexture: null,
        uMetallicRoughnessTexture: null,
        uEmissiveTexture: null,
        uClearCoatTint: [ .006, .006, .006 ]
    }, io = (o(ao, to = Nt), ao.prototype.createDefines = function() {
        var e = to.prototype.createDefines.call(this), t = this.uniforms;
        return t.uBaseColorTexture && (e.HAS_ALBEDO_MAP = 1), t.uMetallicRoughnessTexture && (e.HAS_METALLICROUGHNESS_MAP = 1), 
        t.uOcclusionTexture && (e.HAS_AO_MAP = 1), t.uEmissiveTexture && (e.HAS_EMISSIVE_MAP = 1), 
        t.uNormalTexture && (e.HAS_NORMAL_MAP = 1), (e.HAS_ALBEDO_MAP || e.HAS_METALLICROUGHNESS_MAP || e.HAS_AO_MAP || e.HAS_EMISSIVE_MAP || e.HAS_NORMAL_MAP) && (e.HAS_MAP = 1), 
        t.GAMMA_CORRECT_INPUT && (e.GAMMA_CORRECT_INPUT = 1), e;
    }, ao);
    function ao(e) {
        var t = ke({}, ro);
        return (e.uMetallicRoughnessTexture || e.metallicRoughnessTexture) && (t.uRoughnessFactor = 1, 
        t.uMetallicFactor = 1), to.call(this, e, t) || this;
    }
    var oo, so, uo, fo = Object.freeze({
        __proto__: null,
        getPBRUniforms: function(u, e, t, n) {
            var r = u.viewMatrix, i = u.projMatrix, a = u.cameraPosition, o = u.getRenderer().canvas, s = function(e) {
                var t, n = u.getLightManager(), r = n.getAmbientResource(), i = n.getAmbientLight(), a = n.getDirectionalLight();
                if (r) {
                    var o = e.prefilterMap.width, s = Math.log(o) / Math.log(2);
                    t = {
                        sSpecularPBR: e.prefilterMap,
                        uDiffuseSPH: e.sh,
                        uTextureEnvironmentSpecularPBRLodRange: [ s, s ],
                        uTextureEnvironmentSpecularPBRTextureSize: [ o, o ]
                    };
                } else t = {
                    uAmbientColor: i.color || [ .2, .2, .2 ]
                };
                return t.uRGBMRange = r ? e.rgbmRange : 7, t.uEnvironmentExposure = Ve(i.exposure) ? i.exposure : 1, 
                a && (t.uSketchfabLight0_diffuse = [].concat(a.color || [ 1, 1, 1 ], [ 1 ]), t.uSketchfabLight0_viewDirection = a.direction || [ 1, 1, -1 ]), 
                t;
            }(e), f = ke({
                viewMatrix: r,
                projMatrix: i,
                projectionMatrix: i,
                projViewMatrix: u.projViewMatrix,
                uCameraPosition: a,
                uGlobalTexSize: [ o.width, o.height ],
                uNearFar: [ u.cameraNear, u.cameraFar ]
            }, s);
            return f.sIntegrateBRDF = t, n && n.ssr && n.ssr.renderUniforms && ke(f, n.ssr.renderUniforms), 
            n && n.jitter ? f.uHalton = n.jitter : f.uHalton = [ 0, 0 ], f;
        },
        createIBLTextures: function(e, t) {
            var n = t.getLightManager(), r = n.getAmbientResource();
            if (!r) return null;
            var i = n.getAmbientLight().exposure;
            return {
                prefilterMap: e.cube({
                    width: r.prefilterMap.width,
                    height: r.prefilterMap.height,
                    faces: r.prefilterMap.faces,
                    min: "linear mipmap linear",
                    mag: "linear",
                    format: "rgba"
                }),
                exposure: Ve(i) ? i : 1,
                sh: r.sh,
                rgbmRange: r.rgbmRange
            };
        },
        disposeIBLTextures: function(e) {
            for (var t in e) e[t].destroy && e[t].destroy(), delete e[t];
        }
    }), co = function(t) {
        function e(e) {
            return t.call(this, {
                vert: "attribute vec3 aPosition;\nuniform mat4 lightProjViewModelMatrix;\nvarying vec4 vPosition;\nvoid main() {\n  gl_Position = lightProjViewModelMatrix * vec4(aPosition, 1.);\n  vPosition = gl_Position;\n}",
                frag: "#define SHADER_NAME vsm_mapping\n#ifdef USE_VSM\n#extension GL_OES_standard_derivatives : enable\n#endif\nprecision highp float;\nvarying vec4 vPosition;\n#ifdef PACK_FLOAT\n#include <common_pack_float>\n#endif\nvoid main() {\n  \n#if defined(USE_VSM)\nfloat qA = vPosition.z / vPosition.w;\n  qA = qA * .5 + .5;\n  float qV = qA;\n  float qW = qA * qA;\n  float qX = dFdx(qA);\n  float qY = dFdy(qA);\n  qW += .25 * (qX * qX + qY * qY);\n  gl_FragColor = vec4(qV, qW, qA, .0);\n#endif\n#if defined(USE_ESM)\n#ifdef PACK_FLOAT\ngl_FragColor = common_encodeDepth(gl_FragCoord.z);\n#else\ngl_FragColor = vec4(gl_FragCoord.z, .0, .0, 1.);\n#endif\n#endif\n}",
                uniforms: [ {
                    name: "lightProjViewModelMatrix",
                    type: "function",
                    fn: function(e, t) {
                        return W([], t.lightProjViewMatrix, t.modelMatrix);
                    }
                } ],
                extraCommandProps: {},
                defines: e
            }) || this;
        }
        o(e, t);
        var n = e.prototype;
        return n.filter = function(e) {
            return e.castShadow;
        }, n.getMeshCommand = function(e, t) {
            return this.commands.shadowmap || (this.commands.shadowmap = this.createREGLCommand(e, null, [ "aPosition" ], null, t.getElements())), 
            this.commands.shadowmap;
        }, e;
    }(ur), lo = (o(ho, oo = wr), ho.prototype.getMeshCommand = function(e, t) {
        return this.commands.box_blur || (this.commands.box_blur = this.createREGLCommand(e, null, [ "aPosition", "aTexCoord" ], null, t.getElements())), 
        this.commands.box_blur;
    }, ho);
    function ho(e) {
        var t = e.blurOffset;
        return oo.call(this, {
            vert: br,
            frag: "precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D textureSource;\nuniform vec2 resolution;\n#include <common_pack_float>\nvoid main() {\n  float qk = .0;\n  float nf = .0;\n  for(int x = -BOXBLUR_OFFSET; x <= BOXBLUR_OFFSET; ++x)\n    for(int y = -BOXBLUR_OFFSET; y <= BOXBLUR_OFFSET; ++y) {\n      vec2 mS = vTexCoord.st + vec2(float(x) / resolution.x, float(y) / resolution.y);\n      mS = clamp(mS, .0, 1.);\n      float qA = common_decodeDepth(texture2D(textureSource, mS));\n      float s = max(.0, sign(1. - qA));\n      nf += sign(qA) * s;\n      qk += qA;\n    }\n  float vf = qk / max(1., nf);\n  gl_FragColor = common_encodeDepth(vf);\n}",
            uniforms: [ "textureSource", "resolution" ],
            defines: {
                BOXBLUR_OFFSET: t || 2
            }
        }) || this;
    }
    var vo, po, mo, _o, go, xo, bo, yo, To, wo, Eo, So, Ao, Mo = ((vo = Ro.prototype).render = function(e, t) {
        var n = t.cameraProjViewMatrix, r = t.lightDir, i = t.farPlane, a = t.cameraLookAt;
        return {
            lightProjViewMatrix: this._renderShadow(e, n, r, i, a),
            shadowMap: this.blurTex || this.depthTex,
            depthFBO: this.depthFBO,
            blurFBO: this.blurFBO
        };
    }, vo.resize = function(e, t) {
        return this.depthTex && (this.depthTex.resize(e, t), this.depthFBO.resize(e, t)), 
        this.blurFBO && (this.blurTex.resize(e, t), this.blurFBO.resize(e, t)), this;
    }, vo._renderShadow = function(e, t, n, r, i) {
        var a = this.renderer, o = so(t);
        if (r) for (var s = 4; s < 8; s++) o[s] = r[s - 4];
        var u = uo(i, o, n);
        return a.clear({
            color: [ 1, 0, 0, 1 ],
            depth: 1,
            framebuffer: this.depthFBO
        }), a.render(this.vsmShader, {
            lightProjViewMatrix: u
        }, e, this.depthFBO), this.blurFBO && (this.boxBlurShader || (this.boxBlurShader = new lo({
            blurOffset: this.blurOffset
        })), a.clear({
            color: [ 1, 0, 0, 1 ],
            depth: 1,
            framebuffer: this.blurFBO
        }), a.render(this.boxBlurShader, {
            resolution: [ this.depthTex.width, this.depthTex.height ],
            textureSource: this.depthTex
        }, null, this.blurFBO)), u;
    }, vo._init = function(e) {
        var t = this.renderer.regl, n = this.width, r = this.height;
        this.depthTex = t.texture({
            width: n,
            height: r,
            format: "rgb",
            type: "uint8",
            min: "nearest",
            mag: "nearest"
        }), this.vsmShader = new co(e), this.vsmShader.filter = function(e) {
            return e.castShadow;
        }, this.depthFBO = t.framebuffer({
            color: this.depthTex
        }), this.blurOffset <= 0 || (this.blurTex = t.texture({
            width: n,
            height: r,
            format: "rgb",
            type: "uint8",
            min: "linear",
            mag: "linear"
        }), this.blurFBO = t.framebuffer({
            color: this.blurTex
        }));
    }, vo.dispose = function() {
        this.depthTex && (this.depthTex.destroy(), this.depthFBO.destroy(), delete this.depthTex, 
        delete this.depthFBO), this.blurTex && (this.blurTex.destroy(), this.blurFBO.destroy(), 
        delete this.blurTex, delete this.blurFBO), this.vsmShader && (this.vsmShader.dispose(), 
        delete this.vsmShader), this.boxBlurShader && (this.boxBlurShader.dispose(), delete this.boxBlurShader);
    }, Ro);
    function Ro(e, t) {
        var n = t.width, r = t.height, i = t.blurOffset, a = t.defines;
        this.renderer = e, this.width = n || 512, this.height = r || 512, this.blurOffset = ze(i) ? 2 : i, 
        this._init(a);
    }
    So = [ [ -1, -1, -1, 1 ], [ 1, -1, -1, 1 ], [ 1, 1, -1, 1 ], [ -1, 1, -1, 1 ], [ -1, -1, 1, 1 ], [ 1, -1, 1, 1 ], [ 1, 1, 1, 1 ], [ -1, 1, 1, 1 ] ], 
    Ao = new Array(16), so = function(e) {
        x(Ao, e);
        for (var t = [], n = 0; n < So.length; n++) {
            var r = ce([], So[n], Ao);
            ie(r, r, 1 / r[3]), t.push(r);
        }
        return t;
    }, po = new Array(4), mo = new Array(3), _o = [ 0, 0, 0, 0 ], go = [ 0, 1, 0 ], 
    xo = new Array(3), bo = new Array(16), yo = new Array(16), To = new Array(16), wo = [ 1, 1, 1 ], 
    Eo = [ 0, 0, 0 ], uo = function(e, t, n) {
        ee.apply(ye, [ _o ].concat(e, [ 1 ])), Q(mo, n, -1), bo = K(bo, Y(xo, _o, J(xo, mo)), _o, go), 
        ce(po, t[0], bo);
        for (var r, i, a, o, s, u, f, c, l, h, d = po[2], v = po[2], p = po[0], m = po[0], _ = po[1], g = po[1], x = 1; x < 8; x++) (po = ce(po, t[x], bo))[2] > v && (v = po[2]), 
        po[2] < d && (d = po[2]), po[0] > m && (m = po[0]), po[0] < p && (p = po[0]), po[1] > g && (g = po[1]), 
        po[1] < _ && (_ = po[1]);
        c = (s = a = 1) / ((i = -1) - a), l = 1 / ((o = -1) - s), h = 1 / ((u = -v) - (f = -d)), 
        (r = yo)[0] = -2 * c, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = -2 * l, r[6] = 0, 
        r[7] = 0, r[8] = 0, r[9] = 0, r[10] = 2 * h, r[11] = 0, r[12] = (i + a) * c, r[13] = (s + o) * l, 
        r[14] = (f + u) * h, r[15] = 1, yo = r;
        var b, y, T, w, E, S, A, M, R, O, B, C, F, I, P, D, N, L, q, Z, z, U, G, H, k = wo[0] = 2 / (m - p), j = wo[1] = -2 / (g - _);
        Eo[0] = -.5 * (p + m) * k, Eo[1] = -.5 * (_ + g) * j, X(To), M = A = To, O = (R = Eo)[0], 
        B = R[1], C = R[2], H = G = U = z = Z = q = L = N = D = P = I = F = void 0, M === A ? (A[12] = M[0] * O + M[4] * B + M[8] * C + M[12], 
        A[13] = M[1] * O + M[5] * B + M[9] * C + M[13], A[14] = M[2] * O + M[6] * B + M[10] * C + M[14], 
        A[15] = M[3] * O + M[7] * B + M[11] * C + M[15]) : (F = M[0], I = M[1], P = M[2], 
        D = M[3], N = M[4], L = M[5], q = M[6], Z = M[7], z = M[8], U = M[9], G = M[10], 
        H = M[11], A[0] = F, A[1] = I, A[2] = P, A[3] = D, A[4] = N, A[5] = L, A[6] = q, 
        A[7] = Z, A[8] = z, A[9] = U, A[10] = G, A[11] = H, A[12] = F * O + N * B + z * C + M[12], 
        A[13] = I * O + L * B + U * C + M[13], A[14] = P * O + q * B + G * C + M[14], A[15] = D * O + Z * B + H * C + M[15]), 
        y = b = To, w = (T = wo)[0], E = T[1], S = T[2], b[0] = y[0] * w, b[1] = y[1] * w, 
        b[2] = y[2] * w, b[3] = y[3] * w, b[4] = y[4] * E, b[5] = y[5] * E, b[6] = y[6] * E, 
        b[7] = y[7] * E, b[8] = y[8] * S, b[9] = y[9] * S, b[10] = y[10] * S, b[11] = y[11] * S, 
        b[12] = y[12], b[13] = y[13], b[14] = y[14], b[15] = y[15];
        var V = W(yo, To, yo);
        return W(new Array(16), V, bo);
    };
    var Oo, Bo = (o(Co, Oo = ur), Co.prototype.getMeshCommand = function(e, t) {
        return this.commands.shadow_display || (this.commands.shadow_display = this.createREGLCommand(e, null, [ "aPosition" ], null, t.getElements())), 
        this.commands.shadow_display;
    }, Co);
    function Co(e) {
        return Oo.call(this, {
            vert: "#define SHADER_NAME SHADER_DISPLAY\nattribute vec3 aPosition;\nuniform mat4 projMatrix;\nuniform mat4 modelViewMatrix;\nuniform vec2 halton;\nuniform vec2 globalTexSize;\nvarying vec4 vPosition;\n#include <vsm_shadow_vert>\nvoid main() {\n  vec4 oJ = vec4(aPosition, 1.);\n  vec4 ra = modelViewMatrix * oJ;\n  mat4 pr = projMatrix;\n  pr[2].xy += halton.xy / globalTexSize.xy;\n  gl_Position = pr * ra;\n  vPosition = gl_Position;\n  shadow_computeShadowPars(oJ);\n}",
            frag: "#define SHADER_NAME SHADER_DISPLAY\nprecision mediump float;\nuniform vec3 color;\n#include <vsm_shadow_frag>\nvoid main() {\n  float qZ = shadow_computeShadow();\n  float pk = 1. - qZ;\n  gl_FragColor = vec4(color * pk, pk);\n}",
            uniforms: [ "projMatrix", {
                name: "modelViewMatrix",
                type: "function",
                fn: function(e, t) {
                    var n = [];
                    return W(n, t.viewMatrix, t.modelMatrix), n;
                }
            }, "halton", "globalTexSize", "shadow_lightProjViewModelMatrix", "shadow_shadowMap", "esm_shadow_threshold", "color", "shadow_opacity" ],
            defines: e || {
                USE_ESM: 1
            },
            extraCommandProps: {
                depth: {
                    enable: !0,
                    mask: !1
                },
                viewport: {
                    x: 0,
                    y: 0,
                    width: function(e, t) {
                        return t.globalTexSize[0];
                    },
                    height: function(e, t) {
                        return t.globalTexSize[1];
                    }
                }
            }
        }) || this;
    }
    function Fo(e) {
        return 256 * e[2] * 256 + 256 * e[1] + e[0];
    }
    var Io, Po = new Uint8Array(4), Do = new Float32Array(Po.buffer), No = ((Io = Lo.prototype)._init = function() {
        var e = [ "fbo_picking_meshId" ];
        this._uniforms && e.push.apply(e, this._uniforms);
        var t = {
            ENABLE_PICKING: 1,
            HAS_PICKING_ID: 1
        };
        if (this._defines) for (var n in this._defines) t[n] = this._defines[n];
        var r = this._vert, i = this._extraCommandProps;
        this._shader0 = new ur({
            vert: r,
            frag: "\n    precision highp float;\n\n    varying float vPickingId;\n    varying float vFbo_picking_visible;\n\n    uniform float fbo_picking_meshId;\n\n    \n    vec3 unpack(highp float f) {\n        highp vec3 color;\n        color.b = floor(f / 65536.0);\n        color.g = floor((f - color.b * 65536.0) / 256.0);\n        color.r = f - floor(color.b * 65536.0) - floor(color.g * 256.0);\n        // now we have a vec3 with the 3 components in range [0..255]. Let's normalize it!\n        return color / 255.0;\n    }\n\n\n    void main() {\n        if (vFbo_picking_visible == 0.0) {\n            discard;\n            return;\n        }\n        gl_FragColor = vec4(unpack(vPickingId), fbo_picking_meshId / 255.0);\n    }\n",
            uniforms: e,
            defines: t,
            extraCommandProps: i
        }), this._shader2 = new ur({
            vert: r,
            frag: "\n    precision highp float;\n\n    varying float vPickingId;\n    varying float vFbo_picking_visible;\n\n    \n    vec3 unpack(highp float f) {\n        highp vec3 color;\n        color.b = floor(f / 65536.0);\n        color.g = floor((f - color.b * 65536.0) / 256.0);\n        color.r = f - floor(color.b * 65536.0) - floor(color.g * 256.0);\n        // now we have a vec3 with the 3 components in range [0..255]. Let's normalize it!\n        return color / 255.0;\n    }\n\n\n    void main() {\n        if (vFbo_picking_visible == 0.0) {\n            discard;\n            return;\n        }\n        gl_FragColor = vec4(unpack(vPickingId), 1.0);\n    }\n",
            uniforms: e,
            defines: t,
            extraCommandProps: i
        });
        var a = {
            ENABLE_PICKING: 1,
            HAS_PICKING_ID: 1
        };
        if (this._defines) for (var o in this._defines) a[o] = this._defines[o];
        this._shader1 = new ur({
            vert: r,
            frag: "\n    precision highp float;\n\n    uniform int fbo_picking_meshId;\n    varying float vFbo_picking_visible;\n\n    \n    vec3 unpack(highp float f) {\n        highp vec3 color;\n        color.b = floor(f / 65536.0);\n        color.g = floor((f - color.b * 65536.0) / 256.0);\n        color.r = f - floor(color.b * 65536.0) - floor(color.g * 256.0);\n        // now we have a vec3 with the 3 components in range [0..255]. Let's normalize it!\n        return color / 255.0;\n    }\n\n\n    void main() {\n        if (vFbo_picking_visible == 0.0) {\n            discard;\n            return;\n        }\n        gl_FragColor = vec4(unpack(float(fbo_picking_meshId)), 1.0);\n        // gl_FragColor = vec4(unpack(float(35)), 1.0);\n    }\n",
            uniforms: e,
            defines: a,
            extraCommandProps: i
        }), this._depthShader = new ur({
            vert: r,
            frag: "\n    #define SHADER_NAME depth\n\n    precision highp float;\n    varying float vFbo_picking_viewZ;\n\n    #include <common_pack_float>\n\n    void main() {\n        gl_FragColor = common_unpackFloat(vFbo_picking_viewZ);\n        // gl_FragColor = unpack(34678.3456789);\n    }\n",
            uniforms: e,
            defines: a,
            extraCommandProps: i
        }), this._scene = new Nn(), this._scene1 = new Nn();
    }, Io.filter = function() {
        return !0;
    }, Io.render = function(e, t, n) {
        var r = this;
        if (void 0 === n && (n = !1), !e || !e.length) return this;
        var i = this._fbo;
        n && this.clear(), this._scene.setMeshes(e);
        var a = this._getShader(e, n);
        a.filter = this.filter, this._currentShader && a !== this._currentShader && this.clear(), 
        this._currentShader = a, e.forEach(function(e, t) {
            e.setUniform("fbo_picking_meshId", t + r._currentMeshes.length);
        });
        for (var o = 0; o < e.length; o++) this._currentMeshes.push(e[o]);
        return this._renderer.render(a, t, this._scene, i), this;
    }, Io.pick = function(e, t, n, r, i) {
        void 0 === i && (i = {});
        var a = this._currentShader, o = this._currentMeshes;
        if (!a || !o || !o.length) return {
            pickingId: null,
            meshId: null,
            point: null
        };
        e = Math.round(e), t = Math.round(t);
        var s = this._fbo;
        if (e <= 2 || e >= s.width - 2 || t <= 2 || t >= s.height - 2) return {
            pickingId: null,
            meshId: null,
            point: null
        };
        for (var u = this._getParams(e, t, n, s), f = u.px, c = u.py, l = u.width, h = u.height, d = new Uint8Array(4 * l * h), v = this._renderer.regl.read({
            data: d,
            x: f,
            y: c,
            framebuffer: s,
            width: l,
            height: h
        }), p = [], m = [], _ = 0; _ < v.length; _ += 4) {
            var g = this._packData(v.subarray(_, _ + 4), a), x = g.pickingId, b = g.meshId;
            p.push(b), m.push(x);
        }
        var y = {}, T = p.filter(function(e) {
            return null != e && !y[e] && (y[e] = 1, !0);
        }).map(function(e) {
            return o[e];
        });
        p.length && a === this._shader1 && o[0].geometry.data.aPickingId && (m = this._getPickingId(f, c, l, h, d, T, r));
        var w = [];
        if (p.length && i.returnPoint) for (var E = i.viewMatrix, S = i.projMatrix, A = this._pickDepth(f, c, l, h, d, T, r), M = 0; M < A.length; M++) if (A[M] && null != p[M] && null != m[M]) {
            var R = this._getWorldPos(e, t, A[M], E, S);
            w.push(R);
        } else w.push(null);
        for (var O = [], B = 0; B <= n; B++) O.push(B), 0 < B && O.push(-B);
        for (var C = 0; C < O.length; C++) for (var F = 0; F < O.length; F++) {
            var I = (O[F] + n) * l + (O[C] + n);
            if (null != p[I] && null != m[I]) return {
                meshId: p[I],
                pickingId: m[I],
                point: w[I] || null
            };
        }
        return {
            pickingId: null,
            meshId: null,
            point: null
        };
    }, Io.clear = function() {
        return this._fbo && this._clearFbo(this._fbo), this._currentMeshes = [], delete this._currentShader, 
        this;
    }, Io.getMeshAt = function(e) {
        return this._currentMeshes ? this._currentMeshes[e] : null;
    }, Io.getRenderedMeshes = function() {
        return this._currentMeshes;
    }, Io.dispose = function() {
        this.clear(), this._shader0 && this._shader0.dispose(), this._shader1 && this._shader1.dispose(), 
        this._shader2 && this._shader2.dispose(), this._scene && this._scene.clear(), this._scene1 && this._scene1.clear();
    }, Io._getWorldPos = function(e, t, n, r, i) {
        var a = this._fbo, o = [], s = a.width / 2 || 1, u = a.height / 2 || 1, f = [ (e - s) / s, (u - t) / u, 0, 1 ], c = [ (e - s) / s, (u - t) / u, 1, 1 ], l = x(o, i), h = [], d = [];
        qo(h, f, l), qo(d, c, l);
        var v = -h[2], p = (n - v) / (-d[2] - v), m = x(o, W(o, i, r)), _ = qo(f, f, m), g = qo(c, c, m);
        return [ Xe(_[0], g[0], p), Xe(_[1], g[1], p), Xe(_[2], g[2], p) ];
    }, Io._getPickingId = function(e, t, n, r, i, a, o) {
        var s = this._renderer.regl, u = this._getFBO1();
        this._clearFbo(u), this._scene1.setMeshes(a), this._renderer.render(this._shader2, o, this._scene1, u);
        for (var f = s.read({
            data: i,
            x: e,
            y: t,
            framebuffer: u,
            width: n,
            height: r
        }), c = [], l = 0; l < f.length; l += 4) c.push(Fo(f.subarray(l, l + 4)));
        return c;
    }, Io._pickDepth = function(e, t, n, r, i, a, o) {
        var s = this._renderer.regl, u = this._getFBO1();
        this._scene1.setMeshes(a), this._clearFbo(u), this._renderer.render(this._depthShader, o, this._scene1, u);
        for (var f, c = s.read({
            data: i,
            x: e,
            y: t,
            framebuffer: u,
            width: n,
            height: r
        }), l = [], h = 0; h < c.length; h += 4) l.push((f = c.subarray(h, h + 4), Po[0] = f[3], 
        Po[1] = f[2], Po[2] = f[1], Po[3] = f[0], Do[0]));
        return l;
    }, Io._packData = function(e, t) {
        if (255 === e[0] && 255 === e[1] && 255 === e[2] && 255 === e[3]) return {
            meshId: null,
            pickingId: null
        };
        var n = null, r = null;
        return t === this._shader1 ? r = Fo(e) : (r = t === this._shader0 ? e[3] : null, 
        n = Fo(e)), {
            meshId: r,
            pickingId: n
        };
    }, Io._clearFbo = function(e) {
        this._renderer.regl.clear({
            color: [ 1, 1, 1, 1 ],
            depth: 1,
            stencil: 0,
            framebuffer: e
        });
    }, Io._getShader = function(e, t) {
        return t && e.length < 256 ? this._shader0 : this._shader1;
    }, Io._getFBO1 = function() {
        var e = this._renderer.regl, t = this._fbo;
        return this._fbo1 ? this._fbo1.width === t.width && this._fbo1.height === t.height || this._fbo1.resize(t.width, t.height) : this._fbo1 = e.framebuffer(t.width, t.height), 
        this._fbo1;
    }, Io._getParams = function(e, t, n, r) {
        e -= n, t = r.height - t;
        var i = 2 * n + 1, a = 2 * n + 1, o = e + i, s = (t -= n) + a;
        return o > r.width && (i -= o - r.width), s > r.height && (a -= s - r.height), {
            px: e = e < 0 ? 0 : e,
            py: t = t < 0 ? 0 : t,
            width: i,
            height: a
        };
    }, Io.getPickingVert = function() {
        return this._vert;
    }, Io.getUniformDeclares = function() {
        return this._uniforms;
    }, Lo);
    function Lo(e, t, n) {
        var r = t.vert, i = t.uniforms, a = t.defines, o = t.extraCommandProps;
        this._renderer = e, this._fbo = n, this._clearFbo(n), this._vert = r, this._uniforms = i, 
        this._defines = a, this._extraCommandProps = o, this._currentMeshes = [], this._init();
    }
    function qo(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = 1 / (n[3] * r + n[7] * i + n[11] * a + n[15]);
        return e[0] = (n[0] * r + n[4] * i + n[8] * a + n[12]) * o, e[1] = (n[1] * r + n[5] * i + n[9] * a + n[13]) * o, 
        e[2] = (n[2] * r + n[6] * i + n[10] * a + n[14]) * o, e;
    }
    var Zo, zo, Uo, Go = {
        parseHDR: kn
    }, Ho = {
        PBRHelper: no,
        StandardMaterial: io,
        StandardSpecularGlossinessMaterial: (o(Vo, Uo = Qt(io)), Vo),
        StandardShader: (o(jo, zo = ur), jo.prototype.getGeometryDefines = function(e) {
            var t = {};
            return e.data[e.desc.tangentAttribute] && (t.HAS_TANGENT = 1), t;
        }, jo),
        StandardDepthShader: (o(ko, Zo = ur), ko),
        PBRUtils: fo
    };
    function ko(e) {
        void 0 === e && (e = {});
        var t = [ "positionMatrix", "uGlobalTexSize", "uHalton", "lineWidth", "lineHeight", "linePixelScale", "projMatrix", {
            name: "uProjectionMatrix",
            type: "function",
            fn: function(e, t) {
                return t.projMatrix;
            }
        }, {
            name: "uModelViewMatrix",
            type: "function",
            fn: function(e, t) {
                return W([], t.viewMatrix, t.modelMatrix);
            }
        } ], n = e.extraCommandProp;
        return Zo.call(this, {
            vert: "#define SHADER_NAME depth_vert\nprecision highp float;\nattribute vec3 aPosition;\n#include <line_extrusion_vert>\nuniform mat4 uModelViewMatrix;\nuniform mat4 positionMatrix;\nuniform mat4 uProjectionMatrix;\nuniform vec2 uGlobalTexSize;\nuniform vec2 uHalton;\n#include <get_output>\nvoid main() {\n  mat4 pn = getPositionMatrix();\n#ifdef IS_LINE_EXTRUSION\nvec4 sC = getPosition(getLineExtrudePosition(aPosition));\n#else\nvec4 sC = getPosition(aPosition);\n#endif\nvec4 ra = uModelViewMatrix * pn * sC;\n  mat4 pr = uProjectionMatrix;\n  pr[2].xy += uHalton.xy / uGlobalTexSize.xy;\n  gl_Position = pr * ra;\n}",
            frag: "#define SHADER_NAME depth_frag\nprecision highp float;\nvoid main() {\n  gl_FragColor = vec4(1., .0, .0, 1.);\n}",
            uniforms: t,
            extraCommandProps: n,
            defines: e.defines
        }) || this;
    }
    function jo(e) {
        var t;
        void 0 === e && (e = {});
        var n = e.extraCommandProps || {}, r = e.uniforms;
        n = ke({}, n);
        var i = [ "uCameraPosition", {
            name: "uModelMatrix",
            type: "function",
            fn: function(e, t) {
                return t.modelMatrix;
            }
        }, {
            name: "uModelNormalMatrix",
            type: "function",
            fn: function(e, t) {
                return u([], t.modelMatrix);
            }
        }, {
            name: "uModelViewNormalMatrix",
            type: "function",
            fn: function(e, t) {
                var n = W([], t.viewMatrix, t.modelMatrix), r = x(n, n);
                return u([], h(r, r));
            }
        }, {
            name: "uProjectionMatrix",
            type: "function",
            fn: function(e, t) {
                return t.projMatrix;
            }
        }, {
            name: "uModelViewMatrix",
            type: "function",
            fn: function(e, t) {
                return W([], t.viewMatrix, t.modelMatrix);
            }
        }, "uGlobalTexSize", "uvScale", "uvOffset", "uEmitColor", "uBaseColorFactor", "uAlbedoPBRFactor", "uAnisotropyDirection", "uAnisotropyFactor", "uClearCoatF0", "uClearCoatFactor", "uClearCoatIor", "uClearCoatRoughnessFactor", "uClearCoatThickness", "uEmitColorFactor", "uEnvironmentExposure", "uFrameMod", "uRoughnessFactor", "uMetallicFactor", "uNormalMapFactor", "uRGBMRange", "uScatteringFactorPacker", "uSpecularF0Factor", "uStaticFrameNumShadow3", "uSubsurfaceScatteringFactor", "uSubsurfaceScatteringProfile", "uSubsurfaceTranslucencyFactor", "uSubsurfaceTranslucencyThicknessFactor", "uAnisotropyFlipXY", "uDrawOpaque", "uEmitMultiplicative", "uNormalMapFlipY", "uOutputLinear", "uEnvironmentTransform", "uBaseColorTexture", "uNormalTexture", "uOcclusionTexture", "uMetallicRoughnessTexture", "uEmissiveTexture", "sIntegrateBRDF", "sSpecularPBR", "uNearFar", "uTextureEnvironmentSpecularPBRLodRange", "uTextureEnvironmentSpecularPBRTextureSize", "uClearCoatTint", "uDiffuseSPH[9]", "uSketchfabLight0_viewDirection", "uSubsurfaceTranslucencyColor", "uHalton", "uSketchfabLight0_diffuse", "uAmbientColor", "uDiffuseFactor", "uSpecularFactor", "uGlossinessFactor", "uDiffuseTexture", "uSpecularGlossinessTexture", "lineColor", "lineOpacity", "polygonFill", "polygonOpacity", "viewshed_depthMapFromViewpoint", "viewshed_projViewMatrixFromViewpoint", "viewshed_visibleColor", "viewshed_invisibleColor", "flood_waterHeight", "flood_waterColor", "fog_Dist", "fog_Color", "jointTexture", "jointTextureSize", "numJoints", "skinAnimation" ];
        return r && i.push.apply(i, r), (t = zo.call(this, {
            vert: "#include <gl2_vert>\n#define SHADER_NAME PBR\nprecision highp float;\nattribute vec3 aPosition;\n#if defined(HAS_MAP)\nattribute vec2 aTexCoord;\nuniform vec2 uvScale;\nuniform vec2 uvOffset;\n#endif\n#if defined(HAS_TANGENT)\nattribute vec4 aTangent;\n#else\nattribute vec3 aNormal;\n#endif\nvec3 sD;\nvec3 pp;\nvec4 sE;\nuniform mat4 uModelMatrix;\nuniform mat4 uModelViewMatrix;\nuniform mat4 positionMatrix;\nuniform mat4 uProjectionMatrix;\nuniform vec2 uGlobalTexSize;\nuniform vec2 uHalton;\nuniform mat3 uModelNormalMatrix;\n#ifdef HAS_SSR\nuniform mat3 uModelViewNormalMatrix;\nvarying vec3 vViewNormal;\n#endif\nvarying vec3 vModelNormal;\nvarying vec4 vViewVertex;\n#if defined(HAS_TANGENT)\nvarying vec4 vModelTangent;\nvarying vec3 vModelBiTangent;\n#endif\nvarying vec3 vModelVertex;\n#if defined(HAS_MAP)\nvarying vec2 vTexCoord;\n#endif\n#if defined(HAS_COLOR)\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n#include <line_extrusion_vert>\n#include <get_output>\n#include <viewshed_vert>\n#include <flood_vert>\n#ifdef HAS_SHADOWING\n#include <vsm_shadow_vert>\n#endif\n#include <heatmap_render_vert>\n#include <fog_render_vert>\nvoid pl(const highp vec4 q, out highp vec3 om) {\n  om = vec3(.0, .0, 1.) + vec3(2., -2., -2.) * q.x * q.zwx + vec3(2., 2., -2.) * q.y * q.wzy;\n}\nvoid pl(const highp vec4 q, out highp vec3 om, out highp vec3 t) {\n  pl(q, om);\n  t = vec3(1., .0, .0) + vec3(-2., 2., -2.) * q.y * q.yxw + vec3(-2., 2., 2.) * q.z * q.zwx;\n}\nvoid main() {\n  \n#if defined(HAS_MAP)\nvTexCoord = (aTexCoord + uvOffset) * uvScale;\n#endif\n#if defined(HAS_TANGENT)\nvec3 t;\n  pl(aTangent, pp, t);\n  vModelTangent = vec4(uModelNormalMatrix * t, aTangent.w);\n#else\npp = aNormal;\n#endif\nmat4 pn = getPositionMatrix();\n#ifdef IS_LINE_EXTRUSION\nvec3 sF = getLineExtrudePosition(aPosition);\n  vec4 sC = getPosition(sF);\n#else\nvec4 sC = getPosition(aPosition);\n#endif\nvModelVertex = (uModelMatrix * sC).xyz;\n  vec3 pq = pp;\n  vModelNormal = uModelNormalMatrix * pq;\n#if defined(HAS_TANGENT)\nvModelBiTangent = cross(vModelNormal, vModelTangent.xyz) * sign(aTangent.w);\n#endif\n#ifdef HAS_SSR\nvViewNormal = uModelViewNormalMatrix * pp;\n#if defined(HAS_TANGENT)\nvec4 sG = vec4(t, aTangent.w);\n  vViewTangent = vec4(uModelViewNormalMatrix * sG.xyz, sG.w);\n#endif\n#endif\nvec4 ra = uModelViewMatrix * pn * sC;\n  vViewVertex = ra;\n  mat4 pr = uProjectionMatrix;\n  pr[2].xy += uHalton.xy / uGlobalTexSize.xy;\n  gl_Position = pr * ra;\n#if defined(HAS_COLOR)\nvColor = aColor / 255.;\n#endif\n#if defined(HAS_SHADOWING)\nshadow_computeShadowPars(sC);\n#endif\n#ifdef HAS_VIEWSHED\nviewshed_getPositionFromViewpoint(modelMatrix * pn * sC);\n#endif\n#ifdef HAS_FLOODANALYSE\nflood_getHeight(modelMatrix * pn * sC);\n#endif\n#ifdef HAS_HEATMAP\nheatmap_compute(uProjectionMatrix * uModelViewMatrix * pn, sC);\n#endif\n#ifdef HAS_FOG\nfog_getDist(modelMatrix * pn * sC);\n#endif\n}",
            frag: "#if __VERSION__ == 100\n#if defined(GL_EXT_shader_texture_lod)\n#extension GL_EXT_shader_texture_lod : enable\n#define textureCubeLod(tex, uv, lod) textureCubeLodEXT(tex, uv, lod)\n#else\n#define textureCubeLod(tex, uv, lod) textureCube(tex, uv, lod)\n#endif\n#else\n#define textureCubeLod(tex, uv, lod) textureLod(tex, uv, lod)\n#endif\nprecision mediump float;\n#include <gl2_frag>\nstruct MaterialUniforms {\n  vec2 roughnessMetalness;\n  vec3 albedo;\n  float alpha;\n  vec3 normal;\n  vec3 emit;\n  float ao;\n  vec3 specularColor;\n  float glossiness;\n} vg;\n#if defined(HAS_SHADOWING)\n#include <vsm_shadow_frag>\n#endif\nuniform vec3 uCameraPosition;\n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nuniform vec4 uDiffuseFactor;\nuniform vec3 uSpecularFactor;\nuniform float uGlossinessFactor;\n#if defined(HAS_DIFFUSE_MAP)\nuniform sampler2D uDiffuseTexture;\n#endif\n#if defined(HAS_SPECULARGLOSSINESS_MAP)\nuniform sampler2D uSpecularGlossinessTexture;\n#endif\n#endif\nuniform vec3 uEmitColor;\nuniform vec4 uBaseColorFactor;\nuniform float uAlbedoPBRFactor;\nuniform float uAnisotropyDirection;\nuniform float uAnisotropyFactor;\nuniform float uClearCoatF0;\nuniform float uClearCoatFactor;\nuniform float uClearCoatIor;\nuniform float uClearCoatRoughnessFactor;\nuniform float uClearCoatThickness;\nuniform float uEmitColorFactor;\nuniform float uEnvironmentExposure;\nuniform float uRoughnessFactor;\nuniform float uMetallicFactor;\nuniform float uNormalMapFactor;\nuniform float uRGBMRange;\nuniform float uSpecularF0Factor;\nuniform float uStaticFrameNumShadow3;\nuniform float uSubsurfaceScatteringFactor;\nuniform float uSubsurfaceTranslucencyFactor;\nuniform float uSubsurfaceTranslucencyThicknessFactor;\nuniform int uEmitMultiplicative;\nuniform int uNormalMapFlipY;\nuniform int uOutputLinear;\nuniform mat3 uEnvironmentTransform;\n#if defined(HAS_ALBEDO_MAP)\nuniform sampler2D uBaseColorTexture;\n#endif\n#if defined(HAS_METALLICROUGHNESS_MAP)\nuniform sampler2D uMetallicRoughnessTexture;\n#endif\n#if defined(HAS_EMISSIVE_MAP)\nuniform sampler2D uEmissiveTexture;\n#endif\n#if defined(HAS_AO_MAP)\nuniform sampler2D uOcclusionTexture;\n#endif\n#if defined(HAS_NORMAL_MAP)\nuniform sampler2D uNormalTexture;\n#endif\nuniform sampler2D sIntegrateBRDF;\n#if defined(HAS_IBL_LIGHTING)\nuniform samplerCube sSpecularPBR;\nuniform vec3 uDiffuseSPH[9];\nuniform vec2 uTextureEnvironmentSpecularPBRLodRange;\nuniform vec2 uTextureEnvironmentSpecularPBRTextureSize;\n#else\nuniform vec3 uAmbientColor;\n#endif\nuniform vec2 uNearFar;\nuniform vec3 uClearCoatTint;\nuniform vec3 uSketchfabLight0_viewDirection;\nuniform vec4 uSketchfabLight0_diffuse;\n#ifdef HAS_SSR\nvarying vec3 vViewNormal;\nvarying vec4 vViewTangent;\n#endif\nvarying vec3 vModelVertex;\nvarying vec4 vViewVertex;\n#if defined(HAS_MAP)\nvarying vec2 vTexCoord;\n#endif\nvarying vec3 vModelNormal;\n#if defined(HAS_TANGENT)\nvarying vec4 vModelTangent;\nvarying vec3 vModelBiTangent;\n#endif\n#if defined(HAS_COLOR)\nvarying vec4 vColor;\n#elif defined(IS_LINE_EXTRUSION)\nuniform vec4 lineColor;\n#else\nuniform vec4 polygonFill;\n#endif\n#ifdef HAS_INSTANCE_COLOR\nvarying vec4 vInstanceColor;\n#endif\n#ifdef IS_LINE_EXTRUSION\nuniform float lineOpacity;\n#else\nuniform float polygonOpacity;\n#endif\n#include <viewshed_frag>\n#include <flood_frag>\n#include <heatmap_render_frag>\n#include <fog_render_frag>\n#define SHADER_NAME PBR\nfloat oR(const in float nZ) {\n  return nZ < .0031308 ? nZ * 12.92 : 1.055 * pow(nZ, 1. / 2.4) - .055;\n}\nvec3 oR(const in vec3 nZ) {\n  return vec3(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055);\n}\nvec4 oR(const in vec4 nZ) {\n  return vec4(nZ.r < .0031308 ? nZ.r * 12.92 : 1.055 * pow(nZ.r, 1. / 2.4) - .055, nZ.g < .0031308 ? nZ.g * 12.92 : 1.055 * pow(nZ.g, 1. / 2.4) - .055, nZ.b < .0031308 ? nZ.b * 12.92 : 1.055 * pow(nZ.b, 1. / 2.4) - .055, nZ.a);\n}\nfloat pR(const in float nZ) {\n  return nZ < .04045 ? nZ * (1. / 12.92) : pow((nZ + .055) * (1. / 1.055), 2.4);\n}\nvec3 pR(const in vec3 nZ) {\n  return vec3(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 pR(const in vec4 nZ) {\n  return vec4(nZ.r < .04045 ? nZ.r * (1. / 12.92) : pow((nZ.r + .055) * (1. / 1.055), 2.4), nZ.g < .04045 ? nZ.g * (1. / 12.92) : pow((nZ.g + .055) * (1. / 1.055), 2.4), nZ.b < .04045 ? nZ.b * (1. / 12.92) : pow((nZ.b + .055) * (1. / 1.055), 2.4), nZ.a);\n}\nvec3 tf(const in vec4 rgba) {\n  const float tg = 8.;\n  return rgba.rgb * tg * rgba.a;\n}\nconst mat3 th = mat3(6.0013, -2.7, -1.7995, -1.332, 3.1029, -5.772, .3007, -1.088, 5.6268);\nvec3 ti(const in vec4 tj) {\n  float tk = tj.z * 255. + tj.w;\n  vec3 tl;\n  tl.y = exp2((tk - 127.) / 2.);\n  tl.z = tl.y / tj.y;\n  tl.x = tj.x * tl.z;\n  vec3 tm = th * tl;\n  return max(tm, .0);\n}\nconst mat3 vh = mat3(.2209, .3390, .4184, .1138, .6780, .7319, .0102, .1130, .2969);\nvec4 vi(in vec3 rgb) {\n  vec4 ng;\n  vec3 tl = rgb * vh;\n  tl = max(tl, vec3(1e-6));\n  ng.xy = tl.xy / tl.z;\n  float tk = 2. * log2(tl.y) + 127.;\n  ng.w = fract(tk);\n  ng.z = (tk - floor(ng.w * 255.) / 255.) / 255.;\n  return ng;\n}\nvec4 qE(const in vec3 nZ, const in float qF) {\n  if(qF <= .0)\n    return vec4(nZ, 1.);\n  vec4 qG;\n  vec3 qH = nZ / qF;\n  qG.a = clamp(max(max(qH.r, qH.g), max(qH.b, 1e-6)), .0, 1.);\n  qG.a = ceil(qG.a * 255.) / 255.;\n  qG.rgb = qH / qG.a;\n  return qG;\n}\nvec3 qI(const in vec4 nZ, const in float qF) {\n  if(qF <= .0)\n    return nZ.rgb;\n  return qF * nZ.rgb * nZ.a;\n}\nvec3 vj() {\n  return vg.albedo;\n}\nfloat vk() {\n  return vg.alpha;\n}\nfloat vl() {\n  \n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nvec3 nZ = vg.specularColor;\n  return max(max(nZ.r, nZ.g), nZ.b);\n#else\nreturn vg.roughnessMetalness.y;\n#endif\n}\nfloat vm() {\n  return uSpecularF0Factor;\n}\nfloat vn() {\n  \n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nreturn 1. - vg.glossiness;\n#else\nreturn vg.roughnessMetalness.x;\n#endif\n}\nvec3 vo() {\n  return vg.emit;\n}\nfloat vp() {\n  return uSubsurfaceTranslucencyFactor;\n}\nvec3 vq() {\n  return vg.normal;\n}\nfloat vr() {\n  return uClearCoatFactor;\n}\nfloat vs() {\n  return uClearCoatRoughnessFactor;\n}\nfloat vt() {\n  return vg.ao;\n}\nint tn(const in vec4 qz) {\n  float to = floor(qz.b * 255. + .5);\n  float tp = mod(to, 2.);\n  tp += mod(to - tp, 4.);\n  return int(tp);\n}\nfloat ts(const in vec4 qz) {\n  if(tn(qz) == 0) {\n    const vec3 vu = 1. / vec3(1., 255., 65025.);\n    return dot(qz.rgb, vu);\n  }\n  return qz.r + qz.g / 255.;\n}\nfloat vv(const in vec4 qz) {\n  float vw = qz.b - mod(qz.b, 4. / 255.);\n  return vw * 255. / 4. / 63.;\n}\nfloat tt(const in vec4 qz) {\n  return qz.a;\n}\nfloat vx(const in sampler2D qA, const in vec2 mS, const in vec4 vy, const vec2 vz) {\n  float vA = clamp((-vy.z * vy.w - vz.x) / (vz.y - vz.x), .0, 1.);\n  return vA - ts(texture2D(qA, mS));\n}\nfloat pJ(const in vec2 pK) {\n  vec3 pL = fract(vec3(pK.xyx) * .1031);\n  pL += dot(pL, pL.yzx + 19.19);\n  return fract((pL.x + pL.y) * pL.z);\n}\nfloat pS(const in vec2 pK, const in float pT) {\n  vec3 pU = vec3(.06711056, .00583715, 52.9829189);\n  return fract(pU.z * fract(dot(pK.xy + pT * vec2(47., 17.) * .695, pU.xy))) * .5;\n}\nfloat vB(const in vec2 pK, const in float pT) {\n  float vC = pT;\n  float vD = fract((pK.x + pK.y * 2. - 1.5 + vC) / 5.);\n  float uR = fract(dot(vec2(171., 231.) / 71., pK.xy));\n  return (vD * 5. + uR) * (1.2 / 6.);\n}\nvoid vE(const in vec4 pK, const in int vF, const in float pk, const in float pQ, const in float vG, const in float pT, const in vec2 vz, const in vec4 vH) {\n  if(vF != 1) {\n    if(pk < pQ)\n      discard;\n    return;\n  }\n  float vI;\n  if(vG == .0) {\n    float vJ = (1. / pK.w - vz.x) / (vz.y - vz.x);\n    float vK = floor(vJ * 500.0) / 500.0;\n    vI = pS(pK.xy + vK, pT);\n  } else {\n    vI = pJ(pK.xy + vH.xy * 1000.0 + pK.z * (abs(vH.z) == 2. ? 1000.0 : 1.));\n  }\n  if(pk * pQ < vI)\n    discard;\n  \n}\nvec3 vL(const in vec4 sd, const in vec3 oP, const in vec2 vM) {\n  vec3 vN = normalize(sd.xyz);\n  vec3 vO = sd.w * normalize(cross(oP, vN));\n  return normalize(oP + vM.x * vN + vM.y * vO);\n}\nvec3 oO(const in float pQ, in vec3 oP, const in vec3 t, const in vec3 b, in vec3 om) {\n  oP.xy = pQ * oP.xy;\n  mat3 oQ = mat3(t, b, om);\n  return normalize(oQ * oP);\n}\nvec3 vP(in vec2 sd, const in vec3 t, const in vec3 b) {\n  return normalize(sd.x * t + sd.y * b);\n}\nvec3 vQ(in vec2 vR, const in vec3 t, const in vec3 b, in vec3 om) {\n  return normalize(vR.x * t + vR.y * b + om);\n}\nfloat vS(const in vec4 rgba) {\n  return dot(rgba, vec4(1., 1. / 255., 1. / 65025., 1. / 16581375.));\n}\nfloat vT(const in sampler2D vU, const in vec2 mS) {\n  return vS(texture2D(vU, mS));\n}\nfloat vV(const in sampler2D vU, const in vec2 mS, const in float vW, const in vec4 vX) {\n  float qA = vT(vU, clamp(mS, vX.xy, vX.zw));\n  return vW - qA;\n}\nfloat vY(const in float pu, const in vec4 vZ) {\n  float wa = vZ.x;\n  float wb = vZ.y * pu;\n  float wc = vZ.z * pu * pu;\n  return 1. / (wa + wb + wc);\n}\nvoid wd(const in vec3 oP, const in vec3 ra, const in vec3 we, const in vec4 vZ, const in vec3 wf, const in float wg, const in float wh, out float wi, out vec3 wj, out float wk) {\n  wj = wf - ra;\n  float pu = length(wj);\n  wj = pu > .0 ? wj / pu : vec3(.0, 1., .0);\n  float wl = dot(-wj, we);\n  float wm = wl * smoothstep(.0, 1., (wl - wg) / wh);\n  wk = dot(wj, oP);\n  wi = wm * vY(pu, vZ);\n}\nvoid wn(const in vec3 oP, const in vec3 ra, const in vec4 vZ, const in vec3 wf, out float wi, out vec3 wj, out float wk) {\n  wj = wf - ra;\n  float pu = length(wj);\n  wi = vY(pu, vZ);\n  wj = pu > .0 ? wj / pu : vec3(.0, 1., .0);\n  wk = dot(wj, oP);\n}\nvoid wo(const in vec3 wp, const in vec3 oP, const in vec3 we, out float wi, out vec3 wj, out float wk) {\n  wi = 1.;\n  wj = -we;\n  wk = dot(wj, oP);\n}\nvec4 wq(const in vec3 oP, const in vec3 wp, const in float nI) {\n  float wr = clamp(dot(oP, wp), 0., 1.);\n  float nJ = nI * nI;\n  return vec4(nJ, nJ * nJ, wr, wr * (1. - nJ));\n}\nfloat ws(const vec4 wq, const float wt) {\n  float qx = wq.y;\n  float py = (wt * qx - wt) * wt + 1.;\n  return qx / (3.141593 * py * py);\n}\nvec3 wu(const vec3 nE, const float nF, const in float wv) {\n  float ww = pow(1. - wv, 5.);\n  return nF * ww + (1. - ww) * nE;\n}\nfloat wu(const float nE, const float nF, const in float wv) {\n  return nE + (nF - nE) * pow(1. - wv, 5.);\n}\nfloat wx(const vec4 wq, const float wy) {\n  float a = wq.x;\n  float wz = wy * (wq.w + a);\n  float wA = wq.z * (wy * (1. - a) + a);\n  return .5 / (wz + wA);\n}\nvec3 wB(const vec4 wq, const vec3 oP, const vec3 wp, const vec3 wj, const vec3 oB, const float wy, const float nF) {\n  vec3 rZ = normalize(wp + wj);\n  float wt = clamp(dot(oP, rZ), 0., 1.);\n  float wv = clamp(dot(wj, rZ), 0., 1.);\n  float nT = ws(wq, wt);\n  float nU = wx(wq, wy);\n  vec3 nS = wu(oB, nF, wv);\n  return (nT * nU * 3.141593) * nS;\n}\nvoid wC(const in vec3 oP, const in vec3 wp, const in float wy, const in vec4 wq, const in vec3 pa, const in vec3 oB, const in float wi, const in vec3 wD, const in vec3 wj, const in float nF, out vec3 wE, out vec3 wF, out bool wG) {\n  wG = wy > .0;\n  if(wG == false) {\n    wF = wE = vec3(.0);\n    return;\n  }\n  vec3 wH = wi * wy * wD;\n  wF = wH * wB(wq, oP, wp, wj, oB, wy, nF);\n  wE = wH * pa;\n}\nfloat wI(float at, float ab, float wJ, float wK, float wL, float wM, float wr, float wy) {\n  float wN = wy * length(vec3(at * wJ, ab * wK, wr));\n  float wO = wr * length(vec3(at * wL, ab * wM, wy));\n  return .5 / (wN + wO);\n}\nfloat wP(const float at, const float ab, const float wQ, const float wR, const float wt) {\n  float qx = at * ab;\n  vec3 py = vec3(ab * wQ, at * wR, qx * wt);\n  float x = qx / dot(py, py);\n  return qx * (x * x) / 3.141593;\n}\nvec3 wS(const vec4 wq, const vec3 oP, const vec3 wp, const vec3 wj, const vec3 oB, const float wy, const float nF, const in vec3 wT, const in vec3 wU, const in float wV) {\n  vec3 rZ = normalize(wp + wj);\n  float wt = clamp(dot(oP, rZ), 0., 1.);\n  float wr = clamp(dot(oP, wp), 0., 1.);\n  float wv = clamp(dot(wj, rZ), 0., 1.);\n  float wJ = dot(wT, wp);\n  float wK = dot(wU, wp);\n  float wL = dot(wT, wj);\n  float wM = dot(wU, wj);\n  float wQ = dot(wT, rZ);\n  float wR = dot(wU, rZ);\n  float wW = sqrt(1. - abs(wV) * .9);\n  if(wV > .0)\n    wW = 1. / wW;\n  float at = wq.x * wW;\n  float ab = wq.x / wW;\n  float nT = wP(at, ab, wQ, wR, wt);\n  float nU = wI(at, ab, wJ, wK, wL, wM, wr, wy);\n  vec3 nS = wu(oB, nF, wv);\n  return (nT * nU * 3.141593) * nS;\n}\nvoid wX(const in vec3 oP, const in vec3 wp, const in float wy, const in vec4 wq, const in vec3 pa, const in vec3 oB, const in float wi, const in vec3 wD, const in vec3 wj, const in float nF, const in vec3 wT, const in vec3 wU, const in float wV, out vec3 wE, out vec3 wF, out bool wG) {\n  wG = wy > .0;\n  if(wG == false) {\n    wF = wE = vec3(.0);\n    return;\n  }\n  vec3 wH = wi * wy * wD;\n  wF = wH * wS(wq, oP, wp, wj, oB, wy, nF, wT, wU, wV);\n  wE = wH * pa;\n}\n#if defined(HAS_IBL_LIGHTING)\nvec3 qS(const in vec3 oP) {\n  float x = oP.x;\n  float y = oP.y;\n  float z = oP.z;\n  vec3 ng = (uDiffuseSPH[0] + uDiffuseSPH[1] * x + uDiffuseSPH[2] * y + uDiffuseSPH[3] * z + uDiffuseSPH[4] * z * x + uDiffuseSPH[5] * y * z + uDiffuseSPH[6] * y * x + uDiffuseSPH[7] * (3. * z * z - 1.) + uDiffuseSPH[8] * (x * x - y * y));\n  return max(ng, vec3(.0));\n}\nfloat wY(const in float wZ) {\n  return wZ;\n}\nvec3 xa(const in float xb, const in vec3 qL) {\n  vec3 qO = qL;\n  float xc = uTextureEnvironmentSpecularPBRLodRange.x;\n  float xd = min(xc, wY(xb) * uTextureEnvironmentSpecularPBRLodRange.y);\n  return qI(textureCubeLod(sSpecularPBR, qO, xd), uRGBMRange);\n}\nvec3 xe(const in vec3 rX, const in vec3 qL, const in float xf) {\n  float xg = 1. - xf;\n  float xh = xg * (sqrt(xg) + xf);\n  return mix(rX, qL, xh);\n}\nvec3 xi(const in vec3 oP, const in vec3 wp, const in float nI, const in vec3 xj) {\n  vec3 qL = reflect(-wp, oP);\n  qL = xe(oP, qL, nI);\n  vec3 sA = xa(nI, uEnvironmentTransform * qL);\n  float pQ = clamp(1. + dot(qL, xj), .0, 1.);\n  sA *= pQ * pQ;\n  return sA;\n}\n#else\nvec3 xi(const in vec3 oP, const in vec3 wp, const in float nI, const in vec3 xj) {\n  return uAmbientColor;\n}\n#endif\nvec3 xk(const in vec3 oB, const in float nI, const in float wr, const in float nF) {\n  vec4 rgba = texture2D(sIntegrateBRDF, vec2(wr, nI));\n  float b = (rgba[3] * 65280.0 + rgba[2] * 255.);\n  float a = (rgba[1] * 65280.0 + rgba[0] * 255.);\n  const float xl = 1. / 65535.;\n  return (oB * a + b * nF) * xl;\n}\nvec3 xm(const in vec3 oP, const in vec3 wp, const in float nI, const in vec3 oB, const in vec3 xj, const in float nF) {\n  float wr = dot(oP, wp);\n  return xi(oP, wp, nI, xj) * xk(oB, nI, wr, nF);\n}\nvec3 xn(const in float wk, const in float wi, const in float xo, const in vec3 xp, const in float xq, const in float xr, const in vec3 pa, const in vec3 wD) {\n  float wrap = clamp(.3 - wk, 0., 1.);\n  float xs = max(.0, xr / max(.001, xo));\n  float xt = xq * wi * wrap;\n  return xt * wD * pa * exp(-xs / max(xp, vec3(.001)));\n}\nfloat xu(const in vec2 mS, const in vec4 vH) {\n  return mod(step(vH.z, .0) + floor(mS.x) + floor(mS.y), 2.);\n}\nvec3 xv(const float wr, const float wy, const vec3 xw, const float py) {\n  return exp(xw * -py * ((wy + wr) / max(wy * wr, 1e-3)));\n}\nvec3 xx(const in float wr, const in float wy, const in float xy) {\n  return mix(vec3(1.), xv(wr, wy, uClearCoatTint, uClearCoatThickness), xy);\n}\nvoid xz(const in float xA, const in vec3 oP, const in vec3 wp, const in float wk, const in vec4 wq, const in float wi, const in vec3 wD, const in vec3 wj, const in float xy, out vec3 xB, out vec3 xC) {\n  if(wk <= .0) {\n    xB = vec3(.0);\n    xC = vec3(.0);\n    return;\n  }\n  float xD = clamp(dot(oP, -refract(wj, oP, 1. / uClearCoatIor)), 0., 1.);\n  vec3 xE = xx(xA, xD, xy);\n  vec3 rZ = normalize(wp + wj);\n  float wt = clamp(dot(oP, rZ), 0., 1.);\n  float wv = clamp(dot(wj, rZ), 0., 1.);\n  float nT = ws(wq, wt);\n  float nU = wx(wq, xD);\n  float nS = wu(uClearCoatF0, 1., wv);\n  xB = (wi * wk * xy * nT * nU * 3.141593 * nS) * wD;\n  xC = (1. - nS * xy) * xE;\n}\nfloat xF(const in int xG, const in float pf, const in vec3 oP, const in vec3 wp) {\n  if(xG == 0)\n    return 1.;\n  float py = dot(oP, wp) + pf;\n  return clamp(py * py - 1. + pf, .0, 1.);\n}\nfloat xH(const in float nI, const in vec3 oP) {\n  float xI = dot(oP, oP);\n  if(xI < 1.) {\n    float xJ = sqrt(xI);\n    float xK = (3. * xJ - xI * xJ) / (1. - xI);\n    return min(1., sqrt(nI * nI + 1. / xK));\n  }\n  return nI;\n}\nvec3 xL(const in vec3 oP, const in vec3 wp, const in float nI, const in vec3 wT, const in vec3 wU, const in float wV) {\n  vec3 xM = wV >= .0 ? wU : wT;\n  vec3 xN = cross(xM, wp);\n  vec3 xO = cross(xN, xM);\n  float xP = abs(wV) * clamp(5. * nI, .0, 1.);\n  return normalize(mix(oP, xO, xP));\n}\nvec3 xQ(vec3 nZ) {\n  \n#if defined(GAMMA_CORRECT_INPUT)\nreturn pow(nZ, vec3(2.2));\n#else\nreturn nZ;\n#endif\n}\nvoid xR() {\n  vg.albedo = uAlbedoPBRFactor * uBaseColorFactor.rgb;\n  vg.alpha = uBaseColorFactor.a;\n#if defined(HAS_ALBEDO_MAP)\nvec4 oU = texture2D(uBaseColorTexture, vTexCoord);\n  vg.albedo *= pR(oU.rgb);\n  vg.alpha *= oU.a;\n#endif\n#if defined(HAS_COLOR)\nvg.albedo *= vColor.rgb;\n  vg.alpha *= vColor.a;\n#elif defined(IS_LINE_EXTRUSION)\nvg.albedo *= lineColor.rgb;\n  vg.alpha *= lineColor.a;\n#else\nvg.albedo *= polygonFill.rgb;\n  vg.alpha *= polygonFill.a;\n#endif\n#if defined(HAS_INSTANCE_COLOR)\nvg.albedo *= vInstanceColor.rgb;\n  vg.alpha *= vInstanceColor.a;\n#endif\n#if defined(IS_LINE_EXTRUSION)\nvg.alpha *= lineOpacity;\n#else\nvg.alpha *= polygonOpacity;\n#endif\n#if defined(HAS_METALLICROUGHNESS_MAP)\nvg.roughnessMetalness = texture2D(uMetallicRoughnessTexture, vTexCoord).gb * vec2(uRoughnessFactor, uMetallicFactor);\n#else\nvg.roughnessMetalness = vec2(uRoughnessFactor, uMetallicFactor);\n#endif\n#if defined(HAS_EMISSIVE_MAP)\nvg.emit = pR(texture2D(uEmissiveTexture, vTexCoord).rgb);\n#else\nvg.emit = uEmitColor;\n#endif\nvg.emit *= uEmitColorFactor;\n#if defined(HAS_AO_MAP)\nvg.ao = texture2D(uOcclusionTexture, vTexCoord).r;\n#else\nvg.ao = 1.;\n#endif\n#if defined(HAS_NORMAL_MAP)\nvec3 xS = texture2D(uNormalTexture, vTexCoord).xyz * 2. - 1.;\n  xS.y = uNormalMapFlipY == 1 ? -xS.y : xS.y;\n  vg.normal = xS;\n#else\nvg.normal = normalize(vModelNormal);\n#endif\n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nvg.albedo *= uDiffuseFactor.rgb;\n  vg.alpha *= uDiffuseFactor.a;\n#if defined(HAS_DIFFUSE_MAP)\nvec4 xT = texture2D(uDiffuseTexture, vTexCoord);\n  vg.xT *= pR(xT.rgb);\n  vg.alpha *= xT.a;\n#endif\nvg.specularColor = uSpecularFactor;\n  vg.glossiness = uGlossinessFactor;\n#if defined(HAS_SPECULARGLOSSINESS_MAP)\nvec4 xU = texture2D(uSpecularGlossinessTexture, vTexCoord);\n  vg.specularColor *= pR(xU.rgb);\n  vg.glossiness *= xU.a;\n#endif\n#endif\n}\nvec3 rE(const vec3 x) {\n  const float a = 2.51;\n  const float b = .03;\n  const float qk = 2.43;\n  const float py = .59;\n  const float rF = .14;\n  return (x * (a * x + b)) / (x * (qk * x + py) + rF);\n}\nvec3 rG(vec3 nZ) {\n  nZ = rE(nZ);\n  return nZ = pow(nZ, vec3(1. / 2.2));\n}\n#ifdef HAS_SSR\nuniform sampler2D TextureDepthTest;\nuniform sampler2D TextureDepth;\nuniform highp vec2 uGlobalTexSize;\nuniform float uSsrFactor;\nuniform float uSsrQuality;\nuniform vec2 uPreviousGlobalTexSize;\nuniform sampler2D TextureToBeRefracted;\nuniform vec2 uTextureToBeRefractedSize;\nuniform highp mat4 uProjectionMatrix;\nuniform mat4 uInvProjMatrix;\nuniform vec4 uTaaCornersCSLeft[2];\nuniform mat4 uReprojectViewProj;\nvec3 xV(const in float xW, const in float xX, const in vec2 qM) {\n  float xY = min(xX - .01, xW);\n  float xZ = floor(xY);\n  float ya = min(xX, xZ + 1.);\n  float yb = pow(2., ya);\n  vec2 yc = 2. * yb / qM;\n  if(xY - xZ > .5)\n    yb *= 2.;\n  return vec3(yc, yb);\n}\nvec2 yd(const in vec2 ye, const in vec3 yf) {\n  vec2 mS = max(yf.xy, min(1. - yf.xy, ye));\n  return vec2(2. * mS.x, yf.z - 1. - mS.y) / yf.z;\n}\nvec3 yg(const in mat4 tr, const in vec3 ra) {\n  vec4 yh = tr * vec4(ra, 1.);\n  return vec3(.5 + .5 * yh.xy / yh.w, yh.w);\n}\nvec3 yi(const in float uu, const in vec2 mS) {\n  vec3 yf = xV(7. * uu, 7., uPreviousGlobalTexSize);\n  vec2 yj = yd(mS, yf);\n  return qI(texture2D(TextureToBeRefracted, yj), 7.);\n}\nfloat tq(float qA) {\n  highp mat4 tr = uProjectionMatrix;\n  highp float z = qA * 2. - 1.;\n  return -tr[3].z / (z + tr[2].z);\n}\nfloat yk(const vec2 mS, const in vec3 yf) {\n  return tq(texture2D(TextureDepth, mS).r);\n}\nvec3 yl(const in float pT, const in vec3 ym, const in vec3 yn, const in vec3 yo, const in vec3 wp, const in float yp) {\n  vec2 yq;\n  yq.x = pS(gl_FragCoord.yx, pT);\n  yq.y = fract(yq.x * 52.9829189);\n  yq.y = mix(yq.y, 1., .7);\n  float yr = 2. * 3.14159 * yq.x;\n  float oh = pow(max(yq.y, .000001), yp / (2. - yp));\n  float ys = sqrt(1. - oh * oh);\n  vec3 ot = vec3(ys * cos(yr), ys * sin(yr), oh);\n  ot = ot.x * ym + ot.y * yn + ot.z * yo;\n  return normalize((2. * dot(wp, ot)) * ot - wp);\n}\nfloat yt(const in float pT) {\n  return (pS(gl_FragCoord.xy, pT) - .5);\n}\nvec3 yu(const in vec3 yv, const in float yw, const in vec3 yx) {\n  vec3 yy = yg(uProjectionMatrix, vViewVertex.xyz + yx * yw);\n  yy.z = 1. / yy.z;\n  yy -= yv;\n  float yz = min(1., .99 * (1. - yv.x) / max(1e-5, yy.x));\n  float yA = min(1., .99 * (1. - yv.y) / max(1e-5, yy.y));\n  float yB = min(1., .99 * yv.x / max(1e-5, -yy.x));\n  float yC = min(1., .99 * yv.y / max(1e-5, -yy.y));\n  return yy * min(yz, yA) * min(yB, yC);\n}\nfloat yD(const in vec3 yv, const in vec3 yy, inout float yE, inout float yF) {\n  float yG = (yF + yE) * .5;\n  vec3 yH = yv + yy * yG;\n  float z = texture2D(TextureDepth, yH.xy).r;\n  float qA = tq(z);\n  float sY = -1. / yH.z;\n  yE = qA > sY ? yE : yG;\n  yF = qA > sY ? yG : yF;\n  return yG;\n}\nvec4 yI(const in vec3 yv, const in float yw, in float yJ, const in vec3 yx, const in float nI, const in float pT) {\n  float yK = 1. / float(20);\n  if(uSsrQuality > 1.)\n    yK /= 2.;\n  yJ *= yK;\n  vec3 yy = yu(yv, yw, yx);\n  float yL = yK;\n  vec3 yM = vec3(.0, yL, 1.);\n  vec3 yH;\n  float z, qA, sY, yN, yO, yP;\n  bool yQ;\n  float yR = 1.;\n  float yG;\n  for(int ss = 0; ss < 20; ss++) {\n    yH = yv + yy * yM.y;\n    z = texture2D(TextureDepth, yH.xy).r;\n    qA = tq(z);\n    sY = -1. / yH.z;\n    float yS = clamp(sign(.95 - qA), .0, 1.);\n    yN = yS * (sY - qA);\n    yQ = abs(yN + yJ) < yJ;\n    yO = clamp(yM.x / (yM.x - yN), .0, 1.);\n    yP = yQ ? yM.y + yO * yK - yK : 1.;\n    yM.z = min(yM.z, yP);\n    yM.x = yN;\n    if(yQ) {\n      float yE = yM.y - yK;\n      float yF = yM.y;\n      yG = yD(yv, yy, yE, yF);\n      yG = yD(yv, yy, yE, yF);\n      yG = yD(yv, yy, yE, yF);\n      yR = yG;\n      break;\n    }\n    yM.y += yK;\n  }\n  if(uSsrQuality > 1.) {\n    for(int ss = 0; ss < 8; ss++) {\n      yH = yv + yy * yM.y;\n      z = texture2D(TextureDepth, yH.xy).r;\n      qA = tq(z);\n      yN = sign(1. - z) * (-1. / yH.z - qA);\n      yQ = abs(yN + yJ) < yJ;\n      yO = clamp(yM.x / (yM.x - yN), .0, 1.);\n      yP = yQ ? yM.y + yO * yK - yK : 1.;\n      yM.z = min(yM.z, yP);\n      yM.x = yN;\n      yM.y += yK;\n    }\n  }\n  return vec4(yv + yy * yR, 1. - yR);\n}\nvec4 yT(in vec4 yU, const in float yV, const in vec3 yW, const in vec3 yX, const in float nI) {\n  vec4 tz = mix(uTaaCornersCSLeft[0], uTaaCornersCSLeft[1], yU.x);\n  yU.xyz = vec3(mix(tz.xy, tz.zw, yU.y), 1.) * -1. / yU.z;\n  yU.xyz = (uReprojectViewProj * vec4(yU.xyz, 1.)).xyw;\n  yU.xy /= yU.z;\n  float yY = clamp(6. - 6. * max(abs(yU.x), abs(yU.y)), .0, 1.);\n  yU.xy = .5 + .5 * yU.xy;\n  vec3 ql = yX * yi(nI * (1. - yU.w), yU.xy);\n  return vec4(mix(yW, ql, yV * yY), 1.);\n}\nvec3 ssr(const in vec3 yW, const in vec3 yX, const in float nI, const in vec3 oP, const in vec3 wp) {\n  float yZ = .0;\n  vec4 ng = vec4(.0);\n  float yp = nI * nI;\n  yp = yp * yp;\n  vec3 za = abs(oP.z) < .999 ? vec3(.0, .0, 1.) : vec3(1., .0, .0);\n  vec3 ym = normalize(cross(za, oP));\n  vec3 yn = cross(oP, ym);\n  float yV = uSsrFactor * clamp(-4. * dot(wp, oP) + 3.45, .0, 1.);\n  yV *= clamp(4.7 - nI * 5., .0, 1.);\n  vec3 yv = yg(uProjectionMatrix, vViewVertex.xyz);\n  yv.z = 1. / yv.z;\n  vec3 yx = yl(yZ, ym, yn, oP, wp, yp);\n  float yw = mix(uNearFar.y + vViewVertex.z, -vViewVertex.z - uNearFar.x, yx.z * .5 + .5);\n  float yJ = .5 * yw;\n  vec4 yU;\n  if(dot(yx, oP) > .001 && yV > .0) {\n    yU = yI(yv, yw, yJ, yx, nI, yZ);\n    if(yU.w > .0)\n      ng += yT(yU, yV, yW, yX, nI);\n    \n  }\n  return ng.w > .0 ? ng.rgb / ng.w : yW;\n}\n#endif\nvoid main() {\n  \n#ifdef HAS_SSR\nvec2 rb = gl_FragCoord.xy / uGlobalTexSize;\n  float qA = texture2D(TextureDepthTest, rb).r;\n  if(qA == .0) {\n    discard;\n    return;\n  }\n#endif\nxR();\n  vec3 wp = normalize(uCameraPosition - vModelVertex.xyz);\n#if defined(HAS_DOUBLE_SIDE)\nvec3 xj = gl_FrontFacing ? normalize(vModelNormal) : -normalize(vModelNormal);\n#else\nvec3 xj = normalize(vModelNormal);\n#endif\n#if defined(HAS_TANGENT)\nvec4 sd;\n  sd = vModelTangent;\n#if defined(HAS_DOUBLE_SIDE)\nsd.xyz = gl_FrontFacing ? normalize(sd.xyz) : -normalize(sd.xyz);\n#else\nsd.xyz = normalize(sd.xyz);\n#endif\nvec3 vO = normalize(vModelBiTangent);\n#endif\nfloat nE = .08 * vm();\n  float zb = vl();\n  vec3 zc = vj();\n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nvec3 zd = vg.specularColor;\n#else\nvec3 zd = mix(vec3(nE), zc, zb);\n#endif\nzc *= 1. - zb;\n  float ze = clamp(50.0 * zd.g, .0, 1.);\n  float zf = vn();\n  vec3 zg = vo();\n  vec3 zh = vq();\n  vec3 zi = vec3(zh);\n#if defined(HAS_TANGENT) && defined(HAS_NORMAL_MAP)\nzi = oO(uNormalMapFactor, zi, sd.xyz, vO, xj);\n#endif\nfloat zj = vr();\n  float zk = vs();\n  vec3 zl = xj;\n#if defined(HAS_TANGENT)\nfloat wV;\n  vec3 wT;\n  vec3 wU;\n  if(uAnisotropyFactor > .0) {\n    wV = uAnisotropyFactor;\n    sd.xyz = normalize(sd.xyz - zi * dot(sd.xyz, zi));\n    vO = normalize(cross(zi, sd.xyz)) * sd.w;\n    wT = normalize(mix(sd.xyz, vO, uAnisotropyDirection));\n    wU = normalize(mix(vO, -sd.xyz, uAnisotropyDirection));\n  }\n#endif\nvec3 pa = vec3(.0);\n  vec3 oB = vec3(.0);\n  vec3 zm;\n#if defined(HAS_TANGENT)\nif(uAnisotropyFactor > .0) {\n    zm = xL(zi, wp, zf, wT, wU, wV);\n  } else {\n    zm = zi;\n  }\n#else\nzm = zi;\n#endif\n#if defined(HAS_IBL_LIGHTING)\npa = zc * qS(zi) * .5;\n#else\npa = zc * uAmbientColor;\n#endif\noB = xm(zm, wp, zf, zd, xj, ze);\n  float xA;\n  if(uClearCoatFactor > .0) {\n    xA = clamp(dot(zl, -refract(wp, zl, 1. / uClearCoatIor)), 0., 1.);\n    float zn = zj * wu(uClearCoatF0, 1., xA);\n    vec3 zo = xx(xA, xA, zj);\n    oB = mix(oB * zo, xi(zl, wp, zk, xj), zn);\n    pa *= zo * (1. - zn);\n  }\n  float zp = 1.;\n  float zq = vt();\n  pa *= uEnvironmentExposure * zq;\n#ifdef HAS_IBL_LIGHTING\nzp = xF(1, zq, zi, wp);\n#endif\n#ifdef HAS_SSR\nvec3 zr = normalize(gl_FrontFacing ? vViewNormal : -vViewNormal);\n  vec3 zs = zr;\n#if defined(HAS_TANGENT) && defined(HAS_NORMAL_MAP)\nvec4 sd;\n  sd = vViewTangent;\n  sd = gl_FrontFacing ? sd : -sd;\n  sd.xyz = normalize(sd.xyz);\n  vec3 vO = normalize(cross(zr, sd.xyz)) * sd.w;\n  vec3 zs = zh;\n  zs = oO(uNormalMapFactor, zs, sd.xyz, vO, zr);\n#endif\noB = ssr(oB, zd * zp, zf, zs, -normalize(vViewVertex.xyz));\n#endif\noB *= uEnvironmentExposure * zp;\n  float wi, wk;\n  vec3 wj;\n  bool wG;\n  vec3 zt;\n  vec3 zu;\n  vec4 zv = wq(zi, wp, max(.045, zf));\n  vec3 zw = vModelNormal;\n  wo(wp, zi, uSketchfabLight0_viewDirection, wi, wj, wk);\n#if defined(HAS_TANGENT)\nif(uAnisotropyFactor > .0) {\n    wX(zi, wp, wk, zv, zc, zd, wi, uSketchfabLight0_diffuse.rgb, wj, ze, wT, wU, wV, zu, zt, wG);\n  } else {\n    wC(zi, wp, wk, zv, zc, zd, wi, uSketchfabLight0_diffuse.rgb, wj, ze, zu, zt, wG);\n  }\n#else\nwC(zi, wp, wk, zv, zc, zd, wi, uSketchfabLight0_diffuse.rgb, wj, ze, zu, zt, wG);\n#endif\nif(uClearCoatFactor > .0) {\n    vec3 zx;\n    vec3 zy;\n    vec4 zz = wq(zl, wp, zk);\n    xz(xA, zl, wp, dot(zl, wj), zz, wi, uSketchfabLight0_diffuse.rgb, wj, zj, zx, zy);\n    zu *= zy;\n    zt = zx + zt * zy;\n  }\n#if defined(HAS_SHADOWING)\nfloat zA = shadow_computeShadow();\n  zu = shadow_blend(zu, zA).rgb;\n  zt = shadow_blend(zt, zA).rgb;\n#endif\nvec3 zB = vec3(oB);\n  vec3 zC = vec3(pa);\n  pa += zu;\n  oB += zt;\n  pa = uEmitMultiplicative == 1 ? pa * zg : pa + zg;\n  if(uEmitMultiplicative == 1)\n    oB *= zg;\n  vec3 zD = oB + pa;\n  if(uOutputLinear != 1)\n    zD = oR(zD);\n  glFragColor = vec4(zD, vk());\n#ifdef HAS_HEATMAP\nglFragColor = heatmap_getColor(glFragColor);\n#endif\n#ifdef HAS_VIEWSHED\nglFragColor = viewshed_draw(glFragColor);\n#endif\n#ifdef HAS_FLOODANALYSE\nglFragColor = draw_floodAnalyse(glFragColor);\n#endif\n#ifdef HAS_FOG\nglFragColor = draw_fog(glFragColor);\n#endif\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}",
            uniforms: i,
            extraCommandProps: n,
            defines: e.defines
        }) || this).version = 300, t;
    }
    function Vo() {
        return Uo.apply(this, arguments) || this;
    }
    var Xo = Object.freeze({
        __proto__: null,
        AbstractTexture: nt,
        BloomPass: ai,
        BoxColorBlurShader: Mr,
        Constants: tt,
        DeferredRenderer: ct,
        FBORayPicking: No,
        FxaaShader: Er,
        GLTFHelper: Ha,
        Geometry: Ft,
        HDR: Go,
        HeatmapDisplayShader: Bi,
        HeatmapShader: Ei,
        InstancedMesh: bn,
        Jitter: $r,
        Material: Nt,
        Mesh: on,
        MeshShader: ur,
        OutlinePass: gi,
        PhongMaterial: jt,
        PhongShader: vr,
        PhongSpecularGlossinessMaterial: en,
        Plane: Wn,
        PostProcessShader: Ur,
        QuadShader: wr,
        Renderer: st,
        ResourceLoader: Bn,
        Scene: Nn,
        Shader: ir,
        ShadowDisplayShader: Bo,
        ShadowMapShader: co,
        ShadowPass: Mo,
        SkyboxShader: Oi,
        SsaoPass: qr,
        SsrPass: _i,
        TaaPass: Wr,
        Texture2D: Vn,
        TextureCube: Xn,
        ToonMaterial: Kt,
        ToonShader: _r,
        Util: $e,
        ViewshedPass: yi,
        WaterShader: Ii,
        WireFrameMaterial: Ut,
        WireframeShader: fr,
        pbr: Ho
    }), Wo = 1e-6, Ko = "undefined" != typeof Float32Array ? Float32Array : Array, Yo = Math.random;
    var Qo = Math.PI / 180;
    var Jo = Object.freeze({
        __proto__: null,
        EPSILON: Wo,
        get ARRAY_TYPE() {
            return Ko;
        },
        RANDOM: Yo,
        setMatrixArrayType: function(e) {
            Ko = e;
        },
        toRadian: function(e) {
            return e * Qo;
        },
        equals: function(e, t) {
            return Math.abs(e - t) <= Wo * Math.max(1, Math.abs(e), Math.abs(t));
        }
    });
    function $o(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = t[3], s = n[0], u = n[1], f = n[2], c = n[3];
        return e[0] = r * s + a * u, e[1] = i * s + o * u, e[2] = r * f + a * c, e[3] = i * f + o * c, 
        e;
    }
    function es(e, t, n) {
        return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], 
        e;
    }
    var ts = $o, ns = es, rs = Object.freeze({
        __proto__: null,
        create: function() {
            var e = new Ko(4);
            return Ko != Float32Array && (e[1] = 0, e[2] = 0), e[0] = 1, e[3] = 1, e;
        },
        clone: function(e) {
            var t = new Ko(4);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;
        },
        copy: function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
        },
        identity: function(e) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e;
        },
        fromValues: function(e, t, n, r) {
            var i = new Ko(4);
            return i[0] = e, i[1] = t, i[2] = n, i[3] = r, i;
        },
        set: function(e, t, n, r, i) {
            return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e;
        },
        transpose: function(e, t) {
            if (e === t) {
                var n = t[1];
                e[1] = t[2], e[2] = n;
            } else e[0] = t[0], e[1] = t[2], e[2] = t[1], e[3] = t[3];
            return e;
        },
        invert: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = n * a - i * r;
            return o ? (o = 1 / o, e[0] = a * o, e[1] = -r * o, e[2] = -i * o, e[3] = n * o, 
            e) : null;
        },
        adjoint: function(e, t) {
            var n = t[0];
            return e[0] = t[3], e[1] = -t[1], e[2] = -t[2], e[3] = n, e;
        },
        determinant: function(e) {
            return e[0] * e[3] - e[2] * e[1];
        },
        multiply: $o,
        rotate: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3], s = Math.sin(n), u = Math.cos(n);
            return e[0] = r * u + a * s, e[1] = i * u + o * s, e[2] = r * -s + a * u, e[3] = i * -s + o * u, 
            e;
        },
        scale: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3], s = n[0], u = n[1];
            return e[0] = r * s, e[1] = i * s, e[2] = a * u, e[3] = o * u, e;
        },
        fromRotation: function(e, t) {
            var n = Math.sin(t), r = Math.cos(t);
            return e[0] = r, e[1] = n, e[2] = -n, e[3] = r, e;
        },
        fromScaling: function(e, t) {
            return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = t[1], e;
        },
        str: function(e) {
            return "mat2(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
        },
        frob: function(e) {
            return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2));
        },
        LDU: function(e, t, n, r) {
            return e[2] = r[2] / r[0], n[0] = r[0], n[1] = r[1], n[3] = r[3] - e[2] * n[1], 
            [ e, t, n ];
        },
        add: function(e, t, n) {
            return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], 
            e;
        },
        subtract: es,
        exactEquals: function(e, t) {
            return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3];
        },
        equals: function(e, t) {
            var n = e[0], r = e[1], i = e[2], a = e[3], o = t[0], s = t[1], u = t[2], f = t[3];
            return Math.abs(n - o) <= Wo * Math.max(1, Math.abs(n), Math.abs(o)) && Math.abs(r - s) <= Wo * Math.max(1, Math.abs(r), Math.abs(s)) && Math.abs(i - u) <= Wo * Math.max(1, Math.abs(i), Math.abs(u)) && Math.abs(a - f) <= Wo * Math.max(1, Math.abs(a), Math.abs(f));
        },
        multiplyScalar: function(e, t, n) {
            return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e;
        },
        multiplyScalarAndAdd: function(e, t, n, r) {
            return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, 
            e;
        },
        mul: ts,
        sub: ns
    });
    function is(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], u = t[5], f = n[0], c = n[1], l = n[2], h = n[3], d = n[4], v = n[5];
        return e[0] = r * f + a * c, e[1] = i * f + o * c, e[2] = r * l + a * h, e[3] = i * l + o * h, 
        e[4] = r * d + a * v + s, e[5] = i * d + o * v + u, e;
    }
    function as(e, t, n) {
        return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], 
        e[4] = t[4] - n[4], e[5] = t[5] - n[5], e;
    }
    var os = is, ss = as, us = Object.freeze({
        __proto__: null,
        create: function() {
            var e = new Ko(6);
            return Ko != Float32Array && (e[1] = 0, e[2] = 0, e[4] = 0, e[5] = 0), e[0] = 1, 
            e[3] = 1, e;
        },
        clone: function(e) {
            var t = new Ko(6);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], 
            t;
        },
        copy: function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], 
            e;
        },
        identity: function(e) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e;
        },
        fromValues: function(e, t, n, r, i, a) {
            var o = new Ko(6);
            return o[0] = e, o[1] = t, o[2] = n, o[3] = r, o[4] = i, o[5] = a, o;
        },
        set: function(e, t, n, r, i, a, o) {
            return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e[4] = a, e[5] = o, e;
        },
        invert: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], u = n * a - r * i;
            return u ? (u = 1 / u, e[0] = a * u, e[1] = -r * u, e[2] = -i * u, e[3] = n * u, 
            e[4] = (i * s - a * o) * u, e[5] = (r * o - n * s) * u, e) : null;
        },
        determinant: function(e) {
            return e[0] * e[3] - e[1] * e[2];
        },
        multiply: is,
        rotate: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], u = t[5], f = Math.sin(n), c = Math.cos(n);
            return e[0] = r * c + a * f, e[1] = i * c + o * f, e[2] = r * -f + a * c, e[3] = i * -f + o * c, 
            e[4] = s, e[5] = u, e;
        },
        scale: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], u = t[5], f = n[0], c = n[1];
            return e[0] = r * f, e[1] = i * f, e[2] = a * c, e[3] = o * c, e[4] = s, e[5] = u, 
            e;
        },
        translate: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], u = t[5], f = n[0], c = n[1];
            return e[0] = r, e[1] = i, e[2] = a, e[3] = o, e[4] = r * f + a * c + s, e[5] = i * f + o * c + u, 
            e;
        },
        fromRotation: function(e, t) {
            var n = Math.sin(t), r = Math.cos(t);
            return e[0] = r, e[1] = n, e[2] = -n, e[3] = r, e[4] = 0, e[5] = 0, e;
        },
        fromScaling: function(e, t) {
            return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = t[1], e[4] = 0, e[5] = 0, e;
        },
        fromTranslation: function(e, t) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = t[0], e[5] = t[1], e;
        },
        str: function(e) {
            return "mat2d(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ")";
        },
        frob: function(e) {
            return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + 1);
        },
        add: function(e, t, n) {
            return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], 
            e[4] = t[4] + n[4], e[5] = t[5] + n[5], e;
        },
        subtract: as,
        multiplyScalar: function(e, t, n) {
            return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * n, 
            e[5] = t[5] * n, e;
        },
        multiplyScalarAndAdd: function(e, t, n, r) {
            return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, 
            e[4] = t[4] + n[4] * r, e[5] = t[5] + n[5] * r, e;
        },
        exactEquals: function(e, t) {
            return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5];
        },
        equals: function(e, t) {
            var n = e[0], r = e[1], i = e[2], a = e[3], o = e[4], s = e[5], u = t[0], f = t[1], c = t[2], l = t[3], h = t[4], d = t[5];
            return Math.abs(n - u) <= Wo * Math.max(1, Math.abs(n), Math.abs(u)) && Math.abs(r - f) <= Wo * Math.max(1, Math.abs(r), Math.abs(f)) && Math.abs(i - c) <= Wo * Math.max(1, Math.abs(i), Math.abs(c)) && Math.abs(a - l) <= Wo * Math.max(1, Math.abs(a), Math.abs(l)) && Math.abs(o - h) <= Wo * Math.max(1, Math.abs(o), Math.abs(h)) && Math.abs(s - d) <= Wo * Math.max(1, Math.abs(s), Math.abs(d));
        },
        mul: os,
        sub: ss
    });
    function fs() {
        var e = new Ko(9);
        return Ko != Float32Array && (e[1] = 0, e[2] = 0, e[3] = 0, e[5] = 0, e[6] = 0, 
        e[7] = 0), e[0] = 1, e[4] = 1, e[8] = 1, e;
    }
    function cs(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = n[0], d = n[1], v = n[2], p = n[3], m = n[4], _ = n[5], g = n[6], x = n[7], b = n[8];
        return e[0] = h * r + d * o + v * f, e[1] = h * i + d * s + v * c, e[2] = h * a + d * u + v * l, 
        e[3] = p * r + m * o + _ * f, e[4] = p * i + m * s + _ * c, e[5] = p * a + m * u + _ * l, 
        e[6] = g * r + x * o + b * f, e[7] = g * i + x * s + b * c, e[8] = g * a + x * u + b * l, 
        e;
    }
    function ls(e, t, n) {
        return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], 
        e[4] = t[4] - n[4], e[5] = t[5] - n[5], e[6] = t[6] - n[6], e[7] = t[7] - n[7], 
        e[8] = t[8] - n[8], e;
    }
    var hs = cs, ds = ls, vs = Object.freeze({
        __proto__: null,
        create: fs,
        fromMat4: function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[4], e[4] = t[5], e[5] = t[6], 
            e[6] = t[8], e[7] = t[9], e[8] = t[10], e;
        },
        clone: function(e) {
            var t = new Ko(9);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], 
            t[6] = e[6], t[7] = e[7], t[8] = e[8], t;
        },
        copy: function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], 
            e[6] = t[6], e[7] = t[7], e[8] = t[8], e;
        },
        fromValues: function(e, t, n, r, i, a, o, s, u) {
            var f = new Ko(9);
            return f[0] = e, f[1] = t, f[2] = n, f[3] = r, f[4] = i, f[5] = a, f[6] = o, f[7] = s, 
            f[8] = u, f;
        },
        set: function(e, t, n, r, i, a, o, s, u, f) {
            return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e[4] = a, e[5] = o, e[6] = s, e[7] = u, 
            e[8] = f, e;
        },
        identity: function(e) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 0, 
            e[8] = 1, e;
        },
        transpose: function(e, t) {
            if (e === t) {
                var n = t[1], r = t[2], i = t[5];
                e[1] = t[3], e[2] = t[6], e[3] = n, e[5] = t[7], e[6] = r, e[7] = i;
            } else e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], 
            e[6] = t[2], e[7] = t[5], e[8] = t[8];
            return e;
        },
        invert: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], u = t[6], f = t[7], c = t[8], l = c * o - s * f, h = -c * a + s * u, d = f * a - o * u, v = n * l + r * h + i * d;
            return v ? (v = 1 / v, e[0] = l * v, e[1] = (-c * r + i * f) * v, e[2] = (s * r - i * o) * v, 
            e[3] = h * v, e[4] = (c * n - i * u) * v, e[5] = (-s * n + i * a) * v, e[6] = d * v, 
            e[7] = (-f * n + r * u) * v, e[8] = (o * n - r * a) * v, e) : null;
        },
        adjoint: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], u = t[6], f = t[7], c = t[8];
            return e[0] = o * c - s * f, e[1] = i * f - r * c, e[2] = r * s - i * o, e[3] = s * u - a * c, 
            e[4] = n * c - i * u, e[5] = i * a - n * s, e[6] = a * f - o * u, e[7] = r * u - n * f, 
            e[8] = n * o - r * a, e;
        },
        determinant: function(e) {
            var t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], u = e[7], f = e[8];
            return t * (f * a - o * u) + n * (-f * i + o * s) + r * (u * i - a * s);
        },
        multiply: cs,
        translate: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = n[0], d = n[1];
            return e[0] = r, e[1] = i, e[2] = a, e[3] = o, e[4] = s, e[5] = u, e[6] = h * r + d * o + f, 
            e[7] = h * i + d * s + c, e[8] = h * a + d * u + l, e;
        },
        rotate: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = Math.sin(n), d = Math.cos(n);
            return e[0] = d * r + h * o, e[1] = d * i + h * s, e[2] = d * a + h * u, e[3] = d * o - h * r, 
            e[4] = d * s - h * i, e[5] = d * u - h * a, e[6] = f, e[7] = c, e[8] = l, e;
        },
        scale: function(e, t, n) {
            var r = n[0], i = n[1];
            return e[0] = r * t[0], e[1] = r * t[1], e[2] = r * t[2], e[3] = i * t[3], e[4] = i * t[4], 
            e[5] = i * t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e;
        },
        fromTranslation: function(e, t) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = t[0], 
            e[7] = t[1], e[8] = 1, e;
        },
        fromRotation: function(e, t) {
            var n = Math.sin(t), r = Math.cos(t);
            return e[0] = r, e[1] = n, e[2] = 0, e[3] = -n, e[4] = r, e[5] = 0, e[6] = 0, e[7] = 0, 
            e[8] = 1, e;
        },
        fromScaling: function(e, t) {
            return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = t[1], e[5] = 0, e[6] = 0, 
            e[7] = 0, e[8] = 1, e;
        },
        fromMat2d: function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = 0, e[3] = t[2], e[4] = t[3], e[5] = 0, e[6] = t[4], 
            e[7] = t[5], e[8] = 1, e;
        },
        fromQuat: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = n + n, s = r + r, u = i + i, f = n * o, c = r * o, l = r * s, h = i * o, d = i * s, v = i * u, p = a * o, m = a * s, _ = a * u;
            return e[0] = 1 - l - v, e[3] = c - _, e[6] = h + m, e[1] = c + _, e[4] = 1 - f - v, 
            e[7] = d - p, e[2] = h - m, e[5] = d + p, e[8] = 1 - f - l, e;
        },
        normalFromMat4: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], u = t[6], f = t[7], c = t[8], l = t[9], h = t[10], d = t[11], v = t[12], p = t[13], m = t[14], _ = t[15], g = n * s - r * o, x = n * u - i * o, b = n * f - a * o, y = r * u - i * s, T = r * f - a * s, w = i * f - a * u, E = c * p - l * v, S = c * m - h * v, A = c * _ - d * v, M = l * m - h * p, R = l * _ - d * p, O = h * _ - d * m, B = g * O - x * R + b * M + y * A - T * S + w * E;
            return B ? (B = 1 / B, e[0] = (s * O - u * R + f * M) * B, e[1] = (u * A - o * O - f * S) * B, 
            e[2] = (o * R - s * A + f * E) * B, e[3] = (i * R - r * O - a * M) * B, e[4] = (n * O - i * A + a * S) * B, 
            e[5] = (r * A - n * R - a * E) * B, e[6] = (p * w - m * T + _ * y) * B, e[7] = (m * b - v * w - _ * x) * B, 
            e[8] = (v * T - p * b + _ * g) * B, e) : null;
        },
        projection: function(e, t, n) {
            return e[0] = 2 / t, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = -2 / n, e[5] = 0, e[6] = -1, 
            e[7] = 1, e[8] = 1, e;
        },
        str: function(e) {
            return "mat3(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ")";
        },
        frob: function(e) {
            return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + Math.pow(e[6], 2) + Math.pow(e[7], 2) + Math.pow(e[8], 2));
        },
        add: function(e, t, n) {
            return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], 
            e[4] = t[4] + n[4], e[5] = t[5] + n[5], e[6] = t[6] + n[6], e[7] = t[7] + n[7], 
            e[8] = t[8] + n[8], e;
        },
        subtract: ls,
        multiplyScalar: function(e, t, n) {
            return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * n, 
            e[5] = t[5] * n, e[6] = t[6] * n, e[7] = t[7] * n, e[8] = t[8] * n, e;
        },
        multiplyScalarAndAdd: function(e, t, n, r) {
            return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, 
            e[4] = t[4] + n[4] * r, e[5] = t[5] + n[5] * r, e[6] = t[6] + n[6] * r, e[7] = t[7] + n[7] * r, 
            e[8] = t[8] + n[8] * r, e;
        },
        exactEquals: function(e, t) {
            return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8];
        },
        equals: function(e, t) {
            var n = e[0], r = e[1], i = e[2], a = e[3], o = e[4], s = e[5], u = e[6], f = e[7], c = e[8], l = t[0], h = t[1], d = t[2], v = t[3], p = t[4], m = t[5], _ = t[6], g = t[7], x = t[8];
            return Math.abs(n - l) <= Wo * Math.max(1, Math.abs(n), Math.abs(l)) && Math.abs(r - h) <= Wo * Math.max(1, Math.abs(r), Math.abs(h)) && Math.abs(i - d) <= Wo * Math.max(1, Math.abs(i), Math.abs(d)) && Math.abs(a - v) <= Wo * Math.max(1, Math.abs(a), Math.abs(v)) && Math.abs(o - p) <= Wo * Math.max(1, Math.abs(o), Math.abs(p)) && Math.abs(s - m) <= Wo * Math.max(1, Math.abs(s), Math.abs(m)) && Math.abs(u - _) <= Wo * Math.max(1, Math.abs(u), Math.abs(_)) && Math.abs(f - g) <= Wo * Math.max(1, Math.abs(f), Math.abs(g)) && Math.abs(c - x) <= Wo * Math.max(1, Math.abs(c), Math.abs(x));
        },
        mul: hs,
        sub: ds
    });
    function ps(e, t) {
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], 
        e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], 
        e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e;
    }
    function ms(e) {
        return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, 
        e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, 
        e;
    }
    function _s(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = t[9], d = t[10], v = t[11], p = t[12], m = t[13], _ = t[14], g = t[15], x = n[0], b = n[1], y = n[2], T = n[3];
        return e[0] = x * r + b * s + y * l + T * p, e[1] = x * i + b * u + y * h + T * m, 
        e[2] = x * a + b * f + y * d + T * _, e[3] = x * o + b * c + y * v + T * g, x = n[4], 
        b = n[5], y = n[6], T = n[7], e[4] = x * r + b * s + y * l + T * p, e[5] = x * i + b * u + y * h + T * m, 
        e[6] = x * a + b * f + y * d + T * _, e[7] = x * o + b * c + y * v + T * g, x = n[8], 
        b = n[9], y = n[10], T = n[11], e[8] = x * r + b * s + y * l + T * p, e[9] = x * i + b * u + y * h + T * m, 
        e[10] = x * a + b * f + y * d + T * _, e[11] = x * o + b * c + y * v + T * g, x = n[12], 
        b = n[13], y = n[14], T = n[15], e[12] = x * r + b * s + y * l + T * p, e[13] = x * i + b * u + y * h + T * m, 
        e[14] = x * a + b * f + y * d + T * _, e[15] = x * o + b * c + y * v + T * g, e;
    }
    function gs(e, t, n) {
        var r = n[0], i = n[1], a = n[2], o = void 0, s = void 0, u = void 0, f = void 0, c = void 0, l = void 0, h = void 0, d = void 0, v = void 0, p = void 0, m = void 0, _ = void 0;
        return t === e ? (e[12] = t[0] * r + t[4] * i + t[8] * a + t[12], e[13] = t[1] * r + t[5] * i + t[9] * a + t[13], 
        e[14] = t[2] * r + t[6] * i + t[10] * a + t[14], e[15] = t[3] * r + t[7] * i + t[11] * a + t[15]) : (o = t[0], 
        s = t[1], u = t[2], f = t[3], c = t[4], l = t[5], h = t[6], d = t[7], v = t[8], 
        p = t[9], m = t[10], _ = t[11], e[0] = o, e[1] = s, e[2] = u, e[3] = f, e[4] = c, 
        e[5] = l, e[6] = h, e[7] = d, e[8] = v, e[9] = p, e[10] = m, e[11] = _, e[12] = o * r + c * i + v * a + t[12], 
        e[13] = s * r + l * i + p * a + t[13], e[14] = u * r + h * i + m * a + t[14], e[15] = f * r + d * i + _ * a + t[15]), 
        e;
    }
    function xs(e, t, n) {
        var r = n[0], i = n[1], a = n[2];
        return e[0] = t[0] * r, e[1] = t[1] * r, e[2] = t[2] * r, e[3] = t[3] * r, e[4] = t[4] * i, 
        e[5] = t[5] * i, e[6] = t[6] * i, e[7] = t[7] * i, e[8] = t[8] * a, e[9] = t[9] * a, 
        e[10] = t[10] * a, e[11] = t[11] * a, e[12] = t[12], e[13] = t[13], e[14] = t[14], 
        e[15] = t[15], e;
    }
    function bs(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = t[3], s = r + r, u = i + i, f = a + a, c = r * s, l = r * u, h = r * f, d = i * u, v = i * f, p = a * f, m = o * s, _ = o * u, g = o * f;
        return e[0] = 1 - (d + p), e[1] = l + g, e[2] = h - _, e[3] = 0, e[4] = l - g, e[5] = 1 - (c + p), 
        e[6] = v + m, e[7] = 0, e[8] = h + _, e[9] = v - m, e[10] = 1 - (c + d), e[11] = 0, 
        e[12] = n[0], e[13] = n[1], e[14] = n[2], e[15] = 1, e;
    }
    function ys(e, t) {
        return e[0] = t[12], e[1] = t[13], e[2] = t[14], e;
    }
    function Ts(e, t) {
        var n = t[0] + t[5] + t[10], r = 0;
        return 0 < n ? (r = 2 * Math.sqrt(n + 1), e[3] = .25 * r, e[0] = (t[6] - t[9]) / r, 
        e[1] = (t[8] - t[2]) / r, e[2] = (t[1] - t[4]) / r) : t[0] > t[5] && t[0] > t[10] ? (r = 2 * Math.sqrt(1 + t[0] - t[5] - t[10]), 
        e[3] = (t[6] - t[9]) / r, e[0] = .25 * r, e[1] = (t[1] + t[4]) / r, e[2] = (t[8] + t[2]) / r) : t[5] > t[10] ? (r = 2 * Math.sqrt(1 + t[5] - t[0] - t[10]), 
        e[3] = (t[8] - t[2]) / r, e[0] = (t[1] + t[4]) / r, e[1] = .25 * r, e[2] = (t[6] + t[9]) / r) : (r = 2 * Math.sqrt(1 + t[10] - t[0] - t[5]), 
        e[3] = (t[1] - t[4]) / r, e[0] = (t[8] + t[2]) / r, e[1] = (t[6] + t[9]) / r, e[2] = .25 * r), 
        e;
    }
    function ws(e, t, n) {
        return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], 
        e[4] = t[4] - n[4], e[5] = t[5] - n[5], e[6] = t[6] - n[6], e[7] = t[7] - n[7], 
        e[8] = t[8] - n[8], e[9] = t[9] - n[9], e[10] = t[10] - n[10], e[11] = t[11] - n[11], 
        e[12] = t[12] - n[12], e[13] = t[13] - n[13], e[14] = t[14] - n[14], e[15] = t[15] - n[15], 
        e;
    }
    var Es = _s, Ss = ws, As = Object.freeze({
        __proto__: null,
        create: function() {
            var e = new Ko(16);
            return Ko != Float32Array && (e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[6] = 0, 
            e[7] = 0, e[8] = 0, e[9] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0), e[0] = 1, 
            e[5] = 1, e[10] = 1, e[15] = 1, e;
        },
        clone: function(e) {
            var t = new Ko(16);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], 
            t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], 
            t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t;
        },
        copy: ps,
        fromValues: function(e, t, n, r, i, a, o, s, u, f, c, l, h, d, v, p) {
            var m = new Ko(16);
            return m[0] = e, m[1] = t, m[2] = n, m[3] = r, m[4] = i, m[5] = a, m[6] = o, m[7] = s, 
            m[8] = u, m[9] = f, m[10] = c, m[11] = l, m[12] = h, m[13] = d, m[14] = v, m[15] = p, 
            m;
        },
        set: function(e, t, n, r, i, a, o, s, u, f, c, l, h, d, v, p, m) {
            return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e[4] = a, e[5] = o, e[6] = s, e[7] = u, 
            e[8] = f, e[9] = c, e[10] = l, e[11] = h, e[12] = d, e[13] = v, e[14] = p, e[15] = m, 
            e;
        },
        identity: ms,
        transpose: function(e, t) {
            if (e === t) {
                var n = t[1], r = t[2], i = t[3], a = t[6], o = t[7], s = t[11];
                e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = n, e[6] = t[9], e[7] = t[13], e[8] = r, 
                e[9] = a, e[11] = t[14], e[12] = i, e[13] = o, e[14] = s;
            } else e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = t[1], e[5] = t[5], 
            e[6] = t[9], e[7] = t[13], e[8] = t[2], e[9] = t[6], e[10] = t[10], e[11] = t[14], 
            e[12] = t[3], e[13] = t[7], e[14] = t[11], e[15] = t[15];
            return e;
        },
        invert: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], u = t[6], f = t[7], c = t[8], l = t[9], h = t[10], d = t[11], v = t[12], p = t[13], m = t[14], _ = t[15], g = n * s - r * o, x = n * u - i * o, b = n * f - a * o, y = r * u - i * s, T = r * f - a * s, w = i * f - a * u, E = c * p - l * v, S = c * m - h * v, A = c * _ - d * v, M = l * m - h * p, R = l * _ - d * p, O = h * _ - d * m, B = g * O - x * R + b * M + y * A - T * S + w * E;
            return B ? (B = 1 / B, e[0] = (s * O - u * R + f * M) * B, e[1] = (i * R - r * O - a * M) * B, 
            e[2] = (p * w - m * T + _ * y) * B, e[3] = (h * T - l * w - d * y) * B, e[4] = (u * A - o * O - f * S) * B, 
            e[5] = (n * O - i * A + a * S) * B, e[6] = (m * b - v * w - _ * x) * B, e[7] = (c * w - h * b + d * x) * B, 
            e[8] = (o * R - s * A + f * E) * B, e[9] = (r * A - n * R - a * E) * B, e[10] = (v * T - p * b + _ * g) * B, 
            e[11] = (l * b - c * T - d * g) * B, e[12] = (s * S - o * M - u * E) * B, e[13] = (n * M - r * S + i * E) * B, 
            e[14] = (p * x - v * y - m * g) * B, e[15] = (c * y - l * x + h * g) * B, e) : null;
        },
        adjoint: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], u = t[6], f = t[7], c = t[8], l = t[9], h = t[10], d = t[11], v = t[12], p = t[13], m = t[14], _ = t[15];
            return e[0] = s * (h * _ - d * m) - l * (u * _ - f * m) + p * (u * d - f * h), e[1] = -(r * (h * _ - d * m) - l * (i * _ - a * m) + p * (i * d - a * h)), 
            e[2] = r * (u * _ - f * m) - s * (i * _ - a * m) + p * (i * f - a * u), e[3] = -(r * (u * d - f * h) - s * (i * d - a * h) + l * (i * f - a * u)), 
            e[4] = -(o * (h * _ - d * m) - c * (u * _ - f * m) + v * (u * d - f * h)), e[5] = n * (h * _ - d * m) - c * (i * _ - a * m) + v * (i * d - a * h), 
            e[6] = -(n * (u * _ - f * m) - o * (i * _ - a * m) + v * (i * f - a * u)), e[7] = n * (u * d - f * h) - o * (i * d - a * h) + c * (i * f - a * u), 
            e[8] = o * (l * _ - d * p) - c * (s * _ - f * p) + v * (s * d - f * l), e[9] = -(n * (l * _ - d * p) - c * (r * _ - a * p) + v * (r * d - a * l)), 
            e[10] = n * (s * _ - f * p) - o * (r * _ - a * p) + v * (r * f - a * s), e[11] = -(n * (s * d - f * l) - o * (r * d - a * l) + c * (r * f - a * s)), 
            e[12] = -(o * (l * m - h * p) - c * (s * m - u * p) + v * (s * h - u * l)), e[13] = n * (l * m - h * p) - c * (r * m - i * p) + v * (r * h - i * l), 
            e[14] = -(n * (s * m - u * p) - o * (r * m - i * p) + v * (r * u - i * s)), e[15] = n * (s * h - u * l) - o * (r * h - i * l) + c * (r * u - i * s), 
            e;
        },
        determinant: function(e) {
            var t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], u = e[7], f = e[8], c = e[9], l = e[10], h = e[11], d = e[12], v = e[13], p = e[14], m = e[15];
            return (t * o - n * a) * (l * m - h * p) - (t * s - r * a) * (c * m - h * v) + (t * u - i * a) * (c * p - l * v) + (n * s - r * o) * (f * m - h * d) - (n * u - i * o) * (f * p - l * d) + (r * u - i * s) * (f * v - c * d);
        },
        multiply: _s,
        translate: gs,
        scale: xs,
        rotate: function(e, t, n, r) {
            var i, a, o, s, u, f, c, l, h, d, v, p, m, _, g, x, b, y, T, w, E, S, A, M, R = r[0], O = r[1], B = r[2], C = Math.sqrt(R * R + O * O + B * B);
            return C < Wo ? null : (R *= C = 1 / C, O *= C, B *= C, i = Math.sin(n), o = 1 - (a = Math.cos(n)), 
            s = t[0], u = t[1], f = t[2], c = t[3], l = t[4], h = t[5], d = t[6], v = t[7], 
            p = t[8], m = t[9], _ = t[10], g = t[11], x = R * R * o + a, b = O * R * o + B * i, 
            y = B * R * o - O * i, T = R * O * o - B * i, w = O * O * o + a, E = B * O * o + R * i, 
            S = R * B * o + O * i, A = O * B * o - R * i, M = B * B * o + a, e[0] = s * x + l * b + p * y, 
            e[1] = u * x + h * b + m * y, e[2] = f * x + d * b + _ * y, e[3] = c * x + v * b + g * y, 
            e[4] = s * T + l * w + p * E, e[5] = u * T + h * w + m * E, e[6] = f * T + d * w + _ * E, 
            e[7] = c * T + v * w + g * E, e[8] = s * S + l * A + p * M, e[9] = u * S + h * A + m * M, 
            e[10] = f * S + d * A + _ * M, e[11] = c * S + v * A + g * M, t !== e && (e[12] = t[12], 
            e[13] = t[13], e[14] = t[14], e[15] = t[15]), e);
        },
        rotateX: function(e, t, n) {
            var r = Math.sin(n), i = Math.cos(n), a = t[4], o = t[5], s = t[6], u = t[7], f = t[8], c = t[9], l = t[10], h = t[11];
            return t !== e && (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[12] = t[12], 
            e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[4] = a * i + f * r, e[5] = o * i + c * r, 
            e[6] = s * i + l * r, e[7] = u * i + h * r, e[8] = f * i - a * r, e[9] = c * i - o * r, 
            e[10] = l * i - s * r, e[11] = h * i - u * r, e;
        },
        rotateY: function(e, t, n) {
            var r = Math.sin(n), i = Math.cos(n), a = t[0], o = t[1], s = t[2], u = t[3], f = t[8], c = t[9], l = t[10], h = t[11];
            return t !== e && (e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[12] = t[12], 
            e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * i - f * r, e[1] = o * i - c * r, 
            e[2] = s * i - l * r, e[3] = u * i - h * r, e[8] = a * r + f * i, e[9] = o * r + c * i, 
            e[10] = s * r + l * i, e[11] = u * r + h * i, e;
        },
        rotateZ: function(e, t, n) {
            var r = Math.sin(n), i = Math.cos(n), a = t[0], o = t[1], s = t[2], u = t[3], f = t[4], c = t[5], l = t[6], h = t[7];
            return t !== e && (e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], 
            e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * i + f * r, e[1] = o * i + c * r, 
            e[2] = s * i + l * r, e[3] = u * i + h * r, e[4] = f * i - a * r, e[5] = c * i - o * r, 
            e[6] = l * i - s * r, e[7] = h * i - u * r, e;
        },
        fromTranslation: function(e, t) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, 
            e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = t[0], e[13] = t[1], e[14] = t[2], 
            e[15] = 1, e;
        },
        fromScaling: function(e, t) {
            return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = t[1], e[6] = 0, 
            e[7] = 0, e[8] = 0, e[9] = 0, e[10] = t[2], e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, 
            e[15] = 1, e;
        },
        fromRotation: function(e, t, n) {
            var r, i, a, o = n[0], s = n[1], u = n[2], f = Math.sqrt(o * o + s * s + u * u);
            return f < Wo ? null : (o *= f = 1 / f, s *= f, u *= f, r = Math.sin(t), a = 1 - (i = Math.cos(t)), 
            e[0] = o * o * a + i, e[1] = s * o * a + u * r, e[2] = u * o * a - s * r, e[3] = 0, 
            e[4] = o * s * a - u * r, e[5] = s * s * a + i, e[6] = u * s * a + o * r, e[7] = 0, 
            e[8] = o * u * a + s * r, e[9] = s * u * a - o * r, e[10] = u * u * a + i, e[11] = 0, 
            e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e);
        },
        fromXRotation: function(e, t) {
            var n = Math.sin(t), r = Math.cos(t);
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = r, e[6] = n, e[7] = 0, 
            e[8] = 0, e[9] = -n, e[10] = r, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, 
            e;
        },
        fromYRotation: function(e, t) {
            var n = Math.sin(t), r = Math.cos(t);
            return e[0] = r, e[1] = 0, e[2] = -n, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, 
            e[8] = n, e[9] = 0, e[10] = r, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, 
            e;
        },
        fromZRotation: function(e, t) {
            var n = Math.sin(t), r = Math.cos(t);
            return e[0] = r, e[1] = n, e[2] = 0, e[3] = 0, e[4] = -n, e[5] = r, e[6] = 0, e[7] = 0, 
            e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, 
            e;
        },
        fromRotationTranslation: bs,
        fromQuat2: function(e, t) {
            var n = new Ko(3), r = -t[0], i = -t[1], a = -t[2], o = t[3], s = t[4], u = t[5], f = t[6], c = t[7], l = r * r + i * i + a * a + o * o;
            return 0 < l ? (n[0] = 2 * (s * o + c * r + u * a - f * i) / l, n[1] = 2 * (u * o + c * i + f * r - s * a) / l, 
            n[2] = 2 * (f * o + c * a + s * i - u * r) / l) : (n[0] = 2 * (s * o + c * r + u * a - f * i), 
            n[1] = 2 * (u * o + c * i + f * r - s * a), n[2] = 2 * (f * o + c * a + s * i - u * r)), 
            bs(e, t, n), e;
        },
        getTranslation: ys,
        getScaling: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[4], o = t[5], s = t[6], u = t[8], f = t[9], c = t[10];
            return e[0] = Math.sqrt(n * n + r * r + i * i), e[1] = Math.sqrt(a * a + o * o + s * s), 
            e[2] = Math.sqrt(u * u + f * f + c * c), e;
        },
        getRotation: Ts,
        fromRotationTranslationScale: function(e, t, n, r) {
            var i = t[0], a = t[1], o = t[2], s = t[3], u = i + i, f = a + a, c = o + o, l = i * u, h = i * f, d = i * c, v = a * f, p = a * c, m = o * c, _ = s * u, g = s * f, x = s * c, b = r[0], y = r[1], T = r[2];
            return e[0] = (1 - (v + m)) * b, e[1] = (h + x) * b, e[2] = (d - g) * b, e[3] = 0, 
            e[4] = (h - x) * y, e[5] = (1 - (l + m)) * y, e[6] = (p + _) * y, e[7] = 0, e[8] = (d + g) * T, 
            e[9] = (p - _) * T, e[10] = (1 - (l + v)) * T, e[11] = 0, e[12] = n[0], e[13] = n[1], 
            e[14] = n[2], e[15] = 1, e;
        },
        fromRotationTranslationScaleOrigin: function(e, t, n, r, i) {
            var a = t[0], o = t[1], s = t[2], u = t[3], f = a + a, c = o + o, l = s + s, h = a * f, d = a * c, v = a * l, p = o * c, m = o * l, _ = s * l, g = u * f, x = u * c, b = u * l, y = r[0], T = r[1], w = r[2], E = i[0], S = i[1], A = i[2], M = (1 - (p + _)) * y, R = (d + b) * y, O = (v - x) * y, B = (d - b) * T, C = (1 - (h + _)) * T, F = (m + g) * T, I = (v + x) * w, P = (m - g) * w, D = (1 - (h + p)) * w;
            return e[0] = M, e[1] = R, e[2] = O, e[3] = 0, e[4] = B, e[5] = C, e[6] = F, e[7] = 0, 
            e[8] = I, e[9] = P, e[10] = D, e[11] = 0, e[12] = n[0] + E - (M * E + B * S + I * A), 
            e[13] = n[1] + S - (R * E + C * S + P * A), e[14] = n[2] + A - (O * E + F * S + D * A), 
            e[15] = 1, e;
        },
        fromQuat: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = n + n, s = r + r, u = i + i, f = n * o, c = r * o, l = r * s, h = i * o, d = i * s, v = i * u, p = a * o, m = a * s, _ = a * u;
            return e[0] = 1 - l - v, e[1] = c + _, e[2] = h - m, e[3] = 0, e[4] = c - _, e[5] = 1 - f - v, 
            e[6] = d + p, e[7] = 0, e[8] = h + m, e[9] = d - p, e[10] = 1 - f - l, e[11] = 0, 
            e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
        },
        frustum: function(e, t, n, r, i, a, o) {
            var s = 1 / (n - t), u = 1 / (i - r), f = 1 / (a - o);
            return e[0] = 2 * a * s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 2 * a * u, 
            e[6] = 0, e[7] = 0, e[8] = (n + t) * s, e[9] = (i + r) * u, e[10] = (o + a) * f, 
            e[11] = -1, e[12] = 0, e[13] = 0, e[14] = o * a * 2 * f, e[15] = 0, e;
        },
        perspective: function(e, t, n, r, i) {
            var a = 1 / Math.tan(t / 2), o = void 0;
            return e[0] = a / n, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = a, e[6] = 0, 
            e[7] = 0, e[8] = 0, e[9] = 0, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, null != i && i !== 1 / 0 ? (o = 1 / (r - i), 
            e[10] = (i + r) * o, e[14] = 2 * i * r * o) : (e[10] = -1, e[14] = -2 * r), e;
        },
        perspectiveFromFieldOfView: function(e, t, n, r) {
            var i = Math.tan(t.upDegrees * Math.PI / 180), a = Math.tan(t.downDegrees * Math.PI / 180), o = Math.tan(t.leftDegrees * Math.PI / 180), s = Math.tan(t.rightDegrees * Math.PI / 180), u = 2 / (o + s), f = 2 / (i + a);
            return e[0] = u, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = f, e[6] = 0, e[7] = 0, 
            e[8] = -(o - s) * u * .5, e[9] = (i - a) * f * .5, e[10] = r / (n - r), e[11] = -1, 
            e[12] = 0, e[13] = 0, e[14] = r * n / (n - r), e[15] = 0, e;
        },
        ortho: function(e, t, n, r, i, a, o) {
            var s = 1 / (t - n), u = 1 / (r - i), f = 1 / (a - o);
            return e[0] = -2 * s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * u, e[6] = 0, 
            e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * f, e[11] = 0, e[12] = (t + n) * s, e[13] = (i + r) * u, 
            e[14] = (o + a) * f, e[15] = 1, e;
        },
        lookAt: function(e, t, n, r) {
            var i = void 0, a = void 0, o = void 0, s = void 0, u = void 0, f = void 0, c = void 0, l = void 0, h = void 0, d = void 0, v = t[0], p = t[1], m = t[2], _ = r[0], g = r[1], x = r[2], b = n[0], y = n[1], T = n[2];
            return Math.abs(v - b) < Wo && Math.abs(p - y) < Wo && Math.abs(m - T) < Wo ? ms(e) : (c = v - b, 
            l = p - y, h = m - T, i = g * (h *= d = 1 / Math.sqrt(c * c + l * l + h * h)) - x * (l *= d), 
            a = x * (c *= d) - _ * h, o = _ * l - g * c, (d = Math.sqrt(i * i + a * a + o * o)) ? (i *= d = 1 / d, 
            a *= d, o *= d) : o = a = i = 0, s = l * o - h * a, u = h * i - c * o, f = c * a - l * i, 
            (d = Math.sqrt(s * s + u * u + f * f)) ? (s *= d = 1 / d, u *= d, f *= d) : f = u = s = 0, 
            e[0] = i, e[1] = s, e[2] = c, e[3] = 0, e[4] = a, e[5] = u, e[6] = l, e[7] = 0, 
            e[8] = o, e[9] = f, e[10] = h, e[11] = 0, e[12] = -(i * v + a * p + o * m), e[13] = -(s * v + u * p + f * m), 
            e[14] = -(c * v + l * p + h * m), e[15] = 1, e);
        },
        targetTo: function(e, t, n, r) {
            var i = t[0], a = t[1], o = t[2], s = r[0], u = r[1], f = r[2], c = i - n[0], l = a - n[1], h = o - n[2], d = c * c + l * l + h * h;
            0 < d && (c *= d = 1 / Math.sqrt(d), l *= d, h *= d);
            var v = u * h - f * l, p = f * c - s * h, m = s * l - u * c;
            return 0 < (d = v * v + p * p + m * m) && (v *= d = 1 / Math.sqrt(d), p *= d, m *= d), 
            e[0] = v, e[1] = p, e[2] = m, e[3] = 0, e[4] = l * m - h * p, e[5] = h * v - c * m, 
            e[6] = c * p - l * v, e[7] = 0, e[8] = c, e[9] = l, e[10] = h, e[11] = 0, e[12] = i, 
            e[13] = a, e[14] = o, e[15] = 1, e;
        },
        str: function(e) {
            return "mat4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ", " + e[9] + ", " + e[10] + ", " + e[11] + ", " + e[12] + ", " + e[13] + ", " + e[14] + ", " + e[15] + ")";
        },
        frob: function(e) {
            return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + Math.pow(e[6], 2) + Math.pow(e[7], 2) + Math.pow(e[8], 2) + Math.pow(e[9], 2) + Math.pow(e[10], 2) + Math.pow(e[11], 2) + Math.pow(e[12], 2) + Math.pow(e[13], 2) + Math.pow(e[14], 2) + Math.pow(e[15], 2));
        },
        add: function(e, t, n) {
            return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], 
            e[4] = t[4] + n[4], e[5] = t[5] + n[5], e[6] = t[6] + n[6], e[7] = t[7] + n[7], 
            e[8] = t[8] + n[8], e[9] = t[9] + n[9], e[10] = t[10] + n[10], e[11] = t[11] + n[11], 
            e[12] = t[12] + n[12], e[13] = t[13] + n[13], e[14] = t[14] + n[14], e[15] = t[15] + n[15], 
            e;
        },
        subtract: ws,
        multiplyScalar: function(e, t, n) {
            return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * n, 
            e[5] = t[5] * n, e[6] = t[6] * n, e[7] = t[7] * n, e[8] = t[8] * n, e[9] = t[9] * n, 
            e[10] = t[10] * n, e[11] = t[11] * n, e[12] = t[12] * n, e[13] = t[13] * n, e[14] = t[14] * n, 
            e[15] = t[15] * n, e;
        },
        multiplyScalarAndAdd: function(e, t, n, r) {
            return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, 
            e[4] = t[4] + n[4] * r, e[5] = t[5] + n[5] * r, e[6] = t[6] + n[6] * r, e[7] = t[7] + n[7] * r, 
            e[8] = t[8] + n[8] * r, e[9] = t[9] + n[9] * r, e[10] = t[10] + n[10] * r, e[11] = t[11] + n[11] * r, 
            e[12] = t[12] + n[12] * r, e[13] = t[13] + n[13] * r, e[14] = t[14] + n[14] * r, 
            e[15] = t[15] + n[15] * r, e;
        },
        exactEquals: function(e, t) {
            return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8] && e[9] === t[9] && e[10] === t[10] && e[11] === t[11] && e[12] === t[12] && e[13] === t[13] && e[14] === t[14] && e[15] === t[15];
        },
        equals: function(e, t) {
            var n = e[0], r = e[1], i = e[2], a = e[3], o = e[4], s = e[5], u = e[6], f = e[7], c = e[8], l = e[9], h = e[10], d = e[11], v = e[12], p = e[13], m = e[14], _ = e[15], g = t[0], x = t[1], b = t[2], y = t[3], T = t[4], w = t[5], E = t[6], S = t[7], A = t[8], M = t[9], R = t[10], O = t[11], B = t[12], C = t[13], F = t[14], I = t[15];
            return Math.abs(n - g) <= Wo * Math.max(1, Math.abs(n), Math.abs(g)) && Math.abs(r - x) <= Wo * Math.max(1, Math.abs(r), Math.abs(x)) && Math.abs(i - b) <= Wo * Math.max(1, Math.abs(i), Math.abs(b)) && Math.abs(a - y) <= Wo * Math.max(1, Math.abs(a), Math.abs(y)) && Math.abs(o - T) <= Wo * Math.max(1, Math.abs(o), Math.abs(T)) && Math.abs(s - w) <= Wo * Math.max(1, Math.abs(s), Math.abs(w)) && Math.abs(u - E) <= Wo * Math.max(1, Math.abs(u), Math.abs(E)) && Math.abs(f - S) <= Wo * Math.max(1, Math.abs(f), Math.abs(S)) && Math.abs(c - A) <= Wo * Math.max(1, Math.abs(c), Math.abs(A)) && Math.abs(l - M) <= Wo * Math.max(1, Math.abs(l), Math.abs(M)) && Math.abs(h - R) <= Wo * Math.max(1, Math.abs(h), Math.abs(R)) && Math.abs(d - O) <= Wo * Math.max(1, Math.abs(d), Math.abs(O)) && Math.abs(v - B) <= Wo * Math.max(1, Math.abs(v), Math.abs(B)) && Math.abs(p - C) <= Wo * Math.max(1, Math.abs(p), Math.abs(C)) && Math.abs(m - F) <= Wo * Math.max(1, Math.abs(m), Math.abs(F)) && Math.abs(_ - I) <= Wo * Math.max(1, Math.abs(_), Math.abs(I));
        },
        mul: Es,
        sub: Ss
    });
    function Ms() {
        var e = new Ko(3);
        return Ko != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0), e;
    }
    function Rs(e) {
        var t = e[0], n = e[1], r = e[2];
        return Math.sqrt(t * t + n * n + r * r);
    }
    function Os(e, t, n) {
        var r = new Ko(3);
        return r[0] = e, r[1] = t, r[2] = n, r;
    }
    function Bs(e, t) {
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e;
    }
    function Cs(e, t, n, r) {
        return e[0] = t, e[1] = n, e[2] = r, e;
    }
    function Fs(e, t, n) {
        return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e;
    }
    function Is(e, t, n) {
        return e[0] = t[0] * n[0], e[1] = t[1] * n[1], e[2] = t[2] * n[2], e;
    }
    function Ps(e, t, n) {
        return e[0] = t[0] / n[0], e[1] = t[1] / n[1], e[2] = t[2] / n[2], e;
    }
    function Ds(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2];
        return Math.sqrt(n * n + r * r + i * i);
    }
    function Ns(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2];
        return n * n + r * r + i * i;
    }
    function Ls(e) {
        var t = e[0], n = e[1], r = e[2];
        return t * t + n * n + r * r;
    }
    function qs(e, t) {
        var n = t[0], r = t[1], i = t[2], a = n * n + r * r + i * i;
        return 0 < a && (a = 1 / Math.sqrt(a), e[0] = t[0] * a, e[1] = t[1] * a, e[2] = t[2] * a), 
        e;
    }
    function Zs(e, t) {
        return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
    }
    function zs(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = n[0], s = n[1], u = n[2];
        return e[0] = i * u - a * s, e[1] = a * o - r * u, e[2] = r * s - i * o, e;
    }
    function Us(e, t) {
        var n = e[0], r = e[1], i = e[2], a = t[0], o = t[1], s = t[2];
        return Math.abs(n - a) <= Wo * Math.max(1, Math.abs(n), Math.abs(a)) && Math.abs(r - o) <= Wo * Math.max(1, Math.abs(r), Math.abs(o)) && Math.abs(i - s) <= Wo * Math.max(1, Math.abs(i), Math.abs(s));
    }
    var Gs, Hs = Fs, ks = Is, js = Ps, Vs = Ds, Xs = Ns, Ws = Rs, Ks = Ls, Ys = (Gs = Ms(), 
    function(e, t, n, r, i, a) {
        var o = void 0, s = void 0;
        for (t = t || 3, n = n || 0, s = r ? Math.min(r * t + n, e.length) : e.length, o = n; o < s; o += t) Gs[0] = e[o], 
        Gs[1] = e[o + 1], Gs[2] = e[o + 2], i(Gs, Gs, a), e[o] = Gs[0], e[o + 1] = Gs[1], 
        e[o + 2] = Gs[2];
        return e;
    }), Qs = Object.freeze({
        __proto__: null,
        create: Ms,
        clone: function(e) {
            var t = new Ko(3);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t;
        },
        length: Rs,
        fromValues: Os,
        copy: Bs,
        set: Cs,
        add: function(e, t, n) {
            return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e;
        },
        subtract: Fs,
        multiply: Is,
        divide: Ps,
        ceil: function(e, t) {
            return e[0] = Math.ceil(t[0]), e[1] = Math.ceil(t[1]), e[2] = Math.ceil(t[2]), e;
        },
        floor: function(e, t) {
            return e[0] = Math.floor(t[0]), e[1] = Math.floor(t[1]), e[2] = Math.floor(t[2]), 
            e;
        },
        min: function(e, t, n) {
            return e[0] = Math.min(t[0], n[0]), e[1] = Math.min(t[1], n[1]), e[2] = Math.min(t[2], n[2]), 
            e;
        },
        max: function(e, t, n) {
            return e[0] = Math.max(t[0], n[0]), e[1] = Math.max(t[1], n[1]), e[2] = Math.max(t[2], n[2]), 
            e;
        },
        round: function(e, t) {
            return e[0] = Math.round(t[0]), e[1] = Math.round(t[1]), e[2] = Math.round(t[2]), 
            e;
        },
        scale: function(e, t, n) {
            return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e;
        },
        scaleAndAdd: function(e, t, n, r) {
            return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e;
        },
        distance: Ds,
        squaredDistance: Ns,
        squaredLength: Ls,
        negate: function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e;
        },
        inverse: function(e, t) {
            return e[0] = 1 / t[0], e[1] = 1 / t[1], e[2] = 1 / t[2], e;
        },
        normalize: qs,
        dot: Zs,
        cross: zs,
        lerp: function(e, t, n, r) {
            var i = t[0], a = t[1], o = t[2];
            return e[0] = i + r * (n[0] - i), e[1] = a + r * (n[1] - a), e[2] = o + r * (n[2] - o), 
            e;
        },
        hermite: function(e, t, n, r, i, a) {
            var o = a * a, s = o * (2 * a - 3) + 1, u = o * (a - 2) + a, f = o * (a - 1), c = o * (3 - 2 * a);
            return e[0] = t[0] * s + n[0] * u + r[0] * f + i[0] * c, e[1] = t[1] * s + n[1] * u + r[1] * f + i[1] * c, 
            e[2] = t[2] * s + n[2] * u + r[2] * f + i[2] * c, e;
        },
        bezier: function(e, t, n, r, i, a) {
            var o = 1 - a, s = o * o, u = a * a, f = s * o, c = 3 * a * s, l = 3 * u * o, h = u * a;
            return e[0] = t[0] * f + n[0] * c + r[0] * l + i[0] * h, e[1] = t[1] * f + n[1] * c + r[1] * l + i[1] * h, 
            e[2] = t[2] * f + n[2] * c + r[2] * l + i[2] * h, e;
        },
        random: function(e, t) {
            t = t || 1;
            var n = 2 * Yo() * Math.PI, r = 2 * Yo() - 1, i = Math.sqrt(1 - r * r) * t;
            return e[0] = Math.cos(n) * i, e[1] = Math.sin(n) * i, e[2] = r * t, e;
        },
        transformMat4: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = n[3] * r + n[7] * i + n[11] * a + n[15];
            return o = o || 1, e[0] = (n[0] * r + n[4] * i + n[8] * a + n[12]) / o, e[1] = (n[1] * r + n[5] * i + n[9] * a + n[13]) / o, 
            e[2] = (n[2] * r + n[6] * i + n[10] * a + n[14]) / o, e;
        },
        transformMat3: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2];
            return e[0] = r * n[0] + i * n[3] + a * n[6], e[1] = r * n[1] + i * n[4] + a * n[7], 
            e[2] = r * n[2] + i * n[5] + a * n[8], e;
        },
        transformQuat: function(e, t, n) {
            var r = n[0], i = n[1], a = n[2], o = n[3], s = t[0], u = t[1], f = t[2], c = i * f - a * u, l = a * s - r * f, h = r * u - i * s, d = i * h - a * l, v = a * c - r * h, p = r * l - i * c, m = 2 * o;
            return c *= m, l *= m, h *= m, d *= 2, v *= 2, p *= 2, e[0] = s + c + d, e[1] = u + l + v, 
            e[2] = f + h + p, e;
        },
        rotateX: function(e, t, n, r) {
            var i = [], a = [];
            return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[0], 
            a[1] = i[1] * Math.cos(r) - i[2] * Math.sin(r), a[2] = i[1] * Math.sin(r) + i[2] * Math.cos(r), 
            e[0] = a[0] + n[0], e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
        },
        rotateY: function(e, t, n, r) {
            var i = [], a = [];
            return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[2] * Math.sin(r) + i[0] * Math.cos(r), 
            a[1] = i[1], a[2] = i[2] * Math.cos(r) - i[0] * Math.sin(r), e[0] = a[0] + n[0], 
            e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
        },
        rotateZ: function(e, t, n, r) {
            var i = [], a = [];
            return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[0] * Math.cos(r) - i[1] * Math.sin(r), 
            a[1] = i[0] * Math.sin(r) + i[1] * Math.cos(r), a[2] = i[2], e[0] = a[0] + n[0], 
            e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
        },
        angle: function(e, t) {
            var n = Os(e[0], e[1], e[2]), r = Os(t[0], t[1], t[2]);
            qs(n, n), qs(r, r);
            var i = Zs(n, r);
            return 1 < i ? 0 : i < -1 ? Math.PI : Math.acos(i);
        },
        str: function(e) {
            return "vec3(" + e[0] + ", " + e[1] + ", " + e[2] + ")";
        },
        exactEquals: function(e, t) {
            return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
        },
        equals: Us,
        sub: Hs,
        mul: ks,
        div: js,
        dist: Vs,
        sqrDist: Xs,
        len: Ws,
        sqrLen: Ks,
        forEach: Ys
    });
    function Js() {
        var e = new Ko(4);
        return Ko != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0), e;
    }
    function $s(e) {
        var t = new Ko(4);
        return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;
    }
    function eu(e, t, n, r) {
        var i = new Ko(4);
        return i[0] = e, i[1] = t, i[2] = n, i[3] = r, i;
    }
    function tu(e, t) {
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
    }
    function nu(e, t, n, r, i) {
        return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e;
    }
    function ru(e, t, n) {
        return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], 
        e;
    }
    function iu(e, t, n) {
        return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], 
        e;
    }
    function au(e, t, n) {
        return e[0] = t[0] * n[0], e[1] = t[1] * n[1], e[2] = t[2] * n[2], e[3] = t[3] * n[3], 
        e;
    }
    function ou(e, t, n) {
        return e[0] = t[0] / n[0], e[1] = t[1] / n[1], e[2] = t[2] / n[2], e[3] = t[3] / n[3], 
        e;
    }
    function su(e, t, n) {
        return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e;
    }
    function uu(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2], a = t[3] - e[3];
        return Math.sqrt(n * n + r * r + i * i + a * a);
    }
    function fu(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2], a = t[3] - e[3];
        return n * n + r * r + i * i + a * a;
    }
    function cu(e) {
        var t = e[0], n = e[1], r = e[2], i = e[3];
        return Math.sqrt(t * t + n * n + r * r + i * i);
    }
    function lu(e) {
        var t = e[0], n = e[1], r = e[2], i = e[3];
        return t * t + n * n + r * r + i * i;
    }
    function hu(e, t) {
        var n = t[0], r = t[1], i = t[2], a = t[3], o = n * n + r * r + i * i + a * a;
        return 0 < o && (o = 1 / Math.sqrt(o), e[0] = n * o, e[1] = r * o, e[2] = i * o, 
        e[3] = a * o), e;
    }
    function du(e, t) {
        return e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3];
    }
    function vu(e, t, n, r) {
        var i = t[0], a = t[1], o = t[2], s = t[3];
        return e[0] = i + r * (n[0] - i), e[1] = a + r * (n[1] - a), e[2] = o + r * (n[2] - o), 
        e[3] = s + r * (n[3] - s), e;
    }
    function pu(e, t) {
        return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3];
    }
    function mu(e, t) {
        var n = e[0], r = e[1], i = e[2], a = e[3], o = t[0], s = t[1], u = t[2], f = t[3];
        return Math.abs(n - o) <= Wo * Math.max(1, Math.abs(n), Math.abs(o)) && Math.abs(r - s) <= Wo * Math.max(1, Math.abs(r), Math.abs(s)) && Math.abs(i - u) <= Wo * Math.max(1, Math.abs(i), Math.abs(u)) && Math.abs(a - f) <= Wo * Math.max(1, Math.abs(a), Math.abs(f));
    }
    var _u, gu = iu, xu = au, bu = ou, yu = uu, Tu = fu, wu = cu, Eu = lu, Su = (_u = Js(), 
    function(e, t, n, r, i, a) {
        var o = void 0, s = void 0;
        for (t = t || 4, n = n || 0, s = r ? Math.min(r * t + n, e.length) : e.length, o = n; o < s; o += t) _u[0] = e[o], 
        _u[1] = e[o + 1], _u[2] = e[o + 2], _u[3] = e[o + 3], i(_u, _u, a), e[o] = _u[0], 
        e[o + 1] = _u[1], e[o + 2] = _u[2], e[o + 3] = _u[3];
        return e;
    }), Au = Object.freeze({
        __proto__: null,
        create: Js,
        clone: $s,
        fromValues: eu,
        copy: tu,
        set: nu,
        add: ru,
        subtract: iu,
        multiply: au,
        divide: ou,
        ceil: function(e, t) {
            return e[0] = Math.ceil(t[0]), e[1] = Math.ceil(t[1]), e[2] = Math.ceil(t[2]), e[3] = Math.ceil(t[3]), 
            e;
        },
        floor: function(e, t) {
            return e[0] = Math.floor(t[0]), e[1] = Math.floor(t[1]), e[2] = Math.floor(t[2]), 
            e[3] = Math.floor(t[3]), e;
        },
        min: function(e, t, n) {
            return e[0] = Math.min(t[0], n[0]), e[1] = Math.min(t[1], n[1]), e[2] = Math.min(t[2], n[2]), 
            e[3] = Math.min(t[3], n[3]), e;
        },
        max: function(e, t, n) {
            return e[0] = Math.max(t[0], n[0]), e[1] = Math.max(t[1], n[1]), e[2] = Math.max(t[2], n[2]), 
            e[3] = Math.max(t[3], n[3]), e;
        },
        round: function(e, t) {
            return e[0] = Math.round(t[0]), e[1] = Math.round(t[1]), e[2] = Math.round(t[2]), 
            e[3] = Math.round(t[3]), e;
        },
        scale: su,
        scaleAndAdd: function(e, t, n, r) {
            return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, 
            e;
        },
        distance: uu,
        squaredDistance: fu,
        length: cu,
        squaredLength: lu,
        negate: function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = -t[3], e;
        },
        inverse: function(e, t) {
            return e[0] = 1 / t[0], e[1] = 1 / t[1], e[2] = 1 / t[2], e[3] = 1 / t[3], e;
        },
        normalize: hu,
        dot: du,
        lerp: vu,
        random: function(e, t) {
            var n, r, i, a, o, s;
            for (t = t || 1; 1 <= (o = (n = 2 * Yo() - 1) * n + (r = 2 * Yo() - 1) * r); ) ;
            for (;1 <= (s = (i = 2 * Yo() - 1) * i + (a = 2 * Yo() - 1) * a); ) ;
            var u = Math.sqrt((1 - o) / s);
            return e[0] = t * n, e[1] = t * r, e[2] = t * i * u, e[3] = t * a * u, e;
        },
        transformMat4: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3];
            return e[0] = n[0] * r + n[4] * i + n[8] * a + n[12] * o, e[1] = n[1] * r + n[5] * i + n[9] * a + n[13] * o, 
            e[2] = n[2] * r + n[6] * i + n[10] * a + n[14] * o, e[3] = n[3] * r + n[7] * i + n[11] * a + n[15] * o, 
            e;
        },
        transformQuat: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = n[0], s = n[1], u = n[2], f = n[3], c = f * r + s * a - u * i, l = f * i + u * r - o * a, h = f * a + o * i - s * r, d = -o * r - s * i - u * a;
            return e[0] = c * f + d * -o + l * -u - h * -s, e[1] = l * f + d * -s + h * -o - c * -u, 
            e[2] = h * f + d * -u + c * -s - l * -o, e[3] = t[3], e;
        },
        str: function(e) {
            return "vec4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
        },
        exactEquals: pu,
        equals: mu,
        sub: gu,
        mul: xu,
        div: bu,
        dist: yu,
        sqrDist: Tu,
        len: wu,
        sqrLen: Eu,
        forEach: Su
    });
    function Mu() {
        var e = new Ko(4);
        return Ko != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0), e[3] = 1, e;
    }
    function Ru(e, t, n) {
        n *= .5;
        var r = Math.sin(n);
        return e[0] = r * t[0], e[1] = r * t[1], e[2] = r * t[2], e[3] = Math.cos(n), e;
    }
    function Ou(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = t[3], s = n[0], u = n[1], f = n[2], c = n[3];
        return e[0] = r * c + o * s + i * f - a * u, e[1] = i * c + o * u + a * s - r * f, 
        e[2] = a * c + o * f + r * u - i * s, e[3] = o * c - r * s - i * u - a * f, e;
    }
    function Bu(e, t, n) {
        n *= .5;
        var r = t[0], i = t[1], a = t[2], o = t[3], s = Math.sin(n), u = Math.cos(n);
        return e[0] = r * u + o * s, e[1] = i * u + a * s, e[2] = a * u - i * s, e[3] = o * u - r * s, 
        e;
    }
    function Cu(e, t, n) {
        n *= .5;
        var r = t[0], i = t[1], a = t[2], o = t[3], s = Math.sin(n), u = Math.cos(n);
        return e[0] = r * u - a * s, e[1] = i * u + o * s, e[2] = a * u + r * s, e[3] = o * u - i * s, 
        e;
    }
    function Fu(e, t, n) {
        n *= .5;
        var r = t[0], i = t[1], a = t[2], o = t[3], s = Math.sin(n), u = Math.cos(n);
        return e[0] = r * u + i * s, e[1] = i * u - r * s, e[2] = a * u + o * s, e[3] = o * u - a * s, 
        e;
    }
    function Iu(e, t, n, r) {
        var i = t[0], a = t[1], o = t[2], s = t[3], u = n[0], f = n[1], c = n[2], l = n[3], h = void 0, d = void 0, v = void 0, p = void 0, m = void 0;
        return (d = i * u + a * f + o * c + s * l) < 0 && (d = -d, u = -u, f = -f, c = -c, 
        l = -l), m = Wo < 1 - d ? (h = Math.acos(d), v = Math.sin(h), p = Math.sin((1 - r) * h) / v, 
        Math.sin(r * h) / v) : (p = 1 - r, r), e[0] = p * i + m * u, e[1] = p * a + m * f, 
        e[2] = p * o + m * c, e[3] = p * s + m * l, e;
    }
    function Pu(e, t) {
        var n = t[0] + t[4] + t[8], r = void 0;
        if (0 < n) r = Math.sqrt(n + 1), e[3] = .5 * r, r = .5 / r, e[0] = (t[5] - t[7]) * r, 
        e[1] = (t[6] - t[2]) * r, e[2] = (t[1] - t[3]) * r; else {
            var i = 0;
            t[4] > t[0] && (i = 1), t[8] > t[3 * i + i] && (i = 2);
            var a = (i + 1) % 3, o = (i + 2) % 3;
            r = Math.sqrt(t[3 * i + i] - t[3 * a + a] - t[3 * o + o] + 1), e[i] = .5 * r, r = .5 / r, 
            e[3] = (t[3 * a + o] - t[3 * o + a]) * r, e[a] = (t[3 * a + i] + t[3 * i + a]) * r, 
            e[o] = (t[3 * o + i] + t[3 * i + o]) * r;
        }
        return e;
    }
    var Du, Nu, Lu, qu, Zu, zu, Uu = $s, Gu = eu, Hu = tu, ku = nu, ju = ru, Vu = Ou, Xu = su, Wu = du, Ku = vu, Yu = cu, Qu = Yu, Ju = lu, $u = Ju, ef = hu, tf = pu, nf = mu, rf = (Du = Ms(), 
    Nu = Os(1, 0, 0), Lu = Os(0, 1, 0), function(e, t, n) {
        var r = Zs(t, n);
        return r < -.999999 ? (zs(Du, Nu, t), Ws(Du) < 1e-6 && zs(Du, Lu, t), qs(Du, Du), 
        Ru(e, Du, Math.PI), e) : .999999 < r ? (e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, 
        e) : (zs(Du, t, n), e[0] = Du[0], e[1] = Du[1], e[2] = Du[2], e[3] = 1 + r, ef(e, e));
    }), af = (qu = Mu(), Zu = Mu(), function(e, t, n, r, i, a) {
        return Iu(qu, t, i, a), Iu(Zu, n, r, a), Iu(e, qu, Zu, 2 * a * (1 - a)), e;
    }), of = (zu = fs(), function(e, t, n, r) {
        return zu[0] = n[0], zu[3] = n[1], zu[6] = n[2], zu[1] = r[0], zu[4] = r[1], zu[7] = r[2], 
        zu[2] = -t[0], zu[5] = -t[1], zu[8] = -t[2], ef(e, Pu(e, zu));
    }), sf = Object.freeze({
        __proto__: null,
        create: Mu,
        identity: function(e) {
            return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e;
        },
        setAxisAngle: Ru,
        getAxisAngle: function(e, t) {
            var n = 2 * Math.acos(t[3]), r = Math.sin(n / 2);
            return Wo < r ? (e[0] = t[0] / r, e[1] = t[1] / r, e[2] = t[2] / r) : (e[0] = 1, 
            e[1] = 0, e[2] = 0), n;
        },
        multiply: Ou,
        rotateX: Bu,
        rotateY: Cu,
        rotateZ: Fu,
        calculateW: function(e, t) {
            var n = t[0], r = t[1], i = t[2];
            return e[0] = n, e[1] = r, e[2] = i, e[3] = Math.sqrt(Math.abs(1 - n * n - r * r - i * i)), 
            e;
        },
        slerp: Iu,
        random: function(e) {
            var t = Yo(), n = Yo(), r = Yo(), i = Math.sqrt(1 - t), a = Math.sqrt(t);
            return e[0] = i * Math.sin(2 * Math.PI * n), e[1] = i * Math.cos(2 * Math.PI * n), 
            e[2] = a * Math.sin(2 * Math.PI * r), e[3] = a * Math.cos(2 * Math.PI * r), e;
        },
        invert: function(e, t) {
            var n = t[0], r = t[1], i = t[2], a = t[3], o = n * n + r * r + i * i + a * a, s = o ? 1 / o : 0;
            return e[0] = -n * s, e[1] = -r * s, e[2] = -i * s, e[3] = a * s, e;
        },
        conjugate: function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = t[3], e;
        },
        fromMat3: Pu,
        fromEuler: function(e, t, n, r) {
            var i = .5 * Math.PI / 180;
            t *= i, n *= i, r *= i;
            var a = Math.sin(t), o = Math.cos(t), s = Math.sin(n), u = Math.cos(n), f = Math.sin(r), c = Math.cos(r);
            return e[0] = a * u * c - o * s * f, e[1] = o * s * c + a * u * f, e[2] = o * u * f - a * s * c, 
            e[3] = o * u * c + a * s * f, e;
        },
        str: function(e) {
            return "quat(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
        },
        clone: Uu,
        fromValues: Gu,
        copy: Hu,
        set: ku,
        add: ju,
        mul: Vu,
        scale: Xu,
        dot: Wu,
        lerp: Ku,
        length: Yu,
        len: Qu,
        squaredLength: Ju,
        sqrLen: $u,
        normalize: ef,
        exactEquals: tf,
        equals: nf,
        rotationTo: rf,
        sqlerp: af,
        setAxes: of
    });
    function uf(e, t, n) {
        var r = .5 * n[0], i = .5 * n[1], a = .5 * n[2], o = t[0], s = t[1], u = t[2], f = t[3];
        return e[0] = o, e[1] = s, e[2] = u, e[3] = f, e[4] = r * f + i * u - a * s, e[5] = i * f + a * o - r * u, 
        e[6] = a * f + r * s - i * o, e[7] = -r * o - i * s - a * u, e;
    }
    function ff(e, t) {
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], 
        e[6] = t[6], e[7] = t[7], e;
    }
    var cf = Hu;
    var lf = Hu;
    function hf(e, t, n) {
        var r = t[0], i = t[1], a = t[2], o = t[3], s = n[4], u = n[5], f = n[6], c = n[7], l = t[4], h = t[5], d = t[6], v = t[7], p = n[0], m = n[1], _ = n[2], g = n[3];
        return e[0] = r * g + o * p + i * _ - a * m, e[1] = i * g + o * m + a * p - r * _, 
        e[2] = a * g + o * _ + r * m - i * p, e[3] = o * g - r * p - i * m - a * _, e[4] = r * c + o * s + i * f - a * u + l * g + v * p + h * _ - d * m, 
        e[5] = i * c + o * u + a * s - r * f + h * g + v * m + d * p - l * _, e[6] = a * c + o * f + r * u - i * s + d * g + v * _ + l * m - h * p, 
        e[7] = o * c - r * s - i * u - a * f + v * g - l * p - h * m - d * _, e;
    }
    var df = hf;
    var vf = Wu;
    var pf = Yu, mf = Ju, _f = mf;
    var gf = Object.freeze({
        __proto__: null,
        create: function() {
            var e = new Ko(8);
            return Ko != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0, e[4] = 0, e[5] = 0, 
            e[6] = 0, e[7] = 0), e[3] = 1, e;
        },
        clone: function(e) {
            var t = new Ko(8);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], 
            t[6] = e[6], t[7] = e[7], t;
        },
        fromValues: function(e, t, n, r, i, a, o, s) {
            var u = new Ko(8);
            return u[0] = e, u[1] = t, u[2] = n, u[3] = r, u[4] = i, u[5] = a, u[6] = o, u[7] = s, 
            u;
        },
        fromRotationTranslationValues: function(e, t, n, r, i, a, o) {
            var s = new Ko(8);
            s[0] = e, s[1] = t, s[2] = n, s[3] = r;
            var u = .5 * i, f = .5 * a, c = .5 * o;
            return s[4] = u * r + f * n - c * t, s[5] = f * r + c * e - u * n, s[6] = c * r + u * t - f * e, 
            s[7] = -u * e - f * t - c * n, s;
        },
        fromRotationTranslation: uf,
        fromTranslation: function(e, t) {
            return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = .5 * t[0], e[5] = .5 * t[1], 
            e[6] = .5 * t[2], e[7] = 0, e;
        },
        fromRotation: function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = 0, e[5] = 0, e[6] = 0, 
            e[7] = 0, e;
        },
        fromMat4: function(e, t) {
            var n = Mu();
            Ts(n, t);
            var r = new Ko(3);
            return ys(r, t), uf(e, n, r), e;
        },
        copy: ff,
        identity: function(e) {
            return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e[6] = 0, e[7] = 0, 
            e;
        },
        set: function(e, t, n, r, i, a, o, s, u) {
            return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e[4] = a, e[5] = o, e[6] = s, e[7] = u, 
            e;
        },
        getReal: cf,
        getDual: function(e, t) {
            return e[0] = t[4], e[1] = t[5], e[2] = t[6], e[3] = t[7], e;
        },
        setReal: lf,
        setDual: function(e, t) {
            return e[4] = t[0], e[5] = t[1], e[6] = t[2], e[7] = t[3], e;
        },
        getTranslation: function(e, t) {
            var n = t[4], r = t[5], i = t[6], a = t[7], o = -t[0], s = -t[1], u = -t[2], f = t[3];
            return e[0] = 2 * (n * f + a * o + r * u - i * s), e[1] = 2 * (r * f + a * s + i * o - n * u), 
            e[2] = 2 * (i * f + a * u + n * s - r * o), e;
        },
        translate: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3], s = .5 * n[0], u = .5 * n[1], f = .5 * n[2], c = t[4], l = t[5], h = t[6], d = t[7];
            return e[0] = r, e[1] = i, e[2] = a, e[3] = o, e[4] = o * s + i * f - a * u + c, 
            e[5] = o * u + a * s - r * f + l, e[6] = o * f + r * u - i * s + h, e[7] = -r * s - i * u - a * f + d, 
            e;
        },
        rotateX: function(e, t, n) {
            var r = -t[0], i = -t[1], a = -t[2], o = t[3], s = t[4], u = t[5], f = t[6], c = t[7], l = s * o + c * r + u * a - f * i, h = u * o + c * i + f * r - s * a, d = f * o + c * a + s * i - u * r, v = c * o - s * r - u * i - f * a;
            return Bu(e, t, n), r = e[0], i = e[1], a = e[2], o = e[3], e[4] = l * o + v * r + h * a - d * i, 
            e[5] = h * o + v * i + d * r - l * a, e[6] = d * o + v * a + l * i - h * r, e[7] = v * o - l * r - h * i - d * a, 
            e;
        },
        rotateY: function(e, t, n) {
            var r = -t[0], i = -t[1], a = -t[2], o = t[3], s = t[4], u = t[5], f = t[6], c = t[7], l = s * o + c * r + u * a - f * i, h = u * o + c * i + f * r - s * a, d = f * o + c * a + s * i - u * r, v = c * o - s * r - u * i - f * a;
            return Cu(e, t, n), r = e[0], i = e[1], a = e[2], o = e[3], e[4] = l * o + v * r + h * a - d * i, 
            e[5] = h * o + v * i + d * r - l * a, e[6] = d * o + v * a + l * i - h * r, e[7] = v * o - l * r - h * i - d * a, 
            e;
        },
        rotateZ: function(e, t, n) {
            var r = -t[0], i = -t[1], a = -t[2], o = t[3], s = t[4], u = t[5], f = t[6], c = t[7], l = s * o + c * r + u * a - f * i, h = u * o + c * i + f * r - s * a, d = f * o + c * a + s * i - u * r, v = c * o - s * r - u * i - f * a;
            return Fu(e, t, n), r = e[0], i = e[1], a = e[2], o = e[3], e[4] = l * o + v * r + h * a - d * i, 
            e[5] = h * o + v * i + d * r - l * a, e[6] = d * o + v * a + l * i - h * r, e[7] = v * o - l * r - h * i - d * a, 
            e;
        },
        rotateByQuatAppend: function(e, t, n) {
            var r = n[0], i = n[1], a = n[2], o = n[3], s = t[0], u = t[1], f = t[2], c = t[3];
            return e[0] = s * o + c * r + u * a - f * i, e[1] = u * o + c * i + f * r - s * a, 
            e[2] = f * o + c * a + s * i - u * r, e[3] = c * o - s * r - u * i - f * a, s = t[4], 
            u = t[5], f = t[6], c = t[7], e[4] = s * o + c * r + u * a - f * i, e[5] = u * o + c * i + f * r - s * a, 
            e[6] = f * o + c * a + s * i - u * r, e[7] = c * o - s * r - u * i - f * a, e;
        },
        rotateByQuatPrepend: function(e, t, n) {
            var r = t[0], i = t[1], a = t[2], o = t[3], s = n[0], u = n[1], f = n[2], c = n[3];
            return e[0] = r * c + o * s + i * f - a * u, e[1] = i * c + o * u + a * s - r * f, 
            e[2] = a * c + o * f + r * u - i * s, e[3] = o * c - r * s - i * u - a * f, s = n[4], 
            u = n[5], f = n[6], c = n[7], e[4] = r * c + o * s + i * f - a * u, e[5] = i * c + o * u + a * s - r * f, 
            e[6] = a * c + o * f + r * u - i * s, e[7] = o * c - r * s - i * u - a * f, e;
        },
        rotateAroundAxis: function(e, t, n, r) {
            if (Math.abs(r) < Wo) return ff(e, t);
            var i = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
            r *= .5;
            var a = Math.sin(r), o = a * n[0] / i, s = a * n[1] / i, u = a * n[2] / i, f = Math.cos(r), c = t[0], l = t[1], h = t[2], d = t[3];
            e[0] = c * f + d * o + l * u - h * s, e[1] = l * f + d * s + h * o - c * u, e[2] = h * f + d * u + c * s - l * o, 
            e[3] = d * f - c * o - l * s - h * u;
            var v = t[4], p = t[5], m = t[6], _ = t[7];
            return e[4] = v * f + _ * o + p * u - m * s, e[5] = p * f + _ * s + m * o - v * u, 
            e[6] = m * f + _ * u + v * s - p * o, e[7] = _ * f - v * o - p * s - m * u, e;
        },
        add: function(e, t, n) {
            return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], 
            e[4] = t[4] + n[4], e[5] = t[5] + n[5], e[6] = t[6] + n[6], e[7] = t[7] + n[7], 
            e;
        },
        multiply: hf,
        mul: df,
        scale: function(e, t, n) {
            return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * n, 
            e[5] = t[5] * n, e[6] = t[6] * n, e[7] = t[7] * n, e;
        },
        dot: vf,
        lerp: function(e, t, n, r) {
            var i = 1 - r;
            return vf(t, n) < 0 && (r = -r), e[0] = t[0] * i + n[0] * r, e[1] = t[1] * i + n[1] * r, 
            e[2] = t[2] * i + n[2] * r, e[3] = t[3] * i + n[3] * r, e[4] = t[4] * i + n[4] * r, 
            e[5] = t[5] * i + n[5] * r, e[6] = t[6] * i + n[6] * r, e[7] = t[7] * i + n[7] * r, 
            e;
        },
        invert: function(e, t) {
            var n = mf(t);
            return e[0] = -t[0] / n, e[1] = -t[1] / n, e[2] = -t[2] / n, e[3] = t[3] / n, e[4] = -t[4] / n, 
            e[5] = -t[5] / n, e[6] = -t[6] / n, e[7] = t[7] / n, e;
        },
        conjugate: function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = t[3], e[4] = -t[4], e[5] = -t[5], 
            e[6] = -t[6], e[7] = t[7], e;
        },
        length: Yu,
        len: pf,
        squaredLength: mf,
        sqrLen: _f,
        normalize: function(e, t) {
            var n = mf(t);
            if (0 < n) {
                n = Math.sqrt(n);
                var r = t[0] / n, i = t[1] / n, a = t[2] / n, o = t[3] / n, s = t[4], u = t[5], f = t[6], c = t[7], l = r * s + i * u + a * f + o * c;
                e[0] = r, e[1] = i, e[2] = a, e[3] = o, e[4] = (s - r * l) / n, e[5] = (u - i * l) / n, 
                e[6] = (f - a * l) / n, e[7] = (c - o * l) / n;
            }
            return e;
        },
        str: function(e) {
            return "quat2(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ")";
        },
        exactEquals: function(e, t) {
            return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7];
        },
        equals: function(e, t) {
            var n = e[0], r = e[1], i = e[2], a = e[3], o = e[4], s = e[5], u = e[6], f = e[7], c = t[0], l = t[1], h = t[2], d = t[3], v = t[4], p = t[5], m = t[6], _ = t[7];
            return Math.abs(n - c) <= Wo * Math.max(1, Math.abs(n), Math.abs(c)) && Math.abs(r - l) <= Wo * Math.max(1, Math.abs(r), Math.abs(l)) && Math.abs(i - h) <= Wo * Math.max(1, Math.abs(i), Math.abs(h)) && Math.abs(a - d) <= Wo * Math.max(1, Math.abs(a), Math.abs(d)) && Math.abs(o - v) <= Wo * Math.max(1, Math.abs(o), Math.abs(v)) && Math.abs(s - p) <= Wo * Math.max(1, Math.abs(s), Math.abs(p)) && Math.abs(u - m) <= Wo * Math.max(1, Math.abs(u), Math.abs(m)) && Math.abs(f - _) <= Wo * Math.max(1, Math.abs(f), Math.abs(_));
        }
    });
    function xf() {
        var e = new Ko(2);
        return Ko != Float32Array && (e[0] = 0, e[1] = 0), e;
    }
    function bf(e, t, n) {
        return e[0] = t, e[1] = n, e;
    }
    function yf(e, t, n) {
        return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e;
    }
    function Tf(e, t, n) {
        return e[0] = t[0] * n[0], e[1] = t[1] * n[1], e;
    }
    function wf(e, t, n) {
        return e[0] = t[0] / n[0], e[1] = t[1] / n[1], e;
    }
    function Ef(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1];
        return Math.sqrt(n * n + r * r);
    }
    function Sf(e, t) {
        var n = t[0] - e[0], r = t[1] - e[1];
        return n * n + r * r;
    }
    function Af(e) {
        var t = e[0], n = e[1];
        return Math.sqrt(t * t + n * n);
    }
    function Mf(e) {
        var t = e[0], n = e[1];
        return t * t + n * n;
    }
    function Rf(e, t) {
        if (e === t) return !0;
        if (e && t && "object" == typeof e && "object" == typeof t) {
            var n, r, i, a = Zf(e), o = Zf(t);
            if (a && o) {
                if ((r = e.length) != t.length) return !1;
                for (n = r; 0 != n--; ) if (!Rf(e[n], t[n])) return !1;
                return !0;
            }
            if (a != o) return !1;
            var s = e instanceof Date, u = t instanceof Date;
            if (s != u) return !1;
            if (s && u) return e.getTime() == t.getTime();
            var f = e instanceof RegExp, c = t instanceof RegExp;
            if (f != c) return !1;
            if (f && c) return e.toString() == t.toString();
            var l = zf(e);
            if ((r = l.length) !== zf(t).length) return !1;
            for (n = r; 0 != n--; ) if (!Uf.call(t, l[n])) return !1;
            for (n = r; 0 != n--; ) if (!Rf(e[i = l[n]], t[i])) return !1;
            return !0;
        }
        return e != e && t != t;
    }
    var Of, Bf = Af, Cf = yf, Ff = Tf, If = wf, Pf = Ef, Df = Sf, Nf = Mf, Lf = (Of = xf(), 
    function(e, t, n, r, i, a) {
        var o = void 0, s = void 0;
        for (t = t || 2, n = n || 0, s = r ? Math.min(r * t + n, e.length) : e.length, o = n; o < s; o += t) Of[0] = e[o], 
        Of[1] = e[o + 1], i(Of, Of, a), e[o] = Of[0], e[o + 1] = Of[1];
        return e;
    }), qf = Object.freeze({
        __proto__: null,
        create: xf,
        clone: function(e) {
            var t = new Ko(2);
            return t[0] = e[0], t[1] = e[1], t;
        },
        fromValues: function(e, t) {
            var n = new Ko(2);
            return n[0] = e, n[1] = t, n;
        },
        copy: function(e, t) {
            return e[0] = t[0], e[1] = t[1], e;
        },
        set: bf,
        add: function(e, t, n) {
            return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e;
        },
        subtract: yf,
        multiply: Tf,
        divide: wf,
        ceil: function(e, t) {
            return e[0] = Math.ceil(t[0]), e[1] = Math.ceil(t[1]), e;
        },
        floor: function(e, t) {
            return e[0] = Math.floor(t[0]), e[1] = Math.floor(t[1]), e;
        },
        min: function(e, t, n) {
            return e[0] = Math.min(t[0], n[0]), e[1] = Math.min(t[1], n[1]), e;
        },
        max: function(e, t, n) {
            return e[0] = Math.max(t[0], n[0]), e[1] = Math.max(t[1], n[1]), e;
        },
        round: function(e, t) {
            return e[0] = Math.round(t[0]), e[1] = Math.round(t[1]), e;
        },
        scale: function(e, t, n) {
            return e[0] = t[0] * n, e[1] = t[1] * n, e;
        },
        scaleAndAdd: function(e, t, n, r) {
            return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e;
        },
        distance: Ef,
        squaredDistance: Sf,
        length: Af,
        squaredLength: Mf,
        negate: function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e;
        },
        inverse: function(e, t) {
            return e[0] = 1 / t[0], e[1] = 1 / t[1], e;
        },
        normalize: function(e, t) {
            var n = t[0], r = t[1], i = n * n + r * r;
            return 0 < i && (i = 1 / Math.sqrt(i), e[0] = t[0] * i, e[1] = t[1] * i), e;
        },
        dot: function(e, t) {
            return e[0] * t[0] + e[1] * t[1];
        },
        cross: function(e, t, n) {
            var r = t[0] * n[1] - t[1] * n[0];
            return e[0] = e[1] = 0, e[2] = r, e;
        },
        lerp: function(e, t, n, r) {
            var i = t[0], a = t[1];
            return e[0] = i + r * (n[0] - i), e[1] = a + r * (n[1] - a), e;
        },
        random: function(e, t) {
            t = t || 1;
            var n = 2 * Yo() * Math.PI;
            return e[0] = Math.cos(n) * t, e[1] = Math.sin(n) * t, e;
        },
        transformMat2: function(e, t, n) {
            var r = t[0], i = t[1];
            return e[0] = n[0] * r + n[2] * i, e[1] = n[1] * r + n[3] * i, e;
        },
        transformMat2d: function(e, t, n) {
            var r = t[0], i = t[1];
            return e[0] = n[0] * r + n[2] * i + n[4], e[1] = n[1] * r + n[3] * i + n[5], e;
        },
        transformMat3: function(e, t, n) {
            var r = t[0], i = t[1];
            return e[0] = n[0] * r + n[3] * i + n[6], e[1] = n[1] * r + n[4] * i + n[7], e;
        },
        transformMat4: function(e, t, n) {
            var r = t[0], i = t[1];
            return e[0] = n[0] * r + n[4] * i + n[12], e[1] = n[1] * r + n[5] * i + n[13], e;
        },
        rotate: function(e, t, n, r) {
            var i = t[0] - n[0], a = t[1] - n[1], o = Math.sin(r), s = Math.cos(r);
            return e[0] = i * s - a * o + n[0], e[1] = i * o + a * s + n[1], e;
        },
        angle: function(e, t) {
            var n = e[0], r = e[1], i = t[0], a = t[1], o = n * n + r * r;
            0 < o && (o = 1 / Math.sqrt(o));
            var s = i * i + a * a;
            0 < s && (s = 1 / Math.sqrt(s));
            var u = (n * i + r * a) * o * s;
            return 1 < u ? 0 : u < -1 ? Math.PI : Math.acos(u);
        },
        str: function(e) {
            return "vec2(" + e[0] + ", " + e[1] + ")";
        },
        exactEquals: function(e, t) {
            return e[0] === t[0] && e[1] === t[1];
        },
        equals: function(e, t) {
            var n = e[0], r = e[1], i = t[0], a = t[1];
            return Math.abs(n - i) <= Wo * Math.max(1, Math.abs(n), Math.abs(i)) && Math.abs(r - a) <= Wo * Math.max(1, Math.abs(r), Math.abs(a));
        },
        len: Bf,
        sub: Cf,
        mul: Ff,
        div: If,
        dist: Pf,
        sqrDist: Df,
        sqrLen: Nf,
        forEach: Lf
    }), Zf = Array.isArray, zf = Object.keys, Uf = Object.prototype.hasOwnProperty;
    function Gf(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) e[r] = n[r];
        }
        return e;
    }
    function Hf(e) {
        for (var t = arguments.length, n = new Array(1 < t ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
        for (var i = 0; i < n.length; i++) Gf(e, n[i]);
    }
    var kf, jf, Vf, Xf = 1, Wf = ((Vf = Kf.prototype).attachShader = function(e, t) {
        return this._.attachShader(e, t);
    }, Vf.shaderSource = function(e, t) {
        return this._.shaderSource(e, t);
    }, Vf.compileShader = function(e) {
        return this._.compileShader(e);
    }, Vf.createShader = function(e) {
        return this._.createShader(e);
    }, Vf.createProgram = function() {
        return this._.createProgram();
    }, Vf.createVertexArray = function() {
        return this.R || (this.R = this._.getExtension("OES_vertex_array_object")), this.R.createVertexArrayOES();
    }, Vf.deleteVertexArray = function(e) {
        return this.R || (this.R = this._.getExtension("OES_vertex_array_object")), this.R.deleteVertexArrayOES(e);
    }, Vf.bindVertexArray = function(e) {
        return this.R || (this.R = this._.getExtension("OES_vertex_array_object")), this.R.bindVertexArrayOES(e);
    }, Vf.deleteProgram = function(e) {
        return this.states.program === e && (this.states.program = null), this._.deleteProgram(e);
    }, Vf.deleteShader = function(e) {
        return this._.deleteShader(e);
    }, Vf.detachShader = function(e, t) {
        return this._.detachShader(e, t);
    }, Vf.getAttachedShaders = function(e) {
        return this._.getAttachedShaders(e);
    }, Vf.linkProgram = function(e) {
        return this.T(), this._.linkProgram(e);
    }, Vf.getShaderParameter = function(e, t) {
        return this._.getShaderParameter(e, t);
    }, Vf.getShaderPrecisionFormat = function(e, t) {
        return this._.getShaderPrecisionFormat(e, t);
    }, Vf.getShaderInfoLog = function(e) {
        return this._.getShaderInfoLog(e);
    }, Vf.getShaderSource = function(e) {
        return this._.getShaderSource(e);
    }, Vf.getProgramInfoLog = function(e) {
        return this._.getProgramInfoLog(e);
    }, Vf.getProgramParameter = function(e, t) {
        return this._.getProgramParameter(e, t);
    }, Vf.getError = function() {
        return this._.getError();
    }, Vf.getContextAttributes = function() {
        return this._.getContextAttributes();
    }, Vf.getExtension = function(e) {
        return this._.getExtension(e);
    }, Vf.getSupportedExtensions = function() {
        return this._.getSupportedExtensions();
    }, Vf.getParameter = function(e) {
        return this.T(), this._.getParameter(e);
    }, Vf.isEnabled = function(e) {
        return this._.isEnabled(e);
    }, Vf.isProgram = function(e) {
        return this._.isProgram(e);
    }, Vf.isShader = function(e) {
        return this._.isShader(e);
    }, Vf.validateProgram = function(e) {
        return this._.validateProgram(e);
    }, Vf.clear = function(e) {
        return this.T(), this._.clear(e);
    }, Vf.drawArrays = function(e, t, n) {
        return this.T(), this._.drawArrays(e, t, n);
    }, Vf.drawElements = function(e, t, n, r) {
        return this.T(), this._.drawElements(e, t, n, r);
    }, Vf.drawBuffers = function(e) {
        return this.T(), this._.drawBuffers(e);
    }, Vf.A = function() {
        for (var e = this._, t = e.getParameter(e.CURRENT_PROGRAM), n = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES), r = [], i = 0; i < n; i++) r.push(e.getVertexAttrib(i, e.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING));
        this.t = {
            buffers: r,
            elements: e.getParameter(e.ELEMENT_ARRAY_BUFFER_BINDING),
            framebuffer: e.getParameter(e.FRAMEBUFFER_BINDING)
        }, window.DEBUGGING && (console.log(this.uid, this.t), console.log(this.uid, this.states.attributes), 
        console.log(this.states.attributes[0].buffer === this.t.buffers[0]), console.log(this.states.attributes[1].buffer === this.t.buffers[1]), 
        console.log(this.states.attributes[2].buffer === this.t.buffers[2]));
    }, Vf.finish = function() {}, Vf.flush = function() {
        return this.T(), this._.flush();
    }, Vf.commit = function() {
        return this.T(), this._.commit();
    }, Vf.isContextLost = function() {
        return this._.isContextLost();
    }, n((kf = Kf).prototype, [ {
        key: "canvas",
        get: function() {
            return this._.canvas;
        }
    }, {
        key: "drawingBufferWidth",
        get: function() {
            return this._.drawingBufferWidth;
        }
    }, {
        key: "drawingBufferHeight",
        get: function() {
            return this._.drawingBufferHeight;
        }
    }, {
        key: "gl",
        get: function() {
            return this._;
        }
    } ]), jf && n(kf, jf), Kf);
    function Kf(e) {
        var r;
        this.uid = Xf++, this.states = {
            scissor: [ 0, 0, (r = e).canvas.width, r.canvas.height ],
            viewport: [ 0, 0, r.canvas.width, r.canvas.height ],
            blendColor: [ 0, 0, 0, 0 ],
            blendEquationSeparate: [ r.FUNC_ADD, r.FUNC_ADD ],
            blendFuncSeparate: [ r.ONE, r.ZERO, r.ONE, r.ZERO ],
            clearColor: [ 0, 0, 0, 0 ],
            clearDepth: [ 1 ],
            clearStencil: [ 0 ],
            colorMask: [ !0, !0, !0, !0 ],
            cullFace: [ r.BACK ],
            depthFunc: [ r.LESS ],
            depthMask: [ !0 ],
            depthRange: [ 0, 1 ],
            capabilities: {
                3042: !1,
                2884: !1,
                2929: !1,
                3024: !1,
                32823: !1,
                32926: !1,
                32928: !1,
                3089: !1,
                2960: !1
            },
            frontFace: [ r.CCW ],
            hint: {
                33170: [ r.DONT_CARE ],
                35723: [ r.DONT_CARE ]
            },
            lineWidth: [ 1 ],
            pixelStorei: {
                3333: [ 4 ],
                3317: [ 4 ],
                37440: [ !1 ],
                37441: [ !1 ],
                37443: [ r.BROWSER_DEFAULT_WEBGL ]
            },
            polygonOffset: [ 0, 0 ],
            sampleCoverage: [ 1, !1 ],
            stencilFuncSeparate: {
                1028: [ r.ALWAYS, 0, 4294967295 ],
                1029: [ r.ALWAYS, 0, 4294967295 ]
            },
            stencilMaskSeparate: {
                1028: [ 4294967295 ],
                1029: [ 4294967295 ]
            },
            stencilOpSeparate: {
                1028: [ r.KEEP, r.KEEP, r.KEEP ],
                1029: [ r.KEEP, r.KEEP, r.KEEP ]
            },
            program: null,
            framebuffer: {
                36160: null,
                36008: null,
                36009: null
            },
            renderbuffer: {
                36161: null
            },
            textures: {
                active: -1,
                units: function() {
                    for (var e = [], t = r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS), n = 0; n < t; n++) e.push({
                        3553: null,
                        34067: null
                    });
                    return e[-1] = {
                        3553: null,
                        34067: null
                    }, e;
                }()
            },
            attributes: {},
            arrayBuffer: null,
            elementArrayBuffer: null
        }, this._ = e;
    }
    Hf(Wf.prototype, {
        DEPTH_BUFFER_BIT: 256,
        STENCIL_BUFFER_BIT: 1024,
        COLOR_BUFFER_BIT: 16384,
        POINTS: 0,
        LINES: 1,
        LINE_LOOP: 2,
        LINE_STRIP: 3,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6,
        ZERO: 0,
        ONE: 1,
        SRC_COLOR: 768,
        ONE_MINUS_SRC_COLOR: 769,
        SRC_ALPHA: 770,
        ONE_MINUS_SRC_ALPHA: 771,
        DST_ALPHA: 772,
        ONE_MINUS_DST_ALPHA: 773,
        DST_COLOR: 774,
        ONE_MINUS_DST_COLOR: 775,
        SRC_ALPHA_SATURATE: 776,
        CONSTANT_COLOR: 32769,
        ONE_MINUS_CONSTANT_COLOR: 32770,
        CONSTANT_ALPHA: 32771,
        ONE_MINUS_CONSTANT_ALPHA: 32772,
        FUNC_ADD: 32774,
        FUNC_SUBSTRACT: 32778,
        FUNC_REVERSE_SUBTRACT: 32779,
        BLEND_EQUATION: 32777,
        BLEND_EQUATION_RGB: 32777,
        BLEND_EQUATION_ALPHA: 34877,
        BLEND_DST_RGB: 32968,
        BLEND_SRC_RGB: 32969,
        BLEND_DST_ALPHA: 32970,
        BLEND_SRC_ALPHA: 32971,
        BLEND_COLOR: 32773,
        ARRAY_BUFFER_BINDING: 34964,
        ELEMENT_ARRAY_BUFFER_BINDING: 34965,
        LINE_WIDTH: 2849,
        ALIASED_POINT_SIZE_RANGE: 33901,
        ALIASED_LINE_WIDTH_RANGE: 33902,
        CULL_FACE_MODE: 2885,
        FRONT_FACE: 2886,
        DEPTH_RANGE: 2928,
        DEPTH_WRITEMASK: 2930,
        DEPTH_CLEAR_VALUE: 2931,
        DEPTH_FUNC: 2932,
        STENCIL_CLEAR_VALUE: 2961,
        STENCIL_FUNC: 2962,
        STENCIL_FAIL: 2964,
        STENCIL_PASS_DEPTH_FAIL: 2965,
        STENCIL_PASS_DEPTH_PASS: 2966,
        STENCIL_REF: 2967,
        STENCIL_VALUE_MASK: 2963,
        STENCIL_WRITEMASK: 2968,
        STENCIL_BACK_FUNC: 34816,
        STENCIL_BACK_FAIL: 34817,
        STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
        STENCIL_BACK_PASS_DEPTH_PASS: 34819,
        STENCIL_BACK_REF: 36003,
        STENCIL_BACK_VALUE_MASK: 36004,
        STENCIL_BACK_WRITEMASK: 36005,
        VIEWPORT: 2978,
        SCISSOR_BOX: 3088,
        COLOR_CLEAR_VALUE: 3106,
        COLOR_WRITEMASK: 3107,
        UNPACK_ALIGNMENT: 3317,
        PACK_ALIGNMENT: 3333,
        MAX_TEXTURE_SIZE: 3379,
        MAX_VIEWPORT_DIMS: 3386,
        SUBPIXEL_BITS: 3408,
        RED_BITS: 3410,
        GREEN_BITS: 3411,
        BLUE_BITS: 3412,
        ALPHA_BITS: 3413,
        DEPTH_BITS: 3414,
        STENCIL_BITS: 3415,
        POLYGON_OFFSET_UNITS: 10752,
        POLYGON_OFFSET_FACTOR: 32824,
        TEXTURE_BINDING_2D: 32873,
        SAMPLE_BUFFERS: 32936,
        SAMPLES: 32937,
        SAMPLE_COVERAGE_VALUE: 32938,
        SAMPLE_COVERAGE_INVERT: 32939,
        COMPRESSED_TEXTURE_FORMATS: 34467,
        VENDOR: 7936,
        RENDERER: 7937,
        VERSION: 7938,
        IMPLEMENTATION_COLOR_READ_TYPE: 35738,
        IMPLEMENTATION_COLOR_READ_FORMAT: 35739,
        BROWSER_DEFAULT_WEBGL: 37444,
        STATIC_DRAW: 35044,
        STREAM_DRAW: 35040,
        DYNAMIC_DRAW: 35048,
        ARRAY_BUFFER: 34962,
        ELEMENT_ARRAY_BUFFER: 34963,
        BUFFER_SIZE: 34660,
        BUFFER_USAGE: 34661,
        CURRENT_VERTEX_ATTRIB: 34342,
        VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
        VERTEX_ATTRIB_ARRAY_SIZE: 34339,
        VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
        VERTEX_ATTRIB_ARRAY_TYPE: 34341,
        VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
        VERTEX_ATTRIB_ARRAY_POINTER: 34373,
        VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
        CULL_FACE: 2884,
        FRONT: 1028,
        BACK: 1029,
        FRONT_AND_BACK: 1032,
        BLEND: 3042,
        DEPTH_TEST: 2929,
        DITHER: 3024,
        POLYGON_OFFSET_FILL: 32823,
        SAMPLE_ALPHA_TO_COVERAGE: 32926,
        SAMPLE_COVERAGE: 32928,
        SCISSOR_TEST: 3089,
        STENCIL_TEST: 2960,
        NO_ERROR: 0,
        INVALID_ENUM: 1280,
        INVALID_VALUE: 1281,
        INVALID_OPERATION: 1282,
        OUT_OF_MEMORY: 1285,
        CONTEXT_LOST_WEBGL: 37442,
        CW: 2304,
        CCW: 2305,
        DONT_CARE: 4352,
        FASTEST: 4353,
        NICEST: 4354,
        GENERATE_MIPMAP_HINT: 33170,
        BYTE: 5120,
        UNSIGNED_BYTE: 5121,
        SHORT: 5122,
        UNSIGNED_SHORT: 5123,
        INT: 5124,
        UNSIGNED_INT: 5125,
        FLOAT: 5126,
        DEPTH_COMPONENT: 6402,
        ALPHA: 6406,
        RGB: 6407,
        RGBA: 6408,
        LUMINANCE: 6409,
        LUMINANCE_ALPHA: 6410,
        UNSIGNED_SHORT_4_4_4_4: 32819,
        UNSIGNED_SHORT_5_5_5_1: 32820,
        UNSIGNED_SHORT_5_6_5: 33635,
        FRAGMENT_SHADER: 35632,
        VERTEX_SHADER: 35633,
        COMPILE_STATUS: 35713,
        DELETE_STATUS: 35712,
        LINK_STATUS: 35714,
        VALIDATE_STATUS: 35715,
        ATTACHED_SHADERS: 35717,
        ACTIVE_ATTRIBUTES: 35721,
        ACTIVE_UNIFORMS: 35718,
        MAX_VERTEX_ATTRIBS: 34921,
        MAX_VERTEX_UNIFORM_VECTORS: 36347,
        MAX_VARYING_VECTORS: 36348,
        MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
        MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
        MAX_TEXTURE_IMAGE_UNITS: 34930,
        MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
        SHADER_TYPE: 35663,
        SHADING_LANGUAGE_VERSION: 35724,
        CURRENT_PROGRAM: 35725,
        NEVER: 512,
        ALWAYS: 519,
        LESS: 513,
        EQUAL: 514,
        LEQUAL: 515,
        GREATER: 516,
        GEQUAL: 518,
        NOTEQUAL: 517,
        KEEP: 7680,
        REPLACE: 7681,
        INCR: 7682,
        DECR: 7683,
        INVERT: 5386,
        INCR_WRAP: 34055,
        DECR_WRAP: 34056,
        NEAREST: 9728,
        LINEAR: 9729,
        NEAREST_MIPMAP_NEAREST: 9984,
        LINEAR_MIPMAP_NEAREST: 9985,
        NEAREST_MIPMAP_LINEAR: 9986,
        LINEAR_MIPMAP_LINEAR: 9987,
        TEXTURE_MAG_FILTER: 10240,
        TEXTURE_MIN_FILTER: 10241,
        TEXTURE_WRAP_S: 10242,
        TEXTURE_WRAP_T: 10243,
        TEXTURE_2D: 3553,
        TEXTURE: 5890,
        TEXTURE_CUBE_MAP: 34067,
        TEXTURE_BINDING_CUBE_MAP: 34068,
        TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
        TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
        TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
        TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
        TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
        TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
        MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
        TEXTURE0: 33984,
        TEXTURE1: 33985,
        TEXTURE2: 33986,
        TEXTURE3: 33987,
        TEXTURE4: 33988,
        TEXTURE5: 33989,
        TEXTURE6: 33990,
        TEXTURE7: 33991,
        TEXTURE8: 33992,
        TEXTURE9: 33993,
        TEXTURE10: 33994,
        TEXTURE11: 33995,
        TEXTURE12: 33996,
        TEXTURE13: 33997,
        TEXTURE14: 33998,
        TEXTURE15: 33999,
        TEXTURE16: 34e3,
        ACTIVE_TEXTURE: 34016,
        REPEAT: 10497,
        CLAMP_TO_EDGE: 33071,
        MIRRORED_REPEAT: 33648,
        TEXTURE_WIDTH: 4096,
        TEXTURE_HEIGHT: 4097,
        FLOAT_VEC2: 35664,
        FLOAT_VEC3: 35665,
        FLOAT_VEC4: 35666,
        INT_VEC2: 35667,
        INT_VEC3: 35668,
        INT_VEC4: 35669,
        BOOL: 35670,
        BOOL_VEC2: 35671,
        BOOL_VEC3: 35672,
        BOOL_VEC4: 35673,
        FLOAT_MAT2: 35674,
        FLOAT_MAT3: 35675,
        FLOAT_MAT4: 35676,
        SAMPLER_2D: 35678,
        SAMPLER_CUBE: 35680,
        LOW_FLOAT: 36336,
        MEDIUM_FLOAT: 36337,
        HIGH_FLOAT: 36338,
        LOW_INT: 36339,
        MEDIUM_INT: 36340,
        HIGH_INT: 36341,
        FRAMEBUFFER: 36160,
        RENDERBUFFER: 36161,
        RGBA4: 32854,
        RGB5_A1: 32855,
        RGB565: 36194,
        DEPTH_COMPONENT16: 33189,
        STENCIL_INDEX: 6401,
        STENCIL_INDEX8: 36168,
        DEPTH_STENCIL: 34041,
        RENDERBUFFER_WIDTH: 36162,
        RENDERBUFFER_HEIGHT: 36163,
        RENDERBUFFER_INTERNAL_FORMAT: 36164,
        RENDERBUFFER_RED_SIZE: 36176,
        RENDERBUFFER_GREEN_SIZE: 36177,
        RENDERBUFFER_BLUE_SIZE: 36178,
        RENDERBUFFER_ALPHA_SIZE: 36179,
        RENDERBUFFER_DEPTH_SIZE: 36180,
        RENDERBUFFER_STENCIL_SIZE: 36181,
        FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
        FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
        COLOR_ATTACHMENT0: 36064,
        DEPTH_ATTACHMENT: 36096,
        STENCIL_ATTACHMENT: 36128,
        DEPTH_STENCIL_ATTACHMENT: 33306,
        NONE: 0,
        FRAMEBUFFER_COMPLETE: 36053,
        FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
        FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
        FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
        FRAMEBUFFER_UNSUPPORTED: 36061,
        FRAMEBUFFER_BINDING: 36006,
        RENDERBUFFER_BINDING: 36007,
        MAX_RENDERBUFFER_SIZE: 34024,
        INVALID_FRAMEBUFFER_OPERATION: 1286,
        UNPACK_FLIP_Y_WEBGL: 37440,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
        UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
        READ_BUFFER: 3074,
        UNPACK_ROW_LENGTH: 3314,
        UNPACK_SKIP_ROWS: 3315,
        UNPACK_SKIP_PIXELS: 3316,
        PACK_ROW_LENGTH: 3330,
        PACK_SKIP_ROWS: 3331,
        PACK_SKIP_PIXELS: 3332,
        UNPACK_SKIP_IMAGES: 32877,
        UNPACK_IMAGE_HEIGHT: 32878,
        MAX_3D_TEXTURE_SIZE: 32883,
        MAX_ELEMENTS_VERTICES: 33e3,
        MAX_ELEMENTS_INDICES: 33001,
        MAX_TEXTURE_LOD_BIAS: 34045,
        MAX_FRAGMENT_UNIFORM_COMPONENTS: 35657,
        MAX_VERTEX_UNIFORM_COMPONENTS: 35658,
        MAX_ARRAY_TEXTURE_LAYERS: 35071,
        MIN_PROGRAM_TEXEL_OFFSET: 35076,
        MAX_PROGRAM_TEXEL_OFFSET: 35077,
        MAX_VARYING_COMPONENTS: 35659,
        FRAGMENT_SHADER_DERIVATIVE_HINT: 35723,
        RASTERIZER_DISCARD: 35977,
        VERTEX_ARRAY_BINDING: 34229,
        MAX_VERTEX_OUTPUT_COMPONENTS: 37154,
        MAX_FRAGMENT_INPUT_COMPONENTS: 37157,
        MAX_SERVER_WAIT_TIMEOUT: 37137,
        MAX_ELEMENT_INDEX: 36203,
        RED: 6403,
        RGB8: 32849,
        RGBA8: 32856,
        RGB10_A2: 32857,
        TEXTURE_3D: 32879,
        TEXTURE_WRAP_R: 32882,
        TEXTURE_MIN_LOD: 33082,
        TEXTURE_MAX_LOD: 33083,
        TEXTURE_BASE_LEVEL: 33084,
        TEXTURE_MAX_LEVEL: 33085,
        TEXTURE_COMPARE_MODE: 34892,
        TEXTURE_COMPARE_FUNC: 34893,
        SRGB: 35904,
        SRGB8: 35905,
        SRGB8_ALPHA8: 35907,
        COMPARE_REF_TO_TEXTURE: 34894,
        RGBA32F: 34836,
        RGB32F: 34837,
        RGBA16F: 34842,
        RGB16F: 34843,
        TEXTURE_2D_ARRAY: 35866,
        TEXTURE_BINDING_2D_ARRAY: 35869,
        R11F_G11F_B10F: 35898,
        RGB9_E5: 35901,
        RGBA32UI: 36208,
        RGB32UI: 36209,
        RGBA16UI: 36214,
        RGB16UI: 36215,
        RGBA8UI: 36220,
        RGB8UI: 36221,
        RGBA32I: 36226,
        RGB32I: 36227,
        RGBA16I: 36232,
        RGB16I: 36233,
        RGBA8I: 36238,
        RGB8I: 36239,
        RED_INTEGER: 36244,
        RGB_INTEGER: 36248,
        RGBA_INTEGER: 36249,
        R8: 33321,
        RG8: 33323,
        R16F: 33325,
        R32F: 33326,
        RG16F: 33327,
        RG32F: 33328,
        R8I: 33329,
        R8UI: 33330,
        R16I: 33331,
        R16UI: 33332,
        R32I: 33333,
        R32UI: 33334,
        RG8I: 33335,
        RG8UI: 33336,
        RG16I: 33337,
        RG16UI: 33338,
        RG32I: 33339,
        RG32UI: 33340,
        R8_SNORM: 36756,
        RG8_SNORM: 36757,
        RGB8_SNORM: 36758,
        RGBA8_SNORM: 36759,
        RGB10_A2UI: 36975,
        TEXTURE_IMMUTABLE_FORMAT: 37167,
        TEXTURE_IMMUTABLE_LEVELS: 33503,
        UNSIGNED_INT_2_10_10_10_REV: 33640,
        UNSIGNED_INT_10F_11F_11F_REV: 35899,
        UNSIGNED_INT_5_9_9_9_REV: 35902,
        FLOAT_32_UNSIGNED_INT_24_8_REV: 36269,
        UNSIGNED_INT_24_8: 34042,
        HALF_FLOAT: 5131,
        RG: 33319,
        RG_INTEGER: 33320,
        INT_2_10_10_10_REV: 36255,
        CURRENT_QUERY: 34917,
        QUERY_RESULT: 34918,
        QUERY_RESULT_AVAILABLE: 34919,
        ANY_SAMPLES_PASSED: 35887,
        ANY_SAMPLES_PASSED_CONSERVATIVE: 36202,
        MAX_DRAW_BUFFERS: 34852,
        DRAW_BUFFER0: 34853,
        DRAW_BUFFER1: 34854,
        DRAW_BUFFER2: 34855,
        DRAW_BUFFER3: 34856,
        DRAW_BUFFER4: 34857,
        DRAW_BUFFER5: 34858,
        DRAW_BUFFER6: 34859,
        DRAW_BUFFER7: 34860,
        DRAW_BUFFER8: 34861,
        DRAW_BUFFER9: 34862,
        DRAW_BUFFER10: 34863,
        DRAW_BUFFER11: 34864,
        DRAW_BUFFER12: 34865,
        DRAW_BUFFER13: 34866,
        DRAW_BUFFER14: 34867,
        DRAW_BUFFER15: 34868,
        MAX_COLOR_ATTACHMENTS: 36063,
        COLOR_ATTACHMENT1: 36065,
        COLOR_ATTACHMENT2: 36066,
        COLOR_ATTACHMENT3: 36067,
        COLOR_ATTACHMENT4: 36068,
        COLOR_ATTACHMENT5: 36069,
        COLOR_ATTACHMENT6: 36070,
        COLOR_ATTACHMENT7: 36071,
        COLOR_ATTACHMENT8: 36072,
        COLOR_ATTACHMENT9: 36073,
        COLOR_ATTACHMENT10: 36074,
        COLOR_ATTACHMENT11: 36075,
        COLOR_ATTACHMENT12: 36076,
        COLOR_ATTACHMENT13: 36077,
        COLOR_ATTACHMENT14: 36078,
        COLOR_ATTACHMENT15: 36079,
        SAMPLER_3D: 35679,
        SAMPLER_2D_SHADOW: 35682,
        SAMPLER_2D_ARRAY: 36289,
        SAMPLER_2D_ARRAY_SHADOW: 36292,
        SAMPLER_CUBE_SHADOW: 36293,
        INT_SAMPLER_2D: 36298,
        INT_SAMPLER_3D: 36299,
        INT_SAMPLER_CUBE: 36300,
        INT_SAMPLER_2D_ARRAY: 36303,
        UNSIGNED_INT_SAMPLER_2D: 36306,
        UNSIGNED_INT_SAMPLER_3D: 36307,
        UNSIGNED_INT_SAMPLER_CUBE: 36308,
        UNSIGNED_INT_SAMPLER_2D_ARRAY: 36311,
        MAX_SAMPLES: 36183,
        SAMPLER_BINDING: 35097,
        PIXEL_PACK_BUFFER: 35051,
        PIXEL_UNPACK_BUFFER: 35052,
        PIXEL_PACK_BUFFER_BINDING: 35053,
        PIXEL_UNPACK_BUFFER_BINDING: 35055,
        COPY_READ_BUFFER: 36662,
        COPY_WRITE_BUFFER: 36663,
        COPY_READ_BUFFER_BINDING: 36662,
        COPY_WRITE_BUFFER_BINDING: 36663,
        FLOAT_MAT2x3: 35685,
        FLOAT_MAT2x4: 35686,
        FLOAT_MAT3x2: 35687,
        FLOAT_MAT3x4: 35688,
        FLOAT_MAT4x2: 35689,
        FLOAT_MAT4x3: 35690,
        UNSIGNED_INT_VEC2: 36294,
        UNSIGNED_INT_VEC3: 36295,
        UNSIGNED_INT_VEC4: 36296,
        UNSIGNED_NORMALIZED: 35863,
        SIGNED_NORMALIZED: 36764,
        VERTEX_ATTRIB_ARRAY_INTEGER: 35069,
        VERTEX_ATTRIB_ARRAY_DIVISOR: 35070,
        TRANSFORM_FEEDBACK_BUFFER_MODE: 35967,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 35968,
        TRANSFORM_FEEDBACK_VARYINGS: 35971,
        TRANSFORM_FEEDBACK_BUFFER_START: 35972,
        TRANSFORM_FEEDBACK_BUFFER_SIZE: 35973,
        TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 35976,
        MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 35978,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 35979,
        INTERLEAVED_ATTRIBS: 35980,
        SEPARATE_ATTRIBS: 35981,
        TRANSFORM_FEEDBACK_BUFFER: 35982,
        TRANSFORM_FEEDBACK_BUFFER_BINDING: 35983,
        TRANSFORM_FEEDBACK: 36386,
        TRANSFORM_FEEDBACK_PAUSED: 36387,
        TRANSFORM_FEEDBACK_ACTIVE: 36388,
        TRANSFORM_FEEDBACK_BINDING: 36389,
        FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 33296,
        FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 33297,
        FRAMEBUFFER_ATTACHMENT_RED_SIZE: 33298,
        FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 33299,
        FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 33300,
        FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 33301,
        FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 33302,
        FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 33303,
        FRAMEBUFFER_DEFAULT: 33304,
        DEPTH24_STENCIL8: 35056,
        DRAW_FRAMEBUFFER_BINDING: 36006,
        READ_FRAMEBUFFER_BINDING: 36010,
        RENDERBUFFER_SAMPLES: 36011,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 36052,
        FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 36182,
        UNIFORM_BUFFER: 35345,
        UNIFORM_BUFFER_BINDING: 35368,
        UNIFORM_BUFFER_START: 35369,
        UNIFORM_BUFFER_SIZE: 35370,
        MAX_VERTEX_UNIFORM_BLOCKS: 35371,
        MAX_FRAGMENT_UNIFORM_BLOCKS: 35373,
        MAX_COMBINED_UNIFORM_BLOCKS: 35374,
        MAX_UNIFORM_BUFFER_BINDINGS: 35375,
        MAX_UNIFORM_BLOCK_SIZE: 35376,
        MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 35377,
        MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 35379,
        UNIFORM_BUFFER_OFFSET_ALIGNMENT: 35380,
        ACTIVE_UNIFORM_BLOCKS: 35382,
        UNIFORM_TYPE: 35383,
        UNIFORM_SIZE: 35384,
        UNIFORM_BLOCK_INDEX: 35386,
        UNIFORM_OFFSET: 35387,
        UNIFORM_ARRAY_STRIDE: 35388,
        UNIFORM_MATRIX_STRIDE: 35389,
        UNIFORM_IS_ROW_MAJOR: 35390,
        UNIFORM_BLOCK_BINDING: 35391,
        UNIFORM_BLOCK_DATA_SIZE: 35392,
        UNIFORM_BLOCK_ACTIVE_UNIFORMS: 35394,
        UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 35395,
        UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 35396,
        UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 35398,
        OBJECT_TYPE: 37138,
        SYNC_CONDITION: 37139,
        SYNC_STATUS: 37140,
        SYNC_FLAGS: 37141,
        SYNC_FENCE: 37142,
        SYNC_GPU_COMMANDS_COMPLETE: 37143,
        UNSIGNALED: 37144,
        SIGNALED: 37145,
        ALREADY_SIGNALED: 37146,
        TIMEOUT_EXPIRED: 37147,
        CONDITION_SATISFIED: 37148,
        WAIT_FAILED: 37149,
        SYNC_FLUSH_COMMANDS_BIT: 1,
        COLOR: 6144,
        DEPTH: 6145,
        STENCIL: 6146,
        MIN: 32775,
        MAX: 32776,
        DEPTH_COMPONENT24: 33190,
        STREAM_READ: 35041,
        STREAM_COPY: 35042,
        STATIC_READ: 35045,
        STATIC_COPY: 35046,
        DYNAMIC_READ: 35049,
        DYNAMIC_COPY: 35050,
        DEPTH_COMPONENT32F: 36012,
        DEPTH32F_STENCIL8: 36013,
        INVALID_INDEX: 4294967295,
        TIMEOUT_IGNORED: -1,
        MAX_CLIENT_WAIT_TIMEOUT_WEBGL: 37447,
        VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 35070,
        UNMASKED_VENDOR_WEBGL: 37445,
        UNMASKED_RENDERER_WEBGL: 37446,
        MAX_TEXTURE_MAX_ANISOTROPY_EXT: 34047,
        TEXTURE_MAX_ANISOTROPY_EXT: 34046,
        COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
        COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
        COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
        COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
        COMPRESSED_R11_EAC: 37488,
        COMPRESSED_SIGNED_R11_EAC: 37489,
        COMPRESSED_RG11_EAC: 37490,
        COMPRESSED_SIGNED_RG11_EAC: 37491,
        COMPRESSED_RGB8_ETC2: 37492,
        COMPRESSED_RGBA8_ETC2_EAC: 37493,
        COMPRESSED_SRGB8_ETC2: 37494,
        COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 37495,
        COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37496,
        COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37497,
        COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840,
        COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842,
        COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841,
        COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843,
        COMPRESSED_RGB_ETC1_WEBGL: 36196,
        COMPRESSED_RGB_ATC_WEBGL: 35986,
        COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 35986,
        COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 34798,
        UNSIGNED_INT_24_8_WEBGL: 34042,
        HALF_FLOAT_OES: 36193,
        RGBA32F_EXT: 34836,
        RGB32F_EXT: 34837,
        FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 33297,
        UNSIGNED_NORMALIZED_EXT: 35863,
        MIN_EXT: 32775,
        MAX_EXT: 32776,
        SRGB_EXT: 35904,
        SRGB_ALPHA_EXT: 35906,
        SRGB8_ALPHA8_EXT: 35907,
        FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 33296,
        FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 35723,
        COLOR_ATTACHMENT0_WEBGL: 36064,
        COLOR_ATTACHMENT1_WEBGL: 36065,
        COLOR_ATTACHMENT2_WEBGL: 36066,
        COLOR_ATTACHMENT3_WEBGL: 36067,
        COLOR_ATTACHMENT4_WEBGL: 36068,
        COLOR_ATTACHMENT5_WEBGL: 36069,
        COLOR_ATTACHMENT6_WEBGL: 36070,
        COLOR_ATTACHMENT7_WEBGL: 36071,
        COLOR_ATTACHMENT8_WEBGL: 36072,
        COLOR_ATTACHMENT9_WEBGL: 36073,
        COLOR_ATTACHMENT10_WEBGL: 36074,
        COLOR_ATTACHMENT11_WEBGL: 36075,
        COLOR_ATTACHMENT12_WEBGL: 36076,
        COLOR_ATTACHMENT13_WEBGL: 36077,
        COLOR_ATTACHMENT14_WEBGL: 36078,
        COLOR_ATTACHMENT15_WEBGL: 36079,
        DRAW_BUFFER0_WEBGL: 34853,
        DRAW_BUFFER1_WEBGL: 34854,
        DRAW_BUFFER2_WEBGL: 34855,
        DRAW_BUFFER3_WEBGL: 34856,
        DRAW_BUFFER4_WEBGL: 34857,
        DRAW_BUFFER5_WEBGL: 34858,
        DRAW_BUFFER6_WEBGL: 34859,
        DRAW_BUFFER7_WEBGL: 34860,
        DRAW_BUFFER8_WEBGL: 34861,
        DRAW_BUFFER9_WEBGL: 34862,
        DRAW_BUFFER10_WEBGL: 34863,
        DRAW_BUFFER11_WEBGL: 34864,
        DRAW_BUFFER12_WEBGL: 34865,
        DRAW_BUFFER13_WEBGL: 34866,
        DRAW_BUFFER14_WEBGL: 34867,
        DRAW_BUFFER15_WEBGL: 34868,
        MAX_COLOR_ATTACHMENTS_WEBGL: 36063,
        MAX_DRAW_BUFFERS_WEBGL: 34852,
        VERTEX_ARRAY_BINDING_OES: 34229,
        QUERY_COUNTER_BITS_EXT: 34916,
        CURRENT_QUERY_EXT: 34917,
        QUERY_RESULT_EXT: 34918,
        QUERY_RESULT_AVAILABLE_EXT: 34919,
        TIME_ELAPSED_EXT: 35007,
        TIMESTAMP_EXT: 36392,
        GPU_DISJOINT_EXT: 36795
    }), Hf(Wf.prototype, {
        bufferData: function() {
            var e;
            return this.T(), (e = this._).bufferData.apply(e, arguments);
        },
        bufferSubData: function() {
            var e;
            return this.T(), (e = this._).bufferSubData.apply(e, arguments);
        },
        createBuffer: function() {
            return this._.createBuffer();
        },
        deleteBuffer: function(e) {
            var t = this.states;
            t.arrayBuffer === e ? t.arrayBuffer = null : t.elementArrayBuffer === e && (t.elementArrayBuffer = null);
            var n = t.attributes;
            for (var r in n) n[r].buffer === e && (n[r].buffer = null);
            return this._.deleteBuffer(e);
        },
        getBufferParameter: function(e, t) {
            return this.T(), this._.getBufferParameter(e, t);
        },
        isBuffer: function(e) {
            return this._.isBuffer(e);
        }
    }), Hf(Wf.prototype, {
        checkFramebufferStatus: function(e) {
            return this._.checkFramebufferStatus(e);
        },
        createFramebuffer: function() {
            return this._.createFramebuffer();
        },
        deleteFramebuffer: function(e) {
            var t = this.states.framebuffer;
            for (var n in t) t[n] === e && (t[n] = null);
            return this._.deleteFramebuffer(e);
        },
        framebufferRenderbuffer: function(e, t, n, r) {
            return this.T(), this._.framebufferRenderbuffer(e, t, n, r);
        },
        framebufferTexture2D: function(e, t, n, r, i) {
            return this.T(), this._.framebufferTexture2D(e, t, n, r, i);
        },
        getFramebufferAttachmentParameter: function(e, t, n) {
            return this.T(), this._.getFramebufferAttachmentParameter(e, t, n);
        },
        isFramebuffer: function(e) {
            return this._.isFramebuffer(e);
        },
        readPixels: function(e, t, n, r, i, a, o) {
            return this.T(), this._.readPixels(e, t, n, r, i, a, o);
        }
    }), Hf(Wf.prototype, {
        createRenderbuffer: function() {
            return this._.createRenderbuffer();
        },
        deleteRenderbuffer: function(e) {
            var t = this.states.renderbuffer;
            for (var n in t) t[n] === e && (t[n] = null);
            return this._.deleteRenderbuffer(e);
        },
        getRenderbufferParameter: function(e, t) {
            return this.T(), this._.getRenderbufferParameter(e, t);
        },
        isRenderbuffer: function(e) {
            return this._.isRenderbuffer(e);
        },
        renderbufferStorage: function(e, t, n, r) {
            return this.T(), this._.renderbufferStorage(e, t, n, r);
        }
    }), Hf(Wf.prototype, {
        scissor: function(e, t, n, r) {
            this.T();
            var i = this.states.scissor;
            i[0] === e && i[1] === t && i[2] === n && i[3] === r || (i[0] = e, i[1] = t, i[2] = n, 
            i[3] = r, this._.scissor(e, t, n, r));
        },
        viewport: function(e, t, n, r) {
            this.T();
            var i = this.states.viewport;
            i[0] === e && i[1] === t && i[2] === n && i[3] === r || (i[0] = e, i[1] = t, i[2] = n, 
            i[3] = r, this._.viewport(e, t, n, r));
        },
        blendColor: function(e, t, n, r) {
            this.T();
            var i = this.states.blendColor;
            i[0] === e && i[1] === t && i[2] === n && i[3] === r || (i[0] = e, i[1] = t, i[2] = n, 
            i[3] = r, this._.blendColor(e, t, n, r));
        },
        blendEquation: function(e) {
            this.T();
            var t = this.states.blendEquationSeparate;
            t[0] === e && t[1] === e || (t[0] = e, t[1] = e, this._.blendEquation(e));
        },
        blendEquationSeparate: function(e, t) {
            this.T();
            var n = this.states.blendEquationSeparate;
            n[0] === e && n[1] === t || (n[0] = e, n[1] = t, this._.blendEquationSeparate(e, t));
        },
        blendFunc: function(e, t) {
            this.T();
            var n = this.states.blendFuncSeparate;
            n[0] === e && n[2] === e && n[1] === t && n[3] === t || (n[0] = e, n[1] = t, n[2] = e, 
            n[3] = t, this._.blendFunc(e, t));
        },
        blendFuncSeparate: function(e, t, n, r) {
            this.T();
            var i = this.states.blendFuncSeparate;
            i[0] === e && i[1] === t && i[2] === n && i[3] === r || (i[0] = e, i[1] = t, i[2] = n, 
            i[3] = r, this._.blendFuncSeparate(e, t, n, r));
        },
        clearColor: function(e, t, n, r) {
            this.T();
            var i = this.states.clearColor;
            i[0] === e && i[1] === t && i[2] === n && i[3] === r || (i[0] = e, i[1] = t, i[2] = n, 
            i[3] = r, this._.clearColor(e, t, n, r));
        },
        clearDepth: function(e) {
            this.T();
            var t = this.states.clearDepth;
            t[0] !== e && (t[0] = e, this._.clearDepth(e));
        },
        clearStencil: function(e) {
            this.T();
            var t = this.states.clearStencil;
            t[0] !== e && (t[0] = e, this._.clearStencil(e));
        },
        colorMask: function(e, t, n, r) {
            this.T();
            var i = this.states.colorMask;
            i[0] === e && i[1] === t && i[2] === n && i[3] === r || (i[0] = e, i[1] = t, i[2] = n, 
            i[3] = r, this._.colorMask(e, t, n, r));
        },
        cullFace: function(e) {
            this.T();
            var t = this.states.cullFace;
            t[0] !== e && (t[0] = e, this._.cullFace(e));
        },
        depthFunc: function(e) {
            this.T();
            var t = this.states.depthFunc;
            t[0] !== e && (t[0] = e, this._.depthFunc(e));
        },
        depthMask: function(e) {
            this.T();
            var t = this.states.depthMask;
            t[0] !== e && (t[0] = e, this._.depthMask(e));
        },
        depthRange: function(e, t) {
            this.T();
            var n = this.states.depthRange;
            n[0] === e && n[1] === t || (n[0] = e, n[1] = t, this._.depthRange(e, t));
        },
        disable: function(e) {
            this.T();
            var t = this.states.capabilities;
            t[e] && (t[e] = !1, this._.disable(e));
        },
        enable: function(e) {
            this.T();
            var t = this.states.capabilities;
            t[e] || (t[e] = !0, this._.enable(e));
        },
        frontFace: function(e) {
            this.T();
            var t = this.states.frontFace;
            t[0] !== e && (t[0] = e, this._.frontFace(e));
        },
        hint: function(e, t) {
            this.T();
            var n = this.states.hint;
            n[e][0] !== t && (n[e][0] = t, this._.hint(e, t));
        },
        lineWidth: function(e) {
            this.T();
            var t = this.states.lineWidth;
            t[0] !== e && (t[0] = e, this._.lineWidth(e));
        },
        pixelStorei: function(e, t) {
            this.T();
            var n = this.states.pixelStorei;
            n[e] !== t && (n[e] && (n[e][0] = t), this._.pixelStorei(e, t));
        },
        polygonOffset: function(e, t) {
            this.T();
            var n = this.states.polygonOffset;
            n[0] === e && n[1] === t || (n[0] = e, n[1] = t, this._.polygonOffset(e, t));
        },
        sampleCoverage: function(e, t) {
            this.T();
            var n = this.states.sampleCoverage;
            n[0] === e && n[1] === t || (n[0] = e, n[1] = t, this._.sampleCoverage(e, t));
        },
        stencilFunc: function(e, t, n) {
            this.T();
            var r = this.states.stencilFuncSeparate, i = this._;
            r[i.FRONT][0] === e && r[i.FRONT][1] === t && r[i.FRONT][2] === n && r[i.BACK][0] === e && r[i.BACK][1] === t && r[i.BACK][2] === n || (r[i.FRONT][0] = r[i.BACK][0] = e, 
            r[i.FRONT][1] = r[i.BACK][1] = t, r[i.FRONT][2] = r[i.BACK][2] = n, this._.stencilFunc(e, t, n));
        },
        stencilFuncSeparate: function(e, t, n, r) {
            if (this.T(), e !== this._.FRONT_AND_BACK) {
                var i = this.states.stencilFuncSeparate;
                i[e][0] === t && i[e][1] === n && i[e][2] === r || (i[e][0] = t, i[e][1] = n, i[e][2] = r, 
                this._.stencilFuncSeparate(e, t, n, r));
            } else this.stencilFunc(t, n, r);
        },
        stencilMask: function(e) {
            this.T();
            var t = this._, n = this.states.stencilMaskSeparate;
            n[t.FRONT][0] === e && n[t.BACK][0] === e || (n[t.FRONT][0] = e, n[t.BACK][0] = e, 
            this._.stencilMask(e));
        },
        stencilMaskSeparate: function(e, t) {
            if (this.T(), e !== this._.FRONT_AND_BACK) {
                var n = this.states.stencilMaskSeparate;
                n[e][0] !== t && (n[e][0] = t, this._.stencilMaskSeparate(e, t));
            } else this.stencilMask(t);
        },
        stencilOp: function(e, t, n) {
            this.T();
            var r = this.states.stencilOpSeparate, i = this._;
            r[i.FRONT][0] === e && r[i.FRONT][1] === t && r[i.FRONT][2] === n && r[i.BACK][0] === e && r[i.BACK][1] === t && r[i.BACK][2] === n || (r[i.FRONT][0] = r[i.BACK][0] = e, 
            r[i.FRONT][1] = r[i.BACK][1] = t, r[i.FRONT][2] = r[i.BACK][2] = n, this._.stencilOp(e, t, n));
        },
        stencilOpSeparate: function(e, t, n, r) {
            if (this.T(), e !== this._.FRONT_AND_BACK) {
                var i = this.states.stencilOpSeparate;
                i[e][0] === t && i[e][1] === n && i[e][2] === r || (i[e][0] = t, i[e][1] = n, i[e][2] = r, 
                this._.stencilOpSeparate(e, t, n, r));
            } else this.stencilOp(t, n, r);
        },
        bindFramebuffer: function(e, t) {
            this.T();
            var n = this.states.framebuffer;
            n[e] !== t && (n[e] = t, this._.bindFramebuffer(e, t));
        },
        bindRenderbuffer: function(e, t) {
            this.T();
            var n = this.states.renderbuffer;
            n[e] !== t && (n[e] = t, this._.bindRenderbuffer(e, t));
        },
        bindTexture: function(e, t) {
            this.T();
            var n = this.states.textures, r = -1 !== n.active ? n.active - 33984 : -1;
            n.units[r][e] = t, this._.bindTexture(e, t);
        },
        activeTexture: function(e) {
            this.T();
            var t = this._, n = this.states.textures, r = n.active;
            n.active = e, t.activeTexture(e), -1 === r && (n.units[e - 33984][t.TEXTURE_2D] = n.units[-1][t.TEXTURE_2D], 
            n.units[e - 33984][t.TEXTURE_CUBE_MAP] = n.units[-1][t.TEXTURE_CUBE_MAP], n.units[-1][t.TEXTURE_2D] = null, 
            n.units[-1][t.TEXTURE_CUBE_MAP] = null);
        },
        useProgram: function(e) {
            this.T();
            var t = this.states;
            t.program !== e && (t.program = e, this._.useProgram(e));
        },
        bindBuffer: function(e, t) {
            this.T();
            var n = this._, r = this.states;
            if (e === n.ELEMENT_ARRAY_BUFFER) {
                if (r.elementArrayBuffer === t) return;
                r.elementArrayBuffer = t;
            } else {
                if (r.arrayBuffer === t) return;
                r.arrayBuffer = t;
            }
            n.bindBuffer(e, t);
        },
        bindVertexArray: function(e) {
            this.T();
            var t = this._, n = this.states;
            n.vao !== e && (n.vao = e), t.bindVertexArray(e);
        },
        vertexAttribPointer: function(e, t, n, r, i, a) {
            this.T();
            var o = [ e, t, n, r, i, a ];
            this.states.attributes[e] || (this.states.attributes[e] = {
                enable: !0
            });
            var s = this.states.attributes[e];
            return s.buffer = this.states.arrayBuffer, s.args = o, this._.vertexAttribPointer(e, t, n, r, i, a);
        },
        vertexAttribDivisor: function(e, t) {
            return this.T(), this.states.attributes[e].divisor = t, this._.vertexAttribDivisor(e, t);
        }
    }, {
        T: function() {
            var e = this._;
            if (e.N && e.N !== this) {
                var t = e.N;
                this.i(t.states), e.N = this;
            }
            e.N = this;
        },
        i: function(e) {
            var t = this.states, n = this._;
            for (var r in t) if ("capabilities" !== r && "textures" !== r && "attributes" !== r && "arrayBuffer" !== r && "elementArrayBuffer" !== r) if ("program" === r) t.program !== e.program && n.useProgram(t.program); else if ("framebuffer" === r) for (var i in t[r]) t[r][i] !== e[r][i] && n.bindFramebuffer(+i, t[r][i]); else if ("renderbuffer" === r) for (var a in t[r]) t[r][a] !== e[r][a] && n.bindRenderbuffer(+a, t[r][a]); else if (!Rf(t[r], e[r])) if (Array.isArray(e[r])) n[r].apply(n, t[r]); else for (var o in t[r]) Rf(t[r][o], e[r][o]) || n[r].apply(n, [ +o ].concat(t[r][o]));
            for (var s in t.capabilities) t.capabilities[s] !== e.capabilities[s] && n[t.capabilities[s] ? "enable" : "disable"](+s);
            for (var u = t.textures, f = e.textures, c = u.units, l = f.units, h = u.active - n.TEXTURE0, d = 0; d < c.length; d++) d === h || c[d][n.TEXTURE_2D] === l[d][n.TEXTURE_2D] && c[d][n.TEXTURE_CUBE_MAP] === l[d][n.TEXTURE_CUBE_MAP] || (n.activeTexture(n.TEXTURE0 + d), 
            n.bindTexture(n.TEXTURE_2D, c[d][n.TEXTURE_2D]), n.bindTexture(n.TEXTURE_CUBE_MAP, c[d][n.TEXTURE_CUBE_MAP]));
            if (-1 < u.active) {
                var v = c[h];
                v[n.TEXTURE_2D] === l[h][n.TEXTURE_2D] && v[n.TEXTURE_CUBE_MAP] === l[h][n.TEXTURE_CUBE_MAP] || (n.activeTexture(u.active), 
                n.bindTexture(n.TEXTURE_2D, v[n.TEXTURE_2D]), n.bindTexture(n.TEXTURE_CUBE_MAP, v[n.TEXTURE_CUBE_MAP]));
            }
            var p = t.attributes, m = e.attributes;
            for (var _ in p) m[_] && p[_].buffer === m[_].buffer && Rf(p[_].args, m[_].args) || p[_].buffer && (n.bindBuffer(n.ARRAY_BUFFER, p[_].buffer), 
            n.vertexAttribPointer.apply(n, p[_].args), void 0 !== p[_].divisor && n.vertexAttribDivisor(+_, p[_].divisor), 
            p[_].enable ? n.enableVertexAttribArray(p[_].args[0]) : n.disableVertexAttribArray(p[_].args[0]));
            n.bindBuffer(n.ARRAY_BUFFER, t.arrayBuffer), n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, t.elementArrayBuffer);
            var g = t.vao;
            g !== e.vao && (g ? n.bindVertexArray(g) : n.bindVertexArray(null));
        }
    }), Hf(Wf.prototype, {
        compressedTexImage2D: function(e, t, n, r, i, a, o) {
            return this.T(), this._.compressedTexImage2D(e, t, n, r, i, a, o);
        },
        copyTexImage2D: function(e, t, n, r, i, a, o, s) {
            return this.T(), this._.copyTexImage2D(e, t, n, r, i, a, o, s);
        },
        copyTexSubImage2D: function(e, t, n, r, i, a, o, s) {
            return this.T(), this._.copyTexSubImage2D(e, t, n, r, i, a, o, s);
        },
        createTexture: function() {
            return this._.createTexture();
        },
        deleteTexture: function(e) {
            for (var t = this.states.textures.units, n = 0; n < t.length; n++) for (var r in t[n]) t[n][r] === e && (t[n][r] = null);
            return this._.deleteTexture(e);
        },
        generateMipmap: function(e) {
            return this.T(), this._.generateMipmap(e);
        },
        getTexParameter: function(e, t) {
            return this.T(), this._.getTexParameter(e, t);
        },
        isTexture: function(e) {
            return this._.isTexture(e);
        },
        texImage2D: function() {
            var e;
            return this.T(), (e = this._).texImage2D.apply(e, arguments);
        },
        texSubImage2D: function(e) {
            var t;
            return this.T(), (t = this._).texSubImage2D.apply(t, e);
        },
        texParameterf: function(e, t, n) {
            return this.T(), this._.texParameterf(e, t, n);
        },
        texParameteri: function(e, t, n) {
            return this.T(), this._.texParameteri(e, t, n);
        }
    }), Hf(Wf.prototype, {
        bindAttribLocation: function(e, t, n) {
            return this._.bindAttribLocation(e, t, n);
        },
        enableVertexAttribArray: function(e) {
            return this.T(), this.states.attributes[e] || (this.states.attributes[e] = {}), 
            this.states.attributes[e].enable = !0, this._.enableVertexAttribArray(e);
        },
        disableVertexAttribArray: function(e) {
            return this.T(), this.states.attributes[e] || (this.states.attributes[e] = {}), 
            this.states.attributes[e].enable = !1, this._.disableVertexAttribArray(e);
        },
        getActiveAttrib: function(e, t) {
            return this._.getActiveAttrib(e, t);
        },
        getActiveUniform: function(e, t) {
            return this._.getActiveUniform(e, t);
        },
        getAttribLocation: function(e, t) {
            return this._.getAttribLocation(e, t);
        },
        getUniformLocation: function(e, t) {
            return this._.getUniformLocation(e, t);
        },
        getVertexAttrib: function(e, t) {
            return this.T(), this._.getVertexAttrib(e, t);
        },
        getVertexAttribOffset: function(e, t) {
            return this.T(), this._.getVertexAttribOffset(e, t);
        },
        uniformMatrix2fv: function(e, t, n) {
            return this.T(), this._.uniformMatrix2fv(e, t, n);
        },
        uniformMatrix3fv: function(e, t, n) {
            return this.T(), this._.uniformMatrix3fv(e, t, n);
        },
        uniformMatrix4fv: function(e, t, n) {
            return this.T(), this._.uniformMatrix4fv(e, t, n);
        },
        uniform1f: function(e, t) {
            return this.T(), this._.uniform1f(e, t);
        },
        uniform1fv: function(e, t) {
            return this.T(), this._.uniform1fv(e, t);
        },
        uniform1i: function(e, t) {
            return this.T(), this._.uniform1i(e, t);
        },
        uniform1iv: function(e, t) {
            return this.T(), this._.uniform1iv(e, t);
        },
        uniform2f: function(e, t, n) {
            return this.T(), this._.uniform2f(e, t, n);
        },
        uniform2fv: function(e, t) {
            return this.T(), this._.uniform2fv(e, t);
        },
        uniform2i: function(e, t, n) {
            return this.T(), this._.uniform2i(e, t, n);
        },
        uniform2iv: function(e, t) {
            return this.T(), this._.uniform2iv(e, t);
        },
        uniform3f: function(e, t, n, r) {
            return this.T(), this._.uniform3f(e, t, n, r);
        },
        uniform3fv: function(e, t) {
            return this.T(), this._.uniform3fv(e, t);
        },
        uniform3i: function(e, t, n, r) {
            return this.T(), this._.uniform3i(e, t, n, r);
        },
        uniform3iv: function(e, t) {
            return this.T(), this._.uniform3iv(e, t);
        },
        uniform4f: function(e, t, n, r, i) {
            return this.T(), this._.uniform4f(e, t, n, r, i);
        },
        uniform4fv: function(e, t) {
            return this.T(), this._.uniform4fv(e, t);
        },
        uniform4i: function(e, t, n, r, i) {
            return this.T(), this._.uniform4i(e, t, n, r, i);
        },
        uniform4iv: function(e, t) {
            return this.T(), this._.uniform4iv(e, t);
        },
        vertexAttrib1f: function(e, t) {
            return this.T(), this._.vertexAttrib1f(e, t);
        },
        vertexAttrib2f: function(e, t, n) {
            return this.T(), this._.vertexAttrib2f(e, t, n);
        },
        vertexAttrib3f: function(e, t, n, r) {
            return this.T(), this._.vertexAttrib3f(e, t, n, r);
        },
        vertexAttrib4f: function(e, t, n, r, i) {
            return this.T(), this._.vertexAttrib4f(e, t, n, r, i);
        },
        vertexAttrib1fv: function(e, t) {
            return this.T(), this._.vertexAttrib1fv(e, t);
        },
        vertexAttrib2fv: function(e, t) {
            return this.T(), this._.vertexAttrib2fv(e, t);
        },
        vertexAttrib3fv: function(e, t) {
            return this.T(), this._.vertexAttrib3fv(e, t);
        },
        vertexAttrib4fv: function(e, t) {
            return this.T(), this._.vertexAttrib4fv(e, t);
        }
    }), Hf(Wf.prototype, {
        createVertexArray: function() {
            return this._.createVertexArray();
        },
        deleteVertexArray: function(e) {
            var t = this.states;
            return t.vao === e && (t.vao = null), this._.deleteVertexArray(e);
        },
        isVertexArray: function(e) {
            return this._.isVertexArray(e);
        }
    }), Hf(Wf.prototype, {
        drawArraysInstanced: function(e, t, n, r) {
            return this.T(), this._.drawArraysInstanced(e, t, n, r);
        },
        drawElementsInstanced: function(e, t, n, r, i) {
            return this.T(), this._.drawElementsInstanced(e, t, n, r, i);
        }
    });
    var Yf = [];
    function Qf(e, t) {
        var n = t._get2DExtent(t.getGLZoom()), r = n.getWidth(), i = n.getHeight(), a = e;
        return ms(a), gs(a, a, t.cameraLookAt), xs(a, a, Cs(Yf, r, i, 1)), a;
    }
    var Jf = "function" == typeof Object.assign;
    function $f(e) {
        if (Jf) Object.assign.apply(Object, arguments); else for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) e[r] = n[r];
        }
        return e;
    }
    var ec, tc, nc = function() {
        function e(e, t, n) {
            this.renderer = new st(e), this.sceneConfig = t, this._esmShadowThreshold = .3, 
            this._layer = n, this._init();
        }
        e.getUniformDeclares = function() {
            var e = [];
            return e.push({
                name: "shadow_lightProjViewModelMatrix",
                type: "function",
                fn: function(e, t) {
                    return _s([], t.shadow_lightProjViewMatrix, t.modelMatrix);
                }
            }), e.push("shadow_shadowMap", "shadow_opacity", "esm_shadow_threshold", "shadow_color", "shadow_nearFar"), 
            e;
        };
        var t = e.prototype;
        return t.resize = function() {
            var e = this.canvas;
            e.width = this._layer.getRenderer().canvas.width, e.height = this._layer.getRenderer().canvas.height;
        }, t._init = function() {
            var e = this.sceneConfig.shadow, t = 512, n = e.quality;
            "high" === n ? t = 2048 : "medium" === n && (t = 1024);
            var r = this.getDefines();
            this._shadowPass = new Mo(this.renderer, {
                width: t,
                height: t,
                blurOffset: e.blurOffset,
                defines: r
            }), this._shadowDisplayShader = new Bo(r), this._createGround();
        }, t.getDefines = function() {
            return {
                HAS_SHADOWING: 1,
                PACK_FLOAT: 1,
                USE_ESM: 1
            };
        }, t.render = function(e, t, n, r, i, a, o, s, u, f) {
            this._transformGround();
            var c, l, h = this._layer.getMap();
            if (f || this._shadowChanged(h, o, a)) {
                var d = _s([], t, n), v = qs([], a);
                ec = ec || h.getContainerExtent();
                var p = h.height;
                62 < h.getPitch() && (p = h._getVisualHeight(62));
                var m = ec.set(0, h.height - p, h.width, h.height).convertTo(function(e) {
                    return h._containerPointToPoint(e, h.getGLZoom());
                }).toArray();
                e && o.addMesh(this._ground);
                var _ = this._shadowPass.render(o, {
                    cameraProjViewMatrix: d,
                    lightDir: v,
                    farPlane: m.map(function(e) {
                        return [ e.x, e.y, 0, 1 ];
                    }),
                    cameraLookAt: h.cameraLookAt
                }), g = _.lightProjViewMatrix, x = _.shadowMap, b = _.blurFBO;
                c = this._lightProjViewMatrix = g, l = this._shadowMap = x, this._blurFBO = b, this._renderedShadows = o.getMeshes().reduce(function(e, t) {
                    return t.castShadow && (e[t.properties.meshKey] = 1), e;
                }, {}), this._renderedView = {
                    count: o.getMeshes().length - (e ? 1 : 0)
                }, this._updated = !0;
            } else c = this._lightProjViewMatrix, l = this._shadowMap, this._updated = !1;
            return this._projMatrix = t, this._viewMatrix = n, e && o.getMeshes().length && this.displayShadow(r, i, s, u), 
            {
                shadow_lightProjViewMatrix: c,
                shadow_shadowMap: l,
                shadow_opacity: i,
                shadow_color: r,
                esm_shadow_threshold: this._esmShadowThreshold
            };
        }, t.displayShadow = function(e, t, n, r) {
            var i = this._lightProjViewMatrix, a = this._ground, o = this._groundLightProjViewModelMatrix || [], s = this._layer.getRenderer().canvas;
            this.renderer.render(this._shadowDisplayShader, {
                halton: n || [ 0, 0 ],
                globalTexSize: [ s.width, s.height ],
                modelMatrix: a.localTransform,
                projMatrix: this._projMatrix,
                viewMatrix: this._viewMatrix,
                shadow_lightProjViewModelMatrix: _s(o, i, a.localTransform),
                shadow_shadowMap: this._shadowMap,
                esm_shadow_threshold: this._esmShadowThreshold,
                shadow_opacity: t,
                color: e || [ 0, 0, 0 ]
            }, this._groundScene, r);
        }, t.dispose = function() {
            this._shadowPass.dispose(), this._shadowDisplayShader.dispose(), this._ground && (this._ground.geometry.dispose(), 
            this._ground.dispose()), delete this.renderer;
        }, t.isUpdated = function() {
            return !1 !== this._updated;
        }, t._shadowChanged = function(e, t) {
            if (!this._renderedShadows) return !0;
            var n = this._renderedView;
            if (t.getMeshes().length !== n.count) return !0;
            for (var r = t.getMeshes(), i = 0; i < r.length; i++) if (!this._renderedShadows[r[i].properties.meshKey]) return !0;
            return !1;
        }, t._createGround = function() {
            var e = new Wn();
            e.generateBuffers(this.renderer.regl), this._ground = new on(e), this._groundScene = new Nn([ this._ground ]);
        }, t._transformGround = function() {
            var e = this._layer.getMap(), t = Qf(this._ground.localTransform, e);
            this._ground.setLocalTransform(t);
        }, e;
    }(), rc = Ho.PBRUtils, ic = rc.createIBLTextures, ac = rc.disposeIBLTextures, oc = rc.getPBRUniforms, sc = ((tc = uc.prototype).getMap = function() {
        return this._layer && this._layer.getMap();
    }, tc.getSymbol = function() {
        var e = this._layer._getSceneConfig();
        return e && e.ground && e.ground.symbol;
    }, tc.isEnable = function() {
        var e = this._layer._getSceneConfig();
        return e && e.ground && e.ground.enable;
    }, tc.paint = function(e) {
        if (!this.isEnable()) return !1;
        var t = this._getGroundDefines(e);
        this._ground.setDefines(t), this._ground.material !== this.material && this._ground.setMaterial(this.material);
        var n = this._getShader();
        this._transformGround();
        var r = this._getUniformValues(e), i = e && e.renderTarget && e.renderTarget.fbo, a = this._layer.getRenderer().isEnableSSR();
        if (!(n !== this._fillShader || a && e && e.ssr)) return this.renderer.render(n, r, this._groundScene, i), 
        this._layer.getRenderer().setCanvasUpdated(), !0;
        var o = !1;
        if (a && t && t.HAS_SSR) {
            if (e && e.ssr) {
                this._regl.clear({
                    color: [ 0, 0, 0, 0 ],
                    framebuffer: e.ssr.depthTestFbo
                }), this.renderer.render(this._depthShader, r, this._groundScene, e.ssr.depthTestFbo);
                var s = e && e.ssr.fbo;
                this.renderer.render(n, r, this._groundScene, s), o = !0;
            }
        } else e && e.ssr || (this.renderer.render(n, r, this._groundScene, i), o = !0);
        return o && this._layer.getRenderer().setCanvasUpdated(), o;
    }, tc.update = function() {
        var e = this, t = this._layer._getSceneConfig();
        if (t) {
            var n = t.ground && t.ground.symbol;
            if (n) {
                this._polygonFill = this._parseColor(n.polygonFill || [ 1, 1, 1, 1 ]), this._polygonOpacity = void 0 === n.polygonOpacity ? 1 : n.polygonOpacity;
                var r = n.polygonPatternFile;
                if (r) {
                    if (!this._polygonPatternFile || this._polygonPatternFile._pattern_src !== r) {
                        var i = new Image();
                        i.onload = function() {
                            e._polygonPatternFile && e._polygonPatternFile.destroy(), e._polygonPatternFile = e._createPatternTexture(i), 
                            e._polygonPatternFile._pattern_src = r;
                        }, i.src = r;
                    }
                } else this._polygonPatternFile && (this._polygonPatternFile.destroy(), delete this._polygonPatternFile);
            } else this._polygonFill = [ 1, 1, 1, 1 ], this._polygonOpacity = 1, this._polygonPatternFile && (this._polygonPatternFile.destroy(), 
            delete this._polygonPatternFile);
            this._updateMaterial();
        }
    }, tc.setToRedraw = function() {
        this._layer.getRenderer().setToRedraw();
    }, tc.dispose = function() {
        this.material && (this.material.dispose(), delete this.material), this._ground && (this._ground.geometry.dispose(), 
        this._ground.material && this._ground.material.dispose(), this._ground.dispose(), 
        delete this._ground), this._polygonPatternFile && (this._polygonPatternFile.destroy(), 
        delete this._polygonPatternFile), this._fillShader && (this._fillShader.dispose(), 
        delete this._fillShader), this._standardShader && (this._standardShader.dispose(), 
        delete this._standardShader), this._disposeIblTextures(), this._dfgLUT && (this._dfgLUT.destroy(), 
        delete this._dfgLUT);
    }, tc._getShader = function() {
        var e = this._layer._getSceneConfig().ground;
        if (!e || !e.renderPlugin) return this._fillShader;
        var t = e.renderPlugin.type;
        if ("lit" === t) return this._standardShader;
        if ("fill" === t) return this._fillShader;
        throw new Error("unsupported render plugin of " + t + " for layer ground");
    }, tc._getUniformValues = function(e) {
        var t = this._getCommonUniforms(e);
        return t.polygonFill = this._polygonFill, t.polygonOpacity = this._polygonOpacity, 
        this._getShader() === this._fillShader && this._polygonPatternFile && (t.polygonPatternFile = this._polygonPatternFile), 
        t;
    }, tc._getCommonUniforms = function(e) {
        this._iblTexes || (this._iblTexes = ic(this._regl, this.getMap()));
        var t = oc(this.getMap(), this._iblTexes, this._dfgLUT, e);
        return this._setIncludeUniformValues(t, e), t;
    }, tc._setIncludeUniformValues = function(e, t) {
        var n = t && t.includes;
        if (n) for (var r in n) n[r] && t[r].renderUniforms && $f(e, t[r].renderUniforms);
    }, tc._disposeIblTextures = function() {
        this._iblTexes && (ac(this._iblTexes), delete this._iblTexes);
    }, tc._init = function() {
        this.getMap().on("updatelights", this._updateLights, this);
        var e = this._getExtraCommandProps(), t = nc.getUniformDeclares();
        t.push("polygonFill", "polygonOpacity", "polygonPatternFile", {
            name: "projViewModelMatrix",
            type: "function",
            fn: function(e, t) {
                return _s([], t.projViewMatrix, t.modelMatrix);
            }
        }), this._fillShader = new ur({
            vert: "attribute vec3 aPosition;\nuniform mat4 projViewModelMatrix;\n#ifdef HAS_PATTERN\n    attribute vec2 aTexCoord;\n    uniform vec2 uvScale;\n    uniform vec2 uvOffset;\n    varying vec2 vTexCoord;\n#endif\n#ifdef HAS_SHADOWING\n    #include <vsm_shadow_vert>\n#endif\nvoid main () {\n    #ifdef HAS_PATTERN\n        vTexCoord = aTexCoord * uvScale + uvOffset;\n    #endif\n    vec3 position = vec3(aPosition);\n    gl_Position = projViewModelMatrix * vec4(position, 1.0);\n    #if defined(HAS_SHADOWING)\n        shadow_computeShadowPars(vec4(position, 1.0));\n    #endif\n}",
            frag: "precision mediump float;\n#if defined(HAS_SHADOWING)\n    #include <vsm_shadow_frag>\n#endif\n#ifdef HAS_PATTERN\n    uniform sampler2D polygonPatternFile;\n    varying vec2 vTexCoord;\n#endif\nuniform vec4 polygonFill;\nuniform float polygonOpacity;\nvoid main() {\n    #ifdef HAS_PATTERN\n        vec4 color = texture2D(polygonPatternFile, vTexCoord);\n    #else\n        vec4 color = polygonFill;\n    #endif\n    gl_FragColor = color * polygonOpacity;\n    #if defined(HAS_SHADOWING)\n        float shadowCoeff = shadow_computeShadow();\n        gl_FragColor.rgb = shadow_blend(gl_FragColor.rgb, shadowCoeff);\n    #endif\n}",
            uniforms: t,
            extraCommandProps: e
        });
        var n = nc.getUniformDeclares();
        n.push.apply(n, _i.getUniformDeclares()), n.push("polygonFill", "polygonOpacity"), 
        this._standardShader = new Ho.StandardShader({
            uniforms: n,
            extraCommandProps: e
        }), this._depthShader = new Ho.StandardDepthShader({
            extraCommandProps: e
        }), this._createGround(), this._dfgLUT = Ho.PBRHelper.generateDFGLUT(this._regl), 
        this.update();
    }, tc._getExtraCommandProps = function() {
        var t = this, e = this._layer.getRenderer().canvas;
        return {
            viewport: {
                x: 0,
                y: 0,
                width: function() {
                    return e.width;
                },
                height: function() {
                    return e.height;
                }
            },
            depth: {
                enable: !0,
                mask: function() {
                    var e = t._layer._getSceneConfig().ground;
                    return e.depth || void 0 === e.depth;
                },
                func: "<="
            },
            blend: {
                enable: !0,
                func: {
                    src: "src alpha",
                    dst: "one minus src alpha"
                },
                equation: "add"
            },
            polygonOffset: {
                enable: !0,
                offset: {
                    factor: function() {
                        return 1;
                    },
                    units: function() {
                        return 4;
                    }
                }
            }
        };
    }, tc._hasIBL = function() {
        return !!this.getMap().getLightManager().getAmbientResource();
    }, tc._createGround = function() {
        var e = new Wn();
        e.generateBuffers(this.renderer.regl), e.data.aTexCoord = new Float32Array(8), this._ground = new on(e), 
        this._groundScene = new Nn([ this._ground ]);
    }, tc._transformGround = function() {
        var e = this.getMap(), t = Qf(this._ground.localTransform, e);
        this._ground.setLocalTransform(t);
        var n = e._get2DExtent(e.getGLZoom()), r = n.getWidth(), i = n.getHeight(), a = e.cameraLookAt, o = (a[0] - r) / .5 % 1, s = (a[1] + i) / .5 % 1, u = n.getWidth() / .5 * 2, f = n.getHeight() / .5 * 2, c = this._ground.geometry.data.aTexCoord;
        c[0] = o, c[1] = s - f, c[2] = o + u, c[3] = s - f, c[4] = o, c[5] = s, c[6] = o + u, 
        c[7] = s;
    }, tc._getGroundDefines = function(e) {
        this._defines || (this._defines = {});
        var n = this._defines, t = this._layer._getSceneConfig();
        function r(e, t) {
            e ? n[t] || (n[t] = 1) : n[t] && delete n[t];
        }
        r(this._hasIBL(), "HAS_IBL_LIGHTING"), r(e && e.ssr && t.ground && t.ground.symbol && t.ground.symbol.ssr, "HAS_SSR");
        var i = e && t.shadow && t.shadow.enable;
        return r(i, "HAS_SHADOWING"), r(i, "USE_ESM"), r(!!this._polygonPatternFile, "HAS_PATTERN"), 
        r(e && e.ssao, "HAS_SSAO"), n;
    }, tc._updateMaterial = function() {
        var e = this.getSymbol() && this.getSymbol().material;
        if (e) {
            var t = {}, n = !1;
            for (var r in e) if (e.hasOwnProperty(r)) if (0 < r.indexOf("Texture")) {
                var i = e[r];
                if (!i) continue;
                (i = "string" == typeof i ? {
                    url: i,
                    wrap: "repeat"
                } : i).flipY = !0, i.min = "linear", i.mag = "linear", t[r] = new Vn(i, this._loader), 
                n = !0;
            } else t[r] = e[r];
            this.material ? (this._loadingMaterial = new Ho.StandardMaterial(t), this._loadingMaterial.isReady() ? this._onMaterialComplete() : this._loadingMaterial.once("complete", this._bindOnMaterialComplete)) : (this.material = new Ho.StandardMaterial(t), 
            this.material.once("complete", this._bindOnMaterialComplete, this)), n || this._onMaterialComplete();
        }
    }, tc._onMaterialComplete = function() {
        this._loadingMaterial && (this.material.dispose(), this.material = this._loadingMaterial, 
        delete this._loadingMaterial), this.setToRedraw(!0);
    }, tc._createPatternTexture = function(e) {
        var t = this._regl, n = {
            width: e.width,
            height: e.height,
            data: e,
            mag: "linear",
            min: "linear",
            flipY: !1,
            wrap: "repeat"
        };
        return t.texture(n);
    }, tc._updateLights = function(e) {
        e.ambientUpdate && (this._disposeIblTextures(), this._iblTexes = ic(this._regl, this.getMap())), 
        this.setToRedraw();
    }, tc._parseColor = function(e) {
        return Array.isArray(e) && 3 === e.length && e.push(1), e;
    }, uc);
    function uc(e, t) {
        this._regl = e, this.renderer = new st(e), this._layer = t, this._loader = new Bn(), 
        this._bindOnMaterialComplete = this._onMaterialComplete.bind(this), this._init();
    }
    var fc, cc = Ho.PBRUtils, lc = cc.createIBLTextures, hc = cc.disposeIBLTextures, dc = ((fc = vc.prototype).paint = function(e) {
        if (this.isEnable()) {
            var t = this._getUniformValues(e), n = e && e.renderTarget && e.renderTarget.fbo;
            this.renderer.render(this._shader, t, null, n);
        }
    }, fc.update = function() {
        this.getMap().getLightManager().getAmbientResource() !== this._resouce && (hc(this._iblTexes), 
        delete this._iblTexes), this._updateMode();
    }, fc.dispose = function() {
        this._shader.dispose(), hc(this._iblTexes), delete this._shader, delete this._iblTexes;
    }, fc.getMap = function() {
        return this._layer.getMap();
    }, fc._updateMode = function() {
        var e = this._layer._getSceneConfig();
        this._shader.setMode(1, 0, e.environment && e.environment.mode ? 1 : 0);
    }, fc.isEnable = function() {
        var e = this._layer._getSceneConfig();
        return this._hasIBL() && e && e.environment && e.environment.enable;
    }, fc._hasIBL = function() {
        return !!this.getMap().getLightManager().getAmbientResource();
    }, fc._getUniformValues = function() {
        var e = this.getMap(), t = this._iblTexes;
        t = t || (this._iblTexes = lc(this._regl, e));
        var n = this._layer.getRenderer().canvas, r = this._layer._getSceneConfig().environment.level || 0, i = t.prefilterMap.width;
        return {
            rgbmRange: t.rgbmRange,
            cubeMap: t.prefilterMap,
            bias: r,
            size: i / Math.pow(2, Math.max(0, r - 1)),
            environmentExposure: t.exposure,
            diffuseSPH: t.sh,
            viewMatrix: e.viewMatrix,
            projMatrix: e.projMatrix,
            resolution: [ n.width, n.height ]
        };
    }, fc._init = function() {
        this.getMap().on("updatelights", this.update, this), this._shader = new Oi();
        var e = this.getMap().getLightManager().getAmbientResource();
        this._resouce = e;
    }, vc);
    function vc(e, t) {
        this._maxLevel = 4, this._regl = e, this.renderer = new st(e), this._layer = t, 
        this._init(), this._updateMode();
    }
    function pc(e) {
        return e.getUniform("bloom");
    }
    function mc(e) {
        return e.getUniform("ssr");
    }
    var _c, gc = [], xc = ((_c = bc.prototype).setContextIncludes = function() {}, _c.bloom = function(e, t, n, r, i) {
        this._bloomPass || (this._bloomPass = new ai(this._regl)), this._drawBloom(t);
        var a = this._bloomFBO.color[0];
        return this._bloomPass.render(e, a, n, r, i);
    }, _c._drawBloom = function(e) {
        var t = this._layer.getRenderer(), n = this._regl, r = this._bloomFBO;
        if (r) {
            var i = t.canvas, a = i.width, o = i.height;
            r.width === a && r.height === o || r.resize(a, o), n.clear({
                color: [ 0, 0, 0, 0 ],
                framebuffer: r
            });
        } else {
            var s = this._createFBOInfo(e);
            this._bloomFBO = n.framebuffer(s);
        }
        var u = t.getFrameTime(), f = t.getFrameEvent(), c = t.getFrameContext(), l = c.renderMode, h = c.sceneFilter, d = c.renderTarget;
        c.renderMode = "default", c.sceneFilter = pc, c.renderTarget = {
            fbo: this._bloomFBO,
            getFramebuffer: yc,
            getDepthTexture: Tc
        }, f ? t.forEachRenderer(function(e) {
            t.clearStencil(e, r), e.drawOnInteracting(f, u, c);
        }) : t.forEachRenderer(function(e) {
            t.clearStencil(e, r), e.draw(u, c);
        }), c.renderMode = l, c.sceneFilter = h, c.renderTarget = d;
    }, _c.genSsrMipmap = function(e) {
        this._ssrPass && (this._ssrPass.genMipMap(e), this._ssrFBO._projViewMatrix || (this._ssrFBO._projViewMatrix = []), 
        ps(this._ssrFBO._projViewMatrix, this._layer.getMap().projViewMatrix));
    }, _c.ssr = function(e) {
        if (!this._ssrFBO) return e;
        var t = this._ssrFBO.color[0];
        return this._ssrPass.combine(e, t);
    }, _c.drawSSR = function(e) {
        var t = this._regl, n = this._layer.getRenderer(), r = n.getFrameTime(), i = n.getFrameEvent(), a = n.getFrameContext();
        this._ssrPass || (this._ssrPass = new _i(t));
        var o = this._ssrFBO, s = this._ssrDepthTestFBO;
        if (o) {
            var u = n.canvas, f = u.width, c = u.height;
            o.width === f && o.height === c || o.resize(f, c), s.width === f && s.height === c || s.resize(f, c), 
            t.clear({
                color: [ 0, 0, 0, 0 ],
                depth: 1,
                framebuffer: o
            });
        } else {
            var l = this._createFBOInfo();
            o = this._ssrFBO = t.framebuffer(l);
            var h = this._createFBOInfo(e);
            s = this._ssrDepthTestFBO = t.framebuffer(h);
        }
        a.ssr = this._prepareSSRContext(e);
        var d = a.renderMode;
        a.renderMode = "default", a.sceneFilter = mc, i ? n.forEachRenderer(function(e) {
            n.clearStencil(e, o), n.clearStencil(e, s), e.drawOnInteracting(i, r, a);
        }) : n.forEachRenderer(function(e) {
            n.clearStencil(e, o), n.clearStencil(e, s), e.draw(r, a);
        });
        var v = n.drawGround();
        return delete a.ssr, a.renderMode = d, v;
    }, _c._prepareSSRContext = function(e) {
        var t = this._layer._getSceneConfig(), n = t && t.postProcess, r = this._layer.getMap(), i = this._ssrPass.getMipmapTexture(), a = this._ssrFBO, o = this._ssrDepthTestFBO;
        return {
            renderUniforms: {
                TextureDepthTest: this._ssrDepthTestFBO.color[0],
                TextureDepth: e,
                TextureToBeRefracted: i,
                uSsrFactor: n.ssr.factor || 1,
                uSsrQuality: n.ssr.quality || 2,
                uPreviousGlobalTexSize: [ i.width, i.height / 2 ],
                uGlobalTexSize: [ e.width, e.height ],
                uTextureToBeRefractedSize: [ i.width, i.height ],
                fov: r.getFov() * Math.PI / 180,
                prevProjViewMatrix: a._projViewMatrix || r.projViewMatrix,
                cameraWorldMatrix: r.cameraWorldMatrix
            },
            fbo: a,
            depthTestFbo: o
        };
    }, _c.taa = function(e, t, n) {
        var r = n.projMatrix, i = n.projViewMatrix, a = n.cameraWorldMatrix, o = n.fov, s = n.near, u = n.far, f = n.needClear, c = n.taa, l = this._taaPass;
        return {
            outputTex: l.render(e, t, r, i, a, o, s, u, f, c),
            redraw: l.needToRedraw()
        };
    }, _c.ssao = function(e, t, n) {
        return this._ssaoPass || (this._ssaoPass = new qr(this._renderer), this._layer.getRenderer().setToRedraw()), 
        this._ssaoPass.render({
            projMatrix: n.projMatrix,
            cameraNear: n.cameraNear,
            cameraFar: n.cameraFar,
            bias: n.ssaoBias,
            radius: n.ssaoRadius,
            intensity: n.ssaoIntensity,
            quality: .6
        }, e, t);
    }, _c.fxaa = function(e, t, n, r, i, a, o) {
        this._renderer.render(this._fxaaShader, {
            textureSource: e,
            noAaTextureSource: t,
            resolution: bf(gc, e.width, e.height),
            enableFXAA: n,
            enableToneMapping: r,
            enableSharpen: i,
            pixelRatio: a,
            sharpFactor: o
        });
    }, _c.postprocess = function(e, t, n) {
        this._postProcessShader || (this._postProcessShader = new Ur());
        var r = n || e.color[0];
        return t.resolution = bf(gc, r.width, r.height), t.textureSource = r, t.timeGrain = performance.now(), 
        this._renderer.render(this._postProcessShader, t), this._target;
    }, _c.dispose = function() {
        this._bloomFBO && (this._bloomFBO.destroy(), delete this._bloomFBO), this._ssrFBO && (this._ssrFBO.destroy(), 
        this._ssrDepthTestFBO.destroy(), delete this._ssrFBO), this._taaPass && (this._taaPass.dispose(), 
        delete this._taaPass), this._ssaoPass && (this._ssaoPass.dispose(), delete this._ssaoPass), 
        this._bloomPass && (this._bloomPass.dispose(), delete this._bloomPass), this._postProcessShader && (this._postProcessShader.dispose(), 
        delete this._postProcessShader), this._fxaaShader && (this._fxaaShader.dispose(), 
        delete this._fxaaShader);
    }, _c._createFBOInfo = function(e) {
        var t = this._layer.getRenderer().canvas, n = t.width, r = t.height, i = {
            width: n,
            height: r,
            colors: [ this._regl.texture({
                min: "nearest",
                mag: "nearest",
                type: "uint8",
                width: n,
                height: r
            }) ],
            colorFormat: "rgba"
        };
        return e && (i.depthStencil = e), i;
    }, bc);
    function bc(e, t, n) {
        this._regl = e, this._layer = t, this._renderer = new st(e), this._fxaaShader = new Er(), 
        this._taaPass = new Wr(this._renderer, n);
    }
    function yc(e) {
        return e._framebuffer.framebuffer;
    }
    function Tc(e) {
        return e.depthStencil._texture.texture;
    }
    function wc(e) {
        return !e.getUniform("bloom") && !e.getUniform("ssr");
    }
    function Ec(e) {
        return !e.getUniform("bloom");
    }
    function Sc(e) {
        return !e.getUniform("ssr");
    }
    var Ac = function(r) {
        function e() {
            return r.apply(this, arguments) || this;
        }
        o(e, r);
        var t = e.prototype;
        return t.setToRedraw = function() {
            this.setRetireFrames(), r.prototype.setToRedraw.call(this);
        }, t.onAdd = function() {
            r.prototype.onAdd.call(this), this.prepareCanvas();
        }, t.updateSceneConfig = function() {
            this._groundPainter && this._groundPainter.update(), this.setToRedraw();
        }, t.render = function() {
            var t = this;
            if (this.getMap() && this.layer.isVisible()) {
                this.forEachRenderer(function(e) {
                    e._replacedDrawFn || (e.draw = t._buildDrawFn(e.draw), e.drawOnInteracting = t._buildDrawFn(e.drawOnInteracting), 
                    e.setToRedraw = t._buildSetToRedrawFn(e.setToRedraw), e._replacedDrawFn = !0);
                }), this.prepareRender(), this.prepareCanvas(), this.layer._updatePolygonOffset();
                for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
                this._renderChildLayers("render", n), this._toRedraw = !1, this._postProcess(), 
                this._renderHighlights();
            }
        }, t.drawOnInteracting = function() {
            if (this.getMap() && this.layer.isVisible()) {
                this.layer._updatePolygonOffset();
                for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                this._renderChildLayers("drawOnInteracting", t), this._toRedraw = !1, this._postProcess(), 
                this._renderHighlights();
            }
        }, t._renderChildLayers = function(n, r) {
            var i = this;
            this._renderMode = "default";
            var e = this.hasRenderTarget();
            e && (this._renderMode = "aa");
            var t = r[0];
            Rc(t) || (t = r[1]), t !== this._contextFrameTime && (this._drawContext = this._prepareDrawContext(), 
            this._contextFrameTime = t, this._frameEvent = Rc(r[0]) ? null : r[0]), this._envPainter || (this._envPainter = new dc(this._regl, this.layer)), 
            this._envPainter.paint(this._drawContext);
            var a = !1;
            this.forEachRenderer(function(e, t) {
                t.isVisible() && (e.needRetireFrames && e.needRetireFrames() && i.setRetireFrames(), 
                e.hasNoAARendering && e.hasNoAARendering() && (a = !0), i.clearStencil(e, i._targetFBO), 
                e[n].apply(e, r));
            });
            var o = !1;
            this._postProcessor && this.isEnableSSR() && (o = this._postProcessor.drawSSR(this._depthTex)), 
            o || this.drawGround(), a && e && (delete this._contextFrameTime, this._renderMode = "noAa", 
            this.forEachRenderer(function(e, t) {
                t.isVisible() && e.hasNoAARendering && e.hasNoAARendering() && (i.clearStencil(e, i._targetFBO), 
                e[n].apply(e, r));
            }));
        }, t._renderHighlights = function() {
            this.forEachRenderer(function(e, t) {
                t.isVisible() && e.drawHighlight && e.drawHighlight();
            });
        }, t.hasRenderTarget = function() {
            var e = this.layer._getSceneConfig(), t = e && e.postProcess;
            return !(!t || !t.enable);
        }, t.testIfNeedRedraw = function() {
            if (this._toRedraw) return !(this._toRedraw = !1);
            if (this.getMap().isInteracting() && this._groundPainter && this._groundPainter.isEnable()) return !0;
            for (var e, t = a(this.layer.getLayers()); !(e = t()).done; ) {
                var n = e.value.getRenderer();
                if (n && n.testIfNeedRedraw()) return this.setRetireFrames(), !0;
            }
            return !1;
        }, t.isRenderComplete = function() {
            for (var e, t = a(this.layer.getLayers()); !(e = t()).done; ) {
                var n = e.value.getRenderer();
                if (n && !n.isRenderComplete()) return !1;
            }
            return !0;
        }, t.mustRenderOnInteracting = function() {
            for (var e, t = a(this.layer.getLayers()); !(e = t()).done; ) {
                var n = e.value.getRenderer();
                if (n && n.mustRenderOnInteracting()) return !0;
            }
            return !1;
        }, t.isCanvasUpdated = function() {
            if (r.prototype.isCanvasUpdated.call(this)) return !0;
            for (var e, t = a(this.layer.getLayers()); !(e = t()).done; ) {
                var n = e.value.getRenderer();
                if (n && n.isCanvasUpdated()) return !0;
            }
            return !1;
        }, t.isBlank = function() {
            if (this._groundPainter && this._groundPainter.isEnable()) return !1;
            for (var e, t = a(this.layer.getLayers()); !(e = t()).done; ) {
                var n = e.value.getRenderer();
                if (n && !n.isBlank()) return !1;
            }
            return !0;
        }, t.createContext = function() {
            var e = this, t = this.layer, n = t.options.glOptions || {
                alpha: !0,
                depth: !0,
                stencil: !0
            };
            n.preserveDrawingBuffer = !0, n.antialias = t.options.antialias, this.glOptions = n;
            var r = this.gl = this._createGLContext(this.canvas, n);
            this._initGL(r), r.wrap = function() {
                return new Wf(e.gl);
            }, this.glCtx = r.wrap(), this.canvas.gl = this.gl, this._reglGL = r.wrap(), this._regl = c({
                gl: this._reglGL,
                attributes: n,
                extensions: t.options.extensions,
                optionalExtensions: t.options.optionalExtensions
            }), this.gl.regl = this._regl, this._jitter = [ 0, 0 ], this._jitGetter = new $r(this.layer.options.jitterRatio);
        }, t._initGL = function() {
            var e = this.layer, t = this.gl, n = e.options.extensions;
            n && n.forEach(function(e) {
                t.getExtension(e);
            });
            var r = e.options.optionalExtensions;
            r && r.forEach(function(e) {
                t.getExtension(e);
            }), this.gl.clearColor(0, 0, 0, 0);
        }, t.clearCanvas = function() {
            r.prototype.clearCanvas.call(this), this._regl.clear({
                color: [ 0, 0, 0, 0 ],
                depth: 1,
                stencil: 255
            }), this._targetFBO && (this._regl.clear({
                color: [ 0, 0, 0, 0 ],
                depth: 1,
                stencil: 255,
                framebuffer: this._targetFBO
            }), this._regl.clear({
                color: [ 0, 0, 0, 0 ],
                framebuffer: this._noAaFBO
            }));
        }, t.resizeCanvas = function() {
            r.prototype.resizeCanvas.call(this), !this._targetFBO || this._targetFBO.width === this.canvas.width && this._targetFBO.height === this.canvas.height || (this._targetFBO.resize(this.canvas.width, this.canvas.height), 
            this._noAaFBO.resize(this.canvas.width, this.canvas.height)), this.forEachRenderer(function(e) {
                e.canvas && e.resizeCanvas();
            });
        }, t.getCanvasImage = function() {
            return this.forEachRenderer(function(e) {
                e.getCanvasImage();
            }), r.prototype.getCanvasImage.call(this);
        }, t.forEachRenderer = function(e) {
            for (var t, n = a(this.layer.getLayers()); !(t = n()).done; ) {
                var r = t.value, i = r.getRenderer();
                i && e(i, r);
            }
        }, t._createGLContext = function(e, t) {
            for (var n = [ "webgl2", "webgl", "experimental-webgl" ], r = null, i = 0; i < n.length; ++i) {
                try {
                    r = e.getContext(n[i], t);
                } catch (e) {}
                if (r) break;
            }
            return r;
        }, t.clearStencil = function(e, t) {
            var n = {
                stencil: e.getStencilValue ? e.getStencilValue() : 255
            };
            t && (n.framebuffer = t), this._regl.clear(n);
        }, t.onRemove = function() {
            this.canvas.pickingFBO && this.canvas.pickingFBO.destroy && this.canvas.pickingFBO.destroy(), 
            this._clearFramebuffers(), this._groundPainter && (this._groundPainter.dispose(), 
            delete this._groundPainter), this._envPainter && (this._envPainter.dispose(), delete this._envPainter), 
            this._shadowPass && (this._shadowPass.dispose(), delete this._shadowPass), this._postProcessor && (this._postProcessor.dispose(), 
            delete this._postProcessor), r.prototype.onRemove.call(this);
        }, t._clearFramebuffers = function() {
            this._targetFBO && (this._targetFBO.destroy(), this._noAaFBO.destroy(), delete this._targetFBO, 
            delete this._noAaFBO);
        }, t.setRetireFrames = function() {
            this._needRetireFrames = !0;
        }, t.getFrameTime = function() {
            return this._contextFrameTime;
        }, t.getFrameEvent = function() {
            return this._frameEvent;
        }, t.getFrameContext = function() {
            return this._drawContext;
        }, t.drawGround = function() {
            return this._groundPainter || (this._groundPainter = new sc(this._regl, this.layer)), 
            this._groundPainter.paint(this.getFrameContext());
        }, t._buildDrawFn = function(r) {
            var i = this;
            return function(e, t, n) {
                return Rc(e) && (n = t, t = e, e = null), n && n.renderTarget && (n.renderTarget.getFramebuffer = Oc, 
                n.renderTarget.getDepthTexture = Bc), e ? r.call(this, e, t, n || i._drawContext) : r.call(this, t, n || i._drawContext);
            };
        }, t._buildSetToRedrawFn = function(r) {
            var i = this;
            return function() {
                i.setRetireFrames();
                for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                return r.apply(this, t);
            };
        }, t.isEnableSSR = function() {
            var e = this.layer._getSceneConfig(), t = e && e.postProcess;
            return t && t.ssr && t.ssr.enable;
        }, t.isEnableSSAO = function() {
            var e = this.layer._getSceneConfig(), t = e && e.postProcess;
            return t && t.ssao && t.ssao.enable;
        }, t._getViewStates = function() {
            var e = this.layer.getMap(), t = e.getLightManager().getDirectionalLight().direction;
            if (!this._renderedView) return this._renderedView = {
                center: e.getCenter(),
                bearing: e.getBearing(),
                pitch: e.getPitch(),
                lightDirection: Bs([], t)
            }, {
                viewChanged: !0,
                lightDirectionChanged: !0
            };
            var n = e.coordToContainerPoint(this._renderedView.center), r = this.layer.options.viewMoveThreshold, i = n._sub(e.width / 2, e.height / 2).mag() > r, a = !Us(this._renderedView.lightDirection, t);
            return i && (this._renderedView.center = e.getCenter(), this._renderedView.bearing = e.getBearing(), 
            this._renderedView.pitch = e.getPitch()), a && (this._renderedView.lightDirection = Bs([], t)), 
            {
                viewChanged: i,
                lightDirectionChanged: a
            };
        }, t._prepareDrawContext = function() {
            var e, t = this.layer._getSceneConfig(), n = t && t.postProcess, r = {
                renderMode: this._renderMode || "default",
                includes: {},
                states: this._getViewStates()
            };
            if (n && n.enable) {
                n.antialias && n.antialias.enable ? (r.jitter = this._jitGetter.getJitter(this._jitter), 
                this._jitGetter.frame()) : bf(this._jitter, 0, 0);
                var i = n.bloom && n.bloom.enable, a = this.isEnableSSR();
                i && a ? (r.bloom = 1, r.sceneFilter = wc) : i ? (r.bloom = 1, r.sceneFilter = Ec) : a && (r.sceneFilter = Sc), 
                (e = this._getFramebufferTarget()) && (r.renderTarget = e);
            } else this._clearFramebuffers();
            return this._renderAnalysis(r, e), "noAa" !== this._renderMode && (this._shadowContext = this._prepareShadowContext(r), 
            this._shadowContext && (r.includes.shadow = 1), this._includesState = this._updateIncludesState(r)), 
            this._shadowContext && (r.shadow = this._shadowContext, r.includes.shadow = 1), 
            r.states.includesChanged = this._includesState, n && n.enable && this._postProcessor && this._postProcessor.setContextIncludes(r), 
            r;
        }, t._renderAnalysis = function(e, t) {
            var r = [];
            this.forEachRenderer(function(e) {
                if (e.getAnalysisMeshes) {
                    var t = e.getAnalysisMeshes();
                    if (Array.isArray(t)) for (var n = 0; n < t.length; n++) r.push(t[n]);
                }
            });
            var n = this.layer._analysisTaskList;
            if (n) for (var i = 0; i < n.length; i++) {
                n[i].renderAnalysis(e, r, t && t.fbo);
            }
        }, t._updateIncludesState = function(e) {
            var t = !1, n = Object.keys(e.includes), r = this._prevIncludeKeys;
            if (r) {
                var i = n.filter(function(e) {
                    return -1 === r.indexOf(e);
                }).concat(r.filter(function(e) {
                    return -1 === n.indexOf(e);
                }));
                i.length && (t = i.reduce(function(e, t) {
                    return e[t] = 1, e;
                }, {}));
            }
            return this._prevIncludeKeys = n, t;
        }, t._prepareShadowContext = function(e) {
            var t = this.layer._getSceneConfig();
            if (!t || !t.shadow || !t.shadow.enable) return this._shadowPass && (this._shadowPass.dispose(), 
            delete this._shadowPass), null;
            this._shadowPass || (this._shadowPass = new nc(this._regl, t, this.layer));
            var n = {
                config: t.shadow,
                defines: this._shadowPass.getDefines(),
                uniformDeclares: nc.getUniformDeclares()
            };
            return n.renderUniforms = this._renderShadow(e), n;
        }, t._renderShadow = function(e) {
            var t = e.renderTarget && e.renderTarget.fbo, n = this.layer._getSceneConfig(), r = [], i = e.states.lightDirectionChanged || e.states.viewChanged;
            this.forEachRenderer(function(e) {
                if (e.getShadowMeshes) {
                    var t = e.getShadowMeshes();
                    if (Array.isArray(t)) for (var n = 0; n < t.length; n++) t[n].needUpdateShadow && (i = !0), 
                    t[n].needUpdateShadow = !1, r.push(t[n]);
                }
            }), this._shadowScene || (this._shadowScene = new Nn()), this._shadowScene.setMeshes(r);
            var a = this.getMap(), o = n.shadow, s = a.getLightManager().getDirectionalLight().direction, u = !n.ground || !n.ground.enable, f = this._shadowPass.render(u, a.projMatrix, a.viewMatrix, o.color, o.opacity, s, this._shadowScene, this._jitter, t, i);
            return this._shadowPass.isUpdated() && this.setRetireFrames(), f;
        }, t._getFramebufferTarget = function() {
            var e = this.layer._getSceneConfig(), t = e && e.postProcess;
            if (!this._targetFBO) {
                var n = this._regl, r = this._createFBOInfo(t);
                this._depthTex = r.depth || r.depthStencil, this._targetFBO = n.framebuffer(r);
                var i = this._createFBOInfo(t, this._depthTex);
                this._noAaFBO = n.framebuffer(i);
            }
            return {
                fbo: this._targetFBO,
                noAaFbo: this._noAaFBO
            };
        }, t._createFBOInfo = function(e, t) {
            var n = this.canvas.width, r = this.canvas.height, i = this._regl, a = {
                width: n,
                height: r,
                colors: [ i.texture({
                    min: "nearest",
                    mag: "nearest",
                    type: "uint8",
                    width: n,
                    height: r
                }) ],
                colorFormat: "rgba"
            };
            if (i.hasExtension("WEBGL_depth_texture")) {
                var o = t || i.texture({
                    min: "nearest",
                    mag: "nearest",
                    mipmap: !1,
                    type: "depth stencil",
                    width: n,
                    height: r,
                    format: "depth stencil"
                });
                a.depthStencil = o;
            } else {
                var s = t || i.renderbuffer({
                    width: n,
                    height: r,
                    format: "depth stencil"
                });
                a.depthStencil = s;
            }
            return a;
        }, t._postProcess = function() {
            if (this._targetFBO) {
                var e = this.layer._getSceneConfig(), t = e && e.postProcess;
                if (t && t.enable) {
                    var n = this.layer.getMap();
                    this._postProcessor || (this._postProcessor = new xc(this._regl, this.layer, this._jitGetter));
                    var r = this._targetFBO.color[0], i = this.isEnableSSR();
                    if (i && (r = this._postProcessor.ssr(r)), this.isEnableSSAO() && (r = this._postProcessor.ssao(r, this._depthTex, {
                        projMatrix: n.projMatrix,
                        cameraNear: n.cameraNear,
                        cameraFar: n.cameraFar,
                        ssaoBias: t.ssao && t.ssao.bias || 10,
                        ssaoRadius: t.ssao && t.ssao.radius || 100,
                        ssaoIntensity: t.ssao && t.ssao.intensity || .5
                    })), t.bloom && t.bloom.enable) {
                        var a = t.bloom, o = +a.threshold || 0, s = Mc(a.factor) ? 1 : +a.factor, u = Mc(a.radius) ? 1 : +a.radius;
                        r = this._postProcessor.bloom(r, this._depthTex, o, s, u);
                    }
                    if (t.antialias && t.antialias.enable) {
                        var f = this._postProcessor.taa(r, this._depthTex, {
                            projMatrix: n.projMatrix,
                            projViewMatrix: n.projViewMatrix,
                            cameraWorldMatrix: n.cameraWorldMatrix,
                            fov: n.getFov() * Math.PI / 180,
                            jitter: this._jitter,
                            near: n.cameraNear,
                            far: n.cameraFar,
                            needClear: this._needRetireFrames || n.getRenderer().isViewChanged(),
                            taa: !!t.antialias.taa
                        });
                        r = f.outputTex, f.redraw && this.setToRedraw(), this._needRetireFrames = !1;
                    }
                    var c = t.sharpen && t.sharpen.factor;
                    c || 0 === c || (c = .2), this._postProcessor.fxaa(r, this._noAaFBO.color[0], 1, +!(!t.toneMapping || !t.toneMapping.enable), +!(!t.sharpen || !t.sharpen.enable), n.getDevicePixelRatio(), c), 
                    i && this._postProcessor.genSsrMipmap(r);
                }
            } else this._needRetireFrames = !1;
        }, t._isPostProcessEnabled = function() {
            var e = this.layer._getSceneConfig().postProcess;
            if (!e.enable) return !1;
            for (var t in e) if (e[t] && e[t].enable) return !0;
            return !1;
        }, e;
    }(r.renderer.CanvasRenderer);
    function Mc(e) {
        return null == e;
    }
    function Rc(e) {
        return "number" == typeof e && !isNaN(e);
    }
    function Oc(e) {
        return e._framebuffer.framebuffer;
    }
    function Bc(e) {
        return e.depthStencil._texture.texture;
    }
    var Cc = function(i) {
        function n(e, t, n) {
            var r;
            return (r = i.call(this, e, n) || this).layers = t || [], r._checkChildren(), r._layerMap = {}, 
            r;
        }
        o(n, i), n.fromJSON = function(e) {
            if (!e || "GroupGLLayer" !== e.type) return null;
            var t = e.layers.map(function(e) {
                return r.Layer.fromJSON(e);
            });
            return new n(e.id, t, e.options);
        };
        var e = n.prototype;
        return e.setSceneConfig = function(e) {
            this.options.sceneConfig = e;
            var t = this.getRenderer();
            return t && t.updateSceneConfig(), this;
        }, e.getSceneConfig = function() {
            return JSON.parse(JSON.stringify(this.options.sceneConfig || {}));
        }, e._getSceneConfig = function() {
            return this.options.sceneConfig;
        }, e.addLayer = function(e, t) {
            if (e.getMap()) throw new Error("layer(" + e.getId() + " is already added on map");
            void 0 === t ? this.layers.push(e) : this.layers.splice(t, 0, e), this._checkChildren();
            var n = this.getRenderer();
            return n && (this._prepareLayer(e), n.setToRedraw()), this;
        }, e.removeLayer = function(e) {
            r.Util.isString(e) && (e = this.getChildLayer(e));
            var t = this.layers.indexOf(e);
            if (t < 0) return this;
            e._doRemove(), e.off("show hide", this._onLayerShowHide, this), delete this._layerMap[e.getId()], 
            this.layers.splice(t, 1);
            var n = this.getRenderer();
            return n && n.setToRedraw(), this;
        }, e._updatePolygonOffset = function() {
            for (var e = 0, t = 0; t < this.layers.length; t++) this.layers[t].setPolygonOffset && this.layers[t].getPolygonOffsetCount && (e += this.layers[t].getPolygonOffsetCount());
            for (var n = 0, r = 0; r < this.layers.length; r++) this.layers[r].setPolygonOffset && this.layers[r].getPolygonOffsetCount && (this.layers[r].setPolygonOffset(n, e), 
            n += this.layers[r].getPolygonOffsetCount());
        }, e.getLayers = function() {
            return this.layers;
        }, e.toJSON = function() {
            var e = [];
            if (this.layers) for (var t = 0; t < this.layers.length; t++) {
                var n = this.layers[t];
                n && n && n.toJSON && e.push(n.toJSON());
            }
            return {
                type: this.getJSONType(),
                id: this.getId(),
                layers: e,
                options: this.config()
            };
        }, e.onLoadEnd = function() {
            var t = this;
            this.layers.forEach(function(e) {
                t._prepareLayer(e);
            }), i.prototype.onLoadEnd.call(this);
        }, e._prepareLayer = function(e) {
            var t = this.getMap();
            (this._layerMap[e.getId()] = e)._canvas = this.getRenderer().canvas, e._bindMap(t), 
            e.once("renderercreate", this._onChildRendererCreate, this), e.load(), this._bindChildListeners(e);
        }, e.onRemove = function() {
            var t = this;
            this.layers.forEach(function(e) {
                e._doRemove(), e.off("show hide", t._onLayerShowHide, t);
            }), delete this._layerMap, i.prototype.onRemove.call(this);
        }, e.getChildLayer = function(e) {
            return this._layerMap[e] || null;
        }, e._bindChildListeners = function(e) {
            e.on("show hide", this._onLayerShowHide, this);
        }, e._onLayerShowHide = function() {
            var e = this.getRenderer();
            e && e.setToRedraw();
        }, e._onChildRendererCreate = function(e) {
            e.renderer.clearCanvas = Fc;
        }, e._checkChildren = function() {
            var n = this, r = {};
            this.layers.forEach(function(e) {
                var t = e.getId();
                if (r[t]) throw new Error("Duplicate child layer id (" + t + ") in the GroupGLLayer (" + n.getId() + ")");
                r[t] = 1;
            });
        }, e.addAnalysis = function(e) {
            this._analysisTaskList = this._analysisTaskList || [], this._analysisTaskList.push(e);
            var t = this.getRenderer();
            t && t.setToRedraw();
        }, e.removeAnalysis = function(e) {
            if (this._analysisTaskList) {
                var t = this._analysisTaskList.indexOf(e);
                -1 < t && this._analysisTaskList.splice(t, 1);
            }
            var n = this.getRenderer();
            n && n.setToRedraw();
        }, n;
    }(r.Layer);
    function Fc() {}
    Cc.mergeOptions({
        renderer: "gl",
        antialias: !1,
        extensions: [],
        optionalExtensions: [ "ANGLE_instanced_arrays", "OES_element_index_uint", "OES_standard_derivatives", "OES_vertex_array_object", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_texture_float", "OES_texture_float_linear", "WEBGL_depth_texture", "EXT_shader_texture_lod" ],
        forceRenderOnZooming: !0,
        forceRenderOnMoving: !0,
        forceRenderOnRotating: !0,
        jitterRatio: .04,
        viewMoveThreshold: 100
    }), Cc.registerJSONType("GroupGLLayer"), Cc.registerRenderer("gl", Ac), Cc.registerRenderer("canvas", null), 
    "undefined" != typeof window && window.maptalks && (window.maptalks.GroupGLLayer = Cc);
    var Ic, Pc = ((Ic = Dc.prototype).render = function(e, t, n) {
        this._check();
        var r = this._layer.getMap();
        this.renderer.regl.clear({
            color: [ 0, 0, 0, 0 ],
            depth: 1,
            stencil: 255,
            framebuffer: this._heatmapFBO
        }), this.renderer.render(this._heatmapShader, t, e, this._heatmapFBO);
        var i = $f({
            colorRamp: this._colorRampTex,
            inputTexture: this._heatmapFBO,
            projViewMatrix: r.projViewMatrix
        }, t);
        this._transformGround(), this.renderer.render(this._displayShader, i, this._groundScene, n);
    }, Ic.dispose = function() {
        this._heatmapShader && (this._heatmapShader.dispose(), delete this._heatmapShader), 
        this._displayShader && (this._displayShader.dispose(), delete this._displayShader), 
        this._ground && (this._ground.geometry.dispose(), this._ground.dispose(), delete this._ground, 
        delete this._groundScene), this._heatmapFBO && (this._heatmapFBO.destroy(), delete this._heatmapFBO);
    }, Ic._createColorRamp = function() {
        var e = this._colorStops, t = this._rampCanvas, n = this._rampCtx;
        n ? n.clearRect(0, 0, 256, 1) : ((t = this._rampCanvas = document.createElement("canvas")).width = 256, 
        t.height = 1, n = this._rampCtx = t.getContext("2d"));
        for (var r = n.createLinearGradient(0, 0, 256, 1), i = 0; i < e.length; i++) r.addColorStop(e[i][0], e[i][1]);
        n.fillStyle = r, n.fillRect(0, 0, 256, 1), this._colorRampTex && this._colorRampTex.destroy();
        var a = this.renderer.regl;
        this._colorRampTex = a.texture({
            width: 256,
            height: 1,
            data: t,
            min: "linear",
            mag: "linear",
            premultiplyAlpha: !0
        });
    }, Ic._check = function() {
        var e = this._layer.getRenderer().canvas, t = Math.ceil(e.width / 4), n = Math.ceil(e.height / 4), r = this._heatmapFBO;
        r.width === t && r.height === n || r.resize(t, n);
    }, Ic._init = function() {
        this._createColorRamp(), this._createShader(), this._createHeatmapTex(), this._createGround();
    }, Ic._createGround = function() {
        var e = new Wn();
        e.generateBuffers(this.renderer.regl), this._ground = new on(e), this._groundScene = new Nn([ this._ground ]);
    }, Ic._transformGround = function() {
        var e = this._layer.getMap(), t = Qf(this._ground.localTransform, e);
        this._ground.setLocalTransform(t);
    }, Ic._createHeatmapTex = function() {
        var e = this._layer.getRenderer().canvas, t = this.renderer.regl, n = t.hasExtension("OES_texture_half_float") ? "half float" : "float", r = Math.ceil(e.width / 4), i = Math.ceil(e.height / 4), a = t.texture({
            width: r,
            height: i,
            type: n,
            min: "linear",
            mag: "linear",
            format: "rgba"
        });
        this._heatmapFBO = t.framebuffer({
            width: r,
            height: i,
            color: [ a ]
        });
    }, Ic._createShader = function() {
        var e = this._layer.getRenderer().canvas, t = this.sceneConfig.depthRange, n = {
            viewport: {
                x: 0,
                y: 0,
                width: function() {
                    return e ? Math.ceil(e.width / 4) : 1;
                },
                height: function() {
                    return e ? Math.ceil(e.height / 4) : 1;
                }
            },
            depth: {
                enable: !0,
                func: "always"
            }
        };
        this._stencil && (n.stencil = this._stencil), this._heatmapShader = new Ei({
            extraCommandProps: n
        }), this._displayShader = new Bi({
            extraCommandProps: {
                stencil: {
                    enable: !1
                },
                depth: {
                    enable: !0,
                    range: t || [ 0, 1 ],
                    func: "<="
                },
                polygonOffset: {
                    enable: !0,
                    offset: this._polygonOffset
                }
            }
        });
    }, Dc);
    function Dc(e, t, n, r, i, a) {
        this.renderer = new st(e), this.sceneConfig = t, this._layer = n, this._colorStops = r, 
        this._stencil = i, this._polygonOffset = a || {
            factor: 0,
            units: 0
        }, this._init();
    }
    var Nc = function(e) {
        function t() {
            return e.apply(this, arguments) || this;
        }
        o(t, e);
        var n = t.prototype;
        return n.addTo = function(e) {
            this.layer = e;
        }, n.renderAnalysis = function(e) {
            var t = this.getAnalysisType();
            e.includes[t] = 1, e[t] = {
                defines: this.getDefines()
            };
        }, n.remove = function() {
            this.layer && (this.layer.removeAnalysis(this), delete this.layer);
        }, n.update = function(e, t) {
            this.options[e] = t;
            var n = this.layer.getRenderer();
            n && n.setToRedraw();
        }, n.getAnalysisType = function() {
            return this.type;
        }, t;
    }(r.Eventable(r.Handlerable(r.Class))), Lc = function(a) {
        function e(e) {
            var t;
            return (t = a.call(this, e) || this).type = "viewshed", t;
        }
        o(e, a);
        var t = e.prototype;
        return t.addTo = function(e) {
            var t = this;
            a.prototype.addTo.call(this, e);
            var n = this.layer.getRenderer(), r = this.layer.getMap();
            return this._renderOptions = {}, this._renderOptions.eyePos = qc(r, this.options.eyePos), 
            this._renderOptions.lookPoint = qc(r, this.options.lookPoint), this._renderOptions.verticalAngle = this.options.verticalAngle, 
            this._renderOptions.horizonAngle = this.options.horizonAngle, n ? this._setViewshedPass(n) : this.layer.once("renderercreate", function(e) {
                t._setViewshedPass(e.renderer);
            }, this), this;
        }, t.update = function(e, t) {
            if (0 < t.length) {
                var n = this.layer.getMap();
                this._renderOptions[e] = qc(n, t);
            } else this._renderOptions[e] = t;
            a.prototype.update.call(this, e, t);
        }, t._setViewshedPass = function(e) {
            var t = {
                x: 0,
                y: 0,
                width: function() {
                    return e.canvas ? e.canvas.width : 1;
                },
                height: function() {
                    return e.canvas ? e.canvas.height : 1;
                }
            }, n = new st(e._regl);
            this._viewshedPass = new yi(n, t) || this._viewshedPass, this.layer.addAnalysis(this);
        }, t.renderAnalysis = function(e, t) {
            a.prototype.renderAnalysis.call(this, e);
            var n = this.getAnalysisType(), r = {}, i = this._viewshedPass.render(t, this._renderOptions);
            r.viewshed_depthMapFromViewpoint = i.depthMap, r.viewshed_projViewMatrixFromViewpoint = i.projViewMatrixFromViewpoint, 
            r.viewshed_visibleColor = this._renderOptions.visibleColor || [ 0, 1, 0, 1 ], r.viewshed_invisibleColor = this._renderOptions.invisibleColor || [ 1, 0, 0, 1 ], 
            e[n].renderUniforms = r;
        }, t.getDefines = function() {
            return {
                HAS_VIEWSHED: 1
            };
        }, t.remove = function() {
            a.prototype.remove.call(this), this._viewshedPass && this._viewshedPass.dispose();
        }, e;
    }(Nc);
    function qc(e, t) {
        if (!e) return null;
        var n = e.coordinateToPoint(new r.Coordinate(t[0], t[1]), e.getGLZoom());
        return [ n.x, n.y, t[2] ];
    }
    "undefined" != typeof window && window.maptalks && (window.maptalks.ViewshedAnalysis = Lc);
    var Zc = function(n) {
        function e(e) {
            var t;
            return (t = n.call(this, e) || this).type = "floodAnalysis", t;
        }
        o(e, n);
        var t = e.prototype;
        return t.addTo = function(e) {
            return n.prototype.addTo.call(this, e), this.layer.addAnalysis(this), this;
        }, t.renderAnalysis = function(e) {
            n.prototype.renderAnalysis.call(this, e), e[this.getAnalysisType()].renderUniforms = this._createUniforms();
        }, t._createUniforms = function() {
            var e = {};
            return e.flood_waterHeight = this.options.waterHeight, e.flood_waterColor = this.options.waterColor, 
            e;
        }, t.getDefines = function() {
            return {
                HAS_FLOODANALYSE: 1
            };
        }, e;
    }(Nc);
    "undefined" != typeof window && window.maptalks && (window.maptalks.FloodAnalysis = Zc);
    var zc = function(a) {
        function e(e) {
            var t;
            return (t = a.call(this, e) || this).type = "skyline", t;
        }
        o(e, a);
        var t = e.prototype;
        return t.addTo = function(e) {
            var t = this;
            a.prototype.addTo.call(this, e);
            var n = this.layer.getRenderer();
            return n ? this._setSkylinePass(n) : this.layer.once("renderercreate", function(e) {
                t._setSkylinePass(e.renderer);
            }, this), this;
        }, t._setSkylinePass = function(e) {
            var t = {
                width: e.canvas.width,
                height: e.canvas.height
            }, n = new st(e._regl);
            this._skylinePass = new gi(n, t) || this._skylinePass, this.layer.addAnalysis(this), 
            this._ground = this._createGround(e._regl);
        }, t.renderAnalysis = function(e, t, n) {
            a.prototype.renderAnalysis.call(this, e), this._ground = this._ground || this._createGround();
            var r = this.layer.getMap();
            this._transformGround(r);
            var i = t.concat([ this._ground ]);
            this._skylinePass.render(i, n, {
                projViewMatrix: r.projViewMatrix,
                lineColor: this.options.lineColor,
                lineWidth: this.options.lineWidth
            });
        }, t._createGround = function(e) {
            var t = new Wn();
            return t.generateBuffers(e), t.data.aTexCoord = new Float32Array(8), new on(t);
        }, t._transformGround = function(e) {
            var t = Qf(this._ground.localTransform, e);
            this._ground.setLocalTransform(t);
        }, t.remove = function() {
            a.prototype.remove.call(this), this._skylinePass && this._skylinePass.dispose(), 
            this._ground && (this._ground.geometry.dispose(), delete this._ground);
        }, t.getDefines = function() {
            return null;
        }, e;
    }(Nc);
    "undefined" != typeof window && window.maptalks && (window.maptalks.SkylineAnalysis = zc);
    var Uc, Gc, Hc, kc, jc, Vc = document.createElement("canvas"), Xc = c({
        canvas: Vc,
        attributes: {
            depth: !1,
            stencil: !1,
            alpha: !1
        }
    }), Wc = ((Uc = Kc.prototype).getDirectionalLight = function() {
        return this._config && this._config.directional;
    }, Uc.getAmbientLight = function() {
        return this._config && this._config.ambient;
    }, Uc.getAmbientResource = function() {
        return this._iblMaps;
    }, Uc.setConfig = function(e) {
        var t, n, r = this._config;
        if (this._config = JSON.parse(JSON.stringify(e)), e && e.ambient && e.ambient.resource) {
            if (!(r && r.ambient && (t = r.ambient, n = e.ambient, t.resource && t.resource.url === n.resource.url))) return void this._initAmbientResources();
            this._iblMaps && e.ambient.resource.sh && (this._iblMaps.sh = e.ambient.resource.sh);
        } else this._disposeCubeLight();
        this._map.fire("updatelights");
    }, Uc._initAmbientResources = function() {
        var e = {
            url: this._config.ambient.resource.url,
            arrayBuffer: !0,
            hdr: !0,
            flipY: !0
        };
        this._hdr = new Vn(e, this._loader), this._hdr.once("complete", this.onHDRLoaded);
    }, Uc.dispose = function() {
        this._disposeCubeLight();
    }, Uc._onHDRLoaded = function() {
        this._hdr && (this._iblMaps = this._createIBLMaps(this._hdr), this._hdr.dispose(), 
        delete this._hdr, this._map.fire("updatelights", {
            ambientUpdate: !0
        }));
    }, Uc._createIBLMaps = function(e) {
        var t = this._config.ambient.resource, n = this._config.ambient.textureSize || 256, r = Ho.PBRHelper.createIBLMaps(Xc, {
            envTexture: e.getREGLTexture(Xc),
            rgbmRange: e.rgbmRange,
            ignoreSH: !!t.sh,
            envCubeSize: n,
            prefilterCubeSize: n,
            format: "array"
        });
        return e.dispose(), t.sh && (r.sh = t.sh), r;
    }, Uc._disposeCubeLight = function() {
        this._hdr && (this._hdr.dispose(), delete this._hdr), delete this._iblMaps;
    }, Kc);
    function Kc(e) {
        this._map = e, this._loader = new Bn(), this.onHDRLoaded = this._onHDRLoaded.bind(this);
    }
    r.Map.include({
        setLightConfig: function(e) {
            return this.options.lights = e, this._initLightManager(), this;
        },
        getLightConfig: function() {
            return this.options.lights;
        },
        _initLightManager: function() {
            this._lightManager || (this._lightManager = new Wc(this)), this._lightManager.setConfig(this.getLightConfig());
        },
        getLightManager: function() {
            if (!this._lightManager) throw new Error("map's light config is not set, use map.setLightConfig(config) to set lights.");
            return this._lightManager;
        }
    }), r.Map.addOnLoadHook(function() {
        this.options.lights && this._initLightManager();
    });
    var Yc = {
        color: [ 0, 0, 0, 0 ]
    }, Qc = {
        enable: !0
    };
    r.Map.include({
        setPostProcessConfig: function(e) {
            return this.options.postProcessConfig = e, this;
        },
        getPostProcessConfig: function() {
            return this.options.postProcessConfig;
        }
    });
    var Jc = r.renderer.MapCanvasRenderer.prototype.drawLayerCanvas;
    r.renderer.MapCanvasRenderer.prototype.drawLayerCanvas = function() {
        var e = Jc.apply(this, arguments);
        return e && function(n, e) {
            Gc || function(e, t) {
                Gc = document.createElement("canvas", e, t), Hc = c({
                    canvas: Gc,
                    attributes: {
                        depth: !1,
                        stencil: !1,
                        alpha: !0,
                        antialias: !1,
                        premultipliedAlpha: !1
                    }
                }), kc = Hc.texture({
                    mag: "linear",
                    min: "linear",
                    mipmap: !1,
                    flipY: !0,
                    width: e,
                    height: t
                }), jc = Hc.texture();
            }(e.width, e.height);
            var t = n.map.getPostProcessConfig();
            if (!t || !t.enable) return;
            Gc.width === e.width && Gc.height === e.height || (Gc.width = e.width, Gc.height = e.height);
            Hc.clear(Yc);
            var r = t.filmicGrain || Qc;
            void 0 === r.enable && (r.enable = !0);
            var i = t.vignette || Qc;
            void 0 === i.enable && (i.enable = !0);
            var a = t.colorLUT || Qc;
            void 0 === a.enable && (a.enable = !0);
            n._postProcessContext || (n._postProcessContext = {});
            var o = n._postProcessContext;
            if (a.enable) {
                var s = a.lut;
                if (!o.lutTexture || o.lutTexture.url !== s) {
                    var u = new Image();
                    u.onload = function() {
                        var e = {
                            data: u,
                            min: "linear",
                            mag: "linear"
                        }, t = o.lutTexture ? o.lutTexture.texture(e) : Hc.texture(e);
                        o.lutTexture = {
                            url: s,
                            texture: t
                        }, n.setLayerCanvasUpdated();
                    }, u.src = s;
                }
            }
            var f = {
                enableGrain: +!!r.enable,
                grainFactor: void 0 === r.factor ? .15 : r.factor,
                timeGrain: performance.now(),
                enableVignette: +!!i.enable,
                lensRadius: i.lensRadius || [ .8, .25 ],
                frameMod: 1,
                enableLut: +!!a.enable,
                lookupTable: o.lutTexture ? o.lutTexture.texture : jc
            };
            (void 0).postprocess(f, kc({
                width: Gc.width,
                height: Gc.height,
                data: e,
                flipY: !0,
                mag: "linear",
                min: "linear",
                mipmap: !1
            })), r.enable && n.setLayerCanvasUpdated();
            n.context.drawImage(Gc, 0, 0, Gc.width, Gc.height);
        }(this, this.canvas), e;
    };
    var $c = r.renderer.MapCanvasRenderer.prototype.renderFrame;
    r.renderer.MapCanvasRenderer.prototype.renderFrame = function() {
        var e = $c.apply(this, arguments), t = this.map.getPostProcessConfig(), n = t && t.filmicGrain;
        return !n || void 0 !== n.enable && !0 !== n.enable || this.setLayerCanvasUpdated(), 
        e;
    }, e.FloodAnalysis = Zc, e.GLContext = Wf, e.GroupGLLayer = Cc, e.HeatmapProcess = Pc, 
    e.SkylineAnalysis = zc, e.ViewshedAnalysis = Lc, e.createREGL = c, e.glMatrix = Jo, 
    e.mat2 = rs, e.mat2d = us, e.mat3 = vs, e.mat4 = As, e.quat = sf, e.quat2 = gf, 
    e.reshader = Xo, e.vec2 = qf, e.vec3 = Qs, e.vec4 = Au, Object.defineProperty(e, "__esModule", {
        value: !0
    }), "undefined" != typeof console && console.log("@maptalks/gl v0.15.4");
});
