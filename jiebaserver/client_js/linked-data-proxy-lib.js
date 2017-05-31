var AUTOANNO = {};


var SELECTOR = ".content";
cache_id = undefined;
var SELECT_TEXT;

var URL_LDP = "http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:32580";
//var URL_LDP="http://pc.pulipuli.info:3000";
//var URL_JIEBA="http://localhost:8000";
var URL_JIEBA = "http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:32543";

//var URL_BASE = "http://localhost:8000/";
var URL_BASE = "http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:32543/";

/**
 * @author Pulipuli Chen 20170526
 */
if (location.href.indexOf("localhost:8000") > -1) {
    URL_LDP = "http://localhost:3000";
    URL_JIEBA = "http://localhost:8000";
    URL_BASE = "http://localhost:8000/";
}

var MODULE_NAME = {
    "zh.wikipedia.org": "維基百科",
    "www.moedict.tw": "萌典",
    "cdict.net": "英漢字典",
    "maps.cga.harvard.edu": "TGAZ",
    "cbdb.fas.harvard.edu": "CBDB"
};
var MODULE_SYMBOL = {
    "zh.wikipedia.org": "wiki",
    "www.moedict.tw": "moedict",
    "cdict.net": "cdict",
    "maps.cga.harvard.edu": "tgaz",
    "cbdb.fas.harvard.edu": "cbdb"
};

AUTOANNO.css_list = [
    'client/css/style.css',
    'client/css/tooltipster.bundle.min.css',
    'client/css/tooltipster-sideTip-noir.min.css'
];
AUTOANNO.js_list = {
    "client/js/utils.js": "link_data_proxy_utils",
    "client/js/tooltipster.bundle.min.js": "tooltipster.bundle.min.js",
    "client/js/rangy-core.js": "rangy-core.js"
};



AUTOANNO.iframe_post = function (_url, _data, _callback) {

    var _DEBUG = false;

    if (typeof (_data) === "function" && typeof (_callback) === "undefined") {
        _callback = _data;
        _data = {};
    }
    else if (typeof (_data) === "undefined") {
        _data = {};
    }

    var _id = "iframe_post" + (new Date()).getTime();
    var _body = $("body");
    var _form = $('<form action="' + _url + '" method="post" target="' + _id + '"></form>')
            .hide().appendTo(_body);
    var _iframe = $('<iframe name="' + _id + '"></iframe>')
            .hide()
            .appendTo(_body);
    if (_DEBUG === true) {
        _iframe.show();
    }

    for (var _key in _data) {
        var _value = _data[_key];

        $('<input type="hidden" name="' + _key + '" />')
                .val(_value)
                .appendTo(_form);
    }

    _iframe.bind("load", function () {
        setTimeout(function () {
            if (_DEBUG !== true) {
                _iframe.remove();
            }

            if (typeof (_callback) === "function") {
                _callback();
            }
        }, 100);
    });

    setTimeout(function () {
        _form.submit();
    }, 100);

};

AUTOANNO.iframe_post_callback = function (result) {
    if (location.href.indexOf("&init_close=true") > -1) {
        setTimeout(function () {
            window.close();
        }, 1000);
    }
    
    //console.log(cache_id);
    var _url = URL_JIEBA + "/parse_article?callback=?";
    var _retry = function () {

        $.getJSON(_url, function (data) {
            if (data === null) {
                setTimeout(function () {
                    console.log("再次查詢");
                    _retry();
                }, 10000);
                return;
            }
            else if (typeof (data) === "number") {
                _url = URL_JIEBA + "/parse_article?cache_id=" + data + "&callback=?";
            }

            var result = data.result;
            cache_id = data.cache_id;
            if (result === undefined || result === null) {
                setTimeout(function () {
                    console.log("再次查詢");
                    _retry();
                }, 10000);
                return;
            }
            else {
                //console.log(result);
                $(SELECTOR).html(result);

                AUTOANNO._setup_tooltip();

            }
        });
    };

    setTimeout(function () {
        _retry();
    }, 100);
};

