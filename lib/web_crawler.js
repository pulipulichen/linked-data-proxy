
var http = require('http');
var https = require('http');
var url = require('url');

web_crawler = function (_res, _options) {
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
              content = $(content).find(_options.select_html).html();
          }
          else if (typeof(_options.select_text) === "string") {
              content = $(content).find(_options.select_text).text();
          }
          //console.log(content);
          _res.send(content);
      });
  }).on('error', function(e) {
      //console.log("Got error: " + e.message);
      show_error_page(_res, e.message);
  });
    
    
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