app.post('/test_cookie/', function (_req, _res) {
    _res.header("Access-Control-Allow-Origin", "*");
    var cookies = new Cookies( _req, _res );
    cookies.set("test_cookie", "a");
    _res.setHeader('content-type', 'text/plain');
    _res.send("");
});

app.get('/test_cookie/', function (_req, _res) {
    _res.header("Access-Control-Allow-Origin", "*");
    var cookies = new Cookies( _req, _res );
    console.log(cookies.get("test_cookie"));
    _res.setHeader('content-type', 'text/plain');
    _res.send("");
});

