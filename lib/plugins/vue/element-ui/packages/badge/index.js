
define(function (require, exports, module) {
  module.exports = {
    name: 'ElBadge',
    template:require('./badge.tpl'),
    install:function(Vue){
      Vue.component(this.name, this);
    },
    props: {
      value: {},
      max: Number,
      isDot: Boolean,
      hidden: Boolean
    },

    computed: {
      content() {
        if (this.isDot) return;

        const value = this.value;
        const max = this.max;

        if (typeof value === 'number' && typeof max === 'number') {
          return max < value ? `${max}+` : value;
        }

        return value;
      }
    }
  }
})