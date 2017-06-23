define(function (require, exports, module) {
    require("./index.css");
    const Vue = require('vue');
    Vue.use(require('element-dropdown'));
    Vue.use(require('element-dropdown-menu'));
    Vue.use(require('element-dropdown-item'));
    Vue.use(require('element-menu'));
    Vue.use(require('element-sub-menu'));
    Vue.use(require('element-menu-item'));
    Vue.use(require('cfe-back-top'));
    Vue.use(require('../../components/app-cms-breadcrumb/index'));
    var requestLogout = require('../../api/admin-api').requestLogout;

    var app = {
        template: require('./index.html'),
        data: function () {
            return {
                name:"后台管理管理系统",
                user: {
                    username: '',
                    type:''
                },
                activeMenu: '',
                menuClass:""
            };
        },
        created: function () {
            this.activeMenu = this.$route.name;
            if(localStorage.getItem('user')){
                this.user = JSON.parse(localStorage.getItem('user'));
            }else{
                this.$router.push({path: '/login'});
            }

        },
        watch: {
            '$route': function (to, from) {
                this.activeMenu = this.$route.name;
                this.menuClass = "";
                this.user = JSON.parse(localStorage.getItem('user'));
            }
        },
        methods: {
            menuClick:function(){
                if(this.menuClass == ''){
                    this.menuClass = "open"
                }else{
                    this.menuClass = ''
                }

            },
            getRealm:function(list){
                var _this = this;
                if(_this.user.type >= 0){
                    var i = list.length;
                    while (i--) {
                        if (list[i] === _this.user.type) {
                            return true;
                        }
                    }
                    return false;
                }else{
                    return false
                }
            },
            goToIndex:function () {
                this.$router.push({path: '/'});
            },
            logout: function () {
                var _this = this;
                this.$confirm('确定要注销吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(function () {
                    requestLogout().then(
                        function(){
                            localStorage.removeItem('user');
                            _this.$router.push({path: '/login'});
                        }
                    )
                }).catch(function () {
                });
            }
        }
    }
    module.exports = app;
})