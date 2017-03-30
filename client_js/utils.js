LINK_DATA_PROXY = {};

LINK_DATA_PROXY.uuid;

LINK_DATA_PROXY.host;
LINK_DATA_PROXY.get_host = function () {
    if (LINK_DATA_PROXY.host !== undefined) {
        return LINK_DATA_PROXY.host;
    }
    
    var _scripts = $("script#link_data_proxy_utils");
    var _needle = "/utils.js";
    for (var _i = 0; _i < _scripts.length; _i++) {
        var _src = _scripts.eq(_i).attr("src");
        if (_src.substring( _src.length-_needle.length, _src.length ) === _needle) {
            LINK_DATA_PROXY.host = _src.substr(0, _src.length - _needle.length + 1);
            console.log(LINK_DATA_PROXY.host);
            return LINK_DATA_PROXY.host;
        }
    }
};

LINK_DATA_PROXY.check = function (_query, _modules, _callback) {
    if (typeof(_callback) !== "function") {
        return;
    }
    
    var _url = LINK_DATA_PROXY.get_host() + "check/" + _modules.join(",") + "?callback=?";
    var _data = {
        "query": _query
    };
        
    LINK_DATA_PROXY.iframe_post(_url, _data, function () {
    //    console.log(1);

        var _check = function () {
            $.getJSON(_url, function (_result) {
                //console.log(2);
                //console.log(_result);
                if (typeof(_result) !== "object") {
                    setTimeout(function () {
                        //console.log("wait");
                        _check();
                    }, 3000);
                }
                else {
                    //$("#check_result").html(_result.join(" "));
                    _callback(_result);
                }
            });
        };
        _check();

    });
};

LINK_DATA_PROXY.vote = function (_query, _module, _score, _callback) {
    LINK_DATA_PROXY.check_uuid(function () {
        var _url = LINK_DATA_PROXY.get_host() + _module + "/" + encodeURI(_query) + "/" + _score + "?callback=?";
        $.getJSON(_url, _callback);
    });
};

LINK_DATA_PROXY.query = function (_query, _modules, _callback) {
    LINK_DATA_PROXY.check_uuid(function () {
        var _url = LINK_DATA_PROXY.get_host() + _modules.join(",") + "/" + encodeURI(_query) + "?callback=?";
        $.getJSON(_url, _callback);
    });
};

LINK_DATA_PROXY.check_uuid = function (_callback) {
    var _url = LINK_DATA_PROXY.get_host() + "uuid";
    LINK_DATA_PROXY.iframe_post(_url, _callback);
};

LINK_DATA_PROXY.iframe_post = function (_url, _data, _callback) {
    
    if (typeof(_data) === "function" && typeof(_callback) === "undefined") {
        _callback = _data;
        _data = {};
    }
    else if (typeof(_data) === "undefined") {
        _data = {};
    }
    
    var _id = "iframe_post" + (new Date()).getTime();
    var _body = $("body");
    var _form = $('<form action="' + _url + '" method="post" target="' + _id +  '"></form>')
            .hide().appendTo(_body);
    var _iframe = $('<iframe name="' + _id + '"></iframe>')
            .hide().appendTo(_body);
    
    for (var _key in _data) {
        var _value = _data[_key];
        
        $('<input type="hidden" name="' + _key + '" value="' + _value + '" />')
                .appendTo(_form);
    }
    
    _iframe.load(function () {
        setTimeout(function () {
            _iframe.remove();
            if (typeof(_callback) === "function") {
                _callback();
            }
        }, 100);
    });
    
    setTimeout(function () {
        _form.submit();
    }, 100);
    
};