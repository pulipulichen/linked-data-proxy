// ---------------------------
// 引用固定的函式庫

fs = require('fs');
https = require('https');
url = require('url');
//util = require("util");

var express = require('express');
Cookies = require( "cookies" )
var app = express();

launch_proxy = {};
    
// -----------------------------
// 引用自訂的函式庫
require("./config.js");
require("./web_crawler.js");
require("./lib/module_cache.js");
require("./lib/query_cache.js");
require("./lib/jquery.js");
require("./lib/universal-analytics.js");
require("./lib/vote.js");
require("./lib/uuid.js");
require("./lib/ip.js");

// -----------------------------

var _check_white_list = function (_req, _res) {
    // 檢查白名單是否可以放行
    var _referer = _req.headers.referer;
    //console.log(_referer);
    if (_referer !== undefined) {
        var _url_options = url.parse(_referer);
        var _list = CONFIG.referer_allow_list;
        //console.log(_list);
        if ($.inArray(_url_options.host, _list) === -1) {
            _res.status(403).send({
                message: 'Access Forbidden'
            });
            return false;
        }
    }
    return true;
};

var _modules_mapping = function (_modules) {
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

var _get_callback = function (_req) {
    var _callback = undefined;
    if (typeof(_req.query.callback) === "string") {
        _callback = _req.query.callback;
    }
    return _callback;
};

var _res_display = function (_res, _output_string, _callback) {
    if (_callback !== undefined) {
        _output_string = _callback + "(" + _output_string + ")";
        _res.setHeader('content-type', 'text/javascript');
    }
    else {
        _res.setHeader('content-type', 'text/plain');
    }
    _res.send(_output_string);
};

app.get("/", function (_req, _res) {
    fs.readFile("usage-example.html", 'utf8', function (err, data) {
        _res.send(data);
    });
});

// -----------------------------
    
app.get('/:modules/:query', function (_req, _res) {
    if (_check_white_list(_req, _res) === false) {
        return;
    } 
    
    // ---------------------------------
    
    ua_set_headers(_req, _res);
    setup_uuid(_req, _res);
        
    var _modules = _req.params.modules.split(",");
    var _ori_modules = _modules;
    _modules = _modules_mapping(_modules);
    
    var _query = _req.params.query.trim();
    
    var _callback = _get_callback(_req);
    
    // 記錄一下
    ua_pageview(_ori_modules, _query);

    // ---------------------------------
    // 準備快取
    query_cache_get(_modules, _query, function (_cache) {
        if (_cache === false) {
            // 沒有快取的情況
            _app_query_no_cache(_req, _res, _modules, _query, _callback);
        }
        else {
            // 有快取的情況
            _res_display(_res, _cache, _callback);
        }
    });
    
    // ---------------------------------
    
});

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
            _res_display(_res, _data, _callback);
        },
        display: function (_data) {
            this.data.push(_data);
            this.index++;
            if (this.index === this.limit) {
                var _output_string = this._get_data();
                
                // 記錄在快取中
                query_cache_set(_modules, _query, _output_string, function () {
                    _res_display(_res, _output_string, _callback);
                });
            }
        },
        display_error: function (_module, _query, _error) {
            var _data = {
                module: _module,
                query: _query,
                error: _error,
                priority: -1
            };
            console.log("Error: " + _module + " (" + _query + "): " + _error);
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
        
        var _path = "./proxy_module/" + _module + "/launch_proxy.js";
        if (fs.existsSync(_path)) {
            if (typeof(launch_proxy[_module]) !== "function") {
                require(_path);
                
                if (typeof(launch_proxy[_module]) === "function") {
                    launch_proxy[_module](_output, _query);
                }
                else {
                    _output.display_error(_module, _query, "Module configuration error.");
                }
            }
            else {
                launch_proxy[_module](_output, _query);
            }   
        }
        else {
            //show_error_page(_res, "No proxy found.");
            _output.display_error(_module, _query, "No module found.");
        }
    }
};
        

// ------------------------------------------------------------

app.get('/:modules/:query/:vote', function (_req, _res) {
    if (_check_white_list(_req, _res) === false) {
        return;
    } 
    
    ua_set_headers(_req, _res);
    setup_uuid(_req, _res);
        
    var _modules = _req.params.modules.split(",");
    _modules = _modules_mapping(_modules);
    
    var _query = _req.params.query.trim();
    
    var _callback = _get_callback(_req);
    
    // ----------------
    
    var _score = _req.params.vote;
    if (_score === undefined || isNaN(_score)) {
        _res.status(501).send({
            message: 'Vote error'
        });
        return;
    }
    else {
        _score = parseInt(_score, 10);
    }
    
    // ---------------------------------
    for (var _i = 0; _i < _modules.length; _i++) {
        var _module = _modules[_i];
        set_vote_score(_module, _query, _score);
        
        // 刪除相關的query_cache
        query_cache_remove(_module, _query);
    }
    
    // ---------------------------------
    // 輸出
    
    var _output_string = "1";
    _res_display(_res, _output_string, _callback);
});

// -------------------------------------------------------------

app.listen(CONFIG.port, function () {
    console.log('Startup. Listening on port ' + CONFIG.port + ". http://localhost:" + CONFIG.port + "/");
});

