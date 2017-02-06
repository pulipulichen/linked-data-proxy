CONFIG = {
    // 連結埠 http://localhost:3000/
    port: 3000,
    
    // 快取過期：單位是小時
    //module_cache_expire_hour: 0.001, 
    //query_cache_expire_hour: 0.001, 
    module_cache_expire_hour: 0, 
    query_cache_expire_hour: 0, 
    
    // 放行的白名單
    http_referer_allow_list: [
        "localhost",
        "yourserver",
    ],
    
    // 模組的別名
    module_alias: {
        "wiki": "zh.wikipedia.org",
        "wiki.l": "zh.wikipedia.org.localhost",
        "moedict": "www.moedict.tw",
        "cbdb": "cbdb.fas.harvard.edu",
        "tgaz": "maps.cga.harvard.edu",
        "cdict": "cdict.net",
        "pixabay": "pixabay.com",
    },
    
    // Google Analytics的編號
    ga_track_code: "UA-46464710-11",
    // uuid建立維度方法：http://blog.pulipuli.info/2016/11/googleid-how-to-send-user-ids-to-google.html
    ga_user_id_dimension: "dimension1",
    
    web_crawler_default_options: {
        module: "test",
        method: "get",
        payload: false,
        url: "https://pulipulichen.github.io/blogger/posts/2017/01/wikipedia.html",
        encoding: "utf8",
        //select_text: "#mw-content-text > p:first",
        header: {
            "User-Agent": "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10"
        }
    },
    
    vote_weight: {
        module_score: 1,
        query_score: 5
    },
    
    // ----------------------------------------------
    // 偵錯工具
    database: {
        //logging: true
        logging: false
    }
};