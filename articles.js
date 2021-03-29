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
    let path = resolve(join(baseDir, req.path));
    if (!path.startsWith(resolve(baseDir))) {
      return next(); // not allowing parent directories to be listed
    }

    const template = options?.template || 'article_template';
    if (isDir(path)) {
      path = join(path, 'index');
    }
    if (isFile(path + '.md')) {
      return res.render(template, {
        markdownData: fs.readFileSync(path + '.md', 'utf8')
      });
    }
    return next(); // no match
  };
};