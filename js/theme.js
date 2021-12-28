window.theme = {};
window.theme.fn = {
    getOptions: function (opts) {
        if (typeof (opts) == 'object') {
            return opts;
        } else if (typeof (opts) == 'string') {
            try {
                return JSON.parse(opts.replace(/'/g, '"').replace(';', ''));
            } catch (e) {
                return {};
            }
        } else {
            return {};
        }
    },
    execPluginFunction: function (functionName, context) {
        var args = Array.prototype.slice.call(arguments, 2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    },
    intObs: function (selector, functionName, intObsOptions, alwaysObserve) {
        var $el = document.querySelectorAll(selector);
        var intersectionObserverOptions = {
            rootMargin: '0px 0px 200px 0px'
        }
        if (Object.keys(intObsOptions).length) {
            intersectionObserverOptions = $.extend(intersectionObserverOptions, intObsOptions);
        }
        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.intersectionRatio > 0) {
                    if (typeof functionName === 'string') {
                        var func = Function('return ' + functionName)();
                    } else {
                        var callback = functionName;
                        callback.call($(entry.target));
                    }
                    if (!alwaysObserve) {
                        observer.unobserve(entry.target);
                    }
                }
            }
        }, intersectionObserverOptions);
        $($el).each(function () {
            observer.observe($(this)[0]);
        });
    },
    intObsInit: function (selector, functionName) {
        var $el = document.querySelectorAll(selector);
        var intersectionObserverOptions = {
            rootMargin: '200px'
        }
        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.intersectionRatio > 0) {
                    var $this = $(entry.target),
                        opts;
                    var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
                    if (pluginOptions)
                        opts = pluginOptions;
                    theme.fn.execPluginFunction(functionName, $this, opts);
                    observer.unobserve(entry.target);
                }
            }
        }, intersectionObserverOptions);
        $($el).each(function () {
            observer.observe($(this)[0]);
        });
    },
    dynIntObsInit: function (selector, functionName, pluginDefaults) {
        var $el = document.querySelectorAll(selector);
        $($el).each(function () {
            var $this = $(this),
                opts;
            var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
            if (pluginOptions)
                opts = pluginOptions;
            var mergedPluginDefaults = theme.fn.mergeOptions(pluginDefaults, opts)
            var intersectionObserverOptions = {
                rootMargin: theme.fn.getRootMargin(functionName, mergedPluginDefaults),
                threshold: 0
            }
            if (!mergedPluginDefaults.forceInit) {
                var observer = new IntersectionObserver(function (entries) {
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        if (entry.intersectionRatio > 0) {
                            theme.fn.execPluginFunction(functionName, $this, mergedPluginDefaults);
                            observer.unobserve(entry.target);
                        }
                    }
                }, intersectionObserverOptions);
                observer.observe($this[0]);
            } else {
                theme.fn.execPluginFunction(functionName, $this, mergedPluginDefaults);
            }
        });
    },
    getRootMargin: function (plugin, pluginDefaults) {
        switch (plugin) {
            case 'themePluginCounter':
                return pluginDefaults.accY ? '0px 0px ' + pluginDefaults.accY + 'px 0px' : '0px 0px 200px 0px';
                break;
            case 'themePluginAnimate':
                return pluginDefaults.accY ? '0px 0px ' + pluginDefaults.accY + 'px 0px' : '0px 0px 200px 0px';
                break;
            case 'themePluginIcon':
                return pluginDefaults.accY ? '0px 0px ' + pluginDefaults.accY + 'px 0px' : '0px 0px 200px 0px';
                break;
            case 'themePluginRandomImages':
                return pluginDefaults.accY ? '0px 0px ' + pluginDefaults.accY + 'px 0px' : '0px 0px 200px 0px';
                break;
            default:
                return '0px 0px 200px 0px';
                break;
        }
    },
    mergeOptions: function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    },
    execOnceTroughEvent: function ($el, event, callback) {
        var self = this,
            dataName = self.formatDataName(event);
        $($el).on(event, function () {
            if (!$(this).data(dataName)) {
                callback.call($(this));
                $(this).data(dataName, true);
                $(this).off(event);
            }
        });
        return this;
    },
    execOnceTroughWindowEvent: function ($el, event, callback) {
        var self = this,
            dataName = self.formatDataName(event);
        $($el).on(event, function () {
            if (!$(this).data(dataName)) {
                callback();
                $(this).data(dataName, true);
                $(this).off(event);
            }
        });
        return this;
    },
    formatDataName: function (name) {
        name = name.replace('.', '');
        return name;
    },
    isElementInView: function ($el) {
        var rect = $el[0].getBoundingClientRect();
        return (rect.top <= (window.innerHeight / 3));
    }
};


