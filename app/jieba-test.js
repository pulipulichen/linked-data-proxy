var http = require('follow-redirects').http;
http.post = require('http-post');
var https = require('follow-redirects').https;
https.post = require('http-post');

var protocol_query = function(_options, _retrieve_callback, _retrieve_error_callback) {
    //console.log(_options);
    
    
    if (_retrieve_error_callback === undefined) {
        _retrieve_error_callback = function () {};
    }
    
    var _url_options = url.parse(_options.url);

    var _protocol_options = {
        host: _url_options.host,
        port: _url_options.port,
        path: _url_options.path,
        method: _options.method.toUpperCase(),
        headers: {}
    };
    
    if (_protocol_options.host === null) {
        _protocol_options.host = "localhost";
    }
    if (_protocol_options.host.indexOf(":") > -1) {
        _protocol_options.host = _protocol_options.host.split(":")[0];
    } 
    
    if (_protocol_options.port === null) {
        _protocol_options.port = 80;
    }
    
    //console.log(_protocol_options);

    if (typeof(_options.user_agent) === "string") {
        _protocol_options.headers["User_Agent"] = _options.user_agent;
    }
    if (typeof(_options.referer) === "string") {
        _protocol_options.headers["Referer"] = _options.referer;
    }
    if (typeof(_options.content_type) === "string") {
        _protocol_options.headers["Content-Type"] = _options.content_type;
    }

    var _protocol = http;
    if (_url_options.protocol === "https:") {
        _protocol = https;
    }
    var _content = "";

    // -------------------------
    
    var _retrieve_process = function (res) {
        var _error = null;

        //console.log(["Status code error: " + res.statusCode, typeof(res.statusCode)]);
        var _allow_status_code = [200];
        if ($.inArray(res.statusCode, _allow_status_code) === -1) {
            // https://www.wikiwand.com/zh-tw/HTTP%E7%8A%B6%E6%80%81%E7%A0%81
            _content = null;
            _error = "Status code error: " + res.statusCode;
            return;
            // return show_error_page(_res, "Status code error: " + res.statusCode);
        }   //if ($.inArray(res.statusCode, _allow_status_code) === -1) {

        if (_options.encoding !== null && _options.encoding !== "big5") {
            res.setEncoding(_options.encoding);
        }

        console.log("如何呢？");
        res.on("data", function (_chunk) {
            if (_options.encoding === "big5") {
                _chunk = iconv.decode(new Buffer(_chunk), "big5");
            }
            //_content = iconv.decode(new Buffer(_content), "big5");
            _content += _chunk;
        });
        res.on("end", function () {
            _retrieve_callback(_content);
        });
    };  //var _retrieve_process = function (res) {

    if (typeof(_options.post_query) === undefined) {
        _protocol.get(_protocol_options, _retrieve_process)
                .on('error', _retrieve_error_callback);
    }
    else if (_options.payload === false) {
        /*
        console.log(_protocol_options);
        console.log(querystring.stringify(_options.post_query));
        var req = _protocol.request(_protocol_options, _retrieve_callback);
        req.on('error', _retrieve_error_callback);
        req.write(querystring.stringify(_options.post_query));
        req.end();
        */
        console.log("準備送出");
        console.log(_protocol_options);
        console.log(_options.post_query);
        _protocol.post(_protocol_options, _options.post_query, _retrieve_process);
    }
    else {
        
        console.log("準備送出 2");
        console.log(_protocol_options);
        console.log(_options.post_query);
        var _request = new _protocol.ClientRequest(_protocol_options, _retrieve_process);
        _request.end(JSON.stringify(_options.post_query));
    }
};  //protocol_query

app.get('/jieba-test', function (_req, _res) {
    var URL = "http://127.0.0.1:3000/check_post/wiki,moedict,cbdb,tgaz,cdict";
    var sub_result = (["三四", "三",  "測試"]).join(" ");
    
    console.log("預備傳吧");
    //var _request = new _protocol.ClientRequest(_protocol_options, _retrieve_process);
    protocol_query({
        url: URL,
        method:'POST',
        post_query: {query:sub_result},
        formData: {query:sub_result},
        payload: false
    }, function (body) {
            console.log(["request", body, typeof(body)]);

            if (body === "nodata" || body === null || body === undefined) {
                //body = [];
            }

            if (typeof(body) !== "undefined" ) {
                console.log("ok");
            }
            else{
                console.log(["request no data", body]);
            }
            
            _res.send(body);
    });
});
