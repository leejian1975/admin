define(function (require, exports, module) {
    const Menu = require('../menu/src/menu-mixin');
    const Emitter = require('../../src/mixins/emitter');

    module.exports = {
        name: 'ElMenuItem',
        template:require('./menu-item.tpl'),
        componentName: 'ElMenuItem',

        mixins: [Menu, Emitter],

        props: {
            index: {
                type: String,
                required: true
            },
            route: {
                type: Object,
                required: false
            },
            disabled: {
                type: Boolean,
                required: false
            }
        },
        computed: {
            active() {
                return this.index === this.rootMenu.activedIndex;
            }
        },
        methods: {
            handleClick() {
                this.dispatch('ElMenu', 'item-click', this);
            }
        },
        created() {
            this.parentMenu.addItem(this);
            this.rootMenu.addItem(this);
        },
        beforeDestroy() {
            this.parentMenu.removeItem(this);
            this.rootMenu.removeItem(this);
        }
    };
})