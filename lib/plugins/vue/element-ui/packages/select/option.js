/**
 * Created by Zhou on 17/2/8.
 */
define(function (require, exports, module) {
    const Emitter = require('../../src/mixins/emitter.js');
    module.exports = {
        mixins: [Emitter],
        template: require('./option.tpl'),
        name: 'ElOption',
        install : function(Vue) {
            Vue.component(this.name, this);
        },
        componentName: 'ElOption',

        props: {
            value: {
                required: true
            },
            label: [String, Number],
            created: Boolean,
            disabled: {
                type: Boolean,
                default: false
            }
        },

        data: function data() {
            return {
                index: -1,
                groupDisabled: false,
                visible: true,
                hitState: false
            };
        },


        computed: {
            currentLabel: function currentLabel() {
                return this.label || (typeof this.value === 'string' || typeof this.value === 'number' ? this.value : '');
            },
            currentValue: function currentValue() {
                return this.value || this.label || '';
            },
            parent: function parent() {
                var result = this.$parent;
                while (!result.isSelect) {
                    result = result.$parent;
                }
                return result;
            },
            itemSelected: function itemSelected() {
                if (!this.parent.multiple) {
                    return this.value === this.parent.value;
                } else {
                    return this.parent.value.indexOf(this.value) > -1;
                }
            },
            limitReached: function limitReached() {
                if (this.parent.multiple) {
                    return !this.itemSelected && this.parent.value.length >= this.parent.multipleLimit && this.parent.multipleLimit > 0;
                } else {
                    return false;
                }
            }
        },

        watch: {
            currentLabel: function currentLabel() {
                if (!this.created) this.dispatch('ElSelect', 'setSelected');
            },
            value: function value() {
                if (!this.created) this.dispatch('ElSelect', 'setSelected');
            }
        },

        methods: {
            handleGroupDisabled: function handleGroupDisabled(val) {
                this.groupDisabled = val;
            },
            hoverItem: function hoverItem() {
                if (!this.disabled && !this.groupDisabled) {
                    this.parent.hoverIndex = this.parent.options.indexOf(this);
                }
            },
            selectOptionClick: function selectOptionClick() {
                if (this.disabled !== true && this.groupDisabled !== true) {
                    this.dispatch('ElSelect', 'handleOptionClick', this);
                }
            },
            queryChange: function queryChange(query) {
                // query 里如果有正则中的特殊字符，需要先将这些字符转义
                var parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
                this.visible = new RegExp(parsedQuery, 'i').test(this.currentLabel) || this.created;
                if (!this.visible) {
                    this.parent.filteredOptionsCount--;
                }
            },
            resetIndex: function resetIndex() {
                var _this = this;

                this.$nextTick(function () {
                    _this.index = _this.parent.options.indexOf(_this);
                });
            }
        },

        created: function created() {
            this.parent.options.push(this);
            this.parent.cachedOptions.push(this);
            this.parent.optionsCount++;
            this.parent.filteredOptionsCount++;
            this.index = this.parent.options.indexOf(this);

            this.$on('queryChange', this.queryChange);
            this.$on('handleGroupDisabled', this.handleGroupDisabled);
            this.$on('resetIndex', this.resetIndex);
        },
        beforeDestroy: function beforeDestroy() {
            this.dispatch('ElSelect', 'onOptionDestroy', this);
        }
    };

})