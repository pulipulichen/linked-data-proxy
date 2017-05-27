PROTOCOL_QUERY_LOCK = false;
PROTOCOL_QUERY_QUEEN = [];

/**
 * 
 * @param {type} _options = {
 *      "url": "", // 網址
 *      
 * }
 * @param {type} _retrieve_callback
 * @param {type} _retrieve_error_callback
 * @returns {protocol_query}
 */
protocol_query = function(_options, _retrieve_callback, _retrieve_error_callback) {
    if (PROTOCOL_QUERY_LOCK === true) {
        var _o = [JSON.parse(JSON.stringify(_options)), _retrieve_callback, _retrieve_error_callback];
        PROTOCOL_QUERY_QUEEN.push();
        console.log(_o[0]);
        return;
    }
    else {
        console.log("go");
        console.log(_options);
        PROTOCOL_QUERY_LOCK = true;
    }
    
    // ------------------------------------------
    
    if (_retrieve_error_callback === undefined) {
        _retrieve_error_callback = function () {};
    }
    
    var _url_options = url.parse(_options.url);

    if (typeof(_options.method) === "undefined") {
        _options.method = "GET";
    }

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

        res.on("data", function (_chunk) {
            if (_options.encoding === "big5") {
                _chunk = iconv.decode(new Buffer(_chunk), "big5");
            }
            //_content = iconv.decode(new Buffer(_content), "big5");
            _content += _chunk;
        });
        res.on("end", _retrieve_end);
    };  //var _retrieve_process = function (res) {
    
    var _retrieve_end = function () {
        _retrieve_callback(_content);

        // ----------------------------------
        // 呼叫下一個動作

        PROTOCOL_QUERY_LOCK = false;
        if (PROTOCOL_QUERY_QUEEN.length > 0) {
            var _o = PROTOCOL_QUERY_QUEEN.shift();
            protocol_query(_o[0],_o[1],_o[2]);
            console.log("NEXT");
            console.log(_o[0]);
        }
    };

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
        _protocol.post(_protocol_options, _options.post_query, _retrieve_process);
    }
    else {
        var _request = new _protocol.ClientRequest(_protocol_options, _retrieve_process);
        _request.end(JSON.stringify(_options.post_query));
    }
};  //protocol_query