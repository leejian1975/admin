// import ElButtonGroup from '../button/src/button-group';
//
// /* istanbul ignore next */
// ElButtonGroup.install = function(Vue) {
//   Vue.component(ElButtonGroup.name, ElButtonGroup);
// };
//
// export default ElButtonGroup;

define(function(require,exports,modules){
  modules.exports={
    name: 'ElButtonGroup',
    template:require('./button-group.tpl'),
    install:function(Vue){
      Vue.component(this.name, this);
    }
  }
})
