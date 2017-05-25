/**
 * 查詢 cbdb.fas.harvard.edu
 * 
 * 中國歷代人物傳記資料庫
 * 
 * http://projects.iq.harvard.edu/chinesecbdb/cbdb-api
 * 最後是靠API
 * 
 * 查詢目標：http://cbdb.fas.harvard.edu/cbdbapi/person.php?name=%E7%8E%8B%E5%AE%89%E7%9F%B3
 * http://localhost:3000/cbdb/劉備
 */
launch_proxy["cbdb.fas.harvard.edu"] = function (_output, _query, _mode) {
    
var _options = {
    module: "cbdb.fas.harvard.edu",
    query: _query,
    // ----------------------------------------
    
    // 正式查詢
    url: "http://cbdb.fas.harvard.edu/cbdbapi/person.php?name=" + encodeURI(_query) + "&o=json", //正式查詢
    
    // --------------------------------------------------
    /**
     * 沒找到資料的選擇器
     */
    //content_not_found_selector: "body",
    content_not_found_string: '"PersonInfo" : ""',
    
    // ------------------------
    
    /**
     * 取出資料之後的做法
     * @param {string} _content
     */
    post_process: function (_content) {
        //console.log("[post_process]");
        //console.log(_content);
        //console.log("[END]");
        _content = JSON.parse(_content);
        var _persons = _content.Package.PersonAuthority.PersonInfo.Person;
        if (typeof(_persons.length) === "undefined") {
            _persons = [_persons];
        }
        
        var _data = [];
        for (var _i = 0; _i < _persons.length; _i++) {
            var _d = {};
            var _p = _persons[_i];
            _d.Name = "";
            if (typeof(_p.BasicInfo) !== "undefined" 
                    && typeof(_p.BasicInfo.ChName) === "string") {
                _d.Name = _p.BasicInfo.ChName;
            }
            if (typeof(_p.BasicInfo) !== "undefined" 
                    && typeof(_p.BasicInfo.EngName) === "string") {
                if (_d.Name === "") {
                    _d.Name = _p.BasicInfo.EngName;
                }
                else {
                    _d.Name = _d.Name + " (" + _p.BasicInfo.EngName + ")";
                }
            }
            
            _d.Dynasty = "";
            if (typeof(_p.BasicInfo) !== "undefined" 
                    && typeof(_p.BasicInfo.Dynasty) === "string") {
                _d.Dynasty = _p.BasicInfo.Dynasty;
            }
            
            _d.Aliases = [];
            if (typeof(_p.PersonAliases) === "object" && typeof(_p.PersonAliases.Alias) === "object") {
                var _aliases = _p.PersonAliases.Alias;
                if (typeof(_aliases.length) === "undefined") {
                    _aliases = [_aliases];
                }
                for (var _a = 0; _a < _aliases.length; _a++) {
                    var _alias = _aliases[_a];
                    var _aliasName = _alias.AliasName;
                    if (typeof(_alias.AliasType) === "string") {
                        _aliasName = _aliasName  + " (" + _alias.AliasType + ")";
                    }
                    _d.Aliases.push(_aliasName);
                }
            }
            
            _data.push(_d);
        }
        
        var _table = $('<table><thead><tr><th>姓名</th><th>朝代</th><th>別號</th></tr></thead><tbody></tbody></table>');
        var _tbody = _table.find("tbody");
        for (var _i = 0; _i < _data.length; _i++) {
            var _d = _data[_i];
            _tbody.append($("<tr><td>" + _d.Name + "</td><td>" + _d.Dynasty + "</td><td>" + _d.Aliases.join(", ") + "</td></tr>"));
        }
        
        //_content = JSON.stringify(_data);
        _content = get_outer_html(_table);
        return _content;
        //_content = JSON.parse(_content);
        //return get_outer_html(_content);
    },
    
    //base_url: "http://db1.ihp.sinica.edu.tw/cbdbc/",
    
    // ------------------------
    
    /**
     * 參考來源網頁的名稱
     */
    referer_name: "CBDB",
    
    /**
     * 參考來源網頁
     */
    referer_source: "http://cbdb.fas.harvard.edu/cbdbapi/person.php?name=" + encodeURI(_query), //正式查詢
};

web_crawler(_output, _options, _mode);

//_res.send(_query);
// ----------------------------------------    
    
};  // launch_proxy = function (_output, _query) {

