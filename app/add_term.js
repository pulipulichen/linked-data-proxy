app.get('/add_term', function (_req, _res) {
    //setup_uuid(_req, _res);
    var _term = _req.params.term;
    _term = _term.trim();
    ua_event_add_term(_term);
    
    res_display(_res, "", _req);
});