const http = require('http');
const router = require('./router');

/**
 * Kelas utama
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
class Wadahkode {
  private server: any;
  
  constructor() {
    this.server = http.createServer((req: any, res: any) => {
      const handler = router.route(req);
      handler.process(req,res);
    });
  }
  
  get(url: string, method: any) {
    router.get(url,method);
  }
  
  post(url: string) {
    router.post(url);
  }
  
  listen(port: number) {
    this.server.listen(port, () => {
      console.log('Server berjalan di http://127.0.0.1:' + port);
    });
  }
}

module.exports = () => new Wadahkode();