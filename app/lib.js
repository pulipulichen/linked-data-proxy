check_white_list = function (_req, _res) {
    // 檢查白名單是否可以放行
    var _referer = _req.headers.referer;
    //console.log(_referer);
    if (_referer !== undefined) {
        var _url_options = url.parse(_referer);
        var _list = CONFIG.referer_allow_list;
        //console.log(_list);
        if ($.inArray(_url_options.host, _list) === -1) {
            console.log('Access Forbidden: ' + _url_options.host);
            _res.status(403).send({
                message: 'Access Forbidden: ' + _url_options.host
            });
            return false;
        }
    }
    return true;
};

// -----------------

modules_mapping = function (_modules) {
    var _m = [];
    for (var _i = 0; _i < _modules.length; _i++) {
        var _module = _modules[_i].trim();
        
        // 切換別名
        if (typeof(CONFIG.module_alias[_module]) === "string") {
            _module = CONFIG.module_alias[_module];
        }
        
        if ($.inArray(_module, _m) === -1) {
            _m.push((_module));
        }
    }
    _modules = _m;
    
    return _modules;
};

// -----------------

get_callback = function (_req) {
    var _callback = undefined;
    if (typeof(_req.query.callback) === "string") {
        _callback = _req.query.callback;
    }
    return _callback;
};

// -----------------

res_display = function (_res, _output_stringaaa, _callback) {
    var _type = typeof(_output_stringaaa);
    if (!(_type === "string" || _type === "number" || _type === "object")) {
        //console.log("No data: " + _type + " (" + _output_stringaaa + ")");
        if (_callback !== undefined) {
            _res.setHeader('content-type', 'text/javascript');
            _res.send(_callback + '()');
        }
        else {
            _res.setHeader('content-type', 'text/plain');
            _res.send("");
        }
        return ;
    }
    
    var _output_string = _output_stringaaa;
    
    if (_callback !== undefined) {
        if (_output_string.substr(0,1) !== "{" 
                && _output_string.substr(0,1) !== "[") {
            _output_string = JSON.stringify(_output_string);
        }
        _output_string = _callback + '(' + _output_string + ')';
        _res.setHeader('content-type', 'text/javascript');
    }
    else {
        _res.setHeader('content-type', 'text/plain');
    }
    _res.send(_output_string);
};

// -----------------