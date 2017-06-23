

define(function (require, exports, module) {
  const Picker = require('../picker');
  const DatePanel = require('../panel/date.js');
  const DateRangePanel = require('../panel/date-range');
  const getPanel = function (type) {
    if (type === 'daterange' || type === 'datetimerange') {
      return DateRangePanel;
    }
    return DatePanel;
  };

  module.exports = {
    mixins: [Picker],
    name: 'ElDatePicker',

    props: {
      type: {
        type: String,
        default: 'date'
      }
    },

    created() {
      this.panel = getPanel(this.type);
    }
  };
})
