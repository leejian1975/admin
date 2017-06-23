/**
 * Created by Zhou on 17/2/8.
 */
define(function (require, exports, module) {
    const Emitter = require('../../src/mixins/emitter.js')
    module.exports = {
        mixins: [Emitter],

        name: 'ElOptionGroup',
        template: require('./option-group.tpl'),
        componentName: 'ElOptionGroup',
        install : function(Vue) {
            Vue.component(this.name, this);
        },
        props: {
            label: String,
            disabled: {
                type: Boolean,
                default: false
            }
        },

        data: function data() {
            return {
                visible: true
            };
        },


        watch: {
            disabled: function disabled(val) {
                this.broadcast('ElOption', 'handleGroupDisabled', val);
            }
        },

        methods: {
            queryChange: function queryChange() {
                this.visible = this.$children && Array.isArray(this.$children) && this.$children.some(function (option) {
                        return option.visible === true;
                    });
            }
        },

        created: function created() {
            this.$on('queryChange', this.queryChange);
        },
        mounted: function mounted() {
            if (this.disabled) {
                this.broadcast('ElOption', 'handleGroupDisabled', this.disabled);
            }
        }
    }
})