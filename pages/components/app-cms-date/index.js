define(function (require, exports, module) {
    const Vue = require('vue');
    Vue.use(require('element-date-picker'));
    const dateUtil = require('../../utils/date');
    module.exports = {
        name: 'app-cms-date',
        install: function (Vue) {
            Vue.component(this.name, this);
        },
        props: {
            value: String,
            placeholder: String,
            type:{
                type:String,
                default:'date'
            },
            format:{
                type: String,
                default: 'yyyy-MM-dd'
            }
        },
        template: require('./index.tpl'),
        data: function () {
            return {
                dateValue:this.value,
                datePlaceholder:this.placeholder,
                dateFormat:this.format,
                dateType:this.type
            }
        },
        watch: {
            'value':function(){
                if(this.value){
                    this.dateValue = new Date(Date.parse(this.value));
                }else{
                    this.dateValue = null;
                }
            },
            'format':function(){
                this.dateFormat = this.format;
            },
            'dateValue': function () {
                var dateString = '';
                if(this.dateValue){
                    dateString = dateUtil.format(this.dateValue, this.format || 'yyyy-MM-dd');
                }
                this.$emit('on-change', dateString);
            }
        },
        methods: {}
    };
})