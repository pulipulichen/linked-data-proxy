
//var http = require('http');
//var https = require('https');
var http = require('follow-redirects').http;
var https = require('follow-redirects').https;

var _default_options = CONFIG.web_crawler_default_options;

web_crawler = function (_output, _options) {
    for (var _key in _default_options) {
        if (typeof(_options[_key]) === "undefined") {
            _options[_key] = _default_options[_key];
        }
    }
    
    var _module = _options.module;
    var _query = _options.query;
    
    cache_get(_options.url, function (_cache_response) {
        if (_cache_response !== false) {
            ua_event(_options.module, _options.query, (_cache_response !== null), true);
            //_res.send(_cache_response);
            var _priority = 0;
            _output.display_response(_options.module, _cache_response, _priority);
            return;
        }
        
        var _url_options = url.parse(_options.url);
        
        var _protocol_options = {
            host: _url_options.host,
            port: _url_options.port,
            path: _url_options.path,
            headers: {}
        };
        
        if (typeof(_options.user_agent) === " string") {
            _protocol_options.headers["User_Agent"] = _options.user_agent;
        }
        if (typeof(_options.referer) === " string") {
            _protocol_options.headers["Referer"] = _options.referer;
        }

        var _protocol = http;
        if (_url_options.protocol === "https:") {
            _protocol = https;
        }

        //console.log(_url_options);

        _protocol.get(_protocol_options, function(res) {
            var _content = "";
            var _error = null;
            
            //console.log(["Status code error: " + res.statusCode, typeof(res.statusCode)]);
            var _allow_status_code = [200, 301];
            if ($.inArray(res.statusCode, _allow_status_code) === -1) {
                // https://www.wikiwand.com/zh-tw/HTTP%E7%8A%B6%E6%80%81%E7%A0%81
                _content = null;
                _error = "Status code error: " + res.statusCode;
                cache_set(_options.url, _content, _error, function () {
                    //console.log(2);
                    ua_event(_options.module, _options.query, false, false);
                    //_res.send(null);
                    _output.display_error(_options.module, _options.query, _error);
                });
                return;
                // return show_error_page(_res, "Status code error: " + res.statusCode);
            }
            
            res.setEncoding(_options.encoding);
            res.on("data", function (chunk) {
                _content += chunk;
            });

            res.on("end", function () {
                
                // 先看看是否有找不到資料的訊息
                if (typeof(_options.content_not_found) === "string" 
                        && $(_content).find(_options.content_not_found).length > 0) {
                    _content = null;
                    _error = "Content not found: " + _options.content_not_found;
                    cache_set(_options.url, _content, _error, function () {
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
                        cache_set(_options.url, _content, _error, function () {
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
                    _content = $(_content).find(_options.text_selector).text();
                }
                //console.log(content);
                
                _content = _content.trim();
                
                if (_content !== "") {
                    cache_set(_options.url, _content, function () {
                        ua_event(_module, _query, true, false);
                        //_res.send(_content);
                        var _priority = 0;
                        _output.display_response(_module, _content, _priority);
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
                    cache_set(_options.url, _content, _error, function () {
                        ua_event(_module, _query, false, false);
                        _output.display_error(_module, _query, _error);
                    });
                }
            });
        }).on('error', function(e) {
            //console.log("Got error: " + e.message);
            //show_error_page(_res, e.message);
            
            var _content = null;
            var _error = "Got error: " + e.message;
            cache_set(_options.url, _content, _error, function () {
                ua_event(_options.module, _options.query, false, false);
                //_res.send(null);
                _output.display_error(_module, _query, _error);
            });
            return;
        });
    }); //cache_get(_options.url, function (_cache_response) {
    
};  //web_crawler = function (_res, _options) {