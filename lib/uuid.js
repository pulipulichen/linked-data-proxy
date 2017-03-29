var _uuid;
var _referer;
var _referer_host;

var uuid = require('node-uuid');

setup_uuid = function (_req, _res) {
    
    var cookies = new Cookies( _req, _res );
    
    // 設定uuid
    var _uuid;
    console.log(_req.session.uuid);
    if (typeof(cookies.get("ldp_uuid")) === "undefined") {
        _uuid = uuid.v1();
        console.log("set uuid: " + _uuid);
        cookies.set("ldp_uuid", _uuid);
        _req.session.uuid = _uuid;
        console.log("get uuid 1: " + cookies.get("ldp_uuid"));
    }
    else {
        _uuid = cookies.get("ldp_uuid");
        console.log("get uuid: " + _uuid);
    }
    
    // -------------------------
    _referer = _req.headers.referer;
    if (_referer !== undefined) {
        var _url_options = url.parse(_referer);
        _referer_host = _url_options.host;
    }
    else {
        _referer = null;
        _referer_host = null;
    }
};

get_uuid = function () {
    return _uuid;
};

get_referer = function () {
    return _referer;
}

get_referer_host = function () {
    return _referer_host;
}