! function () {
    "use strict";
    if ("object" == typeof window)
        if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) "isIntersecting" in window.IntersectionObserverEntry.prototype || Object.defineProperty(window.IntersectionObserverEntry.prototype, "isIntersecting", {
            get: function () {
                return this.intersectionRatio > 0
            }
        });
        else {
            var t = function (t) {
                    for (var e = window.document, o = i(e); o;) o = i(e = o.ownerDocument);
                    return e
                }(),
                e = [],
                o = null,
                n = null;
            s.prototype.THROTTLE_TIMEOUT = 100, s.prototype.POLL_INTERVAL = null, s.prototype.USE_MUTATION_OBSERVER = !0, s._setupCrossOriginUpdater = function () {
                return o || (o = function (t, o) {
                    n = t && o ? l(t, o) : {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        width: 0,
                        height: 0
                    }, e.forEach(function (t) {
                        t._checkForIntersections()
                    })
                }), o
            }, s._resetCrossOriginUpdater = function () {
                o = null, n = null
            }, s.prototype.observe = function (t) {
                if (!this._observationTargets.some(function (e) {
                        return e.element == t
                    })) {
                    if (!t || 1 != t.nodeType) throw new Error("target must be an Element");
                    this._registerInstance(), this._observationTargets.push({
                        element: t,
                        entry: null
                    }), this._monitorIntersections(t.ownerDocument), this._checkForIntersections()
                }
            }, s.prototype.unobserve = function (t) {
                this._observationTargets = this._observationTargets.filter(function (e) {
                    return e.element != t
                }), this._unmonitorIntersections(t.ownerDocument), 0 == this._observationTargets.length && this._unregisterInstance()
            }, s.prototype.disconnect = function () {
                this._observationTargets = [], this._unmonitorAllIntersections(), this._unregisterInstance()
            }, s.prototype.takeRecords = function () {
                var t = this._queuedEntries.slice();
                return this._queuedEntries = [], t
            }, s.prototype._initThresholds = function (t) {
                var e = t || [0];
                return Array.isArray(e) || (e = [e]), e.sort().filter(function (t, e, o) {
                    if ("number" != typeof t || isNaN(t) || t < 0 || t > 1) throw new Error("threshold must be a number between 0 and 1 inclusively");
                    return t !== o[e - 1]
                })
            }, s.prototype._parseRootMargin = function (t) {
                var e = (t || "0px").split(/\s+/).map(function (t) {
                    var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
                    if (!e) throw new Error("rootMargin must be specified in pixels or percent");
                    return {
                        value: parseFloat(e[1]),
                        unit: e[2]
                    }
                });
                return e[1] = e[1] || e[0], e[2] = e[2] || e[0], e[3] = e[3] || e[1], e
            }, s.prototype._monitorIntersections = function (e) {
                var o = e.defaultView;
                if (o && -1 == this._monitoringDocuments.indexOf(e)) {
                    var n = this._checkForIntersections,
                        r = null,
                        s = null;
                    this.POLL_INTERVAL ? r = o.setInterval(n, this.POLL_INTERVAL) : (h(o, "resize", n, !0), h(e, "scroll", n, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in o && (s = new o.MutationObserver(n)).observe(e, {
                        attributes: !0,
                        childList: !0,
                        characterData: !0,
                        subtree: !0
                    })), this._monitoringDocuments.push(e), this._monitoringUnsubscribes.push(function () {
                        var t = e.defaultView;
                        t && (r && t.clearInterval(r), c(t, "resize", n, !0)), c(e, "scroll", n, !0), s && s.disconnect()
                    });
                    var u = this.root && (this.root.ownerDocument || this.root) || t;
                    if (e != u) {
                        var a = i(e);
                        a && this._monitorIntersections(a.ownerDocument)
                    }
                }
            }, s.prototype._unmonitorIntersections = function (e) {
                var o = this._monitoringDocuments.indexOf(e);
                if (-1 != o) {
                    var n = this.root && (this.root.ownerDocument || this.root) || t;
                    if (!this._observationTargets.some(function (t) {
                            var o = t.element.ownerDocument;
                            if (o == e) return !0;
                            for (; o && o != n;) {
                                var r = i(o);
                                if ((o = r && r.ownerDocument) == e) return !0
                            }
                            return !1
                        })) {
                        var r = this._monitoringUnsubscribes[o];
                        if (this._monitoringDocuments.splice(o, 1), this._monitoringUnsubscribes.splice(o, 1), r(), e != n) {
                            var s = i(e);
                            s && this._unmonitorIntersections(s.ownerDocument)
                        }
                    }
                }
            }, s.prototype._unmonitorAllIntersections = function () {
                var t = this._monitoringUnsubscribes.slice(0);
                this._monitoringDocuments.length = 0, this._monitoringUnsubscribes.length = 0;
                for (var e = 0; e < t.length; e++) t[e]()
            }, s.prototype._checkForIntersections = function () {
                if (this.root || !o || n) {
                    var t = this._rootIsInDom(),
                        e = t ? this._getRootRect() : {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            width: 0,
                            height: 0
                        };
                    this._observationTargets.forEach(function (n) {
                        var i = n.element,
                            s = u(i),
                            h = this._rootContainsTarget(i),
                            c = n.entry,
                            a = t && h && this._computeTargetAndRootIntersection(i, s, e),
                            l = null;
                        this._rootContainsTarget(i) ? o && !this.root || (l = e) : l = {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            width: 0,
                            height: 0
                        };
                        var f = n.entry = new r({
                            time: window.performance && performance.now && performance.now(),
                            target: i,
                            boundingClientRect: s,
                            rootBounds: l,
                            intersectionRect: a
                        });
                        c ? t && h ? this._hasCrossedThreshold(c, f) && this._queuedEntries.push(f) : c && c.isIntersecting && this._queuedEntries.push(f) : this._queuedEntries.push(f)
                    }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this)
                }
            }, s.prototype._computeTargetAndRootIntersection = function (e, i, r) {
                if ("none" != window.getComputedStyle(e).display) {
                    for (var s, h, c, a, f, d, g, m, v = i, _ = p(e), b = !1; !b && _;) {
                        var w = null,
                            y = 1 == _.nodeType ? window.getComputedStyle(_) : {};
                        if ("none" == y.display) return null;
                        if (_ == this.root || 9 == _.nodeType)
                            if (b = !0, _ == this.root || _ == t) o && !this.root ? !n || 0 == n.width && 0 == n.height ? (_ = null, w = null, v = null) : w = n : w = r;
                            else {
                                var I = p(_),
                                    E = I && u(I),
                                    T = I && this._computeTargetAndRootIntersection(I, E, r);
                                E && T ? (_ = I, w = l(E, T)) : (_ = null, v = null)
                            }
                        else {
                            var R = _.ownerDocument;
                            _ != R.body && _ != R.documentElement && "visible" != y.overflow && (w = u(_))
                        }
                        if (w && (s = w, h = v, c = void 0, a = void 0, f = void 0, d = void 0, g = void 0, m = void 0, c = Math.max(s.top, h.top), a = Math.min(s.bottom, h.bottom), f = Math.max(s.left, h.left), d = Math.min(s.right, h.right), m = a - c, v = (g = d - f) >= 0 && m >= 0 && {
                                top: c,
                                bottom: a,
                                left: f,
                                right: d,
                                width: g,
                                height: m
                            } || null), !v) break;
                        _ = _ && p(_)
                    }
                    return v
                }
            }, s.prototype._getRootRect = function () {
                var e;
                if (this.root && !d(this.root)) e = u(this.root);
                else {
                    var o = d(this.root) ? this.root : t,
                        n = o.documentElement,
                        i = o.body;
                    e = {
                        top: 0,
                        left: 0,
                        right: n.clientWidth || i.clientWidth,
                        width: n.clientWidth || i.clientWidth,
                        bottom: n.clientHeight || i.clientHeight,
                        height: n.clientHeight || i.clientHeight
                    }
                }
                return this._expandRectByRootMargin(e)
            }, s.prototype._expandRectByRootMargin = function (t) {
                var e = this._rootMarginValues.map(function (e, o) {
                        return "px" == e.unit ? e.value : e.value * (o % 2 ? t.width : t.height) / 100
                    }),
                    o = {
                        top: t.top - e[0],
                        right: t.right + e[1],
                        bottom: t.bottom + e[2],
                        left: t.left - e[3]
                    };
                return o.width = o.right - o.left, o.height = o.bottom - o.top, o
            }, s.prototype._hasCrossedThreshold = function (t, e) {
                var o = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
                    n = e.isIntersecting ? e.intersectionRatio || 0 : -1;
                if (o !== n)
                    for (var i = 0; i < this.thresholds.length; i++) {
                        var r = this.thresholds[i];
                        if (r == o || r == n || r < o != r < n) return !0
                    }
            }, s.prototype._rootIsInDom = function () {
                return !this.root || f(t, this.root)
            }, s.prototype._rootContainsTarget = function (e) {
                var o = this.root && (this.root.ownerDocument || this.root) || t;
                return f(o, e) && (!this.root || o == e.ownerDocument)
            }, s.prototype._registerInstance = function () {
                e.indexOf(this) < 0 && e.push(this)
            }, s.prototype._unregisterInstance = function () {
                var t = e.indexOf(this); - 1 != t && e.splice(t, 1)
            }, window.IntersectionObserver = s, window.IntersectionObserverEntry = r
        }
    function i(t) {
        try {
            return t.defaultView && t.defaultView.frameElement || null
        } catch (t) {
            return null
        }
    }

    function r(t) {
        this.time = t.time, this.target = t.target, this.rootBounds = a(t.rootBounds), this.boundingClientRect = a(t.boundingClientRect), this.intersectionRect = a(t.intersectionRect || {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
        }), this.isIntersecting = !!t.intersectionRect;
        var e = this.boundingClientRect,
            o = e.width * e.height,
            n = this.intersectionRect,
            i = n.width * n.height;
        this.intersectionRatio = o ? Number((i / o).toFixed(4)) : this.isIntersecting ? 1 : 0
    }

    function s(t, e) {
        var o, n, i, r = e || {};
        if ("function" != typeof t) throw new Error("callback must be a function");
        if (r.root && 1 != r.root.nodeType && 9 != r.root.nodeType) throw new Error("root must be a Document or Element");
        this._checkForIntersections = (o = this._checkForIntersections.bind(this), n = this.THROTTLE_TIMEOUT, i = null, function () {
            i || (i = setTimeout(function () {
                o(), i = null
            }, n))
        }), this._callback = t, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(r.rootMargin), this.thresholds = this._initThresholds(r.threshold), this.root = r.root || null, this.rootMargin = this._rootMarginValues.map(function (t) {
            return t.value + t.unit
        }).join(" "), this._monitoringDocuments = [], this._monitoringUnsubscribes = []
    }

    function h(t, e, o, n) {
        "function" == typeof t.addEventListener ? t.addEventListener(e, o, n || !1) : "function" == typeof t.attachEvent && t.attachEvent("on" + e, o)
    }

    function c(t, e, o, n) {
        "function" == typeof t.removeEventListener ? t.removeEventListener(e, o, n || !1) : "function" == typeof t.detatchEvent && t.detatchEvent("on" + e, o)
    }

    function u(t) {
        var e;
        try {
            e = t.getBoundingClientRect()
        } catch (t) {}
        return e ? (e.width && e.height || (e = {
            top: e.top,
            right: e.right,
            bottom: e.bottom,
            left: e.left,
            width: e.right - e.left,
            height: e.bottom - e.top
        }), e) : {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
        }
    }

    function a(t) {
        return !t || "x" in t ? t : {
            top: t.top,
            y: t.top,
            bottom: t.bottom,
            left: t.left,
            x: t.left,
            right: t.right,
            width: t.width,
            height: t.height
        }
    }

    function l(t, e) {
        var o = e.top - t.top,
            n = e.left - t.left;
        return {
            top: o,
            left: n,
            height: e.height,
            width: e.width,
            bottom: o + e.height,
            right: n + e.width
        }
    }

    function f(t, e) {
        for (var o = e; o;) {
            if (o == t) return !0;
            o = p(o)
        }
        return !1
    }

    function p(e) {
        var o = e.parentNode;
        return 9 == e.nodeType && e != t ? i(e) : (o && o.assignedSlot && (o = o.assignedSlot.parentNode), o && 11 == o.nodeType && o.host ? o.host : o)
    }

    function d(t) {
        return t && 9 === t.nodeType
    }
}();

