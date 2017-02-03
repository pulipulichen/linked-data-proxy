proxy = function (_res, _query) {
    
var _options = {
    url: "https://pulipulichen.github.io/blogger/posts/2017/01/wikipedia.html?q=" + _query,
    // https://zh.wikipedia.org/w/index.php?title=%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8%E9%A4%A8&oldformat=true&printable=yes
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

web_crawler(_res, _options);

//_res.send(_query);
// ----------------------------------------    
    
};  // proxy = function (_res, _query) {