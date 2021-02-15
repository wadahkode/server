const http = require('http');
/**
 * Use Type
 *
 * @since version 1.1.8
 */
type callback = (
  request: typeof http.IncomingMessage,
  response: typeof http.ServerResponse
) => void;
type Router = {
  get: (path: string, callback: callback) => void;
  post: (path: string, callback: callback) => void;
};

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
    app.handle = (
      req: typeof http.IncomingMessage,
      res: typeof http.ServerResponse
    ) => {
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
      get: (path: string, callback: callback) => app.get(path, callback),
      post: (path: string, callback: callback) => app.post(path, callback),
    };

    app.Client = require('./client');

    // Kembalikan
    return app;
  };

module.exports = wadahkode;
