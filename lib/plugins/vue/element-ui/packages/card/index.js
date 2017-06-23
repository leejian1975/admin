define(function (require, exports, module) {


  module.exports = {
    name: 'ElCard',
    template:require('./card.tpl'),
    install : function (Vue) {
      Vue.component(this.name, this);
    },
    props: ['header', 'bodyStyle']
  };
})