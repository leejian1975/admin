define(function (require, exports, module) {
    var Vue = require('vue');
    Vue.use(require('element-form'));
    Vue.use(require('element-form-item'));
    Vue.use(require('element-button'));
    Vue.use(require('element-input'));

    var getActivityById = require('../../api/activity-api.js').getActivityById;

    var getActivity = {
        template: require('./index.html'),
        data: function () {
            return {
                activity:{
                    time:'2017-06-24',
                    organizer:'',
                    name:'相亲活动',
                    location:'苏州市工业园区',
                    contact:'李木子',
                    phone:'',
                    city:'',
                    agenda:[]
                }
            }
        },
        mounted:function(){
            var id = this.$route.params.id;
            if(id){
               this.fetchData(Number(id));
            }
        },
        methods:{
            fetchData:function (id) {
                var _this = this;
                getActivityById(id).then(function(res){
                    if(res.errorCode == 0){
                        _this.activity = res.data;
                    }else{
                        Cfe.requestError(res,_this);
                    }
                });
            },
            handleEdit:function(id){
                var _this = this;
                _this.$router.push({path: '/activity/edit-activity/'+id});
            },
            back:function(){
                var _this = this;
                _this.$router.push({path: '/activity/activity-list'});
            }
        }
    };
    module.exports = getActivity;
});