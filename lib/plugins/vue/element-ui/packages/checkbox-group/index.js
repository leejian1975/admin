// import ElCheckboxGroup from '../checkbox/src/checkbox-group.vue';
//
// /* istanbul ignore next */
// ElCheckboxGroup.install = function(Vue) {
//   Vue.component(ElCheckboxGroup.name, ElCheckboxGroup);
// };
//
// export default ElCheckboxGroup;
define(function (require, exports, module) {
  const Emitter = require('../../src/mixins/emitter')
  module.exports = {
    name: 'ElCheckboxGroup',

    componentName: 'ElCheckboxGroup',
    template:require('./checkbox-group.tpl'),
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    mixins: [Emitter],

    props: {
      value: {}
    },

    watch: {
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      }
    }
  }
})