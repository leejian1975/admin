// import Vue from 'vue';
//
// export function isVNode(node) {
//   if (!node || typeof node !== 'object') return false;
//   return Vue.util.hasOwn(node, 'tag') && Vue.util.hasOwn(node, 'componentOptions');
// };
define(function (require, exports, module) {
  const Vue = require('vue');
  function isVNode(node) {
    if (!node || typeof node !== 'object') return false;
    return Vue.util.hasOwn(node, 'tag') && Vue.util.hasOwn(node, 'componentOptions');
  };
  module.exports = isVNode;
})