launch_proxy = function (_output, _query) {
    
var _options = {
    module: "zh.wikipedia.org",
    query: _query,
    
    url: "http://localhost/linked-data-proxy/proxy_module/zh.wikipedia.org/assert_true.html?q=" + encodeURI(_query),
    //url: "http://localhost/linked-data-proxy/proxy_module/zh.wikipedia.org/assert_false.html?q=" + encodeURI(_query),
    // url: "https://zh.wikipedia.org/w/index.php?title=" + encodeURI(_query) + "&oldformat=true&printable=yes",
    encoding: "utf8",
    /*
    process: function (_content) {
        _content = $(_content).find("#mw-content-text > p:first").html();
        return _content;
    }
    */
    select_html: "#mw-content-text > p:first",
    //select_text: "#mw-content-text > p:first",
};

web_crawler(_output, _options);

//_res.send(_query);
// ----------------------------------------    
    
};  // launch_proxy = function (_output, _query) {