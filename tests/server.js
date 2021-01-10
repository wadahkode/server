const wadahkode = require('../build/wadahkode'),
  app = wadahkode(),
  port = process.env.PORT || 3000;

app.get('/', (req,res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  res.end('Hello');
});

app.listen(port);