AUTOANNO._setup_tooltip = function () {

    var _TOOLTIP_LOCK = false;
    var _TOOLTIP_CONTENT;
    $('.autoanno_tooltip').tooltipster({
        //maxWidth: 400,
        contentAsHTML: true,
        interactive: true,
        trigger: 'click',
        theme: 'tooltipster-noir',
        //contentCloning: true,
        functionBefore: function (instance, helper) {
            if (_TOOLTIP_LOCK === true) {
                instance.close(function () {
                    _TOOLTIP_LOCK = false;
                    $(helper.origin).click();
                });
                return false;
            }
            else {
                //setTimeout(function() {
                _TOOLTIP_CONTENT = $('<div style="text-align:center;margin-top: calc(25vh - 15px - 0.5rem)"><img src="' + URL_BASE + 'client/js/loading.gif" /><br     />Loading</div>');
                //$("#linked_data_proxy_result").append(_TOOLTIP_CONTENT);
                $(".tooltipster-content").append(_TOOLTIP_CONTENT);

                setTimeout(function () {
                    var _add_term_mode = false;
                    var _query_text = helper.origin;
                    if (SELECT_TEXT !== undefined) {
                        _query_text = SELECT_TEXT;
                        _add_term_mode = true;
                        SELECT_TEXT = undefined;
                    }

                    AUTOANNO.query(_query_text, _add_term_mode, function (_result) {
                        _TOOLTIP_CONTENT = _result;
                        //(helper.tooltip).find(".tooltipster-content").html(_TOOLTIP_CONTENT);
                        $("#linked_data_proxy_result").html(_TOOLTIP_CONTENT);
                        $(".tooltipster-content").html(_TOOLTIP_CONTENT);

                    });
                    //console.log(_query_text);
                }, 0);

            }
        },
        functionReady: function (instance, helper) {
            $(".tooltipster-content").html(_TOOLTIP_CONTENT);
            _TOOLTIP_LOCK = true;
            //instance.disable();
        }
    });

    rangy.init();
    console.log("ready");
    
    if (location.href.indexOf("&finish_close=true") > -1) {
        setTimeout(function () {
            window.close();
        }, 500);
    }
    
    $(".loadingbar").hide();
    $.getScript("/client/js/exp-linked-data-proxy-2017.dlll.nccu.edu.tw.js");
    


    $(SELECTOR).mouseup(function () {
        var sel = rangy.getSelection();
        var _selection_text = sel.toString().trim();
        if (_selection_text !== "") {
            console.log("顯示tooltip,載入:" + _selection_text);
            SELECT_TEXT = _selection_text;
            //console.log(sel.getRangeAt(0).getDocument());
            //$(sel.getRangeAt(0)).click();
            $(sel.focusNode.parentElement).click();
        }
    });
};

AUTOANNO.query = function (instance, add_term_mode, callback) {
    var ts;
    if (typeof (instance) === "object") {
        ts = $(instance).text();
    }
    else {
        ts = instance;
    }
    var ts_trim = ts.replace(/(?:\\[rnt]|[\r\n\t　]+)+/g, "").split(" ").join("").trim();
    ga_mouse_click_event_trigger(this, ".autoanno_tooltip", ts_trim, "searched", "mouse_click");



    var _url = URL_LDP + "/wiki,moedict,cbdb,tgaz,cdict,pixabay/" + ts_trim + "?callback=?";
    $.getJSON(_url, function (_data) {
        var _result = $("<div></div>");
        var _que = $("<div></div>").addClass("que").appendTo(_result);
        var _menu = $("<div></div>").addClass("menu").appendTo(_result);

        var _que_text = '<h2 class="tooltip_title">查詢字詞: ' + ts_trim + '</h2>';
        _que.append(_que_text);

        if (add_term_mode === true) {
            var _addterm_button = $('<input type="button" id="term" class=".term-add-button" data-term="' + ts_trim + '" value="添加新詞">');
            _addterm_button.css({
                "float": "right"
            });
            _addterm_button.click(function () {
                var term_value = $(this).data("term");
                var term_value_trim = term_value.replace(/(?:\\[rnt]|[\r\n\t　]+)+/g, "").split(" ").join("").trim();
                if (window.confirm('確認將「' + term_value_trim + '」加入斷詞詞庫?')) {
                    $.getJSON(URL_JIEBA + "/add_term?callback=?", {term: term_value, cache_id: cache_id}, function (result) {

                    });
                    $.getJSON(URL_LDP + "/add_term?callback=?", {term: term_value, cache_id: cache_id}, function (result) {
                        ga_mouse_click_event_trigger(this, ".term-add-button", term_value_trim, "collaboration", "mouse_click");
                    });

                }
            });

            _addterm_button.prependTo(_que);
        }

        for (var _i = 0; _i < _data.length; _i++) {
            var _d = _data[_i];
            var _module = _d.module;
            if (typeof (_d.response) === "string") {
                var _response = _d.response;
                var _name = _module;
                if (typeof (MODULE_NAME[_module]) === "string") {
                    _name = MODULE_NAME[_module];
                    _symbol = MODULE_SYMBOL[_module];
                }
                var _menu_button = $('<button type="button" data-module="' + _module + '" class="module-select-button">' + _name + '</button>');
                _menu_button.click(function (event) {
                    _result.find("fieldset").hide();
                    var _data_module = $(this).data("module");
                    var _term = $(this).parents(".tooltipster-content:first").find(".tooltip_title:first").text().trim();

                    _result.find('fieldset[data-module="' + _data_module + '"]').show();

                    // GA event
                    // ga_mouse_click_event_trigger(_obj, _selector, _name, _event_type, _event_key)
                    ga_mouse_click_event_trigger(this, ".module-select-button", _data_module + ": "+ _term , "watched", "mouse_click");
                });

                _menu.append(_menu_button);
                if (add_term_mode === true) {
                    var _fieldset = $("<fieldset data-module='" + _module + "'><legend>" + _name + "</legend>" + _response + "</fieldset>");

                }
                else {
                    var _fieldset = $("<fieldset data-module='" + _module + "'><legend>" + _name + "</legend>" + _response + "</fieldset>");
                    var _legend = _fieldset.find("legend");
                    var _plus_button = $('<button type="button" id="plus" class="evaluate-plus-button"> 有幫助 </button>')
                            .appendTo(_legend);
                    _plus_button.click(function () {

                        //------------------------
                        var _term = $(this).parents(".tooltipster-content:first").find(".tooltip_title:first").text().trim();
                        var _module = $(this).parents("fieldset:first").data("module");
                        var _module_name = $(this).parents("fieldset:first").data("module");
                        if (typeof (MODULE_SYMBOL[_module]) === "string") {
                            _module = MODULE_SYMBOL[_module];
                            _module_name = MODULE_NAME[_module_name];
                        }
                        ga_mouse_click_event_trigger(this, ".evaluate-plus-button", _term + " : " + _module, "liked", "mouse_click");
                        //ts = encodeURIComponent(ts);
                        $.getJSON(URL_LDP + "/" + _module + "/" + ts + "/1?callback=?", function (result) {

                        });
                        window.alert('提高「' + ts + '」標註資料中' + '「' + _module_name + '」顯示順序之權重');
                        //------------------------
                    });
                    var _minus_button = $('<button type="button" id="minus" class="evaluate-minus-button"> 沒有幫助 </button>').appendTo(_legend);
                    _minus_button.click(function () {
                        var _term = $(this).parents(".tooltipster-content:first").find(".tooltip_title:first").text().trim();
                        var _module = $(this).parents("fieldset:first").data("module");
                        var _module_name = $(this).parents("fieldset:first").data("module");
                        if (typeof (MODULE_SYMBOL[_module]) === "string") {
                            _module = MODULE_SYMBOL[_module];
                            _module_name = MODULE_NAME[_module_name];
                        }
                        ga_mouse_click_event_trigger(this, ".evaluate-minus-button", _term + " : " + _module, "disliked", "mouse_click");
                        $.getJSON(URL_LDP + "/" + _module + "/" + ts + "/-1?callback=?", function (result) {

                        });
                        window.alert('降低「' + ts + '」標註資料中' + '「' + _module_name + '」顯示順序之權重');
                    });

                }
                _fieldset.find('div:last > a[target="_blank"]').click(function(){
                    var _term = $(this).parents(".tooltipster-content:first").find(".tooltip_title:first").text().trim();
                    var _source_name = $(this).text().trim();
                    var _source_uri = $(this).attr("href");
                    ga_mouse_click_event_trigger(this, ".evaluate-minus-button", _term + " : " + _source_name + " : " +_source_uri , "referenced", "mouse_click");
                });
                $("revealcheck").onchange(function(){
                    ga_mouse_click_event_trigger(this, ".revealcheck", "revealed" , "revealed", "mouse_click");
                });
                _fieldset.hide();
                //_fieldset.append(_addterm_button);
                _result.append(_fieldset);
            }
        }  //end of for loop
        _result.find("fieldset:first").show();
        callback(_result);
    });
};

