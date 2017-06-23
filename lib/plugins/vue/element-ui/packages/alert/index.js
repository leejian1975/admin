// import Alert from './src/main';
//
// /* istanbul ignore next */
// Alert.install = function(Vue) {
//   Vue.component(Alert.name, Alert);
// };

//export default Alert;
define(function (require, exports, module) {
  const TYPE_CLASSES_MAP = {
    'success': 'el-icon-circle-check',
    'warning': 'el-icon-warning',
    'error': 'el-icon-circle-cross'
  };
  module.exports = {
    name: 'ElAlert',
    template:require('./src/alert.tpl'),
    install:function(Vue){
      Vue.component(this.name, this);
    },
    props: {
      title: {
        type: String,
        default: '',
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info'
      },
      closable: {
        type: Boolean,
        default: true
      },
      closeText: {
        type: String,
        default: ''
      },
      showIcon: {
        type: Boolean,
        default: false
      }
    },

    data:function() {
      return {
        visible: true
      };
    },

    methods: {
      close() {
        this.visible = false;
        this.$emit('close');
      }
    },

    computed: {
      typeClass() {
        return `el-alert--${ this.type }`;
      },

      iconClass() {
        return TYPE_CLASSES_MAP[this.type] || 'el-icon-information';
      },

      isBigIcon() {
        return this.description ? 'is-big' : '';
      },

      isBoldTitle() {
        return this.description ? 'is-bold' : '';
      }
    }
  };
})