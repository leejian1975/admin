
define(function (require, exports, module) {
  const getCell = require('./util').getCell;
  const getColumnByCell = require('./util').getColumnByCell;
  const getRowIdentity = require('./util').getRowIdentity;
  const ElCheckbox = require('../../checkbox/index');
  module.exports = {
    components: {
      ElCheckbox
    },

    props: {
      store: {
        required: true
      },
      context: {},
      layout: {
        required: true
      },
      rowClassName: [String, Function],
      rowStyle: [Object, Function],
      fixed: String,
      highlight: Boolean
    },

    render: function render(h) {
      var _this = this;

      var columnsHidden = this.columns.map(function (column, index) {
        return _this.isColumnHidden(index);
      });
      return h(
          'table',
          {
            'class': 'el-table__body',
            attrs: { cellspacing: '0',
              cellpadding: '0',
              border: '0' }
          },
          [h(
              'colgroup',
              null,
              [this._l(this.columns, function (column) {
                return h(
                    'col',
                    {
                      attrs: {
                        name: column.id,
                        width: column.realWidth || column.width
                      }
                    },
                    []
                );
              })]
          ), h(
              'tbody',
              null,
              [this._l(this.data, function (row, $index) {
                return [h(
                    'tr',
                    {
                      style: _this.rowStyle ? _this.getRowStyle(row, $index) : null,
                      key: _this.table.rowKey ? _this.getKeyOfRow(row, $index) : $index,
                      on: {
                        'dblclick': function dblclick($event) {
                          return _this.handleDoubleClick($event, row);
                        },
                        'click': function click($event) {
                          return _this.handleClick($event, row);
                        },
                        'contextmenu': function contextmenu($event) {
                          return _this.handleContextMenu($event, row);
                        },
                        'mouseenter': function mouseenter(_) {
                          return _this.handleMouseEnter($index);
                        },
                        'mouseleave': function mouseleave(_) {
                          return _this.handleMouseLeave();
                        }
                      },

                      'class': [_this.getRowClass(row, $index)] },
                    [_this._l(_this.columns, function (column, cellIndex) {
                      return h(
                          'td',
                          {
                            'class': [column.id, column.align, column.className || '', columnsHidden[cellIndex] ? 'is-hidden' : ''],
                            on: {
                              'mouseenter': function mouseenter($event) {
                                return _this.handleCellMouseEnter($event, row);
                              },
                              'mouseleave': _this.handleCellMouseLeave
                            }
                          },
                          [column.renderCell.call(_this._renderProxy, h, { row: row, column: column, $index: $index, store: _this.store, _self: _this.context || _this.table.$vnode.context })]
                      );
                    }), !_this.fixed && _this.layout.scrollY && _this.layout.gutterWidth ? h(
                        'td',
                        { 'class': 'gutter' },
                        []
                    ) : '']
                ), _this.store.states.expandRows.indexOf(row) > -1 ? h(
                    'tr',
                    null,
                    [h(
                        'td',
                        {
                          attrs: { colspan: _this.columns.length },
                          'class': 'el-table__expanded-cell' },
                        [_this.table.renderExpanded ? _this.table.renderExpanded(h, { row: row, $index: $index, store: _this.store }) : '']
                    )]
                ) : ''];
              })]
          )]
      );
    },

    watch: {
      'store.states.hoverRow'(newVal, oldVal) {
        if (!this.store.states.isComplex) return;
        const el = this.$el;
        if (!el) return;
        const rows = el.querySelectorAll('tbody > tr');
        const oldRow = rows[oldVal];
        const newRow = rows[newVal];
        if (oldRow) {
          oldRow.classList.remove('hover-row');
        }
        if (newRow) {
          newRow.classList.add('hover-row');
        }
      },
      'store.states.currentRow'(newVal, oldVal) {
        if (!this.highlight) return;
        const el = this.$el;
        if (!el) return;
        const data = this.store.states.data;
        const rows = el.querySelectorAll('tbody > tr');
        const oldRow = rows[data.indexOf(oldVal)];
        const newRow = rows[data.indexOf(newVal)];
        if (oldRow) {
          oldRow.classList.remove('current-row');
        } else if (rows) {
          [].forEach.call(rows, function(row){ row.classList.remove('current-row')}
        )
          ;
        }
        if (newRow) {
          newRow.classList.add('current-row');
        }
      }
    },

    computed: {
      table() {
        return this.$parent;
      },

      data() {
        return this.store.states.data;
      },

      columnsCount() {
        return this.store.states.columns.length;
      },

      leftFixedCount() {
        return this.store.states.fixedColumns.length;
      },

      rightFixedCount() {
        return this.store.states.rightFixedColumns.length;
      },

      columns() {
        return this.store.states.columns;
      }
    },

    data() {
      return {
        tooltipDisabled: true
      };
    },

    methods: {
      getKeyOfRow(row, index) {
        const rowKey = this.table.rowKey;
        if (rowKey) {
          return getRowIdentity(row, rowKey);
        }
        return index;
      },

      isColumnHidden(index) {
        if (this.fixed === true || this.fixed === 'left') {
          return index >= this.leftFixedCount;
        } else if (this.fixed === 'right') {
          return index < this.columnsCount - this.rightFixedCount;
        } else {
          return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount);
        }
      },

      getRowStyle(row, index) {
        const rowStyle = this.rowStyle;
        if (typeof rowStyle === 'function') {
          return rowStyle.call(null, row, index);
        }
        return rowStyle;
      },

      getRowClass(row, index) {
        const classes = [];

        const rowClassName = this.rowClassName;
        if (typeof rowClassName === 'string') {
          classes.push(rowClassName);
        } else if (typeof rowClassName === 'function') {
          classes.push(rowClassName.call(null, row, index) || '');
        }

        return classes.join(' ');
      },

      handleCellMouseEnter(event, row) {
        const table = this.table;
        const cell = getCell(event);

        if (cell) {
          const column = getColumnByCell(table, cell);
          const hoverState = table.hoverState = {cell, column, row};
          table.$emit('cell-mouse-enter', hoverState.row, hoverState.column, hoverState.cell, event);
        }

        // 判断是否text-overflow, 如果是就显示tooltip
        const cellChild = event.target.querySelector('.cell');

        this.tooltipDisabled = cellChild.scrollWidth <= cellChild.offsetWidth;
      },

      handleCellMouseLeave(event) {
        const cell = getCell(event);
        if (!cell) return;

        const oldHoverState = this.table.hoverState;
        this.table.$emit('cell-mouse-leave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event);
      },

      handleMouseEnter(index) {
        this.store.commit('setHoverRow', index);
      },

      handleMouseLeave() {
        this.store.commit('setHoverRow', null);
      },

      handleContextMenu(event, row) {
        const table = this.table;
        table.$emit('row-contextmenu', row, event);
      },

      handleDoubleClick(event, row) {
        const table = this.table;
        table.$emit('row-dblclick', row, event);
      },

      handleClick(event, row) {
        const table = this.table;
        const cell = getCell(event);
        let column;
        if (cell) {
          column = getColumnByCell(table, cell);
          if (column) {
            table.$emit('cell-click', row, column, cell, event);
          }
        }

        this.store.commit('setCurrentRow', row);

        table.$emit('row-click', row, event, column);
      },

      handleExpandClick(row) {
        this.store.commit('toggleRowExpanded', row);
      }
    }
  };
})
