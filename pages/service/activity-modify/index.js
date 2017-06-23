define(function (require, exports, module) {
    const Vue = require('vue');

    Vue.use(require('element-dialog'));
    Vue.use(require('element-form'));
    Vue.use(require('element-form-item'));
    Vue.use(require('element-button'));
    Vue.use(require('element-input'));
    Vue.use(require('../../components/app-cms-date/index'));
    Vue.use(require('../../components/app-cms-city/index'));
    
    var addActivity = require('../../api/activity-api.js').addActivity;
    var getActivityById = require('../../api/activity-api.js').getActivityById;
    var updateActivity = require('../../api/activity-api.js').updateActivity;
    var delActivityAgenda=require('../../api/activity-api.js').delActivityAgenda;
    var modifyActivity = {
        template: require('./index.html'),

        data: function () {
            var checkPhone = function (rule, value, callback)  { 
                if (value === '') {
                    callback(new Error('请输入电话号码'));
                } else {
                    if(/^1\d{10}$/.test(value) || /^0\d{2,3}-?\d{7,8}$/.test(value)){
                        callback();
                    }else{
                        callback(new Error('请输入正确的电话号码'));
                    }
                }
            }
            return {
                activity:{
                    time:'',
                    organizer:'',
                    name:'',
                    location:'',
                    contact:'',
                    phone:'',
                    city:'',
                    agenda:[]
                },
                delAgenda:[],
                rules: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'}
                    ],
                    organizer: [
                        {required: true, message: '请输入举办单位', trigger: 'blur'}
                    ],
                    time: [
                        {required: true, message: '请选择活动日期', trigger: 'change'}
                    ],
                    city: [
                        {required: true, message: '请输入活动城市', trigger: 'blur'}
                    ],
                    location: [
                        {required: true, message: '请输入活动地点', trigger: 'blur'}
                    ],
                    contact: [
                        {required: true, message: '请输入活动联系人', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入联系人电话', trigger: 'blur'},
                        { validator: checkPhone, trigger: 'blur' }
                    ],
                    agenda: [
                        {type: 'array',required: true, message: '请至少输入一个活动内容', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted:function(){
            var id = this.$route.params.id;
            if(id){
               this.fetchData(id);
            }
        },
        methods:{
            fetchData:function (id) {
                var _this = this;
                getActivityById(id).then(function(res){
                    _this.activity = res.data;
                });
            },
            addAgenda:function(){
                this.activity.agenda.push({content:'',activityId:this.activity.id});
            },
            deleteAgenda:function(index){
                this.delAgenda.push(this.activity.agenda.splice(index,1)[0].id)
            },
            handleDateChange:function(val){
                this.activity.time = val;
            },
            handleCityChange:function (val) {
                this.activity.city = val;
            },
            handleSave:function(id){
                var _this =this;
                var message,confirmMessage,path;
                if(id == null){
                    confirmMessage = '确定要添加这个活动吗？';
                    message = '添加成功';
                    path = '/activity/activity-list';
                }else{
                    confirmMessage = '确定要修改这个活动吗？';
                    message = '修改成功';
                    path = '/activity/find-activity/'+id;
                }
                this.$refs.activity.validate(
                    function (valid) {
                        if (!valid) {
                            return false;
                        } else {
                            _this.$confirm(confirmMessage, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'info'
                            }).then(function () {
                                if(id == null){
                                    addActivity(_this.activity).then(function(res){
                                        _this.saveCallBack(res,path,message);
                                    });
                                }else{
                                    updateActivity(_this.activity).then(function(res){
                                        _this.saveCallBack(res,path,message);
                                    });
                                    if(_this.delAgenda.length>0){
                                        delActivityAgenda(_this.delAgenda)
                                    }

                                }
                            });
                        }
                    });
            },
            saveCallBack:function(res,path,message){
                var _this = this;
                if(res.errorCode == 0){
                    _this.$router.push({path:path});
                    _this.$message({
                        message:message,
                        type: 'success'
                    });
                }else{
                    _this.$message({
                        message: res.errorMsg,
                        type: 'danger'
                    });
                }
            },
            cancel:function(id){
                var _this =this;
                if(id == null){
                    _this.$router.push({path:'/activity/activity-list'});
                }else{
                    _this.$router.push({path:'/activity/find-activity/'+id});
                }
            }
        }
    }
    module.exports = modifyActivity;
})