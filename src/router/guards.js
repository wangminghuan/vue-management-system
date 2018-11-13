// 全局导航守卫
import router from "./index";
import store from "../store";
let __HAS_LGGIN__ = false; //用户已登录标识
router.beforeEach((to, from, next) => {
    if(to.path=="/login"){
      //进入登录就清除
      sessionStorage.removeItem('__TOKEN__');
    }
    const token = sessionStorage.getItem('__TOKEN__');
    switch (true) {
        //获取到token说明用户已登录
        case !!token:
            //获取到__HAS_LGGIN__为false，说明用户刷新了页面,此时再次添加路由
            if (!__HAS_LGGIN__) {
                __HAS_LGGIN__ = true;
                store.dispatch("getPremission").then((data) => {
                    router.addRoutes(data);
                    next({ ...to,
                        replace: true
                    })
                }).catch(() => {
                    next("/login")
                })
            }
            next()
            break;
            // 未获取到toke说明用户未登陆，强制跳转到登陆页面
        case to.path !== "/login":
            next("/login");
            __HAS_LGGIN__ = false
            break;
        default:
            next();
    }
})
router.afterEach((to, from) => {
    //登录完成记录一个标识
    if (from.path == "/login" && to.path.match("/app/")) {
        __HAS_LGGIN__ = true;
    }
    //设置页面标题
    if(to.meta.title) document.title = to.meta.title
})
