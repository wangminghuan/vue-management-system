import Vue from 'vue'
import Vuex from 'vuex'
import premission from './modules/premission';
import menu from "./modules/menu";
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
    modules: {
      premission,
      menu
    },
    strict: debug,
})