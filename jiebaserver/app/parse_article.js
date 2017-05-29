
// https://sequelize.readthedocs.io/en/v3/docs/models-usage/

var DEBUG = {
    enable_cache: true
};

/*var _modules = ["wiki","moedict","cbdb","tgaz","pixabay"];*/
//var URL = "http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw/check/wiki,moedict,cbdb,tgaz,cdict,pixabay/" ; 
//var URL = "http://pc.pulipuli.info:3000/check_post/wiki,moedict,cbdb,tgaz,cdict,pixabay/";
//var URL = "http://localhost:3000/check/wiki,moedict,cbdb,tgaz,cdict,pixabay/" ;
//var URL = "http://localhost:3000/check_post/wiki,moedict/" ;	// 給NodeJS本機端用
var URL = CONFIG.linked_data_proxy_check_url;	// 給NodeJS本機端用

// -----------------------

//var sub_array = [];     //for loop把temp_array裡的sub_array取出來依序丟到linked data proxy進行check
//var check_result_array = [];  //各個sub_array進行check後回傳的check_result_array
//var sub_result;         //各個check_result_array轉為string

var stopword = CONFIG.stopword;



// ------------------------
var _replace_br = false;

var GENERAL_DICT = require('../scripts/data/dictionary.js');

REQUEST_COUNT = 0;
REQUEST_COUNT_MAX = CONFIG.linked_data_proxy_request_max;
REQUEST_CACHE_ID = [];

// ------------------------

/**
 * @author moon
 * 接收來自client的資料
 */
app.post("/parse_article", function (req, res) {

    var article = req.body.article;
    
    
    var cookies = new Cookies(req, res);

    //console.log(article);
    //_write_log(article);

    tableArticleCache.findOrCreate({
        where: {
            article: article,
            processing: false
        }
    }).spread(function (articlecache, created) {

        // 2. 把暫存檔案的路徑放入COOKIE	
        var cache_id = articlecache.get('id');
        cookies.set("cache_id", cache_id);
        //console.log(created);
        //console.log(articlecache.get("result"));
        //console.log(articlecache.get({plain: true}));
        res.send("");
        if (created === true
                || articlecache.get("result") === null
                || articlecache.get("result") === "") {
            // 這裡...
            
            // 計算result是空值的數量
            _count_processing_null_result(function (_count) {
                console.log(["[" + cache_id + "] 正在查詢的數量: ", _count, CONFIG.linked_data_proxy_request_max]);
                if (_count < CONFIG.linked_data_proxy_request_max) {
                    
                    var _callback = function () {
                        _count_processing_null_result(function (_count) {
                            console.log(["[" + cache_id + "] 下一個 正在查詢的數量: ", _count, CONFIG.linked_data_proxy_request_max, '剩餘數量: ',REQUEST_CACHE_ID.length]);
                            if (_count < CONFIG.linked_data_proxy_request_max) {
                                _find_a_null_result_article(function (article, cache_id) {
                                    console.log(["[" + cache_id + "] 下一個", cache_id, '剩餘數量: ',REQUEST_CACHE_ID.length]);
                                    _article_cache_post_process(article, cache_id, _callback);
                                });
                            }
                        });  
                    };
                    
                    _article_cache_post_process(article, cache_id, _callback);
                }   // if (_count < CONFIG.linked_data_proxy_request_max) {
                else {
                    if (cache_id !== undefined && cache_id !== null) {
                        REQUEST_CACHE_ID.push(cache_id);
                        console.log(["[" + cache_id + "] 太多了，停止查詢", '剩餘數量: ',REQUEST_CACHE_ID.length]);
                    }
                }
            }); //_count_null_result(function (_count) {
        }
    });
    _article_cache_post_process(article);
});


// ----------------

var _article_cache_post_process = function (article, cache_id, _callback) {
    if (cache_id === undefined || cache_id === null) {
        return;
    } 
    
    REQUEST_COUNT++;
    var _a = article;
    if (_a.length > 100) {
        _a = _a.substr(0, 100) + "...";
    }
    console.log(["[" + cache_id + "] 現在進行:", _a]);
    // 先把它變成processing: true
    tableArticleCache.update(
            {processing: true},
            {where: {id: cache_id}}
    ).then(function () {
        // 3. 開始斷詞或其他的處理
        _process(article, cache_id, function (result) {
            // 4. 處理完之後放入暫存檔案 
            //console.log("4. 處理完之後放入暫存檔案 ");
            //console.log(result);
            REQUEST_COUNT--;
            tableArticleCache.update(
                    {
                        result: result,
                        processing: false
                    },
                    {where: {id: cache_id}}
            ).then(_callback);
        });
    });
};  // var _article_cache_post_process = function (article) {

/**
 * 計算沒查詢完的資料
 * @param {function} _callback
 */
var _count_processing_null_result = function (_callback) {
    _callback(REQUEST_COUNT);
    /*
    tableArticleCache.findAndCountAll({
        where: {
            result: null,
            processing: true
        }
    }).then(function (_count) {
        
        _callback(_count.count);
    });
    */
};

