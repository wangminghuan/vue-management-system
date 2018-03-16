<template>
    <div class="outer-header-wrap">
        <router-link to="/home"  tag="div" class="logo">保世界管理后台</router-link>
        <div class="nav-bar">
        <el-menu 
        :default-active="onRoutes" 
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="el-menu-nav" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
       </div>
        <div class="user-info clearfix">
                <span style="float:left"><msgTips :isInsurCompany="isInsurCompany"></msgTips></span>
                <!-- <img  class="user-avatar" src="../../../static/img/img.jpg" /> -->
                <span class="user-name">{{username}}</span>
                <span class="login-out" @click="handleLoginOut">退出</span>
        </div>
    </div>
</template>
<script>
import msgTips from "./msgTips";
//主菜单
const _menu=[{
            // icon: 'el-icon-message',
            index: 'addressList',
            title: '通讯录',
        },
        {
            // icon: 'el-icon-menu',
            index: 'performance',
            title: '业绩管理'
        },
        {
            // icon: 'el-icon-menu',
            index: 'worktable',
            title: '工作台'
        },
        {
            // icon: 'el-icon-document',
            index: 'mycompany',
            title: '我的企业',
        }];
// 企业子菜单
const _companyMenu=[{
          index: 'mycompany',
          title: '企业设置'
      },
      {
          index: 'mycompany_homeSet',
          title: '企业主页管理'
      },
      {
          index: 'mycompany_notify',
          title: '通知公告'
      },
      {
          index: 'mycompany_carousel',
          title: '工作台轮播图'
      },
      {
          index: 'mycompany_permission',
          title: '权限管理'
      },
      {
          index: 'mycompany_record',
          title: '操作记录'
      },
      {
          index: 'mycompany_dissolved',
          title: '解散企业'
      }]
// adminVal:1, //1,无权限，2主管理员, 3子管理员            
const _menuObj=JSON.parse(sessionStorage.getItem("__menu__"))||{};
const _adminVal=_menuObj.admin;
const _menuArr=_menuObj.menu.split("&");  //获取字段
    export default {
        components:{
            msgTips
        },
        data() {
        const isInsurCompany=sessionStorage.getItem('__c_type__')=="1"?true:false
        return {
                name: 'admin',
                isInsurCompany:isInsurCompany,
                items: this.getMenu(isInsurCompany)
            }
        },
        computed:{
            username(){
                let username = sessionStorage.getItem('__user__');
                return username ? username : this.name;
            },
            onRoutes(){
                // 根据路由字段判断其属于哪一个tab下的，防止tab菜单不被激活
                let _default=this.$route.path.replace('/','');
                return ((_default.split("_"))[0]||"")
            }
        },
        methods:{
            getCompanyMenu(arr){
               // 1:通讯录管理，2工作台管理，3：企业设置，4.企业主页管理，5，通知公告，6. 工作台轮播图,7.业绩管理 
               let temp=[];
             
                if(_menuArr.indexOf("3")>-1){
                        temp.push(_companyMenu[0])
                }
                if(_menuArr.indexOf("4")>-1){
                    temp.push(_companyMenu[1])
                }
                if(_menuArr.indexOf("5")>-1){
                    temp.push(_companyMenu[2])
                }
                if(_menuArr.indexOf("6")>-1){
                    temp.push(_companyMenu[3])
                }                    
               if(_adminVal==2){
                    temp.push(_companyMenu[4])
                    temp.push(_companyMenu[5])
                    temp.push(_companyMenu[6])
                }
               //企业子菜单存储到session中
               sessionStorage.setItem("__companyMenu__",JSON.stringify(temp))
            },
            getMenu(isInsu){  
               let  result=[];
               if(_adminVal==2){
                //    如果是主管理员(2)则全局展示所有菜单
                if(!isInsu){
                    //不是保险公司剔除掉业绩管理
                    _menu.map((item)=>{
                        if(item.index!=="performance")
                         result.push(item)
                    })

                }else{
                    result=_menu;
                }
               }else if(_adminVal==3){
                //  子管理员(3)则根据返回字段进行设置
                // mueuVal:[], // 1:通讯录管理，2工作台管理，3：企业设置，4.企业主页管理，5，通知公告，6. 工作台轮播图,7.业绩管理 
                if(_menuArr.indexOf("1")>-1){
                    result.push(_menu[0]);
                }
                if(_menuArr.indexOf("7")>-1 && isInsu){
                     result.push(_menu[1])
                }
                if(_menuArr.indexOf("2")>-1){
                     result.push(_menu[2])
                }
                if(_menuArr.indexOf("3")>-1 || _menuArr.indexOf("4")>-1 || _menuArr.indexOf("5")>-1 || _menuArr.indexOf("6")>-1){
                    //    只要有3,4,5，6任意一个就展示工作台入口
                     result.push(_menu[3]);
                 }   
               } 
                return result;
            },
            handleLoginOut(){
                sessionStorage.clear();
                this.$router.push('/login');
            }
        },
        created(){
            this.getCompanyMenu();
            // console.log(this.$store.getters.getFinalMenu)
        }
    }
</script>
<style lang="scss">
    .outer-header-wrap {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        color: #fff;
        background-color: #545c64;
   .logo{
        float: left;
        width:240px;
        height: 50px;
        line-height: 50px;
        margin-top:5px;
        border-right: 1px solid #454b55;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        background-image:  url('../../../static/img/title-logo.png');
        background-repeat: no-repeat;
        background-position: 18px 7px;
    }
    .nav-bar{
        float: left;
        font-size: 14px;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
        line-height: 60px;
        
    }
    .user-avatar{
        width:40px;
        height:40px;
        border-radius: 50%;
        float: left;
        margin-top: 10px;
        margin-right: 10px;
    }
   
    .user-name,.login-out{
        color:#fff;
        float: left;
        margin-right: 10px;
        cursor: pointer;
    }
     .user-name{
        margin-right: 20px;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
    .el-submenu__title{
        padding:0 40px;
    }
    .el-submenu>.el-menu{
        top: 60px;
    }
    }
</style>
