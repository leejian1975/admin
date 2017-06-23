
define(function (require, exports, module) {
  const Emitter = require('../../src/mixins/emitter.js');
  const Locale = require('../../src/locale/index.js');
  const ElInput = require('../../packages/input/index.js');
  const ElSelectMenu = require('./select-dropdown.js');
  const ElOption = require('./option.js');
  const ElTag = require('../../packages/tag/index.js');
  const ElScrollbar = require('../../packages/scrollbar/index.js');
  const debounce = require('throttle-debounce').debounce;
  const Clickoutside = require('../../src/utils/clickoutside.js');
  const addClass = require('../../src/utils/dom.js').addClass;
  const removeClass = require('../../src/utils/dom.js').removeClass;
  const hasClass = require('../../src/utils/dom.js').hasClass;
  const addResizeListener = require('../../src/utils/resize-event').addResizeListener;
  const removeResizeListener  = require('../../src/utils/resize-event').removeResizeListener;
  const t = require('../../src/locale/index.js').t;
  const merge = require('../../src/utils/merge.js');
  const sizeMap = {
    'large': 42,
    'small': 30,
    'mini': 22
  };
  module.exports = {
      mixins: [Emitter, Locale],

      name: 'ElSelect',
      install : function(Vue) {
          Vue.component(this.name, this);
      },
      template:require('./select.tpl'),

      componentName: 'ElSelect',

      computed: {
          iconClass: function iconClass() {
              var criteria = this.clearable && !this.disabled && this.inputHovering && !this.multiple && this.value !== undefined && this.value !== '';
              return criteria ? 'circle-close is-show-close' : this.remote && this.filterable ? '' : 'caret-top';
          },
          debounce: function debounce() {
              return this.remote ? 300 : 0;
          },
          emptyText: function emptyText() {
              if (this.loading) {
                  return this.loadingText || t('el.select.loading');
              } else {
                  if (this.remote && this.query === '' && this.options.length === 0) return false;
                  if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
                      return this.noMatchText || t('el.select.noMatch');
                  }
                  if (this.options.length === 0) {
                      return this.noDataText || t('el.select.noData');
                  }
              }
              return null;
          },
          showNewOption: function showNewOption() {
              var _this = this;

              var hasExistingOption = this.options.filter(function (option) {
                  return !option.created;
              }).some(function (option) {
                  return option.currentLabel === _this.query;
              });
              return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
          }
      },

      components: {
          ElInput: ElInput,
          ElSelectMenu: ElSelectMenu,
          ElOption: ElOption,
          ElTag: ElTag,
          ElScrollbar: ElScrollbar
      },

      directives: { Clickoutside:  Clickoutside},

      props: {
          name: String,
          value: {},
          size: String,
          disabled: Boolean,
          clearable: Boolean,
          filterable: Boolean,
          allowCreate: Boolean,
          loading: Boolean,
          popperClass: String,
          remote: Boolean,
          loadingText: String,
          noMatchText: String,
          noDataText: String,
          remoteMethod: Function,
          filterMethod: Function,
          multiple: Boolean,
          multipleLimit: {
              type: Number,
              default: 0
          },
          placeholder: {
              type: String,
              default: function _default() {
                  return t('el.select.placeholder');
              }
          }
      },

      data: function data() {
          return {
              options: [],
              cachedOptions: [],
              createdOption: null,
              createdSelected: false,
              selected: this.multiple ? [] : {},
              isSelect: true,
              inputLength: 20,
              inputWidth: 0,
              cachedPlaceHolder: '',
              optionsCount: 0,
              filteredOptionsCount: 0,
              dropdownUl: null,
              visible: false,
              selectedLabel: '',
              hoverIndex: -1,
              query: '',
              bottomOverflow: 0,
              topOverflow: 0,
              optionsAllDisabled: false,
              inputHovering: false,
              currentPlaceholder: ''
          };
      },


      watch: {
          placeholder: function placeholder(val) {
              this.cachedPlaceHolder = this.currentPlaceholder = val;
          },
          value: function value(val) {
              if (this.multiple) {
                  this.resetInputHeight();
                  if (val.length > 0 || this.$refs.input && this.query !== '') {
                      this.currentPlaceholder = '';
                  } else {
                      this.currentPlaceholder = this.cachedPlaceHolder;
                  }
              }
              this.setSelected();
              if (this.filterable && !this.multiple) {
                  this.inputLength = 20;
              }
              this.$emit('change', val);
              this.dispatch('ElFormItem', 'el.form.change', val);
          },
          query: function query(val) {
              var _this2 = this;

              this.$nextTick(function () {
                  if (_this2.visible) _this2.broadcast('ElSelectDropdown', 'updatePopper');
              });
              this.hoverIndex = -1;
              if (this.multiple && this.filterable) {
                  this.inputLength = this.$refs.input.value.length * 15 + 20;
                  this.managePlaceholder();
                  this.resetInputHeight();
              }
              if (this.remote && typeof this.remoteMethod === 'function') {
                  this.hoverIndex = -1;
                  this.remoteMethod(val);
                  this.broadcast('ElOption', 'resetIndex');
              } else if (typeof this.filterMethod === 'function') {
                  this.filterMethod(val);
                  this.broadcast('ElOptionGroup', 'queryChange');
              } else {
                  this.filteredOptionsCount = this.optionsCount;
                  this.broadcast('ElOption', 'queryChange', val);
                  this.broadcast('ElOptionGroup', 'queryChange');
              }
          },
          visible: function visible(val) {
              var _this3 = this;

              if (!val) {
                  this.$refs.reference.$el.querySelector('input').blur();
                  this.handleIconHide();
                  this.broadcast('ElSelectDropdown', 'destroyPopper');
                  if (this.$refs.input) {
                      this.$refs.input.blur();
                  }
                  this.query = '';
                  this.selectedLabel = '';
                  this.inputLength = 20;
                  this.resetHoverIndex();
                  this.$nextTick(function () {
                      if (_this3.$refs.input && _this3.$refs.input.value === '' && _this3.selected.length === 0) {
                          _this3.currentPlaceholder = _this3.cachedPlaceHolder;
                      }
                  });
                  if (!this.multiple) {
                      this.getOverflows();
                      if (this.selected) {
                          if (this.filterable && this.allowCreate && this.createdSelected && this.createdOption) {
                              this.selectedLabel = this.createdOption.currentLabel;
                          } else {
                              this.selectedLabel = this.selected.currentLabel;
                          }
                          if (this.filterable) this.query = this.selectedLabel;
                      }
                  }
              } else {
                  this.handleIconShow();
                  this.broadcast('ElSelectDropdown', 'updatePopper');
                  if (this.filterable) {
                      this.query = this.selectedLabel;
                      if (this.multiple) {
                          this.$refs.input.focus();
                      } else {
                          if (!this.remote) {
                              this.broadcast('ElOption', 'queryChange', '');
                              this.broadcast('ElOptionGroup', 'queryChange');
                          }
                          this.broadcast('ElInput', 'inputSelect');
                      }
                  }
              }
              this.$emit('visible-change', val);
          },
          options: function options(val) {
              if (this.$isServer) return;
              this.optionsAllDisabled = val.length === val.filter(function (item) {
                      return item.disabled === true;
                  }).length;
              if (this.multiple) {
                  this.resetInputHeight();
              }
              var inputs = this.$el.querySelectorAll('input');
              if ([].indexOf.call(inputs, document.activeElement) === -1) {
                  this.setSelected();
              }
          }
      },

      methods: {
          handleIconHide: function handleIconHide() {
              var icon = this.$el.querySelector('.el-input__icon');
              if (icon) {
                  removeClass(icon, 'is-reverse');
              }
          },
          handleIconShow: function handleIconShow() {
              var icon = this.$el.querySelector('.el-input__icon');
              if (icon && !hasClass(icon, 'el-icon-circle-close')) {
                  addClass(icon, 'is-reverse');
              }
          },
          handleMenuEnter: function handleMenuEnter() {
              if (!this.dropdownUl) {
                  this.dropdownUl = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
                  this.getOverflows();
              }
              if (!this.multiple && this.dropdownUl) {
                  this.resetMenuScroll();
              }
          },
          getOverflows: function getOverflows() {
              if (this.dropdownUl && this.selected && this.selected.$el) {
                  var selectedRect = this.selected.$el.getBoundingClientRect();
                  var popperRect = this.$refs.popper.$el.getBoundingClientRect();
                  this.bottomOverflow = selectedRect.bottom - popperRect.bottom;
                  this.topOverflow = selectedRect.top - popperRect.top;
              }
          },
          resetMenuScroll: function resetMenuScroll() {
              if (this.bottomOverflow > 0) {
                  this.dropdownUl.scrollTop += this.bottomOverflow;
              } else if (this.topOverflow < 0) {
                  this.dropdownUl.scrollTop += this.topOverflow;
              }
          },
          getOption: function getOption(value) {
              var option = void 0;
              for (var i = this.cachedOptions.length - 1; i >= 0; i--) {
                  var cachedOption = this.cachedOptions[i];
                  if (cachedOption.value === value) {
                      option = cachedOption;
                      break;
                  }
              }
              if (option) return option;
              var label = typeof value === 'string' || typeof value === 'number' ? value : '';
              var newOption = {
                  value: value,
                  currentLabel: label
              };
              if (this.multiple) {
                  newOption.hitState = false;
              }
              return newOption;
          },
          setSelected: function setSelected() {
              var _this4 = this;

              if (!this.multiple) {
                  var option = this.getOption(this.value);
                  if (option.created) {
                      this.createdOption = merge({}, option);
                      this.createdSelected = true;
                  } else {
                      this.createdSelected = false;
                  }
                  this.selectedLabel = option.currentLabel;
                  this.selected = option;
                  if (this.filterable) this.query = this.selectedLabel;
                  return;
              }
              var result = [];
              if (Array.isArray(this.value)) {
                  this.value.forEach(function (value) {
                      result.push(_this4.getOption(value));
                  });
              }
              this.selected = result;
              this.$nextTick(function () {
                  _this4.resetInputHeight();
              });
          },
          handleFocus: function handleFocus() {
              this.visible = true;
          },
          handleIconClick: function handleIconClick(event) {
              if (this.iconClass.indexOf('circle-close') > -1) {
                  this.deleteSelected(event);
              } else {
                  this.toggleMenu();
              }
          },
          handleMouseDown: function handleMouseDown(event) {
              if (event.target.tagName !== 'INPUT') return;
              if (this.visible) {
                  this.handleClose();
                  event.preventDefault();
              }
          },
          doDestroy: function doDestroy() {
              this.$refs.popper && this.$refs.popper.doDestroy();
          },
          handleClose: function handleClose() {
              this.visible = false;
          },
          toggleLastOptionHitState: function toggleLastOptionHitState(hit) {
              if (!Array.isArray(this.selected)) return;
              var option = this.selected[this.selected.length - 1];
              if (!option) return;

              if (hit === true || hit === false) {
                  option.hitState = hit;
                  return hit;
              }

              option.hitState = !option.hitState;
              return option.hitState;
          },
          deletePrevTag: function deletePrevTag(e) {
              if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
                  this.value.pop();
              }
          },
          managePlaceholder: function managePlaceholder() {
              if (this.currentPlaceholder !== '') {
                  this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
              }
          },
          resetInputState: function resetInputState(e) {
              if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
              this.inputLength = this.$refs.input.value.length * 15 + 20;
              this.resetInputHeight();
          },
          resetInputHeight: function resetInputHeight() {
              var _this5 = this;

              this.$nextTick(function () {
                  var inputChildNodes = _this5.$refs.reference.$el.childNodes;
                  var input = [].filter.call(inputChildNodes, function (item) {
                      return item.tagName === 'INPUT';
                  })[0];
                  input.style.height = Math.max(_this5.$refs.tags.clientHeight + 6, sizeMap[_this5.size] || 36) + 'px';
                  if (_this5.visible && _this5.emptyText !== false) {
                      _this5.broadcast('ElSelectDropdown', 'updatePopper');
                  }
              });
          },
          resetHoverIndex: function resetHoverIndex() {
              var _this6 = this;

              setTimeout(function () {
                  if (!_this6.multiple) {
                      _this6.hoverIndex = _this6.options.indexOf(_this6.selected);
                  } else {
                      if (_this6.selected.length > 0) {
                          _this6.hoverIndex = Math.min.apply(null, _this6.selected.map(function (item) {
                              return _this6.options.indexOf(item);
                          }));
                      } else {
                          _this6.hoverIndex = -1;
                      }
                  }
              }, 300);
          },
          handleOptionSelect: function handleOptionSelect(option) {
              if (!this.multiple) {
                  this.$emit('input', option.value);
                  this.visible = false;
              } else {
                  var optionIndex = -1;
                  this.value.forEach(function (item, index) {
                      if (item === option.value) {
                          optionIndex = index;
                      }
                  });
                  if (optionIndex > -1) {
                      this.value.splice(optionIndex, 1);
                  } else if (this.multipleLimit <= 0 || this.value.length < this.multipleLimit) {
                      this.value.push(option.value);
                  }
                  if (option.created) {
                      this.query = '';
                      this.inputLength = 20;
                  }
                  if (this.filterable) this.$refs.input.focus();
              }
          },
          toggleMenu: function toggleMenu() {
              if (this.filterable && this.query === '' && this.visible) {
                  return;
              }
              if (!this.disabled) {
                  this.visible = !this.visible;
              }
          },
          navigateOptions: function navigateOptions(direction) {
              if (!this.visible) {
                  this.visible = true;
                  return;
              }
              if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
              if (!this.optionsAllDisabled) {
                  if (direction === 'next') {
                      this.hoverIndex++;
                      if (this.hoverIndex === this.options.length) {
                          this.hoverIndex = 0;
                      }
                      this.resetScrollTop();
                      if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
                          this.navigateOptions('next');
                      }
                  }
                  if (direction === 'prev') {
                      this.hoverIndex--;
                      if (this.hoverIndex < 0) {
                          this.hoverIndex = this.options.length - 1;
                      }
                      this.resetScrollTop();
                      if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
                          this.navigateOptions('prev');
                      }
                  }
              }
          },
          resetScrollTop: function resetScrollTop() {
              var bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom - this.$refs.popper.$el.getBoundingClientRect().bottom;
              var topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top - this.$refs.popper.$el.getBoundingClientRect().top;
              if (bottomOverflowDistance > 0) {
                  this.dropdownUl.scrollTop += bottomOverflowDistance;
              }
              if (topOverflowDistance < 0) {
                  this.dropdownUl.scrollTop += topOverflowDistance;
              }
          },
          selectOption: function selectOption() {
              if (this.options[this.hoverIndex]) {
                  this.handleOptionSelect(this.options[this.hoverIndex]);
              }
          },
          deleteSelected: function deleteSelected(event) {
              event.stopPropagation();
              this.$emit('input', '');
              this.visible = false;
          },
          deleteTag: function deleteTag(event, tag) {
              var index = this.selected.indexOf(tag);
              if (index > -1 && !this.disabled) {
                  this.value.splice(index, 1);
              }
              event.stopPropagation();
          },
          onInputChange: function onInputChange() {
              if (this.filterable) {
                  this.query = this.selectedLabel;
              }
          },
          onOptionDestroy: function onOptionDestroy(option) {
              this.optionsCount--;
              this.filteredOptionsCount--;
              var index = this.options.indexOf(option);
              if (index > -1) {
                  this.options.splice(index, 1);
              }
              this.broadcast('ElOption', 'resetIndex');
          },
          resetInputWidth: function resetInputWidth() {
              this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
          },
          handleResize: function handleResize() {
              this.resetInputWidth();
              if (this.multiple) this.resetInputHeight();
          }
      },

      created: function created() {
          var _this7 = this;

          this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
          if (this.multiple && !Array.isArray(this.value)) {
              this.$emit('input', []);
          }
          if (!this.multiple && Array.isArray(this.value)) {
              this.$emit('input', '');
          }
          this.setSelected();

          this.debouncedOnInputChange = debounce(this.debounce, function () {
              _this7.onInputChange();
          });

          this.$on('handleOptionClick', this.handleOptionSelect);
          this.$on('onOptionDestroy', this.onOptionDestroy);
          this.$on('setSelected', this.setSelected);
      },
      mounted: function mounted() {
          var _this8 = this;

          if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
              this.currentPlaceholder = '';
          }
          addResizeListener(this.$el, this.handleResize);
          if (this.remote && this.multiple) {
              this.resetInputHeight();
          }
          this.$nextTick(function () {
              if (_this8.$refs.reference && _this8.$refs.reference.$el) {
                  _this8.inputWidth = _this8.$refs.reference.$el.getBoundingClientRect().width;
              }
          });
      },
      destroyed: function destroyed() {
          if (this.handleResize) removeResizeListener(this.$el, this.handleResize);
      }
  };
})