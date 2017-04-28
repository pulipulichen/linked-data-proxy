
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

web_crawler = function (_output, _options) {
    for (var _key in _default_options) {
        if (typeof(_options[_key]) === "undefined") {
            _options[_key] = _default_options[_key];
        }
    }
    
    var _module = _options.module;
    var _query = _options.query;
    var _url_options;
    var _content;
    
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
                ua_event(_options.module, _options.query, false, false);
                //_res.send(null);
                _output.display_error(_options.module, _options.query, _error);
            });
            return;
            // return show_error_page(_res, "Status code error: " + res.statusCode);
        }   //if ($.inArray(res.statusCode, _allow_status_code) === -1) {

        if (_options.encoding !== null && _options.encoding !== "big5") {
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
        if (_options.encoding === "big5") {
            _chunk = iconv.decode(new Buffer(_chunk), "big5");
        }
        if (typeof(DEBUG.chunk) !== "undefined") {
            //console.log(_chunk.length);
        }
        //_content = iconv.decode(new Buffer(_content), "big5");
        _content += _chunk;
    };

    var _retrieve_end = function () {
        //var _head_pos = _content.indexOf("<BODY");
        //var _foot_pos = _content.lastIndexOf("</BODY>") + 7;
        //_content = _content.substring(_head_pos, _foot_pos);
        //_output.test_display(_content);
        //return;
        //console.log($(_content).find("table table table[bgcolor='white']:first").length + "a");
        //_output.test_display($(_content).find("table table table[bgcolor='white']:first").text());
        //_output.test_display(_content);
        //console.log($(_content).find("BODY").length + "a");
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
                ua_event(_module, _query, false, false);
                _output.display_error(_module, _query, _error);
            });
            return;
        }
        else if (typeof(_options.content_not_found_string) === "string" 
                && _content.indexOf(_options.content_not_found_string) > -1) {
            _content = null;
            var _error = "No result: " + _options.content_not_found_string;
            module_cache_set(_options.url, _content, _error, function () {
                ua_event(_module, _query, false, false);
                _output.display_error(_module, _query, _error);
            });
            return;
        }
        else if (typeof(_options.content_found_string) === "string" 
                && _content.indexOf(_options.content_found_string) === -1) {
            _content = null;
            var _error = "Result not found: " + _options.content_found_string;
            module_cache_set(_options.url, _content, _error, function () {
                ua_event(_module, _query, false, false);
                _output.display_error(_module, _query, _error);
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
            _content = _html_selector(_content);
        }
        else if (typeof(_options.text_selector) === "string") {
            _content = _text_selector(_content);
        }
        else if (typeof(_options.extract_string) === "object") {
            _content = _extract_string(_content);
        }
        //console.log(content);

        _content = _content.trim();

        if (_content !== "") {
            
            if (typeof(_options.post_process) === "function") {
                _content = _options.post_process(_content);
            }
            if (typeof(_options.base_url) === "string") {
                _content = _prepend_base_url(_content, _options.base_url);
            }
            if (typeof(_options.zhs2zht) === "boolean" && _options.zhs2zht === true) {
                opencc.simplifiedToTraditional(_content).then(function (_content) {
                    _set_moudle_cache(_content);
                });
            }
            else {
                _set_moudle_cache(_content);
            }
        }
        else {
            _selector_not_fount();
        }
    };
    
    var _has_cache = function (_cache_response) {
        ua_event(_options.module, _options.query, (_cache_response !== null), true);
        //_res.send(_cache_response);
        //var _priority = 0;
        get_vote_score(_module, _query, function (_priority) {
            _output.display_response(_options.module, _cache_response, _priority, _query);
        });
    };
    
    var _no_cache = function () {
        _url_options = url.parse(_options.url);
        
        var _protocol_options = {
            host: _url_options.host,
            port: _url_options.port,
            path: _url_options.path,
            method: _options.method.toUpperCase(),
            headers: {}
        };
        
        if (typeof(_options.user_agent) === "string") {
            _protocol_options.headers["User-Agent"] = _options.user_agent;
        }
        if (typeof(_options.referer) === "string") {
            _protocol_options.headers["Referer"] = _options.referer;
        }
        
        if (typeof(_options.headers) === "object") {
            for (var _key in _options.headers) {
                _protocol_options.headers[_key] = _options.headers[_key];
            }
        }
        
        var _protocol = http;
        if (_url_options.protocol === "https:") {
            _protocol = https;
        }
        _content = "";

        // -------------------------

        if (typeof(DEBUG.protocol_options) !== "undefined") {
            console.log(_protocol_options);
        }
        
        if (_options.method === "get") {
            //console.log("get");
            _protocol.get(_protocol_options, _retrieve_callback)
                    .on('error', _retrieve_error_callback);
        }
        else {
            if (typeof(DEBUG.post_query) !== "undefined") {
                console.log(_options.post_query);
            }
            //console.log("post");
             if (_options.payload === false) {
                
                if (typeof(DEBUG.protocol_options) !== "undefined") {
                    console.log(_protocol_options);
                }
                //console.log(_options.url);
                //var _post_query = querystring.stringify(_options.post_query);
                var _post_query = _options.post_query;
                 _protocol.post(_protocol_options, _post_query, _retrieve_callback);
             }
             else {
                 /*
                 var _post_query = JSON.stringify(_options.post_query);
                 _protocol_options.headers["Content-Length"] = _post_query.length;
                 _protocol_options.headers["Content-Type"] = "application/json";
                 var _post_request = _protocol.request(_protocol_options, _retrieve_callback);
                 _post_request.on("error", _retrieve_error_callback);
                 _post_request.write(_post_query);
                 _post_request.end();
                 */
                
                /*
                var _post_query = querystring.stringify(_options.post_query);
                _protocol_options.uri = _options.url;
                _protocol_options.body = _options.post_query;
                _protocol_options.json = true;
                //_protocol_options.form = _options.post_query;
                
                _protocol_options.headers["Content-Length"] = _post_query.length;
                _protocol_options.headers["Content-Type"] = "application/json";
                if (typeof(DEBUG.protocol_options) !== "undefined") {
                    console.log(_protocol_options);
                }
                var _post_req = request_promise(_protocol_options)
                        .then(function (response) {
                            response = iconv.decode(response, 'big5');
                            _output.test_display(response);
                            //console.log(response);
                        })
                        .catch(_retrieve_error_callback);
                //_post_req.on("response", _retrieve_callback);
                //_post_req.on('error', _retrieve_error_callback);
                */
               
                /*
                var form = new FormData();
                for (var _key in _options.post_query) {
                    form.append(_key, _options.post_query[_key]);
                }
                form.submit(_protocol_options, function (err, res) {
                    console.log(res.statusCode);
                    _retrieve_callback(res);
                });
                */
                /*
                var request = http.request(_protocol_options);
                
                form.pipe(request);

                request.on('response', function (res) {
                    console.log(res.statusCode);
                });
                */
                /*
                _protocol_options["url"] = _options.url;
                _protocol_options["formData"] = _options.post_query;
                var r = request.post(_options.url, function(err, httpResponse, body) {
                  if (err) {
                    return console.error('upload failed:', err);
                  }
                  console.log('Upload successful!  Server responded with:');
                  //console.log(body);
                  _output.test_display(body);
                  console.log(body.indexOf("Quan"));
                });
                var form = r.form();
                for (var _key in _options.post_query) {
                    form.append(_key, _options.post_query[_key]);
                }
                */
                _protocol_options["url"] = _options.url;
                _protocol_options["formData"] = _options.post_query;
                
                request(_protocol_options, function (error, response, body) {
                    console.log('Upload successful!  Server responded with:');
                  //console.log(body);
                  _output.test_display(body);
                  console.log(body.indexOf("<div id=WordSection1>"));
                });
             }
        }
    };
    
    var _set_moudle_cache = function (_content) {
        module_cache_set(_options.url, _content, function () {
            ua_event(_module, _query, true, false);
            //_res.send(_content);
            //var _priority = 0;
            get_vote_score(_module, _query, function (_priority) {
                //console.log("_set_moudle_cache", _query, _content);
                _output.display_response(_module, _content, _priority, _query);
            });
        });
    };
    
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
            ua_event(_module, _query, false, false);
            _output.display_error(_module, _query, _error);
        });
    };
    
    var _html_selector = function (_content) {
        var ele = $(_content).find(_options.html_selector);
        if (ele.length === 0) {
            //show_error_page(_res, "Selector not found: " + _options.select_html);
            /*
            _content = null;
            var _error = "Selector not found: " + _options.html_selector;
            module_cache_set(_options.url, _content, _error, function () {
                ua_event(_module, _query, false, false);
                _output.display_error(_module, _query, _error);
            });
            return;
            */
           _content = "";
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
        return _content;
    };
    
    var _text_selector = function (_content) {
        var _ele = $(_content).find(_options.text_selector);
        _content = [];
        for (var _i = 0; _i < _ele.length; _i++) {
            _content.push(_ele.eq(_i).text());
        }
        _content = _content.join("\n");
        return _content;
    };
    
    var _extract_string = function (_content) {
        _content = extract_string(_content, _options.extract_string[0], _options.extract_string[1]);
        //_content = "<div>" + _content + "</div>";
        return _content;
    };
    
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

// ---------------------------

strStartsWith = function (str, prefix) {
    return str.indexOf(prefix) === 0;
};

var _prepend_base_url = function (_content, _base_url) {
    _content = $(_content);
    if (_content.length > 1) {
        var _c = $("<div></div>").append(_content);
        _content = _c;
    }
    
    _content.find("a[href]").each(function (_i, _ele) {
        if (!strStartsWith(_ele.href, "http://") && !strStartsWith(_ele.href, "https://") && !strStartsWith(_ele.href, "//")) {
            _ele.href = _base_url + _ele.href;
        }
        _ele.target = "_blank";
    });
    _content.find("img[src]").each(function (_i, _ele) {
        if (!strStartsWith(_ele.src, "http://") && !strStartsWith(_ele.src, "https://") && !strStartsWith(_ele.src, "//")) {
            _ele.src = _base_url + _ele.src;
        }
    });
    return get_outer_html(_content);
};

// --------------------

protocol_query = function(_options, _retrieve_callback, _retrieve_error_callback) {
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
    _content = "";

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
        _protocol.post(_protocol_options, _options.post_query, _retrieve_process);
    }
    else {
        var _request = new _protocol.ClientRequest(_protocol_options, _retrieve_process);
        _request.end(JSON.stringify(_options.post_query));
    }
};  //protocol_query

clone_json = function (_json) {
    var _output = {};
    for (var _key in _json) {
        _output[_key] = _json[_key];
    }
    return _output;
};

extract_string = function (_str, _head_needle, _foot_needle) {
    var _head_pos = _str.indexOf(_head_needle);
    if (_head_pos === -1) {
        _head_pos = 0;
    }
    else {
        _head_pos = _head_pos + _head_needle.length;
    }
    var _foot_pos = _str.indexOf(_foot_needle, _head_pos);
    if (_foot_pos === -1) {
        _foot_pos = _str.length;
    }
    return _str.substring(_head_pos, _foot_pos);
};

iconv_encode = function (_str, _encoding) {
    return iconv.encode(_str, _encoding);
};