<template>
    <div>
        <nav-bar></nav-bar>
        <div class="company-content-wrap" ref="company" :style="wrapHeight">
          <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import navBar from './navBar.vue';
    export default {
        components:{
            navBar
        },
        data(){
          return({
            wrapHeight:null
          })
        },
        mounted(){
          var h= document.documentElement.clientHeight|| document.body.clientHeight;
          this.wrapHeight={
            height:(parseInt(h-60)<400?400:parseInt(h-60))+"px"
          }
        }
    }
</script>
<style lang="scss">
.company-content-wrap{
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-left: 240px;
  .com-item-title{
    line-height: 18px;
    padding: 26px 0 26px 28px;
    border-bottom: 1px solid #d5d5d5;
    position: relative;
    margin-bottom: 36px;
    &:before{
    content: "";
    height: 18px;
    width: 2px;
    background-color:#409eff;
    display: block;
    position: absolute;
    left: 14px;
    top:25px; 
    }
  }
  .form-wrap{
     padding-left: 25px;
     padding-right: 25px;
  }
   .el-table__body-wrapper{
    overflow: hidden;
  }
  .pagination-wrap{
   border:1px solid #e6ebf5;
   border-top:none;
   padding:20px;
   .el-pagination{
    float: right;
    }
  }
}
</style>

