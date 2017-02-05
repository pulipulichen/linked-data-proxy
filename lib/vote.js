get_vote_module_query_score = function (_module, _query, _callback) {
    var _where = {
        referer_host: get_referer_host(),
        "module": _module,
        "query": _query
    };
    
    tableVote.sum("score", _where)
        .then(function (_sum) {
            if (isNaN(_sum)) {
                _sum = 0;
            }
            if (_module === "zh.wikipedia.org.localhost") {
                _sum = 10;
            }
            _callback(_sum);
        });
};

// --------------------------------

get_vote_module_score = function (_module, _callback) {
    var _where = {
        referer_host: get_referer_host(),
        "module": _module
    };
    
    tableVote.sum("score", _where)
        .then(function (_sum) {
            if (isNaN(_sum)) {
                _sum = 0;
            }
            _callback(_sum);
        });
};

// --------------------------------

get_vote_score = function (_module, _query, _callback) {
    get_vote_module_query_score(_module, _query, function (_module_query_score) {
        get_vote_module_score(_module, function (_module_score) {
            //console.log([_module_score, _module_query_score]);
            var _score = _module_score * CONFIG.vote_weight.module_score
                    + _module_query_score * CONFIG.vote_weight.query_score;
            //console.log(_score);
            _callback(_score);
        });
    });
};

// --------------------------------

set_vote_score = function (_module, _query, _score) {
    var _uuid = get_uuid();
    var _find_options = {
        where: {
            referer_host: get_referer_host(),
            moduel: _module,
            query: _query,
            uuid: _uuid
        },
        order: [["date", "DESC"]]
    };
    
    tableVote.findOne(_find_options)
        .then(function (_vote) {
            if (_vote === null) {
                _vote = {
                    date: Date.now(),
                    referer_host: get_referer_host(),
                    module: _module,
                    query: _query,
                    uuid: _uuid,
                    score: _score
                };
                tableVote(_vote);
            }
            else {
                tableVote.update({
                    date: Date.now(),
                    score: _score
                }, _find_options);
            }
        });
};