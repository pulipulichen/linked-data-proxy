require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);
});

// -----------------------------------
/**
 * 取出HTML
 */
get_outer_html = function (_ele) {
    var _container = $("<div></div>");
    
    if (_ele.length === 1 && typeof(_ele[0].html) !== "function") {
        _ele = _ele[0];
    }
    if (typeof(_ele.length) === "undefined") {
        _ele = [_ele];
    }
    
    console.log(_ele.length);
    
    for (var _i = 0; _i < _ele.length; _i++) {
        var _e;
        if (typeof(_ele.eq) === "function") {
            _e = _ele.eq(_i);
        }
        else {
            _e = _ele[_i];
        }
        
        _container.append(_e);
    }
    
    var _output = _container.html();
    _output = _output.split("\n").join("");
    return _output;
};