const wadahkode = require('../lib/wadahkode'),
  app = wadahkode(),
  path = require('path'),
  session = require('../lib/session'),
  port = process.env.PORT || 3000;
  
session.start();
app.set('views', path.join(path.dirname(__dirname), 'views'));

app.get('/', (req,res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  if (session.has('id')) {
    res.redirect('home');
    res.end();
  } else {
    res.render('index', {
      title: 'Server',
      description: 'Salam koding'
    });
  }
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

app.post('/proses-login', (req,res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  if (session.has('id')) {
    res.redirect('home');
  }
  app.form(req, (err, snapshot) => {
    if (!err) {
      session.set('id', snapshot.name);
      session.setStore(session.get('id'), snapshot);
      res.redirect('home');
      res.end();
    } else {
      res.redirect('/');
      res.end();
    }
  });
});

app.get('/home', (req,res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  if (!session.has('id')) {
    res.redirect('/');
    res.end();
  } else {
    let id = session.get('id');
    let data = session.getStore(id);
    
    res.render('home', {
      title: 'Server',
      description: 'Homepage',
      data: JSON.parse(data)
    });
  }
});

app.listen(port);