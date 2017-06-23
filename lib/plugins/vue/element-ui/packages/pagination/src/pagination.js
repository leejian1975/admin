define(function(require,exports,module) {
  const Pager = require('./pager.js');
  const ElSelect = require('../../select/index');
  const ElOption = require('../../option/index');
  const Locale = require('../../../src/mixins/locale');

  module.exports = {
    name: 'ElPagination',

    props: {
      pageSize: {
        type: Number,
        default: 10
      },

      small: Boolean,

      total: Number,

      pageCount: Number,

      currentPage: {
        type: Number,
        default: 1
      },

      layout: {
        default: 'prev, pager, next, jumper, ->, total'
      },

      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 30, 40, 50, 100];
        }
      }
    },

    data() {
      return {
        internalCurrentPage: 1,
        internalPageSize: 0
      };
    },

    render: function render(h) {
      var template = h(
          'div',
          { 'class': 'el-pagination' },
          []
      );
      var layout = this.layout || '';
      if (!layout) return;
      var TEMPLATE_MAP = {
        prev: h(
            'prev',
            null,
            []
        ),
        jumper: h(
            'jumper',
            null,
            []
        ),
        pager: h(
            'pager',
            {
              attrs: { currentPage: this.internalCurrentPage, pageCount: this.internalPageCount },
              on: {
                'change': this.handleCurrentChange
              }
            },
            []
        ),
        next: h(
            'next',
            null,
            []
        ),
        sizes: h(
            'sizes',
            {
              attrs: { pageSizes: this.pageSizes }
            },
            []
        ),
        slot: h(
            'my-slot',
            null,
            []
        ),
        total: h(
            'total',
            null,
            []
        )
      };
      var components = layout.split(',').map(function (item) {
        return item.trim();
      });
      var rightWrapper = h(
          'div',
          { 'class': 'el-pagination__rightwrapper' },
          []
      );
      var haveRightWrapper = false;

      if (this.small) {
        template.data.class += ' el-pagination--small';
      }

      components.forEach(function (compo) {
        if (compo === '->') {
          haveRightWrapper = true;
          return;
        }

        if (!haveRightWrapper) {
          template.children.push(TEMPLATE_MAP[compo]);
        } else {
          rightWrapper.children.push(TEMPLATE_MAP[compo]);
        }
      });

      if (haveRightWrapper) {
        template.children.push(rightWrapper);
      }

      return template;
    },

    components: {
      MySlot: {
        render: function render(h) {
          return this.$parent.$slots.default ? this.$parent.$slots.default[0] : '';
        }

      },
      Prev: {
        render: function render(h) {
          return h(
              'button',
              {
                attrs: {
                  type: 'button'
                },
                'class': ['btn-prev', { disabled: this.$parent.internalCurrentPage <= 1 }],
                on: {
                  'click': this.$parent.prev
                }
              },
              [h(
                  'i',
                  { 'class': 'el-icon el-icon-arrow-left' },
                  []
              )]
          );
        }
      },

      Next: {
        render: function render(h) {
          return h(
              'button',
              {
                attrs: {
                  type: 'button'
                },
                'class': ['btn-next', { disabled: this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }],
                on: {
                  'click': this.$parent.next
                }
              },
              [h(
                  'i',
                  { 'class': 'el-icon el-icon-arrow-right' },
                  []
              )]
          );
        }
      },

      Sizes: {
        mixins: [Locale],

        props: {
          pageSizes: Array
        },

        watch: {
          pageSizes: {
            immediate: true,
            handler(value) {
              if (Array.isArray(value)) {
                this.$parent.internalPageSize = value.indexOf(this.$parent.pageSize) > -1
                    ? this.$parent.pageSize
                    : this.pageSizes[0];
              }
            }
          }
        },

        render: function render(h) {
          var _this = this;

          return h(
              'span',
              { 'class': 'el-pagination__sizes' },
              [h(
                  'el-select',
                  {
                    attrs: {
                      value: this.$parent.internalPageSize
                    },
                    on: {
                      'input': this.handleChange
                    }
                  },
                  [this.pageSizes.map(function (item) {
                    return h(
                        'el-option',
                        {
                          attrs: {
                            value: item,
                            label: item + ' ' + _this.t('el.pagination.pagesize') }
                        },
                        []
                    );
                  })]
              )]
          );
        },

        components: {
          ElSelect,
          ElOption
        },

        methods: {
          handleChange(val) {
            if (val !== this.$parent.internalPageSize) {
              this.$parent.internalPageSize = val = parseInt(val, 10);
              this.$parent.$emit('size-change', val);
            }
          }
        }
      },

      Jumper: {
        mixins: [Locale],

        data() {
          return {
            oldValue: null
          };
        },

        methods: {
          handleFocus(event) {
            this.oldValue = event.target.value;
          },

          handleChange({target}) {
            this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(target.value);
            this.oldValue = null;
          }
        },

        render: function render(h) {
          return h(
              'span',
              { 'class': 'el-pagination__jump' },
              [this.t('el.pagination.goto'), h(
                  'input',
                  {
                    'class': 'el-pagination__editor',
                    attrs: { type: 'number',
                      min: 1,
                      max: this.internalPageCount,

                      number: true },
                    domProps: {
                      'value': this.$parent.internalCurrentPage
                    },
                    on: {
                      'change': this.handleChange,
                      'focus': this.handleFocus
                    },

                    style: { width: '30px' } },
                  []
              ), this.t('el.pagination.pageClassifier')]
          );
        }
      },

      Total: {
        mixins: [Locale],

        render: function render(h) {
          return typeof this.$parent.total === 'number' ? h(
              'span',
              { 'class': 'el-pagination__total' },
              [this.t('el.pagination.total', { total: this.$parent.total })]
          ) : '';
        }
      },

      Pager
    },

    methods: {
      handleCurrentChange(val) {
        this.internalCurrentPage = this.getValidCurrentPage(val);
      },

      prev() {
        const newVal = this.internalCurrentPage - 1;
        this.internalCurrentPage = this.getValidCurrentPage(newVal);
      },

      next() {
        const newVal = this.internalCurrentPage + 1;
        this.internalCurrentPage = this.getValidCurrentPage(newVal);
      },

      getValidCurrentPage(value) {
        value = parseInt(value, 10);

        const havePageCount = typeof this.internalPageCount === 'number';

        let resetValue;
        if (!havePageCount) {
          if (isNaN(value) || value < 1) resetValue = 1;
        } else {
          if (value < 1) {
            resetValue = 1;
          } else if (value > this.internalPageCount) {
            resetValue = this.internalPageCount;
          }
        }

        if (resetValue === undefined && isNaN(value)) {
          resetValue = 1;
        } else if (resetValue === 0) {
          resetValue = 1;
        }

        return resetValue === undefined ? value : resetValue;
      }
    },

    computed: {
      internalPageCount() {
        if (typeof this.total === 'number') {
          return Math.ceil(this.total / this.internalPageSize);
        } else if (typeof this.pageCount === 'number') {
          return this.pageCount;
        }
        return null;
      }
    },

    watch: {
      currentPage: {
        immediate: true,
        handler(val) {
          this.internalCurrentPage = val;
        }
      },

      pageSize: {
        immediate: true,
        handler(val) {
          this.internalPageSize = val;
        }
      },

      internalCurrentPage: function internalCurrentPage(newVal, oldVal) {
        var _this2 = this;

        newVal = parseInt(newVal, 10);

        /* istanbul ignore if */
        if (isNaN(newVal)) {
          newVal = oldVal || 1;
        } else {
          newVal = this.getValidCurrentPage(newVal);
        }

        if (newVal !== undefined) {
          this.$nextTick(function () {
            _this2.internalCurrentPage = newVal;
            if (oldVal !== newVal) {
              _this2.$emit('current-change', _this2.internalCurrentPage);
            }
          });
        } else {
          this.$emit('current-change', this.internalCurrentPage);
        }
      },

      internalPageCount(newVal) {
        /* istanbul ignore if */
        const oldPage = this.internalCurrentPage;
        if (newVal > 0 && oldPage === 0) {
          this.internalCurrentPage = 1;
        } else if (oldPage > newVal) {
          this.internalCurrentPage = newVal === 0 ? 1 : newVal;
        }
      }
    }
  };
})