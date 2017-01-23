proxy = function (_res, _query) {
    
var _options = {
    host: 'pc.pulipuli.info',
    port: 80,
    path: '/public/index.html?q=' + _query,
    process: function (_content) {
        _content = _content.substr(0,1);
        return _content;
    } 
};

    http_getter(_res, _options);
    
    //_res.send(_query);
};  // proxy = function (_res, _query) {