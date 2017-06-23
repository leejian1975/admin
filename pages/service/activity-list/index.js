define(function (require, exports, module) {
    var Vue = require('vue');

    Vue.use(require('element-upload'));
    Vue.use(require('element-table'));
    Vue.use(require('element-table-column'));
    Vue.use(require('element-pagination'));
    Vue.use(require('element-dialog'));
    Vue.use(require('element-button'));
    Vue.use(require('element-button-group'));
    Vue.use(require('element-input'));

    var fetchActivityList = require('../../api/activity-api.js').fetchActivityList;
    var deleteActivity = require('../../api/activity-api.js').deleteActivity;
    var batchDeleteActivity = require('../../api/activity-api.js').batchDeleteActivity;

    var activityList = {
        template: require('./index.html'),
        data: function () {
            return {
                activity: [{
                    name:'相亲活动',
                    time:'2017-06-24',
                    location:'苏州市工业园区',
                    contact:'李木子'
                }],
                activityFiles:[],
                page:1,
                pageSize:10,
                total:1,
                loading: false,
                dialogVisible:false,
                multipleSelection: [],
                reserveSelection:false,
                filters: {
                    prop: '',
                    order:'',
                    name: ''
                },
                upload:{
                    action:Cfe.networkConfig.baseURL + 'upload/activities/upload'
                }
            };
        },
        mounted:function(){
            // this.fetchData();
        },
        methods:{
            batchImport:function(){
                this.dialogVisible = true;
            },
            goToAddActivity:function(){
                this.$router.push({path: '/activity/add-activity'});
            },
            handleFind:function(id){
                // this.$router.push({path:'/activity/find-activity/'+id });
                this.$router.push({path:'/activity/find-activity'});
            },
            handleSearch:function(page){
                this.fetchData(page);
            },
            handleCurrentChange:function (val) {
                this.fetchData(val);
            },
            handleSelectionChange:function (val) {
                this.multipleSelection = val;
            },
            handleSortChange: function (sortWay) {
                this.filters.prop =  sortWay.prop == null ? '' : sortWay.prop;
                this.filters.order =  sortWay.order == 'ascending' ? 'asc':'desc';
                this.fetchData();
            },
            handleRemove: function(file, fileList) {
            },
            handlePreview: function(file) {
            },
            handleSuccess: function(res, file) {
                this.fetchData();
            },
            handleError: function() {
            },
            beforeUploadActivity:function(file) {
                var _this = this;
                var type = file.name.substring(file.name.lastIndexOf('.'));
                //const isEXCEL = file.type === 'application/vnd.ms-excel';
                const isEXCEL = (type === '.xls'|| type === '.xlsx');
                //const isLt5M = file.size / 1024 / 1024 < 1;

                if (!isEXCEL) {
                    this.$message.error('上传文件只能是 excel 格式!');
                }
                // if (!isLt5M) {
                //     this.$message.error('上传文件的大小不能超过 1MB!');
                // }
                return isEXCEL;
                //return true;
            },

            //调用获取后台数据方法
            fetchData: function (page) {
                var _this = this;
                // param: sort way
                var sortWay = _this.filters.sortWay && _this.filters.sortWay.prop ? _this.filters.sortWay : '';
                // param: page
                _this.page = page || _this.page;

                _this.loading = true;

                fetchActivityList(_this.page,_this.pageSize, _this.filters).then(function (res) {
                    if(res.errorCode == 0){
                        _this.$refs.table.clearSelection();
                        // lazy render data
                        _this.activity = res.data.items;
                        _this.total = res.data.total;
                    }else{
                        Cfe.requestError(res,_this);
                    }
                    _this.loading = false;
                });
            },

            batchDeleteActivity: function(){
                var _this = this;
                var activityIds = [];
                for(var index in _this.multipleSelection){
                    if(_this.multipleSelection[index].id != null){
                        activityIds.push(_this.multipleSelection[index].id);
                    }
                }
                if(activityIds.length == 0) {
                    _this.$message({
                        message: '请选择数据',
                        type: 'danger'
                    });
                }else{
                    _this.$confirm('确定要批量删除这些数据吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(function () {
                        batchDeleteActivity(activityIds).then(function(res){
                            if(res.errorCode == 0){
                                _this.fetchData();
                                _this.$message({
                                    message: '批量删除成功',
                                    type: 'success'
                                });
                            }else{
                                Cfe.requestError(res,_this);
                            }
                        });
                    });
                }
            },

            handleDelete: function(row){
                var _this = this;
                _this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(function () {
                    deleteActivity(row.id).then(function(res){
                        if(res.errorCode == 0){
                            _this.fetchData();
                            _this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }else{
                            Cfe.requestError(res,_this);
                        }
                    })
                });
            }
        }
    }
    module.exports = activityList;
})