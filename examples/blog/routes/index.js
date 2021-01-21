const wadahkode = require('../../../'),
  Router = wadahkode().Router,
  session = require('../../../lib/v2/session')();

session.start();

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
  if (session.has('superuser')) {
    res.redirect('/admin/dashboard');
  }
  
  res.render('admin/index', {title: 'Blog'});
});

// Admin Sign-in
Router.post('/admin/signin', (req, res) => {
  res.end('oke');
});

module.exports = Router;