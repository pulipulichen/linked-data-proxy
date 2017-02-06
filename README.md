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
- 正體字與簡體字轉換
- Yahoo字典
- 英英字典
- 圖片庫？
- 查詢一個會擋人的資料庫
- 部屬到OpenVZ

# npm
- npm install universal-analytics --save
- npm install follow-redirects --save
- npm install node-uuid --save
- npm install cookies --save
- npm install http-post --save
- npm install querystring --save
- npm install iconv-lite --save
- npm install request-promise --save
- npm install --save form-data

# GA
- 要啟用User-ID
- 要自訂維度UUID

# REFERENCE
- https://github.com/pulipulichen/linked-data-proxy
- http://expressjs.com/zh-tw/guide/routing.html
- http://docs.sequelizejs.com/en/v3/docs/models-usage/
- universal-analytics: https://github.com/peaksandpies/universal-analytics
- GA: https://analytics.google.com/analytics/web/#report/defaultid/a46464710w135478152p139632692/
- GA即時: https://analytics.google.com/analytics/web/#realtime/rt-content/a46464710w135478152p139632692/