var os = require('os');

get_current_ip = function () {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }

    //console.log(addresses);
    return addresses;
};

init_referer_allow_list = function () {
    var _ips = get_current_ip();

    for (var _i = 0; _i < _ips.length; _i++) {
        var _host = _ips[_i];
        if (CONFIG.port !== 80) {
            _host = _host + ":" + CONFIG.port;
        }
        CONFIG.referer_allow_list.push(_host);
    }

    if (CONFIG.port !== 80) {
        var _list = CONFIG.referer_allow_list;
        for (var _i = 0; _i < _list.length; _i++) {
            if (_list[_i] === "localhost") {
                CONFIG.referer_allow_list.push("localhost:" + CONFIG.port);
            }
            if (_list[_i] === "127.0.0.1") {
                CONFIG.referer_allow_list.push("127.0.0.1:" + CONFIG.port);
            }
        }
    }
};  //var _init_referer_allow_list = function () {
init_referer_allow_list();