/**
 * Created by Zhou on 17/2/10.
 */
define(function (require, exports, module) {
    const ElCheckbox = require('../../checkbox/index');
    const throttle = require('throttle-debounce').throttle;
    const debounce = require('throttle-debounce').debounce;
    const addResizeListener = require('../../../src/utils/resize-event').addResizeListener;
    const removeResizeListener  = require('../../../src/utils/resize-event').removeResizeListener;

    const Locale = require('../../../src/mixins/locale');
    const TableStore = require('./table-store');
    const TableLayout = require('./table-layout');
    const TableBody = require('./table-body');
    const TableHeader = require('./table-header');
    const TableColumn = require('./table-column');
    const mousewheel = require('./util').mousewheel;

    let tableIdSeed = 1;

    module.exports = {
        name: 'ElTable',
        template:require('./table.tpl'),
        mixins: [Locale],

        props: {
            data: {
                type: Array,
                default: function () {
                    return [];
                }
            },

            width: [String, Number],

            height: [String, Number],

            maxHeight: [String, Number],

            fit: {
                type: Boolean,
                default: true
            },

            stripe: Boolean,

            border: Boolean,

            rowKey: [String, Function],

            context: {},

            showHeader: {
                type: Boolean,
                default: true
            },

            rowClassName: [String, Function],

            rowStyle: [Object, Function],

            highlightCurrentRow: Boolean,

            currentRowKey: [String, Number],

            emptyText: String,

            expandRowKeys: Array,

            defaultExpandAll: Boolean,

            defaultSort: Object
        },

        components: {
            TableHeader,
            TableBody,
            ElCheckbox,
            TableColumn
        },

        methods: {
            toggleRowSelection(row, selected) {
                this.store.toggleRowSelection(row, selected);
                this.store.updateAllSelected();
            },

            clearSelection() {
                this.store.clearSelection();
            },

            handleMouseLeave() {
                this.store.commit('setHoverRow', null);
                if (this.hoverState) this.hoverState = null;
            },

            updateScrollY() {
                this.layout.updateScrollY();
            },

            bindEvents() {
                const {headerWrapper} = this.$refs;
                const refs = this.$refs;
                var that = this;
                this.bodyWrapper.addEventListener('scroll', function () {
                    if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
                    if (refs.fixedBodyWrapper) refs.fixedBodyWrapper.scrollTop = this.scrollTop;
                    if (refs.rightFixedBodyWrapper) refs.rightFixedBodyWrapper.scrollTop = this.scrollTop;
                });

                if (headerWrapper) {
                    mousewheel(headerWrapper, throttle(16, function (event) {
                        const deltaX = event.deltaX;

                        if (deltaX > 0) {
                            that.bodyWrapper.scrollLeft += 10;
                        } else {
                            that.bodyWrapper.scrollLeft -= 10;
                        }
                    }))
                    ;
                }

                if (this.fit) {
                    this.windowResizeListener = throttle(50, function(){
                            if (that.$ready
                    )
                    that.doLayout();
                    })
                    ;
                    addResizeListener(this.$el, this.windowResizeListener);
                }
            },

            doLayout:function() {
                this.store.updateColumns();
                this.layout.update();
                this.updateScrollY();
                var that = this;
                this.$nextTick(function () {
                    if (that.height) {
                        that.layout.setHeight(this.height);
                    }
                    else if (that.maxHeight) {
                        that.layout.setMaxHeight(this.maxHeight);
                    } else if (that.shouldUpdateHeight) {
                        that.layout.updateHeight();
                    }
                })
                ;
            }
        },

        created() {
            this.tableId = 'el-table_' + tableIdSeed + '_';
            var that = this;
            this.debouncedLayout = debounce(50,
                    function(){that.doLayout()}
            )
            ;
        },

        computed: {
            bodyWrapper() {
                return this.$refs.bodyWrapper;
            },

            shouldUpdateHeight() {
                return typeof this.height === 'number' ||
                    this.fixedColumns.length > 0 ||
                    this.rightFixedColumns.length > 0;
            },

            selection() {
                return this.store.selection;
            },

            columns() {
                return this.store.states.columns;
            },

            tableData() {
                return this.store.states.data;
            },

            fixedColumns() {
                return this.store.states.fixedColumns;
            },

            rightFixedColumns() {
                return this.store.states.rightFixedColumns;
            },

            bodyHeight() {
                let style = {};

                if (this.height) {
                    style = {
                        height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
                    };
                } else if (this.maxHeight) {
                    style = {
                        'max-height': (this.showHeader ? this.maxHeight - this.layout.headerHeight : this.maxHeight) + 'px'
                    };
                }

                return style;
            },

            bodyWidth() {
                const {bodyWidth, scrollY, gutterWidth} = this.layout;
                return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
            },

            fixedBodyHeight() {
                let style = {};

                if (this.height) {
                    style = {
                        height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
                    };
                } else if (this.maxHeight) {
                    let maxHeight = this.layout.scrollX ? this.maxHeight - this.layout.gutterWidth : this.maxHeight;

                    if (this.showHeader) {
                        maxHeight -= this.layout.headerHeight;
                    }

                    style = {
                        'max-height': maxHeight + 'px'
                    };
                }

                return style;
            },

            fixedHeight() {
                let style = {};

                if (this.maxHeight) {
                    style = {
                        bottom: (this.layout.scrollX && this.data.length) ? this.layout.gutterWidth + 'px' : ''
                    };
                } else {
                    style = {
                        height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
                    };
                }

                return style;
            }
        },

        watch: {
            height(value) {
                this.layout.setHeight(value);
            },

            currentRowKey(newVal) {
                this.store.setCurrentRowKey(newVal);
            },

            data: {
                immediate: true,
                handler(val) {
                    this.store.commit('setData', val);
                }
            },

            expandRowKeys(newVal) {
                this.store.setExpandRowKeys(newVal);
            }
        },

        destroyed() {
            if (this.windowResizeListener) removeResizeListener(this.$el, this.windowResizeListener);
        },

        mounted() {
            this.bindEvents();
            this.doLayout();

            this.$ready = true;
        },

        data() {
            const store = new TableStore(this, {
                rowKey: this.rowKey,
                defaultExpandAll: this.defaultExpandAll
            });
            const layout = new TableLayout({
                store,
                table: this,
                fit: this.fit,
                showHeader: this.showHeader
            });
            return {
                store,
                layout,
                renderExpanded: null,
                resizeProxyVisible: false
            };
        }
    }
})