var _find_a_null_result_article = function (_callback) {
    var _cache_id = REQUEST_CACHE_ID.shift();
    tableArticleCache.findOne({
        where: {
            id: _cache_id,
            result: null,
            processing: false
        }
    }).then(function (_cache) {
        if (_cache !== null) {
            _callback(_cache.get("article"), _cache_id);
        }
    });
};

// ---------------------------------

/**
 * 處理斷詞
 * callback(result)
 */
var _process = function (article, cache_id, callback) {

    //callback("aaaaaaa12121212a" + article);
    //return;

    // ----------------------------------------

    

    // end of var _node_jieba_parsing_callback = function (_result) {
    // --------------------------


    //article = article.substr(0, 50);

    //article=article.replace(/\"/g, "");
    //article=article.replace(/(?:\\[rnt]|[\r\n\t]+)+/g, "");

    //console.log(article);
    //return;

    //console.log(_custom_dict);
    if (article.indexOf("<br>") > -1) {
        article = article.replace(/<br>/g, "\n");
        _replace_br = true;
    }

    node_jieba_parsing([GENERAL_DICT, _custom_dict], article, function (_result) {
        _node_jieba_parsing_callback(_result, cache_id, callback);
    });	// end of node_jieba_parsing([dict1, dict2], article, function (_result) {
}; // end of proces: var _process = function (article, callback) {

// --------------------------------------------

var _node_jieba_parsing_callback = function (_result, cache_id, callback) {
    //console.log(_result);
    //return;

    var temp_array = [];    //把斷完詞的array以每50個詞進行切分  切分為數個array ex:[[a,b,....],[c,d,....]]
    var joined_result = "";    //把每個sub_result結合起來 準備回傳給client

    //console.log(article);
    var BATCH_CHECK = CONFIG.batch_check;

    //for (var t = 0, len = _result.length; t < len; t += BATCH_CHECK) {
    //    temp_array.push(_result.slice(t, t + BATCH_CHECK));
    //}
    temp_array[0] = _result;    // 全部一個檔案傳就好了，不要花這麼多功夫切割

    // array: temp_array
    // limit: temp_array.length
    // callback: callback(joined_result);
    
    var _retry = 0;
    var sub_array = undefined;
    var _send_array = undefined;
    var sub_result = undefined;
    var _loop = function (_i) {
        if (_i < temp_array.length) {
            _retry = 0;
            sub_array = temp_array[_i];
            _find_terms_not_in_cache(sub_array, function (_send_array_temp) {
                _send_array = _send_array_temp;
                sub_result = _send_array.join(" ").trim();
                
                if (sub_array.length === 0
                    || sub_result === ""
                    || sub_result === undefined) {
                    _write_log(["沒有要查的資料", sub_array.length, sub_result]);
                    _parse_check_result_array(sub_array, [], function (sub_result) {
                        joined_result = joined_result + sub_result;
                        _i++;
                        _loop(_i);
                    });
                    return;
                }
                
                _do_loop(_i);
            });
        }
        else {
            // 結束了
            //console.log(joined_result);
            callback(joined_result);
        }
    };	// var _loop = function (_i) {

    
    var _do_loop = function (_i) {
        _write_log([cache_id, "送出...", _i + "/" + temp_array.length
            , '詞數:' + _send_array.length + "/" + sub_array.length
            , sub_result]);
        _init_terms_into_cache(_send_array, function () {
            request({
                url: URL,
                method: 'POST',
                json: {query: sub_result}
            }, function (error, response, body) {
                _post_request_callback(error, response, body, _i, sub_array);
            });
        });
    };  //var _do_loop = function (_i) {
    
    //---------------------------------
    
    var _post_request_callback = function (error, response, body, _i, sub_array) {
        if (body !== undefined && body !== null) {
            _write_log([cache_id, "收到check的回覆: (" + _i + "/" + temp_array.length + ")", body]);
        }

        //if (body === "nodata" || body === null || body === undefined) {
        if (body !== undefined && body !== null) {
            if (body === "nodata" || (body.length === 1 && body[0] === "nodata")) {
                body = [];
            }
        }
        
        if (!error
                && response.statusCode === 200
                && typeof (body) !== "undefined"
                && body !== "undefined") {
            //console.log(body.join(","));
            if (typeof (body) === "undefined"
                    && typeof (response.body) !== "undefined") {
                body = response.body;
            }
            
            _parse_check_result_array(sub_array, body, function (sub_result) {
                joined_result = joined_result + sub_result;
                _i++;
                _loop(_i);
                //REQUEST_COUNT--;
            }); 
        }
        else {
            _retry++;
            setTimeout(function () {
                //REQUEST_COUNT--;
                _do_loop(_i);
            }, _send_array.length * CONFIG.linked_data_proxy_request_max * 200 / _retry);
        }
    };  //var _post_request_callback = function (error, response, body, _i) {

    _loop(0);

};	//var _node_jieba_parsing_callback = function (_result) {



