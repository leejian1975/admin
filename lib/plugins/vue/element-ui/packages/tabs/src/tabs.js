define(function(require,exports,module){
    const TabBar = require('./tab-bar.js');
    module.exports = {
        name: 'ElTabs',

        components: {
            TabBar
        },

        props: {
            type: String,
            activeName: String,
            closable: {
                type: Boolean,
                default: false
            },
            value: {}
        },

        data() {
            return {
                children: null,
                currentName: this.value || this.activeName,
                panes: []
            };
        },

        watch: {
            activeName(value) {
                this.setCurrentName(value);
            },
            value(value) {
                this.setCurrentName(value);
            }
        },

        computed: {
            currentTab: function currentTab() {
                var _this = this;

                var result = void 0;
                this.panes.forEach(function (tab) {
                    if (_this.currentName === (tab.name || tab.index)) {
                        result = tab;
                    }
                });
                return result;
            }
        },

        methods: {
            handleTabRemove(pane, event) {
                event.stopPropagation();
                const panes = this.panes;
                const currentTab = this.currentTab;

                let index = panes.indexOf(pane);

                if (index === -1) return;

                panes.splice(index, 1);
                pane.$destroy();

                this.$emit('tab-remove', pane);

                this.$nextTick(_ => {
                    if (pane.active) {
                    const panes = this.panes;
                    let nextChild = panes[index];
                    let prevChild = panes[index - 1];
                    let nextActiveTab = nextChild || prevChild || null;

                    if (nextActiveTab) {
                        this.setCurrentName(nextActiveTab.name || nextActiveTab.index);
                    }
                    return;
                } else {
                    this.setCurrentName(currentTab.name || currentTab.index);
                }
            });
            },
            handleTabClick(tab, tabName, event) {
                if (tab.disabled) return;
                this.setCurrentName(tabName);
                this.$emit('tab-click', tab, event);
            },
            setCurrentName(value) {
                this.currentName = value;
                this.$emit('input', value);
            },
            addPanes(item) {
                this.panes.push(item);
            },
            removePanes(item) {
                const panes = this.panes;
                const index = panes.indexOf(item);
                if (index > -1) {
                    panes.splice(index, 1);
                }
            }
        },
        render: function render(h) {
            var _this3 = this;

            var type = this.type,
                handleTabRemove = this.handleTabRemove,
                handleTabClick = this.handleTabClick,
                currentName = this.currentName,
                panes = this.panes;


            var tabs = this._l(panes, function (pane, index) {
                var tabName = pane.name || pane.index || index;
                if (currentName === undefined && index === 0) {
                    _this3.setCurrentName(tabName);
                }

                pane.index = index;

                var btnClose = pane.isClosable ? h(
                    'span',
                    { 'class': 'el-icon-close', on: {
                        'click': function click(ev) {
                            handleTabRemove(pane, ev);
                        }
                    }
                    },
                    []
                ) : null;

                var tabLabelContent = pane.$slots.label || pane.label;
                return h(
                    'div',
                    {
                        'class': {
                            'el-tabs__item': true,
                            'is-active': pane.active,
                            'is-disabled': pane.disabled,
                            'is-closable': pane.isClosable
                        },
                        ref: 'tabs',
                        refInFor: true,
                        on: {
                            'click': function click(ev) {
                                handleTabClick(pane, tabName, ev);
                            }
                        }
                    },
                    [tabLabelContent, btnClose]
                );
            });

            return h(
                'div',
                { 'class': {
                    'el-tabs': true,
                    'el-tabs--card': type === 'card',
                    'el-tabs--border-card': type === 'border-card'
                } },
                [h(
                    'div',
                    { 'class': 'el-tabs__header' },
                    [!type ? h(
                        'tab-bar',
                        {
                            attrs: { tabs: panes }
                        },
                        []
                    ) : null, tabs]
                ), h(
                    'div',
                    { 'class': 'el-tabs__content' },
                    [this.$slots.default]
                )]
            );
        }

    };

})