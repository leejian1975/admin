
define(function(require,exports,module){
  const Popper = require('../../src/utils/vue-popper');

  module.exports = {
    name: 'ElDropdownMenu',
    template:require('./dropdown-menu.tpl'),
    componentName: 'ElDropdownMenu',
    install : function(Vue) {
     Vue.component(this.name, this);
    },
    mixins: [Popper],

    created() {
      var _this = this;
      this.$on('visible', function(val){
        _this.showPopper = val;
    });
    },

    mounted() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$el;
    },

    watch: {
      '$parent.menuAlign': {
        immediate: true,
        handler(val) {
          this.currentPlacement = `bottom-${val}`;
        }
      }
    }
  };
})
