var DEBUG = {
    
};

app.post('/check/:modules', function (_req, _res) {
    if (check_white_list(_req, _res) === false) {
        return;
    } 
    //console.log("check post");
    
    ua_set_headers(_req, _res);
    setup_uuid(_req, _res);
    
    var _modules = _req.params.modules.split(",");
    var _ori_modules = _modules;
    _modules = modules_mapping(_modules);
    
    var _query = _req.body.query.trim().split(" ");
    var _query2 = [];
    for (var _i = 0; _i < _query.length; _i++) {
        var _q = _query[_i].trim();
        if (_q !== "" && $.inArray(_q, _query2) === -1) {
            _query2.push(_q);
        }
    }
    var _queries = _query2;
    
    // 記錄一下
    ua_pageview_check(_ori_modules, _queries);
    
    var _callback = undefined;
    
    // 準備快取
    query_cache_get("check", _modules, _queries, function (_cache) {
        if (_cache === false) {
            // 沒有快取的情況
            _app_query_no_cache(_req, _res, _modules, _queries, _callback);
        }
        else {
            // 有快取的情況
            res_display(_res, _cache, _callback);
        }
    });
});

// --------------------

var _app_query_no_cache = function (_req, _res, _modules, _queries, _callback) {
    
    
    //console.log("4 記錄在快取中: ");
    var _output = {
        data: [],
        index: 0,
        limit: _modules.length*_queries.length,
        _get_data: function () {
            return JSON.stringify(this.data);
        },
        test_display: function (_data) {
            res_display(_res, _data, _callback);
        },
        display: function (_data) {
            if (_data !== undefined 
                    && $.inArray(_data, this.data) === -1) {
                console.log(_data);
                this.data.push(_data);
            }
            this.index++;
            //console.log("3 記錄在快取中: " + _output_string);
            if (this.index === this.limit) {
                var _output_string = this._get_data();
                
                // 記錄在快取中
                //console.log("2 記錄在快取中: " + _output_string);
                query_cache_set("check", _modules, _queries, _output_string, function () {
                    //console.log("記錄在快取中: " + _output_string);
                    _req.session.check_result = _output_string;
                    res_display(_res, _output_string, _callback);
                });
            }
        },
        display_error: function (_module, _query, _error) {
            if (typeof(DEBUG.display_error) === "boolean" && DEBUG.display_error === true) {
                console.log("Error: " + _module + " (" + _query + "): " + _error);
            }
            ua_exception(_module, _query, _error);
            this.display();
        },
        display_response: function (_module, _response, _priority, _query) {
            if (_response === undefined) {
                _response = null;
            }
            //console.log("display_response", _query);
            this.display(_query);
        }
    };
    
    // ----------------------------
    // 準備查詢
    for (var _q = 0; _q < _queries.length; _q++) {
        var _query = _queries[_q];
        for (var _i = 0; _i < _modules.length; _i++) {
            var _module = _modules[_i];
            
            if ($.inArray(_query, _output.data) === -1) {
                console.log();
                launch_proxy[_module](_output, _query);
            }
        }
    }
};

// -------------------------------

app.get('/check/:modules', function (_req, _res) {
    if (check_white_list(_req, _res) === false) {
        return;
    } 
    //console.log("check get");
    var _callback = get_callback(_req);
    
    var _output_string = _req.session.check_result;
    //delete _req.session.check_result;
    res_display(_res, _output_string, _callback);
    //_res.send(_callback + "(OK)");
});