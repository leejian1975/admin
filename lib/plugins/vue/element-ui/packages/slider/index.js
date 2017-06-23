
define(function (require, exports, module) {
  const ElInputNumber = require('../input-number/index');
  const ElTooltip = require('../tooltip/index');
  const  getStyle  = require('../../src/utils/dom').getStyle;
  module.exports = {
    name: 'ElSlider',
    template:require('./slider.tpl'),
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      step: {
        type: Number,
        default: 1
      },
      defaultValue: {
        type: Number,
        default: 0
      },
      value: {
        type: Number,
        default: 0
      },
      showInput: {
        type: Boolean,
        default: false
      },
      showInputControls: {
        type: Boolean,
        default: true
      },
      showStops: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    components: {
      ElInputNumber,
      ElTooltip
    },

    data:function() {
      return {
        precision: 0,
        inputValue: null,
        timeout: null,
        hovering: false,
        dragging: false,
        startX: 0,
        currentX: 0,
        startPos: 0,
        newPos: null,
        oldValue: this.value,
        currentPosition: (this.value - this.min) / (this.max - this.min) * 100 + '%'
      };
    },

    watch: {
      inputValue: function inputValue(val) {
        this.$emit('input', Number(val));
      },
      value: function value(val) {
        var _this = this;

        this.$nextTick(function () {
          _this.updatePopper();
        });
        if (typeof val !== 'number' || isNaN(val) || val < this.min) {
          this.$emit('input', this.min);
          return;
        }
        if (val > this.max) {
          this.$emit('input', this.max);
          return;
        }
        this.inputValue = val;
        this.setPosition((val - this.min) * 100 / (this.max - this.min));
      }
    },

    methods: {
      handleMouseEnter: function handleMouseEnter() {
        this.hovering = true;
        this.$refs.tooltip.showPopper = true;
      },
      handleMouseLeave: function handleMouseLeave() {
        this.hovering = false;
        this.$refs.tooltip.showPopper = false;
      },
      updatePopper: function updatePopper() {
        this.$refs.tooltip.updatePopper();
      },
      setPosition: function setPosition(newPos) {
        if (newPos < 0) {
          newPos = 0;
        } else if (newPos > 100) {
          newPos = 100;
        }

        var lengthPerStep = 100 / ((this.max - this.min) / this.step);
        var steps = Math.round(newPos / lengthPerStep);
        var value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
        value = parseFloat(value.toFixed(this.precision));
        this.$emit('input', value);
        this.currentPosition = (this.value - this.min) / (this.max - this.min) * 100 + '%';
        if (!this.dragging) {
          if (this.value !== this.oldValue) {
            this.$emit('change', this.value);
            this.oldValue = this.value;
          }
        }
      },
      onSliderClick: function onSliderClick(event) {
        if (this.disabled || this.dragging) return;
        var sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
        this.setPosition((event.clientX - sliderOffsetLeft) / this.$sliderWidth * 100);
      },
      onInputChange: function onInputChange() {
        if (this.value === '') {
          return;
        }
        if (!isNaN(this.value)) {
          this.setPosition((this.value - this.min) * 100 / (this.max - this.min));
        }
      },
      onDragStart: function onDragStart(event) {
        this.dragging = true;
        this.startX = event.clientX;
        this.startPos = parseInt(this.currentPosition, 10);
      },
      onDragging: function onDragging(event) {
        if (this.dragging) {
          this.$refs.tooltip.showPopper = true;
          this.currentX = event.clientX;
          var diff = (this.currentX - this.startX) / this.$sliderWidth * 100;
          this.newPos = this.startPos + diff;
          this.setPosition(this.newPos);
        }
      },
      onDragEnd: function onDragEnd() {
        var _this2 = this;

        if (this.dragging) {
          /*
           * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
           * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
           */
          setTimeout(function () {
            _this2.dragging = false;
            _this2.$refs.tooltip.showPopper = false;
            _this2.setPosition(_this2.newPos);
          }, 0);
          window.removeEventListener('mousemove', this.onDragging);
          window.removeEventListener('mouseup', this.onDragEnd);
          window.removeEventListener('contextmenu', this.onDragEnd);
        }
      },
      onButtonDown: function onButtonDown(event) {
        if (this.disabled) return;
        this.onDragStart(event);
        window.addEventListener('mousemove', this.onDragging);
        window.addEventListener('mouseup', this.onDragEnd);
        window.addEventListener('contextmenu', this.onDragEnd);
      }
    },

    computed: {
      $sliderWidth: function $sliderWidth() {
        return parseInt((0, getStyle)(this.$refs.slider, 'width'), 10);
      },
      stops: function stops() {
        var stopCount = (this.max - this.value) / this.step;
        var currentLeft = parseFloat(this.currentPosition);
        var stepWidth = 100 * this.step / (this.max - this.min);
        var result = [];
        for (var i = 1; i < stopCount; i++) {
          result.push(currentLeft + i * stepWidth);
        }
        return result;
      }
    },

    created: function created() {
      if (typeof this.value !== 'number' || isNaN(this.value) || this.value < this.min) {
        this.$emit('input', this.min);
      } else if (this.value > this.max) {
        this.$emit('input', this.max);
      }
      var precisions = [this.min, this.max, this.step].map(function (item) {
        var decimal = ('' + item).split('.')[1];
        return decimal ? decimal.length : 0;
      });
      this.precision = Math.max.apply(null, precisions);
      this.inputValue = this.inputValue || this.value;
    }
  }
})