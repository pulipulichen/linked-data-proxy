// ---------------------------
// 引用固定的函式庫

fs = require('fs');
https = require('https');
require("./lib/jquery.js");
//util = require("util");

var express = require('express');
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

app.get('/:module/:query', function (_req, _res) {
        
    var _module = _req.params.module;
    var _query = _req.params.query;

    //res.send([_module, _query]);

    var _path = "./proxy_module/" + _module + "/get.js";
    if (fs.existsSync(_path)) {
        require(_path);
        proxy(_res, _query);
    }
    else {
        show_error_page(_res, "No proxy found.");
    }

    /*
    var _cache = {
            date: Date.now(),
            url: "http://blog.pulipuli.info",
            response: "test"
    };

    tableCache.create(_cache).then(function () {
            res.send('Hello World!');
    });
    */
    //res.send(CONFIG.http_referer_allow_list);

});




// -------------------------------------------------------------

app.listen(CONFIG.port, function () {
  console.log('app listening on port ' + CONFIG.port);
});

