require('./scripts/main.js');
require('./protocol_query.js');
$ = undefined;
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }
   $ = require('jquery')(window);
});
//require("jquery");
express = require('express');
app=express();

request = require("request");
fs = require('fs');
bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require("./session.js");
Cookies = require( "cookies" );
require('./database.js');

//--------------------------------------------------------------------------------------------

require("./app/file_link.js");
require("./app/directory_article.js");
require("./app/add_term.js");
require("./app/parse_article.js");

// --------------------------------------------------------

/**
 * 寫到記錄檔中
 * @param {string} _msg
 * @returns {undefined}
 */
_write_log = function (_msg) {

    var d = new Date();
    // d is "Sun Oct 13 2013 20:32:01 GMT+0530 (India Standard Time)"
    var datetext = d.toTimeString();
    // datestring is "20:32:01 GMT+0530 (India Standard Time)"
    // Split with ' ' and we get: ["20:32:01", "GMT+0530", "(India", "Standard", "Time)"]
    // Take the first value from array :)
    datetext = datetext.split(' ')[0];

    if (typeof (_msg) === "object") {
        _msg = JSON.stringify(_msg);
    }

    _msg = _msg.split("\n").join("");
    _msg = _msg.split("\r\n").join("");
    _msg = _msg.split("\r").join("");
    //_msg = _msg.substr(0, 50);
    _msg = datetext + " " + _msg;

    console.log(_msg);
    if (fs.existsSync("/tmp")) {
        fs.appendFileSync("/tmp/jieba.log", _msg + "\n", 'utf8');
    }

};

// ----------------------------------------------------------

app.set('port',process.env.PORT || 8000);
var server=app.listen(app.get('port'),function(){
	console.log('Server up: http://localhost:'+app.get('port'));
});
