app.get("/", function (_req, _res) {
    fs.readFile("usage-example.html", 'utf8', function (err, data) {
        _res.send(data);
    });
});

app.get("/favicon.ico", function (_req, _res) {
    fs.readFile("app/favicon.ico", 'utf8', function (err, data) {
        _res.send(data);
    });
});

app.get("/utils.js", function (_req, _res) {
    fs.readFile("app/utils.js", 'utf8', function (err, data) {
        _res.send(data);
    });
});