//---------------------------------------------------

AUTOANNO.load_css = function (_path) {
    $(function () {
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', URL_BASE + _path));
    });
};

AUTOANNO.load_js = function (_path, _id) {
    $(function () {
        $('head').append($('<scri' + 'pt type="text/javascri' + 'pt" />').attr('src', URL_BASE + _path).attr('id', _id));
    });
};

AUTOANNO.check_jquery = function (_callback) {
    if (typeof ($) === "function") {
        _callback();
    }
    else {
        var _jquery_path = URL_BASE + "client/js/" + "jquery.js";
        AUTOANNO.getScript(_jquery_path, _callback);
    }
};

AUTOANNO.getScript = function (source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onload = script.onreadystatechange = function (_, isAbort) {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            script = undefined;

            if (!isAbort) {
                if (callback)
                    callback();
            }
        }
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
};

//---------------------------------------------------




AUTOANNO.init = function () {

    for (var _i = 0; _i < AUTOANNO.css_list.length; _i++) {
        AUTOANNO.load_css(AUTOANNO.css_list[_i]);
    }

    // ----------------------


    var _key_list = [];
    for (var _key in AUTOANNO.js_list) {
        _key_list.push(_key);
    }

    for (var _i = 0; _i < _key_list.length; _i++) {
        var _path = _key_list[_i];
        var _id = AUTOANNO.js_list[_path];
        AUTOANNO.load_js(_path, _id);
    }

    // ----------------------

    $(function () {
        // 網頁讀取完成之後才會做
        $('<div class="autoanno_tooltip_templates"><span id="autoanno_tooltip_content"><div id="linked_data_proxy_result" style="width: 50vw;height: 50vh;max-height: 50vh; overflow-y: auto;"></div></span></div><div id="result"></div>').appendTo($("body"));
        var content = $(SELECTOR).html();
        AUTOANNO.iframe_post(URL_JIEBA + "/parse_article", {article: content}, AUTOANNO.iframe_post_callback);

        // $.getScript("")
    });
};

AUTOANNO.check_jquery(function () {
    console.log("init");
    AUTOANNO.init();
});

