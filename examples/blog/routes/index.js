const wadahkode = require('../../../'),
  Router = wadahkode().Router,
  client = wadahkode().Client,
  session = require('../../../lib/v2/session')();

session.start();
client.initialize({
  path: wadahkode().dirname('examples/blog') + '/.env',
});

Router.get('/', (req, res) => {
  res.render('index', {
    'title': 'Blog'
  });
});

Router.get('/home', (req, res) => {
  res.render('home', {
    'title': 'Blog'
  });
});

Router.get('/about', (req, res) => {
  res.render('about', {
    'title': 'Blog'
  });
});

// Halaman administrator
Router.get('/admin', (req, res) => {
  return session.has('superuser')
    ? res.redirect('/admin/dashboard')
    : res.render('admin/index', {title: 'Blog'});
});

// Admin Sign-in
Router.post('/admin/signin', (req, res) => {
  const {db} = client.connect();
  db.connect();
  
  db.query('select * from users where name=$1 and password=$2;', [req.body.username, req.body.password], (err, snapshot) => {
    if (!err) {
      if (snapshot.rows.length < 1) {
        res.end('login gagal!');
      } else {
        res.end('login berhasil!');
      }
    } else {
      db.end('Koneksi error!');
    }
  });
  // if (session.has('superuser')) {
  //   res.redirect('/admin/dashboard');
  // } else {
  //   if (req.body.username == 'admin' && req.body.password == 123) {
  //     session.set('superuser', req.body.username);
  //     res.redirect('/admin/dashboard');
  //   } else {
  //     res.end('login gagal!');
  //   }
  // }
});

// Dashboard
Router.get('/admin/dashboard', (req, res) => {
  return !session.has('superuser')
    ? res.redirect('/admin')
    : res.render('admin/dashboard', {
      title: 'Blog',
      data: [{
        name: session.get('superuser')
      }]
    });
});

module.exports = Router;