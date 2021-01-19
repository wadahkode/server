const wadahkode = require('../../'),
  app = wadahkode(),
  port = process.env.PORT || 3000;

app.use({
  'views': app.dirname('views'),
  'engine': 'ejs'
});

app.get('/', (req, res) => {
  res.render('test', {
    title: 'Test',
    description: 'Hello world'
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://127.0.0.1:${port}`);
});