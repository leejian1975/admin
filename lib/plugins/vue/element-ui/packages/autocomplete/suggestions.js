/**
 * Created by Zhou on 17/2/8.
 */
define(function(require, exports, module) {
    const Popper =require('../../src/utils/vue-popper.js');
    const Emitter = require('../../src/mixins/emitter.js');
    const ElScrollbar = require('../scrollbar/index');
    module.exports = {
        mixins: [Popper, Emitter],

        componentName: 'ElAutocompleteSuggestions',
        install:function(Vue){
            Vue.component(this.name,this)
        },
        template:require('./autocomplete-suggestions.tpl'),
        data: function data() {
            return {
                parent: this.$parent,
                dropdownWidth: ''
            };
        },
        components: {
            ElScrollbar: ElScrollbar
        },

        props: {
            suggestions: Array,
            options: {
                default: function _default() {
                    return {
                        forceAbsolute: true,
                        gpuAcceleration: false
                    };
                }
            }
        },

        methods: {
            select: function select(item) {
                this.dispatch('ElAutocomplete', 'item-click', item);
            }
        },

        updated: function updated() {
            var _this = this;

            this.$nextTick(function (_) {
                _this.updatePopper();
            });
        },
        mounted: function mounted() {
            this.popperElm = this.$el;
            this.referenceElm = this.$parent.$refs.input.$refs.input;
        },
        created: function created() {
            var _this2 = this;

            this.$on('visible', function (val, inputWidth) {
                _this2.dropdownWidth = inputWidth + 'px';
                _this2.showPopper = val;
            });
        }
    };})