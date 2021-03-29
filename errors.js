const fs = require('fs');

// Handle 404
module.exports.handle404 = function (options) {
  if (!options?.template) {
    throw new Error('Template not defined');
  }
  return (req, res, next) => {
    res.status(404);
    res.render(options.template);
  };
};

// Handle 500
module.exports.handle500 = function (options) {
  if (!options?.template) {
    throw new Error('Template not defined');
  }
  return (err, req, res, next) => {
    res.status(500);
    res.render(options.template);
  };
};
