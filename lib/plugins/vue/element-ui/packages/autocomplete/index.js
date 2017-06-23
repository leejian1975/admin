

define(function (require, exports, module) {
    const ElInput = require('../input/index');
    const Clickoutside = require('../../src/utils/clickoutside');
    const ElAutocompleteSuggestions = require('./suggestions.js');
    const Emitter = require('../../src/mixins/emitter.js');
    module.exports = {
        name: 'ElAutocomplete',
        componentName: 'ElAutocomplete',
        mixins: [Emitter],
        template:require('./autocomplete.tpl'),
        install:function(Vue){
            Vue.component(this.name,this)
        },
        components: {
            ElInput: ElInput,
            ElAutocompleteSuggestions: ElAutocompleteSuggestions
        },

        directives: { Clickoutside: Clickoutside},

        props: {
            popperClass: String,
            placeholder: String,
            disabled: Boolean,
            name: String,
            size: String,
            value: String,
            autofocus: Boolean,
            fetchSuggestions: Function,
            triggerOnFocus: {
                type: Boolean,
                default: true
            },
            customItem: String,
            icon: String,
            onIconClick: Function
        },
        data: function data() {
            return {
                isFocus: false,
                suggestions: [],
                loading: false,
                highlightedIndex: -1
            };
        },

        computed: {
            suggestionVisible: function suggestionVisible() {
                var suggestions = this.suggestions;
                var isValidData = Array.isArray(suggestions) && suggestions.length > 0;
                return (isValidData || this.loading) && this.isFocus;
            }
        },
        watch: {
            suggestionVisible: function suggestionVisible(val) {
                this.broadcast('ElAutocompleteSuggestions', 'visible', [val, this.$refs.input.$refs.input.offsetWidth]);
            }
        },
        methods: {
            getData: function getData(queryString) {
                var _this = this;

                this.loading = true;
                this.fetchSuggestions(queryString, function (suggestions) {
                    _this.loading = false;
                    if (Array.isArray(suggestions)) {
                        _this.suggestions = suggestions;
                    } else {
                        console.error('autocomplete suggestions must be an array');
                    }
                });
            },
            handleChange: function handleChange(value) {
                this.$emit('input', value);
                if (!this.triggerOnFocus && !value) {
                    this.suggestions = [];
                    return;
                }
                this.getData(value);
            },
            handleFocus: function handleFocus() {
                this.isFocus = true;
                if (this.triggerOnFocus) {
                    this.getData(this.value);
                }
            },
            handleBlur: function handleBlur() {
                var _this2 = this;

                // 因为 blur 事件处理优先于 select 事件执行
                setTimeout(function (_) {
                    _this2.isFocus = false;
                }, 100);
            },
            handleKeyEnter: function handleKeyEnter() {
                if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
                    this.select(this.suggestions[this.highlightedIndex]);
                }
            },
            handleClickoutside: function handleClickoutside() {
                this.isFocus = false;
            },
            select: function select(item) {
                var _this3 = this;

                this.$emit('input', item.value);
                this.$emit('select', item);
                this.$nextTick(function (_) {
                    _this3.suggestions = [];
                });
            },
            highlight: function highlight(index) {
                if (!this.suggestionVisible || this.loading) {
                    return;
                }
                if (index < 0) index = 0;
                if (index >= this.suggestions.length) {
                    index = this.suggestions.length - 1;
                }
                var suggestion = this.$refs.suggestions.$el.querySelector('.el-autocomplete-suggestion__wrap');
                var suggestionList = suggestion.querySelectorAll('.el-autocomplete-suggestion__list li');

                var highlightItem = suggestionList[index];
                var scrollTop = suggestion.scrollTop;
                var offsetTop = highlightItem.offsetTop;

                if (offsetTop + highlightItem.scrollHeight > scrollTop + suggestion.clientHeight) {
                    suggestion.scrollTop += highlightItem.scrollHeight;
                }
                if (offsetTop < scrollTop) {
                    suggestion.scrollTop -= highlightItem.scrollHeight;
                }

                this.highlightedIndex = index;
            }
        },
        mounted: function mounted() {
            var _this4 = this;

            this.$on('item-click', function (item) {
                _this4.select(item);
            });
        },
        beforeDestroy: function beforeDestroy() {
            this.$refs.suggestions.$destroy();
        }
    };

})