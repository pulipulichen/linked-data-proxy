check_term_not_in_cache = function (_search_terms, _callback) {
    if (typeof(_search_terms) !== "object" || _search_terms.length === 0) {
        _callback([]);
        return;
    }
    
    var _result = [];
    _search_terms = uniqle_array(_search_terms);
    var _temp = [];
    for (var _i = 0; _i < _search_terms.length; _i++) {
        var _term = _search_terms[_i].trim();
        if (_term !== "") {
            _temp.push(_term);
        }
    }
    _search_terms = _temp;
    
    tableCheckTerm.findAll({
        where: {
            term: {
                $or: _search_terms
            }
        }
    }).then(function (_cache_results) {
        var _cache_array = [];
        for (var _i = 0; _i < _cache_results.length; _i++) {
            _cache_array.push(_cache_results[_i].get("term"));
        }
        
        for (var _i = 0; _i < _search_terms.length; _i++) {
            var _term = _search_terms[_i];
            if (match_stopword(_term) === false 
                    && _in_array(_term, _cache_array) === -1) {
                _result.push(_term);
            }
        }
        setTimeout(function () {
            _callback(_result);
        }, 0);
    });
};

// --------------------------

_init_terms_into_check_cache = function (_terms, _callback) {
    if (typeof(_terms) !== "object" || _terms.length === 0) {
        _callback();
        return;
    }
    
    var _data = [];
    for (var _i = 0; _i < _terms.length; _i++) {
        _data.push({
            term: _terms[_i],
            existed: false
        });
    }
    
    tableCheckTerm.bulkCreate(_data).then(_callback);
};

// --------------------------

_update_terms_in_check_cache = function (_terms, _callback) {
    if (typeof(_terms) !== "object" || _terms.length === 0) {
        _callback();
        return;
    }
    
    tableCheckTerm.update(
        {existed: true},
        { where: {
            term: {
                $or: _terms
            }
        }
    }).then(function () {
        setTimeout(function () {
            _callback();
        }, 0);
    });
};

_check_terms_existed_in_cache = function (_search_terms, _callback) {
    //var _result = [];
    tableCheckTerm.findAll({
        where: {
            term: {
                $or: _search_terms
            },
            existed: true
        }
    }).then(function (_cache_results) {
        var _cache_array = [];
        for (var _i = 0; _i < _cache_results.length; _i++) {
            _cache_array.push(_cache_results[_i].get("term"));
        }
        _callback(_cache_array);
    });
};

// -----------------

uniqle_array = function(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
};

var _in_array = function(_value, _array) {
    if (typeof(_array) !== "object") {
        return -1;
    }
    
    for (var _i = 0; _i < _array.length; _i++) {
        if (_array[_i] === _value) {
            return _i;
        }
    }
    return -1;
};