(function ($) {
    $.extend({
        browserSelector: function () {
            (function (a) {
                (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
            })(navigator.userAgent || navigator.vendor || window.opera);
            var hasTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
            var u = navigator.userAgent,
                ua = u.toLowerCase(),
                is = function (t) {
                    return ua.indexOf(t) > -1;
                },
                g = 'gecko',
                w = 'webkit',
                s = 'safari',
                o = 'opera',
                h = document.documentElement,
                b = [(!(/opera|webtv/i.test(ua)) && /msie\s(\d)/.test(ua)) ? ('ie ie' + parseFloat(navigator.appVersion.split("MSIE")[1])) : is('firefox/2') ? g + ' ff2' : is('firefox/3.5') ? g + ' ff3 ff3_5' : is('firefox/3') ? g + ' ff3' : is('gecko/') ? g : is('opera') ? o + (/version\/(\d+)/.test(ua) ? ' ' + o + RegExp.jQuery1 : (/opera(\s|\/)(\d+)/.test(ua) ? ' ' + o + RegExp.jQuery2 : '')) : is('konqueror') ? 'konqueror' : is('chrome') ? w + ' chrome' : is('iron') ? w + ' iron' : is('applewebkit/') ? w + ' ' + s + (/version\/(\d+)/.test(ua) ? ' ' + s + RegExp.jQuery1 : '') : is('mozilla/') ? g : '', is('j2me') ? 'mobile' : is('iphone') ? 'iphone' : is('ipod') ? 'ipod' : is('mac') ? 'mac' : is('darwin') ? 'mac' : is('webtv') ? 'webtv' : is('win') ? 'win' : is('freebsd') ? 'freebsd' : (is('x11') || is('linux')) ? 'linux' : '', 'js'];
            c = b.join(' ');
            if ($.browser.mobile) {
                c += ' mobile';
            }
            if (hasTouch) {
                c += ' touch';
            }
            h.className += ' ' + c;
            var isEdge = /Edge/.test(navigator.userAgent);
            if (isEdge) {
                $('html').removeClass('chrome').addClass('edge');
            }
            var isIE11 = !(window.ActiveXObject) && "ActiveXObject" in window;
            if (isIE11) {
                $('html').removeClass('gecko').addClass('ie ie11');
                return;
            }
            if ($('body').hasClass('dark')) {
                $('html').addClass('dark');
            }
            if ($('body').hasClass('boxed')) {
                $('html').addClass('boxed');
            }
        }
    });
    $.browserSelector();
    theme.globalWindowWidth = $(window).width();
    var globalWindowWidth = $(window).width();
    window.onresize = function () {
        theme.globalWindowWidth = $(window).width();
    }
    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
        $(document).ready(function ($) {
            $('.thumb-info').attr('onclick', 'return true');
        });
    }
    if ($('a[data-bs-toggle="tab"]').length) {
        $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            var $tabPane = $($(e.target).attr('href'));
            if ($tabPane.length) {
                $tabPane.find('.owl-carousel').trigger('refresh.owl.carousel');
            }
            $(this).parents('.nav-tabs').find('.active').removeClass('active');
            $(this).addClass('active').parent().addClass('active');
        });
        if (window.location.hash) {
            $(window).on('load', function () {
                if (window.location.hash !== '*' && $(window.location.hash).get(0)) {
                    new bootstrap.Tab($('a.nav-link[href="' + window.location.hash + '"]:not([data-hash])')[0]).show();
                }
            });
        }
    }
    if (!$('html').hasClass('disable-onload-scroll') && window.location.hash && !['#*'].includes(window.location.hash)) {
        window.scrollTo(0, 0);
        $(window).on('load', function () {
            setTimeout(function () {
                var target = window.location.hash,
                    offset = ($(window).width() < 768) ? 180 : 90;
                if (!$(target).length) {
                    return;
                }
                if ($("a[href$='" + window.location.hash + "']").is('[data-hash-offset]')) {
                    offset = parseInt($("a[href$='" + window.location.hash + "']").first().attr('data-hash-offset'));
                } else if ($("html").is('[data-hash-offset]')) {
                    offset = parseInt($("html").attr('data-hash-offset'));
                }
                if (isNaN(offset)) {
                    offset = 0;
                }
                $('body').addClass('scrolling');
                $('html, body').animate({
                    scrollTop: $(target).offset().top - offset
                }, 600, 'easeOutQuad', function () {
                    $('body').removeClass('scrolling');
                });
            }, 1);
        });
    }
    $.fn.extend({
        textRotator: function (options) {
            var defaults = {
                fadeSpeed: 500,
                pauseSpeed: 100,
                child: null
            };
            var options = $.extend(defaults, options);
            return this.each(function () {
                var o = options;
                var obj = $(this);
                var items = $(obj.children(), obj);
                items.each(function () {
                    $(this).hide();
                })
                if (!o.child) {
                    var next = $(obj).children(':first');
                } else {
                    var next = o.child;
                }
                $(next).fadeIn(o.fadeSpeed, function () {
                    $(next).delay(o.pauseSpeed).fadeOut(o.fadeSpeed, function () {
                        var next = $(this).next();
                        if (next.length == 0) {
                            next = $(obj).children(':first');
                        }
                        $(obj).textRotator({
                            child: next,
                            fadeSpeed: o.fadeSpeed,
                            pauseSpeed: o.pauseSpeed
                        });
                    })
                });
            });
        }
    });
    var $noticeTopBar = {
        $wrapper: $('.notice-top-bar'),
        $closeBtn: $('.notice-top-bar-close'),
        $header: $('#header'),
        $body: $('.body'),
        init: function () {
            var self = this;
            if (!$.cookie('portoNoticeTopBarClose')) {
                self.build().events();
            } else {
                self.$wrapper.parent().prepend('<!-- Notice Top Bar removed by cookie -->');
                self.$wrapper.remove();
            }
            return this;
        },
        build: function () {
            var self = this;
            $(window).on('load', function () {
                setTimeout(function () {
                    self.$body.css({
                        'margin-top': self.$wrapper.outerHeight(),
                        'transition': 'ease margin 300ms'
                    });
                    $('#noticeTopBarContent').textRotator({
                        fadeSpeed: 500,
                        pauseSpeed: 5000
                    });
                    if (['absolute', 'fixed'].includes(self.$header.css('position'))) {
                        self.$header.css({
                            'top': self.$wrapper.outerHeight(),
                            'transition': 'ease top 300ms'
                        });
                    }
                    $(window).trigger('notice.top.bar.opened');
                }, 1000);
            });
            return this;
        },
        events: function () {
            var self = this;
            self.$closeBtn.on('click', function (e) {
                e.preventDefault();
                self.$body.animate({
                    'margin-top': 0,
                }, 300, function () {
                    self.$wrapper.remove();
                    self.saveCookie();
                });
                if (['absolute', 'fixed'].includes(self.$header.css('position'))) {
                    self.$header.animate({
                        top: 0
                    }, 300);
                }
                if (self.$header.hasClass('header-effect-shrink')) {
                    self.$header.find('.header-body').animate({
                        top: 0
                    }, 300);
                }
                $(window).trigger('notice.top.bar.closed');
            });
            return this;
        },
        checkCookie: function () {
            var self = this;
            if ($.cookie('portoNoticeTopBarClose')) {
                return true;
            } else {
                return false;
            }
            return this;
        },
        saveCookie: function () {
            var self = this;
            $.cookie('portoNoticeTopBarClose', true);
            return this;
        }
    }
    if ($('.notice-top-bar').length) {
        $noticeTopBar.init();
    }
    if ($('.image-hotspot').length) {
        $('.image-hotspot').append('<span class="ring"></span>').append('<span class="circle"></span>');
    }
    if ($('body[data-plugin-page-transition]').length) {
        var link_click = false;
        $(document).on('click', 'a', function (e) {
            link_click = $(this);
        });
        $(window).on("beforeunload", function (e) {
            if (typeof link_click === 'object') {
                var href = link_click.attr('href');
                if (href.indexOf('mailto:') != 0 && href.indexOf('tel:') != 0 && !link_click.data('rm-from-transition')) {
                    $('body').addClass('page-transition-active');
                }
            }
        });
        $(window).on("pageshow", function (e) {
            if (e.persisted) {
                if ($('html').hasClass('safari')) {
                    window.location.reload();
                }
                $('body').removeClass('page-transition-active');
            }
        });
    }
    if ($('.thumb-info-floating-caption').length) {
        $('.thumb-info-floating-caption').on('mouseenter', function () {
            if (!$('.thumb-info-floating-caption-title').length) {
                $('.body').append('<div class="thumb-info-floating-caption-title">' + $(this).data('title') + '</div>');
                if ($(this).data('type')) {
                    $('.thumb-info-floating-caption-title').append('<div class="thumb-info-floating-caption-type">' + $(this).data('type') + '</div>').css({
                        'padding-bottom': 22
                    });
                }
                if ($(this).hasClass('thumb-info-floating-caption-clean')) {
                    $('.thumb-info-floating-caption-title').addClass('bg-transparent');
                }
            }
        }).on('mouseout', function () {
            $('.thumb-info-floating-caption-title').remove();
        });
        $(document).on('mousemove', function (e) {
            $('.thumb-info-floating-caption-title').css({
                position: 'fixed',
                left: e.clientX - 20,
                top: e.clientY + 20
            });
        });
    }
    $('[data-toggle-text-click]').on('click', function () {
        $(this).text(function (i, text) {
            return text === $(this).attr('data-toggle-text-click') ? $(this).attr('data-toggle-text-click-alt') : $(this).attr('data-toggle-text-click');
        });
    });
    if ($('.shape-divider').length) {
        aspectRatioSVG();
        $(window).on('resize', function () {
            aspectRatioSVG();
        });
    }
    if ($('.shape-divider-horizontal-animation').length) {
        theme.fn.intObs('.shape-divider-horizontal-animation', function () {
            for (var i = 0; i <= 1; i++) {
                var svgClone = $(this).find('svg:nth-child(1)').clone();
                $(this).append(svgClone)
            }
            $(this).addClass('start');
        }, {});
    }
    $('[data-porto-toggle-class]').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass($(this).data('porto-toggle-class'));
    });
    var $window = $(window);
    $window.on('resize dynamic.height.resize', function () {
        $('[data-dynamic-height]').each(function () {
            var $this = $(this),
                values = JSON.parse($this.data('dynamic-height').replace(/'/g, '"').replace(';', ''))
            if ($window.width() < 576) {
                $this.height(values[4]);
            }
            if ($window.width() > 575 && $window.width() < 768) {
                $this.height(values[3]);
            }
            if ($window.width() > 767 && $window.width() < 992) {
                $this.height(values[2]);
            }
            if ($window.width() > 991 && $window.width() < 1200) {
                $this.height(values[1]);
            }
            if ($window.width() > 1199) {
                $this.height(values[0]);
            }
        });
    });
    if ($window.width() < 992) {
        $window.trigger('dynamic.height.resize');
    }
    if ($('[data-trigger-play-video]').length) {
        theme.fn.execOnceTroughEvent('[data-trigger-play-video]', 'mouseover.trigger.play.video', function () {
            var $video = $($(this).data('trigger-play-video'));
            $(this).on('click', function (e) {
                e.preventDefault();
                if ($(this).data('trigger-play-video-remove') == 'yes') {
                    $(this).animate({
                        opacity: 0
                    }, 300, function () {
                        $video[0].play();
                        $(this).remove();
                    });
                } else {
                    setTimeout(function () {
                        $video[0].play();
                    }, 300);
                }
            });
        });
    }
    if ($('video[data-auto-play]').length) {
        $(window).on('load', function () {
            $('video[data-auto-play]').each(function () {
                var $video = $(this);
                setTimeout(function () {
                    if ($('#' + $video.attr('id')).length) {
                        if ($('[data-trigger-play-video="#' + $video.attr('id') + '"]').data('trigger-play-video-remove') == 'yes') {
                            $('[data-trigger-play-video="#' + $video.attr('id') + '"]').animate({
                                opacity: 0
                            }, 300, function () {
                                $video[0].play();
                                $('[data-trigger-play-video="#' + $video.attr('id') + '"]').remove();
                            });
                        } else {
                            setTimeout(function () {
                                $video[0].play();
                            }, 300);
                        }
                    }
                }, 100);
            });
        });
    }
    if ($('[data-remove-min-height]').length) {
        $(window).on('load', function () {
            $('[data-remove-min-height]').each(function () {
                $(this).css({
                    'min-height': 0
                });
            });
        });
    }
    if ($('.style-switcher-open-loader').length) {
        $('.style-switcher-open-loader').on('click', function (e) {
            e.preventDefault();
            var $this = $(this);
            $this.addClass('style-switcher-open-loader-loading');
            var basePath = $(this).data('base-path'),
                skinSrc = $(this).data('skin-src');
            var script1 = document.createElement("script");
            script1.src = basePath + "master/style-switcher/style.switcher.localstorage.js";
            var script2 = document.createElement("script");
            script2.src = basePath + "master/style-switcher/style.switcher.js";
            script2.id = "styleSwitcherScript";
            script2.setAttribute('data-base-path', basePath);
            script2.setAttribute('data-skin-src', skinSrc);
            script2.onload = function () {
                setTimeout(function () {
                    function checkIfReady() {
                        if (!$('.style-switcher-open').length) {
                            window.setTimeout(checkIfReady, 100);
                        } else {
                            $('.style-switcher-open').trigger('click');
                        }
                    }
                    checkIfReady();
                }, 500);
            }
            document.body.appendChild(script1);
            document.body.appendChild(script2);
        });
    }
    try {
        if (window.location !== window.parent.location) {
            $(window).on('load', function () {
                $el = $('<a />').addClass('remove-envato-frame').attr({
                    'href': window.location.href,
                    'target': '_parent'
                }).text('Remove Frame');
                $('body').append($el);
            });
        }
    } catch (e) {
        console.log(e);
    }
})(jQuery);

