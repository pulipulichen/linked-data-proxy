
//var http = require('http');
//var https = require('https');
var http = require('follow-redirects').http;
http.post = require('http-post');
var https = require('follow-redirects').https;
https.post = require('http-post');

var iconv = require('iconv-lite');
var _default_options = CONFIG.web_crawler_default_options;

web_crawler = function (_output, _options) {
    for (var _key in _default_options) {
        if (typeof(_options[_key]) === "undefined") {
            _options[_key] = _default_options[_key];
        }
    }
    
    var _module = _options.module;
    var _query = _options.query;
    
    module_cache_get(_options.url, function (_cache_response) {
        if (_cache_response !== false) {
            ua_event(_options.module, _options.query, (_cache_response !== null), true);
            //_res.send(_cache_response);
            //var _priority = 0;
            get_vote_score(_module, _query, function (_priority) {
                _output.display_response(_options.module, _cache_response, _priority);
            });
            return;
        }
        
        var _url_options = url.parse(_options.url);
        
        var _protocol_options = {
            host: _url_options.host,
            port: _url_options.port,
            path: _url_options.path,
            method: _options.method.toUpperCase(),
            headers: {}
        };
        
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

        var _retrieve_callback = function(res) {
            var _error = null;
            
            //console.log(["Status code error: " + res.statusCode, typeof(res.statusCode)]);
            var _allow_status_code = [200];
            if ($.inArray(res.statusCode, _allow_status_code) === -1) {
                // https://www.wikiwand.com/zh-tw/HTTP%E7%8A%B6%E6%80%81%E7%A0%81
                _content = null;
                _error = "Status code error: " + res.statusCode;
                module_cache_set(_options.url, _content, _error, function () {
                    //console.log(2);
                    ua_event(_options.module, _options.query, false, false);
                    //_res.send(null);
                    _output.display_error(_options.module, _options.query, _error);
                });
                return;
                // return show_error_page(_res, "Status code error: " + res.statusCode);
            }   //if ($.inArray(res.statusCode, _allow_status_code) === -1) {
            
            if (_options.encoding !== null) {
                res.setEncoding(_options.encoding);
            }
            
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
        };
        
        var _retrieve_error_callback = function(e) {
            //console.log("Got error: " + e.message);
            //show_error_page(_res, e.message);
            
            var _content = null;
            var _error = "get request error: " + e.message;
            module_cache_set(_options.url, _content, _error, function () {
                ua_event(_options.module, _options.query, false, false);
                //_res.send(null);
                _output.display_error(_module, _query, _error);
            });
            return;
        };
        
        var _retrieve_data = function (_chunk) {
            //_chunk = iconv.decode(_chunk, "big5");
            _content += _chunk;
        };
        
        var _retrieve_end = function () {
            _content = iconv.decode(_content, "big5");
            _output.test_display(_content);
            return;

            // 先看看是否有找不到資料的訊息
            if (typeof(_options.content_not_found_selector) === "string" 
                    && $(_content).find(_options.content_not_found_selector).length > 0) {
                _content = null;
                _error = "Content not found: " + _options.content_not_found_selector;
                module_cache_set(_options.url, _content, _error, function () {
                    ua_event(_module, _query, false, false);
                    _output.display_error(_module, _query, _error);
                });
                return;
            }
            else if (typeof(_options.content_not_found_string) === "string" 
                    && _content.indexOf(_options.content_not_found_string) > -1) {
                _content = null;
                _error = "Content not found: " + _options.content_not_found_string;
                module_cache_set(_options.url, _content, _error, function () {
                    ua_event(_module, _query, false, false);
                    _output.display_error(_module, _query, _error);
                });
                return;
            }

            // -------------------------
            // 正式開始找資料
            if (typeof(_options.process) === "function") {
                _content = _options.process(_content);
            }
            else if (typeof(_options.html_selector) === "string") {
                var ele = $(_content).find(_options.html_selector);
                if (ele.length === 0) {
                    //show_error_page(_res, "Selector not found: " + _options.select_html);
                    _content = null;
                    _error = "Selector not found: " + _options.html_selector;
                    module_cache_set(_options.url, _content, _error, function () {
                        ua_event(_module, _query, false, false);
                        _output.display_error(_module, _query, _error);
                    });
                    return;
                }
                else if (ele.length === 1) {
                    _content = ele.clone().wrap("<div></div>").parent().html();
                }
                else {
                    _content = $("<div></div>");
                    ele.each(function (i, e) {
                       $(e).clone().appendTo(_content);
                    });
                    _content = _content.html();
                }
            }
            else if (typeof(_options.text_selector) === "string") {
                var _ele = $(_content).find(_options.text_selector);
                _content = [];
                for (var _i = 0; _i < _ele.length; _i++) {
                    _content.push(_ele.eq(_i).text());
                }
                _content = _content.join("\n");
            }
            //console.log(content);

            _content = _content.trim();

            if (_content !== "") {
                module_cache_set(_options.url, _content, function () {
                    ua_event(_module, _query, true, false);
                    //_res.send(_content);
                    //var _priority = 0;
                    get_vote_score(_module, _query, function (_priority) {
                        _output.display_response(_module, _content, _priority);
                    });
                });
            }
            else {
                _content = null;
                _error = "Selector not found";
                if (typeof(_options.html_selector) === "string") {
                    _error = _error + ": " + _options.html_selector;
                }
                else if (typeof(_options.text_selector) === "string") {
                    _error = _error + ": " + _options.text_selector;
                }
                module_cache_set(_options.url, _content, _error, function () {
                    ua_event(_module, _query, false, false);
                    _output.display_error(_module, _query, _error);
                });
            }
        };
        
        // -------------------------

        if (typeof(_options.post_query) === undefined) {
            _protocol.get(_protocol_options, _retrieve_callback)
                    .on('error', _retrieve_error_callback);
        }
        else {
            console.log(_protocol_options);
            var req = _protocol.request(_protocol_options, _retrieve_callback);
            req.on('error', _retrieve_error_callback);
            req.write(JSON.stringify(_options.post_query));
            req.end();
        }
    }); //cache_get(_options.url, function (_cache_response) {
    
};  //web_crawler = function (_res, _options) {