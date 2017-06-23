define(function (require, exports, module) {

  module.exports = {
    bind: function bind(el, binding, vnode) {
      vnode.context.$refs[binding.arg].$refs.reference = el;
    }
  };
})