// import ElButton from './src/button';
//
// /* istanbul ignore next */
// ElButton.install = function(Vue) {
//   Vue.component(ElButton.name, ElButton);
// };
//
// export default ElButton;

define(function (require, exports, module) {
    module.exports = {
        name: 'ElButton',
        template:require('./button.tpl'),
        install:function(Vue){
            Vue.component(this.name, this);
        },
        props: {
            type: {
                type: String,
                default: 'default'
            },
            size: String,
            icon: {
                type: String,
                default: ''
            },
            nativeType: {
                type: String,
                default: 'button'
            },
            loading: Boolean,
            disabled: Boolean,
            plain: Boolean,
            autofocus: Boolean
        },

        methods: {
            handleClick:function(evt) {
                this.$emit('click', evt);
            }
        }
    };
})
