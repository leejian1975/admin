
define(function(require,exports,module){
  const Pagination = require('./src/pagination');
  Pagination.install = function(Vue) {
    Vue.component(this.name, this);
  };
  module.exports = Pagination;
})
