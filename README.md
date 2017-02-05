# linked-data-proxy

# Instruction: Server startup

- 執行 start_app.bat

# Instruction: Localhost test
- http://localhost:3000/wiki.l/數位圖書館
- 使用範例: http://localhost/linked-data-proxy/usage-example.html

# Instruction: Client usage
## 查詢資料

```js
$.getJSON("http://localhost:3000/wiki.l/%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8%E9%A4%A8?callback=?", function (_data) {
    console.log(_data[0]["response"]);
});
```
## 投票

```js
$.get("http://localhost:3000/wiki.l/%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8%E9%A4%A8/10?callback=?");
```

# TODO
- CBDB 中國歷代人物傳記資料 (查詢需要post的資料庫)
    - http://db1.ihp.sinica.edu.tw/cbdbc/ttsweb?@0:0:1:cbdbkm@@0.6418999357457527
    - 沒資料 http://db1.ihp.sinica.edu.tw/cbdbc/cbdbkm?@@1790539330
- TGAZ
    - 
- 更新usage-example，要展示wiki, 萌典, CBDB, tgaz同時查詢
- 查詢一個會擋人的資料庫

# npm
- npm install universal-analytics --save
- npm install follow-redirects --save
- npm install node-uuid --save
- npm install cookies --save
- npm install http-post --save
- npm install querystring --save
- npm install iconv-lite --save

# REFERENCE
- https://github.com/pulipulichen/linked-data-proxy
- http://expressjs.com/zh-tw/guide/routing.html
- http://docs.sequelizejs.com/en/v3/docs/models-usage/
- universal-analytics: https://github.com/peaksandpies/universal-analytics
- GA: https://analytics.google.com/analytics/web/#report/defaultid/a46464710w135478152p139632692/
- GA即時: https://analytics.google.com/analytics/web/#realtime/rt-content/a46464710w135478152p139632692/