const dotenv = require('dotenv');
const postgres = require('./databases/postgres');
const firebaseModel = require('./databases/firebase');

/**
 * Client for database
 *
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.6
 */
const initialize = (options: object | any) => dotenv.config(options);

/**
 * Fungsi untuk menjalankan atau mengkoneksi
 *
 * @param ssl object|any|null
 */
const connect = function (ssl: object | any | null) {
  if (process.env.DB_DRIVER == 'postgres') {
    const { Client } = require('pg');

    const newClient = new Client({
      connectionString: `${process.env.DB_DRIVER}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      ssl,
    });

    return new postgres(newClient);
  } else if (process.env.DB_DRIVER == 'firebase') {
    const firebase = require('firebase/app');
    require('firebase/auth');
    require('firebase/database');

    const firebaseConfig = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    };

    const client = firebase.initializeApp(firebaseConfig);

    return new firebaseModel(client);
  } else {
    return false;
  }
};

// Export
module.exports = {
  connect,
  initialize,
};
