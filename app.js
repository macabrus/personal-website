const express = require('express');
const serveIndex = require('serve-index');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'view');
//app.use(express.static("data"));
const dataDir = path.join(__dirname, 'data');
app.use('/index', express.static(dataDir), serveIndex(dataDir, {
  template: path.join(__dirname, 'view/dir.html')
}));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.render('index', {
    title: `My personal website`
  });
});

app.listen(3000, () => console.log('Personal website listening on :3000'));
