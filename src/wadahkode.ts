const app = require('./v2/app'),
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
      return route.post();
    }
  };
  
  // untuk menampung router
  // misalnya: ['/': [Function]]
  app.register = {};
  
  app.Router = app;
  
  // Kembalikan
  return app;
};

module.exports = wadahkode;