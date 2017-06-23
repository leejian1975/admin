// import RadioButton from '../radio/src/radio-button.vue';
//
// /* istanbul ignore next */
// RadioButton.install = function(Vue) {
//   Vue.component(RadioButton.name, RadioButton);
// };
//
// export default RadioButton;
define(function(require,exports,modules){
  modules.exports={
    name: 'ElRadioButton',
    template:require('./radio-button.tpl'),
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    props: {
      label: {},
      disabled: Boolean,
      name: String
    },
    computed: {
      value: {
        get() {
          return this._radioGroup.value;
        },
        set(value) {
          this._radioGroup.$emit('input', value);
        }
      },
      _radioGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      },
      activeStyle() {
        return {
          backgroundColor: this._radioGroup.fill || '',
          borderColor: this._radioGroup.fill || '',
          color: this._radioGroup.textColor || ''
        };
      },
      size() {
        return this._radioGroup.size;
      },
      isDisabled() {
        return this.disabled || this._radioGroup.disabled;
      }
    }
  }
})