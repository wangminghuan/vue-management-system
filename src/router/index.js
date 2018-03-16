import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        }, {   
            path: '*', 
            redirect: '/error' 
        }, {
            path: '/login', //登录
            component: resolve => require(['../components/page/Login.vue'], resolve)
        }, {
            path: '/regist', //注册
            component: resolve => require(['../components/page/Regist.vue'], resolve)
        }, {
            path: '/merchant', //服务商入住
            component: resolve => require(['../components/page/Merchant.vue'], resolve)
        }, {
            path: '/error',  //缺省错误页面
            component: resolve => require(['../components/common/error.vue'], resolve)
        },{
            path: '/home',  //主页
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['../components/page/homePage/index.vue'], resolve)
                }, {
                    path: '/addressList', //通讯录，默认进入组织结构管理
                    component: resolve => require(['../components/page/addressList/organ.vue'], resolve)
                }, {
                    path: '/addressList_role', //角色结构
                    component: resolve => require(['../components/page/addressList/role.vue'], resolve)
                }, {
                    path: '/addressList_managerole', //角色管理
                    component: resolve => require(['../components/page/addressList/managerole.vue'], resolve)
                }, {
                    path: '/mycompany',
                    component: resolve => require(['../components/page/myCompany/index.vue'], resolve),
                    children: [
                        {
                            path: '/',
                            component: resolve => require(['../components/page/myCompany/setting.vue'], resolve)
                        }, {
                            path: '/mycompany_notify',
                            component: resolve => require(['../components/page/myCompany/notify.vue'], resolve)
                        }, {
                            path: '/mycompany_carousel',
                            component: resolve => require(['../components/page/myCompany/carousel.vue'], resolve)
                        }, {
                            path: '/mycompany_homeSet',
                            component: resolve => require(['../components/page/myCompany/homeSet.vue'], resolve)
                        }, {
                            path: '/mycompany_permission',
                            component: resolve => require(['../components/page/myCompany/permission.vue'], resolve)
                        }, {
                            path: '/mycompany_record',
                            component: resolve => require(['../components/page/myCompany/record.vue'], resolve)
                        }, {
                            path: '/mycompany_dissolved',
                            component: resolve => require(['../components/page/myCompany/dissolved.vue'], resolve)
                        }
                    ]
                }, {
                    path: '/performance',
                    component: resolve => require(['../components/page/performance/index.vue'], resolve),
                    children: [
                        {
                            path: '/',
                            redirect: '/performance_rank'
                        }, {
                            path: '/performance_rank',
                            component: resolve => require(['../components/page/performance/rank.vue'], resolve)
                        }, {
                            path: '/performance_check',
                            component: resolve => require(['../components/page/performance/check.vue'], resolve)
                        }, {
                            path: '/performance_check_ruledit',
                            component: resolve => require(['../components/page/performance/checkRuleEdit.vue'], resolve)
                        }, {
                            path: '/performance_check_tabledit',
                            component: resolve => require(['../components/page/performance/checkTableEdit.vue'], resolve)
                        },{
                            path: '/performance_issue',
                            component: resolve => require(['../components/page/performance/issue.vue'], resolve)
                        },
                        {
                            path: '/performance_issue_import',
                            component: resolve => require(['../components/page/performance/issueImport.vue'], resolve)
                        },
                        {
                            path: '/performance_issue_import_result',
                            component: resolve => require(['../components/page/performance/issueResult.vue'], resolve)
                        }
                    ]
                },{
                    path: '/worktable',
                    component: resolve => require(['../components/page/workTable/index.vue'], resolve)
                }, {
                    path: '/worktable_applicationmarket',
                    component: resolve => require(['../components/page/workTable/applicationMarket.vue'], resolve)
                }, {
                    path: '/worktable_applicationDetail',
                    component: resolve => require(['../components/page/workTable/applicationDetail.vue'], resolve)
                }
            ]
        }
    ]
})