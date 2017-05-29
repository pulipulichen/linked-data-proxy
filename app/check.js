var DEBUG = {
    
};


// --------------------

var _app_query_no_cache = function (_req, _res, _modules, _queries, _response_id, _callback) {
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
                    //res_display(_res, _output_string, _callback);
                    
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
        
        if (_query !== undefined && match_stopword(_query) === false) {
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
        });
        return;
    }
    else {
        console.log("有要查詢的資料，準備開始進行查詢，總共要查詢的個數有：" + _limit);
    }
    
    for (var _q = 0; _q < _queries.length; _q++) {
        var _query = _queries[_q];
        
        if (_query !== undefined && match_stopword(_query) === false) {
            for (var _i = 0; _i < _modules.length; _i++) {
                var _module = _modules[_i];

                if ($.inArray(_query, _output.data) === -1) {
                    //console.log();
                    launch_proxy[_module](_output, _query, "check");
                }
            }
        }
    }
};

// ---------------------------------------------------------

app.post('/check/:modules', function (_req, _res) {
    if (check_white_list(_req, _res) === false) {
        //console.log("check false");
        return;
    } 
    //console.log("check");
    
    var cookies = new Cookies( _req, _res );
    
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
            
            //console.log("準備建立");
            setTimeout(function () {
                tableCheckResponse.create({"response": "false"}).then(function (_response) {
                    var _response_id = _response.get("id");
                    console.log("response id: " + _response_id);
                    //_req.session.response_id = _response_id + "";
                    cookies.set("response_id", escape(_response_id + ""));
                    res_display(_res, undefined, _callback);
                    _app_query_no_cache(_req, _res, _modules, _queries, _response_id, _callback);
                });
            }, 0);
        }
        else {
            // 有快取的情況
            //_cache = JSON.stringify(_cache);
            //console.log(["post有快取", _cache]);
            //_req.session.response_id = _cache;
            cookies.set("response_id", escape(_cache));
            res_display(_res, _cache, _callback);
        }
    });
});

// -------------------------------

app.get('/check/:modules', function (_req, _res) {
    if (check_white_list(_req, _res) === false) {
        return;
    } 
    //console.log("check get");
    var _callback = get_callback(_req);
    
    //var _response_id = _req.session.response_id;
    var cookies = new Cookies( _req, _res );
    var _response_id = cookies.get("response_id");
    _response_id = unescape(_response_id);
    
    var _output_string = 'false';
    //console.log([_response_id, isNaN(_response_id)]);
    if (typeof (_response_id) === "number" || isNaN(_response_id) === false) {
        _response_id = parseInt(_response_id, 10);
        tableCheckResponse.findOne({where: {id: _response_id}}).then(function (_response) {
            //console.log(_response);
            if (_response !== null) {
                var _output_string = _response.get("response");
            }

            if (_output_string !== 'false') {
                // 表示有資料，準備刪除
                _response.destroy({force: true});
            }
            
            //delete _req.session.check_result;
            res_display(_res, _output_string, _callback);
            //_res.send(_callback + "(OK)");
        });
    }
    else {
        console.log("沒有response_id");
        _output_string = _response_id;
        res_display(_res, _output_string, _callback);
    }
});