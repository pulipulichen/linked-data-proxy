app.use(require('cors')({
  origin: function (origin, callback) {
    callback(null, origin);
  },
  credentials: true
}));