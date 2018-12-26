
/**
 * 查詢 www.moedict.tw
 * 成功查詢的頁面：https://www.moedict.tw/%E5%8B%BE%E8%90%8C
 * http://localhost:3000/moedict/勾萌
 * 
 * 成功查詢的頁面：https://www.moedict.tw/%E5%AE%8B
 * http://localhost:3000/moedict/宋
 * 
 * 失敗查詢的頁面：https://www.moedict.tw/%E4%B8%8D%E8%90%8C
 * http://localhost:3000/moedict/不萌
 *
 */

CONFIG.module_alias["dict.tw"] = "dict.tw";
launch_proxy["dict.tw"] = function (_output, _query, _mode) {
    
var _options = {
    module: "dict.tw",
    query: _query,
    
    // 正式查詢
    url: "http://dict.tw/dict/" + encodeURI(_query),
    
    encoding: "utf8",
    
    // --------------------------------------------------
    /**
     * 沒找到資料的選擇器
     */
    //content_not_found_selector: "body",
    content_not_found_string: '<body itemscope="itemscope" itemtype="http://schema.org/ItemList">',
    
    /**
     * 取出指定元素的HTML程式碼
     */
    //html_selector: ".db_info .def",
    
    /**
     * 取出指定元素的純文字
     * 取出音節(斷句)
     */
    //text_selector: ".syllable:first-of-type",
    
    /**
     * 指定處理元素的方法
     */
    process: function (_content) {
        try {
           // var _d = $(_content).find(".db_info").find(".def");
            var _second = _content.lastIndexOf("<hr>");
            var _content_hearder = '</form>';
            var _content_footer = '<hr>';
            
            //var _content = _content.slice(_content_hearder + _content_footer.length, _content.lastIndexOf(_content_footer));
            var _content = _content.slice(_content.lastIndexOf(_content_hearder) + _content_hearder.length + _content_footer.length, _content.lastIndexOf(_content_footer));
            console.log("---------------------------------");
            console.log(_content);
            console.log("---------------------------------");
            
            /*var _d = $(_content).find(".db_info");
            console.log(_d);
            
            console.log(_d.length);*/
            
            
            var _header = '<br> &nbsp;'
            var _footer = '<br>'
           // _d = _d.slice(_d.lastIndexOf(_header) + _header.length, _d.lastIndexOf(_footer));
            
            var _s = $(_content).find(".syllable");
            var _syllable =_s[0].text;   
            
            //var _d = $(_content).find(".db_info").find(".def");
    
            _content =_syllable + "def:";
        }
         catch (e) {
             console.log(e)
         }
        return _content;
    },
        
    // ------------------------
    
    /**
     * 指定use_agnet (可省略)
     */
    //user_agent: "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10",
    
    /**
     * 指定來源網頁 referer (可省略)
     */
    //referer: "https://zh.wikipedia.org/wiki/Wikipedia:%E9%A6%96%E9%A1%B5",
    
    // ------------------------
    /**
     * 參考來源網頁的名稱
     */
    //referer_name: "dict.tw線上字典",
    
    /**
     * 參考來源網頁
     */
    //referer_source: "https://zh.wikipedia.org/w/index.php?title=" + encodeURI(_query) + "&oldformat=true"
};

web_crawler(_output, _options, _mode);

//_res.send(_query);
// ----------------------------------------    
    
};  // launch_proxy = function (_output, _query) {
