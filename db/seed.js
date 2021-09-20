const { client } = require('./');
const { rebuildDB } = require('./seedData');

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());