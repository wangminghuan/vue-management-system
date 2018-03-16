<template>
  <!-- <el-row class="tac"> -->
  <el-col class="company-side-nav-wrap">
    <el-menu
      :default-active="onRoutes" 
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
const _menu=[{
          index: 'performance_rank',
          title: '职级管理'
      },
      {
          index: 'performance_check',
          title: '业绩考核管理'
      },
      {
          index: 'performance_issue',
          title: '出单管理'
      }]
export default {
  data(){
     return {
       tabs:_menu
     }
  },
  computed:{
        onRoutes(){
                // 根据路由字段判断其属于哪一个tab下的，防止tab菜单不被激活
              let _default=this.$route.path.replace('/','');
              return ((_default.split("_"))[0]||"")+"_"+((_default.split("_"))[1]||"")
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

