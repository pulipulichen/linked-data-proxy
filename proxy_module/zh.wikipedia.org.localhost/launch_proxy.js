/**
 * 查詢 zh.wikipedia.org
 * 成功查詢的頁面：https://zh.wikipedia.org/w/index.php?title=%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8%E9%A4%A8&oldformat=true&printable=yes
 * http://localhost:3000/wiki.l/劉備
 * 失敗查詢的頁面：https://zh.wikipedia.org/w/index.php?title=%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8111%E9%A4%A8&oldformat=true&printable=yes
 */
launch_proxy["zh.wikipedia.org.localhost"] = function (_output, _query) {
    
var _options = {
    module: "zh.wikipedia.org.localhost",
    query: _query,
    
    pre_build_options: function (_callback) {
        var _this = this;
        var _o = clone_json(this);
        _o.referer = "http://db1.ihp.sinica.edu.tw/cbdbc/ttsweb?@0:0:4:cbdbkm";
        _o.url = "http://db1.ihp.sinica.edu.tw/cbdbc/ttsweb?@0:0:1:cbdbkm@@" + Math.random();
        protocol_query(_o, function (_content) {
            var _href = $(_content).find("td.menu:eq(3) > a").attr("href");
            // cbdbkm?@66^2048123360^100^^^@@59546786
            // 66^2048123360^100
            var _tts_control = extract_string(_href, "cbdbkm?@", "^^^");
            console.log(_tts_control);
            
            _href = "http://db1.ihp.sinica.edu.tw/cbdbc/" + _href;
            _this.referer = _href;
            
            console.log(_href);
            // 66^2048123360^100
            
            // 查詢 關鍵詞查詢的頁面
            _o.referer = _o.url;
            _o.url = _href;
            protocol_query(_o, function (_content) {
                //console.log(_content);
                var _action = extract_string(_content, '<FORM METHOD=POST ACTION="', '" NAME=TTSWEB');
                console.log(_action);
                // cbdbkm?@@757522267
                
                _callback();
            });
            
            
            //console.log(_content);
            /*var _head_needle = 'window.open("';
            var _foot_needle = '"+ss+"';
            _content = extract_string(_content, _head_needle, _foot_needle);
            //_content = $(_content).find("table").length;
            _content = "http://db1.ihp.sinica.edu.tw" + _content + "@@" + Math.random();
            console.log(_content);
            */
            
        });
        
    },
    
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

web_crawler(_output, _options);

//_res.send(_query);
// ----------------------------------------    
    
};  // launch_proxy = function (_output, _query) {