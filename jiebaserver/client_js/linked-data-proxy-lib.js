/**
 * 要加入自動標註的範圍，以CSS選取器運作
 * @type String
 */
var CONTENT_SELECTOR = ".content";

var URL_LDP = "http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3258";
//var URL_LDP="http://pc.pulipuli.info:3000";
//var URL_JIEBA="http://localhost:8000";
var URL_JIEBA = "http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253";

//var URL_BASE = "http://localhost:8000/";
var URL_BASE = "http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253/";

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

/**
 * 段落內容長度切割上限
 * @type Number
 */
var CONTENT_SPLIT_LIMIT = 5000;

// ----------------------------


var AUTOANNO = {};


cache_id = undefined;
var SELECT_TEXT;

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

// ----------------------------------
/**
 * 使用iframe來傳送post的方法
 * @param {String} _url
 * @param {JSON} _data
 * @param {function} _callback
 * @returns {undefined}
 */
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
    return this;
};

// ----------------------------

/**
 * iframe post完的的回呼函數
 * @param {JSON} result
 * @returns {AUTOANNO}
 */
AUTOANNO.iframe_post_callback = function (_result, _callback) {
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
                
                // 改用callback取代
                //$(CONTENT_SELECTOR).html(result);
                //AUTOANNO._setup_tooltip();

                if (typeof(_callback) === "function") {
                    _callback(result);
                }
            }
        });
    };

    setTimeout(function () {
        _retry();
    }, 100);
    
    return this;
};

// -----------------------

/**
 * 設定tooltip
 * @returns {AUTOANNO}
 */
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
    


    $(CONTENT_SELECTOR).mouseup(function () {
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
    
    return this;
};

// -----------------------------

/**
 * 查詢字詞
 * @param {Object} instance
 * @param {Boolean} add_term_mode
 * @param {Function} callback
 * @returns {AUTOANNO}
 */
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
                /*$("revealcheck").onchange(function(){
                    ga_mouse_click_event_trigger(this, ".revealcheck", "revealed" , "revealed", "mouse_click");
                });*/
                _fieldset.hide();
                //_fieldset.append(_addterm_button);
                _result.append(_fieldset);
            }
        }  //end of for loop
        _result.find("fieldset:first").show();
        callback(_result);
    });
    
    return this;
};

//---------------------------------------------------

/**
 * 載入CSS
 * @param {String} _path
 * @returns {AUTOANNO}
 */
AUTOANNO.load_css = function (_path) {
    $(function () {
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', URL_BASE + _path));
    });
    return this;
};

/**
 * 載入JavaScript
 * @param {String} _path
 * @param {String} _id
 * @returns {AUTOANNO}
 */
AUTOANNO.load_js = function (_path, _id) {
    $(function () {
        $('head').append($('<scri' + 'pt type="text/javascri' + 'pt" />').attr('src', URL_BASE + _path).attr('id', _id));
    });
    return this;
};

/**
 * 確認是否有jQuery在，否則載入jQuery
 * @param {Function} _callback
 * @returns {AUTOANNO}
 */
AUTOANNO.check_jquery = function (_callback) {
    if (typeof ($) === "function") {
        _callback();
    }
    else {
        var _jquery_path = URL_BASE + "client/js/" + "jquery.js";
        AUTOANNO.getScript(_jquery_path, _callback);
    }
    return this;
};

//-------------------------

/**
 * 載入JavaScript檔案，用JavaScript原生的方法
 * @param {String} source JavaScrtip的網址
 * @param {Function} callback
 * @returns {AUTOANNO}
 */
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
    return this;
};

//---------------------------------------------------

/**
 * 初始化
 * @returns {AUTOANNO}
 */
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
        
        // 為了避免這邊傳送資料太多，有必要作調整
//        var _content = $(CONTENT_SELECTOR).html();
//        var _url = URL_JIEBA + "/parse_article";
//        var _data = {
//            article: _content
//        };
//        var _callback = function (_result) {
//            AUTOANNO.iframe_post_callback(_result, function (_result) {
//                $(CONTENT_SELECTOR).html(_result);
//                AUTOANNO._setup_tooltip();
//            });
//        };
//        AUTOANNO.iframe_post(_url, _data, _callback);
        
        AUTOANNO._batch_parse_content(CONTENT_SELECTOR, function () {
            AUTOANNO._setup_tooltip();
        });

        // $.getScript("")
    });
    return this;
};

/**
 * 避免一次傳送太多資料，變成一段一段載入資料吧
 * @param {String} _selector
 * @param {Function} _callback
 * @returns {AUTOANNO}
 */
AUTOANNO._batch_parse_content = function (_selector, _callback) {  
    //var _result = "";
    var _end_loop = function () {
        //_callback(_result);
        _callback();
    };
    
    var _contents = $(_selector);
    
    
    // ------------------------------
    
    var _loop = function (_i) {
        if (_i < _contents.length) {
            var _object_html = _contents.eq(_i).html();
            
            var _content_array = AUTOANNO._split_content_to_array(_object_html);
            console.log("第" + (_i+1) + "個元素切割成" + _content_array.length + "份資料，準備送出...");
            // 這樣子，就會整理出一個_article_data的陣列
            // 然後試著送出去吧
            
            AUTOANNO._batch_parse_batch_send(_content_array, function (_content_result) {
                //_result = _result + _content_result;
                _contents.eq(_i).html(_content_result);
                
                // 下一個迴圈
                _i++;
                _loop(_i);
            });
        }
        else {
            _end_loop();
        }
    };
    
    _loop(0);
    
    return this;
};

/**
 * 將過長的內容切割成陣列
 * @param {String} _object_html
 * @returns {Array}
 */
AUTOANNO._split_content_to_array = function (_object_html) {
    // 切割裡面的內容
    var _content_array = [];
    if (_object_html.length < CONTENT_SPLIT_LIMIT) {
        // 用 換行 切割
        _content_array.push(_object_html);
    }
    else {
        while (_object_html.length > CONTENT_SPLIT_LIMIT) {
            var _pos = _object_html.indexOf("\n", CONTENT_SPLIT_LIMIT);
            var _content = _object_html.substr(0, _pos);
            _content_array.push(_content);
            _object_html = _object_html.substring(_pos, _object_html.length);
        }
        
        if (_object_html !== "") {
            _content_array.push(_object_html);
        }
    }
    return _content_array;
};

/**
 * 
 * @param {Array} _content_array
 * @param {Function} _callback
 * @returns {AUTOANNO}
 */
AUTOANNO._batch_parse_batch_send = function (_content_array, _callback) {
    var _result = "";
    var _end_loop = function () {
        _callback(_result);
    };
    
    var _url = URL_JIEBA + "/parse_article";
    var _loop = function (_i) {
        if (_i < _content_array.length) {
            var _content = _content_array[_i];
            var _data = {
                article: _content
            };
            AUTOANNO.iframe_post(_url, _data, function (_result_part) {
                AUTOANNO.iframe_post_callback(_result_part, function (_result_part) {
                    console.log("收到第" + (_i+1) + "份資料: " + _result_part.substr(0, 100) + "...");
                    _result = _result + _result_part;
                    
                    _i++;
                    _loop(_i);
                });
            });
        }
        else {
            _end_loop();
        }
    };
    
    _loop(0);
    return this;
};

// ---------------------------

/**
 * 開始初始化
 */
AUTOANNO.check_jquery(function () {
    console.log("init");
    AUTOANNO.init();
});

