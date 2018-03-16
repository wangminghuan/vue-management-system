<template>
  <div class="error-wrap">
    <img class="tips-pic" src="//s29.9956.cn/res/bxd365/images/error-tips.jpg" />
    <div class="cont-txt">
        <p>未找到该页面，请确保访问路径正确</p>
    </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
      };
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.error-wrap{
   width: 560px;
   height:340px;
   margin: 0 auto;
   position:absolute;
   top:50%;
   left:0;
   right:0;
   margin-top:-170px;
  .tips-pic{
    width: 200px;
    margin:0 auto;
    display: block;
  }
  .cont-txt{
    text-align: center;
    line-height:30px;
    font-size: 16px;
  }
}
</style>
