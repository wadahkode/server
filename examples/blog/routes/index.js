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
  const {db} = client.connect();
    date = new Date();
  
  if (req.body.agreement != undefined) {
    if (req.body.password != req.body.passwordVerify) {
      res.end('Password tidak dapat dicocokan!');
    } else {
      hashedPassword = JSON.stringify(passwordHash.hash(req.body.password, salt));
    }
    const users = {
      get: function(query, id, callback) {
        db.connect();
        db.query(query, id, (err, result) => {
          if (!err) {
            return callback(result.rows.length >= 1 ? true : false);
          }
        });
      }
    };
    
    users.get('select * from users where email=$1', [req.body.email], (status) => {
      if (status) {
        res.end('akun sudah terdaftar!');
      } else {
        const query = 'INSERT INTO users(username, email, password, password_verify, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [req.body.username, req.body.email, hashedPassword, hashedPassword, date, date];
        db.query(query, values, (error, result) => {
          if (!error) {
            res.end('Akun berhasil dibuat, silahkan login untuk melanjutkan!');
          } else {
            console.log(error.stack);
            res.end('Gagal membuat akun!');
          }
        });
      }
    });
  } else {
    res.end('Tolong terima syarat dan ketentuan yang berlaku!');
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