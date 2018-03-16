<template>
  <!-- <el-row class="tac"> -->
  <el-col class="company-side-nav-wrap">
    <el-menu
      :default-active="onRoutes" 
      @open="handleOpen"
      @close="handleClose"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#fff" router>
      <el-menu-item v-for="(item,index) in tabs" :index="item.index" :key="index">
        <span slot="title">{{item.title}}</span>
      </el-menu-item>
    </el-menu>
  </el-col>
<!-- </el-row>  -->
</template>
<script>
const _menu=JSON.parse(sessionStorage.getItem("__companyMenu__"));
export default {
  data(){
     return {
       tabs:_menu
     }
  },
  computed:{
        onRoutes(){
            return this.$route.path.replace('/','');
        }
    },
   methods: {
      getMenu(){
            //  const _menuObj=JSON.parse(sessionStorage.getItem("__menu__"))||{};
            //  const _adminVal=_menuObj.admin;
            //   let  result=[];
            //   const _menuArr=_menuObj.menu.split("&");  //获取字段
            //     if(_adminVal==2 &&  _menuArr.indexOf("4")==-1){
            //         //    如果是主管理员(2) ？且不含有权限4，则展示除了homeset之外的所有入口
            //          _menu.map((item)=>{
            //             if(item.index!=='mycompany_homeSet')  result.push(item)
            //          })
            //     }else {
            //         //   其他则从sesssion直接获取
            //         result= _menu;
            //     }
            //    if(_adminVal==2){
            //     //    如果是主管理员(2) ？含有权限4，则全局展示所有菜单：展示出了homeset之外的所有接口
            //     _menuArr.indexOf("4")>-1? _menu : _menu.splice(1,1);
            //     result= _menu;
            //    }else if(_adminVal==3){
            //     //  子管理员(3)则根据返回字段进行设置
            //     // mueuVal:[],// 1:通讯录管理，2工作台管理，3：企业设置，4.企业主页管理，5，通知公告，6. 工作台轮播图 
            //     if(_menuArr.indexOf("3")>-1 ){
            //         //    只要有3,4,5任意一个就展示工作台入口
            //          result.push(_menu[0]);
            //     }
            //     if(_menuArr.indexOf("4")>-1 ){
            //         //    只要有3,4,5任意一个就展示工作台入口
            //          result.push(_menu[1]);
            //     }
            //     if(_menuArr.indexOf("5")>-1 ){
            //         //    只要有3,4,5任意一个就展示工作台入口
            //          result.push(_menu[2]);
            //     } 
            //     if(_menuArr.indexOf("6")>-1 ){
            //         //    只要有3,4,5任意一个就展示工作台入口
            //          result.push(_menu[3]);
            //     } 
            //    } 
                // return result;
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
      
    }
}
</script>

<style lang="scss">
.company-side-nav-wrap{
  width: 240px;
  position: fixed;
  height: 100%;
  top:60px;
  left:0;
  background-color: #333744;
  .el-menu-item.is-active{
    background-color: #409eff!important
  }
}
</style>

