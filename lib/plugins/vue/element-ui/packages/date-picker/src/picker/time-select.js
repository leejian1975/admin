
define(function (require, exports, module) {
  const Picker = require('../picker');
  const Panel = require('../panel/time-select');
  module.exports =  {
    mixins: [Picker],

    name: 'ElTimeSelect',

    beforeCreate() {
      this.type = 'time-select';
      this.panel = Panel;
    }
  };
})
