var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))