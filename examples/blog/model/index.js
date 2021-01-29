const wadahkode = require('../../../'),
  Client = wadahkode().Client;
/**
 * Initialize environment
 * 
 * Silahkan atur dimana kalian menyimpan file .env
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.6
 */
Client.initialize({
  path: wadahkode().dirname('examples/blog') + '/.env.example',
});

// Menyimpan pada variabel Database ketika terkoneksi
const Database = Client.connect(
  // Matikan ssl ketika berada dilocalhost
  ssl = false
  // Hapus komentar ini jika telah berada dihosting
  // ssl = {rejectUnauthorized: false}
);

// Berapa banyak model yang mau dimuat 
const userModel = require('./User')(Database);
const tutorialModel = require('./Tutorial')(Database);

// export model
module.exports = {
  user: userModel,
  tutorial: tutorialModel
};