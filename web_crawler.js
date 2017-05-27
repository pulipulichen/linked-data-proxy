
//var http = require('http');
//var https = require('https');
var http = require('follow-redirects').http;
http.post = require('http-post');
var https = require('follow-redirects').https;
https.post = require('http-post');

var querystring = require('querystring');
var iconv = require('iconv-lite');
var _default_options = CONFIG.web_crawler_default_options;
var request = require('request');
request_promise = require('request-promise');
var FormData = require('form-data');

var opencc = require('node-opencc');

var DEBUG = {
    //chunk: true,
    //content: true,
    //protocol_options: true,
    //post_query: true,
    //display_content: true,
};

web_crawler = function (_output, _options, _mode) {
    
    if (_mode === undefined) {
        _mode = "";
    }
    else {
        _mode = ";" + _mode;
    }
    
    for (var _key in _default_options) {
        if (typeof(_options[_key]) === "undefined") {
            _options[_key] = _default_options[_key];
        }
    }
    
    var _module = _options.module;
    var _query = _options.query;
    var _url_options;
    var _content = "";
    
    // -----------------------
    
    var _retrieve_callback = function(res) {
        var _error = null;

        //console.log(["Status code error: " + res.statusCode, typeof(res.statusCode)]);
        var _allow_status_code = [200, undefined];
        if ($.inArray(res.statusCode, _allow_status_code) === -1) {
            // https://www.wikiwand.com/zh-tw/HTTP%E7%8A%B6%E6%80%81%E7%A0%81
            _content = null;
            _error = "Status code error: " + res.statusCode;
            module_cache_set(_options.url, _content, _error, function () {
                //console.log(2);
                ua_event(_options.module + _mode, _options.query, false, false);
                //_res.send(null);
                _output.display_error(_options.module + _mode, _options.query, _error);
            });
            return;
            // return show_error_page(_res, "Status code error: " + res.statusCode);
        }   //if ($.inArray(res.statusCode, _allow_status_code) === -1) {

        if (_options.encoding !== null && _options.encoding !== "big5") {
            res.setEncoding(_options.encoding);
        }
        
        //console.log(res.body);

        res.on("data", _retrieve_data);
        res.on("end", _retrieve_end); //res.on("end", function () {
        /*
        if (typeof(_options.post_query) === undefined) {
            res.on("data", _retrieve_data);
            res.on("end", _retrieve_end); //res.on("end", function () {
        }
        else {
            res.on("data", function (_chunk) {
                _content = _chunk;
                _content = iconv.decode(_content, "big5");
                _output.test_display(_content);
                return;
                _retrieve_end();
            });
        }
        */
    };  // var _retrieve_callback = function(res) {
    
    // ---------------------------

    var _retrieve_error_callback = function(e) {
        console.log("Got error: " + e.message);
        //show_error_page(_res, e.message);

        _content = null;
        var _error = "get request error: " + e.message;
        module_cache_set(_options.url, _content, _error, function () {
            ua_event(_options.module + _mode, _options.query, false, false);
            //_res.send(null);
            _output.display_error(_module + _mode, _query, _error);
            WEB_CRAWLER_COUNTER--;
            
            //_no_cache();
        });
        return;
    };  // var _retrieve_error_callback = function(e) {
    
    // ---------------------------

    var _retrieve_data = function (_chunk) {
        if (_options.encoding === "big5") {
            _chunk = iconv.decode(new Buffer(_chunk), "big5");
        }
        if (typeof(DEBUG.chunk) !== "undefined") {
            //console.log(_chunk.length);
        }
        //_content = iconv.decode(new Buffer(_content), "big5");
        _content += _chunk;
    };  // var _retrieve_data = function (_chunk) {
    
    // ---------------------------

    var _retrieve_end = function () {
        WEB_CRAWLER_COUNTER--;
        
        
        //var _head_pos = _content.indexOf("<BODY");
        //var _foot_pos = _content.lastIndexOf("</BODY>") + 7;
        //_content = _content.substring(_head_pos, _foot_pos);
        //_output.test_display(_content);
        //return;
        //console.log($(_content).find("table table table[bgcolor='white']:first").length + "a");
        //_output.test_display($(_content).find("table table table[bgcolor='white']:first").text());
        //_output.test_display(_content);
        //console.log("!" + _content.substr(0, 100));
        if (typeof(_content) === "string") {
            if (_content.indexOf("</body>") > -1) {
                _content = _content.substring(_content.indexOf("<body"), _content.lastIndexOf("</body>") + 7);
            }
            else if (_content.indexOf("</BODY>") > -1) {
                _content = _content.substring(_content.indexOf("<BODY"), _content.lastIndexOf("</BODY>") + 7);
            }
        }
        //console.log("v: " + _content);
        //console.log("找完了：" + $(_content).find("a").length + "a");
        //return;
        
        if (typeof(DEBUG.display_content) !== "undefined") {
            _output.test_display(_content);
            return;
        }

        // 先看看是否有找不到資料的訊息
        if (typeof(_options.content_not_found_selector) === "string" 
                && $(_content).find(_options.content_not_found_selector).length > 0) {
            _content = null;
            var _error = "No result: " + _options.content_not_found_selector;
            module_cache_set(_options.url, _content, _error, function () {
                ua_event(_module + _mode, _query, false, false);
                _output.display_error(_module + _mode, _query, _error);
            });
            return;
        }
        else if (typeof(_options.content_not_found_string) === "string" 
                && _content.indexOf(_options.content_not_found_string) > -1) {
            _content = null;
            var _error = "No result: " + _options.content_not_found_string;
            module_cache_set(_options.url, _content, _error, function () {
                ua_event(_module + _mode, _query, false, false);
                _output.display_error(_module + _mode, _query, _error);
            });
            return;
        }
        else if (typeof(_options.content_found_string) === "string" 
                && _content.indexOf(_options.content_found_string) === -1) {
            _content = null;
            var _error = "Result not found: " + _options.content_found_string;
            module_cache_set(_options.url, _content, _error, function () {
                ua_event(_module + _mode, _query, false, false);
                _output.display_error(_module + _mode, _query, _error);
            });
            return;
        }

        // -------------------------
        // 正式開始找資料
        if (typeof(DEBUG.content) !== "undefined") {
            //console.log(_content.length);
            console.log(_content.substring(_content.length-500, _content.length));
        }
        
        if (typeof(_options.process) === "function") {
            _content = _options.process(_content);
        }
        else if (typeof(_options.html_selector) === "string") {
            _content = html_selector(_content, _options.html_selector);
        }
        else if (typeof(_options.text_selector) === "string") {
            _content = text_selector(_content, _options.text_selector);
        }
        else if (typeof(_options.extract_string) === "object") {
            _content = extract_string(_content, _options.extract_string);
        }
        //console.log(content);
        
        if (_content === undefined 
                || _content === "Too many connections"
                || _content.indexOf("Lost connection to MySQL server at") > -1) {
            console.log("ERROR: " + _content);
            _content = "";
        }

        _content = _content.trim();

        if (_content !== "") {
            _retrieve_end_process_content(_content);
        }
        else {
            _selector_not_fount();
        }
    };  // var _retrieve_end = function () {
    
    // ---------------------
    
    var _retrieve_end_process_content = function (_content) {
        if (typeof(_options.post_process) === "function") {
            try {
                _content = _options.post_process(_content);
            }
            catch (_e) {
                console.log("post_process error [" + _options.module + "]: " + _e);
            }
        }

        if (typeof(_options.base_url) === "string") {
            _content = prepend_base_url(_content, _options.base_url);
        }

        // 加入參考網頁
        if (typeof(_options.referer_source) === "string" || typeof(_options.referer_name) === "string") {
            var _name = _options.module;
            if (typeof(_options.referer_name) === "string") {
                _name = _options.referer_name;
            }
            var _referer_source = _options.url;
            if (typeof(_options.referer_source) === "string") {
                _referer_source = _options.referer_source;
            }
            _content = _content + '<div>Reference: <a href="' + _referer_source + '" target="_blank">' + _name + '</a></div>';
        }

        // 轉換成繁體內容
        if (typeof(_options.zhs2zht) === "boolean" && _options.zhs2zht === true) {
            opencc.simplifiedToTraditional(_content).then(function (_content) {
                _set_module_cache(_content);
            });
        }            
        else {
            _set_module_cache(_content);
        }
    };  // var _retrieve_end_process_content = function (_content) {
    
    // ----------------
    
    var _has_cache = function (_cache_response) {
        ua_event(_options.module, _options.query, (_cache_response !== null), true);
        //_res.send(_cache_response);
        //var _priority = 0;
        get_vote_score(_module, _query, function (_priority) {
            _output.display_response(_options.module, _cache_response, _priority, _query);
        });
    };  // var _has_cache = function (_cache_response) {
    
    // ----------------
    
    var _no_cache = function () {
        if (WEB_CRAWLER_COUNTER > CONFIG.multi_request_limit) {
            setTimeout(function () {
                _no_cache();
            }, 1000 * getRandomArbitrary(1,5));
            return;
        }
        WEB_CRAWLER_COUNTER++;
        
        var _protocol_options = build_protocol_options(_options);
                
        var _protocol = http;
        if (_protocol_options.protocol === "https:") {
            _protocol = https;
        }
        _content = "";

        // -------------------------

        if (typeof(DEBUG.protocol_options) !== "undefined") {
            console.log(_protocol_options);
        }
        
        console.log(["準備要搜尋了", JSON.stringify(_protocol_options)]);
        if (_options.method === "get") {
            
            console.log("get " + _options.url);
            if (typeof(_options.enable_follow_redirects) && _options.enable_follow_redirects === true) {
                _protocol.get(_protocol_options, _retrieve_callback)
                        .on('error', _retrieve_error_callback);
            }
            else {
                
                request.get(_options.url, function (_error, _response, _body) {
                    if (!_error) {
                        //console.log('v' + _body);
                        _content = _body;
                        _retrieve_end();
                    }
                    else {
                        _retrieve_error_callback(_error);
                    }
                });
            }
        }
        else {
            if (typeof(DEBUG.post_query) !== "undefined") {
                console.log(_options.post_query);
            }
            if (typeof(DEBUG.protocol_options) !== "undefined") {
                console.log(_protocol_options);
            }
            //console.log(_options.url);
            //var _post_query = querystring.stringify(_options.post_query);
            var _post_query = _options.post_query;
             _protocol.post(_protocol_options, _post_query, _retrieve_callback);
        }
    };  // var _no_cache = function () {
    
    // ---------------------------------
    
    var _set_module_cache = function (_content) {
        module_cache_set(_options.url, _content, function () {
            ua_event(_module + _mode, _query, true, false);
            //_res.send(_content);
            //var _priority = 0;
            get_vote_score(_module, _query, function (_priority) {
                //console.log("_set_module_cache", _query, _content);
                _output.display_response(_module, _content, _priority, _query);
            });
        });
    };  //var _set_module_cache = function (_content) {
    
    // ---------------------------------
    
    var _selector_not_fount = function () {
        _content = null;
        var _error = "Selector not found";
        if (typeof(_options.html_selector) === "string") {
            _error = _error + ": " + _options.html_selector;
        }
        else if (typeof(_options.text_selector) === "string") {
            _error = _error + ": " + _options.text_selector;
        }
        module_cache_set(_options.url, _content, _error, function () {
            ua_event(_module + _mode, _query, false, false);
            _output.display_error(_module + _mode, _query, _error);
        });
    };  // var _selector_not_fount = function () {
    
    // ---------------------------------
    
    module_cache_get(_options.url, function (_cache_response) {
        if (_cache_response !== false) {
            return _has_cache(_cache_response);
        }
        else {
            if (typeof(_options.pre_build_options) === "function") {
                _options.pre_build_options(function () {
                    _no_cache(); 
                });
            }
            else {
                return _no_cache();
            }
        }
    }); //cache_get(_options.url, function (_cache_response) {
    
};  //web_crawler = function (_res, _options) {

WEB_CRAWLER_COUNTER = 0;

// ---------------------------
