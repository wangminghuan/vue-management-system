import Vue from 'vue';
import App from './App';
import router from './router';
import Http from './utils/http';
import filters from "./filters";
import mixins from "./mixin";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import "babel-polyfill";
// 动态设置publicPath,模板中 window.resourceBaseUrl为最终结果
__webpack_public_path__ = window.resourceBaseUrl  // eslint-disable-line
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.mixin(mixins)
Vue.prototype.$axios = Http;
//全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');