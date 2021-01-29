const wadahkode = require('../../../'),
  Router = wadahkode().Router,
  session = require('../../../lib/session')(),
  passwordHash = require('@wadahkode/password-hash'),
  Model = require('../model/'),
  Memories = require('@wadahkode/memories');

session.start();

let salt = passwordHash.generateSalt(10),
  hashedPassword = "",
  date = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta'
  }),
  waktuIndonesia = date.replace(/\/$/g, '-').replace(/\./g, ':');


Router.get('/', (req, res) => {
  // session.unset('superuser');
  Model.tutorial.findAll('tutorials', ['id', 'DESC'], true)
    .then(snapshot => {
      if (snapshot.length < 1) {
        res.render('index', {
          title: 'Blog',
          data: false
        });
      } else {
        snapshot.forEach(item => {
          let createdAt = new Memories(new Date(item.dibuat), new Date()),
            updateAt = new Memories(new Date(item.diupdate), new Date());

          if (createdAt.getMemoTime() == updateAt.getMemoTime()) {
            item.dibuat = createdAt.getMemoTime();
            delete item.diupdate;
          } else {
            item.diupdate = updateAt.getMemoTime();
            delete item.dibuat;
          }
        });
  
        res.render('index', {
          title: 'Blog',
          data: snapshot
        });
      }
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
    : res.render('admin/index', {
      title: 'Blog',
      message: session.has('message') ? JSON.parse(session.get('message')) : false
    });
});

// Register GET
Router.get('/admin/register', (req, res) => {
  return session.has('superuser')
    ? res.redirect('/admin/dashboard')
    : res.render('admin/register', {
      title: 'Blog',
      message: session.has('message') ? JSON.parse(session.get('message')) : false
    });
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
        session.flash('message', JSON.stringify({
          backgroundStatus: 'bg-red-500',
          value: 'Nama pengguna salah atau akun belum terdaftar!'
        }));
        res.redirect('/admin');
      } else {
        for (let user of snapshot) {
          if (passwordHash.verify(password, JSON.parse(user.password))) {
            session.set('superuser', username);
            res.redirect('/admin/dashboard');
          } else {
            session.flash('message', JSON.stringify({
              backgroundStatus: 'bg-red-500',
              value: 'Kata sandi salah!'
            }));
            res.redirect('/admin');
          }
        }
      }
    })
    .catch(error => {
      if (error) {
        session.flash('message', JSON.stringify({
          backgroundStatus: 'bg-red-500',
          value: 'Akun belum terdaftar!'
        }));
        res.redirect('/admin');
      }
    });
});

// Admin Sign-up
Router.post('/admin/signup', (req, res) => {
  const {agreement, username, email, password, passwordVerify} = req.body;

  if (session.has('superuser')) {
    res.redirect('/admin/dashboard');
  } else {
    if (agreement != undefined) {
      if (password != passwordVerify) {
        session.flash('message', JSON.stringify({
          backgroundStatus: 'bg-red-500',
          value: 'Password tidak dapat dicocokan!'
        }));
        res.redirect('/admin/register');
      } else {
        hashedPassword = JSON.stringify(passwordHash.hash(password, salt));

        Model.user.findById('users', [email])
          .then(snapshot => {
            if (snapshot.length >= 1) {
              session.flash('message', JSON.stringify({
                backgroundStatus: 'bg-red-500',
                value: 'Akun sudah terdaftar, silahkan masuk untuk melanjutkan!'
              }));
              res.redirect('/admin/register');
            } else {
              Model.user.push('users', {
                username: username,
                email: email,
                password: hashedPassword,
                password_verify: hashedPassword,
                status: 'pending',
                created_at: waktuIndonesia,
                updated_at: waktuIndonesia
              }, error => {
                if (!error) {
                  session.flash('message', JSON.stringify({
                    backgroundStatus: 'bg-green-500',
                    value: 'Berhasil membuat akun, silahkan masuk untuk melanjutkan!'
                  }));
                  res.redirect('/admin/register');
                } else {
                  session.flash('message', JSON.stringify({
                    backgroundStatus: 'bg-red-500',
                    value: 'Gagal membuat akun!'
                  }));
                  res.redirect('/admin/register');
                }
              });
            }
          })
          .catch(error => console.error(error));
      }
    } else {
      session.flash('message', JSON.stringify({
        backgroundStatus: 'bg-red-500',
        value: 'Tolong terima syarat dan ketentuan yang berlaku!'
      }));
      res.redirect('/admin/register');
    }
  }
});

