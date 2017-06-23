
define(function (require, exports, module) {
    module.exports = {
      name: 'ElTag',
      template:require('./tag.tpl'),
      install : function(Vue) {
        Vue.component(this.name, this);
      },
      props: {
        text: String,
        closable: Boolean,
        type: String,
        hit: Boolean,
        closeTransition: Boolean,
        color: String
      },
      methods: {
        handleClose(event) {
          this.$emit('close', event);
        }
      }
    }
})