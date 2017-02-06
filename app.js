var DEBUG = {
    //display_error: true,
};
// ---------------------------
// 引用固定的函式庫

fs = require('fs');
https = require('https');
url = require('url');
//util = require("util");

var express = require('express');
Cookies = require( "cookies" )
app = express();

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

require("./app/lib.js");
require("./app/index.js");
require("./app/query.js");
require("./app/vote.js");

// -----------------------------
    



        

// ------------------------------------------------------------



// -------------------------------------------------------------

app.listen(CONFIG.port, function () {
    console.log('Startup. Listening on port ' + CONFIG.port + ". http://localhost:" + CONFIG.port + "/");
});

