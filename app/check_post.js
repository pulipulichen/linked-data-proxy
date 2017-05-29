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
    //setup_uuid(_req, _res);
    
    var _modules = _req.params.modules.split(",");
    var _ori_modules = _modules;
    _modules = modules_mapping(_modules);
    
    var _query = _req.body.query;
    if (_query === undefined) {
        _query = _req.query;
    }
    
    if (typeof(_query) === "string") {
        _query = _query.trim().split(" ");
    }
    else {
        _query = [];
    }
    var _query2 = [];
    for (var _i = 0; _i < _query.length; _i++) {
        var _q = _query[_i].trim();
        if (_q !== "" && $.inArray(_q, _query2) === -1) {
            _query2.push(_q);
        }
    }
    var _queries = _query2;
    
    if (_queries.length === 0) {
        // 沒有資料
        res_display(_res, '["nodata"]', _callback);
        return;
    }
    
    // 記錄一下
    ua_pageview_check(_ori_modules, _queries);
    
    var _callback = undefined;
    
    // 準備快取
    query_cache_get("check", _modules, _queries, function (_cache) {
        if (_cache === false) {
            if (_queries.length === 0) {
                res_display(_res, [], _callback);
                return;
            }
            
            // 沒有快取的情況
            console.log("沒快取，準備建立資料");
            tableCheckResponse.create({"response": "false"}).then(function (_response) {
                var _response_id = _response.get("id");
                //console.log("response id: " + _response_id);
                //_req.session.response_id = _response_id + "";
                //_req.session.response_cache = undefined;
                //res_display(_res, undefined, _callback);
                _app_query_no_cache_post(_req, _res, _modules, _queries, _response_id, _callback);
            });
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
            
            console.log("有快取");
            res_display(_res, _cache, _callback);
        }
    });
});

// --------------------

var _app_query_no_cache_post = function (_req, _res, _modules, _queries, _response_id, _callback) {
    //console.log("4 記錄在快取中: ");
    
    var _limit = 0;
    
    // ------------------------------------
    
    var _finish_term_check = function (_output_array, _callback) {
        _update_terms_in_check_cache(_output_array, function () {
            _check_terms_existed_in_cache(_queries, function (_queries_known) {
                _callback(JSON.stringify(_queries_known));
            });
        });
    };
    
    var _finish_batch_check = function (_output_string) {
        // 記錄在快取中
        //console.log("2 記錄在快取中: " + _output_string);
        query_cache_set("check", _modules, _queries, _output_string, function () {

            //_req.session.check_result = _output_string;
            //res_display(_res, _output_string, _callback);

            //console.log("準備記錄在快取中: " + _output_string);
            
            tableCheckResponse.update(
                    {"response": _output_string}, 
                    {where: {id: _response_id}})
                .then(function () {
                    res_display(_res, _output_string, _callback);
                    console.log(["記錄在快取中: ", _output_string]);
            });
        });
    };  // var _finish = function (_output_string) {
    
    // ---------------------------------
    
    var _output = {
        data: [],
        index: 0,
        //limit: _limit,
        _get_data: function () {
            return JSON.stringify(this.data);
        },
        get_data_array: function () {
            return this.data;
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
                var _output_array = this.get_data_array();
                _finish_term_check(_output_array, function (_output_string) {
                    _finish_batch_check(_output_string);
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
    
    var _prepare_quesies = function (_queries_unknown, _callback) {
        // 準備查詢
        var _queries2 = [];
        for (var _q = 0; _q < _queries_unknown.length; _q++) {
            var _query = _queries_unknown[_q];

            if (_query !== undefined && match_stopword(_query) === false) {
                for (var _i = 0; _i < _modules.length; _i++) {
                    if ($.inArray(_query, _output.data) === -1) {
                        _limit++;
                        if ($.inArray(_query, _queries2) === -1) {
                            _queries2.push(_query);
                        }
                    }
                }
            }
        }

        if (_limit === 0) {
            console.log(["沒有要查詢的快取資料", _queries.length]);
            _check_terms_existed_in_cache(_queries, function (_queries_known) {
                _finish_batch_check(JSON.stringify(_queries_known));
            });
            return;
        }
        else {
            console.log(["有要查詢的資料，準備開始進行查詢"
                , "總共要查詢的詞彙:" + _queries2.length + "/" + _queries.length, "次數:" + _limit ]);
        }
        
        _callback(_queries2);
    };
    
    var _do_queries = function (_queries) {
        for (var _q = 0; _q < _queries.length; _q++) {
            var _query = _queries[_q];

            for (var _i = 0; _i < _modules.length; _i++) {
                var _module = _modules[_i];

                if ($.inArray(_query, _output.data) === -1) {
                    //console.log();
                    launch_proxy[_module](_output, _query, "check_post");
                }
            }
        }
    };
    
    // ----------------------------
    
    check_term_not_in_cache(_queries, function (_queries_unknown) {
        _init_terms_into_check_cache(_queries_unknown, function () {
            _prepare_quesies(_queries_unknown, function (_queries_unknown) {
                _do_queries(_queries_unknown);
            }); 
        });
    });
        
};
