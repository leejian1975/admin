
define(function (require, exports, module) {
  module.exports = {
    name: 'ElSwitch',

    install : function(Vue) {
      Vue.component(this.name, this);
    },
    template:require('./switch.tpl'),
    props: {
      value: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 0
      },
      onIconClass: {
        type: String,
        default: ''
      },
      offIconClass: {
        type: String,
        default: ''
      },
      onText: {
        type: String,
        default: 'ON'
      },
      offText: {
        type: String,
        default: 'OFF'
      },
      onColor: {
        type: String,
        default: ''
      },
      offColor: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        coreWidth: this.width,
        buttonStyle: {
          transform: ''
        }
      };
    },
    computed: {
      hasText() {
        /* istanbul ignore next */
        return this.onText || this.offText;
      },
      _value: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      }
    },
    watch: {
      value() {
        if (this.onColor || this.offColor) {
          this.setBackgroundColor();
        }
        this.handleButtonTransform();
      }
    },
    methods: {
      handleChange(event) {
        this.$emit('change', event.currentTarget.checked);
      },
      handleButtonTransform() {
        this.buttonStyle.transform = this.value ? `translate(${ this.coreWidth - 20 }px, 2px)` : 'translate(2px, 2px)';
      },
      setBackgroundColor() {
        let newColor = this.value ? this.onColor : this.offColor;
        this.$refs.core.style.borderColor = newColor;
        this.$refs.core.style.backgroundColor = newColor;
      }
    },
    mounted() {
      /* istanbul ignore if */
      if (this.width === 0) {
        this.coreWidth = this.hasText ? 58 : 46;
      }
      this.handleButtonTransform();
      if (this.onColor || this.offColor) {
        this.setBackgroundColor();
      }
    }
  }
})
