const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
$ = require('jquery')(window);

$.inArray = function (_item, _array) {
    if (typeof(_array.indexOf) === "function") {
        return _array.indexOf(_item)
    }
    else {
        return -1
    }
}

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
    
    //console.log(_ele.length);
    
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
