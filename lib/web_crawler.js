
var http = require('http');
var https = require('http');
var url = require('url');

var _default_options = {
    url: "https://pulipulichen.github.io/blogger/posts/2017/01/wikipedia.html",
    encoding: "utf8",
    select_text: "#mw-content-text > p:first"
};

web_crawler = function (_res, _options) {
    for (var _key in _default_options) {
        if (typeof(_options[_key]) === "undefined") {
            _options[_key] = _default_options[_key];
        }
    }
    
    cache_get(_options.url, function (_cache_response) {
        if (_cache_response !== false) {
            _res.send(_cache_response);
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
          var content = "";   
          res.setEncoding(_options.encoding);
          res.on("data", function (chunk) {
              content += chunk;
          });

          res.on("end", function () {
              if (typeof(_options.process) === "function") {
                  content = _options.process(content);
              }
              else if (typeof(_options.select_html) === "string") {
                  var ele = $(content).find(_options.select_html);
                  if (ele.length === 0) {
                        show_error_page(_res, "Selector not found: " + _options.select_html);
                  }
                  else if (ele.length === 1) {
                      content = ele.clone().wrap("<div></div>").parent().html();
                  }
                  else {
                      content = $("<div></div>");
                      ele.each(function (i, e) {
                         $(e).clone().appendTo(content);
                      });
                      content = content.html();
                  }
              }
              else if (typeof(_options.select_text) === "string") {
                  content = $(content).find(_options.select_text).text();
              }
              //console.log(content);

              cache_set(_options.url, content, function () {
                  _res.send(content);
              });
          });
        }).on('error', function(e) {
            //console.log("Got error: " + e.message);
            show_error_page(_res, e.message);
        });
    }); //cache_get(_options.url, function (_cache_response) {
    
};  //web_crawler = function (_res, _options) {
/*
http_getter = function (_res, _options) {
    
http.get(_options, function(res) {
  var content = "";   
  res.setEncoding("utf8");
    res.on("data", function (chunk) {
        content += chunk;
    });

    res.on("end", function () {
        if (typeof(_options.process) === "function") {
            content = _options.process(content);
        }
        _res.send(content);
    });
}).on('error', function(e) {
    //console.log("Got error: " + e.message);
    show_error_page(_res, e.message);
});

};  // http_getter = function () {
*/