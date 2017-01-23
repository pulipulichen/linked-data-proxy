proxy = function (_res, _query) {
    
var _options = {
    url: "https://pulipulichen.github.io/blogger/posts/2017/01/wikipedia.html?q=" + _query,
    encoding: "utf8",
    /*
    process: function (_content) {
        _content = $(_content).find("#mw-content-text > p:first").html();
        return _content;
    }
    */
    //select_html: "#mw-content-text > p:first",
    select_text: "#mw-content-text > p:first",
};

    web_crawler(_res, _options);
    
    //_res.send(_query);
};  // proxy = function (_res, _query) {