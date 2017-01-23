
http = require('http');
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