


define(function(require,exports,module){

  const Emitter = require('../../src/mixins/emitter');

  module.exports = {
    name: 'ElDropdownItem',
    mixins: [Emitter],
    template:require('./dropdown-item.tpl'),

    install:function(Vue){
      Vue.component(this.name, this);
    },
    props: {
      command: String,
      disabled: Boolean,
      divided: Boolean
    },

    methods: {
      handleClick(e) {
        this.dispatch('ElDropdown', 'menu-item-click', [this.command, this]);
      }
    }
  };
})