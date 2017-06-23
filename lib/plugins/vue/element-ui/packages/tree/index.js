
define(function(require,exports,module){
  const Tree = require('./src/tree.js');
  Tree.install = function(Vue) {
    Vue.component(Tree.name, Tree);
  };
  module.exports = Tree;
})