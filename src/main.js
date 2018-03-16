import Vue from 'vue';
import App from './App';
// import store from './store'; //vuex数据传递
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "babel-polyfill";
import axios from "./utils/http";
// 动态设置publicPath,模板中 window.resourceBaseUrl为最终结果
__webpack_public_path__ = window.resourceBaseUrl;

// 登录校验
router.beforeEach((to,from,next) =>{
   if(to.path==="/login" || to.path==="/regist"){
        next()
    }else{
        const __data=JSON.parse(sessionStorage.getItem('__data__'))||{};
        const isInsurCompany=sessionStorage.getItem('__c_type__')=="1"?true:false;
        if(!__data.u_id || !__data.c_id || !__data.access_token){
            next({path:"/login",query:to.query})
        }else{ 
            // 建立全局变量    
            window.__golbal_cid=__data.c_id||"";
            window.__golbal_uid=__data.u_id||"";
            window.__golbal_params=__data;
            // 模块开放设置
            const _menuObj=JSON.parse(sessionStorage.getItem("__menu__"))||{};
            const _adminVal=_menuObj.admin;
            const _menuArr=_menuObj.menu.split("&");
            //  子管理员(3)则根据返回字段进行设置
           // mueuVal:[], // 1:通讯录管理，2工作台管理，3：企业设置，4.企业主页管理，5，通知公告，6. 工作台轮播图 
            // 子管理员，特殊路由设置
        //如果是保险公司，则无法访问业绩管理页面
        if(!isInsurCompany && (to.path).split("_")[0]=="/performance"){
            next({path:"/error"})
        }
        if(_adminVal==3){
                // 先设置 
                if(["/mycompany_permission","/mycompany_record","/mycompany_dissolved"].indexOf(to.path)>-1
                     // 访问主管理员相关功能直接跳出
                  ||(_menuArr.indexOf("1")==-1 &&  (to.path).split("_")[0]=="/addressList" )
                    // 如果没有通讯录权限则无法访问页面
                  ||(_menuArr.indexOf("2")==-1 && (to.path).split("_")[0]=="/worktable" )
                     // 如果没有工作台权限则无法访问页面
                  ||(_menuArr.indexOf("7")==-1 && (to.path).split("_")[0]=="/performance")
                      // 如果没有业绩管理权限则无法访问页面
                 ){
                    next({path:"/error"})
                }else if(_menuArr.indexOf("3")==-1 && to.path==="/mycompany"){
                    const _menu=JSON.parse(sessionStorage.getItem("__companyMenu__"));
                    next({path: "/"+_menu[0].index})
                    //访问我的企业时，如果没有企业设置项，则顺延 
                }else{
                    next();
                } 
        }else if(_adminVal==2 && _menuObj.status==3 && to.path!=="/mycompany_dissolved"){
            // 解散中，所有路由均重定向到该页面
             next({path:"/mycompany_dissolved"})
        }else if(_menuArr.indexOf("4")==-1 && to.path==="/mycompany_homeSet"){
            // 如果不返回4，则无法访问homeset路由
            next({path:"/error"})
        }else{
            next();
        }
    }
}
})
//公共全局通信通道，各个模块定义自定义事件时按模块名+事件名称的方式来规避命名冲突
window.__vBus=new Vue();
Vue.use(ElementUI);
Vue.prototype.$axios=axios;
// Date原型链挂载格式化方法
Date.prototype.format = function (format) {
    let args = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let i in args) {
        let n = args[i];
        if (new RegExp("(" + i + ")").test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
};
new Vue({
    router,
    // store,
    render: h => h(App)
}).$mount('#app');