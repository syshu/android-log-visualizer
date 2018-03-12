/*==================================================
 *  Simile Ajax API
 *
 *  Include this file in your HTML file as follows:
 *
 *    <script src="http://simile.mit.edu/ajax/api/simile-ajax-api.js" type="text/javascript"></script>
 *
 *==================================================
 */

if (typeof SimileAjax === "undefined") {
    var SimileAjax = {
        loaded:                 false,
        loadingScriptsCount:    0,
        error:                  null,
        params:                 { bundle: false }
    };

    window.SimileAjax = SimileAjax;
    SimileAjax.Platform = new Object();
    SimileAjax.urlPrefix = (typeof AjaxUrlPrefix !== 'undefined') ? AjaxUrlPrefix : 'src/ajax/';
}

/*==================================================
 *  Platform Utility Functions and Constants
 *==================================================
 */

/*  This must be called after our jQuery has been loaded 
    but before control returns to user-code.
*/


/*==================================================
 *  REMEMBER to update the Version!
 *==================================================
 */
SimileAjax.version = 'pre 2.3.0';

SimileAjax.jQuery = jQuery.noConflict(true);
if (typeof window["$"] == "undefined") {
    window.$ = SimileAjax.jQuery;
}

SimileAjax.Platform.os = {
    isMac: false,
    isWin: false,
    isWin32: false,
    isUnix: false
};
SimileAjax.Platform.browser = {
    isIE: false,
    isNetscape: false,
    isMozilla: false,
    isFirefox: false,
    isOpera: false,
    isSafari: false,

    majorVersion: 0,
    minorVersion: 0
};

(function() {
    var an = navigator.appName.toLowerCase();
    var ua = navigator.userAgent.toLowerCase();

    /*
     *  Operating system
     */
    SimileAjax.Platform.os.isMac = (ua.indexOf('mac') != -1);
    SimileAjax.Platform.os.isWin = (ua.indexOf('win') != -1);
    SimileAjax.Platform.os.isWin32 = SimileAjax.Platform.isWin && (
        ua.indexOf('95') != -1 ||
        ua.indexOf('98') != -1 ||
        ua.indexOf('nt') != -1 ||
        ua.indexOf('win32') != -1 ||
        ua.indexOf('32bit') != -1
    );
    SimileAjax.Platform.os.isUnix = (ua.indexOf('x11') != -1);

    /*
     *  Browser
     */
    SimileAjax.Platform.browser.isIE = (an.indexOf("microsoft") != -1);
    SimileAjax.Platform.browser.isNetscape = (an.indexOf("netscape") != -1);
    SimileAjax.Platform.browser.isMozilla = (ua.indexOf("mozilla") != -1);
    SimileAjax.Platform.browser.isFirefox = (ua.indexOf("firefox") != -1);
    SimileAjax.Platform.browser.isOpera = (an.indexOf("opera") != -1);
    SimileAjax.Platform.browser.isSafari = (an.indexOf("safari") != -1);

    var parseVersionString = function(s) {
        var a = s.split(".");
        SimileAjax.Platform.browser.majorVersion = parseInt(a[0]);
        SimileAjax.Platform.browser.minorVersion = parseInt(a[1]);
    };
    var indexOf = function(s, sub, start) {
        var i = s.indexOf(sub, start);
        return i >= 0 ? i : s.length;
    };

    if (SimileAjax.Platform.browser.isMozilla) {
        var offset = ua.indexOf("mozilla/");
        if (offset >= 0) {
            parseVersionString(ua.substring(offset + 8, indexOf(ua, " ", offset)));
        }
    }
    if (SimileAjax.Platform.browser.isIE) {
        var offset = ua.indexOf("msie ");
        if (offset >= 0) {
            parseVersionString(ua.substring(offset + 5, indexOf(ua, ";", offset)));
        }
    }
    if (SimileAjax.Platform.browser.isNetscape) {
        var offset = ua.indexOf("rv:");
        if (offset >= 0) {
            parseVersionString(ua.substring(offset + 3, indexOf(ua, ")", offset)));
        }
    }
    if (SimileAjax.Platform.browser.isFirefox) {
        var offset = ua.indexOf("firefox/");
        if (offset >= 0) {
            parseVersionString(ua.substring(offset + 8, indexOf(ua, " ", offset)));
        }
    }

    if (!("localeCompare" in String.prototype)) {
        String.prototype.localeCompare = function(s) {
            if (this < s) return -1;
            else if (this > s) return 1;
            else return 0;
        };
    }
})();

SimileAjax.Platform.getDefaultLocale = function() {
    return SimileAjax.Platform.clientLocale;
};

/*==================================================
 *  Debug Utility Functions
 *==================================================
 */

SimileAjax.Debug = {
    silent: false
};

SimileAjax.Debug.log = function(msg) {
    var f;
    if ("console" in window && "log" in window.console) { // FireBug installed
        f = function(msg2) {
            console.log(msg2);
        }
    } else {
        f = function(msg2) {
            if (!SimileAjax.Debug.silent) {
                alert(msg2);
            }
        }
    }
    SimileAjax.Debug.log = f;
    f(msg);
};

SimileAjax.Debug.warn = function(msg) {
    var f;
    if ("console" in window && "warn" in window.console) { // FireBug installed
        f = function(msg2) {
            console.warn(msg2);
        }
    } else {
        f = function(msg2) {
            if (!SimileAjax.Debug.silent) {
                alert(msg2);
            }
        }
    }
    SimileAjax.Debug.warn = f;
    f(msg);
};

SimileAjax.Debug.exception = function(e, msg) {
    throw e;
    /*
    var f, params = SimileAjax.parseURLParameters();
    if (params.errors == "throw" || SimileAjax.params.errors == "throw") {
        f = function(e2, msg2) {
            throw (e2); // do not hide from browser's native debugging features
        };
    } else if ("console" in window && "error" in window.console) { // FireBug installed
        f = function(e2, msg2) {
            if (msg2 != null) {
                console.error(msg2 + " %o", e2);
            } else {
                console.error(e2);
            }
            throw (e2); // do not hide from browser's native debugging features
        };
    } else {
        f = function(e2, msg2) {
            if (!SimileAjax.Debug.silent) {
                alert("Caught exception: " + msg2 + "\n\nDetails: " + ("description" in e2 ? e2.description : e2));
            }
            throw (e2); // do not hide from browser's native debugging features
        };
    }
    SimileAjax.Debug.exception = f;
    f(e, msg);
    */
};

SimileAjax.Debug.objectToString = function(o) {
    return SimileAjax.Debug._objectToString(o, "");
};

SimileAjax.Debug._objectToString = function(o, indent) {
    var indent2 = indent + " ";
    if (typeof o == "object") {
        var s = "{";
        for (n in o) {
            s += indent2 + n + ": " + SimileAjax.Debug._objectToString(o[n], indent2) + "\n";
        }
        s += indent + "}";
        return s;
    } else if (typeof o == "array") {
        var s = "[";
        for (var n = 0; n < o.length; n++) {
            s += SimileAjax.Debug._objectToString(o[n], indent2) + "\n";
        }
        s += indent + "]";
        return s;
    } else {
        return o;
    }
};

/**
 * @fileOverview XmlHttp utility functions
 * @name SimileAjax.XmlHttp
 */

SimileAjax.XmlHttp = new Object();

/**
 *  Callback for XMLHttp onRequestStateChange.
 */
SimileAjax.XmlHttp._onReadyStateChange = function(xmlhttp, fError, fDone) {
    switch (xmlhttp.readyState) {
        // 1: Request not yet made
        // 2: Contact established with server but nothing downloaded yet
        // 3: Called multiple while downloading in progress

        // Download complete
        case 4:
            try {
                if (xmlhttp.status == 0 // file:// urls, works on Firefox
                    || xmlhttp.status == 200 // http:// urls
                ) {
                    if (fDone) {
                        fDone(xmlhttp);
                    }
                } else {
                    if (fError) {
                        fError(
                            xmlhttp.statusText,
                            xmlhttp.status,
                            xmlhttp
                        );
                    }
                }
            } catch (e) {
                SimileAjax.Debug.exception("XmlHttp: Error handling onReadyStateChange", e);
            }
            break;
    }
};

/**
 *  Creates an XMLHttpRequest object. On the first run, this
 *  function creates a platform-specific function for
 *  instantiating an XMLHttpRequest object and then replaces
 *  itself with that function.
 */
SimileAjax.XmlHttp._createRequest = function() {
    if (SimileAjax.Platform.browser.isIE) {
        var programIDs = [
            "Msxml2.XMLHTTP",
            "Microsoft.XMLHTTP",
            "Msxml2.XMLHTTP.4.0"
        ];
        for (var i = 0; i < programIDs.length; i++) {
            try {
                var programID = programIDs[i];
                var f = function() {
                    return new ActiveXObject(programID);
                };
                var o = f();

                // We are replacing the SimileAjax._createXmlHttpRequest
                // function with this inner function as we've
                // found out that it works. This is so that we
                // don't have to do all the testing over again
                // on subsequent calls.
                SimileAjax.XmlHttp._createRequest = f;

                return o;
            } catch (e) {
                // silent
            }
        }
        // fall through to try new XMLHttpRequest();
    }

    try {
        var f = function() {
            return new XMLHttpRequest();
        };
        var o = f();

        // We are replacing the SimileAjax._createXmlHttpRequest
        // function with this inner function as we've
        // found out that it works. This is so that we
        // don't have to do all the testing over again
        // on subsequent calls.
        SimileAjax.XmlHttp._createRequest = f;

        return o;
    } catch (e) {
        throw new Error("Failed to create an XMLHttpRequest object");
    }
};

/**
 * Performs an asynchronous HTTP GET.
 *  
 * @param {Function} fError a function of the form 
     function(statusText, statusCode, xmlhttp)
 * @param {Function} fDone a function of the form function(xmlhttp)
 */
SimileAjax.XmlHttp.get = function(url, fError, fDone) {
    var xmlhttp = SimileAjax.XmlHttp._createRequest();

    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function() {
        SimileAjax.XmlHttp._onReadyStateChange(xmlhttp, fError, fDone);
    };
    xmlhttp.send(null);
};

/**
 * Performs an asynchronous HTTP POST.
 *  
 * @param {Function} fError a function of the form 
     function(statusText, statusCode, xmlhttp)
 * @param {Function} fDone a function of the form function(xmlhttp)
 */
SimileAjax.XmlHttp.post = function(url, body, fError, fDone) {
    var xmlhttp = SimileAjax.XmlHttp._createRequest();

    xmlhttp.open("POST", url, true);
    xmlhttp.onreadystatechange = function() {
        SimileAjax.XmlHttp._onReadyStateChange(xmlhttp, fError, fDone);
    };
    xmlhttp.send(body);
};

SimileAjax.XmlHttp._forceXML = function(xmlhttp) {
    try {
        xmlhttp.overrideMimeType("text/xml");
    } catch (e) {
        xmlhttp.setrequestheader("Content-Type", "text/xml");
    }
};

/*
 *  Copied directly from http://www.json.org/json.js.
 */

/*
    json.js
    2006-04-28

    This file adds these methods to JavaScript:

        object.toJSONString()

            This method produces a JSON text from an object. The
            object must not contain any cyclical references.

        array.toJSONString()

            This method produces a JSON text from an array. The
            array must not contain any cyclical references.

        string.parseJSON()

            This method parses a JSON text to produce an object or
            array. It will return false if there is an error.
*/

SimileAjax.JSON = new Object();

(function() {
    var m = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };
    var s = {
        array: function(x) {
            var a = ['['],
                b, f, i, l = x.length,
                v;
            for (i = 0; i < l; i += 1) {
                v = x[i];
                f = s[typeof v];
                if (f) {
                    v = f(v);
                    if (typeof v == 'string') {
                        if (b) {
                            a[a.length] = ',';
                        }
                        a[a.length] = v;
                        b = true;
                    }
                }
            }
            a[a.length] = ']';
            return a.join('');
        },
        'boolean': function(x) {
            return String(x);
        },
        'null': function(x) {
            return "null";
        },
        number: function(x) {
            return isFinite(x) ? String(x) : 'null';
        },
        object: function(x) {
            if (x) {
                if (x instanceof Array) {
                    return s.array(x);
                }
                var a = ['{'],
                    b, f, i, v;
                for (i in x) {
                    v = x[i];
                    f = s[typeof v];
                    if (f) {
                        v = f(v);
                        if (typeof v == 'string') {
                            if (b) {
                                a[a.length] = ',';
                            }
                            a.push(s.string(i), ':', v);
                            b = true;
                        }
                    }
                }
                a[a.length] = '}';
                return a.join('');
            }
            return 'null';
        },
        string: function(x) {
            if (/["\\\x00-\x1f]/.test(x)) {
                x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                    var c = m[b];
                    if (c) {
                        return c;
                    }
                    c = b.charCodeAt();
                    return '\\u00' +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                });
            }
            return '"' + x + '"';
        }
    };

    SimileAjax.JSON.toJSONString = function(o) {
        if (o instanceof Object) {
            return s.object(o);
        } else if (o instanceof Array) {
            return s.array(o);
        } else {
            return o.toString();
        }
    };

    SimileAjax.JSON.parseJSON = function() {
        try {
            return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
                    this.replace(/"(\\.|[^"\\])*"/g, ''))) &&
                eval('(' + this + ')');
        } catch (e) {
            return false;
        }
    };
})();

/*==================================================
 *  DOM Utility Functions
 *==================================================
 */

SimileAjax.DOM = new Object();

SimileAjax.DOM.registerEventWithObject = function(elmt, eventName, obj, handlerName) {
    SimileAjax.DOM.registerEvent(elmt, eventName, function(elmt2, evt, target) {
        return obj[handlerName].call(obj, elmt2, evt, target);
    });
};

SimileAjax.DOM.registerEvent = function(elmt, eventName, handler) {
    var handler2 = function(evt) {
        evt = (evt) ? evt : ((event) ? event : null);
        if (evt) {
            var target = (evt.target) ?
                evt.target : ((evt.srcElement) ? evt.srcElement : null);
            if (target) {
                target = (target.nodeType == 1 || target.nodeType == 9) ?
                    target : target.parentNode;
            }

            return handler(elmt, evt, target);
        }
        return true;
    }

    if (SimileAjax.Platform.browser.isIE) {
        elmt.attachEvent("on" + eventName, handler2);
    } else {
        elmt.addEventListener(eventName, handler2, false);
    }
};

SimileAjax.DOM.getPageCoordinates = function(elmt) {
    var left = 0;
    var top = 0;

    if (elmt.nodeType != 1) {
        elmt = elmt.parentNode;
    }

    var elmt2 = elmt;
    while (elmt2 != null) {
        left += elmt2.offsetLeft;
        top += elmt2.offsetTop;
        elmt2 = elmt2.offsetParent;
    }

    var body = document.body;
    while (elmt != null && elmt != body) {
        if ("scrollLeft" in elmt) {
            left -= elmt.scrollLeft;
            top -= elmt.scrollTop;
        }
        elmt = elmt.parentNode;
    }

    return {
        left: left,
        top: top
    };
};

SimileAjax.DOM.getSize = function(elmt) {
    var w = this.getStyle(elmt, "width");
    var h = this.getStyle(elmt, "height");
    if (w.indexOf("px") > -1) w = w.replace("px", "");
    if (h.indexOf("px") > -1) h = h.replace("px", "");
    return {
        w: w,
        h: h
    }
}

SimileAjax.DOM.getStyle = function(elmt, styleProp) {
    if (elmt.currentStyle) { // IE
        var style = elmt.currentStyle[styleProp];
    } else if (window.getComputedStyle) { // standard DOM
        var style = document.defaultView.getComputedStyle(elmt, null).getPropertyValue(styleProp);
    } else {
        var style = "";
    }
    return style;
}

SimileAjax.DOM.getEventRelativeCoordinates = function(evt, elmt) {
    if (SimileAjax.Platform.browser.isIE) {
        if (evt.type == "mousewheel") {
            var coords = SimileAjax.DOM.getPageCoordinates(elmt);
            return {
                x: evt.clientX - coords.left,
                y: evt.clientY - coords.top
            };
        } else {
            return {
                x: evt.offsetX,
                y: evt.offsetY
            };
        }
    } else {
        var coords = SimileAjax.DOM.getPageCoordinates(elmt);

        if ((evt.type == "DOMMouseScroll") &&
            SimileAjax.Platform.browser.isFirefox &&
            (SimileAjax.Platform.browser.majorVersion == 2)) {
            // Due to: https://bugzilla.mozilla.org/show_bug.cgi?id=352179                  

            return {
                x: evt.screenX - coords.left,
                y: evt.screenY - coords.top
            };
        } else {
            return {
                x: evt.pageX - coords.left,
                y: evt.pageY - coords.top
            };
        }
    }
};

SimileAjax.DOM.getEventPageCoordinates = function(evt) {
    if (SimileAjax.Platform.browser.isIE) {
        return {
            x: evt.clientX + document.body.scrollLeft,
            y: evt.clientY + document.body.scrollTop
        };
    } else {
        return {
            x: evt.pageX,
            y: evt.pageY
        };
    }
};

SimileAjax.DOM.hittest = function(x, y, except) {
    return SimileAjax.DOM._hittest(document.body, x, y, except);
};

SimileAjax.DOM._hittest = function(elmt, x, y, except) {
    var childNodes = elmt.childNodes;
    outer: for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        for (var j = 0; j < except.length; j++) {
            if (childNode == except[j]) {
                continue outer;
            }
        }

        if (childNode.offsetWidth == 0 && childNode.offsetHeight == 0) {
            /*
             *  Sometimes SPAN elements have zero width and height but
             *  they have children like DIVs that cover non-zero areas.
             */
            var hitNode = SimileAjax.DOM._hittest(childNode, x, y, except);
            if (hitNode != childNode) {
                return hitNode;
            }
        } else {
            var top = 0;
            var left = 0;

            var node = childNode;
            while (node) {
                top += node.offsetTop;
                left += node.offsetLeft;
                node = node.offsetParent;
            }

            if (left <= x && top <= y && (x - left) < childNode.offsetWidth && (y - top) < childNode.offsetHeight) {
                return SimileAjax.DOM._hittest(childNode, x, y, except);
            } else if (childNode.nodeType == 1 && childNode.tagName == "TR") {
                /*
                 *  Table row might have cells that span several rows.
                 */
                var childNode2 = SimileAjax.DOM._hittest(childNode, x, y, except);
                if (childNode2 != childNode) {
                    return childNode2;
                }
            }
        }
    }
    return elmt;
};

SimileAjax.DOM.cancelEvent = function(evt) {
    evt.returnValue = false;
    evt.cancelBubble = true;
    if ("preventDefault" in evt) {
        evt.preventDefault();
    }
};

SimileAjax.DOM.appendClassName = function(elmt, className) {
    var classes = elmt.className.split(" ");
    for (var i = 0; i < classes.length; i++) {
        if (classes[i] == className) {
            return;
        }
    }
    classes.push(className);
    elmt.className = classes.join(" ");
};

SimileAjax.DOM.createInputElement = function(type) {
    var div = document.createElement("div");
    div.innerHTML = "<input type='" + type + "' />";

    return div.firstChild;
};

SimileAjax.DOM.createDOMFromTemplate = function(template) {
    var result = {};
    result.elmt = SimileAjax.DOM._createDOMFromTemplate(template, result, null);

    return result;
};

SimileAjax.DOM._createDOMFromTemplate = function(templateNode, result, parentElmt) {
    if (templateNode == null) {
        /*
        var node = doc.createTextNode("--null--");
        if (parentElmt != null) {
            parentElmt.appendChild(node);
        }
        return node;
        */
        return null;
    } else if (typeof templateNode != "object") {
        var node = document.createTextNode(templateNode);
        if (parentElmt != null) {
            parentElmt.appendChild(node);
        }
        return node;
    } else {
        var elmt = null;
        if ("tag" in templateNode) {
            var tag = templateNode.tag;
            if (parentElmt != null) {
                if (tag == "tr") {
                    elmt = parentElmt.insertRow(parentElmt.rows.length);
                } else if (tag == "td") {
                    elmt = parentElmt.insertCell(parentElmt.cells.length);
                }
            }
            if (elmt == null) {
                elmt = tag == "input" ?
                    SimileAjax.DOM.createInputElement(templateNode.type) :
                    document.createElement(tag);

                if (parentElmt != null) {
                    parentElmt.appendChild(elmt);
                }
            }
        } else {
            elmt = templateNode.elmt;
            if (parentElmt != null) {
                parentElmt.appendChild(elmt);
            }
        }

        for (var attribute in templateNode) {
            var value = templateNode[attribute];

            if (attribute == "field") {
                result[value] = elmt;

            } else if (attribute == "className") {
                elmt.className = value;
            } else if (attribute == "id") {
                elmt.id = value;
            } else if (attribute == "title") {
                elmt.title = value;
            } else if (attribute == "type" && elmt.tagName == "input") {
                // do nothing
            } else if (attribute == "style") {
                for (n in value) {
                    var v = value[n];
                    if (n == "float") {
                        n = SimileAjax.Platform.browser.isIE ? "styleFloat" : "cssFloat";
                    }
                    elmt.style[n] = v;
                }
            } else if (attribute == "children") {
                for (var i = 0; i < value.length; i++) {
                    SimileAjax.DOM._createDOMFromTemplate(value[i], result, elmt);
                }
            } else if (attribute != "tag" && attribute != "elmt") {
                elmt.setAttribute(attribute, value);
            }
        }
        return elmt;
    }
}

SimileAjax.DOM._cachedParent = null;
SimileAjax.DOM.createElementFromString = function(s) {
    if (SimileAjax.DOM._cachedParent == null) {
        SimileAjax.DOM._cachedParent = document.createElement("div");
    }
    SimileAjax.DOM._cachedParent.innerHTML = s;
    return SimileAjax.DOM._cachedParent.firstChild;
};

SimileAjax.DOM.createDOMFromString = function(root, s, fieldElmts) {
    var elmt = typeof root == "string" ? document.createElement(root) : root;
    elmt.innerHTML = s;

    var dom = {
        elmt: elmt
    };
    SimileAjax.DOM._processDOMChildrenConstructedFromString(dom, elmt, fieldElmts != null ? fieldElmts : {});

    return dom;
};

SimileAjax.DOM._processDOMConstructedFromString = function(dom, elmt, fieldElmts) {
    var id = elmt.id;
    if (id != null && id.length > 0) {
        elmt.removeAttribute("id");
        if (id in fieldElmts) {
            var parentElmt = elmt.parentNode;
            parentElmt.insertBefore(fieldElmts[id], elmt);
            parentElmt.removeChild(elmt);

            dom[id] = fieldElmts[id];
            return;
        } else {
            dom[id] = elmt;
        }
    }

    if (elmt.hasChildNodes()) {
        SimileAjax.DOM._processDOMChildrenConstructedFromString(dom, elmt, fieldElmts);
    }
};

SimileAjax.DOM._processDOMChildrenConstructedFromString = function(dom, elmt, fieldElmts) {
    var node = elmt.firstChild;
    while (node != null) {
        var node2 = node.nextSibling;
        if (node.nodeType == 1) {
            SimileAjax.DOM._processDOMConstructedFromString(dom, node, fieldElmts);
        }
        node = node2;
    }
};

/**
 * @fileOverview Graphics utility functions and constants
 * @name SimileAjax.Graphics
 */

SimileAjax.Graphics = new Object();

/**
 * A boolean value indicating whether PNG translucency is supported on the
 * user's browser or not.
 *
 * @type Boolean
 */
SimileAjax.Graphics.pngIsTranslucent = (!SimileAjax.Platform.browser.isIE) || (SimileAjax.Platform.browser.majorVersion > 6);

if (!SimileAjax.Graphics.pngIsTranslucent) {
    SimileAjax.includeCssFile(document, SimileAjax.urlPrefix + "styles/graphics-ie6.css");
}

/*==================================================
 *  Opacity, translucency
 *==================================================
 */
SimileAjax.Graphics._createTranslucentImage1 = function(url, verticalAlign) {
    var elmt = document.createElement("img");
    elmt.setAttribute("src", url);
    if (verticalAlign != null) {
        elmt.style.verticalAlign = verticalAlign;
    }
    return elmt;
};

SimileAjax.Graphics._createTranslucentImage2 = function(url, verticalAlign) {
    var elmt = document.createElement("img");
    elmt.style.width = "1px"; // just so that IE will calculate the size property
    elmt.style.height = "1px";
    elmt.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "', sizingMethod='image')";
    elmt.style.verticalAlign = (verticalAlign != null) ? verticalAlign : "middle";
    return elmt;
};

/**
 * Creates a DOM element for an <code>img</code> tag using the URL given. This
 * is a convenience method that automatically includes the necessary CSS to
 * allow for translucency, even on IE.
 *
 * @function
 * @param {String} url the URL to the image
 * @param {String} verticalAlign the CSS value for the image's vertical-align
 * @return {Element} a DOM element containing the <code>img</code> tag
 */
SimileAjax.Graphics.createTranslucentImage = SimileAjax.Graphics.pngIsTranslucent ?
    SimileAjax.Graphics._createTranslucentImage1 :
    SimileAjax.Graphics._createTranslucentImage2;

SimileAjax.Graphics._createTranslucentImageHTML1 = function(url, verticalAlign) {
    return "<img src=\"" + url + "\"" +
        (verticalAlign != null ? " style=\"vertical-align: " + verticalAlign + ";\"" : "") +
        " />";
};

SimileAjax.Graphics._createTranslucentImageHTML2 = function(url, verticalAlign) {
    var style =
        "width: 1px; height: 1px; " +
        "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "', sizingMethod='image');" +
        (verticalAlign != null ? " vertical-align: " + verticalAlign + ";" : "");

    return "<img src='" + url + "' style=\"" + style + "\" />";
};

/**
 * Creates an HTML string for an <code>img</code> tag using the URL given.
 * This is a convenience method that automatically includes the necessary CSS
 * to allow for translucency, even on IE.
 *
 * @function
 * @param {String} url the URL to the image
 * @param {String} verticalAlign the CSS value for the image's vertical-align
 * @return {String} a string containing the <code>img</code> tag
 */
SimileAjax.Graphics.createTranslucentImageHTML = SimileAjax.Graphics.pngIsTranslucent ?
    SimileAjax.Graphics._createTranslucentImageHTML1 :
    SimileAjax.Graphics._createTranslucentImageHTML2;

/**
 * Sets the opacity on the given DOM element.
 *
 * @param {Element} elmt the DOM element to set the opacity on
 * @param {Number} opacity an integer from 0 to 100 specifying the opacity
 */
SimileAjax.Graphics.setOpacity = function(elmt, opacity) {
    if (SimileAjax.Platform.browser.isIE) {
        elmt.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Style=0,Opacity=" + opacity + ")";
    } else {
        var o = (opacity / 100).toString();
        elmt.style.opacity = o;
        elmt.style.MozOpacity = o;
    }
};

/*==================================================
 *  Bubble
 *==================================================
 */

SimileAjax.Graphics.bubbleConfig = {
    containerCSSClass: "simileAjax-bubble-container",
    innerContainerCSSClass: "simileAjax-bubble-innerContainer",
    contentContainerCSSClass: "simileAjax-bubble-contentContainer",
    borderGraphicSize: 50,
    borderGraphicCSSClassPrefix: "simileAjax-bubble-border-",
    arrowGraphicTargetOffset: 33, // from tip of arrow to the side of the graphic that touches the content of the bubble
    arrowGraphicLength: 100, // dimension of arrow graphic along the direction that the arrow points
    arrowGraphicWidth: 49, // dimension of arrow graphic perpendicular to the direction that the arrow points
    arrowGraphicCSSClassPrefix: "simileAjax-bubble-arrow-",
    closeGraphicCSSClass: "simileAjax-bubble-close",
    extraPadding: 20
};

/**
 * Creates a nice, rounded bubble popup with the given content in a div,
 * page coordinates and a suggested width. The bubble will point to the
 * location on the page as described by pageX and pageY.  All measurements
 * should be given in pixels.
 *
 * @param {Element} the content div
 * @param {Number} pageX the x coordinate of the point to point to
 * @param {Number} pageY the y coordinate of the point to point to
 * @param {Number} contentWidth a suggested width of the content
 * @param {String} orientation a string ("top", "bottom", "left", or "right")
 *   that describes the orientation of the arrow on the bubble
 * @param {Number} maxHeight. Add a scrollbar div if bubble would be too tall.
 *   Default of 0 or null means no maximum
 */
SimileAjax.Graphics.createBubbleForContentAndPoint = function(
    div, pageX, pageY, contentWidth, orientation, maxHeight) {
    if (typeof contentWidth != "number") {
        contentWidth = 300;
    }
    if (typeof maxHeight != "number") {
        maxHeight = 0;
    }

    div.style.position = "absolute";
    div.style.left = "-5000px";
    div.style.top = "0px";
    div.style.width = contentWidth + "px";
    document.body.appendChild(div);

    window.setTimeout(function() {
        var width = div.scrollWidth + 10;
        var height = div.scrollHeight + 10;
        var scrollDivW = 0; // width of the possible inner container when we want vertical scrolling

        if (maxHeight > 0 && height > maxHeight) {
            height = maxHeight;
            scrollDivW = width - 25;
        }

        var bubble = SimileAjax.Graphics.createBubbleForPoint(pageX, pageY, width, height, orientation);

        document.body.removeChild(div);
        div.style.position = "static";
        div.style.left = "";
        div.style.top = "";

        // create a scroll div if needed
        if (scrollDivW > 0) {
            var scrollDiv = document.createElement("div");
            div.style.width = "";
            scrollDiv.style.width = scrollDivW + "px";
            scrollDiv.appendChild(div);
            bubble.content.appendChild(scrollDiv);
        } else {
            div.style.width = width + "px";
            bubble.content.appendChild(div);
        }
    }, 200);

};

/**
 * Creates a nice, rounded bubble popup with the given page coordinates and
 * content dimensions.  The bubble will point to the location on the page
 * as described by pageX and pageY.  All measurements should be given in
 * pixels.
 *
 * @param {Number} pageX the x coordinate of the point to point to
 * @param {Number} pageY the y coordinate of the point to point to
 * @param {Number} contentWidth the width of the content box in the bubble
 * @param {Number} contentHeight the height of the content box in the bubble
 * @param {String} orientation a string ("top", "bottom", "left", or "right")
 *   that describes the orientation of the arrow on the bubble
 * @return {Element} a DOM element for the newly created bubble
 */
SimileAjax.Graphics.createBubbleForPoint = function(pageX, pageY, contentWidth, contentHeight, orientation) {
    contentWidth = parseInt(contentWidth, 10); // harden against bad input bugs
    contentHeight = parseInt(contentHeight, 10); // getting numbers-as-strings

    var bubbleConfig = SimileAjax.Graphics.bubbleConfig;
    var pngTransparencyClassSuffix =
        SimileAjax.Graphics.pngIsTranslucent ? "pngTranslucent" : "pngNotTranslucent";

    var bubbleWidth = contentWidth + 2 * bubbleConfig.borderGraphicSize;
    var bubbleHeight = contentHeight + 2 * bubbleConfig.borderGraphicSize;

    var generatePngSensitiveClass = function(className) {
        return className + " " + className + "-" + pngTransparencyClassSuffix;
    };

    /*
     *  Render container divs
     */
    var div = document.createElement("div");
    div.className = generatePngSensitiveClass(bubbleConfig.containerCSSClass);
    div.style.width = contentWidth + "px";
    div.style.height = contentHeight + "px";

    var divInnerContainer = document.createElement("div");
    divInnerContainer.className = generatePngSensitiveClass(bubbleConfig.innerContainerCSSClass);
    div.appendChild(divInnerContainer);

    /*
     *  Create layer for bubble
     */
    var close = function() {
        if (!bubble._closed) {
            document.body.removeChild(bubble._div);
            bubble._doc = null;
            bubble._div = null;
            bubble._content = null;
            bubble._closed = true;
        }
    };

    var bubble = {
        _closed: false
    };
    var layer = SimileAjax.WindowManager.pushLayer(close, true, div);
    bubble._div = div;
    bubble.close = function() {
        SimileAjax.WindowManager.popLayer(layer);
    }

    /*
     *  Render border graphics
     */
    var createBorder = function(classNameSuffix) {
        var divBorderGraphic = document.createElement("div");
        divBorderGraphic.className = generatePngSensitiveClass(bubbleConfig.borderGraphicCSSClassPrefix + classNameSuffix);
        divInnerContainer.appendChild(divBorderGraphic);
    };
    createBorder("top-left");
    createBorder("top-right");
    createBorder("bottom-left");
    createBorder("bottom-right");
    createBorder("left");
    createBorder("right");
    createBorder("top");
    createBorder("bottom");

    /*
     *  Render content
     */
    var divContentContainer = document.createElement("div");
    divContentContainer.className = generatePngSensitiveClass(bubbleConfig.contentContainerCSSClass);
    divInnerContainer.appendChild(divContentContainer);
    bubble.content = divContentContainer;

    /*
     *  Render close button
     */
    var divClose = document.createElement("div");
    divClose.className = generatePngSensitiveClass(bubbleConfig.closeGraphicCSSClass);
    divInnerContainer.appendChild(divClose);
    SimileAjax.WindowManager.registerEventWithObject(divClose, "click", bubble, "close");

    (function() {
        var dims = SimileAjax.Graphics.getWindowDimensions();
        var docWidth = dims.w;
        var docHeight = dims.h;
        var halfArrowGraphicWidth = Math.ceil(bubbleConfig.arrowGraphicWidth / 2);
        var createArrow = function(classNameSuffix) {
            var divArrowGraphic = document.createElement("div");
            divArrowGraphic.className = generatePngSensitiveClass(bubbleConfig.arrowGraphicCSSClassPrefix + "point-" + classNameSuffix);
            divInnerContainer.appendChild(divArrowGraphic);
            return divArrowGraphic;
        };

        if (pageX - halfArrowGraphicWidth - bubbleConfig.borderGraphicSize - bubbleConfig.extraPadding > 0 &&
            pageX + halfArrowGraphicWidth + bubbleConfig.borderGraphicSize + bubbleConfig.extraPadding < docWidth) {

            /*
             *  Bubble can be positioned above or below the target point.
             */
            var left = pageX - Math.round(contentWidth / 2);
            left = pageX < (docWidth / 2) ?
                Math.max(left, bubbleConfig.extraPadding + bubbleConfig.borderGraphicSize) :
                Math.min(left, docWidth - bubbleConfig.extraPadding - bubbleConfig.borderGraphicSize - contentWidth);

            if ((orientation && orientation == "top") ||
                (!orientation &&
                    (pageY - bubbleConfig.arrowGraphicTargetOffset - contentHeight - bubbleConfig.borderGraphicSize - bubbleConfig.extraPadding > 0))) {

                /*
                 *  Position bubble above the target point.
                 */
                var divArrow = createArrow("down");
                divArrow.style.left = (pageX - halfArrowGraphicWidth - left) + "px";
                div.style.left = left + "px";
                div.style.top = (pageY - bubbleConfig.arrowGraphicTargetOffset - contentHeight) + "px";
                return;

            } else if ((orientation && orientation == "bottom") ||
                (!orientation &&
                    (pageY + bubbleConfig.arrowGraphicTargetOffset + contentHeight + bubbleConfig.borderGraphicSize + bubbleConfig.extraPadding < docHeight))) {

                /*
                 *  Position bubble below the target point.
                 */
                var divArrow = createArrow("up");
                divArrow.style.left = (pageX - halfArrowGraphicWidth - left) + "px";
                div.style.left = left + "px";
                div.style.top = (pageY + bubbleConfig.arrowGraphicTargetOffset) + "px";
                return;
            }
        }

        var top = pageY - Math.round(contentHeight / 2);
        top = pageY < (docHeight / 2) ?
            Math.max(top, bubbleConfig.extraPadding + bubbleConfig.borderGraphicSize) :
            Math.min(top, docHeight - bubbleConfig.extraPadding - bubbleConfig.borderGraphicSize - contentHeight);

        if ((orientation && orientation == "left") ||
            (!orientation &&
                (pageX - bubbleConfig.arrowGraphicTargetOffset - contentWidth - bubbleConfig.borderGraphicSize - bubbleConfig.extraPadding > 0))) {

            /*
             *  Position bubble left of the target point.
             */
            var divArrow = createArrow("right");
            divArrow.style.top = (pageY - halfArrowGraphicWidth - top) + "px";
            div.style.top = top + "px";
            div.style.left = (pageX - bubbleConfig.arrowGraphicTargetOffset - contentWidth) + "px";
        } else {

            /*
             *  Position bubble right of the target point, as the last resort.
             */
            var divArrow = createArrow("left");
            divArrow.style.top = (pageY - halfArrowGraphicWidth - top) + "px";
            div.style.top = top + "px";
            div.style.left = (pageX + bubbleConfig.arrowGraphicTargetOffset) + "px";
        }
    })();

    document.body.appendChild(div);
    return bubble;
};

SimileAjax.Graphics.getWindowDimensions = function() {
    if (typeof window.innerHeight == 'number') {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }; // Non-IE
    } else if (document.documentElement && document.documentElement.clientHeight) {
        return { // IE6+, in "standards compliant mode"
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight
        };
    } else if (document.body && document.body.clientHeight) {
        return { // IE 4 compatible
            w: document.body.clientWidth,
            h: document.body.clientHeight
        };
    }
};


/**
 * Creates a floating, rounded message bubble in the center of the window for
 * displaying modal information, e.g. "Loading..."
 *
 * @param {Document} doc the root document for the page to render on
 * @param {Object} an object with two properties, contentDiv and containerDiv,
 *   consisting of the newly created DOM elements
 */
SimileAjax.Graphics.createMessageBubble = function(doc) {
    var containerDiv = doc.createElement("div");
    if (SimileAjax.Graphics.pngIsTranslucent) {
        var topDiv = doc.createElement("div");
        topDiv.style.height = "33px";
        topDiv.style.background = "url(" + SimileAjax.urlPrefix + "images/message-top-left.png) top left no-repeat";
        topDiv.style.paddingLeft = "44px";
        containerDiv.appendChild(topDiv);

        var topRightDiv = doc.createElement("div");
        topRightDiv.style.height = "33px";
        topRightDiv.style.background = "url(" + SimileAjax.urlPrefix + "images/message-top-right.png) top right no-repeat";
        topDiv.appendChild(topRightDiv);

        var middleDiv = doc.createElement("div");
        middleDiv.style.background = "url(" + SimileAjax.urlPrefix + "images/message-left.png) top left repeat-y";
        middleDiv.style.paddingLeft = "44px";
        containerDiv.appendChild(middleDiv);

        var middleRightDiv = doc.createElement("div");
        middleRightDiv.style.background = "url(" + SimileAjax.urlPrefix + "images/message-right.png) top right repeat-y";
        middleRightDiv.style.paddingRight = "44px";
        middleDiv.appendChild(middleRightDiv);

        var contentDiv = doc.createElement("div");
        middleRightDiv.appendChild(contentDiv);

        var bottomDiv = doc.createElement("div");
        bottomDiv.style.height = "55px";
        bottomDiv.style.background = "url(" + SimileAjax.urlPrefix + "images/message-bottom-left.png) bottom left no-repeat";
        bottomDiv.style.paddingLeft = "44px";
        containerDiv.appendChild(bottomDiv);

        var bottomRightDiv = doc.createElement("div");
        bottomRightDiv.style.height = "55px";
        bottomRightDiv.style.background = "url(" + SimileAjax.urlPrefix + "images/message-bottom-right.png) bottom right no-repeat";
        bottomDiv.appendChild(bottomRightDiv);
    } else {
        containerDiv.style.border = "2px solid #7777AA";
        containerDiv.style.padding = "20px";
        containerDiv.style.background = "white";
        SimileAjax.Graphics.setOpacity(containerDiv, 90);

        var contentDiv = doc.createElement("div");
        containerDiv.appendChild(contentDiv);
    }

    return {
        containerDiv: containerDiv,
        contentDiv: contentDiv
    };
};

/*==================================================
 *  Animation
 *==================================================
 */

/**
 * Creates an animation for a function, and an interval of values.  The word
 * "animation" here is used in the sense of repeatedly calling a function with
 * a current value from within an interval, and a delta value.
 *
 * @param {Function} f a function to be called every 50 milliseconds throughout
 *   the animation duration, of the form f(current, delta), where current is
 *   the current value within the range and delta is the current change.
 * @param {Number} from a starting value
 * @param {Number} to an ending value
 * @param {Number} duration the duration of the animation in milliseconds
 * @param {Function} [cont] an optional function that is called at the end of
 *   the animation, i.e. a continuation.
 * @return {SimileAjax.Graphics._Animation} a new animation object
 */
SimileAjax.Graphics.createAnimation = function(f, from, to, duration, cont) {
    return new SimileAjax.Graphics._Animation(f, from, to, duration, cont);
};

SimileAjax.Graphics._Animation = function(f, from, to, duration, cont) {
    this.f = f;
    this.cont = (typeof cont == "function") ? cont : function() {};

    this.from = from;
    this.to = to;
    this.current = from;

    this.duration = duration;
    this.start = new Date().getTime();
    this.timePassed = 0;
};

/**
 * Runs this animation.
 */
SimileAjax.Graphics._Animation.prototype.run = function() {
    var a = this;
    window.setTimeout(function() {
        a.step();
    }, 50);
};

/**
 * Increments this animation by one step, and then continues the animation with
 * <code>run()</code>.
 */
SimileAjax.Graphics._Animation.prototype.step = function() {
    this.timePassed += 50;

    var timePassedFraction = this.timePassed / this.duration;
    var parameterFraction = -Math.cos(timePassedFraction * Math.PI) / 2 + 0.5;
    var current = parameterFraction * (this.to - this.from) + this.from;

    try {
        this.f(current, current - this.current);
    } catch (e) {}

    this.current = current;

    if (this.timePassed < this.duration) {
        this.run();
    } else {
        this.f(this.to, 0);
        this["cont"]();
    }
};

/*==================================================
 *  CopyPasteButton
 *
 *  Adapted from http://spaces.live.com/editorial/rayozzie/demo/liveclip/liveclipsample/techPreview.html.
 *==================================================
 */

/**
 * Creates a button and textarea for displaying structured data and copying it
 * to the clipboard.  The data is dynamically generated by the given
 * createDataFunction parameter.
 *
 * @param {String} image an image URL to use as the background for the
 *   generated box
 * @param {Number} width the width in pixels of the generated box
 * @param {Number} height the height in pixels of the generated box
 * @param {Function} createDataFunction a function that is called with no
 *   arguments to generate the structured data
 * @return a new DOM element
 */
SimileAjax.Graphics.createStructuredDataCopyButton = function(image, width, height, createDataFunction) {
    var div = document.createElement("div");
    div.style.position = "relative";
    div.style.display = "inline";
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.overflow = "hidden";
    div.style.margin = "2px";

    if (SimileAjax.Graphics.pngIsTranslucent) {
        div.style.background = "url(" + image + ") no-repeat";
    } else {
        div.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + image + "', sizingMethod='image')";
    }

    var style;
    if (SimileAjax.Platform.browser.isIE) {
        style = "filter:alpha(opacity=0)";
    } else {
        style = "opacity: 0";
    }
    div.innerHTML = "<textarea rows='1' autocomplete='off' value='none' style='" + style + "' />";

    var textarea = div.firstChild;
    textarea.style.width = width + "px";
    textarea.style.height = height + "px";
    textarea.onmousedown = function(evt) {
        evt = (evt) ? evt : ((event) ? event : null);
        if (evt.button == 2) {
            textarea.value = createDataFunction();
            textarea.select();
        }
    };

    return div;
};

/*==================================================
 *  getWidthHeight
 *==================================================
 */
SimileAjax.Graphics.getWidthHeight = function(el) {
    // RETURNS hash {width:  w, height: h} in pixels

    var w, h;
    // offsetWidth rounds on FF, so doesn't work for us.
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=458617
    if (el.getBoundingClientRect == null) {
        // use offsetWidth
        w = el.offsetWidth;
        h = el.offsetHeight;
    } else {
        // use getBoundingClientRect
        var rect = el.getBoundingClientRect();
        w = Math.ceil(rect.right - rect.left);
        h = Math.ceil(rect.bottom - rect.top);
    }
    return {
        width: w,
        height: h
    };
};


/*==================================================
 *  FontRenderingContext
 *==================================================
 */
SimileAjax.Graphics.getFontRenderingContext = function(elmt, width) {
    return new SimileAjax.Graphics._FontRenderingContext(elmt, width);
};

SimileAjax.Graphics._FontRenderingContext = function(elmt, width) {
    this._elmt = elmt;
    this._elmt.style.visibility = "hidden";
    if (typeof width == "string") {
        this._elmt.style.width = width;
    } else if (typeof width == "number") {
        this._elmt.style.width = width + "px";
    }
};

SimileAjax.Graphics._FontRenderingContext.prototype.dispose = function() {
    this._elmt = null;
};

SimileAjax.Graphics._FontRenderingContext.prototype.update = function() {
    this._elmt.innerHTML = "A";
    this._lineHeight = this._elmt.offsetHeight;
};

SimileAjax.Graphics._FontRenderingContext.prototype.computeSize = function(text, className) {
    // className arg is optional
    var el = this._elmt;
    el.innerHTML = text;
    el.className = className === undefined ? '' : className;
    var wh = SimileAjax.Graphics.getWidthHeight(el);
    el.className = ''; // reset for the next guy

    return wh;
};

SimileAjax.Graphics._FontRenderingContext.prototype.getLineHeight = function() {
    return this._lineHeight;
};

/**
 * @fileOverview A collection of date/time utility functions
 * @name SimileAjax.DateTime
 */

SimileAjax.DateTime = new Object();

SimileAjax.DateTime.MILLISECOND = 0;
SimileAjax.DateTime.SECOND = 1;
SimileAjax.DateTime.MINUTE = 2;
SimileAjax.DateTime.HOUR = 3;
SimileAjax.DateTime.DAY = 4;
SimileAjax.DateTime.WEEK = 5;
SimileAjax.DateTime.MONTH = 6;
SimileAjax.DateTime.YEAR = 7;
SimileAjax.DateTime.DECADE = 8;
SimileAjax.DateTime.CENTURY = 9;
SimileAjax.DateTime.MILLENNIUM = 10;

SimileAjax.DateTime.EPOCH = -1;
SimileAjax.DateTime.ERA = -2;

/**
 * An array of unit lengths, expressed in milliseconds, of various lengths of
 * time.  The array indices are predefined and stored as properties of the
 * SimileAjax.DateTime object, e.g. SimileAjax.DateTime.YEAR.
 * @type Array
 */
SimileAjax.DateTime.gregorianUnitLengths = [];
(function() {
    var d = SimileAjax.DateTime;
    var a = d.gregorianUnitLengths;

    a[d.MILLISECOND] = 1;
    a[d.SECOND] = 1000;
    a[d.MINUTE] = a[d.SECOND] * 60;
    a[d.HOUR] = a[d.MINUTE] * 60;
    a[d.DAY] = a[d.HOUR] * 24;
    a[d.WEEK] = a[d.DAY] * 7;
    a[d.MONTH] = a[d.DAY] * 31;
    a[d.YEAR] = a[d.DAY] * 365;
    a[d.DECADE] = a[d.YEAR] * 10;
    a[d.CENTURY] = a[d.YEAR] * 100;
    a[d.MILLENNIUM] = a[d.YEAR] * 1000;
})();

SimileAjax.DateTime._dateRegexp = new RegExp(
    "^(-?)([0-9]{4})(" + [
        "(-?([0-9]{2})(-?([0-9]{2}))?)", // -month-dayOfMonth
        "(-?([0-9]{3}))", // -dayOfYear
        "(-?W([0-9]{2})(-?([1-7]))?)" // -Wweek-dayOfWeek
    ].join("|") + ")?$"
);
SimileAjax.DateTime._timezoneRegexp = new RegExp(
    "Z|(([-+])([0-9]{2})(:?([0-9]{2}))?)$"
);
SimileAjax.DateTime._timeRegexp = new RegExp(
    "^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(\.([0-9]+))?)?)?$"
);

/**
 * Takes a date object and a string containing an ISO 8601 date and sets the
 * the date using information parsed from the string.  Note that this method
 * does not parse any time information.
 *
 * @param {Date} dateObject the date object to modify
 * @param {String} string an ISO 8601 string to parse
 * @return {Date} the modified date object
 */
SimileAjax.DateTime.setIso8601Date = function(dateObject, string) {
    /*
     *  This function has been adapted from dojo.date, v.0.3.0
     *  http://dojotoolkit.org/.
     */

    var d = string.match(SimileAjax.DateTime._dateRegexp);
    if (!d) {
        throw new Error("Invalid date string: " + string);
    }

    var sign = (d[1] == "-") ? -1 : 1; // BC or AD
    var year = sign * d[2];
    var month = d[5];
    var date = d[7];
    var dayofyear = d[9];
    var week = d[11];
    var dayofweek = (d[13]) ? d[13] : 1;

    dateObject.setUTCFullYear(year);
    if (dayofyear) {
        dateObject.setUTCMonth(0);
        dateObject.setUTCDate(Number(dayofyear));
    } else if (week) {
        dateObject.setUTCMonth(0);
        dateObject.setUTCDate(1);
        var gd = dateObject.getUTCDay();
        var day = (gd) ? gd : 7;
        var offset = Number(dayofweek) + (7 * Number(week));

        if (day <= 4) {
            dateObject.setUTCDate(offset + 1 - day);
        } else {
            dateObject.setUTCDate(offset + 8 - day);
        }
    } else {
        if (month) {
            dateObject.setUTCDate(1);
            dateObject.setUTCMonth(month - 1);
        }
        if (date) {
            dateObject.setUTCDate(date);
        }
    }

    return dateObject;
};

/**
 * Takes a date object and a string containing an ISO 8601 time and sets the
 * the time using information parsed from the string.  Note that this method
 * does not parse any date information.
 *
 * @param {Date} dateObject the date object to modify
 * @param {String} string an ISO 8601 string to parse
 * @return {Date} the modified date object
 */
SimileAjax.DateTime.setIso8601Time = function(dateObject, string) {
    /*
     *  This function has been adapted from dojo.date, v.0.3.0
     *  http://dojotoolkit.org/.
     */

    var d = string.match(SimileAjax.DateTime._timeRegexp);
    if (!d) {
        SimileAjax.Debug.warn("Invalid time string: " + string);
        return false;
    }
    var hours = d[1];
    var mins = Number((d[3]) ? d[3] : 0);
    var secs = (d[5]) ? d[5] : 0;
    var ms = d[7] ? (Number("0." + d[7]) * 1000) : 0;

    dateObject.setUTCHours(hours);
    dateObject.setUTCMinutes(mins);
    dateObject.setUTCSeconds(secs);
    dateObject.setUTCMilliseconds(ms);

    return dateObject;
};

/**
 * The timezone offset in minutes in the user's browser.
 * @type Number
 */
SimileAjax.DateTime.timezoneOffset = new Date().getTimezoneOffset();

/**
 * Takes a date object and a string containing an ISO 8601 date and time and
 * sets the date object using information parsed from the string.
 *
 * @param {Date} dateObject the date object to modify
 * @param {String} string an ISO 8601 string to parse
 * @return {Date} the modified date object
 */
SimileAjax.DateTime.setIso8601 = function(dateObject, string) {
    /*
     *  This function has been adapted from dojo.date, v.0.3.0
     *  http://dojotoolkit.org/.
     */

    var offset = null;
    var comps = (string.indexOf("T") == -1) ? string.split(" ") : string.split("T");

    SimileAjax.DateTime.setIso8601Date(dateObject, comps[0]);
    if (comps.length == 2) {
        // first strip timezone info from the end
        var d = comps[1].match(SimileAjax.DateTime._timezoneRegexp);
        if (d) {
            if (d[0] == 'Z') {
                offset = 0;
            } else {
                offset = (Number(d[3]) * 60) + Number(d[5]);
                offset *= ((d[2] == '-') ? 1 : -1);
            }
            comps[1] = comps[1].substr(0, comps[1].length - d[0].length);
        }

        SimileAjax.DateTime.setIso8601Time(dateObject, comps[1]);
    }
    if (offset == null) {
        offset = dateObject.getTimezoneOffset(); // local time zone if no tz info
    }
    dateObject.setTime(dateObject.getTime() + offset * 60000);

    return dateObject;
};

/**
 * Takes a string containing an ISO 8601 date and returns a newly instantiated
 * date object with the parsed date and time information from the string.
 *
 * @param {String} string an ISO 8601 string to parse
 * @return {Date} a new date object created from the string
 */
SimileAjax.DateTime.parseIso8601DateTime = function(string) {
    try {
        return SimileAjax.DateTime.setIso8601(new Date(0), string);
    } catch (e) {
        return null;
    }
};

/**
 * Takes a string containing a Gregorian date and time and returns a newly
 * instantiated date object with the parsed date and time information from the
 * string.  If the param is actually an instance of Date instead of a string,
 * simply returns the given date instead.
 *
 * @param {Object} o an object, to either return or parse as a string
 * @return {Date} the date object
 */
SimileAjax.DateTime.parseGregorianDateTime = function(o) {
    if (o == null) {
        return null;
    } else if (o instanceof Date) {
        return o;
    }

    var s = o.toString();
    if (s.length > 0 && s.length < 8) {
        var space = s.indexOf(" ");
        if (space > 0) {
            var year = parseInt(s.substr(0, space));
            var suffix = s.substr(space + 1);
            if (suffix.toLowerCase() == "bc") {
                year = 1 - year;
            }
        } else {
            var year = parseInt(s);
        }

        var d = new Date(0);
        d.setUTCFullYear(year);

        return d;
    }

    try {
        return new Date(Date.parse(s));
    } catch (e) {
        return null;
    }
};

/**
 * Rounds date objects down to the nearest interval or multiple of an interval.
 * This method modifies the given date object, converting it to the given
 * timezone if specified.
 *
 * @param {Date} date the date object to round
 * @param {Number} intervalUnit a constant, integer index specifying an
 *   interval, e.g. SimileAjax.DateTime.HOUR
 * @param {Number} timeZone a timezone shift, given in hours
 * @param {Number} multiple a multiple of the interval to round by
 * @param {Number} firstDayOfWeek an integer specifying the first day of the
 *   week, 0 corresponds to Sunday, 1 to Monday, etc.
 */
SimileAjax.DateTime.roundDownToInterval = function(date, intervalUnit, timeZone, multiple, firstDayOfWeek) {
    var timeShift = timeZone *
        SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];

    var date2 = new Date(date.getTime() + timeShift);
    var clearInDay = function(d) {
        d.setUTCMilliseconds(0);
        d.setUTCSeconds(0);
        d.setUTCMinutes(0);
        d.setUTCHours(0);
    };
    var clearInYear = function(d) {
        clearInDay(d);
        d.setUTCDate(1);
        d.setUTCMonth(0);
    };

    switch (intervalUnit) {
        case SimileAjax.DateTime.MILLISECOND:
            var x = date2.getUTCMilliseconds();
            date2.setUTCMilliseconds(x - (x % multiple));
            break;
        case SimileAjax.DateTime.SECOND:
            date2.setUTCMilliseconds(0);

            var x = date2.getUTCSeconds();
            date2.setUTCSeconds(x - (x % multiple));
            break;
        case SimileAjax.DateTime.MINUTE:
            date2.setUTCMilliseconds(0);
            date2.setUTCSeconds(0);

            var x = date2.getUTCMinutes();
            date2.setTime(date2.getTime() -
                (x % multiple) * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
            break;
        case SimileAjax.DateTime.HOUR:
            date2.setUTCMilliseconds(0);
            date2.setUTCSeconds(0);
            date2.setUTCMinutes(0);

            var x = date2.getUTCHours();
            date2.setUTCHours(x - (x % multiple));
            break;
        case SimileAjax.DateTime.DAY:
            clearInDay(date2);
            break;
        case SimileAjax.DateTime.WEEK:
            clearInDay(date2);
            var d = (date2.getUTCDay() + 7 - firstDayOfWeek) % 7;
            date2.setTime(date2.getTime() -
                d * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.DAY]);
            break;
        case SimileAjax.DateTime.MONTH:
            clearInDay(date2);
            date2.setUTCDate(1);

            var x = date2.getUTCMonth();
            date2.setUTCMonth(x - (x % multiple));
            break;
        case SimileAjax.DateTime.YEAR:
            clearInYear(date2);

            var x = date2.getUTCFullYear();
            date2.setUTCFullYear(x - (x % multiple));
            break;
        case SimileAjax.DateTime.DECADE:
            clearInYear(date2);
            date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 10) * 10);
            break;
        case SimileAjax.DateTime.CENTURY:
            clearInYear(date2);
            date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 100) * 100);
            break;
        case SimileAjax.DateTime.MILLENNIUM:
            clearInYear(date2);
            date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 1000) * 1000);
            break;
    }

    date.setTime(date2.getTime() - timeShift);
};

/**
 * Rounds date objects up to the nearest interval or multiple of an interval.
 * This method modifies the given date object, converting it to the given
 * timezone if specified.
 *
 * @param {Date} date the date object to round
 * @param {Number} intervalUnit a constant, integer index specifying an
 *   interval, e.g. SimileAjax.DateTime.HOUR
 * @param {Number} timeZone a timezone shift, given in hours
 * @param {Number} multiple a multiple of the interval to round by
 * @param {Number} firstDayOfWeek an integer specifying the first day of the
 *   week, 0 corresponds to Sunday, 1 to Monday, etc.
 * @see SimileAjax.DateTime.roundDownToInterval
 */
SimileAjax.DateTime.roundUpToInterval = function(date, intervalUnit, timeZone, multiple, firstDayOfWeek) {
    var originalTime = date.getTime();
    SimileAjax.DateTime.roundDownToInterval(date, intervalUnit, timeZone, multiple, firstDayOfWeek);
    if (date.getTime() < originalTime) {
        date.setTime(date.getTime() +
            SimileAjax.DateTime.gregorianUnitLengths[intervalUnit] * multiple);
    }
};

/**
 * Increments a date object by a specified interval, taking into
 * consideration the timezone.
 *
 * @param {Date} date the date object to increment
 * @param {Number} intervalUnit a constant, integer index specifying an
 *   interval, e.g. SimileAjax.DateTime.HOUR
 * @param {Number} timeZone the timezone offset in hours
 */
SimileAjax.DateTime.incrementByInterval = function(date, intervalUnit, timeZone) {
    timeZone = (typeof timeZone == 'undefined') ? 0 : timeZone;

    var timeShift = timeZone *
        SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];

    var date2 = new Date(date.getTime() + timeShift);

    switch (intervalUnit) {
        case SimileAjax.DateTime.MILLISECOND:
            date2.setTime(date2.getTime() + 1)
            break;
        case SimileAjax.DateTime.SECOND:
            date2.setTime(date2.getTime() + 1000);
            break;
        case SimileAjax.DateTime.MINUTE:
            date2.setTime(date2.getTime() +
                SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
            break;
        case SimileAjax.DateTime.HOUR:
            date2.setTime(date2.getTime() +
                SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
            break;
        case SimileAjax.DateTime.DAY:
            date2.setUTCDate(date2.getUTCDate() + 1);
            break;
        case SimileAjax.DateTime.WEEK:
            date2.setUTCDate(date2.getUTCDate() + 7);
            break;
        case SimileAjax.DateTime.MONTH:
            date2.setUTCMonth(date2.getUTCMonth() + 1);
            break;
        case SimileAjax.DateTime.YEAR:
            date2.setUTCFullYear(date2.getUTCFullYear() + 1);
            break;
        case SimileAjax.DateTime.DECADE:
            date2.setUTCFullYear(date2.getUTCFullYear() + 10);
            break;
        case SimileAjax.DateTime.CENTURY:
            date2.setUTCFullYear(date2.getUTCFullYear() + 100);
            break;
        case SimileAjax.DateTime.MILLENNIUM:
            date2.setUTCFullYear(date2.getUTCFullYear() + 1000);
            break;
    }

    date.setTime(date2.getTime() - timeShift);
};

/**
 * Returns a new date object with the given time offset removed.
 *
 * @param {Date} date the starting date
 * @param {Number} timeZone a timezone specified in an hour offset to remove
 * @return {Date} a new date object with the offset removed
 */
SimileAjax.DateTime.removeTimeZoneOffset = function(date, timeZone) {
    return new Date(date.getTime() +
        timeZone * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
};

/**
 * Returns the timezone of the user's browser.
 *
 * @return {Number} the timezone in the user's locale in hours
 */
SimileAjax.DateTime.getTimezone = function() {
    var d = new Date().getTimezoneOffset();
    return d / -60;
};

/*==================================================
 *  String Utility Functions and Constants
 *==================================================
 */

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.startsWith = function(prefix) {
    return this.length >= prefix.length && this.substr(0, prefix.length) == prefix;
};

String.prototype.endsWith = function(suffix) {
    return this.length >= suffix.length && this.substr(this.length - suffix.length) == suffix;
};

String.substitute = function(s, objects) {
    var result = "";
    var start = 0;
    while (start < s.length - 1) {
        var percent = s.indexOf("%", start);
        if (percent < 0 || percent == s.length - 1) {
            break;
        } else if (percent > start && s.charAt(percent - 1) == "\\") {
            result += s.substring(start, percent - 1) + "%";
            start = percent + 1;
        } else {
            var n = parseInt(s.charAt(percent + 1));
            if (isNaN(n) || n >= objects.length) {
                result += s.substring(start, percent + 2);
            } else {
                result += s.substring(start, percent) + objects[n].toString();
            }
            start = percent + 2;
        }
    }

    if (start < s.length) {
        result += s.substring(start);
    }
    return result;
};

/*==================================================
 *  HTML Utility Functions
 *==================================================
 */

SimileAjax.HTML = new Object();

SimileAjax.HTML._e2uHash = {};
(function() {
    var e2uHash = SimileAjax.HTML._e2uHash;
    e2uHash['nbsp'] = '\u00A0[space]';
    e2uHash['iexcl'] = '\u00A1';
    e2uHash['cent'] = '\u00A2';
    e2uHash['pound'] = '\u00A3';
    e2uHash['curren'] = '\u00A4';
    e2uHash['yen'] = '\u00A5';
    e2uHash['brvbar'] = '\u00A6';
    e2uHash['sect'] = '\u00A7';
    e2uHash['uml'] = '\u00A8';
    e2uHash['copy'] = '\u00A9';
    e2uHash['ordf'] = '\u00AA';
    e2uHash['laquo'] = '\u00AB';
    e2uHash['not'] = '\u00AC';
    e2uHash['shy'] = '\u00AD';
    e2uHash['reg'] = '\u00AE';
    e2uHash['macr'] = '\u00AF';
    e2uHash['deg'] = '\u00B0';
    e2uHash['plusmn'] = '\u00B1';
    e2uHash['sup2'] = '\u00B2';
    e2uHash['sup3'] = '\u00B3';
    e2uHash['acute'] = '\u00B4';
    e2uHash['micro'] = '\u00B5';
    e2uHash['para'] = '\u00B6';
    e2uHash['middot'] = '\u00B7';
    e2uHash['cedil'] = '\u00B8';
    e2uHash['sup1'] = '\u00B9';
    e2uHash['ordm'] = '\u00BA';
    e2uHash['raquo'] = '\u00BB';
    e2uHash['frac14'] = '\u00BC';
    e2uHash['frac12'] = '\u00BD';
    e2uHash['frac34'] = '\u00BE';
    e2uHash['iquest'] = '\u00BF';
    e2uHash['Agrave'] = '\u00C0';
    e2uHash['Aacute'] = '\u00C1';
    e2uHash['Acirc'] = '\u00C2';
    e2uHash['Atilde'] = '\u00C3';
    e2uHash['Auml'] = '\u00C4';
    e2uHash['Aring'] = '\u00C5';
    e2uHash['AElig'] = '\u00C6';
    e2uHash['Ccedil'] = '\u00C7';
    e2uHash['Egrave'] = '\u00C8';
    e2uHash['Eacute'] = '\u00C9';
    e2uHash['Ecirc'] = '\u00CA';
    e2uHash['Euml'] = '\u00CB';
    e2uHash['Igrave'] = '\u00CC';
    e2uHash['Iacute'] = '\u00CD';
    e2uHash['Icirc'] = '\u00CE';
    e2uHash['Iuml'] = '\u00CF';
    e2uHash['ETH'] = '\u00D0';
    e2uHash['Ntilde'] = '\u00D1';
    e2uHash['Ograve'] = '\u00D2';
    e2uHash['Oacute'] = '\u00D3';
    e2uHash['Ocirc'] = '\u00D4';
    e2uHash['Otilde'] = '\u00D5';
    e2uHash['Ouml'] = '\u00D6';
    e2uHash['times'] = '\u00D7';
    e2uHash['Oslash'] = '\u00D8';
    e2uHash['Ugrave'] = '\u00D9';
    e2uHash['Uacute'] = '\u00DA';
    e2uHash['Ucirc'] = '\u00DB';
    e2uHash['Uuml'] = '\u00DC';
    e2uHash['Yacute'] = '\u00DD';
    e2uHash['THORN'] = '\u00DE';
    e2uHash['szlig'] = '\u00DF';
    e2uHash['agrave'] = '\u00E0';
    e2uHash['aacute'] = '\u00E1';
    e2uHash['acirc'] = '\u00E2';
    e2uHash['atilde'] = '\u00E3';
    e2uHash['auml'] = '\u00E4';
    e2uHash['aring'] = '\u00E5';
    e2uHash['aelig'] = '\u00E6';
    e2uHash['ccedil'] = '\u00E7';
    e2uHash['egrave'] = '\u00E8';
    e2uHash['eacute'] = '\u00E9';
    e2uHash['ecirc'] = '\u00EA';
    e2uHash['euml'] = '\u00EB';
    e2uHash['igrave'] = '\u00EC';
    e2uHash['iacute'] = '\u00ED';
    e2uHash['icirc'] = '\u00EE';
    e2uHash['iuml'] = '\u00EF';
    e2uHash['eth'] = '\u00F0';
    e2uHash['ntilde'] = '\u00F1';
    e2uHash['ograve'] = '\u00F2';
    e2uHash['oacute'] = '\u00F3';
    e2uHash['ocirc'] = '\u00F4';
    e2uHash['otilde'] = '\u00F5';
    e2uHash['ouml'] = '\u00F6';
    e2uHash['divide'] = '\u00F7';
    e2uHash['oslash'] = '\u00F8';
    e2uHash['ugrave'] = '\u00F9';
    e2uHash['uacute'] = '\u00FA';
    e2uHash['ucirc'] = '\u00FB';
    e2uHash['uuml'] = '\u00FC';
    e2uHash['yacute'] = '\u00FD';
    e2uHash['thorn'] = '\u00FE';
    e2uHash['yuml'] = '\u00FF';
    e2uHash['quot'] = '\u0022';
    e2uHash['amp'] = '\u0026';
    e2uHash['lt'] = '\u003C';
    e2uHash['gt'] = '\u003E';
    e2uHash['OElig'] = '';
    e2uHash['oelig'] = '\u0153';
    e2uHash['Scaron'] = '\u0160';
    e2uHash['scaron'] = '\u0161';
    e2uHash['Yuml'] = '\u0178';
    e2uHash['circ'] = '\u02C6';
    e2uHash['tilde'] = '\u02DC';
    e2uHash['ensp'] = '\u2002';
    e2uHash['emsp'] = '\u2003';
    e2uHash['thinsp'] = '\u2009';
    e2uHash['zwnj'] = '\u200C';
    e2uHash['zwj'] = '\u200D';
    e2uHash['lrm'] = '\u200E';
    e2uHash['rlm'] = '\u200F';
    e2uHash['ndash'] = '\u2013';
    e2uHash['mdash'] = '\u2014';
    e2uHash['lsquo'] = '\u2018';
    e2uHash['rsquo'] = '\u2019';
    e2uHash['sbquo'] = '\u201A';
    e2uHash['ldquo'] = '\u201C';
    e2uHash['rdquo'] = '\u201D';
    e2uHash['bdquo'] = '\u201E';
    e2uHash['dagger'] = '\u2020';
    e2uHash['Dagger'] = '\u2021';
    e2uHash['permil'] = '\u2030';
    e2uHash['lsaquo'] = '\u2039';
    e2uHash['rsaquo'] = '\u203A';
    e2uHash['euro'] = '\u20AC';
    e2uHash['fnof'] = '\u0192';
    e2uHash['Alpha'] = '\u0391';
    e2uHash['Beta'] = '\u0392';
    e2uHash['Gamma'] = '\u0393';
    e2uHash['Delta'] = '\u0394';
    e2uHash['Epsilon'] = '\u0395';
    e2uHash['Zeta'] = '\u0396';
    e2uHash['Eta'] = '\u0397';
    e2uHash['Theta'] = '\u0398';
    e2uHash['Iota'] = '\u0399';
    e2uHash['Kappa'] = '\u039A';
    e2uHash['Lambda'] = '\u039B';
    e2uHash['Mu'] = '\u039C';
    e2uHash['Nu'] = '\u039D';
    e2uHash['Xi'] = '\u039E';
    e2uHash['Omicron'] = '\u039F';
    e2uHash['Pi'] = '\u03A0';
    e2uHash['Rho'] = '\u03A1';
    e2uHash['Sigma'] = '\u03A3';
    e2uHash['Tau'] = '\u03A4';
    e2uHash['Upsilon'] = '\u03A5';
    e2uHash['Phi'] = '\u03A6';
    e2uHash['Chi'] = '\u03A7';
    e2uHash['Psi'] = '\u03A8';
    e2uHash['Omega'] = '\u03A9';
    e2uHash['alpha'] = '\u03B1';
    e2uHash['beta'] = '\u03B2';
    e2uHash['gamma'] = '\u03B3';
    e2uHash['delta'] = '\u03B4';
    e2uHash['epsilon'] = '\u03B5';
    e2uHash['zeta'] = '\u03B6';
    e2uHash['eta'] = '\u03B7';
    e2uHash['theta'] = '\u03B8';
    e2uHash['iota'] = '\u03B9';
    e2uHash['kappa'] = '\u03BA';
    e2uHash['lambda'] = '\u03BB';
    e2uHash['mu'] = '\u03BC';
    e2uHash['nu'] = '\u03BD';
    e2uHash['xi'] = '\u03BE';
    e2uHash['omicron'] = '\u03BF';
    e2uHash['pi'] = '\u03C0';
    e2uHash['rho'] = '\u03C1';
    e2uHash['sigmaf'] = '\u03C2';
    e2uHash['sigma'] = '\u03C3';
    e2uHash['tau'] = '\u03C4';
    e2uHash['upsilon'] = '\u03C5';
    e2uHash['phi'] = '\u03C6';
    e2uHash['chi'] = '\u03C7';
    e2uHash['psi'] = '\u03C8';
    e2uHash['omega'] = '\u03C9';
    e2uHash['thetasym'] = '\u03D1';
    e2uHash['upsih'] = '\u03D2';
    e2uHash['piv'] = '\u03D6';
    e2uHash['bull'] = '\u2022';
    e2uHash['hellip'] = '\u2026';
    e2uHash['prime'] = '\u2032';
    e2uHash['Prime'] = '\u2033';
    e2uHash['oline'] = '\u203E';
    e2uHash['frasl'] = '\u2044';
    e2uHash['weierp'] = '\u2118';
    e2uHash['image'] = '\u2111';
    e2uHash['real'] = '\u211C';
    e2uHash['trade'] = '\u2122';
    e2uHash['alefsym'] = '\u2135';
    e2uHash['larr'] = '\u2190';
    e2uHash['uarr'] = '\u2191';
    e2uHash['rarr'] = '\u2192';
    e2uHash['darr'] = '\u2193';
    e2uHash['harr'] = '\u2194';
    e2uHash['crarr'] = '\u21B5';
    e2uHash['lArr'] = '\u21D0';
    e2uHash['uArr'] = '\u21D1';
    e2uHash['rArr'] = '\u21D2';
    e2uHash['dArr'] = '\u21D3';
    e2uHash['hArr'] = '\u21D4';
    e2uHash['forall'] = '\u2200';
    e2uHash['part'] = '\u2202';
    e2uHash['exist'] = '\u2203';
    e2uHash['empty'] = '\u2205';
    e2uHash['nabla'] = '\u2207';
    e2uHash['isin'] = '\u2208';
    e2uHash['notin'] = '\u2209';
    e2uHash['ni'] = '\u220B';
    e2uHash['prod'] = '\u220F';
    e2uHash['sum'] = '\u2211';
    e2uHash['minus'] = '\u2212';
    e2uHash['lowast'] = '\u2217';
    e2uHash['radic'] = '\u221A';
    e2uHash['prop'] = '\u221D';
    e2uHash['infin'] = '\u221E';
    e2uHash['ang'] = '\u2220';
    e2uHash['and'] = '\u2227';
    e2uHash['or'] = '\u2228';
    e2uHash['cap'] = '\u2229';
    e2uHash['cup'] = '\u222A';
    e2uHash['int'] = '\u222B';
    e2uHash['there4'] = '\u2234';
    e2uHash['sim'] = '\u223C';
    e2uHash['cong'] = '\u2245';
    e2uHash['asymp'] = '\u2248';
    e2uHash['ne'] = '\u2260';
    e2uHash['equiv'] = '\u2261';
    e2uHash['le'] = '\u2264';
    e2uHash['ge'] = '\u2265';
    e2uHash['sub'] = '\u2282';
    e2uHash['sup'] = '\u2283';
    e2uHash['nsub'] = '\u2284';
    e2uHash['sube'] = '\u2286';
    e2uHash['supe'] = '\u2287';
    e2uHash['oplus'] = '\u2295';
    e2uHash['otimes'] = '\u2297';
    e2uHash['perp'] = '\u22A5';
    e2uHash['sdot'] = '\u22C5';
    e2uHash['lceil'] = '\u2308';
    e2uHash['rceil'] = '\u2309';
    e2uHash['lfloor'] = '\u230A';
    e2uHash['rfloor'] = '\u230B';
    e2uHash['lang'] = '\u2329';
    e2uHash['rang'] = '\u232A';
    e2uHash['loz'] = '\u25CA';
    e2uHash['spades'] = '\u2660';
    e2uHash['clubs'] = '\u2663';
    e2uHash['hearts'] = '\u2665';
    e2uHash['diams'] = '\u2666';
})();

SimileAjax.HTML.deEntify = function(s) {
    var e2uHash = SimileAjax.HTML._e2uHash;

    var re = /&(\w+?);/;
    while (re.test(s)) {
        var m = s.match(re);
        s = s.replace(re, e2uHash[m[1]]);
    }
    return s;
};

/**
 * A basic set (in the mathematical sense) data structure
 *
 * @constructor
 * @param {Array or SimileAjax.Set} [a] an initial collection
 */
SimileAjax.Set = function(a) {
    this._hash = {};
    this._count = 0;

    if (a instanceof Array) {
        for (var i = 0; i < a.length; i++) {
            this.add(a[i]);
        }
    } else if (a instanceof SimileAjax.Set) {
        this.addSet(a);
    }
}

/**
 * Adds the given object to this set, assuming there it does not already exist
 *
 * @param {Object} o the object to add
 * @return {Boolean} true if the object was added, false if not
 */
SimileAjax.Set.prototype.add = function(o) {
    if (!(o in this._hash)) {
        this._hash[o] = true;
        this._count++;
        return true;
    }
    return false;
}

/**
 * Adds each element in the given set to this set
 *
 * @param {SimileAjax.Set} set the set of elements to add
 */
SimileAjax.Set.prototype.addSet = function(set) {
    for (var o in set._hash) {
        this.add(o);
    }
}

/**
 * Removes the given element from this set
 *
 * @param {Object} o the object to remove
 * @return {Boolean} true if the object was successfully removed,
 *   false otherwise
 */
SimileAjax.Set.prototype.remove = function(o) {
    if (o in this._hash) {
        delete this._hash[o];
        this._count--;
        return true;
    }
    return false;
}

/**
 * Removes the elements in this set that correspond to the elements in the
 * given set
 *
 * @param {SimileAjax.Set} set the set of elements to remove
 */
SimileAjax.Set.prototype.removeSet = function(set) {
    for (var o in set._hash) {
        this.remove(o);
    }
}

/**
 * Removes all elements in this set that are not present in the given set, i.e.
 * modifies this set to the intersection of the two sets
 *
 * @param {SimileAjax.Set} set the set to intersect
 */
SimileAjax.Set.prototype.retainSet = function(set) {
    for (var o in this._hash) {
        if (!set.contains(o)) {
            delete this._hash[o];
            this._count--;
        }
    }
}

/**
 * Returns whether or not the given element exists in this set
 *
 * @param {SimileAjax.Set} o the object to test for
 * @return {Boolean} true if the object is present, false otherwise
 */
SimileAjax.Set.prototype.contains = function(o) {
    return (o in this._hash);
}

/**
 * Returns the number of elements in this set
 *
 * @return {Number} the number of elements in this set
 */
SimileAjax.Set.prototype.size = function() {
    return this._count;
}

/**
 * Returns the elements of this set as an array
 *
 * @return {Array} a new array containing the elements of this set
 */
SimileAjax.Set.prototype.toArray = function() {
    var a = [];
    for (var o in this._hash) {
        a.push(o);
    }
    return a;
}

/**
 * Iterates through the elements of this set, order unspecified, executing the
 * given function on each element until the function returns true
 *
 * @param {Function} f a function of form f(element)
 */
SimileAjax.Set.prototype.visit = function(f) {
    for (var o in this._hash) {
        if (f(o) == true) {
            break;
        }
    }
}

/**
 * A sorted array data structure
 *
 * @constructor
 */
SimileAjax.SortedArray = function(compare, initialArray) {
    this._a = (initialArray instanceof Array) ? initialArray : [];
    this._compare = compare;
};

SimileAjax.SortedArray.prototype.add = function(elmt) {
    var sa = this;
    var index = this.find(function(elmt2) {
        return sa._compare(elmt2, elmt);
    });

    if (index < this._a.length) {
        this._a.splice(index, 0, elmt);
    } else {
        this._a.push(elmt);
    }
};

SimileAjax.SortedArray.prototype.remove = function(elmt) {
    var sa = this;
    var index = this.find(function(elmt2) {
        return sa._compare(elmt2, elmt);
    });

    while (index < this._a.length && this._compare(this._a[index], elmt) == 0) {
        if (this._a[index] == elmt) {
            this._a.splice(index, 1);
            return true;
        } else {
            index++;
        }
    }
    return false;
};

SimileAjax.SortedArray.prototype.removeAll = function() {
    this._a = [];
};

SimileAjax.SortedArray.prototype.elementAt = function(index) {
    return this._a[index];
};

SimileAjax.SortedArray.prototype.length = function() {
    return this._a.length;
};

SimileAjax.SortedArray.prototype.find = function(compare) {
    var a = 0;
    var b = this._a.length;

    while (a < b) {
        var mid = Math.floor((a + b) / 2);
        var c = compare(this._a[mid]);
        if (mid == a) {
            return c < 0 ? a + 1 : a;
        } else if (c < 0) {
            a = mid;
        } else {
            b = mid;
        }
    }
    return a;
};

SimileAjax.SortedArray.prototype.getFirst = function() {
    return (this._a.length > 0) ? this._a[0] : null;
};

SimileAjax.SortedArray.prototype.getLast = function() {
    return (this._a.length > 0) ? this._a[this._a.length - 1] : null;
};

/*==================================================
 *  Event Index
 *==================================================
 */

SimileAjax.EventIndex = function(unit) {
    var eventIndex = this;

    this._unit = (unit != null) ? unit : SimileAjax.NativeDateUnit;
    this._events = new SimileAjax.SortedArray(
        function(event1, event2) {
            return eventIndex._unit.compare(event1.getStart(), event2.getStart());
        }
    );
    this._idToEvent = {};
    this._indexed = true;
};

SimileAjax.EventIndex.prototype.getUnit = function() {
    return this._unit;
};

SimileAjax.EventIndex.prototype.getEvent = function(id) {
    return this._idToEvent[id];
};

SimileAjax.EventIndex.prototype.add = function(evt) {
    this._events.add(evt);
    this._idToEvent[evt.getID()] = evt;
    this._indexed = false;
};

SimileAjax.EventIndex.prototype.removeAll = function() {
    this._events.removeAll();
    this._idToEvent = {};
    this._indexed = false;
};

SimileAjax.EventIndex.prototype.getCount = function() {
    return this._events.length();
};

SimileAjax.EventIndex.prototype.getIterator = function(startDate, endDate) {
    if (!this._indexed) {
        this._index();
    }
    return new SimileAjax.EventIndex._Iterator(this._events, startDate, endDate, this._unit);
};

SimileAjax.EventIndex.prototype.getReverseIterator = function(startDate, endDate) {
    if (!this._indexed) {
        this._index();
    }
    return new SimileAjax.EventIndex._ReverseIterator(this._events, startDate, endDate, this._unit);
};

SimileAjax.EventIndex.prototype.getAllIterator = function() {
    return new SimileAjax.EventIndex._AllIterator(this._events);
};

SimileAjax.EventIndex.prototype.getEarliestDate = function() {
    var evt = this._events.getFirst();
    return (evt == null) ? null : evt.getStart();
};

SimileAjax.EventIndex.prototype.getLatestDate = function() {
    var evt = this._events.getLast();
    if (evt == null) {
        return null;
    }

    if (!this._indexed) {
        this._index();
    }

    var index = evt._earliestOverlapIndex;
    var date = this._events.elementAt(index).getEnd();
    for (var i = index + 1; i < this._events.length(); i++) {
        date = this._unit.later(date, this._events.elementAt(i).getEnd());
    }

    return date;
};

SimileAjax.EventIndex.prototype._index = function() {
    /*
     *  For each event, we want to find the earliest preceding
     *  event that overlaps with it, if any.
     */

    var l = this._events.length();
    for (var i = 0; i < l; i++) {
        var evt = this._events.elementAt(i);
        evt._earliestOverlapIndex = i;
    }

    var toIndex = 1;
    for (var i = 0; i < l; i++) {
        var evt = this._events.elementAt(i);
        var end = evt.getEnd();

        toIndex = Math.max(toIndex, i + 1);
        while (toIndex < l) {
            var evt2 = this._events.elementAt(toIndex);
            var start2 = evt2.getStart();

            if (this._unit.compare(start2, end) < 0) {
                evt2._earliestOverlapIndex = i;
                toIndex++;
            } else {
                break;
            }
        }
    }
    this._indexed = true;
};

SimileAjax.EventIndex._Iterator = function(events, startDate, endDate, unit) {
    this._events = events;
    this._startDate = startDate;
    this._endDate = endDate;
    this._unit = unit;

    this._currentIndex = events.find(function(evt) {
        return unit.compare(evt.getStart(), startDate);
    });
    if (this._currentIndex - 1 >= 0) {
        this._currentIndex = this._events.elementAt(this._currentIndex - 1)._earliestOverlapIndex;
    }
    this._currentIndex--;

    this._maxIndex = events.find(function(evt) {
        return unit.compare(evt.getStart(), endDate);
    });

    this._hasNext = false;
    this._next = null;
    this._findNext();
};

SimileAjax.EventIndex._Iterator.prototype = {
    hasNext: function() {
        return this._hasNext;
    },
    next: function() {
        if (this._hasNext) {
            var next = this._next;
            this._findNext();

            return next;
        } else {
            return null;
        }
    },
    _findNext: function() {
        var unit = this._unit;
        while ((++this._currentIndex) < this._maxIndex) {
            var evt = this._events.elementAt(this._currentIndex);
            if (unit.compare(evt.getStart(), this._endDate) < 0 &&
                unit.compare(evt.getEnd(), this._startDate) > 0) {
                this._next = evt;
                this._hasNext = true;
                return;
            }

        }
        this._next = null;
        this._hasNext = false;
    }
};

SimileAjax.EventIndex._ReverseIterator = function(events, startDate, endDate, unit) {
    this._events = events;
    this._startDate = startDate;
    this._endDate = endDate;
    this._unit = unit;

    this._minIndex = events.find(function(evt) {
        return unit.compare(evt.getStart(), startDate);
    });
    if (this._minIndex - 1 >= 0) {
        this._minIndex = this._events.elementAt(this._minIndex - 1)._earliestOverlapIndex;
    }

    this._maxIndex = events.find(function(evt) {
        return unit.compare(evt.getStart(), endDate);
    });

    this._currentIndex = this._maxIndex;
    this._hasNext = false;
    this._next = null;
    this._findNext();
};

SimileAjax.EventIndex._ReverseIterator.prototype = {
    hasNext: function() {
        return this._hasNext;
    },
    next: function() {
        if (this._hasNext) {
            var next = this._next;
            this._findNext();

            return next;
        } else {
            return null;
        }
    },
    _findNext: function() {
        var unit = this._unit;
        while ((--this._currentIndex) >= this._minIndex) {
            var evt = this._events.elementAt(this._currentIndex);
            if (unit.compare(evt.getStart(), this._endDate) < 0 &&
                unit.compare(evt.getEnd(), this._startDate) > 0) {

                this._next = evt;
                this._hasNext = true;
                return;
            }
        }
        this._next = null;
        this._hasNext = false;
    }
};

SimileAjax.EventIndex._AllIterator = function(events) {
    this._events = events;
    this._index = 0;
};

SimileAjax.EventIndex._AllIterator.prototype = {
    hasNext: function() {
        return this._index < this._events.length();
    },
    next: function() {
        return this._index < this._events.length() ?
            this._events.elementAt(this._index++) : null;
    }
};

/*==================================================
 *  Default Unit
 *==================================================
 */

SimileAjax.NativeDateUnit = new Object();

SimileAjax.NativeDateUnit.makeDefaultValue = function() {
    return new Date();
};

SimileAjax.NativeDateUnit.cloneValue = function(v) {
    return new Date(v.getTime());
};

SimileAjax.NativeDateUnit.getParser = function(format) {
    if (typeof format == "string") {
        format = format.toLowerCase();
    }
    return (format == "iso8601" || format == "iso 8601") ?
        SimileAjax.DateTime.parseIso8601DateTime :
        SimileAjax.DateTime.parseGregorianDateTime;
};

SimileAjax.NativeDateUnit.parseFromObject = function(o) {
    return SimileAjax.DateTime.parseGregorianDateTime(o);
};

SimileAjax.NativeDateUnit.toNumber = function(v) {
    return v.getTime();
};

SimileAjax.NativeDateUnit.fromNumber = function(n) {
    return new Date(n);
};

SimileAjax.NativeDateUnit.compare = function(v1, v2) {
    var n1, n2;
    if (typeof v1 == "object") {
        n1 = v1.getTime();
    } else {
        n1 = Number(v1);
    }
    if (typeof v2 == "object") {
        n2 = v2.getTime();
    } else {
        n2 = Number(v2);
    }

    return n1 - n2;
};

SimileAjax.NativeDateUnit.earlier = function(v1, v2) {
    return SimileAjax.NativeDateUnit.compare(v1, v2) < 0 ? v1 : v2;
};

SimileAjax.NativeDateUnit.later = function(v1, v2) {
    return SimileAjax.NativeDateUnit.compare(v1, v2) > 0 ? v1 : v2;
};

SimileAjax.NativeDateUnit.change = function(v, n) {
    return new Date(v.getTime() + n);
};

/*==================================================
 *  General, miscellaneous SimileAjax stuff
 *==================================================
 */




SimileAjax.ListenerQueue = function(wildcardHandlerName) {
    this._listeners = [];
    this._wildcardHandlerName = wildcardHandlerName;
};

SimileAjax.ListenerQueue.prototype.add = function(listener) {
    this._listeners.push(listener);
};

SimileAjax.ListenerQueue.prototype.remove = function(listener) {
    var listeners = this._listeners;
    for (var i = 0; i < listeners.length; i++) {
        if (listeners[i] == listener) {
            listeners.splice(i, 1);
            break;
        }
    }
};

SimileAjax.ListenerQueue.prototype.fire = function(handlerName, args) {
    var listeners = [].concat(this._listeners);
    for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        if (handlerName in listener) {
            try {
                listener[handlerName].apply(listener, args);
            } catch (e) {
                SimileAjax.Debug.exception("Error firing event of name " + handlerName, e);
            }
        } else if (this._wildcardHandlerName != null &&
            this._wildcardHandlerName in listener) {
            try {
                listener[this._wildcardHandlerName].apply(listener, [handlerName]);
            } catch (e) {
                SimileAjax.Debug.exception("Error firing event of name " + handlerName + " to wildcard handler", e);
            }
        }
    }
};

/*======================================================================
 *  History
 *
 *  This is a singleton that keeps track of undoable user axnC8rMap and
 *  performs undos and redos in response to the browser's Back and
 *  Forward buttons.
 *
 *  Call addAction(action) to register an undoable user action. action
 *  must have 4 fields:
 *
 *      perform: an argument-less function that carries out the action
 *      undo:    an argument-less function that undos the action
 *      label:   a short, user-friendly string describing the action
 *      uiLayer: the UI layer on which the action takes place
 *
 *  By default, the history keeps track of upto 10 axnC8rMap. You can
 *  configure this behavior by setting
 *      SimileAjax.History.maxHistoryLength
 *  to a different number.
 *
 *  An iframe is inserted into the document's body element to track
 *  onload events.
 *======================================================================
 */

SimileAjax.History = {
    maxHistoryLength: 10,
    historyFile: "__history__.html",
    enabled: false,
    _initialized: false,
    _listeners: new SimileAjax.ListenerQueue(),
    _actions: [],
    _baseIndex: 0,
    _currentIndex: 0,
    _plainDocumentTitle: document.title
};

SimileAjax.History.formatHistoryEntryTitle = function(actionLabel) {
    return SimileAjax.History._plainDocumentTitle + " {" + actionLabel + "}";
};

SimileAjax.History.initialize = function() {
    if (SimileAjax.History._initialized) {
        return;
    }

    if (SimileAjax.History.enabled) {
        var iframe = document.createElement("iframe");
        iframe.id = "simile-ajax-history";
        iframe.style.position = "absolute";
        iframe.style.width = "10px";
        iframe.style.height = "10px";
        iframe.style.top = "0px";
        iframe.style.left = "0px";
        iframe.style.visibility = "hidden";
        iframe.src = SimileAjax.History.historyFile + "?0";

        document.body.appendChild(iframe);
        SimileAjax.DOM.registerEvent(iframe, "load", SimileAjax.History._handleIFrameOnLoad);

        SimileAjax.History._iframe = iframe;
    }
    SimileAjax.History._initialized = true;
};

SimileAjax.History.addListener = function(listener) {
    SimileAjax.History.initialize();
    SimileAjax.History._listeners.add(listener);
};

SimileAjax.History.removeListener = function(listener) {
    SimileAjax.History.initialize();
    SimileAjax.History._listeners.remove(listener);
};

SimileAjax.History.addAction = function(action) {
    SimileAjax.History.initialize();
    SimileAjax.History._listeners.fire("onBeforePerform", [action]);

    window.setTimeout(function() {
        try {
            action.perform();
            SimileAjax.History._listeners.fire("onAfterPerform", [action]);
            if (SimileAjax.History.enabled) {
                SimileAjax.History._actions = SimileAjax.History._actions.slice(
                    0, SimileAjax.History._currentIndex - SimileAjax.History._baseIndex);

                SimileAjax.History._actions.push(action);
                SimileAjax.History._currentIndex++;

                var diff = SimileAjax.History._actions.length - SimileAjax.History.maxHistoryLength;

                if (diff > 0) {
                    SimileAjax.History._actions = SimileAjax.History._actions.slice(diff);
                    SimileAjax.History._baseIndex += diff;
                }

                try {
                    SimileAjax.History._iframe.contentWindow.location.search =
                        "?" + SimileAjax.History._currentIndex;
                } catch (e) {
                    /*
                     *  We can't modify location.search most probably because it's a file:// url.
                     *  We'll just going to modify the document's title.
                     */
                    var title = SimileAjax.History.formatHistoryEntryTitle(action.label);
                    document.title = title;
                }
            }
        } catch (e) {
            SimileAjax.Debug.exception(e, "Error adding action {" + action.label + "} to history");
        }
    }, 0);
};

SimileAjax.History.addLengthyAction = function(perform, undo, label) {
    SimileAjax.History.addAction({
        perform: perform,
        undo: undo,
        label: label,
        uiLayer: SimileAjax.WindowManager.getBaseLayer(),
        lengthy: true
    });
};

SimileAjax.History._handleIFrameOnLoad = function() {
    /*
     *  This function is invoked when the user herself
     *  navigates backward or forward. We need to adjust
     *  the application's state accordingly.
     */
    try {
        var q = SimileAjax.History._iframe.contentWindow.location.search;
        var c = (q.length == 0) ? 0 : Math.max(0, parseInt(q.substr(1)));

        var finishUp = function() {
            var diff = c - SimileAjax.History._currentIndex;
            SimileAjax.History._currentIndex += diff;
            SimileAjax.History._baseIndex += diff;
            SimileAjax.History._iframe.contentWindow.location.search = "?" + c;
        };

        if (c < SimileAjax.History._currentIndex) { // need to undo
            SimileAjax.History._listeners.fire("onBeforeUndoSeveral", []);
            window.setTimeout(function() {
                while (SimileAjax.History._currentIndex > c &&
                    SimileAjax.History._currentIndex > SimileAjax.History._baseIndex) {

                    SimileAjax.History._currentIndex--;

                    var action = SimileAjax.History._actions[SimileAjax.History._currentIndex - SimileAjax.History._baseIndex];

                    try {
                        action.undo();
                    } catch (e) {
                        SimileAjax.Debug.exception(e, "History: Failed to undo action {" + action.label + "}");
                    }
                }

                SimileAjax.History._listeners.fire("onAfterUndoSeveral", []);
                finishUp();
            }, 0);
        } else if (c > SimileAjax.History._currentIndex) { // need to redo
            SimileAjax.History._listeners.fire("onBeforeRedoSeveral", []);
            window.setTimeout(function() {
                while (SimileAjax.History._currentIndex < c &&
                    SimileAjax.History._currentIndex - SimileAjax.History._baseIndex < SimileAjax.History._actions.length) {

                    var action = SimileAjax.History._actions[SimileAjax.History._currentIndex - SimileAjax.History._baseIndex];

                    try {
                        action.perform();
                    } catch (e) {
                        SimileAjax.Debug.exception(e, "History: Failed to redo action {" + action.label + "}");
                    }

                    SimileAjax.History._currentIndex++;
                }

                SimileAjax.History._listeners.fire("onAfterRedoSeveral", []);
                finishUp();
            }, 0);
        } else {
            var index = SimileAjax.History._currentIndex - SimileAjax.History._baseIndex - 1;
            var title = (index >= 0 && index < SimileAjax.History._actions.length) ?
                SimileAjax.History.formatHistoryEntryTitle(SimileAjax.History._actions[index].label) :
                SimileAjax.History._plainDocumentTitle;

            SimileAjax.History._iframe.contentWindow.document.title = title;
            document.title = title;
        }
    } catch (e) {
        // silent
    }
};

SimileAjax.History.getNextUndoAction = function() {
    try {
        var index = SimileAjax.History._currentIndex - SimileAjax.History._baseIndex - 1;
        return SimileAjax.History._actions[index];
    } catch (e) {
        return null;
    }
};

SimileAjax.History.getNextRedoAction = function() {
    try {
        var index = SimileAjax.History._currentIndex - SimileAjax.History._baseIndex;
        return SimileAjax.History._actions[index];
    } catch (e) {
        return null;
    }
};

/**
 * @fileOverview UI layers and window-wide dragging
 * @name SimileAjax.WindowManager
 */

/**
 *  This is a singleton that keeps track of UI layers (modal and
 *  modeless) and enables/disables UI elements based on which layers
 *  they belong to. It also provides window-wide dragging
 *  implementation.
 */
SimileAjax.WindowManager = {
    _initialized: false,
    _listeners: [],
    _draggedElement: null,
    _draggedElementCallback: null,
    _dropTargetHighlightElement: null,
    _lastCoords: null,
    _ghostCoords: null,
    _draggingMode: "",
    _dragging: false,

    _layers: []
};

SimileAjax.WindowManager.initialize = function() {
    if (SimileAjax.WindowManager._initialized) {
        return;
    }

    SimileAjax.DOM.registerEvent(document.body, "mousedown", SimileAjax.WindowManager._onBodyMouseDown);
    SimileAjax.DOM.registerEvent(document.body, "mousemove", SimileAjax.WindowManager._onBodyMouseMove);
    SimileAjax.DOM.registerEvent(document.body, "mouseup", SimileAjax.WindowManager._onBodyMouseUp);
    SimileAjax.DOM.registerEvent(document, "keydown", SimileAjax.WindowManager._onBodyKeyDown);
    SimileAjax.DOM.registerEvent(document, "keyup", SimileAjax.WindowManager._onBodyKeyUp);

    SimileAjax.WindowManager._layers.push({
        index: 0
    });

    SimileAjax.WindowManager._historyListener = {
        onBeforeUndoSeveral: function() {},
        onAfterUndoSeveral: function() {},
        onBeforeUndo: function() {},
        onAfterUndo: function() {},

        onBeforeRedoSeveral: function() {},
        onAfterRedoSeveral: function() {},
        onBeforeRedo: function() {},
        onAfterRedo: function() {}
    };
    SimileAjax.History.addListener(SimileAjax.WindowManager._historyListener);

    SimileAjax.WindowManager._initialized = true;
};

SimileAjax.WindowManager.getBaseLayer = function() {
    SimileAjax.WindowManager.initialize();
    return SimileAjax.WindowManager._layers[0];
};

SimileAjax.WindowManager.getHighestLayer = function() {
    SimileAjax.WindowManager.initialize();
    return SimileAjax.WindowManager._layers[SimileAjax.WindowManager._layers.length - 1];
};

SimileAjax.WindowManager.registerEventWithObject = function(elmt, eventName, obj, handlerName, layer) {
    SimileAjax.WindowManager.registerEvent(
        elmt,
        eventName,
        function(elmt2, evt, target) {
            return obj[handlerName].call(obj, elmt2, evt, target);
        },
        layer
    );
};

SimileAjax.WindowManager.registerEvent = function(elmt, eventName, handler, layer) {
    if (layer == null) {
        layer = SimileAjax.WindowManager.getHighestLayer();
    }

    var handler2 = function(elmt, evt, target) {
        if (SimileAjax.WindowManager._canProcessEventAtLayer(layer)) {
            SimileAjax.WindowManager._popToLayer(layer.index);
            try {
                handler(elmt, evt, target);
            } catch (e) {
                SimileAjax.Debug.exception(e);
            }
        }
        SimileAjax.DOM.cancelEvent(evt);
        return false;
    }

    SimileAjax.DOM.registerEvent(elmt, eventName, handler2);
};

SimileAjax.WindowManager.pushLayer = function(f, ephemeral, elmt) {
    var layer = {
        onPop: f,
        index: SimileAjax.WindowManager._layers.length,
        ephemeral: (ephemeral),
        elmt: elmt
    };
    SimileAjax.WindowManager._layers.push(layer);

    return layer;
};

SimileAjax.WindowManager.popLayer = function(layer) {
    for (var i = 1; i < SimileAjax.WindowManager._layers.length; i++) {
        if (SimileAjax.WindowManager._layers[i] == layer) {
            SimileAjax.WindowManager._popToLayer(i - 1);
            break;
        }
    }
};

SimileAjax.WindowManager.popAllLayers = function() {
    SimileAjax.WindowManager._popToLayer(0);
};

SimileAjax.WindowManager.registerForDragging = function(elmt, callback, layer) {
    SimileAjax.WindowManager.registerEvent(
        elmt,
        "mousedown",
        function(elmt, evt, target) {
            SimileAjax.WindowManager._handleMouseDown(elmt, evt, callback);
        },
        layer
    );
};

SimileAjax.WindowManager._popToLayer = function(level) {
    while (level + 1 < SimileAjax.WindowManager._layers.length) {
        try {
            var layer = SimileAjax.WindowManager._layers.pop();
            if (layer.onPop != null) {
                layer.onPop();
            }
        } catch (e) {}
    }
};

SimileAjax.WindowManager._canProcessEventAtLayer = function(layer) {
    if (layer.index == (SimileAjax.WindowManager._layers.length - 1)) {
        return true;
    }
    for (var i = layer.index + 1; i < SimileAjax.WindowManager._layers.length; i++) {
        if (!SimileAjax.WindowManager._layers[i].ephemeral) {
            return false;
        }
    }
    return true;
};

SimileAjax.WindowManager.cancelPopups = function(evt) {
    var evtCoords = (evt) ? SimileAjax.DOM.getEventPageCoordinates(evt) : {
        x: -1,
        y: -1
    };

    var i = SimileAjax.WindowManager._layers.length - 1;
    while (i > 0 && SimileAjax.WindowManager._layers[i].ephemeral) {
        var layer = SimileAjax.WindowManager._layers[i];
        if (layer.elmt != null) { // if event falls within main element of layer then don't cancel
            var elmt = layer.elmt;
            var elmtCoords = SimileAjax.DOM.getPageCoordinates(elmt);
            if (evtCoords.x >= elmtCoords.left && evtCoords.x < (elmtCoords.left + elmt.offsetWidth) &&
                evtCoords.y >= elmtCoords.top && evtCoords.y < (elmtCoords.top + elmt.offsetHeight)) {
                break;
            }
        }
        i--;
    }
    SimileAjax.WindowManager._popToLayer(i);
};

SimileAjax.WindowManager._onBodyMouseDown = function(elmt, evt, target) {
    if (!("eventPhase" in evt) || evt.eventPhase == evt.BUBBLING_PHASE) {
        SimileAjax.WindowManager.cancelPopups(evt);
    }
};

SimileAjax.WindowManager._handleMouseDown = function(elmt, evt, callback) {
    SimileAjax.WindowManager._draggedElement = elmt;
    SimileAjax.WindowManager._draggedElementCallback = callback;
    SimileAjax.WindowManager._lastCoords = {
        x: evt.clientX,
        y: evt.clientY
    };

    SimileAjax.DOM.cancelEvent(evt);
    return false;
};

SimileAjax.WindowManager._onBodyKeyDown = function(elmt, evt, target) {
    if (SimileAjax.WindowManager._dragging) {
        if (evt.keyCode == 27) { // esc
            SimileAjax.WindowManager._cancelDragging();
        } else if ((evt.keyCode == 17 || evt.keyCode == 16) && SimileAjax.WindowManager._draggingMode != "copy") {
            SimileAjax.WindowManager._draggingMode = "copy";

            var img = SimileAjax.Graphics.createTranslucentImage(SimileAjax.urlPrefix + "images/copy.png");
            img.style.position = "absolute";
            img.style.left = (SimileAjax.WindowManager._ghostCoords.left - 16) + "px";
            img.style.top = (SimileAjax.WindowManager._ghostCoords.top) + "px";
            document.body.appendChild(img);

            SimileAjax.WindowManager._draggingModeIndicatorElmt = img;
        }
    }
};

SimileAjax.WindowManager._onBodyKeyUp = function(elmt, evt, target) {
    if (SimileAjax.WindowManager._dragging) {
        if (evt.keyCode == 17 || evt.keyCode == 16) {
            SimileAjax.WindowManager._draggingMode = "";
            if (SimileAjax.WindowManager._draggingModeIndicatorElmt != null) {
                document.body.removeChild(SimileAjax.WindowManager._draggingModeIndicatorElmt);
                SimileAjax.WindowManager._draggingModeIndicatorElmt = null;
            }
        }
    }
};

SimileAjax.WindowManager._onBodyMouseMove = function(elmt, evt, target) {
    if (SimileAjax.WindowManager._draggedElement != null) {
        var callback = SimileAjax.WindowManager._draggedElementCallback;

        var lastCoords = SimileAjax.WindowManager._lastCoords;
        var diffX = evt.clientX - lastCoords.x;
        var diffY = evt.clientY - lastCoords.y;

        if (!SimileAjax.WindowManager._dragging) {
            if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
                try {
                    if ("onDragStart" in callback) {
                        callback.onDragStart();
                    }

                    if ("ghost" in callback && callback.ghost) {
                        var draggedElmt = SimileAjax.WindowManager._draggedElement;

                        SimileAjax.WindowManager._ghostCoords = SimileAjax.DOM.getPageCoordinates(draggedElmt);
                        SimileAjax.WindowManager._ghostCoords.left += diffX;
                        SimileAjax.WindowManager._ghostCoords.top += diffY;

                        var ghostElmt = draggedElmt.cloneNode(true);
                        ghostElmt.style.position = "absolute";
                        ghostElmt.style.left = SimileAjax.WindowManager._ghostCoords.left + "px";
                        ghostElmt.style.top = SimileAjax.WindowManager._ghostCoords.top + "px";
                        ghostElmt.style.zIndex = 1000;
                        SimileAjax.Graphics.setOpacity(ghostElmt, 50);

                        document.body.appendChild(ghostElmt);
                        callback._ghostElmt = ghostElmt;
                    }

                    SimileAjax.WindowManager._dragging = true;
                    SimileAjax.WindowManager._lastCoords = {
                        x: evt.clientX,
                        y: evt.clientY
                    };

                    document.body.focus();
                } catch (e) {
                    SimileAjax.Debug.exception("WindowManager: Error handling mouse down", e);
                    SimileAjax.WindowManager._cancelDragging();
                }
            }
        } else {
            try {
                SimileAjax.WindowManager._lastCoords = {
                    x: evt.clientX,
                    y: evt.clientY
                };

                if ("onDragBy" in callback) {
                    callback.onDragBy(diffX, diffY);
                }

                if ("_ghostElmt" in callback) {
                    var ghostElmt = callback._ghostElmt;

                    SimileAjax.WindowManager._ghostCoords.left += diffX;
                    SimileAjax.WindowManager._ghostCoords.top += diffY;

                    ghostElmt.style.left = SimileAjax.WindowManager._ghostCoords.left + "px";
                    ghostElmt.style.top = SimileAjax.WindowManager._ghostCoords.top + "px";
                    if (SimileAjax.WindowManager._draggingModeIndicatorElmt != null) {
                        var indicatorElmt = SimileAjax.WindowManager._draggingModeIndicatorElmt;

                        indicatorElmt.style.left = (SimileAjax.WindowManager._ghostCoords.left - 16) + "px";
                        indicatorElmt.style.top = SimileAjax.WindowManager._ghostCoords.top + "px";
                    }

                    if ("droppable" in callback && callback.droppable) {
                        var coords = SimileAjax.DOM.getEventPageCoordinates(evt);
                        var target = SimileAjax.DOM.hittest(
                            coords.x, coords.y, [SimileAjax.WindowManager._ghostElmt,
                                SimileAjax.WindowManager._dropTargetHighlightElement
                            ]
                        );
                        target = SimileAjax.WindowManager._findDropTarget(target);

                        if (target != SimileAjax.WindowManager._potentialDropTarget) {
                            if (SimileAjax.WindowManager._dropTargetHighlightElement != null) {
                                document.body.removeChild(SimileAjax.WindowManager._dropTargetHighlightElement);

                                SimileAjax.WindowManager._dropTargetHighlightElement = null;
                                SimileAjax.WindowManager._potentialDropTarget = null;
                            }

                            var droppable = false;
                            if (target != null) {
                                if ((!("canDropOn" in callback) || callback.canDropOn(target)) &&
                                    (!("canDrop" in target) || target.canDrop(SimileAjax.WindowManager._draggedElement))) {

                                    droppable = true;
                                }
                            }

                            if (droppable) {
                                var border = 4;
                                var targetCoords = SimileAjax.DOM.getPageCoordinates(target);
                                var highlight = document.createElement("div");
                                highlight.style.border = border + "px solid yellow";
                                highlight.style.backgroundColor = "yellow";
                                highlight.style.position = "absolute";
                                highlight.style.left = targetCoords.left + "px";
                                highlight.style.top = targetCoords.top + "px";
                                highlight.style.width = (target.offsetWidth - border * 2) + "px";
                                highlight.style.height = (target.offsetHeight - border * 2) + "px";
                                SimileAjax.Graphics.setOpacity(highlight, 30);
                                document.body.appendChild(highlight);

                                SimileAjax.WindowManager._potentialDropTarget = target;
                                SimileAjax.WindowManager._dropTargetHighlightElement = highlight;
                            }
                        }
                    }
                }
            } catch (e) {
                SimileAjax.Debug.exception("WindowManager: Error handling mouse move", e);
                SimileAjax.WindowManager._cancelDragging();
            }
        }

        SimileAjax.DOM.cancelEvent(evt);
        return false;
    }
};

SimileAjax.WindowManager._onBodyMouseUp = function(elmt, evt, target) {
    if (SimileAjax.WindowManager._draggedElement != null) {
        try {
            if (SimileAjax.WindowManager._dragging) {
                var callback = SimileAjax.WindowManager._draggedElementCallback;
                if ("onDragEnd" in callback) {
                    callback.onDragEnd();
                }
                if ("droppable" in callback && callback.droppable) {
                    var dropped = false;

                    var target = SimileAjax.WindowManager._potentialDropTarget;
                    if (target != null) {
                        if ((!("canDropOn" in callback) || callback.canDropOn(target)) &&
                            (!("canDrop" in target) || target.canDrop(SimileAjax.WindowManager._draggedElement))) {

                            if ("onDropOn" in callback) {
                                callback.onDropOn(target);
                            }
                            target.ondrop(SimileAjax.WindowManager._draggedElement, SimileAjax.WindowManager._draggingMode);

                            dropped = true;
                        }
                    }

                    if (!dropped) {
                        // TODO: do holywood explosion here
                    }
                }
            }
        } finally {
            SimileAjax.WindowManager._cancelDragging();
        }

        SimileAjax.DOM.cancelEvent(evt);
        return false;
    }
};

SimileAjax.WindowManager._cancelDragging = function() {
    var callback = SimileAjax.WindowManager._draggedElementCallback;
    if ("_ghostElmt" in callback) {
        var ghostElmt = callback._ghostElmt;
        document.body.removeChild(ghostElmt);

        delete callback._ghostElmt;
    }
    if (SimileAjax.WindowManager._dropTargetHighlightElement != null) {
        document.body.removeChild(SimileAjax.WindowManager._dropTargetHighlightElement);
        SimileAjax.WindowManager._dropTargetHighlightElement = null;
    }
    if (SimileAjax.WindowManager._draggingModeIndicatorElmt != null) {
        document.body.removeChild(SimileAjax.WindowManager._draggingModeIndicatorElmt);
        SimileAjax.WindowManager._draggingModeIndicatorElmt = null;
    }

    SimileAjax.WindowManager._draggedElement = null;
    SimileAjax.WindowManager._draggedElementCallback = null;
    SimileAjax.WindowManager._potentialDropTarget = null;
    SimileAjax.WindowManager._dropTargetHighlightElement = null;
    SimileAjax.WindowManager._lastCoords = null;
    SimileAjax.WindowManager._ghostCoords = null;
    SimileAjax.WindowManager._draggingMode = "";
    SimileAjax.WindowManager._dragging = false;
};

SimileAjax.WindowManager._findDropTarget = function(elmt) {
    while (elmt != null) {
        if ("ondrop" in elmt && (typeof elmt.ondrop) == "function") {
            break;
        }
        elmt = elmt.parentNode;
    }
    return elmt;
};

(function() {
    'use strict';

    if ('Timeline' in window) {
        return;
    }

    window.Timeline = {};
    window.Timeline.DateTime = window.SimileAjax.DateTime;

    var defaultServerLocale = 'en';

    if (typeof TimelineUrlPrefix !== 'undefined') {
        Timeline.urlPrefix = TimelineUrlPrefix;
    } else {
        Timeline.urlPrefix = 'src/timeline/';
    }

    var defaultClientLocale = defaultServerLocale;

    Timeline.serverLocale = defaultServerLocale;
    Timeline.clientLocale = defaultClientLocale;
})();

(function() {
    'use strict';

    /*=================================================
     *
     * Coding standards:
     *
     * We aim towards Douglas Crockford's Javascript conventions.
     * See:  http://javascript.crockford.com/code.html
     * See also: http://www.crockford.com/javascript/javascript.html
     *
     * That said, this JS code was written before some recent JS
     * support libraries became widely used or available.
     * In particular, the _ character is used to indicate a class function or
     * variable that should be considered private to the class.
     *
     * The code mostly uses accessor methods for getting/setting the private
     * class variables.
     *
     * Over time, we'd like to formalize the convention by using support libraries
     * which enforce privacy in objects.
     *
     * We also want to use jslint:  http://www.jslint.com/
     *
     *
     *==================================================
     */



    /*==================================================
     *  Timeline VERSION
     *==================================================
     */
    // Note: version is also stored in the build.xml file
    Timeline.version = '2.3.0'; // use format 'pre 1.2.3' for trunk versions
    Timeline.ajax_lib_version = SimileAjax.version; // Waiting for version string method from Ajax library
    Timeline.display_version = Timeline.version + ' (with Ajax lib ' + Timeline.ajax_lib_version + ')';
    // cf method Timeline.writeVersion

    /*==================================================
     *  Timeline
     *==================================================
     */
    Timeline.strings = {}; // localization string tables
    Timeline.HORIZONTAL = 0;
    Timeline.VERTICAL = 1;
    Timeline._defaultTheme = null;

    Timeline.getDefaultLocale = function() {
        return Timeline.clientLocale;
    };

    Timeline.create = function(elmt, bandInfos, orientation, unit) {
        if (Timeline.timelines === null || Timeline.timelines === undefined) {
            Timeline.timelines = [];
            // Timeline.timelines array can have null members--Timelines that
            // once existed on the page, but were later disposed of.
        }

        var timelineID = Timeline.timelines.length;
        Timeline.timelines[timelineID] = null; // placeholder until we have the object
        var new_tl = new Timeline._Impl(elmt, bandInfos, orientation, unit,
            timelineID);
        Timeline.timelines[timelineID] = new_tl;
        return new_tl;
    };

    Timeline.createBandInfo = function(params) {
        var theme = ('theme' in params) ? params.theme : Timeline.getDefaultTheme();

        var eventSource = ('eventSource' in params) ? params.eventSource : null;

        var ether = new Timeline.LinearEther({
            centersOn: ('date' in params) ? params.date : new Date(),
            interval: SimileAjax.DateTime.gregorianUnitLengths[params.intervalUnit],
            pixelsPerInterval: params.intervalPixels,
            theme: theme
        });

        var etherPainter = new Timeline.GregorianEtherPainter({
            unit: params.intervalUnit,
            multiple: ('multiple' in params) ? params.multiple : 1,
            theme: theme,
            align: ('align' in params) ? params.align : undefined
        });

        var eventPainterParams = {
            showText: ('showEventText' in params) ? params.showEventText : true,
            theme: theme
        };

        // pass in custom parameters for the event painter
        if ('eventPainterParams' in params) {
            for (var prop in params.eventPainterParams) {
                if (params.eventPainterParams.hasOwnProperty(prop)) {
                    eventPainterParams[prop] = params.eventPainterParams[prop];
                }
            }
        }

        if ('trackHeight' in params) {
            eventPainterParams.trackHeight = params.trackHeight;
        }
        if ('trackGap' in params) {
            eventPainterParams.trackGap = params.trackGap;
        }

        var layout = ('overview' in params && params.overview) ? 'overview' : ('layout' in params ? params.layout : 'original');
        var eventPainter;
        if ('eventPainter' in params) {
            eventPainter = new params.eventPainter(eventPainterParams);
        } else {
            switch (layout) {
                case 'overview':
                    eventPainter = new Timeline.OverviewEventPainter(eventPainterParams);
                    break;
                case 'detailed':
                    eventPainter = new Timeline.DetailedEventPainter(eventPainterParams);
                    break;
                default:
                    eventPainter = new Timeline.OriginalEventPainter(eventPainterParams);
            }
        }

        return {
            width: params.width,
            eventSource: eventSource,
            timeZone: ('timeZone' in params) ? params.timeZone : 0,
            ether: ether,
            etherPainter: etherPainter,
            eventPainter: eventPainter,
            theme: theme,
            zoomIndex: ('zoomIndex' in params) ? params.zoomIndex : 0,
            zoomSteps: ('zoomSteps' in params) ? params.zoomSteps : null
        };
    };

    Timeline.createHotZoneBandInfo = function(params) {
        var theme = ('theme' in params) ? params.theme : Timeline.getDefaultTheme();

        var eventSource = ('eventSource' in params) ? params.eventSource : null;

        var ether = new Timeline.HotZoneEther({
            centersOn: ('date' in params) ? params.date : new Date(),
            interval: SimileAjax.DateTime.gregorianUnitLengths[params.intervalUnit],
            pixelsPerInterval: params.intervalPixels,
            zones: params.zones,
            theme: theme
        });

        var etherPainter = new Timeline.HotZoneGregorianEtherPainter({
            unit: params.intervalUnit,
            zones: params.zones,
            theme: theme,
            align: ('align' in params) ? params.align : undefined
        });

        var eventPainterParams = {
            showText: ('showEventText' in params) ? params.showEventText : true,
            theme: theme
        };

        // pass in custom parameters for the event painter
        if ('eventPainterParams' in params) {
            for (var prop in params.eventPainterParams) {
                if (params.eventPainterParams.hasOwnProperty(prop)) {
                    eventPainterParams[prop] = params.eventPainterParams[prop];
                }
            }
        }

        if ('trackHeight' in params) {
            eventPainterParams.trackHeight = params.trackHeight;
        }

        if ('trackGap' in params) {
            eventPainterParams.trackGap = params.trackGap;
        }

        var layout = ('overview' in params && params.overview) ? 'overview' : ('layout' in params ? params.layout : 'original');
        var eventPainter;
        if ('eventPainter' in params) {
            eventPainter = new params.eventPainter(eventPainterParams);
        } else {
            switch (layout) {
                case 'overview':
                    eventPainter = new Timeline.OverviewEventPainter(eventPainterParams);
                    break;
                case 'detailed':
                    eventPainter = new Timeline.DetailedEventPainter(eventPainterParams);
                    break;
                default:
                    eventPainter = new Timeline.OriginalEventPainter(eventPainterParams);
            }
        }
        return {
            width: params.width,
            eventSource: eventSource,
            timeZone: ('timeZone' in params) ? params.timeZone : 0,
            ether: ether,
            etherPainter: etherPainter,
            eventPainter: eventPainter,
            theme: theme,
            zoomIndex: ('zoomIndex' in params) ? params.zoomIndex : 0,
            zoomSteps: ('zoomSteps' in params) ? params.zoomSteps : null
        };
    };

    Timeline.getDefaultTheme = function() {
        if (Timeline._defaultTheme === null ||
            Timeline._defaultTheme === undefined) {

            Timeline._defaultTheme = Timeline.ClassicTheme.create(Timeline.getDefaultLocale());
        }
        return Timeline._defaultTheme;
    };

    Timeline.setDefaultTheme = function(theme) {
        Timeline._defaultTheme = theme;
    };

    Timeline.loadXML = function(url, f) {
        var fError = function(statusText) {
            console.log('Failed to load data xml from ' + url + '\n' + statusText);
        };
        var fDone = function(xmlhttp) {
            var xml = xmlhttp.responseXML;
            if (!xml.documentElement && xmlhttp.responseStream) {
                xml.load(xmlhttp.responseStream);
            }
            f(xml, url);
        };
        SimileAjax.XmlHttp.get(url, fError, fDone);
    };


    Timeline.loadJSON = function(url, f) {
        var fError = function(statusText) {
            console.log('Failed to load json data from ' + url + '\n' + statusText);
        };
        var fDone = function(xmlhttp) {
            var json = JSON.parse(xmlhttp.responseText);
            f(json, url);
        };
        SimileAjax.XmlHttp.get(url, fError, fDone);
    };

    Timeline.getTimelineFromID = function(timelineID) {
        return Timeline.timelines[timelineID];
    };

    // Write the current Timeline version as the contents of element with id el_id
    Timeline.writeVersion = function(el_id) {
        document.getElementById(el_id).innerHTML = this.display_version;
    };



    /*==================================================
     *  Timeline Implementation object
     *==================================================
     */
    Timeline._Impl = function(elmt, bandInfos, orientation, unit, timelineID) {
        SimileAjax.WindowManager.initialize();

        this._containerDiv = elmt;

        this._bandInfos = bandInfos;
        this._orientation = (orientation === null || orientation === undefined) ? Timeline.HORIZONTAL : orientation;
        this._unit = (unit !== null && unit !== undefined) ? unit : SimileAjax.NativeDateUnit;
        this._starting = true; // is the Timeline being created? Used by autoWidth
        // functions
        this._autoResizing = false;

        // autoWidth is a 'public' property of the Timeline object
        this.autoWidth = bandInfos && bandInfos[0] && bandInfos[0].theme &&
            bandInfos[0].theme.autoWidth;
        this.autoWidthAnimationTime = bandInfos && bandInfos[0] && bandInfos[0].theme &&
            bandInfos[0].theme.autoWidthAnimationTime;
        this.timelineID = timelineID; // also public attribute
        this.timeline_start = bandInfos && bandInfos[0] && bandInfos[0].theme &&
            bandInfos[0].theme.timeline_start;
        this.timeline_stop = bandInfos && bandInfos[0] && bandInfos[0].theme &&
            bandInfos[0].theme.timeline_stop;
        this.timeline_at_start = false; // already at start or stop? Then won't
        this.timeline_at_stop = false; // try to move further in the wrong direction

        this._initialize();
    };

    //
    // Public functions used by client sw
    //
    Timeline._Impl.prototype.dispose = function() {
        for (var i = 0; i < this._bands.length; i++) {
            this._bands[i].dispose();
        }
        this._bands = null;
        this._bandInfos = null;
        this._containerDiv.innerHTML = '';
        // remove from array of Timelines
        Timeline.timelines[this.timelineID] = null;
    };

    Timeline._Impl.prototype.getBandCount = function() {
        return this._bands.length;
    };

    Timeline._Impl.prototype.getBand = function(index) {
        return this._bands[index];
    };

    Timeline._Impl.prototype.finishedEventLoading = function() {
        // Called by client after events have been loaded into Timeline
        // Only used if the client has set autoWidth
        // Sets width to Timeline's requested amount and will shrink down the div if
        // need be.
        this._autoWidthCheck(true);
        this._starting = false;
    };

    Timeline._Impl.prototype.layout = function() {
        // called by client when browser is resized
        this._autoWidthCheck(true);
        this._distributeWidths();
    };

    Timeline._Impl.prototype.paint = function() {
        for (var i = 0; i < this._bands.length; i++) {
            this._bands[i].paint();
        }
    };

    Timeline._Impl.prototype.getDocument = function() {
        return this._containerDiv.ownerDocument;
    };

    Timeline._Impl.prototype.addDiv = function(div) {
        this._containerDiv.appendChild(div);
    };

    Timeline._Impl.prototype.removeDiv = function(div) {
        this._containerDiv.removeChild(div);
    };

    Timeline._Impl.prototype.isHorizontal = function() {
        return this._orientation === Timeline.HORIZONTAL;
    };

    Timeline._Impl.prototype.isVertical = function() {
        return this._orientation === Timeline.VERTICAL;
    };

    Timeline._Impl.prototype.getPixelLength = function() {
        return this._orientation === Timeline.HORIZONTAL ?
            this._containerDiv.offsetWidth : this._containerDiv.offsetHeight;
    };

    Timeline._Impl.prototype.getPixelWidth = function() {
        return this._orientation === Timeline.VERTICAL ?
            this._containerDiv.offsetWidth : this._containerDiv.offsetHeight;
    };

    Timeline._Impl.prototype.getUnit = function() {
        return this._unit;
    };

    Timeline._Impl.prototype.getWidthStyle = function() {
        // which element.style attribute should be changed to affect Timeline's 'width'
        return this._orientation === Timeline.HORIZONTAL ? 'height' : 'width';
    };

    Timeline._Impl.prototype.loadXML = function(url, f) {
        var tl = this;

        var fError = function(statusText) {
            console.log('Failed to load data xml from ' + url + '\n' + statusText);
            tl.hideLoadingMessage();
        };
        var fDone = function(xmlhttp) {
            try {
                var xml = xmlhttp.responseXML;
                if (!xml.documentElement && xmlhttp.responseStream) {
                    xml.load(xmlhttp.responseStream);
                }
                f(xml, url);
            } finally {
                tl.hideLoadingMessage();
            }
        };

        this.showLoadingMessage();
        window.setTimeout(function() {
            SimileAjax.XmlHttp.get(url, fError, fDone);
        }, 0);
    };

    Timeline._Impl.prototype.loadJSON = function(url, f) {
        var tl = this;

        var fError = function(statusText) {
            console.log('Failed to load json data from ' + url + '\n' + statusText);
            tl.hideLoadingMessage();
        };
        var fDone = function(xmlhttp) {
            try {
                var json = JSON.parse(xmlhttp.responseText);
                f(json, url);
            } finally {
                tl.hideLoadingMessage();
            }
        };

        this.showLoadingMessage();
        window.setTimeout(function() {
            SimileAjax.XmlHttp.get(url, fError, fDone);
        }, 0);
    };


    //
    // Private functions used by Timeline object functions
    //

    Timeline._Impl.prototype._autoWidthScrollListener = function(band) {
        band.getTimeline()._autoWidthCheck(false);
    };

    // called to re-calculate auto width and adjust the overall Timeline div if needed
    Timeline._Impl.prototype._autoWidthCheck = function(okToShrink) {
        var timeline = this; // this Timeline
        var immediateChange = timeline._starting;
        var newWidth = 0;

        function changeTimelineWidth() {
            var widthStyle = timeline.getWidthStyle();
            if (immediateChange) {
                timeline._containerDiv.style[widthStyle] = newWidth + 'px';
            } else {
                // animate change
                timeline._autoResizing = true;
                var animateParam = {};
                animateParam[widthStyle] = newWidth + 'px';

                SimileAjax.jQuery(timeline._containerDiv).animate(
                    animateParam, timeline.autoWidthAnimationTime,
                    'linear', function() {
                        timeline._autoResizing = false;
                    });
            }
        }

        function checkTimelineWidth() {
            var targetWidth = 0; // the new desired width
            var currentWidth = timeline.getPixelWidth();

            if (timeline._autoResizing) {
                return; // early return
            }

            // compute targetWidth
            for (var i = 0; i < timeline._bands.length; i++) {
                timeline._bands[i].checkAutoWidth();
                targetWidth += timeline._bandInfos[i].width;
            }

            if (targetWidth > currentWidth || okToShrink) {
                // yes, let's change the size
                newWidth = targetWidth;
                changeTimelineWidth();
                timeline._distributeWidths();
            }
        }

        // function's mainline
        if (!timeline.autoWidth) {
            return; // early return
        }

        checkTimelineWidth();
    };

    Timeline._Impl.prototype._initialize = function() {
        var containerDiv = this._containerDiv;
        var doc = containerDiv.ownerDocument;

        containerDiv.className =
            containerDiv.className.split(' ').concat('timeline-container').join(' ');

        /*
         * Set css-class on container div that will define orientation
         */
        var orientation = (this.isHorizontal()) ? 'horizontal' : 'vertical';
        containerDiv.className += ' timeline-' + orientation;

        while (containerDiv.firstChild) {
            containerDiv.removeChild(containerDiv.firstChild);
        }

        /*
        *  inserting copyright and link to simile
        var elmtCopyright = SimileAjax.Graphics.createTranslucentImage(Timeline.urlPrefix + (this.isHorizontal() ? 'images/copyright-vertical.png' : 'images/copyright.png'));
        elmtCopyright.className = 'timeline-copyright';
        elmtCopyright.title = 'Timeline copyright SIMILE - www.code.google.com/p/simile-widgets/';
        SimileAjax.DOM.registerEvent(elmtCopyright, 'click', function() {
            window.location = 'http://code.google.com/p/simile-widgets/';
        });
        containerDiv.appendChild(elmtCopyright);
        */

        /*
         *  creating bands
         */
        this._bands = [];
        for (var i = 0; i < this._bandInfos.length; i++) {
            var band = new Timeline._Band(this, this._bandInfos[i], i);
            this._bands.push(band);
        }
        this._distributeWidths();

        /*
         *  sync'ing bands
         */
        for (var x = 0; x < this._bandInfos.length; x++) {
            var bandInfo = this._bandInfos[x];
            if ('syncWith' in bandInfo) {
                this._bands[x].setSyncWithBand(
                    this._bands[bandInfo.syncWith], ('highlight' in bandInfo) ? bandInfo.highlight : false
                );
            }
        }

        if (this.autoWidth) {
            for (var y = 0; y < this._bands.length; y++) {
                this._bands[y].addOnScrollListener(this._autoWidthScrollListener);
            }
        }

        /*
         *  creating loading UI
         */
        var message = SimileAjax.Graphics.createMessageBubble(doc);
        message.containerDiv.className = 'timeline-message-container';
        containerDiv.appendChild(message.containerDiv);

        message.contentDiv.className = 'timeline-message';
        message.contentDiv.innerHTML = '<img class="timeline-progress-running" /> Loading...';

        this.showLoadingMessage = function() {
            message.containerDiv.style.display = 'block';
        };

        this.hideLoadingMessage = function() {
            message.containerDiv.style.display = 'none';
        };
    };

    Timeline._Impl.prototype._distributeWidths = function() {
        var length = this.getPixelLength();
        var width = this.getPixelWidth();
        var cumulativeWidth = 0;

        for (var i = 0; i < this._bands.length; i++) {
            var band = this._bands[i];
            var bandInfos = this._bandInfos[i];
            var widthString = bandInfos.width;
            var bandWidth;

            if (typeof widthString === 'string') {
                var x = widthString.indexOf('%');
                if (x > 0) {
                    var percent = parseInt(widthString.substr(0, x));
                    bandWidth = Math.round(percent * width / 100);
                } else {
                    bandWidth = parseInt(widthString);
                }
            } else {
                // was given an integer
                bandWidth = widthString;
            }

            band.setBandShiftAndWidth(cumulativeWidth, bandWidth);
            band.setViewLength(length);

            cumulativeWidth += bandWidth;
        }
    };

    Timeline._Impl.prototype.shiftOK = function(index, shift) {
        // Returns true if the proposed shift is ok
        //
        // Positive shift means going back in time
        var going_back = shift > 0,
            going_forward = shift < 0;

        // Is there an edge?
        if ((going_back && (this.timeline_start === null || this.timeline_start === undefined)) ||
            (going_forward && (this.timeline_stop === null || this.timeline_stop === undefined)) ||
            (shift === 0)) {
            return (true); // early return
        }

        // If any of the bands has noted that it is changing the others,
        // then this shift is a secondary shift in reaction to the real shift,
        // which already happened. In such cases, ignore it. (The issue is
        // that a positive original shift can cause a negative secondary shift,
        // as the bands adjust.)
        var secondary_shift = false;
        for (var i = 0; i < this._bands.length && !secondary_shift; i++) {
            secondary_shift = this._bands[i].busy();
        }
        if (secondary_shift) {
            return (true); // early return
        }

        // If we are already at an edge, then don't even think about going any further
        if ((going_back && this.timeline_at_start) ||
            (going_forward && this.timeline_at_stop)) {
            return (false); // early return
        }

        // Need to check all the bands
        var ok = false; // return value
        // If any of the bands will be or are showing an ok date, then let the shift proceed.
        for (var x = 0; x < this._bands.length && !ok; x++) {
            var band = this._bands[x];
            if (going_back) {
                ok = (x === index ? band.getMinVisibleDateAfterDelta(shift) : band.getMinVisibleDate()) >= this.timeline_start;
            } else {
                ok = (x === index ? band.getMaxVisibleDateAfterDelta(shift) : band.getMaxVisibleDate()) <= this.timeline_stop;
            }
        }

        // process results
        if (going_back) {
            this.timeline_at_start = !ok;
            this.timeline_at_stop = false;
        } else {
            this.timeline_at_stop = !ok;
            this.timeline_at_start = false;
        }
        // This is where you could have an effect once per hitting an
        // edge of the Timeline. Eg jitter the Timeline
        //if (!ok) {
        //alert(going_back ? 'At beginning' : 'At end');
        //}
        return (ok);
    };

    Timeline._Impl.prototype.zoom = function(zoomIn, x, y, target) {
        var matcher = new RegExp('^timeline-band-([0-9]+)$');
        var bandIndex = null;

        var result = matcher.exec(target.id);
        if (result) {
            bandIndex = parseInt(result[1]);
        }

        if (bandIndex !== null) {
            this._bands[bandIndex].zoom(zoomIn, x, y, target);
        }

        this.paint();
    };
}());

(function() {
    'use strict';
    /*=================================================
     *
     * Coding standards:
     *
     * We aim towards Douglas Crockford's Javascript conventions.
     * See:  http://javascript.crockford.com/code.html
     * See also: http://www.crockford.com/javascript/javascript.html
     *
     * That said, this JS code was written before some recent JS
     * support libraries became widely used or available.
     * In particular, the _ character is used to indicate a class function or
     * variable that should be considered private to the class.
     *
     * The code mostly uses accessor methods for getting/setting the private
     * class variables.
     *
     * Over time, we'd like to formalize the convention by using support libraries
     * which enforce privacy in objects.
     *
     * We also want to use jslint:  http://www.jslint.com/
     * Update (Lab21k): Using jshint.
     *
     *==================================================
     */

    /*==================================================
     *  Band
     *==================================================
     */
    Timeline._Band = function(timeline, bandInfo, index) {
        // Set up the band's object
        // Munge params: If autoWidth is on for the Timeline, then ensure that
        // bandInfo.width is an integer
        if (timeline.autoWidth && typeof bandInfo.width === "string") {
            bandInfo.width = bandInfo.width.indexOf("%") > -1 ? 0 : parseInt(bandInfo.width);
        }

        this._timeline = timeline;
        this._bandInfo = bandInfo;
        this._index = index;
        this._locale = ("locale" in bandInfo) ? bandInfo.locale : Timeline.getDefaultLocale();
        this._timeZone = ("timeZone" in bandInfo) ? bandInfo.timeZone : 0;
        this._labeller = ("labeller" in bandInfo) ? bandInfo.labeller :
            (("createLabeller" in timeline.getUnit()) ?
                timeline.getUnit().createLabeller(this._locale, this._timeZone) :
                new Timeline.GregorianDateLabeller(this._locale, this._timeZone));
        this._theme = bandInfo.theme;
        this._zoomIndex = ("zoomIndex" in bandInfo) ? bandInfo.zoomIndex : 0;
        this._zoomSteps = ("zoomSteps" in bandInfo) ? bandInfo.zoomSteps : null;
        this._dragging = false;
        this._changing = false;
        this._originalScrollSpeed = 5; // pixels
        this._scrollSpeed = this._originalScrollSpeed;
        this._onScrollListeners = [];
        var b = this;
        this._syncWithBand = null;
        this._syncWithBandHandler = function() {
            b._onHighlightBandScroll();
        };

        this._selectorListener = function() {
            b._onHighlightBandScroll();
        };

        /*
         *  Install a textbox to capture keyboard events
         */
        var inputDiv = this._timeline.getDocument().createElement("div");
        inputDiv.className = "timeline-band-input";
        this._timeline.addDiv(inputDiv);

        this._keyboardInput = document.createElement("input");
        this._keyboardInput.type = "text";
        inputDiv.appendChild(this._keyboardInput);
        SimileAjax.DOM.registerEventWithObject(this._keyboardInput, "keydown", this, "_onKeyDown");
        SimileAjax.DOM.registerEventWithObject(this._keyboardInput, "keyup", this, "_onKeyUp");

        /*
         *  The band's outer most div that slides with respect to the timeline's div
         */
        this._div = this._timeline.getDocument().createElement("div");
        this._div.id = "timeline-band-" + index;
        this._div.className = "timeline-band timeline-band-" + index;
        this._timeline.addDiv(this._div);

        SimileAjax.DOM.registerEventWithObject(this._div, "mousedown", this, "_onMouseDown");
        SimileAjax.DOM.registerEventWithObject(this._div, "mousemove", this, "_onMouseMove");
        SimileAjax.DOM.registerEventWithObject(this._div, "mouseup", this, "_onMouseUp");
        SimileAjax.DOM.registerEventWithObject(this._div, "mouseout", this, "_onMouseOut");
        SimileAjax.DOM.registerEventWithObject(this._div, "dblclick", this, "_onDblClick");

        var mouseWheel = this._theme !== null ? this._theme.mouseWheel : 'scroll'; // theme is not always defined
        if (mouseWheel === 'zoom' || mouseWheel === 'scroll' || this._zoomSteps) {
            // capture mouse scroll
            if (SimileAjax.Platform.browser.isFirefox) {
                SimileAjax.DOM.registerEventWithObject(this._div, "DOMMouseScroll", this, "_onMouseScroll");
            } else {
                SimileAjax.DOM.registerEventWithObject(this._div, "mousewheel", this, "_onMouseScroll");
            }
        }

        /*
         *  The inner div that contains layers
         */
        this._innerDiv = this._timeline.getDocument().createElement("div");
        this._innerDiv.className = "timeline-band-inner";
        this._div.appendChild(this._innerDiv);

        /*
         *  Initialize parts of the band
         */
        this._ether = bandInfo.ether;
        bandInfo.ether.initialize(this, timeline);

        this._etherPainter = bandInfo.etherPainter;
        bandInfo.etherPainter.initialize(this, timeline);

        this._eventSource = bandInfo.eventSource;
        if (this._eventSource) {
            this._eventListener = {
                onAddMany: function() {
                    b._onAddMany();
                },
                onClear: function() {
                    b._onClear();
                }
            };
            this._eventSource.addListener(this._eventListener);
        }

        this._eventPainter = bandInfo.eventPainter;
        this._eventTracksNeeded = 0; // set by painter via updateEventTrackInfo
        this._eventTrackIncrement = 0;
        bandInfo.eventPainter.initialize(this, timeline);

        this._decorators = ("decorators" in bandInfo) ? bandInfo.decorators : [];
        for (var i = 0; i < this._decorators.length; i++) {
            this._decorators[i].initialize(this, timeline);
        }
    };

    Timeline._Band.SCROLL_MULTIPLES = 5;

    Timeline._Band.prototype.dispose = function() {
        this.closeBubble();

        if (this._eventSource) {
            this._eventSource.removeListener(this._eventListener);
            this._eventListener = null;
            this._eventSource = null;
        }

        this._timeline = null;
        this._bandInfo = null;
        this._labeller = null;
        this._ether = null;
        this._etherPainter = null;
        this._eventPainter = null;
        this._decorators = null;
        this._onScrollListeners = null;
        this._syncWithBandHandler = null;
        this._selectorListener = null;
        this._div = null;
        this._innerDiv = null;
        this._keyboardInput = null;
    };

    Timeline._Band.prototype.addOnScrollListener = function(listener) {
        this._onScrollListeners.push(listener);
    };

    Timeline._Band.prototype.removeOnScrollListener = function(listener) {
        for (var i = 0; i < this._onScrollListeners.length; i++) {
            if (this._onScrollListeners[i] === listener) {
                this._onScrollListeners.splice(i, 1);
                break;
            }
        }
    };

    Timeline._Band.prototype.setSyncWithBand = function(band, highlight) {
        if (this._syncWithBand) {
            this._syncWithBand.removeOnScrollListener(this._syncWithBandHandler);
        }

        this._syncWithBand = band;
        this._syncWithBand.addOnScrollListener(this._syncWithBandHandler);
        this._highlight = highlight;
        this._positionHighlight();
    };

    Timeline._Band.prototype.getLocale = function() {
        return this._locale;
    };

    Timeline._Band.prototype.getTimeZone = function() {
        return this._timeZone;
    };

    Timeline._Band.prototype.getLabeller = function() {
        return this._labeller;
    };

    Timeline._Band.prototype.getIndex = function() {
        return this._index;
    };

    Timeline._Band.prototype.getEther = function() {
        return this._ether;
    };

    Timeline._Band.prototype.getEtherPainter = function() {
        return this._etherPainter;
    };

    Timeline._Band.prototype.getEventSource = function() {
        return this._eventSource;
    };

    Timeline._Band.prototype.getEventPainter = function() {
        return this._eventPainter;
    };

    Timeline._Band.prototype.getTimeline = function() {
        return this._timeline;
    };

    // Autowidth support
    Timeline._Band.prototype.updateEventTrackInfo = function(tracks, increment) {
        this._eventTrackIncrement = increment; // doesn't vary for a specific band

        if (tracks > this._eventTracksNeeded) {
            this._eventTracksNeeded = tracks;
        }
    };

    // Autowidth support
    Timeline._Band.prototype.checkAutoWidth = function() {
        // if a new (larger) width is needed by the band
        // then: a) updates the band's bandInfo.width
        //
        // desiredWidth for the band is
        //   (number of tracks + margin) * track increment
        if (!this._timeline.autoWidth) {
            return; // early return
        }

        var overviewBand = this._eventPainter.getType() === 'overview';
        var margin = overviewBand ?
            this._theme.event.overviewTrack.autoWidthMargin :
            this._theme.event.track.autoWidthMargin;
        var desiredWidth = Math.ceil((this._eventTracksNeeded + margin) *
            this._eventTrackIncrement);
        // add offset amount (additional margin)
        desiredWidth += overviewBand ? this._theme.event.overviewTrack.offset :
            this._theme.event.track.offset;
        var bandInfo = this._bandInfo;

        if (desiredWidth !== bandInfo.width) {
            bandInfo.width = desiredWidth;
        }
    };

    Timeline._Band.prototype.layout = function() {
        this.paint();
    };

    Timeline._Band.prototype.paint = function() {
        this._etherPainter.paint();
        this._paintDecorators();
        this._paintEvents();
    };

    Timeline._Band.prototype.softLayout = function() {
        this.softPaint();
    };

    Timeline._Band.prototype.softPaint = function() {
        this._etherPainter.softPaint();
        this._softPaintDecorators();
        this._softPaintEvents();
    };

    Timeline._Band.prototype.setBandShiftAndWidth = function(shift, width) {
        var inputDiv = this._keyboardInput.parentNode;
        var middle = shift + Math.floor(width / 2);
        if (this._timeline.isHorizontal()) {
            this._div.style.top = shift + "px";
            this._div.style.height = width + "px";

            inputDiv.style.top = middle + "px";
            inputDiv.style.left = "-1em";
        } else {
            this._div.style.left = shift + "px";
            this._div.style.width = width + "px";

            inputDiv.style.left = middle + "px";
            inputDiv.style.top = "-1em";
        }
    };

    Timeline._Band.prototype.getViewWidth = function() {
        if (this._timeline.isHorizontal()) {
            return this._div.offsetHeight;
        } else {
            return this._div.offsetWidth;
        }
    };

    Timeline._Band.prototype.setViewLength = function(length) {
        this._viewLength = length;
        this._recenterDiv();
        this._onChanging();
    };

    Timeline._Band.prototype.getViewLength = function() {
        return this._viewLength;
    };

    Timeline._Band.prototype.getTotalViewLength = function() {
        return Timeline._Band.SCROLL_MULTIPLES * this._viewLength;
    };

    Timeline._Band.prototype.getViewOffset = function() {
        return this._viewOffset;
    };

    Timeline._Band.prototype.getMinDate = function() {
        return this._ether.pixelOffsetToDate(this._viewOffset);
    };

    Timeline._Band.prototype.getMaxDate = function() {
        return this._ether.pixelOffsetToDate(this._viewOffset + Timeline._Band.SCROLL_MULTIPLES * this._viewLength);
    };

    Timeline._Band.prototype.getMinVisibleDate = function() {
        return this._ether.pixelOffsetToDate(0);
    };

    Timeline._Band.prototype.getMinVisibleDateAfterDelta = function(delta) {
        return this._ether.pixelOffsetToDate(delta);
    };

    Timeline._Band.prototype.getMaxVisibleDate = function() {
        // Max date currently visible on band
        return this._ether.pixelOffsetToDate(this._viewLength);
    };

    Timeline._Band.prototype.getMaxVisibleDateAfterDelta = function(delta) {
        // Max date visible on band after delta px view change is applied
        return this._ether.pixelOffsetToDate(this._viewLength + delta);
    };

    Timeline._Band.prototype.getCenterVisibleDate = function() {
        return this._ether.pixelOffsetToDate(this._viewLength / 2);
    };

    Timeline._Band.prototype.setMinVisibleDate = function(date) {
        if (!this._changing) {
            this._moveEther(Math.round(-this._ether.dateToPixelOffset(date)));
        }
    };

    Timeline._Band.prototype.setMaxVisibleDate = function(date) {
        if (!this._changing) {
            this._moveEther(Math.round(this._viewLength - this._ether.dateToPixelOffset(date)));
        }
    };

    Timeline._Band.prototype.setCenterVisibleDate = function(date) {
        if (!this._changing) {
            this._moveEther(Math.round(this._viewLength / 2 - this._ether.dateToPixelOffset(date)));
        }
    };

    Timeline._Band.prototype.dateToPixelOffset = function(date) {
        return this._ether.dateToPixelOffset(date) - this._viewOffset;
    };

    Timeline._Band.prototype.pixelOffsetToDate = function(pixels) {
        return this._ether.pixelOffsetToDate(pixels + this._viewOffset);
    };

    Timeline._Band.prototype.createLayerDiv = function(zIndex, className) {
        var div = this._timeline.getDocument().createElement("div");
        div.className = "timeline-band-layer" + (typeof className === "string" ? (" " + className) : "");
        div.style.zIndex = zIndex;
        this._innerDiv.appendChild(div);
        var innerDiv = this._timeline.getDocument().createElement("div");
        innerDiv.className = "timeline-band-layer-inner";

        if (SimileAjax.Platform.browser.isIE) {
            innerDiv.style.cursor = "move";
        } else {
            innerDiv.style.cursor = "-moz-grab";
        }

        div.appendChild(innerDiv);

        return innerDiv;
    };

    Timeline._Band.prototype.removeLayerDiv = function(div) {
        this._innerDiv.removeChild(div.parentNode);
    };

    Timeline._Band.prototype.scrollToCenter = function(date, f) {
        var pixelOffset = this._ether.dateToPixelOffset(date);
        if (pixelOffset < -this._viewLength / 2) {
            this.setCenterVisibleDate(this.pixelOffsetToDate(pixelOffset + this._viewLength));
        } else if (pixelOffset > 3 * this._viewLength / 2) {
            this.setCenterVisibleDate(this.pixelOffsetToDate(pixelOffset - this._viewLength));
        }
        this._autoScroll(Math.round(this._viewLength / 2 - this._ether.dateToPixelOffset(date)), f);
    };

    Timeline._Band.prototype.showBubbleForEvent = function(eventID) {
        var evt = this.getEventSource().getEvent(eventID);
        if (evt) {
            var self = this;
            this.scrollToCenter(evt.getStart(), function() {
                self._eventPainter.showBubble(evt);
            });
        }
    };

    Timeline._Band.prototype.zoom = function(zoomIn, x) {
        if (!this._zoomSteps) {
            // zoom disabled
            return;
        }

        // shift the x value by our offset
        x += this._viewOffset;

        var zoomDate = this._ether.pixelOffsetToDate(x);
        var netIntervalChange = this._ether.zoom(zoomIn);
        this._etherPainter.zoom(netIntervalChange);

        // shift our zoom date to the far left
        this._moveEther(Math.round(-this._ether.dateToPixelOffset(zoomDate)));
        // then shift it back to where the mouse was
        this._moveEther(x);
    };

    Timeline._Band.prototype._onMouseDown = function(innerFrame, evt) {
        this.closeBubble();
        this._dragging = true;
        this._dragX = evt.clientX;
        this._dragY = evt.clientY;
    };

    Timeline._Band.prototype._onMouseMove = function(innerFrame, evt) {
        if (this._dragging) {
            var diffX = evt.clientX - this._dragX;
            var diffY = evt.clientY - this._dragY;
            this._dragX = evt.clientX;
            this._dragY = evt.clientY;
            this._moveEther(this._timeline.isHorizontal() ? diffX : diffY);
            this._positionHighlight();
        }
    };

    Timeline._Band.prototype._onMouseUp = function() {
        this._dragging = false;
        this._keyboardInput.focus();
    };

    Timeline._Band.prototype._onMouseOut = function(innerFrame, evt) {
        var coords = SimileAjax.DOM.getEventRelativeCoordinates(evt, innerFrame);
        coords.x += this._viewOffset;
        if (coords.x < 0 || coords.x > innerFrame.offsetWidth ||
            coords.y < 0 || coords.y > innerFrame.offsetHeight) {
            this._dragging = false;
        }
    };

    Timeline._Band.prototype._onMouseScroll = function(innerFrame, evt) {
        var now = new Date();
        now = now.getTime();

        if (!this._lastScrollTime || ((now - this._lastScrollTime) > 50)) {
            // limit 1 scroll per 200ms due to FF3 sending multiple events back to back
            this._lastScrollTime = now;

            var delta = 0;
            if (evt.wheelDelta) {
                delta = evt.wheelDelta / 120;
            } else if (evt.detail) {
                delta = -evt.detail / 3;
            }

            // either scroll or zoom
            var mouseWheel = this._theme.mouseWheel;

            if (this._zoomSteps || mouseWheel === 'zoom') {
                var loc = SimileAjax.DOM.getEventRelativeCoordinates(evt, innerFrame);
                if (delta !== 0) {
                    var zoomIn;

                    if (delta > 0) {
                        zoomIn = true;
                    } else if (delta < 0) {
                        zoomIn = false;
                    }

                    // call zoom on the timeline so we could zoom multiple bands if desired
                    this._timeline.zoom(zoomIn, loc.x, loc.y, innerFrame);
                }
            } else if (mouseWheel === 'scroll') {
                var move_amt = 50 * (delta < 0 ? -1 : 1);
                this._moveEther(move_amt);
            }
        }

        // prevent bubble
        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
        evt.cancelBubble = true;

        // prevent the default action
        if (evt.preventDefault) {
            evt.preventDefault();
        }
        evt.returnValue = false;
    };

    Timeline._Band.prototype._onDblClick = function(innerFrame, evt) {
        var coords = SimileAjax.DOM.getEventRelativeCoordinates(evt, innerFrame);
        var distance = coords.x - (this._viewLength / 2 - this._viewOffset);

        this._autoScroll(-distance);
    };

    Timeline._Band.prototype._onKeyDown = function(keyboardInput, evt) {
        if (!this._dragging) {
            switch (evt.keyCode) {
                case 27: // ESC
                    break;
                case 37: // left arrow
                case 38: // up arrow
                    this._scrollSpeed = Math.min(50, Math.abs(this._scrollSpeed * 1.05));
                    this._moveEther(this._scrollSpeed);
                    break;
                case 39: // right arrow
                case 40: // down arrow
                    this._scrollSpeed = -Math.min(50, Math.abs(this._scrollSpeed * 1.05));
                    this._moveEther(this._scrollSpeed);
                    break;
                default:
                    return true;
            }

            this.closeBubble();

            SimileAjax.DOM.cancelEvent(evt);
            return false;
        }
        return true;
    };

    Timeline._Band.prototype._onKeyUp = function(keyboardInput, evt) {
        if (!this._dragging) {
            this._scrollSpeed = this._originalScrollSpeed;

            switch (evt.keyCode) {
                case 35: // end
                    this.setCenterVisibleDate(this._eventSource.getLatestDate());
                    break;
                case 36: // home
                    this.setCenterVisibleDate(this._eventSource.getEarliestDate());
                    break;
                case 33: // page up
                    this._autoScroll(this._timeline.getPixelLength());
                    break;
                case 34: // page down
                    this._autoScroll(-this._timeline.getPixelLength());
                    break;
                default:
                    return true;
            }

            this.closeBubble();

            SimileAjax.DOM.cancelEvent(evt);
            return false;
        }
        return true;
    };

    Timeline._Band.prototype._autoScroll = function(distance, f) {
        var b = this;
        var a = SimileAjax.Graphics.createAnimation(
            function(abs, diff) {
                b._moveEther(diff);
            },
            0,
            distance,
            1000,
            f
        );
        a.run();
    };

    Timeline._Band.prototype._moveEther = function(shift) {
        this.closeBubble();

        // A positive shift means back in time
        // Check that we're not moving beyond Timeline's limits
        if (!this._timeline.shiftOK(this._index, shift)) {
            return; // early return
        }

        this._viewOffset += shift;
        this._ether.shiftPixels(-shift);
        if (this._timeline.isHorizontal()) {
            this._div.style.left = this._viewOffset + "px";
        } else {
            this._div.style.top = this._viewOffset + "px";
        }

        if (this._viewOffset > -this._viewLength * 0.5 ||
            this._viewOffset < -this._viewLength * (Timeline._Band.SCROLL_MULTIPLES - 1.5)) {
            this._recenterDiv();
        } else {
            this.softLayout();
        }

        this._onChanging();
    };

    Timeline._Band.prototype._onChanging = function() {
        this._changing = true;
        this._fireOnScroll();
        this._setSyncWithBandDate();
        this._changing = false;
    };

    Timeline._Band.prototype.busy = function() {
        // Is this band busy changing other bands?
        return (this._changing);
    };

    Timeline._Band.prototype._fireOnScroll = function() {
        for (var i = 0; i < this._onScrollListeners.length; i++) {
            this._onScrollListeners[i](this);
        }
    };

    Timeline._Band.prototype._setSyncWithBandDate = function() {
        if (this._syncWithBand) {
            var centerDate = this._ether.pixelOffsetToDate(this.getViewLength() / 2);
            this._syncWithBand.setCenterVisibleDate(centerDate);
        }
    };

    Timeline._Band.prototype._onHighlightBandScroll = function() {
        if (this._syncWithBand) {
            var centerDate = this._syncWithBand.getCenterVisibleDate();
            var centerPixelOffset = this._ether.dateToPixelOffset(centerDate);

            this._moveEther(Math.round(this._viewLength / 2 - centerPixelOffset));

            if (this._highlight) {
                this._etherPainter.setHighlight(
                    this._syncWithBand.getMinVisibleDate(),
                    this._syncWithBand.getMaxVisibleDate());
            }
        }
    };

    Timeline._Band.prototype._onAddMany = function() {
        this._paintEvents();
    };

    Timeline._Band.prototype._onClear = function() {
        this._paintEvents();
    };

    Timeline._Band.prototype._positionHighlight = function() {
        if (this._syncWithBand) {
            var startDate = this._syncWithBand.getMinVisibleDate();
            var endDate = this._syncWithBand.getMaxVisibleDate();

            if (this._highlight) {
                this._etherPainter.setHighlight(startDate, endDate);
            }
        }
    };

    Timeline._Band.prototype._recenterDiv = function() {
        this._viewOffset = -this._viewLength * (Timeline._Band.SCROLL_MULTIPLES - 1) / 2;
        if (this._timeline.isHorizontal()) {
            this._div.style.left = this._viewOffset + "px";
            this._div.style.width = (Timeline._Band.SCROLL_MULTIPLES * this._viewLength) + "px";
        } else {
            this._div.style.top = this._viewOffset + "px";
            this._div.style.height = (Timeline._Band.SCROLL_MULTIPLES * this._viewLength) + "px";
        }
        this.layout();
    };

    Timeline._Band.prototype._paintEvents = function() {
        this._eventPainter.paint();
    };

    Timeline._Band.prototype._softPaintEvents = function() {
        this._eventPainter.softPaint();
    };

    Timeline._Band.prototype._paintDecorators = function() {
        for (var i = 0; i < this._decorators.length; i++) {
            this._decorators[i].paint();
        }
    };

    Timeline._Band.prototype._softPaintDecorators = function() {
        for (var i = 0; i < this._decorators.length; i++) {
            this._decorators[i].softPaint();
        }
    };

    Timeline._Band.prototype.closeBubble = function() {
        SimileAjax.WindowManager.cancelPopups();
    };

    Timeline._Band.prototype.addDecorator = function(decorator) {
        this._decorators.push(decorator);
        decorator.initialize(this,this._timeline);
        decorator.paint();
    };
}());

(function() {
    'use strict';

    /*==================================================
     *  Classic Theme
     *==================================================
     */
    Timeline.ClassicTheme = {};
    Timeline.ClassicTheme.implementations = [];

    Timeline.ClassicTheme.create = function(locale) {

        if (locale === undefined) {
            locale = Timeline.getDefaultLocale();
        }

        var f = Timeline.ClassicTheme.implementations[locale];
        if (f === null || f === undefined) {
            f = Timeline.ClassicTheme._Impl;
        }
        return new f();
    };

    Timeline.ClassicTheme._Impl = function() {
        this.firstDayOfWeek = 0; // Sunday

        // Note: Many styles previously set here are now set using CSS
        //       The comments indicate settings controlled by CSS, not
        //       lines to be un-commented.
        //
        //
        // Attributes autoWidth, autoWidthAnimationTime, timeline_start
        // and timeline_stop must be set on the first band's theme.
        // The other attributes can be set differently for each
        // band by using different themes for the bands.
        this.autoWidth = false; // Should the Timeline automatically grow itself, as
        // needed when too many events for the available width
        // are painted on the visible part of the Timeline?
        this.autoWidthAnimationTime = 500; // mSec
        this.timeline_start = null; // Setting a date, eg new Date(Date.UTC(2008,0,17,20,00,00,0)) will prevent the
        // Timeline from being moved to anytime before the date.
        this.timeline_stop = null; // Use for setting a maximum date. The Timeline will not be able 
        // to be moved to anytime after this date.
        this.ether = {
            backgroundColors: [
                //    '#EEE',
                //    '#DDD',
                //    '#CCC',
                //    '#AAA'
            ],
            highlightOpacity: 50,
            interval: {
                line: {
                    show: true,
                    opacity: 25
                },
                weekend: {
                    opacity: 30
                },
                marker: {
                    hAlign: 'Bottom',
                    vAlign: 'Right'
                }
            }
        };

        this.event = {
            track: {
                height: 10, // px. You will need to change the track
                //     height if you change the tape height.
                gap: 2, // px. Gap between tracks
                offset: 2, // px. top margin above tapes
                autoWidthMargin: 1.5
                    /* autoWidthMargin is only used if autoWidth (see above) is true.
                    The autoWidthMargin setting is used to set how close the bottom of the
                    lowest track is to the edge of the band's div. The units are total track
                    width (tape + label + gap). A min of 0.5 is suggested. Use this setting to
                    move the bottom track's tapes above the axis markers, if needed for your
                    Timeline.
                    */
            },
            overviewTrack: {
                offset: 20, // px -- top margin above tapes 
                tickHeight: 6, // px
                height: 2, // px
                gap: 1, // px
                autoWidthMargin: 5 // This attribute is only used if autoWidth (see above) is true.
            },
            tape: {
                height: 4 // px. For thicker tapes, remember to change track height too.
            },
            instant: {
                icon: Timeline.urlPrefix + 'images/dull-blue-circle.png',
                // default icon. Icon can also be specified per event
                iconWidth: 10,
                iconHeight: 10,
                impreciseOpacity: 20, // opacity of the tape when durationEvent is false
                impreciseIconMargin: 3 // A tape and an icon are painted for imprecise instant
                    // events. This attribute is the margin between the
                    // bottom of the tape and the top of the icon in that
                    // case.
            },
            duration: {
                impreciseOpacity: 20 // tape opacity for imprecise part of duration events
            },
            label: {
                backgroundOpacity: 50, // only used in detailed painter
                offsetFromLine: 3 // px left margin amount from icon's right edge
            },
            highlightColors: [ // Use with getEventPainter().setHighlightMatcher
                // See webapp/examples/examples.js
                '#FFFF00',
                '#FFC000',
                '#FF0000',
                '#0000FF'
            ],
            highlightLabelBackground: false, // When highlighting an event, also change the event's label background?
            bubble: {
                width: 250, // px
                maxHeight: 0, // px Maximum height of bubbles. 0 means no max height. 
                // scrollbar will be added for taller bubbles
                titleStyler: function(elmt) {
                    elmt.className = 'timeline-event-bubble-title';
                },
                bodyStyler: function(elmt) {
                    elmt.className = 'timeline-event-bubble-body';
                },
                imageStyler: function(elmt) {
                    elmt.className = 'timeline-event-bubble-image';
                },
                wikiStyler: function(elmt) {
                    elmt.className = 'timeline-event-bubble-wiki';
                },
                timeStyler: function(elmt) {
                    elmt.className = 'timeline-event-bubble-time';
                }
            }
        };

        this.mouseWheel = 'scroll'; // 'default', 'zoom', 'scroll'
    };
}());

(function() {
    /* jshint shadow:true */
    'use strict';

    /*
     * ==================================================
     *  An "ether" is a object that maps date/time to pixel coordinates.
     * ==================================================
     */

    /*
     * ==================================================
     *  Linear Ether
     * ==================================================
     */

    Timeline.LinearEther = function(params) {
        this._params = params;
        this._interval = params.interval;
        this._pixelsPerInterval = params.pixelsPerInterval;
    };

    Timeline.LinearEther.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;
        this._unit = timeline.getUnit();

        if ("startsOn" in this._params) {
            this._start = this._unit.parseFromObject(this._params.startsOn);
        } else if ("endsOn" in this._params) {
            this._start = this._unit.parseFromObject(this._params.endsOn);
            this.shiftPixels(-this._timeline.getPixelLength());
        } else if ("centersOn" in this._params) {
            this._start = this._unit.parseFromObject(this._params.centersOn);
            this.shiftPixels(-this._timeline.getPixelLength() / 2);
        } else {
            this._start = this._unit.makeDefaultValue();
            this.shiftPixels(-this._timeline.getPixelLength() / 2);
        }
    };

    Timeline.LinearEther.prototype.setDate = function(date) {
        this._start = this._unit.cloneValue(date);
    };

    Timeline.LinearEther.prototype.shiftPixels = function(pixels) {
        var numeric = this._interval * pixels / this._pixelsPerInterval;
        this._start = this._unit.change(this._start, numeric);
    };

    Timeline.LinearEther.prototype.dateToPixelOffset = function(date) {
        var numeric = this._unit.compare(date, this._start);
        return this._pixelsPerInterval * numeric / this._interval;
    };

    Timeline.LinearEther.prototype.pixelOffsetToDate = function(pixels) {
        var numeric = pixels * this._interval / this._pixelsPerInterval;
        return this._unit.change(this._start, numeric);
    };

    Timeline.LinearEther.prototype.zoom = function(zoomIn) {
        var netIntervalChange = 0;
        var currentZoomIndex = this._band._zoomIndex;
        var newZoomIndex = currentZoomIndex;

        if (zoomIn && (currentZoomIndex > 0)) {
            newZoomIndex = currentZoomIndex - 1;
        }

        if (!zoomIn && (currentZoomIndex < (this._band._zoomSteps.length - 1))) {
            newZoomIndex = currentZoomIndex + 1;
        }

        this._band._zoomIndex = newZoomIndex;
        this._interval =
            SimileAjax.DateTime.gregorianUnitLengths[this._band._zoomSteps[newZoomIndex].unit];
        this._pixelsPerInterval = this._band._zoomSteps[newZoomIndex].pixelsPerInterval;
        netIntervalChange = this._band._zoomSteps[newZoomIndex].unit -
            this._band._zoomSteps[currentZoomIndex].unit;

        return netIntervalChange;
    };


    /*==================================================
     *  Hot Zone Ether
     *==================================================
     */

    Timeline.HotZoneEther = function(params) {
        this._params = params;
        this._interval = params.interval;
        this._pixelsPerInterval = params.pixelsPerInterval;
        this._theme = params.theme;
    };

    Timeline.HotZoneEther.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;
        this._unit = timeline.getUnit();

        this._zones = [{
            startTime: Number.NEGATIVE_INFINITY,
            endTime: Number.POSITIVE_INFINITY,
            magnify: 1
        }];
        var params = this._params;
        for (var i = 0; i < params.zones.length; i++) {
            var zone = params.zones[i];
            var zoneStart = this._unit.parseFromObject(zone.start);
            var zoneEnd = this._unit.parseFromObject(zone.end);

            for (var j = 0; j < this._zones.length && this._unit.compare(zoneEnd, zoneStart) > 0; j++) {
                var zone2 = this._zones[j];

                if (this._unit.compare(zoneStart, zone2.endTime) < 0) {
                    if (this._unit.compare(zoneStart, zone2.startTime) > 0) {
                        this._zones.splice(j, 0, {
                            startTime: zone2.startTime,
                            endTime: zoneStart,
                            magnify: zone2.magnify
                        });
                        j++;

                        zone2.startTime = zoneStart;
                    }

                    if (this._unit.compare(zoneEnd, zone2.endTime) < 0) {
                        this._zones.splice(j, 0, {
                            startTime: zoneStart,
                            endTime: zoneEnd,
                            magnify: zone.magnify * zone2.magnify
                        });
                        j++;

                        zone2.startTime = zoneEnd;
                        zoneStart = zoneEnd;
                    } else {
                        zone2.magnify *= zone.magnify;
                        zoneStart = zone2.endTime;
                    }
                } // else, try the next existing zone
            }
        }

        if ("startsOn" in this._params) {
            this._start = this._unit.parseFromObject(this._params.startsOn);
        } else if ("endsOn" in this._params) {
            this._start = this._unit.parseFromObject(this._params.endsOn);
            this.shiftPixels(-this._timeline.getPixelLength());
        } else if ("centersOn" in this._params) {
            this._start = this._unit.parseFromObject(this._params.centersOn);
            this.shiftPixels(-this._timeline.getPixelLength() / 2);
        } else {
            this._start = this._unit.makeDefaultValue();
            this.shiftPixels(-this._timeline.getPixelLength() / 2);
        }
    };

    Timeline.HotZoneEther.prototype.setDate = function(date) {
        this._start = this._unit.cloneValue(date);
    };

    Timeline.HotZoneEther.prototype.shiftPixels = function(pixels) {
        this._start = this.pixelOffsetToDate(pixels);
    };

    Timeline.HotZoneEther.prototype.dateToPixelOffset = function(date) {
        return this._dateDiffToPixelOffset(this._start, date);
    };

    Timeline.HotZoneEther.prototype.pixelOffsetToDate = function(pixels) {
        return this._pixelOffsetToDate(pixels, this._start);
    };

    Timeline.HotZoneEther.prototype.zoom = function(zoomIn) {
        var netIntervalChange = 0;
        var currentZoomIndex = this._band._zoomIndex;
        var newZoomIndex = currentZoomIndex;

        if (zoomIn && (currentZoomIndex > 0)) {
            newZoomIndex = currentZoomIndex - 1;
        }

        if (!zoomIn && (currentZoomIndex < (this._band._zoomSteps.length - 1))) {
            newZoomIndex = currentZoomIndex + 1;
        }

        this._band._zoomIndex = newZoomIndex;
        this._interval =
            SimileAjax.DateTime.gregorianUnitLengths[this._band._zoomSteps[newZoomIndex].unit];
        this._pixelsPerInterval = this._band._zoomSteps[newZoomIndex].pixelsPerInterval;
        netIntervalChange = this._band._zoomSteps[newZoomIndex].unit -
            this._band._zoomSteps[currentZoomIndex].unit;

        return netIntervalChange;
    };

    Timeline.HotZoneEther.prototype._dateDiffToPixelOffset = function(fromDate, toDate) {
        var scale = this._getScale(),
            fromTime = fromDate,
            toTime = toDate,
            pixels = 0;

        var pixels = 0;
        if (this._unit.compare(fromTime, toTime) < 0) {
            var z = 0;
            while (z < this._zones.length) {
                if (this._unit.compare(fromTime, this._zones[z].endTime) < 0) {
                    break;
                }
                z++;
            }

            while (this._unit.compare(fromTime, toTime) < 0) {
                var zone = this._zones[z];
                var toTime2 = this._unit.earlier(toTime, zone.endTime);

                pixels += (this._unit.compare(toTime2, fromTime) / (scale / zone.magnify));

                fromTime = toTime2;
                z++;
            }
        } else {
            var z = this._zones.length - 1;
            while (z >= 0) {
                if (this._unit.compare(fromTime, this._zones[z].startTime) > 0) {
                    break;
                }
                z--;
            }

            while (this._unit.compare(fromTime, toTime) > 0) {
                var zone = this._zones[z];
                var toTime2 = this._unit.later(toTime, zone.startTime);

                pixels += (this._unit.compare(toTime2, fromTime) / (scale / zone.magnify));

                fromTime = toTime2;
                z--;
            }
        }
        return pixels;
    };

    Timeline.HotZoneEther.prototype._pixelOffsetToDate = function(pixels, fromDate) {
        var scale = this._getScale();
        var time = fromDate;
        if (pixels > 0) {
            var z = 0;
            while (z < this._zones.length) {
                if (this._unit.compare(time, this._zones[z].endTime) < 0) {
                    break;
                }
                z++;
            }

            while (pixels > 0) {
                var zone = this._zones[z];
                var scale2 = scale / zone.magnify;

                if (zone.endTime === Number.POSITIVE_INFINITY) {
                    time = this._unit.change(time, pixels * scale2);
                    pixels = 0;
                } else {
                    var pixels2 = this._unit.compare(zone.endTime, time) / scale2;
                    if (pixels2 > pixels) {
                        time = this._unit.change(time, pixels * scale2);
                        pixels = 0;
                    } else {
                        time = zone.endTime;
                        pixels -= pixels2;
                    }
                }
                z++;
            }
        } else {
            var z = this._zones.length - 1;
            while (z >= 0) {
                if (this._unit.compare(time, this._zones[z].startTime) > 0) {
                    break;
                }
                z--;
            }

            pixels = -pixels;
            while (pixels > 0) {
                var zone = this._zones[z];
                var scale2 = scale / zone.magnify;

                if (zone.startTime === Number.NEGATIVE_INFINITY) {
                    time = this._unit.change(time, -pixels * scale2);
                    pixels = 0;
                } else {
                    var pixels2 = this._unit.compare(time, zone.startTime) / scale2;
                    if (pixels2 > pixels) {
                        time = this._unit.change(time, -pixels * scale2);
                        pixels = 0;
                    } else {
                        time = zone.startTime;
                        pixels -= pixels2;
                    }
                }
                z--;
            }
        }
        return time;
    };

    Timeline.HotZoneEther.prototype._getScale = function() {
        return this._interval / this._pixelsPerInterval;
    };
}());

(function() {
    'use strict';

    /*==================================================
     *  Gregorian Ether Painter
     *==================================================
     */

    Timeline.GregorianEtherPainter = function(params) {
        this._params = params;
        this._theme = params.theme;
        this._unit = params.unit;
        this._multiple = ("multiple" in params) ? params.multiple : 1;
    };

    Timeline.GregorianEtherPainter.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;

        this._backgroundLayer = band.createLayerDiv(0);
        this._backgroundLayer.setAttribute("name", "ether-background"); // for debugging
        this._backgroundLayer.className = 'timeline-ether-bg';
        //  this._backgroundLayer.style.background = this._theme.ether.backgroundColors[band.getIndex()];


        this._markerLayer = null;
        this._lineLayer = null;

        var align = ("align" in this._params && this._params.align !== undefined) ? this._params.align :
            this._theme.ether.interval.marker[timeline.isHorizontal() ? "hAlign" : "vAlign"];
        var showLine = ("showLine" in this._params) ? this._params.showLine :
            this._theme.ether.interval.line.show;

        this._intervalMarkerLayout = new Timeline.EtherIntervalMarkerLayout(
            this._timeline, this._band, this._theme, align, showLine);

        this._highlight = new Timeline.EtherHighlight(
            this._timeline, this._band, this._theme, this._backgroundLayer);
    };

    Timeline.GregorianEtherPainter.prototype.setHighlight = function(startDate, endDate) {
        this._highlight.position(startDate, endDate);
    };

    Timeline.GregorianEtherPainter.prototype.paint = function() {
        if (this._markerLayer) {
            this._band.removeLayerDiv(this._markerLayer);
        }
        this._markerLayer = this._band.createLayerDiv(100);
        this._markerLayer.setAttribute("name", "ether-markers"); // for debugging
        this._markerLayer.style.display = "none";

        if (this._lineLayer) {
            this._band.removeLayerDiv(this._lineLayer);
        }
        this._lineLayer = this._band.createLayerDiv(1);
        this._lineLayer.setAttribute("name", "ether-lines"); // for debugging
        this._lineLayer.style.display = "none";

        var minDate = this._band.getMinDate();
        var maxDate = this._band.getMaxDate();

        var timeZone = this._band.getTimeZone();
        var labeller = this._band.getLabeller();

        SimileAjax.DateTime.roundDownToInterval(minDate, this._unit, timeZone, this._multiple, this._theme.firstDayOfWeek);

        var p = this;
        var incrementDate = function(date) {
            for (var i = 0; i < p._multiple; i++) {
                SimileAjax.DateTime.incrementByInterval(date, p._unit);
            }
        };

        while (minDate.getTime() < maxDate.getTime()) {
            this._intervalMarkerLayout.createIntervalMarker(
                minDate, labeller, this._unit, this._markerLayer, this._lineLayer);

            incrementDate(minDate);
        }
        this._markerLayer.style.display = "block";
        this._lineLayer.style.display = "block";
    };

    Timeline.GregorianEtherPainter.prototype.softPaint = function() {};

    Timeline.GregorianEtherPainter.prototype.zoom = function(netIntervalChange) {
        if (netIntervalChange !== 0) {
            this._unit += netIntervalChange;
        }
    };

    /*==================================================
     *  Hot Zone Gregorian Ether Painter
     *==================================================
     */

    Timeline.HotZoneGregorianEtherPainter = function(params) {
        this._params = params;
        this._theme = params.theme;

        this._zones = [{
            startTime: Number.NEGATIVE_INFINITY,
            endTime: Number.POSITIVE_INFINITY,
            unit: params.unit,
            multiple: 1
        }];
        for (var i = 0; i < params.zones.length; i++) {
            var zone = params.zones[i];
            var zoneStart = SimileAjax.DateTime.parseGregorianDateTime(zone.start).getTime();
            var zoneEnd = SimileAjax.DateTime.parseGregorianDateTime(zone.end).getTime();

            for (var j = 0; j < this._zones.length && zoneEnd > zoneStart; j++) {
                var zone2 = this._zones[j];

                if (zoneStart < zone2.endTime) {
                    if (zoneStart > zone2.startTime) {
                        this._zones.splice(j, 0, {
                            startTime: zone2.startTime,
                            endTime: zoneStart,
                            unit: zone2.unit,
                            multiple: zone2.multiple
                        });
                        j++;

                        zone2.startTime = zoneStart;
                    }

                    if (zoneEnd < zone2.endTime) {
                        this._zones.splice(j, 0, {
                            startTime: zoneStart,
                            endTime: zoneEnd,
                            unit: zone.unit,
                            multiple: (zone.multiple) ? zone.multiple : 1
                        });
                        j++;

                        zone2.startTime = zoneEnd;
                        zoneStart = zoneEnd;
                    } else {
                        zone2.multiple = zone.multiple;
                        zone2.unit = zone.unit;
                        zoneStart = zone2.endTime;
                    }
                } // else, try the next existing zone
            }
        }
    };

    Timeline.HotZoneGregorianEtherPainter.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;

        this._backgroundLayer = band.createLayerDiv(0);
        this._backgroundLayer.setAttribute("name", "ether-background"); // for debugging
        this._backgroundLayer.className = 'timeline-ether-bg';
        //this._backgroundLayer.style.background = this._theme.ether.backgroundColors[band.getIndex()];

        this._markerLayer = null;
        this._lineLayer = null;

        var align = ("align" in this._params && this._params.align !== undefined) ? this._params.align :
            this._theme.ether.interval.marker[timeline.isHorizontal() ? "hAlign" : "vAlign"];
        var showLine = ("showLine" in this._params) ? this._params.showLine :
            this._theme.ether.interval.line.show;

        this._intervalMarkerLayout = new Timeline.EtherIntervalMarkerLayout(
            this._timeline, this._band, this._theme, align, showLine);

        this._highlight = new Timeline.EtherHighlight(
            this._timeline, this._band, this._theme, this._backgroundLayer);
    };

    Timeline.HotZoneGregorianEtherPainter.prototype.setHighlight = function(startDate, endDate) {
        this._highlight.position(startDate, endDate);
    };

    Timeline.HotZoneGregorianEtherPainter.prototype.paint = function() {
        if (this._markerLayer) {
            this._band.removeLayerDiv(this._markerLayer);
        }
        this._markerLayer = this._band.createLayerDiv(100);
        this._markerLayer.setAttribute("name", "ether-markers"); // for debugging
        this._markerLayer.style.display = "none";

        if (this._lineLayer) {
            this._band.removeLayerDiv(this._lineLayer);
        }
        this._lineLayer = this._band.createLayerDiv(1);
        this._lineLayer.setAttribute("name", "ether-lines"); // for debugging
        this._lineLayer.style.display = "none";

        var minDate = this._band.getMinDate();
        var maxDate = this._band.getMaxDate();

        var timeZone = this._band.getTimeZone();
        var labeller = this._band.getLabeller();

        var incrementDate = function(date, zone) {
            for (var i = 0; i < zone.multiple; i++) {
                SimileAjax.DateTime.incrementByInterval(date, zone.unit);
            }
        };

        var zStart = 0;
        while (zStart < this._zones.length) {
            if (minDate.getTime() < this._zones[zStart].endTime) {
                break;
            }
            zStart++;
        }
        var zEnd = this._zones.length - 1;
        while (zEnd >= 0) {
            if (maxDate.getTime() > this._zones[zEnd].startTime) {
                break;
            }
            zEnd--;
        }

        for (var z = zStart; z <= zEnd; z++) {
            var zone = this._zones[z];

            var minDate2 = new Date(Math.max(minDate.getTime(), zone.startTime));
            var maxDate2 = new Date(Math.min(maxDate.getTime(), zone.endTime));

            SimileAjax.DateTime.roundDownToInterval(minDate2, zone.unit, timeZone, zone.multiple, this._theme.firstDayOfWeek);
            SimileAjax.DateTime.roundUpToInterval(maxDate2, zone.unit, timeZone, zone.multiple, this._theme.firstDayOfWeek);

            while (minDate2.getTime() < maxDate2.getTime()) {
                this._intervalMarkerLayout.createIntervalMarker(
                    minDate2, labeller, zone.unit, this._markerLayer, this._lineLayer);

                incrementDate(minDate2, zone);
            }
        }
        this._markerLayer.style.display = "block";
        this._lineLayer.style.display = "block";
    };

    Timeline.HotZoneGregorianEtherPainter.prototype.softPaint = function() {};

    Timeline.HotZoneGregorianEtherPainter.prototype.zoom = function(netIntervalChange) {
        if (netIntervalChange !== 0) {
            for (var i = 0; i < this._zones.length; ++i) {
                if (this._zones[i]) {
                    this._zones[i].unit += netIntervalChange;
                }
            }
        }
    };

    /*==================================================
     *  Year Count Ether Painter
     *==================================================
     */

    Timeline.YearCountEtherPainter = function(params) {
        this._params = params;
        this._theme = params.theme;
        this._startDate = SimileAjax.DateTime.parseGregorianDateTime(params.startDate);
        this._multiple = ("multiple" in params) ? params.multiple : 1;
    };

    Timeline.YearCountEtherPainter.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;

        this._backgroundLayer = band.createLayerDiv(0);
        this._backgroundLayer.setAttribute("name", "ether-background"); // for debugging
        this._backgroundLayer.className = 'timeline-ether-bg';
        // this._backgroundLayer.style.background = this._theme.ether.backgroundColors[band.getIndex()];

        this._markerLayer = null;
        this._lineLayer = null;

        var align = ("align" in this._params) ? this._params.align :
            this._theme.ether.interval.marker[timeline.isHorizontal() ? "hAlign" : "vAlign"];
        var showLine = ("showLine" in this._params) ? this._params.showLine :
            this._theme.ether.interval.line.show;

        this._intervalMarkerLayout = new Timeline.EtherIntervalMarkerLayout(
            this._timeline, this._band, this._theme, align, showLine);

        this._highlight = new Timeline.EtherHighlight(
            this._timeline, this._band, this._theme, this._backgroundLayer);
    };

    Timeline.YearCountEtherPainter.prototype.setHighlight = function(startDate, endDate) {
        this._highlight.position(startDate, endDate);
    };

    Timeline.YearCountEtherPainter.prototype.paint = function() {
        if (this._markerLayer) {
            this._band.removeLayerDiv(this._markerLayer);
        }
        this._markerLayer = this._band.createLayerDiv(100);
        this._markerLayer.setAttribute("name", "ether-markers"); // for debugging
        this._markerLayer.style.display = "none";

        if (this._lineLayer) {
            this._band.removeLayerDiv(this._lineLayer);
        }
        this._lineLayer = this._band.createLayerDiv(1);
        this._lineLayer.setAttribute("name", "ether-lines"); // for debugging
        this._lineLayer.style.display = "none";

        var minDate = new Date(this._startDate.getTime());
        var maxDate = this._band.getMaxDate();
        var yearDiff = this._band.getMinDate().getUTCFullYear() - this._startDate.getUTCFullYear();
        minDate.setUTCFullYear(this._band.getMinDate().getUTCFullYear() - yearDiff % this._multiple);

        var p = this;
        var incrementDate = function(date) {
            for (var i = 0; i < p._multiple; i++) {
                SimileAjax.DateTime.incrementByInterval(date, SimileAjax.DateTime.YEAR);
            }
        };
        var labeller = {
            labelInterval: function(date) {
                var diff = date.getUTCFullYear() - p._startDate.getUTCFullYear();
                return {
                    text: diff,
                    emphasized: diff === 0
                };
            }
        };

        while (minDate.getTime() < maxDate.getTime()) {
            this._intervalMarkerLayout.createIntervalMarker(
                minDate, labeller, SimileAjax.DateTime.YEAR, this._markerLayer, this._lineLayer);

            incrementDate(minDate);
        }
        this._markerLayer.style.display = "block";
        this._lineLayer.style.display = "block";
    };

    Timeline.YearCountEtherPainter.prototype.softPaint = function() {};

    /*==================================================
     *  Quarterly Ether Painter
     *==================================================
     */

    Timeline.QuarterlyEtherPainter = function(params) {
        this._params = params;
        this._theme = params.theme;
        this._startDate = SimileAjax.DateTime.parseGregorianDateTime(params.startDate);
    };

    Timeline.QuarterlyEtherPainter.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;

        this._backgroundLayer = band.createLayerDiv(0);
        this._backgroundLayer.setAttribute("name", "ether-background"); // for debugging
        this._backgroundLayer.className = 'timeline-ether-bg';
        //   this._backgroundLayer.style.background = this._theme.ether.backgroundColors[band.getIndex()];

        this._markerLayer = null;
        this._lineLayer = null;

        var align = ("align" in this._params) ? this._params.align :
            this._theme.ether.interval.marker[timeline.isHorizontal() ? "hAlign" : "vAlign"];
        var showLine = ("showLine" in this._params) ? this._params.showLine :
            this._theme.ether.interval.line.show;

        this._intervalMarkerLayout = new Timeline.EtherIntervalMarkerLayout(
            this._timeline, this._band, this._theme, align, showLine);

        this._highlight = new Timeline.EtherHighlight(
            this._timeline, this._band, this._theme, this._backgroundLayer);
    };

    Timeline.QuarterlyEtherPainter.prototype.setHighlight = function(startDate, endDate) {
        this._highlight.position(startDate, endDate);
    };

    Timeline.QuarterlyEtherPainter.prototype.paint = function() {
        if (this._markerLayer) {
            this._band.removeLayerDiv(this._markerLayer);
        }
        this._markerLayer = this._band.createLayerDiv(100);
        this._markerLayer.setAttribute("name", "ether-markers"); // for debugging
        this._markerLayer.style.display = "none";

        if (this._lineLayer) {
            this._band.removeLayerDiv(this._lineLayer);
        }
        this._lineLayer = this._band.createLayerDiv(1);
        this._lineLayer.setAttribute("name", "ether-lines"); // for debugging
        this._lineLayer.style.display = "none";

        var minDate = new Date(0);
        var maxDate = this._band.getMaxDate();

        minDate.setUTCFullYear(Math.max(this._startDate.getUTCFullYear(), this._band.getMinDate().getUTCFullYear()));
        minDate.setUTCMonth(this._startDate.getUTCMonth());

        var p = this;
        var incrementDate = function(date) {
            date.setUTCMonth(date.getUTCMonth() + 3);
        };
        var labeller = {
            labelInterval: function(date) {
                var quarters = (4 + (date.getUTCMonth() - p._startDate.getUTCMonth()) / 3) % 4;
                if (quarters !== 0) {
                    return {
                        text: "Q" + (quarters + 1),
                        emphasized: false
                    };
                } else {
                    return {
                        text: "Y" + (date.getUTCFullYear() - p._startDate.getUTCFullYear() + 1),
                        emphasized: true
                    };
                }
            }
        };

        while (minDate.getTime() < maxDate.getTime()) {
            this._intervalMarkerLayout.createIntervalMarker(
                minDate, labeller, SimileAjax.DateTime.YEAR, this._markerLayer, this._lineLayer);

            incrementDate(minDate);
        }
        this._markerLayer.style.display = "block";
        this._lineLayer.style.display = "block";
    };

    Timeline.QuarterlyEtherPainter.prototype.softPaint = function() {};

    /*==================================================
     *  Ether Interval Marker Layout
     *==================================================
     */

    Timeline.EtherIntervalMarkerLayout = function(timeline, band, theme, align, showLine) {
        var horizontal = timeline.isHorizontal();
        if (horizontal) {
            if (align === "Top") {
                this.positionDiv = function(div, offset) {
                    div.style.left = offset + "px";
                    div.style.top = "0px";
                };
            } else {
                this.positionDiv = function(div, offset) {
                    div.style.left = offset + "px";
                    div.style.bottom = "0px";
                };
            }
        } else {
            if (align === "Left") {
                this.positionDiv = function(div, offset) {
                    div.style.top = offset + "px";
                    div.style.left = "0px";
                };
            } else {
                this.positionDiv = function(div, offset) {
                    div.style.top = offset + "px";
                    div.style.right = "0px";
                };
            }
        }

        var lineTheme = theme.ether.interval.line;
        var weekendTheme = theme.ether.interval.weekend;

        var day = SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.DAY];

        this.createIntervalMarker = function(date, labeller, unit, markerDiv, lineDiv) {
            var offset = Math.round(band.dateToPixelOffset(date));

            if (showLine && unit !== SimileAjax.DateTime.WEEK) {
                var divLine = timeline.getDocument().createElement("div");
                divLine.className = "timeline-ether-lines";

                if (lineTheme.opacity < 100) {
                    SimileAjax.Graphics.setOpacity(divLine, lineTheme.opacity);
                }

                if (horizontal) {
                    //divLine.className += " timeline-ether-lines-vertical";
                    divLine.style.left = offset + "px";
                } else {
                    //divLine.className += " timeline-ether-lines-horizontal";
                    divLine.style.top = offset + "px";
                }
                lineDiv.appendChild(divLine);
            }
            if (unit === SimileAjax.DateTime.WEEK) {
                var firstDayOfWeek = theme.firstDayOfWeek;

                var saturday = new Date(date.getTime() + (6 - firstDayOfWeek - 7) * day);
                var monday = new Date(saturday.getTime() + 2 * day);

                var saturdayPixel = Math.round(band.dateToPixelOffset(saturday));
                var mondayPixel = Math.round(band.dateToPixelOffset(monday));
                var length = Math.max(1, mondayPixel - saturdayPixel);

                var divWeekend = timeline.getDocument().createElement("div");
                divWeekend.className = 'timeline-ether-weekends';

                if (weekendTheme.opacity < 100) {
                    SimileAjax.Graphics.setOpacity(divWeekend, weekendTheme.opacity);
                }

                if (horizontal) {
                    divWeekend.style.left = saturdayPixel + "px";
                    divWeekend.style.width = length + "px";
                } else {
                    divWeekend.style.top = saturdayPixel + "px";
                    divWeekend.style.height = length + "px";
                }
                lineDiv.appendChild(divWeekend);
            }

            var label = labeller.labelInterval(date, unit);

            var div = timeline.getDocument().createElement("div");
            div.innerHTML = label.text;



            div.className = 'timeline-date-label';
            if (label.emphasized) {
                div.className += ' timeline-date-label-em';
            }

            this.positionDiv(div, offset);
            markerDiv.appendChild(div);

            return div;
        };
    };

    /*==================================================
     *  Ether Highlight Layout
     *==================================================
     */

    Timeline.EtherHighlight = function(timeline, band, theme, backgroundLayer) {
        var horizontal = timeline.isHorizontal();

        this._highlightDiv = null;
        this._createHighlightDiv = function() {
            if (this._highlightDiv === null) {
                this._highlightDiv = timeline.getDocument().createElement("div");
                this._highlightDiv.setAttribute("name", "ether-highlight"); // for debugging
                this._highlightDiv.className = 'timeline-ether-highlight';

                var opacity = theme.ether.highlightOpacity;
                if (opacity < 100) {
                    SimileAjax.Graphics.setOpacity(this._highlightDiv, opacity);
                }

                backgroundLayer.appendChild(this._highlightDiv);
            }
        };

        this.position = function(startDate, endDate) {
            this._createHighlightDiv();

            var startPixel = Math.round(band.dateToPixelOffset(startDate));
            var endPixel = Math.round(band.dateToPixelOffset(endDate));
            var length = Math.max(endPixel - startPixel, 3);
            if (horizontal) {
                this._highlightDiv.style.left = startPixel + "px";
                this._highlightDiv.style.width = length + "px";
                this._highlightDiv.style.height = (band.getViewWidth() - 4) + "px";
            } else {
                this._highlightDiv.style.top = startPixel + "px";
                this._highlightDiv.style.height = length + "px";
                this._highlightDiv.style.width = (band.getViewWidth() - 4) + "px";
            }
        };
    };
}());

(function() {
    'use strict';

    /*==================================================
     *  Event Utils
     *==================================================
     */
    Timeline.EventUtils = {};

    Timeline.EventUtils.getNewEventID = function() {
        // global across page
        if (this._lastEventID === null) {
            this._lastEventID = 0;
        }

        this._lastEventID += 1;
        return "e" + this._lastEventID;
    };

    Timeline.EventUtils.decodeEventElID = function(elementID) {
        /*==================================================
         *
         * Use this function to decode an event element's id on a band (label div,
         * tape div or icon img).
         *
         * Returns {band: <bandObj>, evt: <eventObj>}
         *
         * To enable a single event listener to monitor everything
         * on a Timeline, a set format is used for the id's of the
         * elements on the Timeline--
         *
         * element id format for labels, icons, tapes:
         *   labels: label-tl-<timelineID>-<band_index>-<evt.id>
         *    icons: icon-tl-<timelineID>-<band_index>-<evt.id>
         *    tapes: tape1-tl-<timelineID>-<band_index>-<evt.id>
         *           tape2-tl-<timelineID>-<band_index>-<evt.id>
         *           // some events have more than one tape
         *    highlight: highlight1-tl-<timelineID>-<band_index>-<evt.id>
         *               highlight2-tl-<timelineID>-<band_index>-<evt.id>
         *           // some events have more than one highlight div (future)
         * Note: use split('-') to get array of the format's parts
         *
         * You can then retrieve the timeline object and event object
         * by using Timeline.getTimeline, Timeline.getBand, or
         * Timeline.getEvent and passing in the element's id
         *
         *==================================================
         */

        var parts = elementID.split('-');
        if (parts[1] !== 'tl') {
            //console.log("Internal Timeline problem 101, please consult support");
            return {
                band: null,
                evt: null
            }; // early return
        }

        var timeline = Timeline.getTimelineFromID(parts[2]);
        var band = timeline.getBand(parts[3]);
        var evt = band.getEventSource.getEvent(parts[4]);

        return {
            band: band,
            evt: evt
        };
    };

    Timeline.EventUtils.encodeEventElID = function(timeline, band, elType, evt) {
        // elType should be one of {label | icon | tapeN | highlightN}
        return elType + "-tl-" + timeline.timelineID +
            "-" + band.getIndex() + "-" + evt.getID();
    };
}());

(function() {

    'use strict';

    /*==================================================
     *  Gregorian Date Labeller
     *==================================================
     */

    Timeline.GregorianDateLabeller = function(locale, timeZone) {
        this._locale = locale;
        this._timeZone = timeZone;
    };

    Timeline.GregorianDateLabeller.monthNames = [];
    Timeline.GregorianDateLabeller.dayNames = [];
    Timeline.GregorianDateLabeller.labelIntervalFunctions = [];

    Timeline.GregorianDateLabeller.getMonthName = function(month, locale) {
        return Timeline.GregorianDateLabeller.monthNames[locale][month];
    };

    Timeline.GregorianDateLabeller.prototype.labelInterval = function(date, intervalUnit) {
        var f = Timeline.GregorianDateLabeller.labelIntervalFunctions[this._locale];
        if (f === undefined) {
            f = Timeline.GregorianDateLabeller.prototype.defaultLabelInterval;
        }
        return f.call(this, date, intervalUnit);
    };

    Timeline.GregorianDateLabeller.prototype.labelPrecise = function(date) {
        return SimileAjax.DateTime.removeTimeZoneOffset(
            date,
            this._timeZone //+ (new Date().getTimezoneOffset() / 60)
        ).toUTCString();
    };

    Timeline.GregorianDateLabeller.prototype.defaultLabelInterval = function(date, intervalUnit) {
        var text;
        var emphasized = false;

        date = SimileAjax.DateTime.removeTimeZoneOffset(date, this._timeZone);

        switch (intervalUnit) {
            case SimileAjax.DateTime.MILLISECOND:
                text = date.getUTCMilliseconds();
                break;
            case SimileAjax.DateTime.SECOND:
                text = date.getUTCSeconds();
                break;
            case SimileAjax.DateTime.MINUTE:
                var m = date.getUTCMinutes();
                if (m === 0) {
                    text = date.getUTCHours() + ":00";
                    emphasized = true;
                } else {
                    text = m;
                }
                break;
            case SimileAjax.DateTime.HOUR:
                text = date.getUTCHours() + "hr";
                break;
            case SimileAjax.DateTime.DAY:
                text = Timeline.GregorianDateLabeller.getMonthName(date.getUTCMonth(), this._locale) + " " + date.getUTCDate();
                break;
            case SimileAjax.DateTime.WEEK:
                text = Timeline.GregorianDateLabeller.getMonthName(date.getUTCMonth(), this._locale) + " " + date.getUTCDate();
                break;
            case SimileAjax.DateTime.MONTH:
                var month = date.getUTCMonth();
                if (month !== 0) {
                    text = Timeline.GregorianDateLabeller.getMonthName(month, this._locale);
                    break;
                } // else, fall through
                /* fall through */
            case SimileAjax.DateTime.YEAR:
            case SimileAjax.DateTime.DECADE:
            case SimileAjax.DateTime.CENTURY:
            case SimileAjax.DateTime.MILLENNIUM:
                var y = date.getUTCFullYear();
                if (y > 0) {
                    text = date.getUTCFullYear();
                } else {
                    text = (1 - y) + "BC";
                }
                emphasized =
                    (intervalUnit === SimileAjax.DateTime.MONTH) ||
                    (intervalUnit === SimileAjax.DateTime.DECADE && y % 100 === 0) ||
                    (intervalUnit === SimileAjax.DateTime.CENTURY && y % 1000 === 0);
                break;
            default:
                text = date.toUTCString();
        }
        return {
            text: text,
            emphasized: emphasized
        };
    };

}());

(function() {
    'use strict';
    /*==================================
     *  Default Event Source
     *==================================
     */


    Timeline.DefaultEventSource = function(eventIndex) {
        this._events = (eventIndex instanceof Object) ? eventIndex : new SimileAjax.EventIndex();
        this._listeners = [];
    };

    Timeline.DefaultEventSource.prototype.addListener = function(listener) {
        this._listeners.push(listener);
    };

    Timeline.DefaultEventSource.prototype.removeListener = function(listener) {
        for (var i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i] === listener) {
                this._listeners.splice(i, 1);
                break;
            }
        }
    };

    Timeline.DefaultEventSource.prototype.loadXML = function(xml, url) {
        var base = this._getBaseURL(url);

        var wikiURL = xml.documentElement.getAttribute("wiki-url");
        var wikiSection = xml.documentElement.getAttribute("wiki-section");

        var dateTimeFormat = xml.documentElement.getAttribute("date-time-format");
        var parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);

        var node = xml.documentElement.firstChild;
        var added = false;
        while (node !== null && node !== undefined) {
            if (node.nodeType === 1) {
                var description = "";
                if ((node.firstChild !== null && node.firstChild !== undefined) &&
                    node.firstChild.nodeType === 3) {
                    description = node.firstChild.nodeValue;
                }
                // instant event: default is true. Or use values from isDuration or durationEvent
                var instant =
                    ((node.getAttribute("isDuration") === null ||
                            node.getAttribute("isDuration") === undefined) &&
                        (node.getAttribute("durationEvent") === null &&
                            node.getAttribute("durationEvent") === undefined)) || (
                        node.getAttribute("isDuration") == "false" ||
                        node.getAttribute("durationEvent") == "false");

                var evt = new Timeline.DefaultEventSource.Event({
                    id: node.getAttribute("id"),
                    start: parseDateTimeFunction(node.getAttribute("start")),
                    end: parseDateTimeFunction(node.getAttribute("end")),
                    latestStart: parseDateTimeFunction(node.getAttribute("latestStart")),
                    earliestEnd: parseDateTimeFunction(node.getAttribute("earliestEnd")),
                    instant: instant,
                    text: node.getAttribute("title"),
                    description: description,
                    image: this._resolveRelativeURL(node.getAttribute("image"), base),
                    link: this._resolveRelativeURL(node.getAttribute("link"), base),
                    icon: this._resolveRelativeURL(node.getAttribute("icon"), base),
                    color: node.getAttribute("color"),
                    textColor: node.getAttribute("textColor"),
                    hoverText: node.getAttribute("hoverText"),
                    classname: node.getAttribute("classname"),
                    tapeImage: node.getAttribute("tapeImage"),
                    tapeRepeat: node.getAttribute("tapeRepeat"),
                    caption: node.getAttribute("caption"),
                    eventID: node.getAttribute("eventID"),
                    trackNum: node.getAttribute("trackNum")
                });

                evt._node = node;
                evt.getProperty = function(name) {
                    return this._node.getAttribute(name);
                };
                evt.setWikiInfo(wikiURL, wikiSection);

                this._events.add(evt);

                added = true;
            }
            node = node.nextSibling;
        }

        if (added) {
            this._fire("onAddMany", []);
        }
    };


    Timeline.DefaultEventSource.prototype.addEvents = function(events, url) {

        var base = url ? this._getBaseURL(url) : '',
            added = false,
            dateTimeFormat = null,
            parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);

        var self = this;

        events.forEach(function(event) {

            var instant = event.isDuration || (event.durationEvent != null && !event.durationEvent);
            var evt = new Timeline.DefaultEventSource.Event({
                id: ("id" in event) ? event.id : undefined,
                start: parseDateTimeFunction(event.start),
                end: parseDateTimeFunction(event.end),
                latestStart: parseDateTimeFunction(event.latestStart),
                earliestEnd: parseDateTimeFunction(event.earliestEnd),
                instant: instant,
                text: event.title,
                description: event.description,
                image: self._resolveRelativeURL(event.image, base),
                link: self._resolveRelativeURL(event.link, base),
                icon: self._resolveRelativeURL(event.icon, base),
                color: event.color,
                textColor: event.textColor,
                hoverText: event.hoverText,
                classname: event.classname,
                tapeImage: event.tapeImage,
                tapeRepeat: event.tapeRepeat,
                caption: event.caption,
                eventID: event.eventID,
                trackNum: event.trackNum
            });

            evt._obj = event;
            evt.getProperty = function(name) {
                return self._obj[name];
            };

            self._events.add(evt);
            added = true;
        });

        if (added) {
            this._fire("onAddMany", []);
        }

    };

    Timeline.DefaultEventSource.prototype.loadJSON = function(data, url) {
        var base = this._getBaseURL(url);
        var added = false;

        if (data && data.events) {

            var wikiURL = ("wikiURL" in data) ? data.wikiURL : null;
            var wikiSection = ("wikiSection" in data) ? data.wikiSection : null;

            var dateTimeFormat = ("dateTimeFormat" in data) ? data.dateTimeFormat : null;
            var parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);

            for (var i = 0; i < data.events.length; i++) {
                var event = data.events[i];
                // Fixing issue 33:
                // instant event: default (for JSON only) is false. Or use values from isDuration or durationEvent
                // isDuration was negated (see issue 33, so keep that interpretation
                var instant = event.isDuration || (event.durationEvent != null && !event.durationEvent);

                var evt = new Timeline.DefaultEventSource.Event({
                    id: ("id" in event) ? event.id : undefined,
                    start: parseDateTimeFunction(event.start),
                    end: parseDateTimeFunction(event.end),
                    latestStart: parseDateTimeFunction(event.latestStart),
                    earliestEnd: parseDateTimeFunction(event.earliestEnd),
                    instant: instant,
                    text: event.title,
                    description: event.description,
                    image: this._resolveRelativeURL(event.image, base),
                    link: this._resolveRelativeURL(event.link, base),
                    icon: this._resolveRelativeURL(event.icon, base),
                    color: event.color,
                    textColor: event.textColor,
                    hoverText: event.hoverText,
                    classname: event.classname,
                    tapeImage: event.tapeImage,
                    tapeRepeat: event.tapeRepeat,
                    caption: event.caption,
                    eventID: event.eventID,
                    trackNum: event.trackNum
                });

                evt._obj = event;
                evt.getProperty = function(name) {
                    return this._obj[name];
                };
                evt.setWikiInfo(wikiURL, wikiSection);

                this._events.add(evt);
                added = true;
            }
        }

        if (added) {
            this._fire("onAddMany", []);
        }
    };

    /*
     *  Contributed by Morten Frederiksen, http://www.wasab.dk/morten/
     */
    Timeline.DefaultEventSource.prototype.loadSPARQL = function(xml, url) {
        var base = this._getBaseURL(url);

        var dateTimeFormat = 'iso8601';
        var parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);

        if (xml == null || xml == undefined) {
            return;
        }

        /*
         *  Find <results> tag
         */
        var node = xml.documentElement.firstChild;
        while (node != null && (node.nodeType != 1 || node.nodeName != 'results')) {
            node = node.nextSibling;
        }

        var wikiURL = null;
        var wikiSection = null;
        if (node != null) {
            wikiURL = node.getAttribute("wiki-url");
            wikiSection = node.getAttribute("wiki-section");

            node = node.firstChild;
        }

        var added = false;
        while (node != null) {
            if (node.nodeType == 1) {
                var bindings = {};
                var binding = node.firstChild;
                while (binding != null) {
                    if (binding.nodeType == 1 &&
                        binding.firstChild != null &&
                        binding.firstChild.nodeType == 1 &&
                        binding.firstChild.firstChild != null &&
                        binding.firstChild.firstChild.nodeType == 3) {
                        bindings[binding.getAttribute('name')] = binding.firstChild.firstChild.nodeValue;
                    }
                    binding = binding.nextSibling;
                }

                if (bindings.start == null && bindings.date != null) {
                    bindings.start = bindings.date;
                }

                // instant event: default is true. Or use values from isDuration or durationEvent
                var instant = (bindings.isDuration == null &&
                        bindings.durationEvent == null) ||
                    bindings.isDuration == "false" ||
                    bindings.durationEvent == "false";

                var evt = new Timeline.DefaultEventSource.Event({
                    id: bindings.id,
                    start: parseDateTimeFunction(bindings.start),
                    end: parseDateTimeFunction(bindings.end),
                    latestStart: parseDateTimeFunction(bindings.latestStart),
                    earliestEnd: parseDateTimeFunction(bindings.earliestEnd),
                    instant: instant, // instant
                    text: bindings.title, // text
                    description: bindings.description,
                    image: this._resolveRelativeURL(bindings.image, base),
                    link: this._resolveRelativeURL(bindings.link, base),
                    icon: this._resolveRelativeURL(bindings.icon, base),
                    color: bindings.color,
                    textColor: bindings.textColor,
                    hoverText: bindings.hoverText,
                    caption: bindings.caption,
                    classname: bindings.classname,
                    tapeImage: bindings.tapeImage,
                    tapeRepeat: bindings.tapeRepeat,
                    eventID: bindings.eventID,
                    trackNum: bindings.trackNum
                });
                evt._bindings = bindings;
                evt.getProperty = function(name) {
                    return this._bindings[name];
                };
                evt.setWikiInfo(wikiURL, wikiSection);

                this._events.add(evt);
                added = true;
            }
            node = node.nextSibling;
        }

        if (added) {
            this._fire("onAddMany", []);
        }
    };

    Timeline.DefaultEventSource.prototype.add = function(evt) {
        this._events.add(evt);
        this._fire("onAddOne", [evt]);
    };

    Timeline.DefaultEventSource.prototype.addMany = function(events) {
        for (var i = 0; i < events.length; i++) {
            this._events.add(events[i]);
        }
        this._fire("onAddMany", []);
    };

    Timeline.DefaultEventSource.prototype.clear = function() {
        this._events.removeAll();
        this._fire("onClear", []);
    };

    Timeline.DefaultEventSource.prototype.getEvent = function(id) {
        return this._events.getEvent(id);
    };

    Timeline.DefaultEventSource.prototype.getEventIterator = function(startDate, endDate) {
        return this._events.getIterator(startDate, endDate);
    };

    Timeline.DefaultEventSource.prototype.getEventReverseIterator = function(startDate, endDate) {
        return this._events.getReverseIterator(startDate, endDate);
    };

    Timeline.DefaultEventSource.prototype.getAllEventIterator = function() {
        return this._events.getAllIterator();
    };

    Timeline.DefaultEventSource.prototype.getCount = function() {
        return this._events.getCount();
    };

    Timeline.DefaultEventSource.prototype.getEarliestDate = function() {
        return this._events.getEarliestDate();
    };

    Timeline.DefaultEventSource.prototype.getLatestDate = function() {
        return this._events.getLatestDate();
    };

    Timeline.DefaultEventSource.prototype._fire = function(handlerName, args) {
        for (var i = 0; i < this._listeners.length; i++) {
            var listener = this._listeners[i];
            if (handlerName in listener) {
                try {
                    listener[handlerName].apply(listener, args);
                } catch (e) {
                    SimileAjax.Debug.exception(e);
                }
            }
        }
    };

    Timeline.DefaultEventSource.prototype._getBaseURL = function(url) {
        if (url.indexOf("://") < 0) {
            var url2 = this._getBaseURL(document.location.href);
            if (url.substr(0, 1) == "/") {
                url = url2.substr(0, url2.indexOf("/", url2.indexOf("://") + 3)) + url;
            } else {
                url = url2 + url;
            }
        }

        var i = url.lastIndexOf("/");
        if (i < 0) {
            return "";
        } else {
            return url.substr(0, i + 1);
        }
    };

    Timeline.DefaultEventSource.prototype._resolveRelativeURL = function(url, base) {
        if (url == undefined || url == null || url == "") {
            return url;
        } else if (url.indexOf("://") > 0) {
            return url;
        } else if (url.substr(0, 1) == "/") {
            return base.substr(0, base.indexOf("/", base.indexOf("://") + 3)) + url;
        } else {
            return base + url;
        }
    };


    Timeline.DefaultEventSource.Event = function(args) {
        //
        // Attention developers!
        // If you add a new event attribute, please be sure to add it to
        // all three load functions: loadXML, loadSPARCL, loadJSON. 
        // Thanks!
        //
        // args is a hash/object. It supports the following keys. Most are optional
        //   id            -- an internal id. Really shouldn't be used by events.
        //                    Timeline library clients should use eventID
        //   eventID       -- For use by library client when writing custom painters or
        //                    custom fillInfoBubble    
        //   start
        //   end
        //   latestStart
        //   earliestEnd
        //   instant      -- boolean. Controls precise/non-precise logic & duration/instant issues
        //   text         -- event source attribute 'title' -- used as the label on Timelines and in bubbles.
        //   description  -- used in bubbles   
        //   image        -- used in bubbles
        //   link         -- used in bubbles
        //   icon         -- on the Timeline
        //   color        -- Timeline label and tape color
        //   textColor    -- Timeline label color, overrides color attribute
        //   hoverText    -- deprecated, here for backwards compatibility.
        //                   Superceeded by caption
        //   caption      -- tooltip-like caption on the Timeline. Uses HTML title attribute 
        //   classname    -- used to set classname in Timeline. Enables better CSS selector rules
        //   tapeImage    -- background image of the duration event's tape div on the Timeline
        //   tapeRepeat   -- repeat attribute for tapeImage. {repeat | repeat-x | repeat-y }

        function cleanArg(arg) {
            // clean up an arg
            return (args[arg] != null && args[arg] != "") ? args[arg] : null;
        }

        var id = args.id ? args.id.trim() : "";
        this._id = id.length > 0 ? id : Timeline.EventUtils.getNewEventID();

        this._instant = args.instant || (args.end == null || args.end == undefined);

        this._start = args.start;
        this._end = (args.end != null) ? args.end : args.start;

        this._latestStart = (args.latestStart != null && args.latestStart != undefined) ?
            args.latestStart : (args.instant ? this._end : this._start);
        this._earliestEnd = (args.earliestEnd != null && args.earliestEnd != undefined) ?
            args.earliestEnd : this._end;

        // check sanity of dates since incorrect dates will later cause calculation errors
        // when painting
        var err = [];
        if (this._start > this._latestStart) {
            this._latestStart = this._start;
            err.push("start is > latestStart");
        }
        if (this._start > this._earliestEnd) {
            this._earliestEnd = this._latestStart;
            err.push("start is > earliestEnd");
        }
        if (this._start > this._end) {
            this._end = this._earliestEnd;
            err.push("start is > end");
        }
        if (this._latestStart > this._earliestEnd) {
            this._earliestEnd = this._latestStart;
            err.push("latestStart is > earliestEnd");
        }
        if (this._latestStart > this._end) {
            this._end = this._earliestEnd;
            err.push("latestStart is > end");
        }
        if (this._earliestEnd > this._end) {
            this._end = this._earliestEnd;
            err.push("earliestEnd is > end");
        }

        this._eventID = cleanArg('eventID');
        this._text = (args.text != null && args.text != undefined) ? SimileAjax.HTML.deEntify(args.text) : ""; // Change blank titles to ""
        if (err.length > 0) {
            this._text += " PROBLEM: " + err.join(", ");
        }

        this._description = SimileAjax.HTML.deEntify(args.description);
        this._image = cleanArg('image');
        this._link = cleanArg('link');
        this._title = cleanArg('hoverText');
        this._title = cleanArg('caption');

        this._icon = cleanArg('icon');
        this._color = cleanArg('color');
        this._textColor = cleanArg('textColor');
        this._classname = cleanArg('classname');
        this._tapeImage = cleanArg('tapeImage');
        this._tapeRepeat = cleanArg('tapeRepeat');
        this._trackNum = cleanArg('trackNum');
        if (this._trackNum != null && this._trackNum != undefined) {
            this._trackNum = parseInt(this._trackNum);
        }

        this._wikiURL = null;
        this._wikiSection = null;
    };

    Timeline.DefaultEventSource.Event.prototype = {
        getID: function() {
            return this._id;
        },

        isInstant: function() {
            return this._instant;
        },
        isImprecise: function() {
            return this._start != this._latestStart || this._end != this._earliestEnd;
        },

        getStart: function() {
            return this._start;
        },
        getEnd: function() {
            return this._end;
        },
        getLatestStart: function() {
            return this._latestStart;
        },
        getEarliestEnd: function() {
            return this._earliestEnd;
        },

        getEventID: function() {
            return this._eventID;
        },
        getText: function() {
            return this._text;
        }, // title
        getDescription: function() {
            return this._description;
        },
        getImage: function() {
            return this._image;
        },
        getLink: function() {
            return this._link;
        },

        getIcon: function() {
            return this._icon;
        },
        getColor: function() {
            return this._color;
        },
        getTextColor: function() {
            return this._textColor;
        },
        getClassName: function() {
            return this._classname;
        },
        getTapeImage: function() {
            return this._tapeImage;
        },
        getTapeRepeat: function() {
            return this._tapeRepeat;
        },
        getTrackNum: function() {
            return this._trackNum;
        },
        getProperty: function(name) {
            return this[name];
        },
        getWikiURL: function() {
            return this._wikiURL;
        },
        getWikiSection: function() {
            return this._wikiSection;
        },
        setWikiInfo: function(wikiURL, wikiSection) {
            this._wikiURL = wikiURL;
            this._wikiSection = wikiSection;
        },

        fillDescription: function(elmt) {
            elmt.innerHTML = this._description;
        },
        fillWikiInfo: function(elmt) {
            // Many bubbles will not support a wiki link. 
            // 
            // Strategy: assume no wiki link. If we do have
            // enough parameters for one, then create it.
            elmt.style.display = "none"; // default

            if (this._wikiURL == null || this._wikiSection == null) {
                return; // EARLY RETURN
            }

            // create the wikiID from the property or from the event text (the title)      
            var wikiID = this.getProperty("wikiID");
            if (wikiID == null || wikiID.length == 0) {
                wikiID = this.getText(); // use the title as the backup wiki id
            }

            if (wikiID == null || wikiID.length == 0) {
                return; // No wikiID. Thus EARLY RETURN
            }

            // ready to go...
            elmt.style.display = "inline";
            wikiID = wikiID.replace(/\s/g, "_");
            var url = this._wikiURL + this._wikiSection.replace(/\s/g, "_") + "/" + wikiID;
            var a = document.createElement("a");
            a.href = url;
            a.target = "new";
            a.innerHTML = Timeline.strings[Timeline.clientLocale].wikiLinkLabel;

            elmt.appendChild(document.createTextNode("["));
            elmt.appendChild(a);
            elmt.appendChild(document.createTextNode("]"));
        },

        fillTime: function(elmt, labeller) {
            if (this._instant) {
                if (this.isImprecise()) {
                    elmt.appendChild(elmt.ownerDocument.createTextNode(labeller.labelPrecise(this._start)));
                    elmt.appendChild(elmt.ownerDocument.createElement("br"));
                    elmt.appendChild(elmt.ownerDocument.createTextNode(labeller.labelPrecise(this._end)));
                } else {
                    elmt.appendChild(elmt.ownerDocument.createTextNode(labeller.labelPrecise(this._start)));
                }
            } else {
                if (this.isImprecise()) {
                    elmt.appendChild(elmt.ownerDocument.createTextNode(
                        labeller.labelPrecise(this._start) + " ~ " + labeller.labelPrecise(this._latestStart)));
                    elmt.appendChild(elmt.ownerDocument.createElement("br"));
                    elmt.appendChild(elmt.ownerDocument.createTextNode(
                        labeller.labelPrecise(this._earliestEnd) + " ~ " + labeller.labelPrecise(this._end)));
                } else {
                    elmt.appendChild(elmt.ownerDocument.createTextNode(labeller.labelPrecise(this._start)));
                    elmt.appendChild(elmt.ownerDocument.createElement("br"));
                    elmt.appendChild(elmt.ownerDocument.createTextNode(labeller.labelPrecise(this._end)));
                }
            }
        },

        fillInfoBubble: function(elmt, theme, labeller) {
            var doc = elmt.ownerDocument;

            var title = this.getText();
            var link = this.getLink();
            var image = this.getImage();

            if (image != null && image != undefined) {
                var img = doc.createElement("img");
                img.src = image;

                theme.event.bubble.imageStyler(img);
                elmt.appendChild(img);
            }

            var divTitle = doc.createElement("div");
            var textTitle = doc.createTextNode(title);

            if (link != null && image != undefined) {
                var a = doc.createElement("a");
                a.href = link;
                a.appendChild(textTitle);
                divTitle.appendChild(a);
            } else {
                divTitle.appendChild(textTitle);
            }

            theme.event.bubble.titleStyler(divTitle);
            elmt.appendChild(divTitle);

            var divBody = doc.createElement("div");
            this.fillDescription(divBody);
            theme.event.bubble.bodyStyler(divBody);
            elmt.appendChild(divBody);

            var divTime = doc.createElement("div");
            this.fillTime(divTime, labeller);
            theme.event.bubble.timeStyler(divTime);
            elmt.appendChild(divTime);

            var divWiki = doc.createElement("div");
            this.fillWikiInfo(divWiki);
            theme.event.bubble.wikiStyler(divWiki);
            elmt.appendChild(divWiki);
        }
    };
}());

(function() {
    'use strict';
    /*==================================================
     *  Original Event Painter
     *==================================================
     */

    /*==================================================
     *
     * To enable a single event listener to monitor everything
     * on a Timeline, we need a way to map from an event's icon,
     * label or tape element to the associated timeline, band and
     * specific event.
     *
     * Thus a set format is used for the id's of the
     * events' elements on the Timeline--
     *
     * element id format for labels, icons, tapes:
     *   labels: label-tl-<timelineID>-<band_index>-<evt.id>
     *    icons: icon-tl-<timelineID>-<band_index>-<evt.id>
     *    tapes: tape1-tl-<timelineID>-<band_index>-<evt.id>
     *           tape2-tl-<timelineID>-<band_index>-<evt.id>
     *           // some events have more than one tape
     *    highlight: highlight1-tl-<timelineID>-<band_index>-<evt.id>
     *               highlight2-tl-<timelineID>-<band_index>-<evt.id>
     *           // some events have more than one highlight div (future)
     * You can then retrieve the band/timeline objects and event object
     * by using Timeline.EventUtils.decodeEventElID
     *
     *==================================================
     */

    /*
     *    eventPaintListener functions receive calls about painting.
     *    function(band, op, evt, els)
     *       context: 'this' will be an OriginalEventPainter object.
     *                It has properties and methods for obtaining
     *                the relevant band, timeline, etc
     *       band = the band being painted
     *       op = 'paintStarting' // the painter is about to remove
     *            all previously painted events, if any. It will
     *            then start painting all of the visible events that
     *            pass the filter.
     *            evt = null, els = null
     *       op = 'paintEnded' // the painter has finished painting
     *            all of the visible events that passed the filter
     *            evt = null, els = null
     *       op = 'paintedEvent' // the painter just finished painting an event
     *            evt = event just painted
     *            els = array of painted elements' divs. Depending on the event,
     *                  the array could be just a tape or icon (if no label).
     *                  Or could include label, multiple tape divs (imprecise event),
     *                  highlight divs. The array is not ordered. The meaning of
     *                  each el is available by decoding the el's id
     *      Note that there may be no paintedEvent calls if no events were visible
     *      or passed the filter.
     */

    Timeline.OriginalEventPainter = function(params) {
        this._params = params;
        this._onSelectListeners = [];
        this._eventPaintListeners = [];

        this._filterMatcher = null;
        this._highlightMatcher = null;
        this._frc = null;

        this._eventIdToElmt = {};
    };

    Timeline.OriginalEventPainter.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;

        this._backLayer = null;
        this._eventLayer = null;
        this._lineLayer = null;
        this._highlightLayer = null;

        this._eventIdToElmt = null;
    };

    Timeline.OriginalEventPainter.prototype.getType = function() {
        return 'original';
    };

    Timeline.OriginalEventPainter.prototype.addOnSelectListener = function(listener) {
        this._onSelectListeners.push(listener);
    };

    Timeline.OriginalEventPainter.prototype.removeOnSelectListener = function(listener) {
        for (var i = 0; i < this._onSelectListeners.length; i++) {
            if (this._onSelectListeners[i] === listener) {
                this._onSelectListeners.splice(i, 1);
                break;
            }
        }
    };

    Timeline.OriginalEventPainter.prototype.addEventPaintListener = function(listener) {
        this._eventPaintListeners.push(listener);
    };

    Timeline.OriginalEventPainter.prototype.removeEventPaintListener = function(listener) {
        for (var i = 0; i < this._eventPaintListeners.length; i++) {
            if (this._eventPaintListeners[i] === listener) {
                this._eventPaintListeners.splice(i, 1);
                break;
            }
        }
    };

    Timeline.OriginalEventPainter.prototype.getFilterMatcher = function() {
        return this._filterMatcher;
    };

    Timeline.OriginalEventPainter.prototype.setFilterMatcher = function(filterMatcher) {
        this._filterMatcher = filterMatcher;
    };

    Timeline.OriginalEventPainter.prototype.getHighlightMatcher = function() {
        return this._highlightMatcher;
    };

    Timeline.OriginalEventPainter.prototype.setHighlightMatcher = function(highlightMatcher) {
        this._highlightMatcher = highlightMatcher;
    };

    Timeline.OriginalEventPainter.prototype.paint = function() {
        // Paints the events for a given section of the band--what is
        // visible on screen and some extra.
        var eventSource = this._band.getEventSource();
        if (eventSource === null) {
            return;
        }

        this._eventIdToElmt = {};
        this._fireEventPaintListeners('paintStarting', null, null);
        this._prepareForPainting();

        var eventTheme = this._params.theme.event;
        var trackHeight = Math.max(eventTheme.track.height, eventTheme.tape.height +
            this._frc.getLineHeight());
        var metrics = {
            trackOffset: eventTheme.track.offset,
            trackHeight: trackHeight,
            trackGap: eventTheme.track.gap,
            trackIncrement: trackHeight + eventTheme.track.gap,
            icon: eventTheme.instant.icon,
            iconWidth: eventTheme.instant.iconWidth,
            iconHeight: eventTheme.instant.iconHeight,
            labelWidth: eventTheme.label.width,
            maxLabelChar: eventTheme.label.maxLabelChar,
            impreciseIconMargin: eventTheme.instant.impreciseIconMargin
        };

        var minDate = this._band.getMinDate();
        var maxDate = this._band.getMaxDate();

        var filterMatcher = (this._filterMatcher !== null) ?
            this._filterMatcher :
            function() {
                return true;
            };
        var highlightMatcher = (this._highlightMatcher !== null) ?
            this._highlightMatcher :
            function() {
                return -1;
            };

        var iterator = eventSource.getEventReverseIterator(minDate, maxDate);
        while (iterator.hasNext()) {
            var evt = iterator.next();
            if (filterMatcher(evt)) {
                this.paintEvent(evt, metrics, this._params.theme, highlightMatcher(evt));
            }
        }

        this._highlightLayer.style.display = "block";
        this._lineLayer.style.display = "block";
        this._eventLayer.style.display = "block";
        // update the band object for max number of tracks in this section of the ether
        this._band.updateEventTrackInfo(this._tracks.length, metrics.trackIncrement);
        this._fireEventPaintListeners('paintEnded', null, null);
    };

    Timeline.OriginalEventPainter.prototype.softPaint = function() {};

    Timeline.OriginalEventPainter.prototype._prepareForPainting = function() {
        // Remove everything previously painted: highlight, line and event layers.
        // Prepare blank layers for painting.
        var band = this._band;

        if (this._backLayer === null) {
            this._backLayer = this._band.createLayerDiv(0, "timeline-band-events");
            this._backLayer.style.visibility = "hidden";

            var eventLabelPrototype = document.createElement("span");
            eventLabelPrototype.className = "timeline-event-label";
            this._backLayer.appendChild(eventLabelPrototype);
            this._frc = SimileAjax.Graphics.getFontRenderingContext(eventLabelPrototype);
        }
        this._frc.update();
        this._tracks = [];

        if (this._highlightLayer !== null) {
            band.removeLayerDiv(this._highlightLayer);
        }
        this._highlightLayer = band.createLayerDiv(105, "timeline-band-highlights");
        this._highlightLayer.style.display = "none";

        if (this._lineLayer !== null) {
            band.removeLayerDiv(this._lineLayer);
        }
        this._lineLayer = band.createLayerDiv(110, "timeline-band-lines");
        this._lineLayer.style.display = "none";

        if (this._eventLayer !== null) {
            band.removeLayerDiv(this._eventLayer);
        }
        this._eventLayer = band.createLayerDiv(115, "timeline-band-events");
        this._eventLayer.style.display = "none";
    };

    Timeline.OriginalEventPainter.prototype.paintEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isInstant()) {
            this.paintInstantEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintDurationEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.OriginalEventPainter.prototype.paintInstantEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isImprecise()) {
            this.paintImpreciseInstantEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintPreciseInstantEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.OriginalEventPainter.prototype.paintDurationEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isImprecise()) {
            this.paintImpreciseDurationEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintPreciseDurationEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.OriginalEventPainter.prototype.paintPreciseInstantEvent = function(evt, metrics, theme, highlightIndex) {
        var text = evt.getText();

        var startDate = evt.getStart();
        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
        var iconRightEdge = Math.round(startPixel + metrics.iconWidth / 2);
        var iconLeftEdge = Math.round(startPixel - metrics.iconWidth / 2);

        var labelDivClassName = this._getLabelDivClassName(evt);
        var labelSize = this._frc.computeSize(text, labelDivClassName);
        var labelLeft = iconRightEdge + theme.event.label.offsetFromLine;
        var labelRight = labelLeft + labelSize.width;

        var rightEdge = labelRight;
        var track = this._findFreeTrack(evt, rightEdge);

        var labelTop = Math.round(
            metrics.trackOffset + track * metrics.trackIncrement +
            metrics.trackHeight / 2 - labelSize.height / 2);

        var iconElmtData = this._paintEventIcon(evt, track, iconLeftEdge, metrics, theme, 0);
        var labelElmtData = this._paintEventLabel(evt, text, labelLeft, labelTop, labelSize.width,
            labelSize.height, theme, labelDivClassName, highlightIndex);
        var els = [iconElmtData.elmt, labelElmtData.elmt];

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickInstantEvent(iconElmtData.elmt, domEvt, evt);
        };
        SimileAjax.DOM.registerEvent(iconElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

        var hDiv = this._createHighlightDiv(highlightIndex, iconElmtData, theme, evt);
        if (hDiv !== null) {
            els.push(hDiv);
        }
        this._fireEventPaintListeners('paintedEvent', evt, els);


        this._eventIdToElmt[evt.getID()] = iconElmtData.elmt;
        this._tracks[track] = iconLeftEdge;
    };

    Timeline.OriginalEventPainter.prototype.paintImpreciseInstantEvent = function(evt, metrics, theme, highlightIndex) {
        var text = evt.getText();

        var startDate = evt.getStart();
        var endDate = evt.getEnd();
        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
        var endPixel = Math.round(this._band.dateToPixelOffset(endDate));

        var iconRightEdge = Math.round(startPixel + metrics.iconWidth / 2);
        var iconLeftEdge = Math.round(startPixel - metrics.iconWidth / 2);

        var labelDivClassName = this._getLabelDivClassName(evt);
        var labelSize = this._frc.computeSize(text, labelDivClassName);
        var labelLeft = iconRightEdge + theme.event.label.offsetFromLine;
        var labelRight = labelLeft + labelSize.width;

        var rightEdge = Math.max(labelRight, endPixel);
        var track = this._findFreeTrack(evt, rightEdge);
        var tapeHeight = theme.event.tape.height;
        var labelTop = Math.round(
            metrics.trackOffset + track * metrics.trackIncrement + tapeHeight);

        var iconElmtData = this._paintEventIcon(evt, track, iconLeftEdge, metrics, theme, tapeHeight);
        var labelElmtData = this._paintEventLabel(evt, text, labelLeft, labelTop, labelSize.width,
            labelSize.height, theme, labelDivClassName, highlightIndex);

        var color = evt.getColor();
        color = color !== null ? color : theme.event.instant.impreciseColor;

        var tapeElmtData = this._paintEventTape(evt, track, startPixel, endPixel,
            color, theme.event.instant.impreciseOpacity, metrics, theme, 0);

        var els = [iconElmtData.elmt, labelElmtData.elmt, tapeElmtData.elmt];

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickInstantEvent(iconElmtData.elmt, domEvt, evt);
        };
        SimileAjax.DOM.registerEvent(iconElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(tapeElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

        var hDiv = this._createHighlightDiv(highlightIndex, iconElmtData, theme, evt);
        if (hDiv !== null) {
            els.push(hDiv);
        }
        this._fireEventPaintListeners('paintedEvent', evt, els);

        this._eventIdToElmt[evt.getID()] = iconElmtData.elmt;
        this._tracks[track] = iconLeftEdge;
    };

    Timeline.OriginalEventPainter.prototype.paintPreciseDurationEvent = function(evt, metrics, theme, highlightIndex) {
        var text = evt.getText();

        var startDate = evt.getStart();
        var endDate = evt.getEnd();
        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
        var endPixel = Math.round(this._band.dateToPixelOffset(endDate));

        var labelDivClassName = this._getLabelDivClassName(evt);
        var labelSize = this._frc.computeSize(text, labelDivClassName);
        var labelLeft;
        if ((endPixel - startPixel) > labelSize.width) {
            labelLeft = endPixel - labelSize.width; // startPixel
        } else {
            labelLeft = startPixel; // startPixel
        }
        var labelRight = labelLeft + labelSize.width;

        var rightEdge = Math.max(labelRight, endPixel);
        var track = this._findFreeTrack(evt, rightEdge);
        var labelTop = Math.round(
            metrics.trackOffset + track * metrics.trackIncrement + theme.event.tape.height);

        var color = evt.getColor();
        color = color !== null ? color : theme.event.duration.color;

        var tapeElmtData = this._paintEventTape(evt, track, startPixel, endPixel, color, 100, metrics, theme, 0);

        if (labelSize.width > (endPixel - startPixel)) {
            var labelElmtData = this._paintEventLabel(evt, text, startPixel, labelTop, labelSize.width,
                labelSize.height, theme, labelDivClassName, highlightIndex);
        }
        else {
            var labelElmtData = this._paintEventLabel(evt, text, startPixel, labelTop, (endPixel - startPixel),
                labelSize.height, theme, labelDivClassName, highlightIndex);
        }

        var els = [tapeElmtData.elmt, labelElmtData.elmt];

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickDurationEvent(tapeElmtData.elmt, domEvt, evt);
        };
        SimileAjax.DOM.registerEvent(tapeElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

        var hDiv = this._createHighlightDiv(highlightIndex, tapeElmtData, theme, evt);
        if (hDiv !== null) {
            els.push(hDiv);
        }
        this._fireEventPaintListeners('paintedEvent', evt, els);

        this._eventIdToElmt[evt.getID()] = tapeElmtData.elmt;
        this._tracks[track] = startPixel;
    };

    Timeline.OriginalEventPainter.prototype.paintImpreciseDurationEvent = function(evt, metrics, theme, highlightIndex) {
        var text = evt.getText();

        var startDate = evt.getStart();
        var latestStartDate = evt.getLatestStart();
        var endDate = evt.getEnd();
        var earliestEndDate = evt.getEarliestEnd();

        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
        var latestStartPixel = Math.round(this._band.dateToPixelOffset(latestStartDate));
        var endPixel = Math.round(this._band.dateToPixelOffset(endDate));
        var earliestEndPixel = Math.round(this._band.dateToPixelOffset(earliestEndDate));

        var labelDivClassName = this._getLabelDivClassName(evt);
        var labelSize = this._frc.computeSize(text, labelDivClassName);
        var labelLeft = latestStartPixel;
        var labelRight = labelLeft + labelSize.width;

        var rightEdge = Math.max(labelRight, endPixel);
        var track = this._findFreeTrack(evt, rightEdge);
        var labelTop = Math.round(
            metrics.trackOffset + track * metrics.trackIncrement + theme.event.tape.height);

        var color = evt.getColor();
        color = color !== null ? color : theme.event.duration.color;

        // Imprecise events can have two event tapes
        // The imprecise dates tape, uses opacity to be dimmer than precise dates
        var impreciseTapeElmtData = this._paintEventTape(evt, track, startPixel, endPixel,
            theme.event.duration.impreciseColor,
            theme.event.duration.impreciseOpacity, metrics, theme, 0);
        // The precise dates tape, regular (100%) opacity
        var tapeElmtData = this._paintEventTape(evt, track, latestStartPixel,
            earliestEndPixel, color, 100, metrics, theme, 1);

        var labelElmtData = this._paintEventLabel(evt, text, labelLeft, labelTop,
            labelSize.width, labelSize.height, theme, labelDivClassName, highlightIndex);
        var els = [impreciseTapeElmtData.elmt, tapeElmtData.elmt, labelElmtData.elmt];

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickDurationEvent(tapeElmtData.elmt, domEvt, evt);
        };
        SimileAjax.DOM.registerEvent(tapeElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

        var hDiv = this._createHighlightDiv(highlightIndex, tapeElmtData, theme, evt);
        if (hDiv !== null) {
            els.push(hDiv);
        }
        this._fireEventPaintListeners('paintedEvent', evt, els);

        this._eventIdToElmt[evt.getID()] = tapeElmtData.elmt;
        this._tracks[track] = startPixel;
    };

    Timeline.OriginalEventPainter.prototype._encodeEventElID = function(elType, evt) {
        return Timeline.EventUtils.encodeEventElID(this._timeline, this._band, elType, evt);
    };

    Timeline.OriginalEventPainter.prototype._findFreeTrack = function(event, rightEdge) {
        var trackAttribute = event.getTrackNum();
        if (trackAttribute !== null) {
            return trackAttribute; // early return since event includes track number
        }

        // normal case: find an open track
        for (var i = 0; i < this._tracks.length; i++) {
            var t = this._tracks[i];
            if (t > rightEdge) {
                break;
            }
        }
        return i;
    };

    Timeline.OriginalEventPainter.prototype._paintEventIcon = function(evt, iconTrack, left, metrics, theme, tapeHeight) {
        // If no tape, then paint the icon in the middle of the track.
        // If there is a tape, paint the icon below the tape + impreciseIconMargin
        var icon = evt.getIcon();
        icon = icon !== null ? icon : metrics.icon;

        var top; // top of the icon
        if (tapeHeight > 0) {
            top = metrics.trackOffset + iconTrack * metrics.trackIncrement +
                tapeHeight + metrics.impreciseIconMargin;
        } else {
            var middle = metrics.trackOffset + iconTrack * metrics.trackIncrement +
                metrics.trackHeight / 2;
            top = Math.round(middle - metrics.iconHeight / 2);
        }
        var img = SimileAjax.Graphics.createTranslucentImage(icon);
        var iconDiv = this._timeline.getDocument().createElement("div");
        iconDiv.className = this._getElClassName('timeline-event-icon', evt, 'icon');
        iconDiv.id = this._encodeEventElID('icon', evt);
        iconDiv.style.left = left + "px";
        iconDiv.style.top = top + "px";
        iconDiv.appendChild(img);

        if (evt._title !== null) {
            iconDiv.title = evt._title;
        }

        this._eventLayer.appendChild(iconDiv);

        return {
            left: left,
            top: top,
            width: metrics.iconWidth,
            height: metrics.iconHeight,
            elmt: iconDiv
        };
    };

    Timeline.OriginalEventPainter.prototype._paintEventLabel = function(evt, text, left, top, width,
        height, theme, labelDivClassName, highlightIndex) {
        var doc = this._timeline.getDocument();

        var labelDiv = doc.createElement("div");
        labelDiv.className = labelDivClassName;
        labelDiv.id = this._encodeEventElID('label', evt);
        labelDiv.style.left = left + "px";
        labelDiv.style.width = width + "px";
        labelDiv.style.top = top + "px";
        labelDiv.innerHTML = text;

        if (evt._title !== null) {
            labelDiv.title = evt._title;
        }

        var color = evt.getTextColor();
        if (color === null) {
            color = evt.getColor();
        }
        if (color !== null) {
            labelDiv.style.color = color;
        }
        if (theme.event.highlightLabelBackground && highlightIndex >= 0) {
            labelDiv.style.background = this._getHighlightColor(highlightIndex, theme);
        }

        this._eventLayer.appendChild(labelDiv);

        return {
            left: left,
            top: top,
            width: width,
            height: height,
            elmt: labelDiv
        };
    };

    Timeline.OriginalEventPainter.prototype._paintEventTape = function(
        evt, iconTrack, startPixel, endPixel, color, opacity, metrics, theme, tape_index) {

        var tapeWidth = endPixel - startPixel;
        var tapeHeight = theme.event.tape.height;
        var top = metrics.trackOffset + iconTrack * metrics.trackIncrement;

        var tapeDiv = this._timeline.getDocument().createElement("div");
        tapeDiv.className = this._getElClassName('timeline-event-tape', evt, 'tape');
        tapeDiv.id = this._encodeEventElID('tape' + tape_index, evt);
        tapeDiv.style.left = startPixel + "px";
        tapeDiv.style.width = tapeWidth + "px";
        tapeDiv.style.height = tapeHeight + "px";
        tapeDiv.style.top = top + "px";

        if (evt._title !== null) {
            tapeDiv.title = evt._title;
        }

        if (color !== null) {
            tapeDiv.style.backgroundColor = color;
        }

        var backgroundImage = evt.getTapeImage();
        var backgroundRepeat = evt.getTapeRepeat();
        backgroundRepeat = backgroundRepeat !== null ? backgroundRepeat : 'repeat';
        if (backgroundImage !== null) {
            tapeDiv.style.backgroundImage = "url(" + backgroundImage + ")";
            tapeDiv.style.backgroundRepeat = backgroundRepeat;
        }

        SimileAjax.Graphics.setOpacity(tapeDiv, opacity);

        this._eventLayer.appendChild(tapeDiv);

        return {
            left: startPixel,
            top: top,
            width: tapeWidth,
            height: tapeHeight,
            elmt: tapeDiv
        };
    };

    Timeline.OriginalEventPainter.prototype._getLabelDivClassName = function(evt) {
        return this._getElClassName('timeline-event-label', evt, 'label');
    };

    Timeline.OriginalEventPainter.prototype._getElClassName = function(elClassName, evt, prefix) {
        // Prefix and '_' is added to the event's classname. Set to null for no prefix
        var evt_classname = evt.getClassName(),
            pieces = [];

        if (evt_classname) {
            if (prefix) {
                pieces.push(prefix + '-' + evt_classname + ' ');
            }
            pieces.push(evt_classname + ' ');
        }
        pieces.push(elClassName);
        return (pieces.join(''));
    };

    Timeline.OriginalEventPainter.prototype._getHighlightColor = function(highlightIndex, theme) {
        var highlightColors = theme.event.highlightColors;
        return highlightColors[Math.min(highlightIndex, highlightColors.length - 1)];
    };

    Timeline.OriginalEventPainter.prototype._createHighlightDiv = function(highlightIndex, dimensions, theme, evt) {
        var div = null;
        if (highlightIndex >= 0) {
            var doc = this._timeline.getDocument();
            var color = this._getHighlightColor(highlightIndex, theme);

            div = doc.createElement("div");
            div.className = this._getElClassName('timeline-event-highlight', evt, 'highlight');
            div.id = this._encodeEventElID('highlight0', evt); // in future will have other
            // highlight divs for tapes + icons
            div.style.position = "absolute";
            div.style.overflow = "hidden";
            div.style.left = (dimensions.left - 2) + "px";
            div.style.width = (dimensions.width + 4) + "px";
            div.style.top = (dimensions.top - 2) + "px";
            div.style.height = (dimensions.height + 4) + "px";
            div.style.background = color;

            this._highlightLayer.appendChild(div);
        }
        return div;
    };

    Timeline.OriginalEventPainter.prototype._onClickInstantEvent = function(icon, domEvt, evt) {
        var c = SimileAjax.DOM.getPageCoordinates(icon);
        this._showBubble(
            c.left + Math.ceil(icon.offsetWidth / 2),
            c.top + Math.ceil(icon.offsetHeight / 2),
            evt
        );
        this._fireOnSelect(evt.getID());

        domEvt.cancelBubble = true;
        SimileAjax.DOM.cancelEvent(domEvt);
        return false;
    };

    Timeline.OriginalEventPainter.prototype._onClickDurationEvent = function(target, domEvt, evt) {
        var x,
            y,
            c;

        if ("pageX" in domEvt) {
            x = domEvt.pageX;
            y = domEvt.pageY;
        } else {
            c = SimileAjax.DOM.getPageCoordinates(target);
            x = domEvt.offsetX + c.left;
            y = domEvt.offsetY + c.top;
        }
        this._showBubble(x, y, evt);
        this._fireOnSelect(evt.getID());

        domEvt.cancelBubble = true;
        SimileAjax.DOM.cancelEvent(domEvt);
        return false;
    };

    Timeline.OriginalEventPainter.prototype.showBubble = function(evt) {
        var elmt = this._eventIdToElmt[evt.getID()];
        if (elmt) {
            var c = SimileAjax.DOM.getPageCoordinates(elmt);
            this._showBubble(c.left + elmt.offsetWidth / 2, c.top + elmt.offsetHeight / 2, evt);
        }
    };

    Timeline.OriginalEventPainter.prototype._showBubble = function(x, y, evt) {
        var div = document.createElement("div");
        var themeBubble = this._params.theme.event.bubble;
        evt.fillInfoBubble(div, this._params.theme, this._band.getLabeller());

        SimileAjax.WindowManager.cancelPopups();
        SimileAjax.Graphics.createBubbleForContentAndPoint(div, x, y,
            themeBubble.width, null, themeBubble.maxHeight);
    };

    Timeline.OriginalEventPainter.prototype._fireOnSelect = function(eventID) {
        for (var i = 0; i < this._onSelectListeners.length; i++) {
            this._onSelectListeners[i](eventID);
        }
    };

    Timeline.OriginalEventPainter.prototype._fireEventPaintListeners = function(op, evt, els) {
        for (var i = 0; i < this._eventPaintListeners.length; i++) {
            this._eventPaintListeners[i](this._band, op, evt, els);
        }
    };
}());

(function() {
    'use strict';
    /*==================================================
     *  Detailed Event Painter
     *==================================================
     */

    // Note: a number of features from original-painter 
    //       are not yet implemented in detailed painter.
    //       Eg classname, id attributes for icons, labels, tapes

    Timeline.DetailedEventPainter = function(params) {
        this._params = params;
        this._onSelectListeners = [];
        this._filterMatcher = null;
        this._highlightMatcher = null;
        this._frc = null;
        this._eventIdToElmt = {};
    };

    Timeline.DetailedEventPainter.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;
        this._backLayer = null;
        this._eventLayer = null;
        this._lineLayer = null;
        this._highlightLayer = null;
        this._eventIdToElmt = null;
    };

    Timeline.DetailedEventPainter.prototype.getType = function() {
        return 'detailed';
    };

    Timeline.DetailedEventPainter.prototype.addOnSelectListener = function(listener) {
        this._onSelectListeners.push(listener);
    };

    Timeline.DetailedEventPainter.prototype.removeOnSelectListener = function(listener) {
        for (var i = 0; i < this._onSelectListeners.length; i++) {
            if (this._onSelectListeners[i] === listener) {
                this._onSelectListeners.splice(i, 1);
                break;
            }
        }
    };

    Timeline.DetailedEventPainter.prototype.getFilterMatcher = function() {
        return this._filterMatcher;
    };

    Timeline.DetailedEventPainter.prototype.setFilterMatcher = function(filterMatcher) {
        this._filterMatcher = filterMatcher;
    };

    Timeline.DetailedEventPainter.prototype.getHighlightMatcher = function() {
        return this._highlightMatcher;
    };

    Timeline.DetailedEventPainter.prototype.setHighlightMatcher = function(highlightMatcher) {
        this._highlightMatcher = highlightMatcher;
    };

    Timeline.DetailedEventPainter.prototype.paint = function() {
        var eventSource = this._band.getEventSource();
        if (eventSource === null) {
            return;
        }

        this._eventIdToElmt = {};
        this._prepareForPainting();

        var eventTheme = this._params.theme.event;
        var trackHeight = Math.max(eventTheme.track.height, this._frc.getLineHeight());
        var metrics = {
            trackOffset: Math.round(this._band.getViewWidth() / 2 - trackHeight / 2),
            trackHeight: trackHeight,
            trackGap: eventTheme.track.gap,
            trackIncrement: trackHeight + eventTheme.track.gap,
            icon: eventTheme.instant.icon,
            iconWidth: eventTheme.instant.iconWidth,
            iconHeight: eventTheme.instant.iconHeight,
            labelWidth: eventTheme.label.width
        };

        var minDate = this._band.getMinDate();
        var maxDate = this._band.getMaxDate();

        var filterMatcher = (this._filterMatcher !== null) ?
            this._filterMatcher :
            function() {
                return true;
            };
        var highlightMatcher = (this._highlightMatcher !== null) ?
            this._highlightMatcher :
            function() {
                return -1;
            };

        var iterator = eventSource.getEventReverseIterator(minDate, maxDate);
        while (iterator.hasNext()) {
            var evt = iterator.next();
            if (filterMatcher(evt)) {
                this.paintEvent(evt, metrics, this._params.theme, highlightMatcher(evt));
            }
        }

        this._highlightLayer.style.display = "block";
        this._lineLayer.style.display = "block";
        this._eventLayer.style.display = "block";
        // update the band object for max number of tracks in this section of the ether
        this._band.updateEventTrackInfo(this._lowerTracks.length + this._upperTracks.length,
            metrics.trackIncrement);
    };

    Timeline.DetailedEventPainter.prototype.softPaint = function() {};

    Timeline.DetailedEventPainter.prototype._prepareForPainting = function() {
        var band = this._band;

        if (this._backLayer === null) {
            this._backLayer = this._band.createLayerDiv(0, "timeline-band-events");
            this._backLayer.style.visibility = "hidden";

            var eventLabelPrototype = document.createElement("span");
            eventLabelPrototype.className = "timeline-event-label";
            this._backLayer.appendChild(eventLabelPrototype);
            this._frc = SimileAjax.Graphics.getFontRenderingContext(eventLabelPrototype);
        }
        this._frc.update();
        this._lowerTracks = [];
        this._upperTracks = [];

        if (this._highlightLayer !== null) {
            band.removeLayerDiv(this._highlightLayer);
        }
        this._highlightLayer = band.createLayerDiv(105, "timeline-band-highlights");
        this._highlightLayer.style.display = "none";

        if (this._lineLayer !== null) {
            band.removeLayerDiv(this._lineLayer);
        }
        this._lineLayer = band.createLayerDiv(110, "timeline-band-lines");
        this._lineLayer.style.display = "none";

        if (this._eventLayer !== null) {
            band.removeLayerDiv(this._eventLayer);
        }
        this._eventLayer = band.createLayerDiv(110, "timeline-band-events");
        this._eventLayer.style.display = "none";
    };

    Timeline.DetailedEventPainter.prototype.paintEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isInstant()) {
            this.paintInstantEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintDurationEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.DetailedEventPainter.prototype.paintInstantEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isImprecise()) {
            this.paintImpreciseInstantEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintPreciseInstantEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.DetailedEventPainter.prototype.paintDurationEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isImprecise()) {
            this.paintImpreciseDurationEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintPreciseDurationEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.DetailedEventPainter.prototype.paintPreciseInstantEvent = function(evt, metrics, theme, highlightIndex) {
        var text = evt.getText();
        var startDate = evt.getStart();
        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
        var iconRightEdge = Math.round(startPixel + metrics.iconWidth / 2);
        var iconLeftEdge = Math.round(startPixel - metrics.iconWidth / 2);
        var labelSize = this._frc.computeSize(text);
        var iconTrack = this._findFreeTrackForSolid(iconRightEdge, startPixel);
        var iconElmtData = this._paintEventIcon(evt, iconTrack, iconLeftEdge, metrics, theme);
        var labelLeft = iconRightEdge + theme.event.label.offsetFromLine;
        var labelTrack = iconTrack;
        var iconTrackData = this._getTrackData(iconTrack);

        if (Math.min(iconTrackData.solid, iconTrackData.text) >= labelLeft + labelSize.width) { // label on the same track, to the right of icon
            iconTrackData.solid = iconLeftEdge;
            iconTrackData.text = labelLeft;
        } else { // label on a different track, below icon
            iconTrackData.solid = iconLeftEdge;

            labelLeft = startPixel + theme.event.label.offsetFromLine;
            labelTrack = this._findFreeTrackForText(iconTrack, labelLeft + labelSize.width, function(t) {
                t.line = startPixel - 2;
            });
            this._getTrackData(labelTrack).text = iconLeftEdge;

            this._paintEventLine(evt, startPixel, iconTrack, labelTrack, metrics, theme);
        }

        var labelTop = Math.round(
            metrics.trackOffset + labelTrack * metrics.trackIncrement +
            metrics.trackHeight / 2 - labelSize.height / 2);

        var labelElmtData = this._paintEventLabel(evt, text, labelLeft, labelTop, labelSize.width, labelSize.height, theme);

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickInstantEvent(iconElmtData.elmt, domEvt, evt);
        };
        SimileAjax.DOM.registerEvent(iconElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

        this._createHighlightDiv(highlightIndex, iconElmtData, theme);

        this._eventIdToElmt[evt.getID()] = iconElmtData.elmt;
    };

    Timeline.DetailedEventPainter.prototype.paintImpreciseInstantEvent = function(evt, metrics, theme, highlightIndex) {
        var text = evt.getText();

        var startDate = evt.getStart();
        var endDate = evt.getEnd();
        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
        var endPixel = Math.round(this._band.dateToPixelOffset(endDate));

        var iconRightEdge = Math.round(startPixel + metrics.iconWidth / 2);
        var iconLeftEdge = Math.round(startPixel - metrics.iconWidth / 2);

        var labelSize = this._frc.computeSize(text);
        var iconTrack = this._findFreeTrackForSolid(endPixel, startPixel);

        var tapeElmtData = this._paintEventTape(evt, iconTrack, startPixel, endPixel,
            theme.event.instant.impreciseColor, theme.event.instant.impreciseOpacity, metrics, theme);
        var iconElmtData = this._paintEventIcon(evt, iconTrack, iconLeftEdge, metrics, theme);

        var iconTrackData = this._getTrackData(iconTrack);
        iconTrackData.solid = iconLeftEdge;

        var labelLeft = iconRightEdge + theme.event.label.offsetFromLine;
        var labelRight = labelLeft + labelSize.width;
        var labelTrack;
        if (labelRight < endPixel) {
            labelTrack = iconTrack;
        } else {
            labelLeft = startPixel + theme.event.label.offsetFromLine;
            labelRight = labelLeft + labelSize.width;

            labelTrack = this._findFreeTrackForText(iconTrack, labelRight, function(t) {
                t.line = startPixel - 2;
            });
            this._getTrackData(labelTrack).text = iconLeftEdge;

            this._paintEventLine(evt, startPixel, iconTrack, labelTrack, metrics, theme);
        }
        var labelTop = Math.round(
            metrics.trackOffset + labelTrack * metrics.trackIncrement +
            metrics.trackHeight / 2 - labelSize.height / 2);

        var labelElmtData = this._paintEventLabel(evt, text, labelLeft, labelTop, labelSize.width, labelSize.height, theme);

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickInstantEvent(iconElmtData.elmt, domEvt, evt);
        };

        SimileAjax.DOM.registerEvent(iconElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(tapeElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

        this._createHighlightDiv(highlightIndex, iconElmtData, theme);

        this._eventIdToElmt[evt.getID()] = iconElmtData.elmt;
    };

    Timeline.DetailedEventPainter.prototype.paintPreciseDurationEvent = function(evt, metrics, theme, highlightIndex) {
        var text = evt.getText();

        var startDate = evt.getStart();
        var endDate = evt.getEnd();
        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
        var endPixel = Math.round(this._band.dateToPixelOffset(endDate));

        var labelSize = this._frc.computeSize(text);
        var tapeTrack = this._findFreeTrackForSolid(endPixel);
        var color = evt.getColor();
        color = color !== null ? color : theme.event.duration.color;

        var tapeElmtData = this._paintEventTape(evt, tapeTrack, startPixel, endPixel, color, 100, metrics, theme);

        var tapeTrackData = this._getTrackData(tapeTrack);
        tapeTrackData.solid = startPixel;

        var labelLeft = startPixel + theme.event.label.offsetFromLine;
        var labelTrack = this._findFreeTrackForText(tapeTrack, labelLeft + labelSize.width, function(t) {
            t.line = startPixel - 2;
        });
        this._getTrackData(labelTrack).text = startPixel - 2;

        this._paintEventLine(evt, startPixel, tapeTrack, labelTrack, metrics, theme);

        var labelTop = Math.round(
            metrics.trackOffset + labelTrack * metrics.trackIncrement +
            metrics.trackHeight / 2 - labelSize.height / 2);

        var labelElmtData = this._paintEventLabel(evt, text, labelLeft, labelTop, labelSize.width, labelSize.height, theme);

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickDurationEvent(tapeElmtData.elmt, domEvt, evt);
        };
        SimileAjax.DOM.registerEvent(tapeElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

        this._createHighlightDiv(highlightIndex, tapeElmtData, theme);

        this._eventIdToElmt[evt.getID()] = tapeElmtData.elmt;
    };

    Timeline.DetailedEventPainter.prototype.paintImpreciseDurationEvent = function(evt, metrics, theme, highlightIndex) {
        var text = evt.getText();

        var startDate = evt.getStart();
        var latestStartDate = evt.getLatestStart();
        var endDate = evt.getEnd();
        var earliestEndDate = evt.getEarliestEnd();

        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
        var latestStartPixel = Math.round(this._band.dateToPixelOffset(latestStartDate));
        var endPixel = Math.round(this._band.dateToPixelOffset(endDate));
        var earliestEndPixel = Math.round(this._band.dateToPixelOffset(earliestEndDate));

        var labelSize = this._frc.computeSize(text);
        var tapeTrack = this._findFreeTrackForSolid(endPixel);
        var color = evt.getColor();
        color = color !== null ? color : theme.event.duration.color;

        var tapeElmtData = this._paintEventTape(evt, tapeTrack, latestStartPixel, earliestEndPixel, color, 100, metrics, theme);

        var tapeTrackData = this._getTrackData(tapeTrack);
        tapeTrackData.solid = startPixel;

        var labelLeft = latestStartPixel + theme.event.label.offsetFromLine;
        var labelTrack = this._findFreeTrackForText(tapeTrack, labelLeft + labelSize.width, function(t) {
            t.line = latestStartPixel - 2;
        });
        this._getTrackData(labelTrack).text = latestStartPixel - 2;

        this._paintEventLine(evt, latestStartPixel, tapeTrack, labelTrack, metrics, theme);

        var labelTop = Math.round(
            metrics.trackOffset + labelTrack * metrics.trackIncrement +
            metrics.trackHeight / 2 - labelSize.height / 2);

        var labelElmtData = this._paintEventLabel(evt, text, labelLeft, labelTop, labelSize.width, labelSize.height, theme);

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickDurationEvent(tapeElmtData.elmt, domEvt, evt);
        };
        SimileAjax.DOM.registerEvent(tapeElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

        this._createHighlightDiv(highlightIndex, tapeElmtData, theme);

        this._eventIdToElmt[evt.getID()] = tapeElmtData.elmt;
    };

    Timeline.DetailedEventPainter.prototype._findFreeTrackForSolid = function(solidEdge, softEdge) {
        for (var i = 0; true; i++) {
            if (i < this._lowerTracks.length) {
                var t = this._lowerTracks[i];
                if (Math.min(t.solid, t.text) > solidEdge && (!(softEdge) || t.line > softEdge)) {
                    return i;
                }
            } else {
                this._lowerTracks.push({
                    solid: Number.POSITIVE_INFINITY,
                    text: Number.POSITIVE_INFINITY,
                    line: Number.POSITIVE_INFINITY
                });

                return i;
            }

            if (i < this._upperTracks.length) {
                var track = this._upperTracks[i];
                if (Math.min(track.solid, track.text) > solidEdge && (!(softEdge) || track.line > softEdge)) {
                    return -1 - i;
                }
            } else {
                this._upperTracks.push({
                    solid: Number.POSITIVE_INFINITY,
                    text: Number.POSITIVE_INFINITY,
                    line: Number.POSITIVE_INFINITY
                });

                return -1 - i;
            }
        }
    };

    Timeline.DetailedEventPainter.prototype._findFreeTrackForText = function(fromTrack, edge, occupiedTrackVisitor) {
        var extendUp;
        var index;
        var firstIndex;
        var result;

        if (fromTrack < 0) {
            extendUp = true;
            firstIndex = -fromTrack;

            index = this._findFreeUpperTrackForText(firstIndex, edge);
            result = -1 - index;
        } else if (fromTrack > 0) {
            extendUp = false;
            firstIndex = fromTrack + 1;

            index = this._findFreeLowerTrackForText(firstIndex, edge);
            result = index;
        } else {
            var upIndex = this._findFreeUpperTrackForText(0, edge);
            var downIndex = this._findFreeLowerTrackForText(1, edge);

            if (downIndex - 1 <= upIndex) {
                extendUp = false;
                firstIndex = 1;
                index = downIndex;
                result = index;
            } else {
                extendUp = true;
                firstIndex = 0;
                index = upIndex;
                result = -1 - index;
            }
        }

        if (extendUp) {
            if (index === this._upperTracks.length) {
                this._upperTracks.push({
                    solid: Number.POSITIVE_INFINITY,
                    text: Number.POSITIVE_INFINITY,
                    line: Number.POSITIVE_INFINITY
                });
            }
            for (var i = firstIndex; i < index; i++) {
                occupiedTrackVisitor(this._upperTracks[i]);
            }
        } else {
            if (index === this._lowerTracks.length) {
                this._lowerTracks.push({
                    solid: Number.POSITIVE_INFINITY,
                    text: Number.POSITIVE_INFINITY,
                    line: Number.POSITIVE_INFINITY
                });
            }
            for (var x = firstIndex; x < index; x++) {
                occupiedTrackVisitor(this._lowerTracks[x]);
            }
        }
        return result;
    };

    Timeline.DetailedEventPainter.prototype._findFreeLowerTrackForText = function(index, edge) {
        for (; index < this._lowerTracks.length; index++) {
            var t = this._lowerTracks[index];
            if (Math.min(t.solid, t.text) >= edge) {
                break;
            }
        }
        return index;
    };

    Timeline.DetailedEventPainter.prototype._findFreeUpperTrackForText = function(index, edge) {
        for (; index < this._upperTracks.length; index++) {
            var t = this._upperTracks[index];
            if (Math.min(t.solid, t.text) >= edge) {
                break;
            }
        }
        return index;
    };

    Timeline.DetailedEventPainter.prototype._getTrackData = function(index) {
        return (index < 0) ? this._upperTracks[-index - 1] : this._lowerTracks[index];
    };

    Timeline.DetailedEventPainter.prototype._paintEventLine = function(evt, left, startTrack, endTrack, metrics, theme) {
        var top = Math.round(metrics.trackOffset + startTrack * metrics.trackIncrement + metrics.trackHeight / 2);
        var height = Math.round(Math.abs(endTrack - startTrack) * metrics.trackIncrement);

        var lineStyle = "1px solid " + theme.event.label.lineColor;
        var lineDiv = this._timeline.getDocument().createElement("div");
        lineDiv.style.position = "absolute";
        lineDiv.style.left = left + "px";
        lineDiv.style.width = theme.event.label.offsetFromLine + "px";
        lineDiv.style.height = height + "px";
        if (startTrack > endTrack) {
            lineDiv.style.top = (top - height) + "px";
            lineDiv.style.borderTop = lineStyle;
        } else {
            lineDiv.style.top = top + "px";
            lineDiv.style.borderBottom = lineStyle;
        }
        lineDiv.style.borderLeft = lineStyle;
        this._lineLayer.appendChild(lineDiv);
    };

    Timeline.DetailedEventPainter.prototype._paintEventIcon = function(evt, iconTrack, left, metrics) {
        var icon = evt.getIcon();
        icon = icon !== null ? icon : metrics.icon;

        var middle = metrics.trackOffset + iconTrack * metrics.trackIncrement + metrics.trackHeight / 2;
        var top = Math.round(middle - metrics.iconHeight / 2);

        var img = SimileAjax.Graphics.createTranslucentImage(icon);
        var iconDiv = this._timeline.getDocument().createElement("div");
        iconDiv.style.position = "absolute";
        iconDiv.style.left = left + "px";
        iconDiv.style.top = top + "px";
        iconDiv.appendChild(img);
        iconDiv.style.cursor = "pointer";

        if (evt._title !== null) {
            iconDiv.title = evt._title;
        }

        this._eventLayer.appendChild(iconDiv);

        return {
            left: left,
            top: top,
            width: metrics.iconWidth,
            height: metrics.iconHeight,
            elmt: iconDiv
        };
    };

    Timeline.DetailedEventPainter.prototype._paintEventLabel = function(evt, text, left, top, width, height, theme) {
        var doc = this._timeline.getDocument();

        var labelBackgroundDiv = doc.createElement("div");
        labelBackgroundDiv.style.position = "absolute";
        labelBackgroundDiv.style.left = left + "px";
        labelBackgroundDiv.style.width = width + "px";
        labelBackgroundDiv.style.top = top + "px";
        labelBackgroundDiv.style.height = height + "px";
        labelBackgroundDiv.style.backgroundColor = theme.event.label.backgroundColor;
        SimileAjax.Graphics.setOpacity(labelBackgroundDiv, theme.event.label.backgroundOpacity);
        this._eventLayer.appendChild(labelBackgroundDiv);

        var labelDiv = doc.createElement("div");
        labelDiv.style.position = "absolute";
        labelDiv.style.left = left + "px";
        labelDiv.style.width = width + "px";
        labelDiv.style.top = top + "px";
        labelDiv.innerHTML = text;
        labelDiv.style.cursor = "pointer";

        if (evt._title !== null) {
            labelDiv.title = evt._title;
        }

        var color = evt.getTextColor();
        if (color === null) {
            color = evt.getColor();
        }
        if (color !== null) {
            labelDiv.style.color = color;
        }

        this._eventLayer.appendChild(labelDiv);

        return {
            left: left,
            top: top,
            width: width,
            height: height,
            elmt: labelDiv
        };
    };

    Timeline.DetailedEventPainter.prototype._paintEventTape = function(
        evt, iconTrack, startPixel, endPixel, color, opacity, metrics, theme) {

        var tapeWidth = endPixel - startPixel;
        var tapeHeight = theme.event.tape.height;
        var middle = metrics.trackOffset + iconTrack * metrics.trackIncrement + metrics.trackHeight / 2;
        var top = Math.round(middle - tapeHeight / 2);

        var tapeDiv = this._timeline.getDocument().createElement("div");
        tapeDiv.style.position = "absolute";
        tapeDiv.style.left = startPixel + "px";
        tapeDiv.style.width = tapeWidth + "px";
        tapeDiv.style.top = top + "px";
        tapeDiv.style.height = tapeHeight + "px";
        tapeDiv.style.backgroundColor = color;
        tapeDiv.style.overflow = "hidden";
        tapeDiv.style.cursor = "pointer";

        if (evt._title !== null) {
            tapeDiv.title = evt._title;
        }

        SimileAjax.Graphics.setOpacity(tapeDiv, opacity);

        this._eventLayer.appendChild(tapeDiv);

        return {
            left: startPixel,
            top: top,
            width: tapeWidth,
            height: tapeHeight,
            elmt: tapeDiv
        };
    };

    Timeline.DetailedEventPainter.prototype._createHighlightDiv = function(highlightIndex, dimensions, theme) {
        if (highlightIndex >= 0) {
            var doc = this._timeline.getDocument();
            var eventTheme = theme.event;

            var color = eventTheme.highlightColors[Math.min(highlightIndex, eventTheme.highlightColors.length - 1)];

            var div = doc.createElement("div");
            div.style.position = "absolute";
            div.style.overflow = "hidden";
            div.style.left = (dimensions.left - 2) + "px";
            div.style.width = (dimensions.width + 4) + "px";
            div.style.top = (dimensions.top - 2) + "px";
            div.style.height = (dimensions.height + 4) + "px";
            div.style.background = color;

            this._highlightLayer.appendChild(div);
        }
    };

    Timeline.DetailedEventPainter.prototype._onClickInstantEvent = function(icon, domEvt, evt) {
        var c = SimileAjax.DOM.getPageCoordinates(icon);
        this._showBubble(
            c.left + Math.ceil(icon.offsetWidth / 2),
            c.top + Math.ceil(icon.offsetHeight / 2),
            evt
        );
        this._fireOnSelect(evt.getID());

        domEvt.cancelBubble = true;
        SimileAjax.DOM.cancelEvent(domEvt);
        return false;
    };

    Timeline.DetailedEventPainter.prototype._onClickDurationEvent = function(target, domEvt, evt) {
        var x,
            y,
            c;

        if ("pageX" in domEvt) {
            x = domEvt.pageX;
            y = domEvt.pageY;
        } else {
            c = SimileAjax.DOM.getPageCoordinates(target);
            x = domEvt.offsetX + c.left;
            y = domEvt.offsetY + c.top;
        }

        this._showBubble(x, y, evt);
        this._fireOnSelect(evt.getID());

        domEvt.cancelBubble = true;
        SimileAjax.DOM.cancelEvent(domEvt);
        return false;
    };

    Timeline.DetailedEventPainter.prototype.showBubble = function(evt) {
        var elmt = this._eventIdToElmt[evt.getID()];
        if (elmt) {
            var c = SimileAjax.DOM.getPageCoordinates(elmt);
            this._showBubble(c.left + elmt.offsetWidth / 2, c.top + elmt.offsetHeight / 2, evt);
        }
    };

    Timeline.DetailedEventPainter.prototype._showBubble = function(x, y, evt) {
        var div = document.createElement("div");
        var themeBubble = this._params.theme.event.bubble;
        evt.fillInfoBubble(div, this._params.theme, this._band.getLabeller());

        SimileAjax.WindowManager.cancelPopups();
        SimileAjax.Graphics.createBubbleForContentAndPoint(div, x, y,
            themeBubble.width, null, themeBubble.maxHeight);
    };

    Timeline.DetailedEventPainter.prototype._fireOnSelect = function(eventID) {
        for (var i = 0; i < this._onSelectListeners.length; i++) {
            this._onSelectListeners[i](eventID);
        }
    };
}());

(function() {
    'use strict';

    /*==================================================
     *  Overview Event Painter
     *==================================================
     */

    Timeline.OverviewEventPainter = function(params) {
        this._params = params;
        this._onSelectListeners = [];

        this._filterMatcher = null;
        this._highlightMatcher = null;
    };

    Timeline.OverviewEventPainter.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;

        this._eventLayer = null;
        this._highlightLayer = null;
    };

    Timeline.OverviewEventPainter.prototype.getType = function() {
        return 'overview';
    };

    Timeline.OverviewEventPainter.prototype.addOnSelectListener = function(listener) {
        this._onSelectListeners.push(listener);
    };

    Timeline.OverviewEventPainter.prototype.removeOnSelectListener = function(listener) {
        for (var i = 0; i < this._onSelectListeners.length; i++) {
            if (this._onSelectListeners[i] === listener) {
                this._onSelectListeners.splice(i, 1);
                break;
            }
        }
    };

    Timeline.OverviewEventPainter.prototype.getFilterMatcher = function() {
        return this._filterMatcher;
    };

    Timeline.OverviewEventPainter.prototype.setFilterMatcher = function(filterMatcher) {
        this._filterMatcher = filterMatcher;
    };

    Timeline.OverviewEventPainter.prototype.getHighlightMatcher = function() {
        return this._highlightMatcher;
    };

    Timeline.OverviewEventPainter.prototype.setHighlightMatcher = function(highlightMatcher) {
        this._highlightMatcher = highlightMatcher;
    };

    Timeline.OverviewEventPainter.prototype.paint = function() {
        var eventSource = this._band.getEventSource();
        if (eventSource === null || eventSource === undefined) {
            return;
        }

        this._prepareForPainting();

        var eventTheme = this._params.theme.event;
        var metrics = {
            trackOffset: eventTheme.overviewTrack.offset,
            trackHeight: eventTheme.overviewTrack.height,
            trackGap: eventTheme.overviewTrack.gap,
            trackIncrement: eventTheme.overviewTrack.height + eventTheme.overviewTrack.gap
        };

        var minDate = this._band.getMinDate();
        var maxDate = this._band.getMaxDate();

        var filterMatcher = (this._filterMatcher !== null) ?
            this._filterMatcher :
            function() {
                return true;
            };

        var highlightMatcher = (this._highlightMatcher !== null) ?
            this._highlightMatcher :
            function() {
                return -1;
            };

        var iterator = eventSource.getEventReverseIterator(minDate, maxDate);
        while (iterator.hasNext()) {
            var evt = iterator.next();
            if (filterMatcher(evt)) {
                this.paintEvent(evt, metrics, this._params.theme, highlightMatcher(evt));
            }
        }

        this._highlightLayer.style.display = "block";
        this._eventLayer.style.display = "block";
        // update the band object for max number of tracks in this section of the ether
        this._band.updateEventTrackInfo(this._tracks.length, metrics.trackIncrement);
    };

    Timeline.OverviewEventPainter.prototype.softPaint = function() {};

    Timeline.OverviewEventPainter.prototype._prepareForPainting = function() {
        var band = this._band;

        this._tracks = [];

        if (this._highlightLayer !== null) {
            band.removeLayerDiv(this._highlightLayer);
        }

        this._highlightLayer = band.createLayerDiv(105, "timeline-band-highlights");
        this._highlightLayer.style.display = "none";

        if (this._eventLayer !== null) {
            band.removeLayerDiv(this._eventLayer);
        }
        this._eventLayer = band.createLayerDiv(110, "timeline-band-events");
        this._eventLayer.style.display = "none";
    };

    Timeline.OverviewEventPainter.prototype.paintEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isInstant()) {
            this.paintInstantEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintDurationEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.OverviewEventPainter.prototype.paintInstantEvent = function(evt, metrics, theme, highlightIndex) {
        var startDate = evt.getStart();
        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));

        var color = evt.getColor(),
            klassName = evt.getClassName();
        if (klassName) {
            color = null;
        } else {
            color = color !== null ? color : theme.event.duration.color;
        }

        var tickElmtData = this._paintEventTick(evt, startPixel, color, 100, metrics, theme);

        this._createHighlightDiv(highlightIndex, tickElmtData, theme);
    };

    Timeline.OverviewEventPainter.prototype.paintDurationEvent = function(evt, metrics, theme, highlightIndex) {
        var latestStartDate = evt.getLatestStart();
        var earliestEndDate = evt.getEarliestEnd();

        var latestStartPixel = Math.round(this._band.dateToPixelOffset(latestStartDate));
        var earliestEndPixel = Math.round(this._band.dateToPixelOffset(earliestEndDate));

        var tapeTrack = 0;
        for (; tapeTrack < this._tracks.length; tapeTrack++) {
            if (earliestEndPixel < this._tracks[tapeTrack]) {
                break;
            }
        }
        this._tracks[tapeTrack] = earliestEndPixel;

        var color = evt.getColor(),
            klassName = evt.getClassName();
        if (klassName) {
            color = null;
        } else {
            color = color !== null ? color : theme.event.duration.color;
        }

        var tapeElmtData = this._paintEventTape(evt, tapeTrack, latestStartPixel, earliestEndPixel,
            color, 100, metrics, theme, klassName);

        this._createHighlightDiv(highlightIndex, tapeElmtData, theme);
    };

    Timeline.OverviewEventPainter.prototype._paintEventTape = function(
        evt, track, left, right, color, opacity, metrics, theme, klassName) {

        var top = metrics.trackOffset + track * metrics.trackIncrement;
        var width = right - left;
        var height = metrics.trackHeight;

        var tapeDiv = this._timeline.getDocument().createElement("div");
        tapeDiv.className = 'timeline-small-event-tape';
        if (klassName) {
            tapeDiv.className += ' small-' + klassName;
        }
        tapeDiv.style.left = left + "px";
        tapeDiv.style.width = width + "px";
        tapeDiv.style.top = top + "px";
        tapeDiv.style.height = height + "px";

        if (color) {
            tapeDiv.style.backgroundColor = color; // set color here if defined by event. Else use css
        }

        if (opacity < 100) {
            SimileAjax.Graphics.setOpacity(tapeDiv, opacity);
        }

        this._eventLayer.appendChild(tapeDiv);

        return {
            left: left,
            top: top,
            width: width,
            height: height,
            elmt: tapeDiv
        };
    };

    Timeline.OverviewEventPainter.prototype._paintEventTick = function(
        evt, left, color, opacity, metrics, theme) {

        var height = theme.event.overviewTrack.tickHeight;
        var top = metrics.trackOffset - height;
        var width = 1;

        var tickDiv = this._timeline.getDocument().createElement("div");
        tickDiv.className = 'timeline-small-event-icon';
        tickDiv.style.left = left + "px";
        tickDiv.style.top = top + "px";

        var klassName = evt.getClassName();
        if (klassName) {
            tickDiv.className += ' small-' + klassName;
        }

        if (opacity < 100) {
            SimileAjax.Graphics.setOpacity(tickDiv, opacity);
        }

        this._eventLayer.appendChild(tickDiv);

        return {
            left: left,
            top: top,
            width: width,
            height: height,
            elmt: tickDiv
        };
    };

    Timeline.OverviewEventPainter.prototype._createHighlightDiv = function(highlightIndex, dimensions, theme) {
        if (highlightIndex >= 0) {
            var doc = this._timeline.getDocument();
            var eventTheme = theme.event;

            var color = eventTheme.highlightColors[Math.min(highlightIndex, eventTheme.highlightColors.length - 1)];

            var div = doc.createElement("div");
            div.style.position = "absolute";
            div.style.overflow = "hidden";
            div.style.left = (dimensions.left - 1) + "px";
            div.style.width = (dimensions.width + 2) + "px";
            div.style.top = (dimensions.top - 1) + "px";
            div.style.height = (dimensions.height + 2) + "px";
            div.style.background = color;

            this._highlightLayer.appendChild(div);
        }
    };

    Timeline.OverviewEventPainter.prototype.showBubble = function() {
        // not implemented
    };

}());

(function() {
    'use strict';
    /*==================================================
     *  Original Event Painter
     *==================================================
     */

    Timeline.CompactEventPainter = function(params) {
        this._params = params;
        this._onSelectListeners = [];

        this._filterMatcher = null;
        this._highlightMatcher = null;
        this._frc = null;

        this._eventIdToElmt = {};
    };

    Timeline.CompactEventPainter.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;

        this._backLayer = null;
        this._eventLayer = null;
        this._lineLayer = null;
        this._highlightLayer = null;

        this._eventIdToElmt = null;
    };

    Timeline.CompactEventPainter.prototype.addOnSelectListener = function(listener) {
        this._onSelectListeners.push(listener);
    };

    Timeline.CompactEventPainter.prototype.removeOnSelectListener = function(listener) {
        for (var i = 0; i < this._onSelectListeners.length; i++) {
            if (this._onSelectListeners[i] === listener) {
                this._onSelectListeners.splice(i, 1);
                break;
            }
        }
    };

    Timeline.CompactEventPainter.prototype.getFilterMatcher = function() {
        return this._filterMatcher;
    };

    Timeline.CompactEventPainter.prototype.setFilterMatcher = function(filterMatcher) {
        this._filterMatcher = filterMatcher;
    };

    Timeline.CompactEventPainter.prototype.getHighlightMatcher = function() {
        return this._highlightMatcher;
    };

    Timeline.CompactEventPainter.prototype.setHighlightMatcher = function(highlightMatcher) {
        this._highlightMatcher = highlightMatcher;
    };

    Timeline.CompactEventPainter.prototype.paint = function() {
        var eventSource = this._band.getEventSource();
        if (eventSource === null) {
            return;
        }

        this._eventIdToElmt = {};
        this._prepareForPainting();

        var theme = this._params.theme;
        var eventTheme = theme.event;

        var metrics = {
            trackOffset: "trackOffset" in this._params ? this._params.trackOffset : 10,
            trackHeight: "trackHeight" in this._params ? this._params.trackHeight : 10,

            tapeHeight: theme.event.tape.height,
            tapeBottomMargin: "tapeBottomMargin" in this._params ? this._params.tapeBottomMargin : 2,

            labelBottomMargin: "labelBottomMargin" in this._params ? this._params.labelBottomMargin : 5,
            labelRightMargin: "labelRightMargin" in this._params ? this._params.labelRightMargin : 5,

            defaultIcon: eventTheme.instant.icon,
            defaultIconWidth: eventTheme.instant.iconWidth,
            defaultIconHeight: eventTheme.instant.iconHeight,

            customIconWidth: "iconWidth" in this._params ? this._params.iconWidth : eventTheme.instant.iconWidth,
            customIconHeight: "iconHeight" in this._params ? this._params.iconHeight : eventTheme.instant.iconHeight,

            iconLabelGap: "iconLabelGap" in this._params ? this._params.iconLabelGap : 2,
            iconBottomMargin: "iconBottomMargin" in this._params ? this._params.iconBottomMargin : 2
        };

        if ("compositeIcon" in this._params) {
            metrics.compositeIcon = this._params.compositeIcon;
            metrics.compositeIconWidth = this._params.compositeIconWidth || metrics.customIconWidth;
            metrics.compositeIconHeight = this._params.compositeIconHeight || metrics.customIconHeight;
        } else {
            metrics.compositeIcon = metrics.defaultIcon;
            metrics.compositeIconWidth = metrics.defaultIconWidth;
            metrics.compositeIconHeight = metrics.defaultIconHeight;
        }

        metrics.defaultStackIcon = "icon" in this._params.stackConcurrentPreciseInstantEvents ?
            this._params.stackConcurrentPreciseInstantEvents.icon : metrics.defaultIcon;
        metrics.defaultStackIconWidth = "iconWidth" in this._params.stackConcurrentPreciseInstantEvents ?
            this._params.stackConcurrentPreciseInstantEvents.iconWidth : metrics.defaultIconWidth;
        metrics.defaultStackIconHeight = "iconHeight" in this._params.stackConcurrentPreciseInstantEvents ?
            this._params.stackConcurrentPreciseInstantEvents.iconHeight : metrics.defaultIconHeight;

        var minDate = this._band.getMinDate();
        var maxDate = this._band.getMaxDate();

        var filterMatcher = (this._filterMatcher !== null) ?
            this._filterMatcher :
            function() {
                return true;
            };

        var highlightMatcher = (this._highlightMatcher !== null) ?
            this._highlightMatcher :
            function() {
                return -1;
            };

        var iterator = eventSource.getEventIterator(minDate, maxDate);

        var stackConcurrentPreciseInstantEvents = "stackConcurrentPreciseInstantEvents" in this._params && typeof this._params.stackConcurrentPreciseInstantEvents === Object;
        var collapseConcurrentPreciseInstantEvents = "collapseConcurrentPreciseInstantEvents" in this._params && this._params.collapseConcurrentPreciseInstantEvents;

        if (collapseConcurrentPreciseInstantEvents || stackConcurrentPreciseInstantEvents) {
            var bufferedEvents = [];
            var previousInstantEvent = null;

            var evt;
            while (iterator.hasNext()) {
                evt = iterator.next();
                if (filterMatcher(evt)) {
                    if (!evt.isInstant() || evt.isImprecise()) {
                        this.paintEvent(evt, metrics, this._params.theme, highlightMatcher(evt));
                    } else if (previousInstantEvent !== null &&
                        previousInstantEvent.getStart().getTime() === evt.getStart().getTime()) {
                        bufferedEvents[bufferedEvents.length - 1].push(evt);
                    } else {
                        bufferedEvents.push([evt]);
                        previousInstantEvent = evt;
                    }
                }
            }

            for (var i = 0; i < bufferedEvents.length; i++) {
                var compositeEvents = bufferedEvents[i];

                if (compositeEvents.length === 1) {
                    this.paintEvent(compositeEvents[0], metrics, this._params.theme, highlightMatcher(evt));
                } else {
                    var match = -1;
                    for (var j = 0; match < 0 && j < compositeEvents.length; j++) {
                        match = highlightMatcher(compositeEvents[j]);
                    }

                    if (stackConcurrentPreciseInstantEvents) {
                        this.paintStackedPreciseInstantEvents(compositeEvents, metrics, this._params.theme, match);
                    } else {
                        this.paintCompositePreciseInstantEvents(compositeEvents, metrics, this._params.theme, match);
                    }
                }
            }
        } else {
            while (iterator.hasNext()) {
                var itEvt = iterator.next();
                if (filterMatcher(itEvt)) {
                    this.paintEvent(itEvt, metrics, this._params.theme, highlightMatcher(itEvt));
                }
            }
        }

        this._highlightLayer.style.display = "block";
        this._lineLayer.style.display = "block";
        this._eventLayer.style.display = "block";
    };

    Timeline.CompactEventPainter.prototype.softPaint = function() {};

    Timeline.CompactEventPainter.prototype._prepareForPainting = function() {
        var band = this._band;

        if (this._backLayer === null) {
            this._backLayer = this._band.createLayerDiv(0, "timeline-band-events");
            this._backLayer.style.visibility = "hidden";

            var eventLabelPrototype = document.createElement("span");
            eventLabelPrototype.className = "timeline-event-label";
            this._backLayer.appendChild(eventLabelPrototype);
            this._frc = SimileAjax.Graphics.getFontRenderingContext(eventLabelPrototype);
        }
        this._frc.update();
        this._tracks = [];

        if (this._highlightLayer !== null) {
            band.removeLayerDiv(this._highlightLayer);
        }
        this._highlightLayer = band.createLayerDiv(105, "timeline-band-highlights");
        this._highlightLayer.style.display = "none";

        if (this._lineLayer !== null) {
            band.removeLayerDiv(this._lineLayer);
        }
        this._lineLayer = band.createLayerDiv(110, "timeline-band-lines");
        this._lineLayer.style.display = "none";

        if (this._eventLayer !== null) {
            band.removeLayerDiv(this._eventLayer);
        }
        this._eventLayer = band.createLayerDiv(115, "timeline-band-events");
        this._eventLayer.style.display = "none";
    };

    Timeline.CompactEventPainter.prototype.paintEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isInstant()) {
            this.paintInstantEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintDurationEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.CompactEventPainter.prototype.paintInstantEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isImprecise()) {
            this.paintImpreciseInstantEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintPreciseInstantEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.CompactEventPainter.prototype.paintDurationEvent = function(evt, metrics, theme, highlightIndex) {
        if (evt.isImprecise()) {
            this.paintImpreciseDurationEvent(evt, metrics, theme, highlightIndex);
        } else {
            this.paintPreciseDurationEvent(evt, metrics, theme, highlightIndex);
        }
    };

    Timeline.CompactEventPainter.prototype.paintPreciseInstantEvent = function(evt, metrics, theme, highlightIndex) {
        var commonData = {
            tooltip: evt.getProperty("tooltip") || evt.getText()
        };

        var iconData = {
            url: evt.getIcon()
        };
        if (iconData.url === null) {
            iconData.url = metrics.defaultIcon;
            iconData.width = metrics.defaultIconWidth;
            iconData.height = metrics.defaultIconHeight;
            iconData.className = "timeline-event-icon-default";
        } else {
            iconData.width = evt.getProperty("iconWidth") || metrics.customIconWidth;
            iconData.height = evt.getProperty("iconHeight") || metrics.customIconHeight;
        }

        var labelData = {
            text: evt.getText(),
            color: evt.getTextColor() || evt.getColor(),
            className: evt.getClassName()
        };

        var result = this.paintTapeIconLabel(
            evt.getStart(),
            commonData,
            null, // no tape data
            iconData,
            labelData,
            metrics,
            theme,
            highlightIndex
        );

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickInstantEvent(result.iconElmtData.elmt, domEvt, evt);
        };
        SimileAjax.DOM.registerEvent(result.iconElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(result.labelElmtData.elmt, "mousedown", clickHandler);

        this._eventIdToElmt[evt.getID()] = result.iconElmtData.elmt;
    };

    Timeline.CompactEventPainter.prototype.paintCompositePreciseInstantEvents = function(events, metrics, theme, highlightIndex) {
        var evt = events[0];

        var tooltips = [];
        for (var i = 0; i < events.length; i++) {
            tooltips.push(events[i].getProperty("tooltip") || events[i].getText());
        }
        var commonData = {
            tooltip: tooltips.join("; ")
        };

        var iconData = {
            url: metrics.compositeIcon,
            width: metrics.compositeIconWidth,
            height: metrics.compositeIconHeight,
            className: "timeline-event-icon-composite"
        };

        var labelData = {
            text: String.substitute(this._params.compositeEventLabelTemplate, [events.length])
        };

        var result = this.paintTapeIconLabel(
            evt.getStart(),
            commonData,
            null, // no tape data
            iconData,
            labelData,
            metrics,
            theme,
            highlightIndex
        );

        var self = this;
        var clickHandler = function(elmt, domEvt) {
            return self._onClickMultiplePreciseInstantEvent(result.iconElmtData.elmt, domEvt, events);
        };

        SimileAjax.DOM.registerEvent(result.iconElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(result.labelElmtData.elmt, "mousedown", clickHandler);

        for (var x = 0; x < events.length; x++) {
            this._eventIdToElmt[events[x].getID()] = result.iconElmtData.elmt;
        }
    };

    Timeline.CompactEventPainter.prototype.paintStackedPreciseInstantEvents = function(events, metrics, theme) {
        var limit = "limit" in this._params.stackConcurrentPreciseInstantEvents ?
            this._params.stackConcurrentPreciseInstantEvents.limit : 10;
        var moreMessageTemplate = "moreMessageTemplate" in this._params.stackConcurrentPreciseInstantEvents ?
            this._params.stackConcurrentPreciseInstantEvents.moreMessageTemplate : "%0 More Events";
        var showMoreMessage = limit <= events.length - 2; // We want at least 2 more events above the limit.
        // Otherwise we'd need the singular case of "1 More Event"

        var band = this._band;
        var getPixelOffset = function(date) {
            return Math.round(band.dateToPixelOffset(date));
        };
        var getIconData = function(evt) {
            var iconData = {
                url: evt.getIcon()
            };
            if (iconData.url === null) {
                iconData.url = metrics.defaultStackIcon;
                iconData.width = metrics.defaultStackIconWidth;
                iconData.height = metrics.defaultStackIconHeight;
                iconData.className = "timeline-event-icon-stack timeline-event-icon-default";
            } else {
                iconData.width = evt.getProperty("iconWidth") || metrics.customIconWidth;
                iconData.height = evt.getProperty("iconHeight") || metrics.customIconHeight;
                iconData.className = "timeline-event-icon-stack";
            }
            return iconData;
        };

        var horizontalIncrement = 5,
            firstIconData = getIconData(events[0]),
            leftIconEdge = 0,
            totalLabelWidth = 0,
            totalLabelHeight = 0,
            totalIconHeight = 0,
            records = [],
            moreMessage,
            moreMessageLabelSize,
            moreMessageLabelLeft,
            moreMessageLabelTop;

        for (var i = 0; i < events.length && (!showMoreMessage || i < limit); i++) {
            var evt = events[i];
            var text = evt.getText();
            var iconData = getIconData(evt);
            var labelSize = this._frc.computeSize(text);
            var record = {
                text: text,
                iconData: iconData,
                labelSize: labelSize,
                iconLeft: firstIconData.width + i * horizontalIncrement - iconData.width
            };
            record.labelLeft = firstIconData.width + i * horizontalIncrement + metrics.iconLabelGap;
            record.top = totalLabelHeight;
            records.push(record);

            leftIconEdge = Math.min(leftIconEdge, record.iconLeft);
            totalLabelHeight += labelSize.height;
            totalLabelWidth = Math.max(totalLabelWidth, record.labelLeft + labelSize.width);
            totalIconHeight = Math.max(totalIconHeight, record.top + iconData.height);
        }
        if (showMoreMessage) {
            moreMessage = String.substitute(moreMessageTemplate, [events.length - limit]);

            moreMessageLabelSize = this._frc.computeSize(moreMessage);
            moreMessageLabelLeft = firstIconData.width + (limit - 1) * horizontalIncrement + metrics.iconLabelGap;
            moreMessageLabelTop = totalLabelHeight;

            totalLabelHeight += moreMessageLabelSize.height;
            totalLabelWidth = Math.max(totalLabelWidth, moreMessageLabelLeft + moreMessageLabelSize.width);
        }
        totalLabelWidth += metrics.labelRightMargin;
        totalLabelHeight += metrics.labelBottomMargin;
        totalIconHeight += metrics.iconBottomMargin;

        var anchorPixel = getPixelOffset(events[0].getStart());
        var newTracks = [];

        var trackCount = Math.ceil(Math.max(totalIconHeight, totalLabelHeight) / metrics.trackHeight);
        var rightIconEdge = firstIconData.width + (events.length - 1) * horizontalIncrement;

        trackCount.forEach(function() {
            newTracks.push({
                start: leftIconEdge,
                end: rightIconEdge
            });
        });

        var labelTrackCount = Math.ceil(totalLabelHeight / metrics.trackHeight);
        for (var x = 0; x < labelTrackCount; x++) {
            var track = newTracks[x];
            track.end = Math.max(track.end, totalLabelWidth);
        }

        var firstTrack = this._fitTracks(anchorPixel, newTracks);
        var verticalPixelOffset = firstTrack * metrics.trackHeight + metrics.trackOffset;

        var iconStackDiv = this._timeline.getDocument().createElement("div");
        iconStackDiv.className = 'timeline-event-icon-stack';
        iconStackDiv.style.position = "absolute";
        iconStackDiv.style.overflow = "visible";
        iconStackDiv.style.left = anchorPixel + "px";
        iconStackDiv.style.top = verticalPixelOffset + "px";
        iconStackDiv.style.width = rightIconEdge + "px";
        iconStackDiv.style.height = totalIconHeight + "px";
        iconStackDiv.innerHTML = "<div style='position: relative'></div>";
        this._eventLayer.appendChild(iconStackDiv);

        var self = this;
        var onMouseOver = function() {
            try {
                var n = parseInt(this.getAttribute("index"));
                var childNodes = iconStackDiv.firstChild.childNodes;
                for (var i = 0; i < childNodes.length; i++) {
                    var child = childNodes[i];
                    if (i === n) {
                        child.style.zIndex = childNodes.length;
                    } else {
                        child.style.zIndex = childNodes.length - i;
                    }
                }
            } catch (e) {}
        };

        var paintEvent = function(index) {
            var record = records[index];
            var evt = events[index];
            var tooltip = evt.getProperty("tooltip") || evt.getText();

            var labelElmtData = self._paintEventLabel({
                    tooltip: tooltip
                }, {
                    text: record.text
                },
                anchorPixel + record.labelLeft,
                verticalPixelOffset + record.top,
                record.labelSize.width,
                record.labelSize.height,
                theme
            );
            labelElmtData.elmt.setAttribute("index", index);
            labelElmtData.elmt.onmouseover = onMouseOver;

            var img = SimileAjax.Graphics.createTranslucentImage(record.iconData.url);
            var iconDiv = self._timeline.getDocument().createElement("div");
            iconDiv.className = 'timeline-event-icon' + ("className" in record.iconData ? (" " + record.iconData.className) : "");
            iconDiv.style.left = record.iconLeft + "px";
            iconDiv.style.top = record.top + "px";
            iconDiv.style.zIndex = (records.length - index);
            iconDiv.appendChild(img);
            iconDiv.setAttribute("index", index);
            iconDiv.onmouseover = onMouseOver;

            iconStackDiv.firstChild.appendChild(iconDiv);

            var clickHandler = function(elmt, domEvt) {
                return self._onClickInstantEvent(labelElmtData.elmt, domEvt, evt);
            };

            SimileAjax.DOM.registerEvent(iconDiv, "mousedown", clickHandler);
            SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

            self._eventIdToElmt[evt.getID()] = iconDiv;
        };
        for (var y = 0; y < records.length; y++) {
            paintEvent(y);
        }

        if (showMoreMessage) {
            var moreEvents = events.slice(limit);
            var moreMessageLabelElmtData = this._paintEventLabel({
                    tooltip: moreMessage
                }, {
                    text: moreMessage
                },
                anchorPixel + moreMessageLabelLeft,
                verticalPixelOffset + moreMessageLabelTop,
                moreMessageLabelSize.width,
                moreMessageLabelSize.height,
                theme
            );

            var moreMessageClickHandler = function(elmt, domEvt) {
                return self._onClickMultiplePreciseInstantEvent(moreMessageLabelElmtData.elmt, domEvt, moreEvents);
            };
            SimileAjax.DOM.registerEvent(moreMessageLabelElmtData.elmt, "mousedown", moreMessageClickHandler);

            moreEvents.forEach(function(moreEvent) {
                this._eventIdToElmt[moreEvent.getID()] = moreMessageLabelElmtData.elmt;
            });
        }
        //this._createHighlightDiv(highlightIndex, iconElmtData, theme);
    };

    Timeline.CompactEventPainter.prototype.paintImpreciseInstantEvent = function(evt, metrics, theme, highlightIndex) {
        var commonData = {
            tooltip: evt.getProperty("tooltip") || evt.getText()
        };

        var tapeData = {
            start: evt.getStart(),
            end: evt.getEnd(),
            latestStart: evt.getLatestStart(),
            earliestEnd: evt.getEarliestEnd(),
            isInstant: true
        };

        var iconData = {
            url: evt.getIcon()
        };
        if (iconData.url === null) {
            iconData = null;
        } else {
            iconData.width = evt.getProperty("iconWidth") || metrics.customIconWidth;
            iconData.height = evt.getProperty("iconHeight") || metrics.customIconHeight;
        }

        var labelData = {
            text: evt.getText(),
            color: evt.getTextColor() || evt.getColor(),
            className: evt.getClassName()
        };

        var result = this.paintTapeIconLabel(
            evt.getStart(),
            commonData,
            tapeData, // no tape data
            iconData,
            labelData,
            metrics,
            theme,
            highlightIndex
        );

        var self = this;
        var clickHandler = iconData !== null ?
            function(elmt, domEvt) {
                return self._onClickInstantEvent(result.iconElmtData.elmt, domEvt, evt);
            } :
            function(elmt, domEvt) {
                return self._onClickInstantEvent(result.labelElmtData.elmt, domEvt, evt);
            };

        SimileAjax.DOM.registerEvent(result.labelElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(result.impreciseTapeElmtData.elmt, "mousedown", clickHandler);

        if (iconData !== null) {
            SimileAjax.DOM.registerEvent(result.iconElmtData.elmt, "mousedown", clickHandler);
            this._eventIdToElmt[evt.getID()] = result.iconElmtData.elmt;
        } else {
            this._eventIdToElmt[evt.getID()] = result.labelElmtData.elmt;
        }
    };

    Timeline.CompactEventPainter.prototype.paintPreciseDurationEvent = function(evt, metrics, theme, highlightIndex) {
        var commonData = {
            tooltip: evt.getProperty("tooltip") || evt.getText()
        };

        var tapeData = {
            start: evt.getStart(),
            end: evt.getEnd(),
            isInstant: false
        };

        var iconData = {
            url: evt.getIcon()
        };
        if (iconData.url === null) {
            iconData = null;
        } else {
            iconData.width = evt.getProperty("iconWidth") || metrics.customIconWidth;
            iconData.height = evt.getProperty("iconHeight") || metrics.customIconHeight;
        }

        var labelData = {
            text: evt.getText(),
            color: evt.getTextColor() || evt.getColor(),
            className: evt.getClassName()
        };

        var result = this.paintTapeIconLabel(
            evt.getLatestStart(),
            commonData,
            tapeData, // no tape data
            iconData,
            labelData,
            metrics,
            theme,
            highlightIndex
        );

        var self = this;
        var clickHandler = iconData !== null ?
            function(elmt, domEvt) {
                return self._onClickInstantEvent(result.iconElmtData.elmt, domEvt, evt);
            } :
            function(elmt, domEvt) {
                return self._onClickInstantEvent(result.labelElmtData.elmt, domEvt, evt);
            };

        SimileAjax.DOM.registerEvent(result.labelElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(result.tapeElmtData.elmt, "mousedown", clickHandler);

        if (iconData !== null) {
            SimileAjax.DOM.registerEvent(result.iconElmtData.elmt, "mousedown", clickHandler);
            this._eventIdToElmt[evt.getID()] = result.iconElmtData.elmt;
        } else {
            this._eventIdToElmt[evt.getID()] = result.labelElmtData.elmt;
        }
    };

    Timeline.CompactEventPainter.prototype.paintImpreciseDurationEvent = function(evt, metrics, theme, highlightIndex) {
        var commonData = {
            tooltip: evt.getProperty("tooltip") || evt.getText()
        };

        var tapeData = {
            start: evt.getStart(),
            end: evt.getEnd(),
            latestStart: evt.getLatestStart(),
            earliestEnd: evt.getEarliestEnd(),
            isInstant: false
        };

        var iconData = {
            url: evt.getIcon()
        };
        if (iconData.url === null) {
            iconData = null;
        } else {
            iconData.width = evt.getProperty("iconWidth") || metrics.customIconWidth;
            iconData.height = evt.getProperty("iconHeight") || metrics.customIconHeight;
        }

        var labelData = {
            text: evt.getText(),
            color: evt.getTextColor() || evt.getColor(),
            className: evt.getClassName()
        };

        var result = this.paintTapeIconLabel(
            evt.getLatestStart(),
            commonData,
            tapeData, // no tape data
            iconData,
            labelData,
            metrics,
            theme,
            highlightIndex
        );

        var self = this;
        var clickHandler = iconData !== null ?
            function(elmt, domEvt) {
                return self._onClickInstantEvent(result.iconElmtData.elmt, domEvt, evt);
            } :
            function(elmt, domEvt) {
                return self._onClickInstantEvent(result.labelElmtData.elmt, domEvt, evt);
            };

        SimileAjax.DOM.registerEvent(result.labelElmtData.elmt, "mousedown", clickHandler);
        SimileAjax.DOM.registerEvent(result.tapeElmtData.elmt, "mousedown", clickHandler);

        if (iconData !== null) {
            SimileAjax.DOM.registerEvent(result.iconElmtData.elmt, "mousedown", clickHandler);
            this._eventIdToElmt[evt.getID()] = result.iconElmtData.elmt;
        } else {
            this._eventIdToElmt[evt.getID()] = result.labelElmtData.elmt;
        }
    };

    Timeline.CompactEventPainter.prototype.paintTapeIconLabel = function(
        anchorDate,
        commonData,
        tapeData,
        iconData,
        labelData,
        metrics,
        theme
    ) {
        var band = this._band;
        var getPixelOffset = function(date) {
            return Math.round(band.dateToPixelOffset(date));
        };

        var anchorPixel = getPixelOffset(anchorDate);
        var newTracks = [];

        var tapeHeightOccupied = 0; // how many pixels (vertically) the tape occupies, including bottom margin
        var tapeTrackCount = 0; // how many tracks the tape takes up, usually just 1
        var tapeLastTrackExtraSpace = 0; // on the last track that the tape occupies, how many pixels are left (for icon and label to occupy as well)
        if (tapeData !== null) {
            tapeHeightOccupied = metrics.tapeHeight + metrics.tapeBottomMargin;
            tapeTrackCount = Math.ceil(metrics.tapeHeight / metrics.trackHeight);

            var tapeEndPixelOffset = getPixelOffset(tapeData.end) - anchorPixel;
            var tapeStartPixelOffset = getPixelOffset(tapeData.start) - anchorPixel;

            for (var t = 0; t < tapeTrackCount; t++) {
                newTracks.push({
                    start: tapeStartPixelOffset,
                    end: tapeEndPixelOffset
                });
            }

            tapeLastTrackExtraSpace = metrics.trackHeight - (tapeHeightOccupied % metrics.tapeHeight);
        }

        var iconStartPixelOffset = 0; // where the icon starts compared to the anchor pixel; 
        // this can be negative if the icon is center-aligned around the anchor
        var iconHorizontalSpaceOccupied = 0; // how many pixels the icon take up from the anchor pixel, 
        // including the gap between the icon and the label
        if (iconData !== null) {
            if ("iconAlign" in iconData && iconData.iconAlign === "center") {
                iconStartPixelOffset = -Math.floor(iconData.width / 2);
            }
            iconHorizontalSpaceOccupied = iconStartPixelOffset + iconData.width + metrics.iconLabelGap;

            if (tapeTrackCount > 0) {
                newTracks[tapeTrackCount - 1].end = Math.max(newTracks[tapeTrackCount - 1].end, iconHorizontalSpaceOccupied);
            }

            var iconHeight = iconData.height + metrics.iconBottomMargin + tapeLastTrackExtraSpace;
            while (iconHeight > 0) {
                newTracks.push({
                    start: iconStartPixelOffset,
                    end: iconHorizontalSpaceOccupied
                });
                iconHeight -= metrics.trackHeight;
            }
        }

        var text = labelData.text;
        var labelSize = this._frc.computeSize(text);
        var labelHeight = labelSize.height + metrics.labelBottomMargin + tapeLastTrackExtraSpace;
        var labelEndPixelOffset = iconHorizontalSpaceOccupied + labelSize.width + metrics.labelRightMargin;
        if (tapeTrackCount > 0) {
            newTracks[tapeTrackCount - 1].end = Math.max(newTracks[tapeTrackCount - 1].end, labelEndPixelOffset);
        }
        for (var i = 0; labelHeight > 0; i++) {
            if (tapeTrackCount + i < newTracks.length) {
                var track = newTracks[tapeTrackCount + i];
                track.end = labelEndPixelOffset;
            } else {
                newTracks.push({
                    start: 0,
                    end: labelEndPixelOffset
                });
            }
            labelHeight -= metrics.trackHeight;
        }

        /*
         *  Try to fit the new track on top of the existing tracks, then
         *  render the various elements.
         */
        var firstTrack = this._fitTracks(anchorPixel, newTracks);
        var verticalPixelOffset = firstTrack * metrics.trackHeight + metrics.trackOffset;
        var result = {};

        result.labelElmtData = this._paintEventLabel(
            commonData,
            labelData,
            anchorPixel + iconHorizontalSpaceOccupied,
            verticalPixelOffset + tapeHeightOccupied,
            labelSize.width,
            labelSize.height,
            theme
        );

        if (tapeData !== null) {
            if ("latestStart" in tapeData || "earliestEnd" in tapeData) {
                result.impreciseTapeElmtData = this._paintEventTape(
                    commonData,
                    tapeData,
                    metrics.tapeHeight,
                    verticalPixelOffset,
                    getPixelOffset(tapeData.start),
                    getPixelOffset(tapeData.end),
                    theme.event.duration.impreciseColor,
                    theme.event.duration.impreciseOpacity,
                    metrics,
                    theme
                );
            }
            if (!tapeData.isInstant && "start" in tapeData && "end" in tapeData) {
                result.tapeElmtData = this._paintEventTape(
                    commonData,
                    tapeData,
                    metrics.tapeHeight,
                    verticalPixelOffset,
                    anchorPixel,
                    getPixelOffset("earliestEnd" in tapeData ? tapeData.earliestEnd : tapeData.end),
                    tapeData.color,
                    100,
                    metrics,
                    theme
                );
            }
        }

        if (iconData !== null) {
            result.iconElmtData = this._paintEventIcon(
                commonData,
                iconData,
                verticalPixelOffset + tapeHeightOccupied,
                anchorPixel + iconStartPixelOffset,
                metrics,
                theme
            );
        }
        //this._createHighlightDiv(highlightIndex, iconElmtData, theme);

        return result;
    };

    Timeline.CompactEventPainter.prototype._fitTracks = function(anchorPixel, newTracks) {
        var firstTrack;
        for (firstTrack = 0; firstTrack < this._tracks.length; firstTrack++) {
            var fit = true;
            for (var j = 0; j < newTracks.length && (firstTrack + j) < this._tracks.length; j++) {
                var existingTrack = this._tracks[firstTrack + j];
                var newTrack = newTracks[j];
                if (anchorPixel + newTrack.start < existingTrack) {
                    fit = false;
                    break;
                }
            }

            if (fit) {
                break;
            }
        }
        for (var i = 0; i < newTracks.length; i++) {
            this._tracks[firstTrack + i] = anchorPixel + newTracks[i].end;
        }

        return firstTrack;
    };


    Timeline.CompactEventPainter.prototype._paintEventIcon = function(commonData, iconData, top, left, metrics) {
        var img = SimileAjax.Graphics.createTranslucentImage(iconData.url);
        var iconDiv = this._timeline.getDocument().createElement("div");
        iconDiv.className = 'timeline-event-icon' + ("className" in iconData ? (" " + iconData.className) : "");
        iconDiv.style.left = left + "px";
        iconDiv.style.top = top + "px";
        iconDiv.appendChild(img);

        if ("tooltip" in commonData && typeof commonData.tooltip === "string") {
            iconDiv.title = commonData.tooltip;
        }

        this._eventLayer.appendChild(iconDiv);

        return {
            left: left,
            top: top,
            width: metrics.iconWidth,
            height: metrics.iconHeight,
            elmt: iconDiv
        };
    };

    Timeline.CompactEventPainter.prototype._paintEventLabel = function(commonData, labelData, left, top, width, height) {
        var doc = this._timeline.getDocument();

        var labelDiv = doc.createElement("div");
        labelDiv.className = 'timeline-event-label';

        labelDiv.style.left = left + "px";
        labelDiv.style.width = (width + 1) + "px";
        labelDiv.style.top = top + "px";
        labelDiv.innerHTML = labelData.text;

        if ("tooltip" in commonData && typeof commonData.tooltip === "string") {
            labelDiv.title = commonData.tooltip;
        }
        if ("color" in labelData && typeof labelData.color === "string") {
            labelDiv.style.color = labelData.color;
        }
        if ("className" in labelData && typeof labelData.className === "string") {
            labelDiv.className += ' ' + labelData.className;
        }

        this._eventLayer.appendChild(labelDiv);

        return {
            left: left,
            top: top,
            width: width,
            height: height,
            elmt: labelDiv
        };
    };

    Timeline.CompactEventPainter.prototype._paintEventTape = function(
        commonData, tapeData, height, top, startPixel, endPixel, color, opacity) {

        var width = endPixel - startPixel;

        var tapeDiv = this._timeline.getDocument().createElement("div");
        tapeDiv.className = "timeline-event-tape";

        tapeDiv.style.left = startPixel + "px";
        tapeDiv.style.top = top + "px";
        tapeDiv.style.width = width + "px";
        tapeDiv.style.height = height + "px";

        if ("tooltip" in commonData && typeof commonData.tooltip === "string") {
            tapeDiv.title = commonData.tooltip;
        }
        if (color !== null && typeof tapeData.color === "string") {
            tapeDiv.style.backgroundColor = color;
        }

        if ("backgroundImage" in tapeData && typeof tapeData.backgroundImage === "string") {
            tapeDiv.style.backgroundImage = "url(" + tapeData.backgroundImage + ")";
            tapeDiv.style.backgroundRepeat =
                ("backgroundRepeat" in tapeData && typeof tapeData.backgroundRepeat === "string") ? tapeData.backgroundRepeat : 'repeat';
        }

        SimileAjax.Graphics.setOpacity(tapeDiv, opacity);

        if ("className" in tapeData && typeof tapeData.className === "string") {
            tapeDiv.className += ' ' + tapeData.className;
        }

        this._eventLayer.appendChild(tapeDiv);

        return {
            left: startPixel,
            top: top,
            width: width,
            height: height,
            elmt: tapeDiv
        };
    };

    Timeline.CompactEventPainter.prototype._createHighlightDiv = function(highlightIndex, dimensions) {
        if (highlightIndex >= 0) {
            var doc = this._timeline.getDocument();

            var div = doc.createElement("div");
            div.style.position = "absolute";
            div.style.overflow = "hidden";
            div.style.left = (dimensions.left - 2) + "px";
            div.style.width = (dimensions.width + 4) + "px";
            div.style.top = (dimensions.top - 2) + "px";
            div.style.height = (dimensions.height + 4) + "px";

            this._highlightLayer.appendChild(div);
        }
    };

    Timeline.CompactEventPainter.prototype._onClickMultiplePreciseInstantEvent = function(icon, domEvt, events) {
        var c = SimileAjax.DOM.getPageCoordinates(icon);
        this._showBubble(
            c.left + Math.ceil(icon.offsetWidth / 2),
            c.top + Math.ceil(icon.offsetHeight / 2),
            events
        );

        var ids = [];
        for (var i = 0; i < events.length; i++) {
            ids.push(events[i].getID());
        }
        this._fireOnSelect(ids);

        domEvt.cancelBubble = true;
        SimileAjax.DOM.cancelEvent(domEvt);

        return false;
    };

    Timeline.CompactEventPainter.prototype._onClickInstantEvent = function(icon, domEvt, evt) {
        var c = SimileAjax.DOM.getPageCoordinates(icon);
        this._showBubble(
            c.left + Math.ceil(icon.offsetWidth / 2),
            c.top + Math.ceil(icon.offsetHeight / 2), [evt]
        );
        this._fireOnSelect([evt.getID()]);

        domEvt.cancelBubble = true;
        SimileAjax.DOM.cancelEvent(domEvt);
        return false;
    };

    Timeline.CompactEventPainter.prototype._onClickDurationEvent = function(target, domEvt, evt) {
        var x,
            y,
            c;

        if ("pageX" in domEvt) {
            x = domEvt.pageX;
            y = domEvt.pageY;
        } else {
            c = SimileAjax.DOM.getPageCoordinates(target);
            x = domEvt.offsetX + c.left;
            y = domEvt.offsetY + c.top;
        }

        this._showBubble(x, y, [evt]);
        this._fireOnSelect([evt.getID()]);

        domEvt.cancelBubble = true;
        SimileAjax.DOM.cancelEvent(domEvt);
        return false;
    };

    Timeline.CompactEventPainter.prototype.showBubble = function(evt) {
        var elmt = this._eventIdToElmt[evt.getID()];
        if (elmt) {
            var c = SimileAjax.DOM.getPageCoordinates(elmt);
            this._showBubble(c.left + elmt.offsetWidth / 2, c.top + elmt.offsetHeight / 2, [evt]);
        }
    };

    Timeline.CompactEventPainter.prototype._showBubble = function(x, y, evts) {
        var div = document.createElement("div");

        evts = ("fillInfoBubble" in evts) ? [evts] : evts;
        for (var i = 0; i < evts.length; i++) {
            var div2 = document.createElement("div");
            div.appendChild(div2);

            evts[i].fillInfoBubble(div2, this._params.theme, this._band.getLabeller());
        }

        SimileAjax.WindowManager.cancelPopups();
        SimileAjax.Graphics.createBubbleForContentAndPoint(div, x, y, this._params.theme.event.bubble.width);
    };

    Timeline.CompactEventPainter.prototype._fireOnSelect = function(eventIDs) {
        for (var i = 0; i < this._onSelectListeners.length; i++) {
            this._onSelectListeners[i](eventIDs);
        }
    };
}());

(function() {
    'use strict';

    /*==================================================
     *  Span Highlight Decorator
     *==================================================
     */

    Timeline.SpanHighlightDecorator = function(params) {
        // When evaluating params, test against null. Not "p in params". Testing against
        // null enables caller to explicitly request the default. Testing against "in" means
        // that the param has to be ommitted to get the default.
        if (params.unit === undefined) {
            this._unit = SimileAjax.NativeDateUnit;
        } else {
            this._unit = params.unit;
        }

        this._startDate = (typeof params.startDate === "string") ?
            this._unit.parseFromObject(params.startDate) : params.startDate;

        this._endDate = (typeof params.endDate === "string") ?
            this._unit.parseFromObject(params.endDate) : params.endDate;

        this._startLabel = (params.startLabel !== undefined && params.startLabel !== null) ? params.startLabel: ""; // not null!
        this._endLabel = (params.endLabel !== undefined && params.endLabel !== null) ? params.endLabel: ""; // not null!
        this._isInMiddle = (params.isInMiddle !== undefined && params.isInMiddle !== null) ? params.isInMiddle : false;
        this._color = params.color;
        this._cssClass = params.cssClass !== undefined ? params.cssClass : null;
        this._opacity = params.opacity !== undefined ? params.opacity : 100;
        // Default z is 10, behind everything but background grid.
        // If inFront, then place just behind events, in front of everything else
        this._zIndex = (params.inFront !== undefined && params.inFront) ? 113 : 10;
    };

    Timeline.SpanHighlightDecorator.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;
        this._layerDiv = null;
    };

    Timeline.SpanHighlightDecorator.prototype.paint = function() {
        if (this._layerDiv !== null) {
            this._band.removeLayerDiv(this._layerDiv);
        }
        this._layerDiv = this._band.createLayerDiv(this._zIndex);
        this._layerDiv.setAttribute("name", "span-highlight-decorator"); // for debugging
        this._layerDiv.style.display = "none";

        var minDate = this._band.getMinDate();
        var maxDate = this._band.getMaxDate();

        if (this._unit.compare(this._startDate, maxDate) < 0 &&
            this._unit.compare(this._endDate, minDate) > 0) {

            minDate = this._unit.later(minDate, this._startDate);
            maxDate = this._unit.earlier(maxDate, this._endDate);

            var minPixel = this._band.dateToPixelOffset(minDate);
            var maxPixel = this._band.dateToPixelOffset(maxDate);

            var doc = this._timeline.getDocument();

            var createTable = function() {
                var table = doc.createElement("table");
                table.insertRow(0).insertCell(0);
                return table;
            };

            var div = doc.createElement("div");
            div.className = 'timeline-highlight-decorator';

            if (this._cssClass) {
                div.className += ' ' + this._cssClass;
            }

            if (this._color !== null) {
                div.style.backgroundColor = this._color;
            }

            if (this._opacity < 100) {
                SimileAjax.Graphics.setOpacity(div, this._opacity);
            }

            this._layerDiv.appendChild(div);

            var startCSS;
            var endCSS;

            if (this._isInMiddle) {
                startCSS = "timeline-highlight-label-center timeline-highlight-label-center-start";
                endCSS = "timeline-highlight-label-center timeline-highlight-label-center-end";
            }
            else {
                startCSS = "timeline-highlight-label timeline-highlight-label-start";
                endCSS = "timeline-highlight-label timeline-highlight-label-end";
            }

            var tableStartLabel = createTable();
            tableStartLabel.className = startCSS;
            var tdStart = tableStartLabel.rows[0].cells[0];
            tdStart.innerHTML = this._startLabel;
            if (this._cssClass) {
                tdStart.className = 'label_' + this._cssClass;
            }
            this._layerDiv.appendChild(tableStartLabel);

            var tableEndLabel = createTable();
            tableEndLabel.className = endCSS;
            var tdEnd = tableEndLabel.rows[0].cells[0];
            tdEnd.innerHTML = this._endLabel;
            if (this._cssClass) {
                tdEnd.className = 'label_' + this._cssClass;
            }
            this._layerDiv.appendChild(tableEndLabel);

            if (this._timeline.isHorizontal()) {
                div.style.left = minPixel + "px";
                div.style.width = (maxPixel - minPixel) + "px";

                if (this._isInMiddle) {
                    tableEndLabel.style.right = (this._band.getTotalViewLength() - minPixel) + "px";
                    tableEndLabel.style.width = (this._endLabel.length) + "em";

                    tableStartLabel.style.left = minPixel + "px";
                    tableStartLabel.style.width = (maxPixel - minPixel) + "px";
                }
                else {
                    tableStartLabel.style.right = (this._band.getTotalViewLength() - minPixel) + "px";
                    tableStartLabel.style.width = (this._startLabel.length) + "em";

                    tableEndLabel.style.left = maxPixel + "px";
                    tableEndLabel.style.width = (this._endLabel.length) + "em";
                }
            } else {
                div.style.top = minPixel + "px";
                div.style.height = (maxPixel - minPixel) + "px";

                tableStartLabel.style.bottom = minPixel + "px";
                tableStartLabel.style.height = "1.5px";

                tableEndLabel.style.top = maxPixel + "px";
                tableEndLabel.style.height = "1.5px";
            }
        }
        this._layerDiv.style.display = "block";
    };

    Timeline.SpanHighlightDecorator.prototype.softPaint = function() {};

    /*==================================================
     *  Point Highlight Decorator
     *==================================================
     */

    Timeline.PointHighlightDecorator = function(params) {
        this._unit = params.unit !== undefined ? params.unit : SimileAjax.NativeDateUnit;
        this._date = (typeof params.date === "string") ?
            this._unit.parseFromObject(params.date) : params.date;
        this._width = params.width !== undefined ? params.width : 10;
        // Since the width is used to calculate placements (see minPixel, below), we
        // specify width here, not in css.
        this._color = params.color;
        this._cssClass = params.cssClass !== undefined ? params.cssClass : '';
        this._opacity = params.opacity !== undefined ? params.opacity : 100;
    };

    Timeline.PointHighlightDecorator.prototype.initialize = function(band, timeline) {
        this._band = band;
        this._timeline = timeline;
        this._layerDiv = null;
    };

    Timeline.PointHighlightDecorator.prototype.paint = function() {
        if (this._layerDiv !== null) {
            this._band.removeLayerDiv(this._layerDiv);
        }
        this._layerDiv = this._band.createLayerDiv(10);
        this._layerDiv.setAttribute("name", "span-highlight-decorator"); // for debugging
        this._layerDiv.style.display = "none";

        var minDate = this._band.getMinDate();
        var maxDate = this._band.getMaxDate();

        if (this._unit.compare(this._date, maxDate) < 0 &&
            this._unit.compare(this._date, minDate) > 0) {

            var pixel = this._band.dateToPixelOffset(this._date);
            var minPixel = pixel - Math.round(this._width / 2);

            var doc = this._timeline.getDocument();

            var div = doc.createElement("div");
            div.className = 'timeline-highlight-point-decorator';
            div.className += ' ' + this._cssClass;

            if (this._color !== null) {
                div.style.backgroundColor = this._color;
            }

            if (this._opacity < 100) {
                SimileAjax.Graphics.setOpacity(div, this._opacity);
            }

            this._layerDiv.appendChild(div);

            if (this._timeline.isHorizontal()) {
                div.style.left = minPixel + "px";
                div.style.width = this._width;
            } else {
                div.style.top = minPixel + "px";
                div.style.height = this._width;
            }
        }
        this._layerDiv.style.display = "block";
    };

    Timeline.PointHighlightDecorator.prototype.softPaint = function() {};
}());

(function() {
    'use strict';

    /*==================================================
     *  Default Unit
     *==================================================
     */

    Timeline.NativeDateUnit = {};

    Timeline.NativeDateUnit.createLabeller = function(locale, timeZone) {
        return new Timeline.GregorianDateLabeller(locale, timeZone);
    };

    Timeline.NativeDateUnit.makeDefaultValue = function() {
        return new Date();
    };

    Timeline.NativeDateUnit.cloneValue = function(v) {
        return new Date(v.getTime());
    };

    Timeline.NativeDateUnit.getParser = function(format) {
        if (typeof format === "string") {
            format = format.toLowerCase();
        }
        return (format === "iso8601" || format === "iso 8601") ?
            Timeline.DateTime.parseIso8601DateTime :
            Timeline.DateTime.parseGregorianDateTime;
    };

    Timeline.NativeDateUnit.parseFromObject = function(o) {
        return Timeline.DateTime.parseGregorianDateTime(o);
    };

    Timeline.NativeDateUnit.toNumber = function(v) {
        return v.getTime();
    };

    Timeline.NativeDateUnit.fromNumber = function(n) {
        return new Date(n);
    };

    Timeline.NativeDateUnit.compare = function(v1, v2) {
        var n1, n2;
        if (typeof v1 === "object") {
            n1 = v1.getTime();
        } else {
            n1 = Number(v1);
        }
        if (typeof v2 === "object") {
            n2 = v2.getTime();
        } else {
            n2 = Number(v2);
        }

        return n1 - n2;
    };

    Timeline.NativeDateUnit.earlier = function(v1, v2) {
        return Timeline.NativeDateUnit.compare(v1, v2) < 0 ? v1 : v2;
    };

    Timeline.NativeDateUnit.later = function(v1, v2) {
        return Timeline.NativeDateUnit.compare(v1, v2) > 0 ? v1 : v2;
    };

    Timeline.NativeDateUnit.change = function(v, n) {
        return new Date(v.getTime() + n);
    };
}());

/*==================================================
 *  Localization of labellers.js
 *==================================================
 */

Timeline.GregorianDateLabeller.monthNames["en"] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

Timeline.GregorianDateLabeller.dayNames["en"] = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

/*==================================================
 *  Common localization strings
 *==================================================
 */

Timeline.strings["en"] = {
    wikiLinkLabel: "Discuss"
};
