var uuid;

setup_uuid = function (_req, _res) {
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
};

get_uuid = function () {
    return _uuid;
};