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
/*
app.use(session({
    secret: CONFIG.secret,
    resave: true,
    // unset: 'destroy',
    domain: 'pc.pulipuli.info:3000',
    saveUninitialized: false,
    cookie:  {
        // path: '/',
        domain: 'pc.pulipuli.info:3000',
        maxAge: 24 * 6 * 60 * 10000
    },
    //store: new MongoStore({url: config.db, autoReconnect:true})
}));
*/