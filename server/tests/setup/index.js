const { startServer, makeConnection } = require("../../src/server");

module.exports = async () => {
  await startServer();
};
