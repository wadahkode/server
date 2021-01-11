const wadahkode = require('../lib/wadahkode'),
  app = wadahkode(),
  path = require('path'),
  port = process.env.PORT || 3000;
  
app.set('views', path.join(path.dirname(__dirname), 'views'));

app.get('/', (req,res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  res.render('index', {
    title: 'Server',
    description: 'Salam koding'
  });
});

app.get('/about', (req,res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  res.render('about', {
    title: 'Server',
    description: 'Tentang kami'
  });
});

app.listen(port);