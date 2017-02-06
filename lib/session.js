session = require('express-session');
app.set('trust proxy', 1); // trust first proxy
app.use( session({
   secret : CONFIG.secret,
   name : 'sessionId',
  })
);