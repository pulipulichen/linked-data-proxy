var ua = require('universal-analytics');

visitor = ua(CONFIG.ga_track_code);

ua_pageview = function (_proxy, _query, _has_response, _is_cache) {
    if (_has_response === true) {
        _has_response = "/true";
    }
    else {
        _has_response = "/false";
    }
    
    if (_is_cache === true) {
        _is_cache = "/cache";
    }
    else {
        _is_cache = "";
    }
    
    var _page = "/" + _proxy + "/" + _query + _has_response + _is_cache;
    console.log("pageview: " + _page);
    visitor.pageview(_page, _proxy, _query).send();
};