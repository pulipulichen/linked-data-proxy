
app.get("/redirect/:key", function (_req, _res) {
    //_res.redirect('http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3259/phppgadmin');
    var _key = _req.params.key;
    if (typeof(CONFIG.redirect_config[_key])) {
        var _link = CONFIG.redirect_config[_key];
        _res.setHeader('content-type', 'text/html');
        _res.send('<html><script type="text/javascript"> location.href="' + _link + '"; </script></html>');
    }
});

//app.get('/directory_ming', function (_req, _res) {
//    _res.redirect('http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253/directory_ming');
//});

