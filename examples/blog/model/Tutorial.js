/**
 * Tutorial Model
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.8
 */
let db;

const tutorialModel = (client) => {
  db = client;
  
  return tutorialModel;
};

// lebih baik gunakan literal string
// Mengambil semua data dari database
tutorialModel.findAll = (table) => db.findAll(`SELECT * FROM ${table}`);

// Mengambil data berdasarkan judul atau id nya
tutorialModel.findById = (table, params) => db.findById(`SELECT * FROM ${table} WHERE judul=$1 OR id=$2`, params);

// Menyimpan data
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

// Update data
tutorialModel.update = (table, params, id, callback) => {
  let values = "",
    tableCountable = 1;

  Object.keys(params).map(item => {
    values += `${item}='${params[item]}',`;

    tableCountable++;
  });

  const query = `UPDATE ${table} SET ${values.slice(0, -1)} WHERE id=${id} RETURNING *`;
  return db.update(query).then(error => callback(error));
};

// Delete data
tutorialModel.delete = (table, id) => db.delete(`DELETE FROM ${table} WHERE id=${id} RETURNING *`);

// export user model
module.exports = tutorialModel;