function scrollAndFocus($this, scrollTarget, focusTarget, scrollOffset, scrollAgain) {
    (function ($) {
        $('body').addClass('scrolling');
        if ($($this).closest('#mainNav').length) {
            $($this).parents('.collapse.show').collapse('hide');
        }
        $('html, body').animate({
            scrollTop: $(scrollTarget).offset().top - (scrollOffset ? scrollOffset : 0)
        }, 300, function () {
            $('body').removeClass('scrolling');
            setTimeout(function () {
                $(focusTarget).focus();
            }, 500);
            if (scrollAgain) {
                $('html, body').animate({
                    scrollTop: $(scrollTarget).offset().top - (scrollOffset ? scrollOffset : 0)
                });
            }
        });
    })(jQuery);
}

function aspectRatioSVG() {
    if ($(window).width() < 1950) {
        $('.shape-divider svg[preserveAspectRatio]').each(function () {
            if (!$(this).parent().hasClass('shape-divider-horizontal-animation')) {
                $(this).attr('preserveAspectRatio', 'xMinYMin');
            } else {
                $(this).attr('preserveAspectRatio', 'none');
            }
        });
    } else {
        $('.shape-divider svg[preserveAspectRatio]').each(function () {
            $(this).attr('preserveAspectRatio', 'none');
        });
    }
}
document.addEventListener('lazybeforeunveil', function (e) {
    var bg = e.target.getAttribute('data-bg-src');
    if (bg) {
        e.target.style.backgroundImage = 'url(' + bg + ')';
    }
});
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    var CountTo = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
        this.init();
    };
    CountTo.DEFAULTS = {
        from: 0,
        to: 0,
        speed: 1000,
        refreshInterval: 100,
        decimals: 0,
        formatter: formatter,
        onUpdate: null,
        onComplete: null
    };
    CountTo.prototype.init = function () {
        this.value = this.options.from;
        this.loops = Math.ceil(this.options.speed / this.options.refreshInterval);
        this.loopCount = 0;
        this.increment = (this.options.to - this.options.from) / this.loops;
    };
    CountTo.prototype.dataOptions = function () {
        var options = {
            from: this.$element.data('from'),
            to: this.$element.data('to'),
            speed: this.$element.data('speed'),
            refreshInterval: this.$element.data('refresh-interval'),
            decimals: this.$element.data('decimals')
        };
        var keys = Object.keys(options);
        for (var i in keys) {
            var key = keys[i];
            if (typeof (options[key]) === 'undefined') {
                delete options[key];
            }
        }
        return options;
    };
    CountTo.prototype.update = function () {
        this.value += this.increment;
        this.loopCount++;
        this.render();
        if (typeof (this.options.onUpdate) == 'function') {
            this.options.onUpdate.call(this.$element, this.value);
        }
        if (this.loopCount >= this.loops) {
            clearInterval(this.interval);
            this.value = this.options.to;
            if (typeof (this.options.onComplete) == 'function') {
                this.options.onComplete.call(this.$element, this.value);
            }
        }
    };
    CountTo.prototype.render = function () {
        var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
        this.$element.text(formattedValue);
    };
    CountTo.prototype.restart = function () {
        this.stop();
        this.init();
        this.start();
    };
    CountTo.prototype.start = function () {
        this.stop();
        this.render();
        this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
    };
    CountTo.prototype.stop = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    };
    CountTo.prototype.toggle = function () {
        if (this.interval) {
            this.stop();
        } else {
            this.start();
        }
    };

    function formatter(value, options) {
        return value.toFixed(options.decimals);
    }
    $.fn.countTo = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('countTo');
            var init = !data || typeof (option) === 'object';
            var options = typeof (option) === 'object' ? option : {};
            var method = typeof (option) === 'string' ? option : 'start';
            if (init) {
                if (data) data.stop();
                $this.data('countTo', data = new CountTo(this, options));
            }
            data[method].call(data);
        });
    };
}));


