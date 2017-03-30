app.post('/uuid', function (_req, _res) {
    setup_uuid(_req, _res);
    res_display(_res, get_uuid(), _req);
});