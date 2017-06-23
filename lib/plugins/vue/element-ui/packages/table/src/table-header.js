define(function (require, exports, module) {

    const ElCheckbox = require('../../checkbox/index');
    const ElTag = require('../../tag/index');
    const Vue = require('vue');
    const FilterPanel = require('./filter-panel.js');

    const getAllColumns = function (columns) {
            const result = [];
            columns.forEach(function (column) {
                if (column.children
                ) {
                    result.push(column);
                    result.push.apply(result, getAllColumns(column.children));
                }
                else {
                    result.push(column);
                }
            })
            ;
            return result;
        }
        ;

    const convertToRows = function (originColumns) {
            let maxLevel = 1;
            const traverse = function (column, parent) {
                    if (parent) {
                        column.level = parent.level + 1;
                        if (maxLevel < column.level) {
                            maxLevel = column.level;
                        }
                    }
                    if (column.children) {
                        let childrenMax = 1;
                        let colSpan = 0;
                        column.children.forEach(function (subColumn) {
                            const temp = traverse(subColumn, column);
                            if (temp > childrenMax) {
                                childrenMax = temp;
                            }
                            colSpan += subColumn.colSpan;
                        })
                        ;
                        column.colSpan = colSpan;
                    } else {
                        column.colSpan = 1;
                    }
                }
                ;

            originColumns.forEach(function (column) {
                column.level = 1;
                traverse(column);
            })
            ;

            const rows = [];
            for (let i = 0; i < maxLevel; i++) {
                rows.push([]);
            }

            const allColumns = getAllColumns(originColumns);

            allColumns.forEach(function (column) {
                if (
                    !column.children
                ) {
                    column.rowSpan = maxLevel - column.level + 1;
                }
                else {
                    column.rowSpan = 1;
                }
                rows[column.level - 1].push(column);
            })
            ;

            return rows;
        }
        ;

    module.exports = {
        name: 'ElTableHeader',

        render: function (h) {
            const originColumns = this.store.states.originColumns;
            const columnRows = convertToRows(originColumns, this.columns);
            var _this = this;
            return h(
                'table',
                {
                    'class': 'el-table__header',
                    attrs: {
                        cellspacing: '0',
                        cellpadding: '0',
                        border: '0'
                    }
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
                    }), !this.fixed && this.layout.gutterWidth ? h(
                        'col',
                        {
                            attrs: {name: 'gutter', width: this.layout.scrollY ? this.layout.gutterWidth : ''}
                        },
                        []
                    ) : '']
                ), h(
                    'thead',
                    null,
                    [this._l(columnRows, function (columns, rowIndex) {
                        return h(
                            'tr',
                            null,
                            [_this._l(columns, function (column, cellIndex) {
                                return h(
                                    'th',
                                    {
                                        attrs: {
                                            colspan: column.colSpan,
                                            rowspan: column.rowSpan
                                        },
                                        on: {
                                            'mousemove': function mousemove($event) {
                                                return _this.handleMouseMove($event, column);
                                            },
                                            'mouseout': _this.handleMouseOut,
                                            'mousedown': function mousedown($event) {
                                                return _this.handleMouseDown($event, column);
                                            },
                                            'click': function click($event) {
                                                return _this.handleHeaderClick($event, column);
                                            }
                                        },

                                        'class': [column.id, column.order, column.headerAlign, column.className || '', rowIndex === 0 && _this.isCellHidden(cellIndex) ? 'is-hidden' : '', !column.children ? 'is-leaf' : '']
                                    },
                                    [h(
                                        'div',
                                        {'class': ['cell', column.filteredValue && column.filteredValue.length > 0 ? 'highlight' : '']},
                                        [column.renderHeader ? column.renderHeader.call(_this._renderProxy, h, {
                                            column: column,
                                            $index: cellIndex,
                                            store: _this.store,
                                            _self: _this.$parent.$vnode.context
                                        }) : column.label, column.sortable ? h(
                                            'span',
                                            {
                                                'class': 'caret-wrapper', on: {
                                                'click': function click($event) {
                                                    return _this.handleSortClick($event, column);
                                                }
                                            }
                                            },
                                            [h(
                                                'i',
                                                {'class': 'sort-caret ascending'},
                                                []
                                            ), h(
                                                'i',
                                                {'class': 'sort-caret descending'},
                                                []
                                            )]
                                        ) : '', column.filterable ? h(
                                            'span',
                                            {
                                                'class': 'el-table__column-filter-trigger', on: {
                                                'click': function click($event) {
                                                    return _this.handleFilterClick($event, column);
                                                }
                                            }
                                            },
                                            [h(
                                                'i',
                                                {'class': ['el-icon-arrow-down', column.filterOpened ? 'el-icon-arrow-up' : '']},
                                                []
                                            )]
                                        ) : '']
                                    )]
                                );
                            }), !_this.fixed && _this.layout.gutterWidth ? h(
                                'th',
                                {
                                    'class': 'gutter',
                                    style: {width: _this.layout.scrollY ? _this.layout.gutterWidth + 'px' : '0'}
                                },
                                []
                            ) : '']
                        );
                    })]
                )]
            );

        },

        props: {
            fixed: String,
            store: {
                required: true
            },
            layout: {
                required: true
            },
            border: Boolean,
            defaultSort: {
                type: Object,
                default() {
                    return {
                        prop: '',
                        order: ''
                    };
                }
            }
        },

        components: {
            ElCheckbox,
            ElTag
        },

        computed: {
            isAllSelected() {
                return this.store.states.isAllSelected;
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

        created() {
            this.filterPanels = {};
        },

        mounted() {
            var that = this;
            if (this.defaultSort.prop) {
                const states = this.store.states;
                states.sortProp = this.defaultSort.prop;
                states.sortOrder = this.defaultSort.order || 'ascending';
                this.$nextTick(function (_) {
                    for (let i = 0, length = that.columns.length;
                         i < length;
                         i++
                    ) {
                        let column = this.columns[i];
                        if (column.property === states.sortProp) {
                            column.order = states.sortOrder;
                            states.sortingColumn = column;
                            break;
                        }
                    }

                    if (states.sortingColumn) {
                        that.store.commit('changeSortCondition');
                    }
                })
                ;
            }
        },

        beforeDestroy() {
            const panels = this.filterPanels;
            for (let prop in panels) {
                if (panels.hasOwnProperty(prop) && panels[prop]) {
                    panels[prop].$destroy(true);
                }
            }
        },

        methods: {
            isCellHidden(index) {
                if (this.fixed === true || this.fixed === 'left') {
                    return index >= this.leftFixedCount;
                } else if (this.fixed === 'right') {
                    return index < this.columnsCount - this.rightFixedCount;
                } else {
                    return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount);
                }
            },

            toggleAllSelection() {
                this.store.commit('toggleAllSelection');
            },

            handleFilterClick(event, column) {
                event.stopPropagation();
                const target = event.target;
                const cell = target.parentNode;
                const table = this.$parent;

                let filterPanel = this.filterPanels[column.id];

                if (filterPanel && column.filterOpened) {
                    filterPanel.showPopper = false;
                    return;
                }

                if (!filterPanel) {
                    filterPanel = new Vue(FilterPanel);
                    this.filterPanels[column.id] = filterPanel;

                    filterPanel.table = table;
                    filterPanel.cell = cell;
                    filterPanel.column = column;
                    !this.$isServer && filterPanel.$mount(document.createElement('div'));
                }

                setTimeout(function () {
                    filterPanel.showPopper = true;
                }, 16);
            },

            handleHeaderClick(event, column) {
                if (!column.filters && column.sortable) {
                    this.handleSortClick(event, column);
                } else if (column.filters && !column.sortable) {
                    this.handleFilterClick(event, column);
                }

                this.$parent.$emit('header-click', column, event);
            },

            handleMouseDown(event, column) {
                if (this.$isServer) return;
                if (column.children && column.children.length > 0) return;
                /* istanbul ignore if */
                if (this.draggingColumn && this.border) {
                    this.dragging = true;

                    this.$parent.resizeProxyVisible = true;

                    const tableEl = this.$parent.$el;
                    const tableLeft = tableEl.getBoundingClientRect().left;
                    const columnEl = this.$el.querySelector(`th.${column.id}`);
                    const columnRect = columnEl.getBoundingClientRect();
                    const minLeft = columnRect.left - tableLeft + 30;

                    columnEl.classList.add('noclick');

                    this.dragState = {
                        startMouseLeft: event.clientX,
                        startLeft: columnRect.right - tableLeft,
                        startColumnLeft: columnRect.left - tableLeft,
                        tableLeft
                    };

                    const resizeProxy = this.$parent.$refs.resizeProxy;
                    resizeProxy.style.left = this.dragState.startLeft + 'px';

                    document.onselectstart = function () {
                        return false;
                    };
                    document.ondragstart = function () {
                        return false;
                    };

                    const handleMouseMove = function (event) {
                            const deltaLeft = event.clientX - this.dragState.startMouseLeft;
                            const proxyLeft = this.dragState.startLeft + deltaLeft;

                            resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
                        }
                        ;

                    const handleMouseUp = function () {
                            if (this.dragging) {
                                const finalLeft = parseInt(resizeProxy.style.left, 10);
                                const columnWidth = finalLeft - this.dragState.startColumnLeft;
                                column.width = column.realWidth = columnWidth;

                                this.store.scheduleLayout();

                                document.body.style.cursor = '';
                                this.dragging = false;
                                this.draggingColumn = null;
                                this.dragState = {};

                                this.$parent.resizeProxyVisible = false;
                            }

                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                            document.onselectstart = null;
                            document.ondragstart = null;

                            setTimeout(function () {
                                columnEl.classList.remove('noclick');
                            }, 0);
                        }
                        ;

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                }
            },

            handleMouseMove(event, column) {
                if (column.children && column.children.length > 0) return;
                let target = event.target;
                while (target && target.tagName !== 'TH') {
                    target = target.parentNode;
                }

                if (!column || !column.resizable) return;

                if (!this.dragging && this.border) {
                    let rect = target.getBoundingClientRect();

                    const bodyStyle = document.body.style;
                    if (rect.width > 12 && rect.right - event.pageX < 8) {
                        bodyStyle.cursor = 'col-resize';
                        this.draggingColumn = column;
                    } else if (!this.dragging) {
                        bodyStyle.cursor = '';
                        this.draggingColumn = null;
                    }
                }
            },

            handleMouseOut() {
                if (this.$isServer) return;
                document.body.style.cursor = '';
            },

            toggleOrder(order) {
                return !order ? 'ascending' : order === 'ascending' ? 'descending' : null;
            },

            handleSortClick(event, column) {
                event.stopPropagation();
                let order = this.toggleOrder(column.order);

                let target = event.target;
                while (target && target.tagName !== 'TH') {
                    target = target.parentNode;
                }

                if (target && target.tagName === 'TH') {
                    if (target.classList.contains('noclick')) {
                        target.classList.remove('noclick');
                        return;
                    }
                }

                if (!column.sortable) return;

                const states = this.store.states;
                let sortProp = states.sortProp;
                let sortOrder;
                const sortingColumn = states.sortingColumn;

                if (sortingColumn !== column) {
                    if (sortingColumn) {
                        sortingColumn.order = null;
                    }
                    states.sortingColumn = column;
                    sortProp = column.property;
                }

                if (!order) {
                    sortOrder = column.order = null;
                    states.sortingColumn = null;
                    sortProp = null;
                } else {
                    sortOrder = column.order = order;
                }

                states.sortProp = sortProp;
                states.sortOrder = sortOrder;

                this.store.commit('changeSortCondition');
            }
        },

        data() {
            return {
                draggingColumn: null,
                dragging: false,
                dragState: {}
            };
        }
    };
})