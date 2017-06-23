define(function (require, exports, module) {
    const Vue = require('vue');
    Vue.use(require('element-button'));
    Vue.use(require('element-input'));
    var requestLogin = require('../../api/admin-api').requestLogin;
    var adminDetail = require('../../api/admin-api').adminDetail;
    module.exports = {
        template: require('./index.html'),
        data: function () {
            return {
                username: '',
                password: '',
                isBtnLoading: false
            };
        },
        computed: {
            btnText: function () {
                if (this.isBtnLoading) return '登录中...';
                return '登录';
            }
        },
        methods: {
            login: function () {
                var _this = this;
                if (!_this.username) {
                    _this.$message.error('请填写用户名！！！');
                    return;
                }
                if (!_this.password) {
                    _this.$message.error('请填写密码');
                    return;
                }
                var loginParams = {userName: _this.username, password: _this.password};
                _this.isBtnLoading = true;
                requestLogin(loginParams).then( //先登录
                    function (data) {
                        _this.isBtnLoading = false;
                        var errorMsg = data.errorMsg;
                        var errorCode = data.errorCode;

                        //以下为测试demo，实际上要判断登录请求后的errorCode，从服务器端获取user信息
                        if (errorCode !== 0) {
                            _this.$message.error(errorMsg);
                        } else {
                            adminDetail().then( //再请求登录用户信息
                                function(res){
                                    if(res.errorCode == 0){
                                        var user = {
                                            username: res.data.name,
                                            type:res.data.type
                                        };
                                        localStorage.setItem('user', JSON.stringify(user));
                                        if (_this.$route.query.redirect) {
                                            _this.$router.push({path: _this.$route.query.redirect});
                                        } else {
                                            _this.$router.push({path: '/'});
                                        }
                                    }else{
                                        //异常处理
                                    }

                                }
                            )

                        }
                    });
            }
        }
    }
    ;
})