<template>
    <div class="home-wrap clearfix" v-loading.fullscreen.lock="fullscreenLoading"> 
     <left-side 
     :handleClickDownVisible="handleClickDownVisible"
     :handleClickConcatVisible="handleClickConcatVisible"
     :handleClickNotifyVisible="handleClickNotifyVisible"
     :renderData="lfData"
     :isService="isService"
     ></left-side>
     <right-side 
     :handleClickDownVisible="handleClickDownVisible"
     :handleClickConcatVisible="handleClickConcatVisible"
     :handleClickNotifyVisible="handleClickNotifyVisible"
     :renderData="rtData"
     ></right-side>
     <down-pop :renderData="downloadData"></down-pop>
     <concat-pop :renderData="concatData"></concat-pop>
     <notify-pop></notify-pop>
     <guide-mask ></guide-mask>
    </div>
</template>

<script>
import leftSide from "./leftSide";
import rightSide from "./rightSide";
import downPop from './downPop';
import concatPop from "./concatPop"
import notifyPop from './notifyPop';
import guideMask from "./guide";
export default {
  components:{
        leftSide,
        rightSide,
        downPop,
        concatPop,
        notifyPop,
        guideMask
 },
  data: function() {
    return {
      fullscreenLoading: true,
      isService:false,
      lfData:{},
      rtData:{},
      concatData:{}, //客服信息
      downloadData:{}, //下载信息
    };
  },
  methods:{
    handleClickDownVisible(){
       __vBus.$emit("H_showDialogDown")
    },
    handleClickConcatVisible(){
      __vBus.$emit("H_showDialogConcat")
    },
    handleClickNotifyVisible(){
       __vBus.$emit("H_showDialogNotify",{
         getListUrl:"/api/index/index/notActivateMembers"
       })
    },
  },
  mounted(){
    this.$axios.post('/api/index/index/index').then((res)=> {
      const _data=res.data;
      if(_data.code==0){
        this.lfData=_data.data.company;
        if(this.lfData.allowApplyProvider=="1"){
            this.isService=true;
             __vBus.$emit("showMsgTips")
             //根据url传参自动进入服务商申请页面，且不出现引导页的情况下
            if(this.$route.query.from=="pcserver" && sessionStorage.getItem("__hasAutoEntymerchant__")==null && !(this.$route.query.guide && this.$route.query.guide=="1" && sessionStorage.getItem("__hasGuideShow__")!=="1")){
               this.$router.push({path: '/merchant'})
               sessionStorage.setItem("__hasAutoEntymerchant__","1");
            }
        }
        // this.$router.push({path: '/merchant'})
        this.rtData={
          banner:_data.data.banner,
          entrance:_data.data.entrance
        };
        this.concatData=_data.data.info.kefu;
        this.downloadData=_data.data.info.download;
      }else{
         this.$message.error(_data.message);
      }
      this.fullscreenLoading=false;
    }).catch((err)=>{
      this.fullscreenLoading=false;
    });    
  }
};
</script>

<style lang="scss">
.home-wrap {
   height: 100%;
   width: 100%;
   padding-right: 18px;
}
</style>