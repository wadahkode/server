const wadahkode = require('../../'),
  app = wadahkode(),
  path = require('path'),
  indexRouter = require('./routes/index'),
  port = process.env.PORT || 3000;

app.use('engine', 'ejs');
//app.use('view extension', '.html');
app.use('public', path.join(__dirname, 'public'));
app.use('views', path.join(__dirname, 'views'));
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Server berjalan di http://127.0.0.1:${port}`);
});