
define(function (require, exports, module) {
  const Picker= require('../picker');
  const TimePanel= require('../panel/time');
  const TimeRangePanel= require('../panel/time-range');
  module.exports = {
    mixins: [Picker],

    name: 'ElTimePicker',

    props: {
      isRange: Boolean
    },

    data() {
      return {
        type: ''
      };
    },

    created() {
      this.type = this.isRange ? 'timerange' : 'time';
      this.panel = this.isRange ? TimeRangePanel : TimePanel;
    }
  };
})