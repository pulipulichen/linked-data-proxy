/**
 * 查詢  www.google.com.tw.image
 * 
 * Google圖片試試看
 * 
 * 成功查詢 https://www.google.com.tw/search?q=%E5%8A%89%E5%82%99&source=lnms&tbm=isch&sa=X
 * http://localhost:3000/goo.img/劉備
 */
launch_proxy["www.google.com.tw.image"] = function (_output, _query) {
    
var _options = {
    module: "www.google.com.tw.image",
    query: _query,
    // ----------------------------------------
    
    // 正式查詢
    url: "https://www.google.com.tw/search?q=" + encodeURI(_query) + "&source=lnms&tbm=isch&sa=X", //正式查詢
    
    // --------------------------------------------------
    /**
     * 沒找到資料的選擇器
     */
    //content_not_found_selector: "body",
    //content_not_found_string: '"PersonInfo" : ""',
    
    html_selector: "#rcnt",
    
    //base_url: "http://db1.ihp.sinica.edu.tw/cbdbc/",
    
    referer: "https://www.google.com.tw/search?q=" + encodeURI(_query),
    
    // ------------------------
};

web_crawler(_output, _options);

//_res.send(_query);
// ----------------------------------------    
    
};  // launch_proxy = function (_output, _query) {

