// ---------------------------
// 引用固定的函式庫

fs = require('fs');
https = require('https');
require("./lib/jquery.js");
url = require('url');
//util = require("util");

var express = require('express');
Cookies = require( "cookies" )
var app = express();

launch_proxy = {};
    
// -----------------------------
// 引用自訂的函式庫
require("./config/config.js");
require("./lib/show_error_page.js");
require("./lib/web_crawler.js");
require("./lib/cache.js");
require("./lib/jquery.js");
require("./lib/universal-analytics.js");
// -----------------------------

app.get('/:modules/:query', function (_req, _res) {
    
    // 檢查白名單是否可以放行
    var _referer = _req.headers.referer;
    //console.log(_referer);
    if (_referer !== undefined) {
        var _url_options = url.parse(_referer);
        if ($.inArray(_url_options.host, CONFIG.http_referer_allow_list) === -1) {
            _res.status(403).send({
                message: 'Access Forbidden'
            });
            return;
        }
    }
    
    // ---------------------------------
    
    ua_set_headers(_req, _res);
        
    var _modules = _req.params.modules.split(",");
    var _query = _req.params.query;
    var _callback = undefined;
    if (typeof(_req.query.callback) === "string") {
        _callback = _req.query.callback;
    }
    
    // ---------------------------------
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
    
    // ---------------------------------
    
    var _output = {
        data: {},
        index: 0,
        limit: _modules.length,
        display: function (_module, _data) {
            this.data[_module] = _data;
            this.index++;
            if (this.index === this.limit) {
                var _output_string = JSON.stringify(this.data);
                if (_callback !== undefined) {
                    _output_string = _callback + "(" + _output_string + ")";
                    _res.setHeader('content-type', 'text/javascript');
                }
                else {
                    _res.setHeader('content-type', 'text/plain');
                }
                _res.send(_output_string);
            }
        },
        display_error: function (_module, _query, _error) {
            var _data = {
                //module: _module,
                query: _query,
                error: _error
            };
            console.log("Error: " + _module + " (" + _query + "): " + _error);
            ua_exception(_module, _query, _error);
            this.display(_module, _data);
        },
        display_response: function (_module, _response) {
            if (_response === undefined) {
                _response = null;
            }
            var _data = {
                //module: _module,
                response: _response
            };
            this.display(_module, _data);
        }
    };
    
    // ----------------------------
    // 準備查詢
    
    ua_pageview(_modules, _query);

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
});

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}


// -------------------------------------------------------------

app.listen(CONFIG.port, function () {
  console.log('app listening on port ' + CONFIG.port);
});

