CONFIG = {
    // 連結埠 http://localhost:3000/
    port: 3000,
    
    // 快取過期：單位是小時
    //module_cache_expire_hour: 0.001, 
    //query_cache_expire_hour: 0.001, 
    module_cache_expire_hour: 24*30, 
    query_cache_expire_hour: 24*30, 
    
    query_return_error: false,
    secret: 's3Cur3',
    
    /**
     * 白名單：只有一下server可以使用
     */ 
    referer_allow_list: [
        "localhost",
        "localhost:8005",
        "localhost:8000",
        "yourserver",
        "exp-linked-data-proxy-2017.dlll.nccu.edu.tw",
        "exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3258",
        "exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253",
        "http://140.119.25.194:10780",
        "test-linked-data-proxy-2017.dlll.nccu.edu.tw:3359",
        "http://140.119.25.235:10240",
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
    ga_debug: false,
    
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
    
    multi_request_limit: 40,
    
    stopword: ".,\/#!$%\^&\*;:{}=\-_`~()"
        + "«»/•† ‡¿№×‰ºª‱¶§|‖¦©℗®℠™¤​฿​​¢​₡​₢​$​₫​₯​​₠​€​ƒ​₣​​​₭​​₾​ℳ​₥​₦​₧​₱​₰​£​៛​​​₪​৳​​₮​₩​¥⁂❧☞‽◊⁀"
        + "\n\r。，<br>─「」；：:！？{}()[].0123456789"
        + "〇零一二三四五六七八九十月日時分"
        + "…、%％【】※『』 ㈠㈡　，、。．？！～＄％＠＆＃＊‧；︰…‥﹐﹒˙·﹔﹕‘’“”〝〞‵′〃├─┼┴┬┤┌┐╞═╪╡│▕└┘╭╮╰╯╔╦╗╠═╬╣╓╥╖╒╤╕║╚╩╝╟╫╢╙╨╜╞╪╡╘╧╛﹣﹦≡｜∣∥–︱—︳╴¯￣﹉﹊﹍﹎﹋﹌﹏︴﹨∕╲╱＼／↑↓←→↖↗↙↘〔〕【】﹝﹞〈〉﹙﹚《》（）｛｝﹛﹜『』「」＜＞≦≧﹤﹥︵︶︷︸︹︺︻︼︽︾︿﹀∩∪﹁﹂﹃﹄◎⊕⊙○●△▲▽▼☆★◇◆□■☎☏◐◑♡♥♣♧☻☺♠♤▪▫∴∵☜☞♫♬◊♦►◁∈∋◘◙♀♂♩♪☼￥〒￠￡※↔↕♨卍◈§♭＿ˍ▁▂▃▄▅▆▇█▏▎▍▌▋▊▉◢◣◥◤►◄▣▤▥▦▧▨▩▒░㊣㊟㊕㊗㊡㊝①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩１２３４５６７８９０〡〢〣〤〥〦〧〨〩十卄卅ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩανξοπρστυφχψωクラピカマニアチェックあなたのテスト≠〃てたこれまでキャンプシーズにかけるかがきいレャズンをえたコンパやすうなどすそビジネられていアウドアやにびせだも来つリビをしたとにオはわゅうごりよろしくそうまムペㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅥㅦㅧㅨㅩㅪㅫㅬㅭㅮㅯㅰㅱㅲㅳㅴㅵㅶㅷㅸㅹㅺㅻㅼㅽㅾㅿㆀㆁㆂㆃㆄㆅㆆㆇㆈㆉㆊ╳＋﹢－×÷＝≠≒∞ˇ±√⊥∠∟⊿㏒㏑∫∮∵∴ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩ˙ˊˇˋÄÃÇÊËÎÏÐÑÕÖÛÜãäêëîïõöŸŴŽŤŘŇĩħąčĤ",
    
    // ----------------------------------------------
    // 偵錯工具
    database: {
        //logging: true
        database: 'linked_data_proxy',
        user: 'linked_data_proxy',
        password: 'password',
        host: 'localhost',
        logging: false
    },
    
    // 重新轉址
    // 20170803 暫時想不到比較好的解法，先直接寫死在/app/redirect.js中
    //redirect_config: {
    //    'directory_ming': 'http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3253/directory_ming',
    //    'phppgadmin': "http://exp-linked-data-proxy-2017.dlll.nccu.edu.tw:3259/phppgadmin"
    //}
};