// ------------------------------

var _match_stopword = function (_query) {
    _query = _query.trim();
    var _count = _query.length;
    var _match_count = 0;
    
    for (var _i = 0; _i < _count; _i++) {
        var _char = _query.substr(_i, 1).trim();
        if (_char === "") {
            _match_count++;
        }
        else if (stopword.indexOf(_char) > -1) {
            _match_count++;
        }
    }
    
    return (_count === _match_count);
};

var _parse_check_result_array = function (sub_array, check_result_array, _callback) {
    var _result = [];
    //console.log(sub_array);
    if (check_result_array === undefined) {
        check_result_array = [];
    }
    
    // -----------------
    // 先把找到的check_result_array放入資料庫中
    _update_terms_in_cache(check_result_array, function () {
        _find_terms_existed_in_cache(sub_array, function (check_result_array) {
            _write_log(["準備整合", check_result_array.length + "/" + sub_array.length]);
            
            //if (check_result_array !== undefined) {
                for (var i = 0; i < sub_array.length; i++) {
                    if (sub_array[i] === "\n" && _replace_br === true) {
                        _result.push('<br />');
                        continue;
                    }

                    var found = false;
                    var _word = sub_array[i].replace(/(?:\\[rnt]|[\r\n\t]+)+/g, "").trim();
                    if (_word === ""
                            || _word === " "
                            || _word === "\n"
                            || _word === "\r"
                            || _word === "\t") {
                        _result.push(sub_array[i]);
                        continue;
                    }


                    for (var j = 0; j < check_result_array.length; j++) {
                        if (sub_array[i] === check_result_array[j]) {
                            found = true;
                            break;
                        }
                    }


                    if (found === true) {
                        if (sub_array[i].length > 1) {
                            _result.push('<span class="autoanno_vocabulary autoanno_tooltip autoanno_highlight" data-tooltip-content="#autoanno_tooltip_content">'
                                    + sub_array[i]
                                    + '</span>');
                        }
                        else {
                            _result.push('<span class="autoanno_vocabulary autoanno_tooltip" data-tooltip-content="#autoanno_tooltip_content">'
                                    + sub_array[i]
                                    + '</span>');
                        }
                    }
                    else {
                        _result.push('<span class="autoanno_vocabulary">'
                                + sub_array[i]
                                + '</span>');
                    }
                }   //for (var i = 0; i < sub_array.length; i++) {
            //}

            //console.log(sub_result);
            var sub_result = _result.join("");
            //console.log(sub_result);
            //return sub_result;
            _callback(sub_result);
        }); // _find_terms_existed_in_cache(sub_array, function (check_result_array) {
    }); //_update_terms_in_cache(check_result_array, function () {
    
            

};  //end of var _parse_check_result_array = function (sub_array, check_result_array)

getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
};


// -------------------------------------------

app.get("/parse_article", function (req, res) {

    // 1. 取得COOKIE
    var cache_id;
    if (typeof (req.query.cache_id) === "undefined") {
        var cookies = new Cookies(req, res);
        cache_id = cookies.get("cache_id");

    }
    else {
        cache_id = req.query.cache_id;
    }
    cache_id = parseInt(cache_id, 10);

    //console.log(cache_id);

    // 2. 取得暫存檔案
    tableArticleCache
            .findById(cache_id)
            .then(function (articlecache) {
                //console.log("ok");
                if (articlecache === null || articlecache.get("result") === null || articlecache.get("result") === "") {
                    // 3-1. IF 暫存檔案沒有資料: 回傳undefined
                    console.log(["client端請求， 沒資料 ID: ", cache_id]);
                    res.jsonp(cache_id);
                }
                else {
                    // 3-2. if 暫存檔案有資料
                    // 回傳資料
                    var _result = articlecache.get("result");
                    
                    var _r = _result;
                    if (_r.length > 100) {
                        _r = _r.substr(0, 100) + "...";
                    }
                    console.log(["完成" + _r]);

                    if (DEBUG.enable_cache === false) {
                        articlecache.destroy({force: true});
                    }

                    res.jsonp({
                        result: _result,
                        cache_id: cache_id
                    });
                }
            });
});

_in_array = function(_value, _array) {
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

uniqle_array = function(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
};

var _find_terms_not_in_cache = function(_search_terms, _callback) {
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
    
    tableTermCache.findAll({
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
            if (_match_stopword(_term) === false 
                    && _in_array(_term, _cache_array) === -1) {
                _result.push(_term);
            }
        }
        setTimeout(function () {
            _callback(_result);
        }, 0);
    });
};

var _init_terms_into_cache = function (_terms, _callback) {
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
    
    tableTermCache.bulkCreate(_data).then(_callback);
};

var _update_terms_in_cache = function (_terms, _callback) {
    if (typeof(_terms) !== "object" || _terms.length === 0) {
        _callback();
        return;
    }
    
    tableTermCache.update(
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

var _find_terms_existed_in_cache = function (_search_terms, _callback) {
    //var _result = [];
    tableTermCache.findAll({
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