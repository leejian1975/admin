// import Radio from './src/radio';
//
// /* istanbul ignore next */
// Radio.install = function(Vue) {
//   Vue.component('el-radio', Radio);
// };
//
// export default Radio;
define(function(require,exports,modules){
    const Emitter = require('../../src/mixins/emitter')
    modules.exports={
        name: 'ElRadio',
        template:require('./radio.tpl'),
        mixins: [Emitter],

        componentName: 'ElRadio',
        install:function(Vue){
            Vue.component(this.name, this);
        },
        props: {
            value: {},
            label: {},
            disabled: Boolean,
            name: String
        },

        data() {
            return {
                focus: false
            };
        },

        computed: {
            isGroup() {
                let parent = this.$parent;
                while (parent) {
                    if (parent.$options.componentName !== 'ElRadioGroup') {
                        parent = parent.$parent;
                    } else {
                        this._radioGroup = parent;
                        return true;
                    }
                }
                return false;
            },

            model: {
                get() {
                    return this.isGroup ? this._radioGroup.value : this.value;
                },

                set(val) {
                    if (this.isGroup) {
                        this.dispatch('ElRadioGroup', 'input', [val]);
                    } else {
                        this.$emit('input', val);
                    }
                }
            },

            isDisabled() {
                return this.isGroup
                    ? this._radioGroup.disabled || this.disabled
                    : this.disabled;
            }
        }
    }
})
