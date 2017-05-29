/**
 * 使用方法：http://docs.sequelizejs.com/en/v3/docs/models-usage/
 * 欄位類型定義：http://docs.sequelizejs.com/en/v3/docs/models-definition/
 */
var Sequelize = require('sequelize');

// ----------------

var sequelize = new Sequelize('jiebaserver', 'linked_data_proxy', 'password', {
    // SQLite
    //dialect: 'sqlite',
    //storage: 'database.sqlite',

    // PostgreSQL
    dialect: "postgres",
    host: "localhost",
    

    logging: false
});

// --------------------------------

tableArticleCache = sequelize.define('articlecache', {
  article: {
    type: Sequelize.TEXT
  },
  result: {
    type: Sequelize.TEXT
  },
  processing: {
    type: Sequelize.BOOLEAN
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: true
});

tableArticleCache.sync();


// --------------------------------

tableTermCache = sequelize.define('term_cache', {
  term: {
    type: Sequelize.TEXT
  },
  existed: {
    type: Sequelize.BOOLEAN
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: true
});

tableTermCache.sync();