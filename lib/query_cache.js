
require("../lib/database.js");

query_cache_get = function (_modules, _query, _expire, _callback) {
    if (typeof(_modules) === "object") {
        _modules = _modules.join(",");
    }
    
    if (typeof(_expire) === "function") {
        _callback = _expire;
        _expire = undefined;
    }
    if (_expire === undefined) {
        _expire = CONFIG.query_cache_expire_hour * 60 * 60 * 1000;
    }
    
    if (_expire === 0 || _expire < 0) {
        _callback(false);
        return;
    }
    
    tableQueryCache.findOne({
        where: {
            "modules": _modules,
            "query": _query
        },
        order: [["date", "DESC"]]
    }).then(function (_cache) {
        if (_cache !== null) {
            //console.log([Date.now(), _cache.date, (Date.now() - _cache.date), _expire]);
        }
        else {
            console.log("query cache is not found.");
        }
        
        if (_cache === null
                || (Date.now() - _cache.date) > _expire) {
            _callback(false);
        }
        else {
            console.log("query cache get from: " + _modules + " (" + _query + ")");
            _callback(_cache.response);
        }
    });
};

// ------------------------

query_cache_set = function (_modules, _query,_response, _error, _callback) {
    
    if (typeof(_modules) === "object") {
        _modules = _modules.join(",");
    }
    
    if (typeof(_error) === "function") {
        _callback = _error;
        _error = null;
    }
    
    if (CONFIG.query_cache_expire_hour === 0 || CONFIG.query_cache_expire_hour < 0) {
        if (typeof(_callback) === "function") {
            _callback();
        }
        return;
    }
    
    var _find_options = {
        where: {
            "modules": _modules,
            "query": _query,
            response: _response,
            error: _error
        },
        order: [["date", "DESC"]]
    };
    
    var _then = function () {
        console.log("query cache set from: " + _modules + " (" + _query + ")");
        //console.log("response: " + _response.substr(0, 500));
        if (typeof(_callback) === "function") {
            _callback();
        }
    };
    
    tableQueryCache.findOne(_find_options).then(function (_cache) {
        if (_cache === null) {
            _cache = {
                date: Date.now(),
                "modules": _modules,
                "query": _query,
                response: _response,
                error: _error
            };
            tableQueryCache.create(_cache).then(_then);
        }   //if (_cache === null) {
        else {
            tableQueryCache.update({
                date: Date.now(),
                response: _response,
                error: _error
            }, _find_options).then(_then);
        }   //else {
    });
};

// ------------------------------

query_cache_remove = function (_module, _query) {
    var _find_options = {
        where: {
            $or: [
                {"modules": {"$like": '%,' + _module}},
                {"modules": {"$like": _module + ',%'}},
                {"modules": {"$like": "%," + _module + ',%'}},
                {"modules": _module}
            ],
            "query": _query
        }
    };
    tableQueryCache.destroy(_find_options);
};