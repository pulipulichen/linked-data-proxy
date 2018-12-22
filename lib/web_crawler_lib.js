
strStartsWith = function (str, prefix) {
    return str.indexOf(prefix) === 0;
};

prepend_base_url = function (_content, _base_url) {
    try {
        if (_content.substr(0, 1) === "<") {
            _content = $(_content);
        }
        else {
            _content = $('<div>' + _content + '</div>');
        }
    }
    catch (_e) {
        _content = $('<div>' + _content + '</div>');
    }
    if (_content.length > 1) {
        var _c = $("<div></div>").append(_content);
        _content = _c;
    }
    
    _content.find("a[href]").each(function (_i, _ele) {
        if (!strStartsWith(_ele.href, "http://") && !strStartsWith(_ele.href, "https://") && !strStartsWith(_ele.href, "//")) {
            _ele.href = _base_url + _ele.href;
        }
        _ele.target = "_blank";
    });
    _content.find("img[src]").each(function (_i, _ele) {
        if (!strStartsWith(_ele.src, "http://") && !strStartsWith(_ele.src, "https://") && !strStartsWith(_ele.src, "//")) {
            _ele.src = _base_url + _ele.src;
        }
    });
    return get_outer_html(_content);
};

// --------------------

clone_json = function (_json) {
    var _output = {};
    for (var _key in _json) {
        _output[_key] = _json[_key];
    }
    return _output;
};

web_crawler_extract_string = function (_str, _head_needle, _foot_needle) {
    var _head_pos = _str.indexOf(_head_needle);
    if (_head_pos === -1) {
        _head_pos = 0;
    }
    else {
        _head_pos = _head_pos + _head_needle.length;
    }
    var _foot_pos = _str.indexOf(_foot_needle, _head_pos);
    if (_foot_pos === -1) {
        _foot_pos = _str.length;
    }
    return _str.substring(_head_pos, _foot_pos);
};

iconv_encode = function (_str, _encoding) {
    return iconv.encode(_str, _encoding);
};

extract_string = function (_content, _head, _foot) {
    if (typeof(_foot) === "undefined" && _head.length === 2) {
        _foot = _head[1];
        _head = _head[0];
    }
    
    _content = web_crawler_extract_string(_content, _head, _foot);
    //_content = "<div>" + _content + "</div>";
    return _content;
};

text_selector = function (_content, _selector) {
    /*
    try {
        if (_content.substr(0, 1) === "<") {
            _content = $(_content);
        }
        else {
            _content = $('<div>' + _content + '</div>');
        }
    }
    catch (_e) {
        _content = $('<div>' + _content + '</div>');
    }
    var _ele = _content.find(_selector);
    _content = [];
    for (var _i = 0; _i < _ele.length; _i++) {
        _content.push(_ele.eq(_i).text());
    }
    */
    // const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
    // console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
    
    try {
        if (_content.substr(0, 1) === "<") {
            _content = new JSDOM(_content);
        }
        else {
            _content = new JSDOM('<div>' + _content + '</div>');
        }
    }
    catch (_e) {
        _content = new JSDOM('<div>' + _content + '</div>');
    }
    var _ele = dom.window.document.querySelector(_selector)
    _content = [];
    for (var _i = 0; _i < _ele.length; _i++) {
        _content.push(_ele.eq(_i).textContent);
    }
    _content = _content.join("\n");
    return _content;
};

html_selector = function (_content, _selector) {
    //var ele = $(_content).find(_options.html_selector);
    try {
        if (_content.substr(0, 1) === "<") {
            _content = $(_content);
        }
        else {
            _content = $('<div>' + _content + '</div>');
        }
    }
    catch (_e) {
        _content = $('<div>' + _content + '</div>');
    }
    var ele = _content.find(_selector);
    if (ele.length === 0) {
        //show_error_page(_res, "Selector not found: " + _options.select_html);
        /*
        _content = null;
        var _error = "Selector not found: " + _options.html_selector;
        module_cache_set(_options.url, _content, _error, function () {
            ua_event(_module, _query, false, false);
            _output.display_error(_module, _query, _error);
        });
        return;
        */
       _content = "";
    }
    else if (ele.length === 1) {
        _content = ele.clone().wrap("<div></div>").parent().html();
    }
    else {
        _content = $("<div></div>");
        ele.each(function (i, e) {
           $(e).clone().appendTo(_content);
        });
        _content = _content.html();
    }
    return _content;
};

build_protocol_options = function (_options) {
    var _url_options = url.parse(_options.url);
        
    if (typeof(_options.method) === "undefined") {
        _options.method = "GET";
    }

    var _protocol_options = {
        host: _url_options.host,
        port: _url_options.port,
        path: _url_options.path,
        method: _options.method.toUpperCase(),
        protocol: _url_options.protocol,
        headers: {}
    };

    if (_protocol_options.host === null) {
        _protocol_options.host = "localhost";
    }
    if (_protocol_options.host.indexOf(":") > -1) {
        _protocol_options.host = _protocol_options.host.split(":")[0];
    } 

    if (_protocol_options.port === null) {
        _protocol_options.port = 80;
    }

    if (typeof(_options.user_agent) === "string") {
        _protocol_options.headers["User-Agent"] = _options.user_agent;
    }
    else {
        _protocol_options.headers["user-agent"] = "Mozilla/5.0";
    }
    //_protocol_options.headers["user-agent"] = _protocol_options.headers["User-Agent"];
    
    if (typeof(_options.referer) === "string") {
        _protocol_options.headers["Referer"] = _options.referer;
    }

    if (typeof(_options.headers) === "object") {
        for (var _key in _options.headers) {
            _protocol_options.headers[_key] = _options.headers[_key];
        }
    }
    
    return _protocol_options;
};  //build_protocol_options = function (_options) {

getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
};

// ----------------------------

var opencc = require('node-opencc');

simplifiedToTraditional = function (_content, _callback) {
    if (typeof(_callback) !== "function") {
        return;
    }
    
    try {
        opencc.simplifiedToTraditional(_content).then(function (_content) {
            _callback(_content);
        });
    }
    catch (e) {
        setTimeout(function () {
            simplifiedToTraditional(_content, _callback);
        }, 1000 * getRandomArbitrary(1,10));
    }
};
