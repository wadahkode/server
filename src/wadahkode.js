const http = require('http');
const router = require('./router');

class Wadahkode {
  constructor() {
    this.server = http.createServer((req, res) => {
      const handler = router.route(req);
      handler.process(req,res);
    });
  }
  
  get(url,method) {
    router.get(url,method);
  }
  
  post(url) {
    router.post(url);
  }
  
  listen(port) {
    this.server.listen(port, () => {
      console.log('Server berjalan di http://127.0.0.1:' + port);
    });
  }
}

module.exports = () => new Wadahkode();