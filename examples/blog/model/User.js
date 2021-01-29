/**
 * User Model
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.6
 */
let db;

const userModel = (client) => {
  db = client;
  
  return userModel;
};

/**
 * Mengambil semua data user dari database
 * 
 * @param {string} table 
 */
userModel.findAll = (table="") => db.findAll(`SELECT * FROM ${table}`);

/**
 * Mengambil data user berdasarkan username atau email
 * 
 * @param {string} table 
 * @param {Array} params 
 */
userModel.findById = (table="", params=[]) => db.findById(`SELECT * FROM ${table} WHERE username=$1 OR email=$1`, params);

/**
 * Menyimpan data user
 * 
 * @param {string} table 
 * @param {Array} params 
 * @param {Error} callback 
 */
userModel.push = (table="", params=[], callback) => {
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
module.exports = userModel;