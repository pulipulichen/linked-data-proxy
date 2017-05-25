var DEBUG = {
    
};

// -------------------------------

app.post('/check_post/:modules', function (_req, _res) {
    if (check_white_list(_req, _res) === false) {
        //console.log("check post false");
        return;
    } 
    //console.log("check post");
    
    //var cookies = new Cookies( _req, _res );
    
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
    
    if (_queries.length === 0) {
        return "";
    }
    
    // 記錄一下
    ua_pageview_check(_ori_modules, _queries);
    
    var _callback = undefined;
    
    // 準備快取
    query_cache_get("check", _modules, _queries, function (_cache) {
        if (_cache === false) {
            // 沒有快取的情況
            
            //console.log("準備建立");
            setTimeout(function () {
                tableCheckResponse.create({"response": "false"}).then(function (_response) {
                    var _response_id = _response.get("id");
                    //console.log("response id: " + _response_id);
                    //_req.session.response_id = _response_id + "";
                    //_req.session.response_cache = undefined;
                    //res_display(_res, undefined, _callback);
                    _app_query_no_cache_post(_req, _res, _modules, _queries, _response_id, _callback);
                    res_display(_res, undefined, _callback);
                });
            }, 0);
        }
        else {
            // 有快取的情況
            //console.log(["post", JSON.stringify(_cache), typeof(_cache)], _cache, JSON.parse(_cache).join(" "));
            //_req.session.response_id = JSON.stringify(_cache);
            //cookies.set("response_cache", JSON.parse(_cache).join(","));
            //cookies.set("response_cache", escape(_cache));
            //_req.cookies.response_cache = _cache;
            //console.log('Cookies: ', _req.cookies);
            //console.log(["post", cookies.get("response_cache"), escape(_cache)]);
            //console.log(_req.session);
            
            res_display(_res, _cache, _callback);
        }
    });
});

// --------------------

var _app_query_no_cache_post = function (_req, _res, _modules, _queries, _response_id, _callback) {
    //console.log("4 記錄在快取中: ");
    
    var _limit = 0;
    
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
            console.log(this.index + ": " + _data);
            if (_data !== undefined 
                    && $.inArray(_data, this.data) === -1) {
                
                this.data.push(_data);
            }
            this.index++;
            //console.log("3 記錄在快取中: " + _output_string);
            if (this.index === _limit) {
                var _output_string = this._get_data();
                
                // 記錄在快取中
                //console.log("2 記錄在快取中: " + _output_string);
                query_cache_set("check", _modules, _queries, _output_string, function () {
                    
                    //_req.session.check_result = _output_string;
                    res_display(_res, _output_string, _callback);
                    
                    //console.log("準備記錄在快取中: " + _output_string);
                    tableCheckResponse.update({"response": _output_string}, {where: {id: _response_id}}).then(function () {
                        console.log("記錄在快取中: " + _output_string);
                    });
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
        
        if (_query !== undefined && CONFIG.stopword.indexOf(_query) === -1) {
            for (var _i = 0; _i < _modules.length; _i++) {
                if ($.inArray(_query, _output.data) === -1) {
                    _limit++;
                }
            }
        }
    }
    
    if (_limit === 0) {
        tableCheckResponse.update({"response": '["nodata"]'}, {where: {id: _response_id}}).then(function () {
            console.log("記錄空字串在快取中");
            res_display(_res, "nodata", _callback);
        });
        return;
    }
    
    for (var _q = 0; _q < _queries.length; _q++) {
        var _query = _queries[_q];
        
        var _pass = true;
        if (_query === undefined) {
            _pass = false;
        }
        else if (CONFIG.stopword.indexOf(_query) > -1) {
            _pass = false;
        }
        else if (_query.length > 1 && CONFIG.stopword.indexOf(_query.substr(0.1)) > -1 ) {
            _pass = false;
        }
        
        if (_pass) {
            for (var _i = 0; _i < _modules.length; _i++) {
                var _module = _modules[_i];

                if ($.inArray(_query, _output.data) === -1) {
                    //console.log();
                    launch_proxy[_module](_output, _query, "check_post");
                }
            }
        }
    }
};
