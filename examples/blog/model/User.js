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

// lebih baik gunakan literal string
// Mengambil semua data user pada database
userModel.findAll = (table) => db.findAll(`SELECT * FROM ${table}`);

// Mengambil data user berdasarkan usernamenya
userModel.findById = (table, params) => db.findById(`SELECT * FROM ${table} WHERE username=$1`, params);

// export user model
module.exports = userModel;