// Dashboard
Router.get('/admin/dashboard', (req, res) => {
  return (!session.has('superuser'))
    ? res.redirect('/admin')
    : Model.tutorial.findAll('tutorials')
      .then(snapshot => {
        res.render('admin/dashboard', {
          title: 'Blog',
          description: 'Administrator',
          author: session.get('superuser'),
          data: snapshot,
          message: session.has('message') ? JSON.parse(session.get('message')) : false
        });
      })
      .catch(error => console.error(error));
});

Router.get('/admin/tutorial/edit/:judul', (req, res) => {
  const {judul} = req.body;

  if (!session.has('superuser')) {
    res.redirect('/admin');
  } else {
    Model.tutorial.findById('tutorials', [decodeURI(judul), 0])
      .then(snapshot => {
        if (snapshot.length < 1) {
          res.end('Maaf tutorial ' + decodeURI(judul) + ' tidak dapat ditemukan!');
        } else {
          res.render('/admin/tutorial.edit', {
            title: 'Blog',
            description: 'Administrator',
            data: snapshot
          });
        }
      })
      .catch(error => console.error(error));
  }
});

Router.get('/admin/tutorial/delete/:judul', (req, res) => {
  const {judul} = req.body;

  if (!session.has('superuser')) {
    res.redirect('/admin');
  } else {
    Model.tutorial.findById('tutorials', [decodeURI(judul), 0])
      .then(snapshot => {
        if (snapshot.length < 1) {
          session.flash('message', JSON.stringify({
            backgroundStatus: 'bg-red-500',
            value: 'Maaf gagal memuat tutorial ' + decodeURI(judul)
          }));
          res.redirect('/admin/dashboard');
        } else {
          Model.tutorial.delete('tutorials', snapshot[0].id)
            .then(error => {
              if (!error) {
                session.flash('message', JSON.stringify({
                  backgroundStatus: 'bg-green-500',
                  value: 'Tutorial berhasil dihapus!'
                }));
                res.redirect('/admin/dashboard');
              } else {
                session.flash('message', JSON.stringify({
                  backgroundStatus: 'bg-red-500',
                  value: 'Tutorial gagal dihapus!'
                }));
                res.redirect('/admin/dashboard');
              }
            });
        }
      })
      .catch(error => {
        console.log(error);
        res.end('error');
      })
  }
});

Router.post('/admin/tutorial', (req, res) => {
  const {judul, kategori, editor, penulis} = req.body;

  if (!session.has('superuser')) {
    res.redirect('/admin');
  } else {
    return Model.tutorial.findById('tutorials', [judul, 0])
      .then(snapshot => {
        if (snapshot.length >= 1) {
          session.flash('message', JSON.stringify({
            backgroundStatus: 'bg-red-500',
            value: 'Sudah diposting sebelumnya!'
          }));
          res.redirect('/admin/dashboard');
        } else {
          Model.tutorial.push('tutorials', {
            judul: judul,
            isi: editor,
            penulis: penulis,
            kategori: kategori,
            dibuat: waktuIndonesia,
            diupdate: waktuIndonesia
          }, error => {
            if (!error) {
              session.flash('message', JSON.stringify({
                backgroundStatus: 'bg-green-500',
                value: 'Tutorial berhasil diposting!'
              }));
              res.redirect('/admin/dashboard');
            } else {
              session.flash('message', JSON.stringify({
                backgroundStatus: 'bg-red-500',
                value: 'Tutorial gagal diposting!'
              }));
              console.log(error);
              res.redirect('/admin/dashboard');
            }
          });
        }
      })
      .catch(error => console.error(error));
  }
});

Router.post('/admin/tutorial/update', (req, res) => {
  const {id, judul, kategori, editor, penulis} = req.body;

  if (!session.has('superuser')) {
    res.redirect('/admin');
  } else {
    return Model.tutorial.findById('tutorials', [judul, parseInt(id)])
      .then(snapshot => {
        return Model.tutorial.update('tutorials', {
          judul: judul,
          isi: editor,
          penulis: penulis,
          kategori: kategori,
          diupdate: waktuIndonesia
        }, snapshot[0].id, error => {
          if (!error) {
            session.flash('message', JSON.stringify({
              backgroundStatus: 'bg-green-500',
              value: 'Tutorial berhasil diupdate!'
            }));
            res.redirect('/admin/dashboard');
          } else {
            console.log(error.stack);
            session.flash('message', JSON.stringify({
              backgroundStatus: 'bg-red-500',
              value: 'Tutorial gagal diupdate!'
            }));
            res.redirect('/admin/dashboard');
          }
        });
      })
      .catch(error => console.error(error));
  }
});

module.exports = Router;