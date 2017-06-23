

define(function (require, exports, module) {
  module.exports = {
    name: 'ElBreadcrumbItem',
    template:require('./breadcrumn-item.tpl'),
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    props: {
      to: {},
      replace: Boolean
    },
    data() {
      return {
        separator: ''
      };
    },
    mounted() {
      this.separator = this.$parent.separator;
      var self = this;
      if (this.to) {
        let link = this.$refs.link;
        link.addEventListener('click', _ => {
          let to = this.to;
        self.replace ? self.$router.replace(to)
            : self.$router.push(to);
      });
      }
    }
  };
})