<template>
    <div class="wrapper">
        <v-head></v-head>
        <div class="outer-content-wrap">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header'
    export default {
        components:{
            vHead
        }
    }
</script>
<style lang="scss">
.outer-content-wrap{
    background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: 60px;
    bottom:0;
    width: auto;
    box-sizing: border-box;
    overflow: hidden;
    .outer-cropper-wrap{
        display:none;
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        top:0;
        bottom:0;
        left: 0;
        right: 0;
        z-index:2999 ;
        .cropper-content {
            
            height: 1000px;
            position: absolute;
            top:0;
            left: 0;
            right:0;
            width: 1000px;
            margin:0 auto;
            background-color: #fff;
            padding: 40px;
            top:50%;
            margin-top:-500px;
            padding-bottom: 80px;
            transform:scale(0.8);
            }
        .cropper-btn-wrap{
                // margin:20px 20px 0 0;
                padding: 0 77px;
                margin-top:20px;
                transform:scale(1.2);

       }
    }
   
}
.partment-tree-wrap{
        height:400px ;
        width: 380px;
        overflow: auto;
        float: left;
        border: 1px solid #e6ebf5;
       border-radius: 4px;
  }
  .partment-choose-wrap{
       width: 300px;
       height: 400px;
       overflow: auto;
       border: 1px solid #e6ebf5;
       border-radius: 4px;
       float: right;
       padding:4px 10px;
       li{
         line-height: 30px;
         white-space: nowrap;
       }
       i{
         margin-left: 10px
       }
  }
</style>

