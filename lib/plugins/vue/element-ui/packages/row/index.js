// import Row from './src/row';
//
// /* istanbul ignore next */
// Row.install = function(Vue) {
//   Vue.component(Row.name, Row);
// };
//
// export default Row;

define(function(require,exports,modules){
  modules.exports={
    name: 'ElRow',
    template:require('./row.tpl'),
    install : function(Vue){
      Vue.component(this.name, this);
    },
    props: {
      gutter: Number,
      type: String,
      justify: {
        type: String,
        default: 'start'
      },
      align: {
        type: String,
        default: 'top'
      }
    },

    computed: {
      style() {
        var ret = {};

        if (this.gutter) {
          ret.marginLeft = `-${this.gutter / 2}px`;
          ret.marginRight = ret.marginLeft;
        }

        return ret;
      }
    }
  }
})

