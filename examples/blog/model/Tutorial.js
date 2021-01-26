/**
 * User Model
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.6
 */
let db;

const tutorialModel = (client) => {
  db = client;
  
  return tutorialModel;
};

// lebih baik gunakan literal string
// Mengambil semua data article pada database
tutorialModel.findAll = (table) => db.findAll(`SELECT * FROM ${table}`);

// Mengambil data article berdasarkan judulnya
tutorialModel.findById = (table, params) => db.findById(`SELECT * FROM ${table} WHERE judul=$1`, params);

// Menyimpan data article
tutorialModel.push = (table, params, callback) => {
  let tableName = "",
    tableKey = "",
    tableValues = "",
    tableCountable = 1;

  Object.keys(params).map(item => {
    tableName += item + ', ';
    tableValues += params[item] + '%%%';

    tableKey += '$' + tableCountable + ', ';
    tableCountable++;
  })

  tableName = tableName.slice(0, -2);
  tableValues = tableValues.slice(0, -3);
  tableKey = tableKey.slice(0, -2);

  const query = `INSERT INTO ${table}(${tableName}) VALUES(${tableKey}) RETURNING *`;
  const values = tableValues.split('%%%');

  return db.push(query, values).then(error => callback(error));
};

// export user model
module.exports = tutorialModel;