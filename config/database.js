var Sequelize = require('sequelize');

// ----------------

var sequelize = new Sequelize('database', 'username', 'password', {
  // sqlite! now!
  dialect: 'sqlite',
 
  // the storage engine for sqlite
  // - default ':memory:'
  storage: 'database.sqlite',
  logging: CONFIG.database.logging
});

// --------------------------------

tableCache = sequelize.define('cache', {
  date: {
    type: Sequelize.DATE
  },
  url: {
    type: Sequelize.TEXT
  },
  parameters: {
    type: Sequelize.TEXT
  },
  response: {
    type: Sequelize.TEXT
  },
  error: {
      type: Sequelize.TEXT
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false
});

tableCache.sync();
