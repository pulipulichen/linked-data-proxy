app.get('/directory_ming', function (_req, _res) {
    _res.redirect('http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253/directory_ming');
});

app.get('/phppgadmin', function (_req, _res) {
    //_res.redirect('http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3259/phppgadmin');
    _res.send('<script type="text/javascript"> location.href="http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3259/phppgadmin"; </script>');
});