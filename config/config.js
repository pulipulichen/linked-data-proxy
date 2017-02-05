CONFIG = {
    // 連結埠 http://localhost:3000/
    port: 3000,
    
    // 快取過期：單位是小時
    //cache_expire_hour: 0.001, 
    cache_expire_hour: 0, 
    
    // 放行的白名單
    http_referer_allow_list: [
        "aaa"
    ],
    
    ga_track_code: "UA-46464710-11",
    
    web_crawler_default_options: {
        module: "test",
        url: "https://pulipulichen.github.io/blogger/posts/2017/01/wikipedia.html",
        encoding: "utf8",
        select_text: "#mw-content-text > p:first",
        user_agent: "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10"
    },
    
    // ----------------------------------------------
    // 偵錯工具
    database: {
        logging: false
    }
};