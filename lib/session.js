session = require('express-session');
app.set('trust proxy', 1); // trust first proxy
app.use( session({
        // https://github.com/expressjs/session/issues/56
        secret : CONFIG.secret,
        name : 'sessionId',
        resave: true,
        proxy: true,
        saveUninitialized: true
    })
);