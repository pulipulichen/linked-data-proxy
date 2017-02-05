/**
 * 查詢 db1.ihp.sinica.edu.tw
 * 
 * 中國歷代人物傳記資料庫
 * 
 * 查詢到多筆的頁面：
 * 
 * 查詢目標：http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@@1990633754
 * http://localhost:3000/cbdb/劉備
 * 
 * 成功查詢的頁面：https://www.moedict.tw/%E5%AE%8B
 * http://localhost:3000/moedict/宋
 * 
 * 失敗查詢的頁面：https://www.moedict.tw/%E4%B8%8D%E8%90%8C
 * http://localhost:3000/moedict/不萌
 *
 */
launch_proxy["db1.ihp.sinica.edu.tw"] = function (_output, _query) {
    
var _options = {
    module: "db1.ihp.sinica.edu.tw",
    query: _query,
    // ----------------------------------------
    
    pre_build_options: function (_callback) {
        _callback();
    },
    
    // 正式查詢
    url: "http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@@181083029", //正式查詢
    //url: "http://localhost/linked-data-proxy/proxy_module/db1.ihp.sinica.edu.tw/assert_false.html", //測試錯誤查詢
    //url: "http://localhost/linked-data-proxy/proxy_module/db1.ihp.sinica.edu.tw/assert_true.html", //測試正確查詢
    
    /**
     * 指定來源網頁 referer (可省略)
     */
    //referer: "http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@@707418221",
    referer: "http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@12^8989153^100^^^@@1495783754",
    
    // ---------------------------------------------
    
    method: "post",
    post_query: {
        "_TTS_ACTION": "2",
        "_TTS_CONTROL": "66^2048123360^100",    // 這個比較麻煩
        "@KAA": _query,
        "@KTY_BIOG_MAIN": "checked",
        "@KTY_BIOG_ADDR_DATA": "checked",
        "@KTY_TEXTS": "checked",
        "@KTY_POST": "checked",
        "@KTY_ENTRY": "checked",
        "@KTY_STATUS": "checked",
        "@KTY_KIN": "checked",
        "@KTY_ASSOC": "checked",
        "@KTY_BIOG_INST_DATA": "checked",
        "@KAB.3.4": "1",
        "KAB.3.4": "",
        "@KAB.7.4": "1",
        "KAB.7.4": "",
        "@KDP.3.4": "1",
        "KDP.3.4": "",
        "@KDP.7.4": "1",
        "KDP.7.4": "",
        "DISPLAYCRL": "0",
        "TYPE": "0",
        "_TTS.INI": "cbdbkm"
    },
    
    /**
     * 指定use_agnet (可省略)
     */
    //user_agent: "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10",
    
    encoding: "big5",
    
    // --------------------------------------------------
    /**
     * 沒找到資料的選擇器
     */
    //content_not_found_selector: "body",
    content_not_found_string: '<font style="font-size:10pt;color:red">沒有查詢結果,或尚未開始查詢</font>',
    
    /**
     * 取出指定元素的HTML程式碼
     */
    html_selector: "table table table[bgcolor='white']:first",
    
    /**
     * 取出指定元素的純文字
     */
    //text_selector: "#result p.definition",
    
    // ------------------------
    
    /**
     * 取出資料之後的做法
     * @param {string} _content
     */
    post_process: function (_content) {
        _content = $(_content);
        _content.find("tbody > tr > th:first").remove();
        _content.find("tbody > tr > td:first").remove();
        _content.find("a").each(function (_i, _ele) {
            _ele.href = "http://db1.ihp.sinica.edu.tw/cbdbc/" + _ele.href;
        });
        return get_outer_html(_content);
    },
    
    //base_url: "http://db1.ihp.sinica.edu.tw/cbdbc/",
    
    // ------------------------
};

web_crawler(_output, _options);

//_res.send(_query);
// ----------------------------------------    
    
};  // launch_proxy = function (_output, _query) {