var _redirect_config = CONFIG.redirect_config;

for (var _key in _redirect_config) {
    var _link = _redirect_config[_key];
    app.get(_key, function (_req, _res) {
        //_res.redirect('http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3259/phppgadmin');
        _res.setHeader('content-type', 'text/html');
        _res.send('<html><script type="text/javascript"> location.href="' + _link + '"; </script></html>');
    });
}

//app.get('/directory_ming', function (_req, _res) {
//    _res.redirect('http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253/directory_ming');
//});

