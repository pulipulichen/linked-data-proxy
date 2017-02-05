/**
 * 說明universal-analytics: https://github.com/peaksandpies/universal-analytics
 * 參考數值 https://github.com/peaksandpies/universal-analytics/blob/master/AcceptableParams.md
 *
 * GA: https://analytics.google.com/analytics/web/#report/defaultid/a46464710w135478152p139632692/
 * GA即時: https://analytics.google.com/analytics/web/#realtime/rt-content/a46464710w135478152p139632692/
 */
var ua = require('universal-analytics');
var uuid = require('node-uuid');

// ----------------------------------------

var visitor;
var _headers;
var _connection;
var _uuid;

ua_set_headers = function (_req, _res) {
    _headers = _req.headers;
    //console.log(_headers);
    _connection = _req.connection;
    //console.log(_connection);
    
    var cookies = new Cookies( _req, _res );
    
    // 設定uuid
    if (typeof(cookies.get("ldp_uuid")) === "undefined") {
        _uuid = uuid.v1();
        console.log("set uuid: " + _uuid);
        cookies.set("ldp_uuid", _uuid);
    }
    else {
        _uuid = cookies.get("ldp_uuid");
    }
    
    
    visitor = ua(CONFIG.ga_track_code, _uuid);
};

// -----------------------------
var _build_parameters = function (_module, _query, _has_response, _is_cache) {
    if (_has_response === undefined) {
        _has_response = "";
    }
    else if (_has_response === true) {
        _has_response = "/true";
    }
    else {
        _has_response = "/false";
    }
    
    if (_is_cache === undefined) {
        _is_cache = "";
    }
    else if (_is_cache === true) {
        _is_cache = "/cache";
    }
    else {
        _is_cache = "";
    }
    
    if (typeof(_module) === "object") {
        _module = _module.join(",");
    }
    
    var _page = "/" + _module + "/" + _query + _has_response + _is_cache;
    
    var _el = "cached";
    if (_is_cache === false) {
        _el = null;
    }
    var _ev = 1;
    if (_has_response === false) {
        _ev = 0;
    }
    
    //visitor.pageview(_page, _module, _query).send();
    var _parameters = {
        "dp": _page,
        "dt": _query,
        "dh": _module,
        "ec": _module,
        "ea": _query,
        "el": _el, // 是否已經cached
        "ev": _ev    // 是否有查到資料
    };
    
    if (typeof(_headers.referer) === "string") {
        _parameters["dr"] = _headers.referer;
    }
    if (typeof(_headers["user-agent"]) === "string") {
        _parameters["ua"] = _headers["user-agent"];
    }
    if (typeof(_headers["accept-language"]) === "string") {
        _parameters["ul"] = _headers["accept-language"];
    }
    if (typeof(_connection["remoteAddress"]) === "string") {
        _parameters["aip"] = _connection["remoteAddress"];
    }
    return _parameters;
};


ua_pageview = function (_module, _query, _has_response, _is_cache) {
    var _parameters = _build_parameters(_module, _query, _has_response, _is_cache);
    console.log("ua_pageview: " + _parameters.dp);
    visitor.pageview(_parameters).send();
};

ua_event = function (_module, _query, _has_response, _is_cache) {
    var _parameters = _build_parameters(_module, _query, _has_response, _is_cache);
    console.log("ua_event: " + _parameters.dp);
    visitor.event(_parameters).send();
};

ua_exception = function (_module, _query, _error) {
    var _description = _module + " (" + _query + "): " + _error;
    visitor.exception(_description).send();
};