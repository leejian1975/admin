// import RadioGroup from '../radio/src/radio-group.vue';
//
// /* istanbul ignore next */
// RadioGroup.install = function(Vue) {
//   Vue.component(RadioGroup.name, RadioGroup);
// };
//
// export default RadioGroup;

define(function(require,exports,modules) {
  const Emitter = require('../../src/mixins/emitter')
  modules.exports = {
    name: 'ElRadioGroup',
    template:require('./radio-group.tpl'),
    install:function(Vue){
      Vue.component(this.name, this);
    },
    componentName: 'ElRadioGroup',

    mixins: [Emitter],

    props: {
      value: [String, Number],
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },
    watch: {
      value: function value(_value) {
        this.$emit('change', _value);
        this.dispatch('ElFormItem', 'el.form.change', [this.value]);
      }
    }
  }
})