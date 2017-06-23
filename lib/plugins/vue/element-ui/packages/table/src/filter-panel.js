/**
 * Created by Zhou on 17/2/10.
 */
define(function (require, exports, module) {
    const Popper = require('../../../src/utils/vue-popper');
    const Locale = require('../../../src/mixins/locale');
    const Clickoutside = require('../../../src/utils/clickoutside');
    const Dropdown = require('./dropdown');
    const ElCheckbox = require('../../checkbox/index');
    const ElCheckboxGroup = require('../../checkbox-group/index');

    module.exports = {
        name: 'ElTableFilterPanel',

        mixins: [Popper, Locale],
        template:require('./filter-panel.tpl'),
        directives: {
            Clickoutside
        },

        components: {
            ElCheckbox,
            ElCheckboxGroup
        },

        props: {
            placement: {
                type: String,
                default: 'bottom-end'
            }
        },

        customRender:function(h) {
            return h(
                'div',
                { 'class': 'el-table-filter' },
                [h(
                    'div',
                    { 'class': 'el-table-filter__content' },
                    []
                ), h(
                    'div',
                    { 'class': 'el-table-filter__bottom' },
                    [h(
                        'button',
                        {
                            on: {
                                'click': this.handleConfirm
                            }
                        },
                        [this.t('el.table.confirmFilter')]
                    ), h(
                        'button',
                        {
                            on: {
                                'click': this.handleReset
                            }
                        },
                        [this.t('el.table.resetFilter')]
                    )]
                )]
            );
        },

        methods: {
            isActive(filter) {
                return filter.value === this.filterValue;
            },

            handleOutsideClick() {
                this.showPopper = false;
            },

            handleConfirm() {
                this.confirmFilter(this.filteredValue);
                this.handleOutsideClick();
            },

            handleReset() {
                this.filteredValue = [];
                this.confirmFilter(this.filteredValue);
                this.handleOutsideClick();
            },

            handleSelect(filterValue) {
                this.filterValue = filterValue;

                if ((typeof filterValue !== 'undefined') && (filterValue !== null)) {
                    this.confirmFilter(this.filteredValue);
                } else {
                    this.confirmFilter([]);
                }

                this.handleOutsideClick();
            },

            confirmFilter(filteredValue) {
                this.table.store.commit('filterChange', {
                    column: this.column,
                    values: filteredValue
                });
            }
        },

        data() {
            return {
                table: null,
                cell: null,
                column: null
            };
        },

        computed: {
            filters() {
                return this.column && this.column.filters;
            },

            filterValue: {
                get() {
                    return (this.column.filteredValue || [])[0];
                },
                set(value) {
                    if (this.filteredValue) {
                        if ((typeof value !== 'undefined') && (value !== null)) {
                            this.filteredValue.splice(0, 1, value);
                        } else {
                            this.filteredValue.splice(0, 1);
                        }
                    }
                }
            },

            filteredValue: {
                get() {
                    if (this.column) {
                        return this.column.filteredValue || [];
                    }
                    return [];
                },
                set(value) {
                    if (this.column) {
                        this.column.filteredValue = value;
                    }
                }
            },

            multiple() {
                if (this.column) {
                    return this.column.filterMultiple;
                }
                return true;
            }
        },

        mounted:function() {
            var _this = this;

            this.popperElm = this.$el;
            this.referenceElm = this.cell;
            this.table.bodyWrapper.addEventListener('scroll', function () {
                _this.updatePopper();
            });

            this.$watch('showPopper', function (value) {
                if (_this.column) _this.column.filterOpened = value;
                if (value) {
                    Dropdown.open(_this);
                } else {
                    Dropdown.close(_this);
                }
            });
        }
    };
})