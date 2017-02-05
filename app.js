// ---------------------------
// 引用固定的函式庫

fs = require('fs');
https = require('https');
require("./lib/jquery.js");
//util = require("util");

var express = require('express');
Cookies = require( "cookies" )
var app = express();

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
        if ($.inArray(_module, _m) === -1) {
            _m.push((_module));
        }
    }
    _modules = _m;
    
    // ---------------------------------
    
    var _output = {
        data: [],
        index: 0,
        limit: _modules.length,
        display: function (_data) {
            this.data.push(_data);
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
                module: _module,
                query: _query,
                error: _error
            };
            console.log("Error: " + _module + " (" + _query + "): " + _error);
            ua_exception(_module, _query, _error);
            this.display(_data);
        },
        display_response: function (_module, _response) {
            if (_response === undefined) {
                _response = null;
            }
            var _data = {
                module: _module,
                response: _response
            };
            this.display(_data);
        }
    };

    for (var _i = 0; _i < _modules.length; _i++) {
        var _module = _modules[_i];
        
        var _path = "./proxy_module/" + _module + "/launch_proxy.js";
        if (fs.existsSync(_path)) {
            require(_path);
            launch_proxy(_output, _query);
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

