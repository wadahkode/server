const wadahkode = require('../../../'),
  Router = wadahkode().Router,
  session = require('../../../lib/session')(),
  passwordHash = require('@wadahkode/password-hash'),
  Model = require('../model/');

session.start();

let salt = passwordHash.generateSalt(10),
  hashedPassword = "";

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

// Register GET
Router.get('/admin/register', (req, res) => {
  return session.has('superuser')
    ? res.redirect('/admin/dashboard')
    : res.render('admin/register', {title: 'Blog'});
});


// Admin Sign-in
Router.post('/admin/signin', (req, res) => {
  const {username, password} = req.body;

  if (session.has('superuser')) {
    res.redirect('/admin/dashboard');
  }

  return Model.user.findById('users', [username])
    .then(snapshot => {
      if (snapshot.length < 1) {
        res.end('Nama pengguna salah atau akun belum terdaftar!');
      } else {
        for (let user of snapshot) {
          if (passwordHash.verify(password, JSON.parse(user.password))) {
            session.set('superuser', username);
            res.redirect('/admin/dashboard');
          } else {
            res.end('kata sandi salah!');
          }
        }
      }
    })
    .catch(error => {
      if (error) {
        res.end('Akun belum terdaftar!')
      }
    });
});

// Admin Sign-up
Router.post('/admin/signup', (req, res) => {
  const {agreement, username, email, password, passwordVerify} = req.body;
  const date = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York'
  });

  if (session.has('superuser')) {
    res.redirect('/admin/dashboard');
  }

  if (agreement != 'undefined') {
    if (password != passwordVerify) {
      res.end('Password tidak dapat dicocokan');
    } else {
      hashedPassword = JSON.stringify(passwordHash.hash(password, salt));
    }

    Model.user.findById('users', [email])
      .then(snapshot => {
        return (snapshot.length >= 1) ? res.end('Akun sudah terdaftar, silahkan masuk untuk melanjutkan!') : Model.user.push('users', {
          username: username,
          email: email,
          password: JSON.stringify(hashedPassword),
          password_verify: JSON.stringify(hashedPassword),
          created_at: date,
          updated_at: date
        }, error => {
          if (!error) {
            res.end('Akun berhasil dibuat, silahkan login untuk melanjutkan!');
          } else {
            res.end('Gagal membuat akun!');
          }
        });
      })
      .catch(error => {
        if (error) {
          res.end('Tolong terima syarat dan ketentuan yang berlaku!');
        }
      });
  }
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