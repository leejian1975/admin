// import ElCol from './src/col';
//
// /* istanbul ignore next */
// ElCol.install = function(Vue) {
//   Vue.component(ElCol.name, ElCol);
// };
//
// export default ElCol;

define(function (require, exports, module) {
  module.exports = {
    name: 'ElCol',
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    props: {
      span: {
        type: Number,
        default: 24
      },
      offset: Number,
      pull: Number,
      push: Number,
      xs: [Number, Object],
      sm: [Number, Object],
      md: [Number, Object],
      lg: [Number, Object]
    },

    computed: {
      gutter() {
        return this.$parent.gutter;
      },

      style() {
        var ret = {};

        if (this.gutter) {
          ret.paddingLeft = this.gutter / 2 + 'px';
          ret.paddingRight = ret.paddingLeft;
        }

        return ret;
      }
    },
    render: function render(h) {
      var _this = this;

      var style = this.style;

      var classList = [];

      ['span', 'offset', 'pull', 'push'].forEach(function (prop) {
        if (_this[prop]) {
          classList.push(prop !== 'span' ? 'el-col-' + prop + '-' + _this[prop] : 'el-col-' + _this[prop]);
        }
      });

      ['xs', 'sm', 'md', 'lg'].forEach(function (size) {
        if (typeof _this[size] === 'number') {
          classList.push('el-col-' + size + '-' + _this[size]);
        } else if (typeof _this[size] === 'object') {
          (function () {
            var props = _this[size];
            Object.keys(props).forEach(function (prop) {
              classList.push(prop !== 'span' ? 'el-col-' + size + '-' + prop + '-' + props[prop] : 'el-col-' + size + '-' + props[prop]);
            });
          })();
        }
      });

      return h(
          'div',
          {
            'class': ['el-col', classList],
            style: style },
          [this.$slots.default]
      );
    }
  }
})