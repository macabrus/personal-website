const express = require('express');
const serveIndex = require('serve-index');
const serveMarkdown = require('./articles');
const { join } = require('path');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const error = require('./errors');
dotenv.config();


const showdown = require('showdown'),
  converter = new showdown.Converter({ tables: true, strikethrough: true });

const app = express();


const njk = nunjucks.configure(join(__dirname, 'view'), {
  autoescape: false,
  express: app,
  noCache: true,
});

njk.addFilter('md', (text) => {
  return converter.makeHtml(text);
});

app.set('view engine', 'njk');
app.set('views', 'view');
app.use('/assets', express.static(join(__dirname, 'assets')));


const dataDir = join(__dirname, 'data');
// app.use('/index', express.static(dataDir), serveIndex(dataDir, {
//   template: join(__dirname, 'view/dir.html')
// }));

app.use('/', serveMarkdown({
  baseDir: 'view/article',
  template: 'article'
}));

app.use(error.handle404({
  template: '404'
}));

app.use(error.handle500({
  template: '500'
}));

app.listen(process.env.PORT, () => {
  console.log(`Personal website listening on :${process.env.PORT}`);
});
