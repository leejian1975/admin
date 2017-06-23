define(function (require, exports, module) {

    const VueRouter = require('vue-router');
    const LoadingBar = require('cfe-loading-bar');
    const Vue = require('vue');
    const abstract = Vue.component('abstract', {
        template: '<router-view></router-view>'
    });
    const welcome = Vue.component('welcome', {
        template: require("./service/welcome/index.html")
    });
    var routes = [
        {
            path: '/login',
            name: 'login',
            component: function (resolve) {
                require.async(['./service/login/index.js'], resolve);
            }
        },
        {
            path: '/404',
            name: '404',
            component: function (resolve) {
                require.async(['./service/not-found/index.js'], resolve);
            },
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/',
            component: function (resolve) {
                require.async(['./service/main/index.js'], resolve);
            },
            meta: {
                requiresAuth: true,
                realm:[0]
            },
            children: [
                {
                    path:'',
                    component: function (resolve) {
                        require.async(['./service/welcome/index.js'], resolve);
                    }
                },
                {
                    path: 'activity',
                    name: 'activity',
                    iconClass: 'el-icon-menu',
                    component: abstract,
                    meta: {
                        requiresAuth: true,
                        showOnList:true,
                        name:"活动管理",
                        realm:[0]
                    },
                    children: [
                        {
                            path:'',
                            beforeEnter:function(to, from, next){
                                next({path: '/activity/activity-list'});
                            },
                            meta: {
                                requiresAuth: true,
                                showOnList:false,
                                realm:[0]
                            },
                        },
                        {
                            path: 'activity-list',
                            iconClass: 'icon-font cfe-icon-sort',
                            name: 'activityList',
                            component: function (resolve) {
                                require.async(['./service/activity-list/index.js'], resolve);
                            },
                            meta: {
                                requiresAuth: true,
                                showOnList:true,
                                name:"活动列表",
                                realm:[0]
                            },
                        },
                        {
                            path: 'add-activity',
                            name: 'addActivity',
                            iconClass: '',
                            component: function (resolve) {
                                require.async(['./service/activity-modify/index.js'], resolve);
                            },
                            meta: {
                                requiresAuth: true,
                                showOnList:false,
                                name:"添加活动",
                                realm:[0]
                            },
                        },
                        {
                            path: 'edit-activity/:id',
                            name: 'editActivity',
                            iconClass: '',
                            component: function (resolve) {
                                require.async(['./service/activity-modify/index.js'], resolve);
                            },
                            meta: {
                                requiresAuth: true,
                                showOnList:false,
                                name:"编辑活动",
                                realm:[0]
                            },
                        },
                        {
                            // path: 'find-activity/:id',
                            path: 'find-activity',
                            name:'findActivity',
                            iconClass: '',
                            component: function (resolve) {
                                require.async(['./service/activity-detail/index.js'], resolve);
                            },
                            meta: {
                                requiresAuth: true,
                                showOnList:false,
                                name: '查看活动',
                                realm:[0]
                            }
                        }
                    ]
                },
                {
                    path: 'test1',
                    name: 'test1',
                    iconClass: 'el-icon-menu',
                    component: abstract,
                    meta: {
                        requiresAuth: true,
                        showOnList:true,
                        name:"导航栏一",
                        realm:[0]
                    },
                    children: [
                        {
                            path:'',
                            beforeEnter:function(to, from, next){
                                next({path: '/activity/activity-list'});
                            },
                            meta: {
                                requiresAuth: true,
                                showOnList:false,
                                realm:[0]
                            },
                        },
                        {
                            path: 'activity-list1',
                            iconClass: 'icon-font cfe-icon-sort',
                            name: 'list1',
                            component: function (resolve) {
                                require.async(['./service/activity-list/index.js'], resolve);
                            },
                            meta: {
                                requiresAuth: true,
                                showOnList:true,
                                name:"列表一",
                                realm:[0]
                            }
                        },
                        {
                            path: 'activity-list2',
                            iconClass: 'icon-font cfe-icon-sort',
                            name: 'list2',
                            component: function (resolve) {
                                require.async(['./service/activity-list/index.js'], resolve);
                            },
                            meta: {
                                requiresAuth: true,
                                showOnList:true,
                                name:"列表二",
                                realm:[0]
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: '*',
            redirect: {path: '/404'}
        }
    ]
    var menuCount = routes.length;
    routes[menuCount - 2].children.forEach(function (route) {
        if (route.children) {
            if (!route.meta) route.meta = {};
            route.meta.children = route.children;
        }
    });

    var router = new VueRouter({
        mode: 'hash',
        base: location.pathname,
        linkActiveClass: 'active',
        routes: routes
    });

    router.beforeEach(function (to,from,next) {
        if (to.meta.requiresAuth)
        {
            var user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                next({path: '/login', query: {redirect: to.fullPath}});
            }else{
                LoadingBar.start();
            }
        }
        next();
    });

    router.afterEach(function (to,from,next) {
        LoadingBar.finish();
    });

    module.exports = router;
});