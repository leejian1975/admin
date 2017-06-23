
define(function (require, exports, module) {

  module.exports = {
    name: 'ElIcon',
    template:require('./icon.tpl'),
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    props: {
      name: String
    }
  }
})