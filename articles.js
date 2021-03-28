const { join, resolve } = require('path');
const fs = require('fs');

function isDir(path) {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}

function isFile(path) {
  return fs.existsSync(path) && fs.lstatSync(path).isFile();
}

// middleware for serving static markdown files
module.exports = function serveMarkdown(options) {
  return function (req, res, next) {
    const baseDir = options?.baseDir || __dirname;
    const template = options?.templateName || 'article_template';
    let path = join(baseDir, req.path);
    if (!path.startsWith(resolve(baseDir))) {
      next(); // not allowing parent directories to be listed
    }
    if (isDir(path)) {
      if (isFile(join(path, 'index.md')))
        res.render(template, {
          markdownData: fs.readFileSync(join(path, 'index.md'), 'utf8')
        });
      next();
    }
    if (isFile(path)) {
      res.render(template, {
        markdownData: fs.readFileSync(path, 'utf8')
      });
    }
    else if (isFile(path + '.md')) {
      res.render(template, {
        markdownData: fs.readFileSync(path + '.md', 'utf8')
      });
    }
    next(); // no match
  };
};