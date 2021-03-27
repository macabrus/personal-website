const express = require('express');
const serveIndex = require('serve-index');
const path = require('path');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');

dotenv.config();

var showdown = require('showdown'),
  converter = new showdown.Converter({ tables: true, strikethrough: true }),
  text = '# hello, markdown!',
  html = converter.makeHtml(text);

const app = express();
const njk = nunjucks.configure(path.join(__dirname, 'view'), {
  autoescape: false,
  express: app,
  noCache: true,
});

njk.addFilter('md', (text) => {
  return converter.makeHtml(text);
});

app.set('view engine', 'njk');
app.set('views', 'view');
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const dataDir = path.join(__dirname, 'data');
app.use('/index', express.static(dataDir), serveIndex(dataDir, {
  template: path.join(__dirname, 'view/dir.html')
}));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.render('index', {
    markdown: 'article/index.md',
  });
});

app.get('/about', (req, res) => {
  res.render('index', {
    markdown: 'article/about.md',
  });
});

// Handle 404
app.use((req, res) => {
  res.status(400);
  res.render('index', { markdown: 'article/404.md' });
});

// Handle 500
app.use((err, req, res, next) => {
  res.status(500);
  res.render('index', { markdown: 'article/500.md', error: err });
});

app.listen(process.env.PORT, () => {
  console.log(`Personal website listening on :${process.env.PORT}`);
});
