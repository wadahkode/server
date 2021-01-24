const wadahkode = require('../../../'),
  Client = wadahkode().Client;

Client.initialize({
  path: wadahkode().dirname('examples/blog') + '/.env',
});

const Database = Client.connect();

module.exports = Database;