
define(function (require, exports, module) {
  module.exports = {
    name: 'ElBreadcrumb',
    template:require('./breadcrumb.tpl'),
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    props: {
      separator: {
        type: String,
        default: '/'
      }
    }
  };
})