app.get('/add_term', function (_req, _res) {
    ua_set_headers(_req, _res);
    setup_uuid(_req, _res);
    
    //setup_uuid(_req, _res);
    var _term = _req.query.term;
    _term = _term.trim();
    ua_event_add_term(_term);
    
    res_display(_res, "", _req);
});