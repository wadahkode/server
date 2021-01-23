const app = require('./app'),
/**
 * Fungsi Wadahkode
 * 
 * Sebuah fungsi yang digunakan untuk menampung sebuah fungsi lain.
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
wadahkode = () => {
  /**
   * Metode atau properti yang digunakan ketika
   * web server dimuat dengan app.listen(arguments),
   * 
   * Secara otomatis menampung request dan response dari server,
   * dan mencari router yang cocok berdasarkan request methodnya.
   * 
   * @since version 1.0.0
   */
  app.handle = (req: any, res: any) => {
    const route = app.route(req);
    
    if (req.method == 'GET') {
      route.get(req, res);
      
      console.log(
        '🌏 %s %s %s %s',
        req.method,
        res.statusCode,
        new Date(),
        req.url
      );
    } else if (req.method == 'POST') {
      route.post(req, res);
      
      console.log(
        '🌏 %s %s %s %s',
        req.method,
        res.statusCode,
        new Date(),
        req.url
      );
    }
  };
  
  // untuk menampung router
  // misalnya: ['/': [Function]]
  app.register = {};
  
  app.Router = {
    get: (path: string, callback: any) => app.get(path, callback),
    post: (path: string, callback: any) => app.post(path, callback),
  };
  
  app.Client = {
    initialize: function(options: any) {
      const dotenv = require('dotenv');
      
      return dotenv.config(options);
    },
    connect: function() {
      if (process.env.DB_DRIVER == 'postgres') {
        const {Client} = require('pg');
        
        const newClient = new Client({
          connectionString: `${process.env.DB_DRIVER}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
          ssl: {
            rejectUnauthorized: false
          }
        });
        
        this.db = newClient;
        
        return this;
      } else {
        return false;
      }
    }
  };
  
  // Kembalikan
  return app;
};

module.exports = wadahkode;