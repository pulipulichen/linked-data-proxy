/**
 * 查詢 zh.wikipedia.org
 * 成功查詢的頁面：https://zh.wikipedia.org/w/index.php?title=%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8%E9%A4%A8&oldformat=true&printable=yes
 * http://localhost:3000/wiki.l/劉備
 * 失敗查詢的頁面：https://zh.wikipedia.org/w/index.php?title=%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8111%E9%A4%A8&oldformat=true&printable=yes
 */
CONFIG.module_alias["wiki.l"] = "zh.wikipedia.org.localhost";
launch_proxy["zh.wikipedia.org.localhost"] = function (_output, _query, _mode) {
    
var _options = {
    module: "zh.wikipedia.org.localhost",
    module_alias: "wiki.l",
    query: _query,
    
    /*
    pre_build_options: function (_callback) {
        _callback();
    },
    */
    
    // 測試查詢
    url: "http://localhost/linked-data-proxy/proxy_module/zh.wikipedia.org.localhost/assert_true.html?q=" + encodeURI(_query),
    //url: "http://localhost/linked-data-proxy/proxy_module/zh.wikipedia.org/assert_false.html?q=" + encodeURI(_query),
    
    // 正式查詢
    //url: "https://zh.wikipedia.org/w/index.php?title=" + encodeURI(_query) + "&oldformat=true&printable=yes",
    
    encoding: "utf8",
    
    // --------------------------------------------------
    /**
     * 沒找到資料的選擇器
     */
    content_not_found_selector: "#mw-content-text > div.noarticletext",
    
    /**
     * 指定處理元素的方法
     */
    process: function (_content) {
        var _output_array = [];
        var _p = $(_content).find("#mw-content-text > p:first");
        if (_p.length === 1) {
            _output_array.push(_p);
        }
        while (true) {
            _p = _p.next();
            if (_p.length === 0 || _p.hasClass("toc")) {
                break;
            }
            else {
                if (_p.text().trim() !== "") {
                    _output_array.push(_p);
                }
            }
        }
        _content = get_outer_html(_output_array);
        //_content = $(_content).find("#mw-content-text > p:first").html();
        return _content;
    },
    
    /**
     * 取出指定元素的HTML程式碼
     */
    //html_selector: "#mw-content-text > p:first",
    
    /**
     * 取出指定元素的純文字
     */
    //text_selector: "#mw-content-text > p:first",
    
    // ------------------------
    
    /**
     * 指定use_agnet (可省略)
     */
    //user_agent: "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10",
    
    /**
     * 指定來源網頁 referer (可省略)
     */
    referer: "https://zh.wikipedia.org/wiki/Wikipedia:%E9%A6%96%E9%A1%B5",
    
    // ------------------------
    
    base_url: "https://zh.wikipedia.org"
};

// 執行檢索
web_crawler(_output, _options, _mode);

//_res.send(_query);
// ----------------------------------------    
    
};  // launch_proxy = function (_output, _query) {