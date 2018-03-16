<template>
  <div v-if="showGuideMask" class="guide-mask-wrap">
    <section v-if="step==1" class="step1">
       <div ><img src="../../../../static/img/guide-01.jpg" /><p class="next" @click="step=2"></p></div>
    </section>
   <section v-else-if="step==2" class="step2" >
      <div><img src="../../../../static/img/guide-02.jpg" /><p class="next" @click="step=3"></p></div>
    </section>
    <section v-else-if="step==3" class="step3" >
       <div><img src="../../../../static/img/guide-03.jpg" />
       <p  v-if="isAdmin" class="next" @click="step=4"></p>
       <p v-else class="over" @click="handleClick"></p>
       </div>
    </section>
    <section v-else-if="step==4" class="step4" >
       <div><img src="../../../../static/img/guide-04.jpg" /><p class="over" @click="handleClick"></p></div>
    </section>
  </div>
</template><script>
export default {
  data(){
    const isShowGuide=this.$route.query.guide && this.$route.query.guide=="1" && sessionStorage.getItem("__hasGuideShow__")!=="1"?true:false;
     const _menuObj=JSON.parse(sessionStorage.getItem("__menu__"))||{};
     const _adminVal=_menuObj.admin;
     const isAdmin= _adminVal==3? false: true; //3 为子管理员
    return {
      step:"1",
      showGuideMask:isShowGuide,
      isAdmin:isAdmin
    }
  },
  methods:{
    handleClick(){
        this.showGuideMask=false;
        //出现引导页的情况下，根据url传参自动进入服务商申请页面
        if(this.$route.query.from=="pcserver" && sessionStorage.getItem("__hasAutoEntymerchant__")==null){
               this.$router.push({path: '/merchant'})
               sessionStorage.setItem("__hasAutoEntymerchant__","1");
          }
        sessionStorage.setItem("__hasGuideShow__","1")
    }
  },
  created(){
  }
}
</script>
<style lang="scss">
.guide-mask-wrap{
  position: fixed;
  z-index: 99999;
  left:0;
  right: 0;
  width: 100%;
  min-width: 1600px;
  overflow-x: scroll;
  height: 100%;
  top:0;
  bottom:0;
  background: rgba(0, 0, 0, 1);
  img{
    display: block;
      width: 100%;
  }
  div{
    position: relative;
    width: 1600px;
    margin:0 auto;
    // overflow-x: scroll;
  }
  p{
    width: 260px;
    // background-color: red;
    height: 80px;
     position: absolute;
     cursor: pointer;
  }
  p.next{
    background-image: url("../../../../static/img/guide-next.png");
    width: 260px;
    height: 80px;
    background-repeat: no-repeat;
    background-position: center;
  }
  p.over{
    background-image: url("../../../../static/img/guide-over.png");
    width: 330px;
    height: 80px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .step1 p{
     left: 397px;
     top: 276px;
  }
  .step2 p{
    left: 996px;
    top: 405px;
  }
  .step3 p{
    left: 653px;
    top: 309px;
  }
  .step4 p{
    left: 704px;
    top: 404px;
  }
}
</style>

