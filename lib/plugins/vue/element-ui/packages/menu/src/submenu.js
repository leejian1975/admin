define(function (require, exports, module) {
    const menuMixin = require('./menu-mixin');
    const Emitter = require('../../../src/mixins/emitter');
    const CollapseTransition = require('../../../src/transitions/collapse-transition');

    module.exports = {
        name: 'ElSubmenu',
        template:require('./submenu.tpl'),
        componentName: 'ElSubmenu',

        mixins: [menuMixin, Emitter],

        components: {
            CollapseTransition
        },

        props: {
            index: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                timeout: null,
                items: {},
                submenus: {}
            };
        },
        computed: {
            opened() {
                return this.rootMenu.openedMenus.indexOf(this.index) > -1;
            },
            active: {
                cache: false,
                get() {
                    let isActive = false;
                    const submenus = this.submenus;
                    const items = this.items;

                    Object.keys(items).forEach(index => {
                        if (items[index].active) {
                        isActive = true;
                    }
                });

                    Object.keys(submenus).forEach(index => {
                        if (submenus[index].active) {
                        isActive = true;
                    }
                });

                    return isActive;
                }
            }
        },
        methods: {
            addItem(item) {
                this.$set(this.items, item.index, item);
            },
            removeItem(item) {
                delete this.items[item.index];
            },
            addSubmenu(item) {
                this.$set(this.submenus, item.index, item);
            },
            removeSubmenu(item) {
                delete this.submenus[item.index];
            },
            handleClick() {
                this.dispatch('ElMenu', 'submenu-click', this);
            },
            handleMouseenter() {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                        this.rootMenu.openMenu(this.index, this.indexPath);
            }, 300);
            },
            handleMouseleave() {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                        this.rootMenu.closeMenu(this.index, this.indexPath);
            }, 300);
            },
            initEvents() {
                let {
                    rootMenu,
                    handleMouseenter,
                    handleMouseleave,
                    handleClick
                } = this;
                let triggerElm;

                if (rootMenu.mode === 'horizontal' && rootMenu.menuTrigger === 'hover') {
                    triggerElm = this.$el;
                    triggerElm.addEventListener('mouseenter', handleMouseenter);
                    triggerElm.addEventListener('mouseleave', handleMouseleave);
                } else {
                    triggerElm = this.$refs['submenu-title'];
                    triggerElm.addEventListener('click', handleClick);
                }
            }
        },
        created() {
            this.parentMenu.addSubmenu(this);
            this.rootMenu.addSubmenu(this);
        },
        beforeDestroy() {
            this.parentMenu.removeSubmenu(this);
            this.rootMenu.removeSubmenu(this);
        },
        mounted() {
            this.initEvents();
        }
    };
})