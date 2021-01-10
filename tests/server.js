const wadahkode = require('../build/wadahkode'),
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
  res.render('index', {title: 'Salam koding'});
});

app.listen(port);