/**
 * 查詢 zh.wikipedia.org
 * 成功查詢的頁面：https://zh.wikipedia.org/w/index.php?title=%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8%E9%A4%A8&oldformat=true&printable=yes
 * 失敗查詢的頁面：https://zh.wikipedia.org/w/index.php?title=%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8111%E9%A4%A8&oldformat=true&printable=yes
 */
launch_proxy = function (_output, _query) {
    
var _options = {
    module: "zh.wikipedia.org",
    query: _query,
    
    // 測試查詢
    //url: "http://localhost/linked-data-proxy/proxy_module/zh.wikipedia.org/assert_true.html?q=" + encodeURI(_query),
    //url: "http://localhost/linked-data-proxy/proxy_module/zh.wikipedia.org/assert_false.html?q=" + encodeURI(_query),
    
    // 正式查詢
    url: "https://zh.wikipedia.org/w/index.php?title=" + encodeURI(_query) + "&oldformat=true&printable=yes",
    
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