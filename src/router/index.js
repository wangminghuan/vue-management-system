import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const router=new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    meta:{
      title:"登录"
    },
    component: resolve => require(['@/components/pages/Login.vue'], resolve)
  },
  {
    path: '/404',
    meta:{
      title:"404"
    },
    component: resolve => require(['@/components/pages/404.vue'], resolve)
  },
  ]
})

export default router
