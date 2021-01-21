const wadahkode = require('../../'),
  app = wadahkode(),
  path = require('path'),
  port = process.env.PORT || 3000;

app.use('engine', 'ejs');
//app.use('view extension', '.html');
app.use('public', path.join(__dirname, 'public'));
app.use('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Wadahkode',
    description: 'Cintai Produk Indonesia'
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://127.0.0.1:${port}`);
});