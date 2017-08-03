
app.get("/directory_ming", function (_req, _res) {
    var _link = 'http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253/directory_ming';
    _res.setHeader('content-type', 'text/html');
    _res.send('<html><script type="text/javascript"> location.href="' + _link + '"; </script></html>');
});

app.get("/phppgadmin", function (_req, _res) {
    var _link = "http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3259/phppgadmin";
    _res.setHeader('content-type', 'text/html');
    _res.send('<html><script type="text/javascript"> location.href="' + _link + '"; </script></html>');
});

//app.get('/directory_ming', function (_req, _res) {
//    _res.redirect('http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253/directory_ming');
//});

