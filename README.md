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
- 找不到的類型與資料庫加入GA記錄
- 部屬到OpenVZ: 有點懶...
    - 設定git
    - 重新啟動
    - 上傳到Google Drive 備份
- 查詢一個會擋人的資料庫 (google跟cbdb都會擋人，過不去)

# OpenVZ的Node.js部屬教學
- 範本 ubuntu-14.04-x86_64.tar.gz
- sudo apt-get update
- sudo apt-get install curl -y
- curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
- sudo apt-get install -y nodejs
- npm設定請看npm_install.sh
- apt-get install -y git
- wget https://pulipulichen.github.io/linked-data-proxy/git_init.sh
- bash git_init.sh
    - 確認yes

# GA
- 要啟用User-ID
- 要自訂維度UUID

# 建立新的Module
請參考/proxy_module/zh.wikipedia.org/裡面的檔案設置

# REFERENCE
- https://github.com/pulipulichen/linked-data-proxy
- http://expressjs.com/zh-tw/guide/routing.html
- http://docs.sequelizejs.com/en/v3/docs/models-usage/
- universal-analytics: https://github.com/peaksandpies/universal-analytics
- GA: https://analytics.google.com/analytics/web/#report/defaultid/a46464710w135478152p139632692/
- GA即時: https://analytics.google.com/analytics/web/#realtime/rt-content/a46464710w135478152p139632692/

# LICENSE

MIT License

Copyright (c) 2017 Pulipuli Chen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