(function ($) {
    $.fn.visible = function (partial, hidden, direction, container) {
        if (this.length < 1)
            return;
        var $t = this.length > 1 ? this.eq(0) : this,
            isContained = typeof container !== 'undefined' && container !== null,
            $w = isContained ? $(container) : $(window),
            wPosition = isContained ? $w.position() : 0,
            t = $t.get(0),
            vpWidth = $w.outerWidth(),
            vpHeight = $w.outerHeight(),
            direction = (direction) ? direction : 'both',
            clientSize = hidden === true ? t.offsetWidth * t.offsetHeight : true;
        if (typeof t.getBoundingClientRect === 'function') {
            var rec = t.getBoundingClientRect(),
                tViz = isContained ? rec.top - wPosition.top >= 0 && rec.top < vpHeight + wPosition.top : rec.top >= 0 && rec.top < vpHeight,
                bViz = isContained ? rec.bottom - wPosition.top > 0 && rec.bottom <= vpHeight + wPosition.top : rec.bottom > 0 && rec.bottom <= vpHeight,
                lViz = isContained ? rec.left - wPosition.left >= 0 && rec.left < vpWidth + wPosition.left : rec.left >= 0 && rec.left < vpWidth,
                rViz = isContained ? rec.right - wPosition.left > 0 && rec.right < vpWidth + wPosition.left : rec.right > 0 && rec.right <= vpWidth,
                vVisible = partial ? tViz || bViz : tViz && bViz,
                hVisible = partial ? lViz || rViz : lViz && rViz;
            if (direction === 'both')
                return clientSize && vVisible && hVisible;
            else if (direction === 'vertical')
                return clientSize && vVisible;
            else if (direction === 'horizontal')
                return clientSize && hVisible;
        } else {
            var viewTop = isContained ? 0 : wPosition,
                viewBottom = viewTop + vpHeight,
                viewLeft = $w.scrollLeft(),
                viewRight = viewLeft + vpWidth,
                position = $t.position(),
                _top = position.top,
                _bottom = _top + $t.height(),
                _left = position.left,
                _right = _left + $t.width(),
                compareTop = partial === true ? _bottom : _top,
                compareBottom = partial === true ? _top : _bottom,
                compareLeft = partial === true ? _right : _left,
                compareRight = partial === true ? _left : _right;
            if (direction === 'both')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop)) && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
            else if (direction === 'vertical')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
            else if (direction === 'horizontal')
                return !!clientSize && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
        }
    };
})(jQuery);;



