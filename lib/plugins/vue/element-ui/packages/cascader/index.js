
define(function(require,exports,module){
  const Vue = require('vue');
  const ElCascaderMenu = require('./menu');
  const ElInput = require('../input/index');
  const Popper = require('../../src/utils/vue-popper');
  const Clickoutside = require('../../src/utils/clickoutside');
  const emitter = require('../../src/mixins/emitter');
  const Locale = require('../../src/mixins/locale');
  const  t = require('../../src/locale/index').t;
  const debounce = require('throttle-debounce').debounce;

  const popperMixin = {
    props: {
      placement: {
        type: String,
        default: 'bottom-start'
      },
      appendToBody: Popper.props.appendToBody,
      offset: Popper.props.offset,
      boundariesPadding: Popper.props.boundariesPadding,
      popperOptions: Popper.props.popperOptions
    },
    methods: Popper.methods,
    data: Popper.data,
    beforeDestroy: Popper.beforeDestroy
  };


  module.exports = {
    name: 'ElCascader',
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    directives: { Clickoutside },
    template:require('./main.tpl'),
    mixins: [popperMixin, emitter, Locale],

    components: {
      ElInput
    },

    props: {
      options: {
        type: Array,
        required: true
      },
      props: {
        type: Object,
        default: function _default() {
          return {
            children: 'children',
            label: 'label',
            value: 'value',
            disabled: 'disabled'
          };
        }
      },
      value: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      placeholder: {
        type: String,
        default: function _default() {
          return (0, t)('el.cascader.placeholder');
        }
      },
      disabled: Boolean,
      clearable: {
        type: Boolean,
        default: false
      },
      changeOnSelect: Boolean,
      popperClass: String,
      expandTrigger: {
        type: String,
        default: 'click'
      },
      filterable: Boolean,
      size: String,
      showAllLevels: {
        type: Boolean,
        default: true
      },
      debounce: {
        type: Number,
        default: 300
      }
    },

    data: function data() {
      return {
        currentValue: this.value,
        menu: null,
        debouncedInputChange: function debouncedInputChange() {},

        menuVisible: false,
        inputHover: false,
        inputValue: '',
        flatOptions: null
      };
    },


    computed: {
      labelKey: function labelKey() {
        return this.props.label || 'label';
      },
      valueKey: function valueKey() {
        return this.props.value || 'value';
      },
      childrenKey: function childrenKey() {
        return this.props.children || 'children';
      },
      currentLabels: function currentLabels() {
        var _this = this;

        var options = this.options;
        var labels = [];
        this.currentValue.forEach(function (value) {
          var targetOption = options && options.filter(function (option) {
                return option[_this.valueKey] === value;
              })[0];
          if (targetOption) {
            labels.push(targetOption[_this.labelKey]);
            options = targetOption[_this.childrenKey];
          }
        });
        return labels;
      }
    },

    watch: {
      menuVisible: function menuVisible(value) {
        value ? this.showMenu() : this.hideMenu();
      },
      value: function value(_value) {
        this.currentValue = _value;
      },
      currentValue: function currentValue(value) {
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      },

      options: {
        deep: true,
        handler: function handler(value) {
          if (!this.menu) {
            this.initMenu();
          }
          this.flatOptions = this.flattenOptions(this.options);
          this.menu.options = value;
        }
      }
    },

    methods: {
      initMenu: function initMenu() {
        this.menu = new Vue(ElCascaderMenu).$mount();
        this.menu.options = this.options;
        this.menu.props = this.props;
        this.menu.expandTrigger = this.expandTrigger;
        this.menu.changeOnSelect = this.changeOnSelect;
        this.menu.popperClass = this.popperClass;
        this.popperElm = this.menu.$el;
        this.menu.$on('pick', this.handlePick);
        this.menu.$on('activeItemChange', this.handleActiveItemChange);
      },
      showMenu: function showMenu() {
        var _this2 = this;

        if (!this.menu) {
          this.initMenu();
        }

        this.menu.value = this.currentValue.slice(0);
        this.menu.visible = true;
        this.menu.options = this.options;
        this.$nextTick(function (_) {
          _this2.updatePopper();
          _this2.menu.inputWidth = _this2.$refs.input.$el.offsetWidth - 2;
        });
      },
      hideMenu: function hideMenu() {
        this.inputValue = '';
        this.menu.visible = false;
      },
      handleActiveItemChange: function handleActiveItemChange(value) {
        var _this3 = this;

        this.$nextTick(function (_) {
          _this3.updatePopper();
        });
        this.$emit('active-item-change', value);
      },
      handlePick: function handlePick(value) {
        var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        this.currentValue = value;
        this.$emit('input', value);
        this.$emit('change', value);

        if (close) {
          this.menuVisible = false;
        }
      },
      handleInputChange: function handleInputChange(value) {
        var _this4 = this;

        if (!this.menuVisible) return;
        var flatOptions = this.flatOptions;

        if (!value) {
          this.menu.options = this.options;
          return;
        }

        var filteredFlatOptions = flatOptions.filter(function (optionsStack) {
          return optionsStack.some(function (option) {
            return new RegExp(value, 'i').test(option[_this4.labelKey]);
          });
        });

        if (filteredFlatOptions.length > 0) {
          filteredFlatOptions = filteredFlatOptions.map(function (optionStack) {
            return {
              __IS__FLAT__OPTIONS: true,
              value: optionStack.map(function (item) {
                return item[_this4.valueKey];
              }),
              label: _this4.renderFilteredOptionLabel(value, optionStack)
            };
          });
        } else {
          filteredFlatOptions = [{
            __IS__FLAT__OPTIONS: true,
            label: this.t('el.cascader.noMatch'),
            value: '',
            disabled: true
          }];
        }
        this.menu.options = filteredFlatOptions;
      },
      renderFilteredOptionLabel: function renderFilteredOptionLabel(inputValue, optionsStack) {
        var _this5 = this;

        return optionsStack.map(function (option, index) {
          var label = option[_this5.labelKey];
          var keywordIndex = label.toLowerCase().indexOf(inputValue.toLowerCase());
          var labelPart = label.slice(keywordIndex, inputValue.length + keywordIndex);
          var node = keywordIndex > -1 ? _this5.highlightKeyword(label, labelPart) : label;
          return index === 0 ? node : [' / ', node];
        });
      },
      highlightKeyword: function highlightKeyword(label, keyword) {
        var _this6 = this;

        var h = this._c;
        return label.split(keyword).map(function (node, index) {
          return index === 0 ? node : [h('span', { class: { 'el-cascader-menu__item__keyword': true } }, [_this6._v(keyword)]), node];
        });
      },
      flattenOptions: function flattenOptions(options) {
        var _this7 = this;

        var ancestor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var flatOptions = [];
        options.forEach(function (option) {
          var optionsStack = ancestor.concat(option);
          if (!option[_this7.childrenKey]) {
            flatOptions.push(optionsStack);
          } else {
            if (_this7.changeOnSelect) {
              flatOptions.push(optionsStack);
            }
            flatOptions = flatOptions.concat(_this7.flattenOptions(option[_this7.childrenKey], optionsStack));
          }
        });
        return flatOptions;
      },
      clearValue: function clearValue(ev) {
        ev.stopPropagation();
        this.handlePick([], true);
      },
      handleClickoutside: function handleClickoutside() {
        this.menuVisible = false;
      },
      handleClick: function handleClick() {
        if (this.disabled) return;
        if (this.filterable) {
          this.menuVisible = true;
          return;
        }
        this.menuVisible = !this.menuVisible;
      }
    },

    created: function created() {
      var _this8 = this;

      this.debouncedInputChange = (0, debounce)(this.debounce, function (value) {
        _this8.handleInputChange(value);
      });
    },
    mounted: function mounted() {
      this.flatOptions = this.flattenOptions(this.options);
    }
  }
})
