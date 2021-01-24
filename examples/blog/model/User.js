const Client = require('./');

const findAll = (table) => Client.findAll('SELECT * FROM ' + table);

const findById = (table, params) => Client.findById('SELECT * FROM ' + table + ' WHERE username=$1', params);

module.exports = {findAll, findById};