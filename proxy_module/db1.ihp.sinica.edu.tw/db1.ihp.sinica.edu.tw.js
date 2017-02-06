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
        var _this = this;
        var _o = clone_json(this);
        _o.referer = "http://db1.ihp.sinica.edu.tw/cbdbc/ttsweb?@0:0:4:cbdbkm";
        _o.url = "http://db1.ihp.sinica.edu.tw/cbdbc/ttsweb?@0:0:1:cbdbkm@@" + Math.random();
        
        protocol_query(_o, function (_content) {
            _this.referer = _o.url;
            console.log("referer", _this.referer);
            var _action = extract_string(_content, '<FORM METHOD=POST ACTION="', '" NAME=TTSWEB');
            _action = "http://db1.ihp.sinica.edu.tw/cbdbc/" + _action;
            _this.url = _action;
            console.log("action", _action);
            // http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@@757522267

            _callback();
            /*
            var _href = $(_content).find("td.menu:eq(3) > a").attr("href");
            // cbdbkm?@66^2048123360^100^^^@@59546786
            
            var _tts_control = extract_string(_href, "cbdbkm?@", "^^^");
            _this.post_query._TTS_CONTROL = _tts_control;
            //console.log(_tts_control);
            // 66^2048123360^100
            
            _href = "http://db1.ihp.sinica.edu.tw/cbdbc/" + _href;
            _this.referer = _href;
            console.log("referer", _href);
            // http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@22^1973632183^100^^^@@59546786
            
            // 查詢 關鍵詞查詢的頁面
            _o.referer = _o.url;
            _o.url = _href;
            protocol_query(_o, function (_content) {
                //console.log(_content);
                var _action = extract_string(_content, '<FORM METHOD=POST ACTION="', '" NAME=TTSWEB');
                _action = "http://db1.ihp.sinica.edu.tw/cbdbc/" + _action;
                _this.url = _action;
                console.log("action", _action);
                // http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@@757522267
                
                _callback();
            });
            */
        });
        
    },
    
    // 正式查詢
    url: "http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@@350745915", //正式查詢
    //url: "http://localhost/linked-data-proxy/proxy_module/db1.ihp.sinica.edu.tw/assert_false.html", //測試錯誤查詢
    //url: "http://localhost/linked-data-proxy/proxy_module/db1.ihp.sinica.edu.tw/assert_true.html", //測試正確查詢
    
    /**
     * 指定來源網頁 referer (可省略)
     */
    //referer: "http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@@707418221",
    referer: "http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@43^1556440068^20^^^@@758790323",
    
    // ---------------------------------------------
    
    method: "post",
    payload: false,
    
    post_query: {
        "_TTS_ACTION": "5",
        "_TTS_CONTROL": "43^1556440068^100",    // 這個比較麻煩
        "@KAA": _query,
        //"@KAA": iconv_encode(_query, "big5"),
        "@KTY_BIOG_MAIN": "on",
        "@KTY_BIOG_ADDR_DATA": "on",
        "@KTY_TEXTS": "on",
        "@KTY_POST": "on",
        "@KTY_ENTRY": "on",
        "@KTY_STATUS": "on",
        "@KTY_KIN": "on",
        "@KTY_ASSOC": "on",
        "@KTY_BIOG_INST_DATA": "on",
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
    
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Length": 421,
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "db1.ihp.sinica.edu.tw",
        "Origin": "http://db1.ihp.sinica.edu.tw",
        "Pragma": "no-cache",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"
    },
    
    encoding: "big5",
    
    // --------------------------------------------------
    /**
     * 沒找到資料的選擇器
     */
    //content_not_found_selector: "body",
    content_not_found_string: '<div id=WordSection1>',
    
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

