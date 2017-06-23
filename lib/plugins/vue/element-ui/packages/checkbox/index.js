// import ElCheckbox from './src/checkbox';
//
// /* istanbul ignore next */
// ElCheckbox.install = function(Vue) {
//   Vue.component(ElCheckbox.name, ElCheckbox);
// };
//
// export default ElCheckbox;
define(function (require, exports, module) {
  const Emitter = require('../../src/mixins/emitter')
  module.exports = {
    name: 'ElCheckbox',

    mixins: [Emitter],
    template:require('./checkbox.tpl'),
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    componentName: 'ElCheckbox',

    data() {
      return {
        selfModel: false,
        focus: false
      };
    },

    computed: {
      model: {
        get() {
          return this.isGroup
              ? this.store : this.value !== undefined
              ? this.value : this.selfModel;
        },

        set(val) {
          if (this.isGroup) {
            this.dispatch('ElCheckboxGroup', 'input', [val]);
          } else if (this.value !== undefined) {
            this.$emit('input', val);
          } else {
            this.selfModel = val;
          }
        }
      },

      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model;
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel;
        }
      },

      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },

      store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      }
    },

    props: {
      value: {},
      label: {},
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
    },

    methods: {
      addToStore() {
        if (
            Array.isArray(this.model) &&
            this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange(ev) {
        this.$emit('change', ev);
        if (this.isGroup) {
          this.$nextTick(_ => {
            this.dispatch('ElCheckboxGroup', 'change', [this._checkboxGroup.value]);
        });
        }
      }
    },

    created() {
      this.checked && this.addToStore();
    }
  }
})