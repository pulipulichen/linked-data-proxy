# linked-data-proxy

# Instruction

1. 執行 start_app.bat
2. http://localhost:3000/zh.wikipedia.org/查詢
3. http://localhost/linked-data-proxy/referer.php

# TODO
- 查詢真的wikipedia: https://zh.wikipedia.org/w/index.php?title=%E6%95%B8%E4%BD%8D%E5%9C%96%E6%9B%B8%E9%A4%A8&oldformat=true&printable=yes
- 查詢一個會擋人的頁面
- 白名單功能
- 要讓ga記錄user-id

# npm
npm install universal-analytics --save
npm install follow-redirects --save
npm install node-uuid --save
npm install cookies --save

# REFERENCE

- http://expressjs.com/zh-tw/guide/routing.html
- http://docs.sequelizejs.com/en/v3/docs/models-usage/
- universal-analytics: https://github.com/peaksandpies/universal-analytics
- GA: https://analytics.google.com/analytics/web/#report/defaultid/a46464710w135478152p139632692/
- GA即時: https://analytics.google.com/analytics/web/#realtime/rt-content/a46464710w135478152p139632692/