(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    var eventNamespace = 'waitForImages';
    var hasSrcset = (function (img) {
        return img.srcset && img.sizes;
    })(new Image());
    $.waitForImages = {
        hasImageProperties: ['backgroundImage', 'listStyleImage', 'borderImage', 'borderCornerImage', 'cursor'],
        hasImageAttributes: ['srcset']
    };
    $.expr.pseudos['has-src'] = function (obj) {
        return $(obj).is('img[src][src!=""]');
    };
    $.expr.pseudos.uncached = function (obj) {
        if (!$(obj).is(':has-src')) {
            return false;
        }
        return !obj.complete;
    };
    $.fn.waitForImages = function () {
        var allImgsLength = 0;
        var allImgsLoaded = 0;
        var deferred = $.Deferred();
        var originalCollection = this;
        var allImgs = [];
        var hasImgProperties = $.waitForImages.hasImageProperties || [];
        var hasImageAttributes = $.waitForImages.hasImageAttributes || [];
        var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
        var finishedCallback;
        var eachCallback;
        var waitForAll;
        if ($.isPlainObject(arguments[0])) {
            waitForAll = arguments[0].waitForAll;
            eachCallback = arguments[0].each;
            finishedCallback = arguments[0].finished;
        } else {
            if (arguments.length === 1 && $.type(arguments[0]) === 'boolean') {
                waitForAll = arguments[0];
            } else {
                finishedCallback = arguments[0];
                eachCallback = arguments[1];
                waitForAll = arguments[2];
            }
        }
        finishedCallback = finishedCallback || $.noop;
        eachCallback = eachCallback || $.noop;
        waitForAll = !!waitForAll;
        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
            throw new TypeError('An invalid callback was supplied.');
        }
        this.each(function () {
            var obj = $(this);
            if (waitForAll) {
                obj.find('*').addBack().each(function () {
                    var element = $(this);
                    if (element.is('img:has-src') && !element.is('[srcset]')) {
                        allImgs.push({
                            src: element.attr('src'),
                            element: element[0]
                        });
                    }
                    $.each(hasImgProperties, function (i, property) {
                        var propertyValue = element.css(property);
                        var match;
                        if (!propertyValue) {
                            return true;
                        }
                        while (match = matchUrl.exec(propertyValue)) {
                            allImgs.push({
                                src: match[2],
                                element: element[0]
                            });
                        }
                    });
                    $.each(hasImageAttributes, function (i, attribute) {
                        var attributeValue = element.attr(attribute);
                        var attributeValues;
                        if (!attributeValue) {
                            return true;
                        }
                        allImgs.push({
                            src: element.attr('src'),
                            srcset: element.attr('srcset'),
                            element: element[0]
                        });
                    });
                });
            } else {
                obj.find('img:has-src').each(function () {
                    allImgs.push({
                        src: this.src,
                        element: this
                    });
                });
            }
        });
        allImgsLength = allImgs.length;
        allImgsLoaded = 0;
        if (allImgsLength === 0) {
            finishedCallback.call(originalCollection);
            deferred.resolveWith(originalCollection);
        }
        $.each(allImgs, function (i, img) {
            var image = new Image();
            var events = 'load.' + eventNamespace + ' error.' + eventNamespace;
            $(image).one(events, function me(event) {
                var eachArguments = [allImgsLoaded, allImgsLength, event.type == 'load'];
                allImgsLoaded++;
                eachCallback.apply(img.element, eachArguments);
                deferred.notifyWith(img.element, eachArguments);
                $(this).off(events, me);
                if (allImgsLoaded == allImgsLength) {
                    finishedCallback.call(originalCollection[0]);
                    deferred.resolveWith(originalCollection[0]);
                    return false;
                }
            });
            if (hasSrcset && img.srcset) {
                image.srcset = img.srcset;
                image.sizes = img.sizes;
            }
            image.src = img.src;
        });
        return deferred.promise();
    };
}));






