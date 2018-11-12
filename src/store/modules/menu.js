export default {
  state:{
     userMenu:[]
  },
  mutations: {
    generateMenu(state,arr) {
      state.userMenu=arr
    }
  },
}