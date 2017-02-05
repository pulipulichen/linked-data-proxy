get_vote_module_query_score = function (_module, _query, _callback) {
    var _where = {
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