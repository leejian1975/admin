

define(function (require, exports, module) {
  const Emitter = require('../../src/mixins/emitter')
  const calcTextareaHeight =  require('./calcTextareaHeight');
    const merge = require('../../src/utils/merge');
  module.exports = {
    name: 'ElInput',
    template:require('./input.tpl'),
    install : function(Vue) {
      Vue.component(this.name, this);
    },

    componentName: 'ElInput',

    mixins: [Emitter],


      data: function data() {
          return {
              currentValue: this.value,
              textareaCalcStyle: {}
          };
      },


      props: {
          value: [String, Number],
          placeholder: String,
          size: String,
          resize: String,
          readonly: Boolean,
          autofocus: Boolean,
          icon: String,
          disabled: Boolean,
          type: {
              type: String,
              default: 'text'
          },
          name: String,
          autosize: {
              type: [Boolean, Object],
              default: false
          },
          rows: {
              type: Number,
              default: 2
          },
          autoComplete: {
              type: String,
              default: 'off'
          },
          form: String,
          maxlength: Number,
          minlength: Number,
          max: {},
          min: {},
          step: {},
          validateEvent: {
              type: Boolean,
              default: true
          },
          onIconClick: Function
      },

      computed: {
          validating: function validating() {
              return this.$parent.validateState === 'validating';
          },
          textareaStyle: function textareaStyle() {
              return (0, merge)({}, this.textareaCalcStyle, { resize: this.resize });
          }
      },

      watch: {
          'value': function value(val, oldValue) {
              this.setCurrentValue(val);
          }
      },

      methods: {
          handleBlur: function handleBlur(event) {
              this.$emit('blur', event);
              if (this.validateEvent) {
                  this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
              }
          },
          inputSelect: function inputSelect() {
              this.$refs.input.select();
          },
          resizeTextarea: function resizeTextarea() {
              if (this.$isServer) return;
              var autosize = this.autosize,
                  type = this.type;

              if (!autosize || type !== 'textarea') return;
              var minRows = autosize.minRows;
              var maxRows = autosize.maxRows;

              this.textareaCalcStyle = (0, calcTextareaHeight)(this.$refs.textarea, minRows, maxRows);
          },
          handleFocus: function handleFocus(event) {
              this.$emit('focus', event);
          },
          handleInput: function handleInput(event) {
              var value = event.target.value;
              this.$emit('input', value);
              this.setCurrentValue(value);
              this.$emit('change', value);
          },
          handleIconClick: function handleIconClick(event) {
              if (this.onIconClick) {
                  this.onIconClick(event);
              }
              this.$emit('click', event);
          },
          setCurrentValue: function setCurrentValue(value) {
              var _this = this;

              if (value === this.currentValue) return;
              this.$nextTick(function (_) {
                  _this.resizeTextarea();
              });
              this.currentValue = value;
              if (this.validateEvent) {
                  this.dispatch('ElFormItem', 'el.form.change', [value]);
              }
          }
      },

      created: function created() {
          this.$on('inputSelect', this.inputSelect);
      },
      mounted: function mounted() {
          this.resizeTextarea();
      }
  }
})