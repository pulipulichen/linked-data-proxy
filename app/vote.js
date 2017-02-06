app.get('/:modules/:query/:vote', function (_req, _res) {
    if (check_white_list(_req, _res) === false) {
        return;
    } 
    
    ua_set_headers(_req, _res);
    setup_uuid(_req, _res);
        
    var _modules = _req.params.modules.split(",");
    _modules = modules_mapping(_modules);
    
    var _query = _req.params.query.trim();
    
    var _callback = get_callback(_req);
    
    // ----------------
    
    var _score = _req.params.vote;
    if (_score === undefined || isNaN(_score)) {
        _res.status(501).send({
            message: 'Vote error'
        });
        return;
    }
    else {
        _score = parseInt(_score, 10);
    }
    
    // ---------------------------------
    for (var _i = 0; _i < _modules.length; _i++) {
        var _module = _modules[_i];
        set_vote_score(_module, _query, _score);
        
        // 刪除相關的query_cache
        query_cache_remove(_module, _query);
    }
    
    // ---------------------------------
    // 輸出
    
    var _output_string = "1";
    res_display(_res, _output_string, _callback);
});