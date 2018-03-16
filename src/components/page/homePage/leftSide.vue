<template>
    <div class="home-left-wrap" >
      <div class="left-inner-wrap" :style="{height:leftHeight}">
        <section class="top">
          <h3>
              <router-link to="/mycompany" tag="div" class="team-logo">
              <img v-if="renderData.logo" :src="renderData.logo">
              <div v-else class="nologo">暂无图片</div>
              </router-link>
              <router-link to="/mycompany" tag="p">{{renderData.name}}</router-link>
         </h3>
         <ul class="team-info">
             <li><span>成员数</span><em>{{renderData.memberCount}}人</em><b @click="handleClickNotifyVisible">（<i>待激活{{renderData.inactivatedCount}}人</i>）</b></li>
             <li><span>部门数</span><em>{{renderData.sectionCount}}</em></li>
             <li><span>企业类型</span><em>{{renderData.type}}</em></li>
             <li v-show="renderData.insuranceName!==''"><span>保险公司</span><em>{{renderData.insuranceName}}</em></li>
         </ul>
      </section>
      <section class="btm">
          <ul class="tools">
             <li @click="handleClickConcatVisible"><span>联系客服</span></li>
             <li @click="handleClickDownVisible"><span>下载客户端</span></li>
             <li @click="handleClickDownPPT"><span>如何使用</span></li>
         </ul>
         <router-link v-if="isService" to="/merchant" tag="div" class="jump-merchant">申请成为服务商</router-link>
      </section>
    </div>
    </div>
</template>

<script>
export default {
  props:{
    handleClickDownVisible:Function,
    handleClickConcatVisible:Function,
    handleClickNotifyVisible:Function,
    renderData:Object,
    isService:Boolean
  },
  data() {
    return {
    };
  },
  computed:{
    leftHeight:function(){
            return (this.getDoc().height-60)+"px"
    },
  },
  methods:{
    getDoc(){
        if (document.compatMode == "BackCompat") {
              return {
                  width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
                  height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
              }
          } else {
              return {
                  width: Math.max(document.body.scrollWidth, document.body.clientWidth),
                  height: Math.max(document.body.scrollHeight, document.body.clientHeight)
              }
          }
  },
    handleClickDownPPT(){
      window.location.href="http://s29.9956.cn/res/crowdsource/docs/manager_handbook.ppt?v=30"
    },
    handleApplyServer(){
      this.$router.push("/merchant")
    }
  },
};
</script>

<style lang="scss">
.home-left-wrap{
position: fixed;
 overflow: hidden;
 width: 240px;
 font-size: 14px;
 background-color: #333744;
 .left-inner-wrap{
    left: 0;
    top:60px;
    width: 260px;
    color: #fff;
    overflow-y:scroll;
 }
 .top {
   margin:48px 0 18px 0;  
   p{
       line-height: 36px;
       font-size: 16px;
       color:#fff;
       text-align:center;
       padding:0 20px;
       cursor: pointer;

   } 
 }
 .team-logo{
     width:118px;
     height: 118px;
     margin:0 auto;
     border-radius: 20px;
     overflow: hidden;
     margin-bottom: 24px;
     cursor: pointer;
     .nologo{
       border: 1px solid #dfe4ed;
       line-height:118px;
       text-align:center;
       color:#dfe4ed
     }
 }
 .team-info{
     margin-top:56px;
     li{
        line-height: 20px;
        height: 20px;
        margin-bottom: 30px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;;
        span{
            padding:0 18px;
            width: 100px;
            text-align: right;
            float: left;
            font-weight: bold;
        }
        b{
          color:#72b9f6;
          cursor: pointer;
        }
        i{
          text-decoration: underline;
        
        }
     }
 }
 .btm{
   .jump-merchant{
      background-color:#42485b;
      height:40px;
      width: 160px;
      margin:100px auto 40px auto;
      // margin-top:160px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      border-radius: 6px;
   }
     li{
         height:40px;
         width: 160px;
         background-color:#42485b;
         border-radius: 40px;
         margin:0 auto;
         margin-top:36px;
         line-height: 40px;
         padding-left: 62px;
         cursor: pointer;
         background-image: url('../../../../static/img/home-icons.png');
         background-repeat: no-repeat;
         background-position-x: 25px;
     }
     li:nth-of-type(1){
       background-position-y: 8px
     }
     li:nth-of-type(2){
       background-position-y: -60px
     }
     li:nth-of-type(3){
       background-position-y: -131px
     }
 }
 .home-left-concat-pop{
   .el-dialog__header{
     text-align:center;
   }
   b,em{
     display:inline-block;
     height:40px;
     line-height:40px;
     font-size:18px;
     color:#353535;
   }
   b{
     padding-left:58px;
      background-image: url('../../../../static/img/home-icons.png');
      background-repeat: no-repeat;
      background-position-x: 2px;
      background-position-y: -917px;
      margin-right:42px;
      font-size:14px;
   }
   .concat-item{
     width:360px;
     margin: 0 auto;
     margin-bottom:44px;
   }
   .concat-item-btm{
     position:relative;
     b{
       position:absolute;
       top: 50%;
       margin-top:-20px;
       background-position-y:-985px;
     }
     img{
       padding-left:168px
     }
   }
 }
}
</style>