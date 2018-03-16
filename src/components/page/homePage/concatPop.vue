<template>
      <el-dialog width="650px" title="联系客服" class="home-left-concat-pop" :visible.sync="dialogConcatVisible" center>
        <div class="concat-item"><b>客服电话：</b><em>{{renderData.phone}}</em></div>
        <div class="concat-item concat-item-btm"><b>客服微信：</b><img :src="renderData.wechat"/></div>
      </el-dialog>
</template>

<script>
export default {
  props:{
    renderData:Object
  },
  data: function() {
    return {
      dialogConcatVisible:false,
    };
  },
  created(){
    __vBus.$on("H_showDialogConcat",()=>{
          this.dialogConcatVisible=true;
      })
  }
};
</script>

<style lang="scss">
.home-left-concat-pop{
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
</style>