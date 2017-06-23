define(function(require,exports,module) {

  const Upload = require('./src/index.js');

  /* istanbul ignore next */
  Upload.install = function (Vue) {
    Vue.component(Upload.name, Upload);
  };

  module.exports = Upload;
})
