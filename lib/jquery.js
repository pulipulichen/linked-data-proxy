const { JSDOM } = require( 'jsdom' );
jsdom = new JSDOM('<html></html>');
//$ = global.jQuery = require( 'jquery' );
$ = require('jquery')(jsdom.parentWindow);
$.inArray = function (_item, _array) {
    return _array.indexOf(_item)
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
