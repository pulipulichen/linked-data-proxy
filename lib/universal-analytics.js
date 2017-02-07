/**
 * 說明universal-analytics: https://github.com/peaksandpies/universal-analytics
 * 參考數值 https://github.com/peaksandpies/universal-analytics/blob/master/AcceptableParams.md
 *
 * GA: https://analytics.google.com/analytics/web/#report/defaultid/a46464710w135478152p139632692/
 * GA即時: https://analytics.google.com/analytics/web/#realtime/rt-content/a46464710w135478152p139632692/
 */
var DEBUG = {
    //pageview: true,
    //event: true
};

var ua = require('universal-analytics');

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
    _uuid = get_uuid();
    
    visitor = ua(CONFIG.ga_track_code, _uuid);
    visitor.set(CONFIG.ga_user_id_dimension, _uuid);
};

// -----------------------------
var _build_pageview_parameters = function (_module, _query, _has_response, _is_cache) {
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
    
    //visitor.pageview(_page, _module, _query).send();
    var _parameters = {
        "dp": _page,
        "dt": _query,
        "dh": _module,
    };
    
    _parameters = _parameters_append_headers(_parameters);
    
    return _parameters;
};

var _build_event_parameters = function (_module, _query, _has_response, _is_cache) {
    
    
};

var _parameters_append_headers = function (_parameters) {
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
    var _parameters = _build_pageview_parameters(_module, _query, _has_response, _is_cache);
    
    // -------------------
    
    if (typeof(DEBUG.pageview) !== "undefined") {
        console.log("ua_pageview: " + _parameters.dp);
    }
    visitor.pageview(_parameters).send();
};

ua_pageview_check = function (_module, _queries, _has_response, _is_cache) {
    var _query = _queries.join(" ");
    var _parameters = _build_pageview_parameters(_module, _query, _has_response, _is_cache);
    _parameters.dp = "/check/" + _parameters.dp;
    
    // -------------------
    
    if (typeof(DEBUG.pageview) !== "undefined") {
        console.log("ua_pageview: " + _parameters.dp);
    }
    visitor.pageview(_parameters).send();
};

ua_event = function (_module, _query, _has_response, _is_cached) {
    var _el = [];
    
    var _ev = 1;
    if (_has_response === false) {
        _ev = 0;
        _el.push("not_found");
    }
    else {
        _el.push("found");
    }
    
    
    if (_is_cached === true) {
        _el.push("cached");
    }
    
    _el = _el.join("&");
    
    
    //visitor.pageview(_page, _module, _query).send();
    var _parameters = {
        "ec": _module,
        "ea": _query,
        "el": _el, // 是否已經cached
        "ev": _ev    // 是否有查到資料
    };
    
    _parameters = _parameters_append_headers(_parameters);
    
    // ------------------
    
    if (typeof(DEBUG.event) !== "undefined") {
        console.log("ua_event: " + JSON.stringify(_parameters));
    }
    visitor.event(_parameters).send();
};

ua_event_vote = function (_module, _query, _score) {
    
    //visitor.pageview(_page, _module, _query).send();
    var _parameters = {
        "ec": _module,
        "ea": _query,
        "el": "vote",
        "ev": _score    // 是否有查到資料
    };
    
    _parameters = _parameters_append_headers(_parameters);
    
    //console.log("ua_event: " + _parameters.dp);
    visitor.event(_parameters).send();
};

ua_exception = function (_module, _query, _error) {
    var _description = _module + " (" + _query + "): " + _error;
    visitor.exception(_description).send();
};