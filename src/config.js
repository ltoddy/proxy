const configJson = require('../config');

const { hostname, port } = configJson;

module.exports = {
  hostname,
  port,
};