(function (theme, $) {
    theme = theme || {};
    var instanceName = '__masonry';
    var PluginMasonry = function ($el, opts) {
        return this.initialize($el, opts);
    };
    PluginMasonry.defaults = {};
    PluginMasonry.prototype = {
        initialize: function ($el, opts) {
            if ($el.data(instanceName)) {
                return this;
            }
            this.$el = $el;
            this.setData().setOptions(opts).build();
            return this;
        },
        setData: function () {
            this.$el.data(instanceName, this);
            return this;
        },
        setOptions: function (opts) {
            this.options = $.extend(true, {}, PluginMasonry.defaults, opts, {
                wrapper: this.$el
            });
            return this;
        },
        build: function () {
            if (!($.isFunction($.fn.isotope))) {
                return this;
            }
            var self = this,
                $window = $(window);
            self.$loader = false;
            if (self.options.wrapper.parents('.masonry-loader').get(0)) {
                self.$loader = self.options.wrapper.parents('.masonry-loader');
                self.createLoader();
            }
            self.options.wrapper.one('layoutComplete', function (event, laidOutItems) {
                self.removeLoader();
            });
            self.options.wrapper.waitForImages(function () {
                self.options.wrapper.isotope(self.options);
            });
            if ($('html').hasClass('ie10') || $('html').hasClass('ie11')) {
                var padding = parseInt(self.options.wrapper.children().css('padding-left')) + parseInt(self.options.wrapper.children().css('padding-right'));
            }
            $(window).on('resize', function () {
                setTimeout(function () {
                    self.options.wrapper.isotope('layout');
                }, 300);
            });
            setTimeout(function () {
                self.removeLoader();
            }, 3000);
            return this;
        },
        createLoader: function () {
            var self = this;
            var loaderTemplate = ['<div class="bounce-loader">', '<div class="bounce1"></div>', '<div class="bounce2"></div>', '<div class="bounce3"></div>', '</div>'].join('');
            self.$loader.append(loaderTemplate);
            return this;
        },
        removeLoader: function () {
            var self = this;
            if (self.$loader) {
                self.$loader.removeClass('masonry-loader-showing');
                setTimeout(function () {
                    self.$loader.addClass('masonry-loader-loaded');
                }, 300);
            }
        }
    };
    $.extend(theme, {
        PluginMasonry: PluginMasonry
    });
    $.fn.themePluginMasonry = function (opts) {
        return this.map(function () {
            var $this = $(this);
            if ($this.data(instanceName)) {
                return $this.data(instanceName);
            } else {
                return new PluginMasonry($this, opts);
            }
        });
    }
}).apply(this, [window.theme, jQuery]);
(function (theme, $) {
    theme = theme || {};
    var instanceName = '__matchHeight';
    var PluginMatchHeight = function ($el, opts) {
        return this.initialize($el, opts);
    };
    PluginMatchHeight.defaults = {
        byRow: true,
        property: 'height',
        target: null,
        remove: false
    };
    PluginMatchHeight.prototype = {
        initialize: function ($el, opts) {
            if ($el.data(instanceName)) {
                return this;
            }
            this.$el = $el;
            this.setData().setOptions(opts).build();
            return this;
        },
        setData: function () {
            this.$el.data(instanceName, this);
            return this;
        },
        setOptions: function (opts) {
            this.options = $.extend(true, {}, PluginMatchHeight.defaults, opts, {
                wrapper: this.$el
            });
            return this;
        },
        build: function () {
            if (!($.isFunction($.fn.matchHeight))) {
                return this;
            }
            var self = this;
            self.options.wrapper.matchHeight(self.options);
            return this;
        }
    };
    $.extend(theme, {
        PluginMatchHeight: PluginMatchHeight
    });
    $.fn.themePluginMatchHeight = function (opts) {
        return this.map(function () {
            var $this = $(this);
            if ($this.data(instanceName)) {
                return $this.data(instanceName);
            } else {
                return new PluginMatchHeight($this, opts);
            }
        });
    }
}).apply(this, [window.theme, jQuery]);
(function (theme, $) {
    theme = theme || {};
    var instanceName = '__parallax';
    var PluginParallax = function ($el, opts) {
        return this.initialize($el, opts);
    };
    PluginParallax.defaults = {
        speed: 1.5,
        horizontalPosition: '50%',
        offset: 0,
        parallaxDirection: 'top',
        parallaxHeight: '180%',
        scrollableParallax: false,
        scrollableParallaxMinWidth: 991,
        startOffset: 7,
        transitionDuration: '200ms',
        cssProperty: 'width',
        cssValueStart: 40,
        cssValueEnd: 100,
        cssValueUnit: 'vw',
        mouseParallax: false
    };
    PluginParallax.prototype = {
        initialize: function ($el, opts) {
            if ($el.data(instanceName)) {
                return this;
            }
            this.$el = $el;
            this.setData().setOptions(opts).build();
            return this;
        },
        setData: function () {
            this.$el.data(instanceName, this);
            return this;
        },
        setOptions: function (opts) {
            this.options = $.extend(true, {}, PluginParallax.defaults, opts, {
                wrapper: this.$el
            });
            return this;
        },
        build: function () {
            var self = this,
                $window = $(window),
                offset, yPos, bgpos, background, rotateY;
            if (self.options.mouseParallax) {
                $window.mousemove(function (e) {
                    $('.parallax-mouse-object', self.options.wrapper).each(function () {
                        var moving_value = $(this).attr('data-value');
                        var x = (e.clientX * moving_value) / 250;
                        var y = (e.clientY * moving_value) / 250;
                        $(this).css('transform', 'translateX(' + x + 'px) translateY(' + y + 'px)');
                    });
                });
                return this;
            }
            if (self.options.scrollableParallax && $(window).width() > self.options.scrollableParallaxMinWidth) {
                var $scrollableWrapper = self.options.wrapper.find('.scrollable-parallax-wrapper');
                if ($scrollableWrapper.get(0)) {
                    var progress = ($(window).scrollTop() > (self.options.wrapper.offset().top + $(window).outerHeight())) ? self.options.cssValueEnd : self.options.cssValueStart,
                        cssValueUnit = self.options.cssValueUnit ? self.options.cssValueUnit : '';
                    $scrollableWrapper.css({
                        'background-image': 'url(' + self.options.wrapper.data('image-src') + ')',
                        'background-size': 'cover',
                        'background-position': 'center',
                        'background-attachment': 'fixed',
                        'transition': 'ease ' + self.options.cssProperty + ' ' + self.options.transitionDuration,
                        'width': progress + '%'
                    });
                    $(window).on('scroll', function (e) {
                        if (self.options.wrapper.visible(true)) {
                            var $window = $(window),
                                scrollTop = $window.scrollTop(),
                                elementOffset = self.options.wrapper.offset().top,
                                currentElementOffset = (elementOffset - scrollTop);
                            var scrollPercent = Math.abs(+(currentElementOffset - $window.height()) / (self.options.startOffset ? self.options.startOffset : 7));
                            if (scrollPercent <= self.options.cssValueEnd && progress <= self.options.cssValueEnd) {
                                progress = self.options.cssValueStart + scrollPercent;
                            }
                            if (progress > self.options.cssValueEnd) {
                                progress = self.options.cssValueEnd;
                            }
                            if (progress < self.options.cssValueStart) {
                                progress = self.options.cssValueStart;
                            }
                            var styles = {}
                            styles[self.options.cssProperty] = progress + cssValueUnit;
                            $scrollableWrapper.css(styles);
                        }
                    });
                }
                return;
            }
            if (self.options.fadeIn) {
                background = $('<div class="parallax-background fadeIn animated"></div>');
            } else {
                background = $('<div class="parallax-background"></div>');
            }
            background.css({
                'background-image': 'url(' + self.options.wrapper.data('image-src') + ')',
                'background-size': 'cover',
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'width': '100%',
                'height': self.options.parallaxHeight
            });
            self.options.wrapper.prepend(background);
            self.options.wrapper.css({
                'position': 'relative',
                'overflow': 'hidden'
            });
            var parallaxEffectOnScrolResize = function () {
                $window.on('scroll resize', function () {
                    offset = self.options.wrapper.offset();
                    yPos = -($window.scrollTop() - (offset.top - 100)) / ((self.options.speed + 2));
                    plxPos = (yPos < 0) ? Math.abs(yPos) : -Math.abs(yPos);
                    rotateY = ($('html[dir="rtl"]').get(0)) ? ' rotateY(180deg)' : '';
                    if (self.options.parallaxDirection == 'bottom') {
                        self.options.offset = 250;
                    }
                    var y = ((plxPos - 50) + (self.options.offset));
                    if (self.options.parallaxDirection == 'bottom') {
                        y = (y < 0) ? Math.abs(y) : -Math.abs(y);
                    }
                    background.css({
                        'transform': 'translate3d(0, ' + y + 'px, 0)' + rotateY,
                        'background-position-x': self.options.horizontalPosition
                    });
                });
                $window.trigger('scroll');
            }
            if (!$.browser.mobile) {
                parallaxEffectOnScrolResize();
            } else {
                if (self.options.enableOnMobile == true) {
                    parallaxEffectOnScrolResize();
                } else {
                    self.options.wrapper.addClass('parallax-disabled');
                }
            }
            return this;
        }
    };
    $.extend(theme, {
        PluginParallax: PluginParallax
    });
    $.fn.themePluginParallax = function (opts) {
        return this.map(function () {
            var $this = $(this);
            if ($this.data(instanceName)) {
                return $this.data(instanceName);
            } else {
                return new PluginParallax($this, opts);
            }
        });
    }
}).apply(this, [window.theme, jQuery]);











