/**
 * 查詢英漢字典
 * https://cdict.net/?q=test
 * 
 * 成功查詢的頁面：https://cdict.net/?q=test
 * http://localhost:3000/cdict/test
 * 
 * 錯誤查詢的頁面：https://cdict.net/?q=test111
 * http://localhost:3000/cdict/test111
 */
launch_proxy["cdict.net"] = function (_output, _query) {
    
var _options = {
    module: "cdict.net",
    query: _query,
    
    // 正式查詢
    url: "https://cdict.net/?q=" + encodeURI(_query),
    
    encoding: "utf8",
    
    // --------------------------------------------------
    /**
     * 沒找到資料的選擇器
     */
    //content_not_found_selector: "body",
    content_not_found_string: '沒有發現關於 [',
    
    /**
     * 從字串前後抽取
     */
    extract_string: ["<pre>", "</pre>"],
    
    // ------------------------
    
    /**
     * 指定use_agnet (可省略)
     */
    //user_agent: "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10",
    
    /**
     * 指定來源網頁 referer (可省略)
     */
    referer: "https://cdict.net/",
    
    base_url: "https://cdict.net",
    
    // ------------------------
};

web_crawler(_output, _options);

//_res.send(_query);
// ----------------------------------------    
    
};  // launch_proxy = function (_output, _query) {