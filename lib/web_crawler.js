
var http = require('http');
var https = require('http');
var url = require('url');

var _default_options = {
    module: "test",
    url: "https://pulipulichen.github.io/blogger/posts/2017/01/wikipedia.html",
    encoding: "utf8",
    select_text: "#mw-content-text > p:first"
};

web_crawler = function (_output, _options) {
    for (var _key in _default_options) {
        if (typeof(_options[_key]) === "undefined") {
            _options[_key] = _default_options[_key];
        }
    }
    
    var _module = _options.module;
    
    cache_get(_options.url, function (_cache_response) {
        if (_cache_response !== false) {
            ua_pageview(_options.module, _options.query, (_cache_response !== null), true);
            //_res.send(_cache_response);
            _output.display_response(_options.module, _cache_response);
            return;
        }
        
        var _url_options = url.parse(_options.url);
    
        var _protocol_options = {
            host: _url_options.host,
            port: _url_options.port,
            path: _url_options.path
        };

        var _protocol = http;
        if (_url_options.protocol === "https:") {
            _protocol = https;
        }

        //console.log(_url_options);

        _protocol.get(_protocol_options, function(res) {
            var _content = "";
            var _error = null;
            
            //console.log(["Status code error: " + res.statusCode, typeof(res.statusCode)]);
            if (res.statusCode !== 200) {
                // https://www.wikiwand.com/zh-tw/HTTP%E7%8A%B6%E6%80%81%E7%A0%81
                _content = null;
                _error = "Status code error: " + res.statusCode;
                cache_set(_options.url, _content, _error, function () {
                    //console.log(2);
                    ua_pageview(_options.module, _options.query, false, false);
                    //_res.send(null);
                    _output.display_response(_options.module, null);
                });
                return;
                // return show_error_page(_res, "Status code error: " + res.statusCode);
            }
            
            
            res.setEncoding(_options.encoding);
            res.on("data", function (chunk) {
                _content += chunk;
            });

            res.on("end", function () {
                if (typeof(_options.process) === "function") {
                    _content = _options.process(_content);
                }
                else if (typeof(_options.select_html) === "string") {
                    var ele = $(_content).find(_options.select_html);
                    if (ele.length === 0) {
                        //show_error_page(_res, "Selector not found: " + _options.select_html);
                        _content = null;
                        _error = "Selector not found: " + _options.select_html;
                        cache_set(_options.url, _content, _error, function () {
                            //console.log(1);
                            ua_pageview(_options.module, _options.query, false, false);
                            //_res.send(_content);
                            _output.display_response(_module, _content);
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
                else if (typeof(_options.select_text) === "string") {
                    _content = $(_content).find(_options.select_text).text();
                }
                //console.log(content);

                cache_set(_options.url, _content, function () {
                    ua_pageview(_options.module, _options.query, true, false);
                    //_res.send(_content);
                    _output.display_response(_module, _content);
                });
            });
        }).on('error', function(e) {
            //console.log("Got error: " + e.message);
            //show_error_page(_res, e.message);
            
            var _content = null;
            var _error = "Got error: " + e.message;
            cache_set(_options.url, _content, _error, function () {
                ua_pageview(_options.module, _options.query, false, false);
                //_res.send(null);
                _output.display_response(_module, null);
            });
            return;
        });
    }); //cache_get(_options.url, function (_cache_response) {
    
};  //web_crawler = function (_res, _options) {