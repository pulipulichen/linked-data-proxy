app.post('/check/:modules', function (_req, _res) {
    if (check_white_list(_req, _res) === false) {
        return;
    } 
    
    ua_set_headers(_req, _res);
    setup_uuid(_req, _res);
    
    var _modules = _req.params.modules.split(",");
    var _ori_modules = _modules;
    _modules = modules_mapping(_modules);
    
    var _query = _req.body.query.trim();
    
    // 記錄一下
    ua_pageview_check(_ori_modules, _query);
    
    var sess = _req.session;
    sess.query = _query;
    _res.send(_query);
    
    // 準備快取
    /*
    query_cache_get("check", _modules, _query, function (_cache) {
        if (_cache === false) {
            // 沒有快取的情況
            _app_query_no_cache(_req, _res, _modules, _query, _callback);
        }
        else {
            // 有快取的情況
            res_display(_res, _cache, _callback);
        }
    });
    */
});

// --------------------

var _app_query_no_cache = function (_req, _res, _modules, _query, _callback) {
    
    var _output = {
        data: [],
        index: 0,
        limit: _modules.length,
        _get_data: function () {
            //return JSON.stringify(this.data);
            
            // 要先將data重新排序
            //var _output = {};
            this.data.sort(function (_a, _b) {
                return (_a.priority < _b.priority);
            });
            return JSON.stringify(this.data);
        },
        test_display: function (_data) {
            res_display(_res, _data, _callback);
        },
        display: function (_data) {
            this.data.push(_data);
            this.index++;
            if (this.index === this.limit) {
                var _output_string = this._get_data();
                
                // 記錄在快取中
                query_cache_set("check", _modules, _query, _output_string, function () {
                    res_display(_res, _output_string, _callback);
                });
            }
        },
        display_error: function (_module, _query, _error) {
            var _data = {
                module: _module,
                priority: -1
            };
            if (CONFIG.query_return_error === true) {
                _data.query = _query;
                _data.error = _error;
            }
            if (typeof(DEBUG.display_error) === "boolean" && DEBUG.display_error === true) {
                console.log("Error: " + _module + " (" + _query + "): " + _error);
            }
            ua_exception(_module, _query, _error);
            this.display(_data);
        },
        display_response: function (_module, _response, _priority) {
            if (_response === undefined) {
                _response = null;
            }
            
            //if (_module === "zh.wikipedia.org.localhost") {
            //    _priority = 1;
            //}
            
            var _data = {
                module: _module,
                response: _response,
                priority: _priority
            };
            this.display(_data);
        }
    };
    
    // ----------------------------
    // 準備查詢
    for (var _i = 0; _i < _modules.length; _i++) {
        var _module = _modules[_i];
        
        if (typeof(launch_proxy[_module]) === "function") {
            launch_proxy[_module](_output, _query);
        }
        else {
            _output.display_error(_module, _query, "Module configuration error.");
        }   
    }
};

// -------------------------------

app.get('/check/:modules', function (_req, _res) {
    if (check_white_list(_req, _res) === false) {
        return;
    } 
    
    var _callback = get_callback(_req);
    
    var sess = _req.session;
    var _output_string = sess.query;
    res_display(_res, _output_string, _callback);
    //_res.send(_callback + "(OK)");
});