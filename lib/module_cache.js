
require("../config/database.js");

module_cache_get = function (_url, _expire, _callback) {
    if (typeof(_expire) === "function") {
        _callback = _expire;
        _expire = undefined;
    }
    if (_expire === undefined) {
        _expire = CONFIG.module_cache_expire_hour * 60 * 60 * 1000;
    }
    
    if (_expire === 0 || _expire < 0) {
        _callback(false);
        return;
    }
    
    tableModuleCache.findOne({
        where: {
            url: _url
        },
        order: [["date", "DESC"]]
    }).then(function (_cache) {
        if (_cache !== null) {
            //console.log([Date.now(), _cache.date, (Date.now() - _cache.date), _expire]);
        }
        else {
            console.log("module cache is not found.");
        }
        
        if (_cache === null
                || (Date.now() - _cache.date) > _expire) {
            _callback(false);
        }
        else {
            console.log("module cache get from: " + _url);
            _callback(_cache.response);
        }
    });
};

// ------------------------

module_cache_set = function (_url, _response, _error, _callback) {
    
    if (typeof(_error) === "function") {
        _callback = _error;
        _error = null;
    }
    
    if (CONFIG.module_cache_expire_hour === 0 || CONFIG.module_cache_expire_hour < 0) {
        if (typeof(_callback) === "function") {
            _callback();
        }
        return;
    }
    
    var _find_options = {
        where: {
            url: _url,
            response: _response,
            error: _error
        },
        order: [["date", "DESC"]]
    };
    
    var _then = function () {
        console.log("module cache set from: " + _url);
        //console.log("response: " + _response.substr(0, 500));
        if (typeof(_callback) === "function") {
            _callback();
        }
    };
    
    tableModuleCache.findOne(_find_options).then(function (_cache) {
        if (_cache === null) {
            _cache = {
                date: Date.now(),
                url: _url,
                response: _response,
                error: _error
            };
            tableModuleCache.create(_cache).then(_then);
        }   //if (_cache === null) {
        else {
            tableModuleCache.update({
                date: Date.now(),
                response: _response,
                error: _error
            }, _find_options).then(_then);
        }   //else {
    });
};