module.exports = {
  mongodb: {
    url: 'mongodb://localhost:27017',
    databaseName: process.env.MONGO_DB_NAME || 'hawthorn',

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
};
