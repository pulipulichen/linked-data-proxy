CONFIG = {
    // 連結埠 http://localhost:3000/
    port: 3000,
    
    // 快取過期：單位是小時
    cache_expire_hour: 0.001, 
    
    // 放行的白名單
    http_referer_allow_list: [
        "aaa"
    ],
    
    // ----------------------------------------------
    // 偵錯工具
    database: {
        logging: false
    }
};