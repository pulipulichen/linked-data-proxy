/**
 * 查詢 maps.cga.harvard.edu
 * 
 * TGAZ API
 * 
 * http://maps.cga.harvard.edu/tgaz/index.html
 * 
 * 查詢目標：http://maps.cga.harvard.edu/tgaz/placename?fmt=html&n=%E5%8C%97%E4%BA%AC&yr=&ftyp=&src=
 * http://localhost:3000/tgaz/北京
 * 
 * 失敗查詢 http://maps.cga.harvard.edu/tgaz/placename?fmt=html&n=%E5%8A%89%E5%82%99&yr=&ftyp=&src=
 * http://localhost:3000/tgaz/劉備
 */
launch_proxy["maps.cga.harvard.edu"] = function (_output, _query, _mode) {
    
var _options = {
    module: "maps.cga.harvard.edu",
    module_alias: "tgaz",
    query: _query,
    // ----------------------------------------
    
    // 正式查詢
    url: "http://maps.cga.harvard.edu/tgaz/placename?fmt=html&n=" + encodeURI(_query) + "&yr=&ftyp=&src=", //正式查詢
    
    // --------------------------------------------------
    /**
     * 沒找到資料的選擇器
     */
    //content_not_found_selector: "body",
    content_not_found_string: 'Results: 1-0 of 0 total hits &nbsp;&nbsp;',
    
    html_selector: "div.results",
    
    // ------------------------
    post_process: function (_content) {
        var _output = $("<div></div>");
        var _dl = $(_content).find("dl.pn");
        for (var _i = 0; _i < _dl.length; _i++) {
            var _d = _dl.eq(_i);
            
            var _href = _d.find("a[href]:first").attr("href");
            var _name = _d.find("b:first").text();
            var _geo = _d.find("dd.pnd:first").text();
            _geo = extract_string(_geo, "[", "]");
            
            _output.append($('<div><a href="' + _href + '" target="_blank">' + _name + '</a> [' + _geo + ']</div>'));
        }
        _output = get_outer_html(_output);
        return _output;
    },
    
    base_url: "http://maps.cga.harvard.edu/tgaz/",
    
    // 簡體轉繁體設定
    zhs2zht: true,
    // ------------------------
    
    
    // ------------------------
    
    /**
     * 參考來源網頁的名稱
     */
    referer_name: "TAGZ",
    
    /**
     * 參考來源網頁
     */
    //referer_source: "http://cbdb.fas.harvard.edu/cbdbapi/person.php?name=" + encodeURI(_query), //正式查詢
};

web_crawler(_output, _options, _mode);

//_res.send(_query);
// ----------------------------------------    
    
};  // launch_proxy = function (_output, _query) {

