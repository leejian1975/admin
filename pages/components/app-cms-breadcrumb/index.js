define(function (require, exports, module) {
    require('./index.css');
    const Vue = require('vue');
    Vue.use(require('element-breadcrumb'));
    Vue.use(require('element-breadcrumb-item'));

    module.exports = {
        name: 'app-cms-breadcrumb',
        install:function(Vue){
            Vue.component(this.name,this);
        },
        template:require('./index.tpl'),
        data:function() {
            return {
                breadcrumbs: []
            };
        },
        watch:{
            '$route':function () {
                this.breadcrumbs = (this.$parent && this.$parent.$route && this.$parent.$route.matched) || [];
            }
        },
        mounted:function() {
            this.breadcrumbs = (this.$parent && this.$parent.$route && this.$parent.$route.matched) || [];
        }
    };
})