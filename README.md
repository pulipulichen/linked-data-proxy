# linked-data-proxy

# Instruction

1. 執行 start_app.bat
2. http://localhost:3000/zh.wikipedia.org/查詢
3. http://localhost/linked-data-proxy/usage-example.html

# TODO
- 查詢多個頁時，加分減分的做法？
    - set_vote_score
    - 在app後面加上set_vote_score
    - 測試set_vote_score
    - 加入event
- 查詢一個會擋人的資料庫
- 查詢需要post的資料庫

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