const dotenv = require('dotenv');
const model = require('./model');
/**
 * Client for database
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.6
 */
const initialize = (options: object|any) => dotenv.config(options);

/**
 * Fungsi untuk menjalankan atau mengkoneksi
 * 
 * @param ssl object|any|null
 */
const connect = function(ssl: object|any|null) {
  if (process.env.DB_DRIVER == 'postgres') {
    const {Client} = require('pg');
    
    const newClient = new Client({
      connectionString: `${process.env.DB_DRIVER}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      ssl
    });

    return new model(newClient);
  } else {
    return false;
  }
};

// Export
module.exports = {
  connect,
  initialize
};