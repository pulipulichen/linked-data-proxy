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

/**
 * @author 20181222 布丁 pulipuli.chen@gmail.com
 * @param {String[]} _modules 模組名稱
 * @returns {String[]} 對應後的模組名稱
 */
modules_mapping = function (_modules) {
    var _m = [];
    
    // 先建立快取
    if (modules_mapping_alias === null) {
      modules_mapping_alias = {};
      for (var _full_name in launch_proxy) {
        var _alias = _full_name
        if (typeof(launch_proxy[_full_name]['module_alias']) === 'string') {
          var _alias = launch_proxy[_full_name]['module_alias'];
        }
        modules_mapping_alias[_alias] = _full_name
      }
    }
    
    for (var _i = 0; _i < _modules.length; _i++) {
        var _module = _modules[_i].trim();
        
        // 切換別名
        if (typeof(modules_mapping_alias[_module]) === "string") {
            _module = modules_mapping_alias[_module];
        }
        
        // 去除重複的模組
        if ($.inArray(_module, _m) === -1) {
            _m.push((_module));
        }
    }
    _modules = _m;
    
    return _modules;
};

modules_mapping_alias = null;

// -----------------

get_callback = function (_req) {
    var _callback = undefined;
    if (typeof(_req.query.callback) === "string") {
        _callback = _req.query.callback;
    }
    return _callback;
};

// -----------------

res_display = function (_res, _output_string, _callback) {
    
    try {
        _res.header("Access-Control-Allow-Credentials", "true");
        _res.header("Access-Control-Allow-Origin", "*");
        _res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
        _res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");

        if (typeof(_callback) === "object") {
            _callback = get_callback(_callback);
        }

        var _type = typeof(_output_string);

        if (!(_type === "string" || _type === "number" || _type === "object"|| _type === "boolean")) {
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

        if (_callback !== undefined) {
            if (_type === "string" 
                    && _output_string.substr(0,1) !== "{" 
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
    }
    catch (_e) {
        
    }
};

// -----------------

match_stopword = function (_query) {
    _query = _query.trim();
    var _count = _query.length;
    var _match_count = 0;
    
    for (var _i = 0; _i < _count; _i++) {
        var _char = _query.substr(_i, 1).trim();
        if (_char === "") {
            _match_count++;
        }
        else if (CONFIG.stopword.indexOf(_char) > -1) {
            _match_count++;
        }
    }
    
    return (_count === _match_count);
};