(function (theme, $) {
    theme = theme || {};
    var instanceName = '__sort';
    var PluginSort = function ($el, opts) {
        return this.initialize($el, opts);
    };
    PluginSort.defaults = {
        useHash: true,
        itemSelector: '.isotope-item',
        layoutMode: 'masonry',
        filter: '*',
        hiddenStyle: {
            opacity: 0
        },
        visibleStyle: {
            opacity: 1
        },
        stagger: 30,
        isOriginLeft: ($('html').attr('dir') == 'rtl' ? false : true)
    };
    PluginSort.prototype = {
        initialize: function ($el, opts) {
            if ($el.data(instanceName)) {
                return this;
            }
            this.$el = $el;
            this.setData().setOptions(opts).build();
            return this;
        },
        setData: function () {
            this.$el.data(instanceName, this);
            return this;
        },
        setOptions: function (opts) {
            this.options = $.extend(true, {}, PluginSort.defaults, opts, {
                wrapper: this.$el
            });
            return this;
        },
        build: function () {
            if (!($.isFunction($.fn.isotope))) {
                return this;
            }
            var self = this,
                $source = this.options.wrapper,
                $destination = $('.sort-destination[data-sort-id="' + $source.attr('data-sort-id') + '"]'),
                $window = $(window);
            if ($destination.get(0)) {
                self.$source = $source;
                self.$destination = $destination;
                self.$loader = false;
                self.setParagraphHeight($destination);
                if (self.$destination.parents('.sort-destination-loader').get(0)) {
                    self.$loader = self.$destination.parents('.sort-destination-loader');
                    self.createLoader();
                }
                $destination.attr('data-filter', '*');
                $destination.one('layoutComplete', function (event, laidOutItems) {
                    self.removeLoader();
                    if ($('[data-plugin-sticky]').length) {
                        setTimeout(function () {
                            $('[data-plugin-sticky]').each(function () {
                                $(this).data('__sticky').build();
                                $(window).trigger('resize');
                            });
                        }, 500);
                    }
                });
                if ($('html').hasClass('ie10') || $('html').hasClass('ie11')) {
                    var padding = parseInt(self.options.wrapper.children().css('padding-left')) + parseInt(self.options.wrapper.children().css('padding-right'));
                }
                $destination.waitForImages(function () {
                    $destination.isotope(self.options);
                    self.events();
                });
                setTimeout(function () {
                    self.removeLoader();
                }, 3000);
            }
            return this;
        },
        events: function () {
            var self = this,
                filter = null,
                $window = $(window);
            self.$source.find('a').click(function (e) {
                e.preventDefault();
                filter = $(this).parent().data('option-value');
                self.setFilter(filter);
                if (e.originalEvent) {
                    self.$source.trigger('filtered');
                }
                return this;
            });
            self.$destination.trigger('filtered');
            self.$source.trigger('filtered');
            if (self.options.useHash) {
                self.hashEvents();
            }
            $window.on('resize sort.resize', function () {
                setTimeout(function () {
                    self.$destination.isotope('layout');
                }, 300);
            });
            setTimeout(function () {
                $window.trigger('sort.resize');
            }, 300);
            return this;
        },
        setFilter: function (filter) {
            var self = this,
                page = false,
                currentFilter = filter;
            self.$source.find('.active').removeClass('active');
            self.$source.find('li[data-option-value="' + filter + '"], li[data-option-value="' + filter + '"] > a').addClass('active');
            self.options.filter = currentFilter;
            if (self.$destination.attr('data-current-page')) {
                currentFilter = currentFilter + '[data-page-rel=' + self.$destination.attr('data-current-page') + ']';
            }
            self.$destination.attr('data-filter', filter).isotope({
                filter: currentFilter
            }).one('arrangeComplete', function (event, filteredItems) {
                if (self.options.useHash) {
                    if (window.location.hash != '' || self.options.filter.replace('.', '') != '*') {
                        window.location.hash = self.options.filter.replace('.', '');
                    }
                }
                $(window).trigger('scroll');
            }).trigger('filtered');
            return this;
        },
        hashEvents: function () {
            var self = this,
                hash = null,
                hashFilter = null,
                initHashFilter = '.' + location.hash.replace('#', '');
            if ($(location.hash).length) {
                initHashFilter = '.';
            }
            if (initHashFilter != '.' && initHashFilter != '.*') {
                self.setFilter(initHashFilter);
            }
            $(window).on('hashchange', function (e) {
                hashFilter = '.' + location.hash.replace('#', '');
                hash = (hashFilter == '.' || hashFilter == '.*' ? '*' : hashFilter);
                self.setFilter(hash);
            });
            return this;
        },
        setParagraphHeight: function () {
            var self = this,
                minParagraphHeight = 0,
                paragraphs = $('span.thumb-info-caption p', self.$destination);
            paragraphs.each(function () {
                if ($(this).height() > minParagraphHeight) {
                    minParagraphHeight = ($(this).height() + 10);
                }
            });
            paragraphs.height(minParagraphHeight);
            return this;
        },
        createLoader: function () {
            var self = this;
            var loaderTemplate = ['<div class="bounce-loader">', '<div class="bounce1"></div>', '<div class="bounce2"></div>', '<div class="bounce3"></div>', '</div>'].join('');
            self.$loader.append(loaderTemplate);
            return this;
        },
        removeLoader: function () {
            var self = this;
            if (self.$loader) {
                self.$loader.removeClass('sort-destination-loader-showing');
                setTimeout(function () {
                    self.$loader.addClass('sort-destination-loader-loaded');
                }, 300);
            }
        }
    };
    $.extend(theme, {
        PluginSort: PluginSort
    });
    $.fn.themePluginSort = function (opts) {
        return this.map(function () {
            var $this = $(this);
            if ($this.data(instanceName)) {
                return $this.data(instanceName);
            } else {
                return new PluginSort($this, opts);
            }
        });
    }
}).apply(this, [window.theme, jQuery]);

