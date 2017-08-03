app.post('/directory_ming', function (_req, _res) {
    _res.writeHead(302, {
        'Location': 'http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253/directory_ming'
    });
    _res.end();
});

app.post('/phppgadmin', function (_req, _res) {
    _res.writeHead(302, {
        'Location': 'http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3259/phppgadmin'
    });
    _res.end();
});