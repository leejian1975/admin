
define(function(require,exports,module){
  const Clickoutside = require('../../src/utils/clickoutside');
  const Emitter = require('../../src/mixins/emitter');
  const ElButton = require('../button/index');
  const ElButtonGroup = require('../button-group/index');

  module.exports = {
    name: 'ElDropdown',
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    componentName: 'ElDropdown',

    mixins: [Emitter],

    directives: { Clickoutside },

    components: {
      ElButton,
      ElButtonGroup
    },

    props: {
      trigger: {
        type: String,
        default: 'hover'
      },
      menuAlign: {
        type: String,
        default: 'end'
      },
      type: String,
      size: String,
      splitButton: Boolean,
      hideOnClick: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        timeout: null,
        visible: false
      };
    },

    mounted() {
      this.$on('menu-item-click', this.handleMenuItemClick);
      this.initEvent();
    },

    watch: {
      visible(val) {
        this.broadcast('ElDropdownMenu', 'visible', val);
      }
    },

    methods: {
      show() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.visible = true;
      }, 250);
      },
      hide() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.visible = false;
      }, 150);
      },
      handleClick() {
        this.visible = !this.visible;
      },
      initEvent() {
        let { trigger, show, hide, handleClick, splitButton } = this;
        let triggerElm = splitButton
            ? this.$refs.trigger.$el
            : this.$slots.default[0].elm;

        if (trigger === 'hover') {
          triggerElm.addEventListener('mouseenter', show);
          triggerElm.addEventListener('mouseleave', hide);

          let dropdownElm = this.$slots.dropdown[0].elm;

          dropdownElm.addEventListener('mouseenter', show);
          dropdownElm.addEventListener('mouseleave', hide);
        } else if (trigger === 'click') {
          triggerElm.addEventListener('click', handleClick);
        }
      },
      handleMenuItemClick(command, instance) {
        if (this.hideOnClick) {
          this.visible = false;
        }
        this.$emit('command', command, instance);
      }
    },
    render: function render(h) {
      var _this3 = this;

      var hide = this.hide,
          splitButton = this.splitButton,
          type = this.type,
          size = this.size;


      var handleClick = function handleClick(_) {
        _this3.$emit('click');
      };

      var triggerElm = !splitButton ? this.$slots.default : h(
          'el-button-group',
          null,
          [h(
              'el-button',
              {
                attrs: { type: type, size: size },
                nativeOn: {
                  'click': handleClick
                }
              },
              [this.$slots.default]
          ), h(
              'el-button',
              { ref: 'trigger', attrs: { type: type, size: size },
                'class': 'el-dropdown__caret-button' },
              [h(
                  'i',
                  { 'class': 'el-dropdown__icon el-icon-caret-bottom' },
                  []
              )]
          )]
      );

      return h(
          'div',
          { 'class': 'el-dropdown', directives: [{
            name: 'clickoutside',
            value: hide
          }]
          },
          [triggerElm, this.$slots.dropdown]
      );
    }


  };

})