define(function (require, exports, module) {
    module.exports = {
        name: 'ElMenuItemGroup',
        template:require('./menu-item-group.tpl'),
        componentName: 'ElMenuItemGroup',

        props: {
            title: {
                type: String
            }
        },
        data() {
            return {
                paddingLeft: 20
            };
        },
        computed: {
            levelPadding() {
                let padding = 10;
                let parent = this.$parent;
                while (parent && parent.$options.componentName !== 'ElMenu') {
                    if (parent.$options.componentName === 'ElSubmenu') {
                        padding += 20;
                    }
                    parent = parent.$parent;
                }
                padding === 10 && (padding = 20);
                return padding;
            }
        }
    };
})