define(function(require,exports,module) {
    const babelHelperVueJsxMergeProps = require('../../src/babel-helper-vue-jsx-merge-props/index')
    module.exports = {
        name: 'ElCascaderMenu',

        data: function data() {
            return {
                inputWidth: 0,
                options: [],
                props: {},
                visible: false,
                activeValue: [],
                value: [],
                expandTrigger: 'click',
                changeOnSelect: false,
                popperClass: ''
            };
        },


        watch: {
            visible: function visible(value) {
                if (value) {
                    this.activeValue = this.value;
                }
            },

            value: {
                immediate: true,
                handler: function handler(value) {
                    this.activeValue = value;
                }
            }
        },

        computed: {
            activeOptions: {
                cache: false,
                get: function get() {
                    var _this = this;

                    var activeValue = this.activeValue;
                    var configurableProps = ['label', 'value', 'children', 'disabled'];

                    var formatOptions = function formatOptions(options) {
                        options.forEach(function (option) {
                            if (option.__IS__FLAT__OPTIONS) return;
                            configurableProps.forEach(function (prop) {
                                var value = option[_this.props[prop] || prop];
                                if (value) option[prop] = value;
                            });
                            if (Array.isArray(option.children)) {
                                formatOptions(option.children);
                            }
                        });
                    };

                    var loadActiveOptions = function loadActiveOptions(options) {
                        var activeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

                        var level = activeOptions.length;
                        activeOptions[level] = options;
                        var active = activeValue[level];
                        if (active) {
                            options = options.filter(function (option) {
                                return option.value === active;
                            })[0];
                            if (options && options.children) {
                                loadActiveOptions(options.children, activeOptions);
                            }
                        }
                        return activeOptions;
                    };

                    formatOptions(this.options);
                    return loadActiveOptions(this.options);
                }
            }
        },

        methods: {
            select: function select(item, menuIndex) {
                if (item.__IS__FLAT__OPTIONS) {
                    this.activeValue = item.value;
                } else {
                    this.activeValue.splice(menuIndex, 1, item.value);
                }
                this.$emit('pick', this.activeValue);
            },
            activeItem: function activeItem(item, menuIndex) {
                var len = this.activeOptions.length;
                this.activeValue.splice(menuIndex, len, item.value);
                this.activeOptions.splice(menuIndex + 1, len, item.children);
                if (this.changeOnSelect) {
                    this.$emit('pick', this.activeValue, false);
                } else {
                    this.$emit('activeItemChange', this.activeValue);
                }
            }
        },

        render: function render(h) {
            var _this2 = this;

            var activeValue = this.activeValue,
                activeOptions = this.activeOptions,
                visible = this.visible,
                expandTrigger = this.expandTrigger,
                popperClass = this.popperClass;


            var menus = this._l(activeOptions, function (menu, menuIndex) {
                var isFlat = false;
                var items = _this2._l(menu, function (item) {
                    var events = {
                        on: {}
                    };

                    if (item.__IS__FLAT__OPTIONS) isFlat = true;

                    if (!item.disabled) {
                        if (item.children) {
                            var triggerEvent = {
                                click: 'click',
                                hover: 'mouseenter'
                            }[expandTrigger];
                            events.on[triggerEvent] = function () {
                                _this2.activeItem(item, menuIndex);
                            };
                        } else {
                            events.on.click = function () {
                                _this2.select(item, menuIndex);
                            };
                        }
                    }

                    return h(
                        'li',
                        (0, babelHelperVueJsxMergeProps.mergeJSXProps)([{
                            'class': {
                                'el-cascader-menu__item': true,
                                'el-cascader-menu__item--extensible': item.children,
                                'is-active': item.value === activeValue[menuIndex],
                                'is-disabled': item.disabled
                            }
                        }, events]),
                        [item.label]
                    );
                });
                var menuStyle = {};
                if (isFlat) {
                    menuStyle.minWidth = _this2.inputWidth + 'px';
                }

                return h(
                    'ul',
                    {
                        'class': {
                            'el-cascader-menu': true,
                            'el-cascader-menu--flexible': isFlat
                        },
                        style: menuStyle },
                    [items]
                );
            });
            return h(
                'transition',
                {
                    attrs: { name: 'el-zoom-in-top' }
                },
                [h(
                    'div',
                    {
                        directives: [{
                            name: 'show',
                            value: visible
                        }],

                        'class': ['el-cascader-menus', popperClass]
                    },
                    [menus]
                )]
            );
        }
    };


})