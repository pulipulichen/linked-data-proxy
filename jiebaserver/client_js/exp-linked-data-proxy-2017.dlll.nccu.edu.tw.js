/**
 * 適用網頁：http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:32543/directory_ming
 * 事件查詢表：
 * @author Pudding 20170203
 */

GA_TRACE_CODE = "UA-99869329-1";

var _local_debug = false;

if (_local_debug === true) {
    CSS_URL = "https://localhost/exp-linked-data-proxy-2017.dlll.nccu.edu.tw.css";
    LIB_URL = "https://localhost/ga_inject_lib.js";
    console.log("[LOCAL TEST MODE]");
}
else {
    
    var URL_BASE = "http://demo-linked-data-proxy-2017.dlll.nccu.edu.tw:3253";
    CSS_URL = URL_BASE + "/client/js/exp-linked-data-proxy-2017.dlll.nccu.edu.tw.js";
    LIB_URL = URL_BASE + "/client/js/ga_inject_lib.js";
}


var exec = function () {
    //ga_mouse_click_event('.autoanno_tooltip', "searched");
    /*
    ga_mouse_click_event('button[data-module="zh.wikipedia.org"]', "watched");
    ga_mouse_click_event('button[data-module="www.moedict.tw"]', "watched");
    ga_mouse_click_event('button[data-module="cdict.net"]', "watched");
    ga_mouse_click_event('button[data-module="cbdb.fas.harvard.edu"]', "watched");
    ga_mouse_click_event('button[data-module="maps.cga.harvard.edu"]', "watched");
    */
};

// --------------------------------------

$(function () {
    $.getScript(LIB_URL, function () {
        ga_setup(function () {
            exec();
        });
    });
});