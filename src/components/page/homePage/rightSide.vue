<template>
    <div class="home-right-wrap clearfix">
      <section class="top">
       <el-carousel trigger="click" height="425px">
        <el-carousel-item v-for="(item,index) in renderData.banner" :key="index" >
          <!-- <div class="link-item" @click="()=>handleClickJump(item.url)" :style="{backgroundImage:`url(${item.img})`}"></div> -->
           <div class="link-item" @click="()=>handleClickJump(item.url)"><img :src="item.img"/></div>
         </el-carousel-item>
       </el-carousel>
      </section>
      <section class="btm">
        <h3>常用入口</h3>
      <ul class="frequent-use">
         <li v-for="(item,index) in renderData.entrance" :key="index">
              <div v-if="item.e_url.indexOf('http')>-1">
                <a :href="item.e_url"><img :src="item.e_icon" class="icon"/><em>{{item.e_name}}</em></a>
              </div>
              <div v-else-if="item.e_url=='download'" @click="handleClickDownVisible">
                <img :src="item.e_icon" class="icon"/><em>{{item.e_name}}</em>
              </div>
              <div v-else-if="item.e_url=='activepop'" @click="handleClickNotifyVisible">
                <img :src="item.e_icon" class="icon"/><em>{{item.e_name}}</em>
              </div>
              <router-link to="/addressList?add=1"  tag="div" v-else-if="item.e_url=='organ?add'"><img :src="item.e_icon" class="icon"/><em>{{item.e_name}}</em></router-link>
              <router-link to="/mycompany_notify"  tag="div" v-else-if="item.e_url=='notify'"><img :src="item.e_icon" class="icon"/><em>{{item.e_name}}</em></router-link>
              <router-link to="/addressList"  tag="div" v-else-if="item.e_url=='organ'"><img :src="item.e_icon" class="icon"/><em>{{item.e_name}}</em></router-link>
         </li>
      </ul>
      </section>
    </div>
</template>

<script>
export default {
  props:{
    handleClickDownVisible:Function,
    handleClickNotifyVisible:Function,
    renderData:Object
  },
  data: function() {
    return {
    };
  },
  methods:{
    handleClickJump(index){
      if(index) window.location.href=index;
    }
  }
};
</script>

<style lang="scss">
.home-right-wrap{
  width: 100%;
  padding-left: 265px;
  padding-top: 14px;
  .el-carousel{
    border-radius: 6px;
    overflow: hidden;
  }
  .link-item{
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    text-align: center;
    font-size: 30px;
    color: #fff;
    line-height: 425px;
    img{
      width: 100%;
    }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .el-carousel__button{
    width:10px;
    height: 10px;
    border-radius: 50%; 
  }
 .el-carousel__indicators{
    left: 5%;
  }
  .el-carousel__item:nth-child(2n) {
     background-color: #409eff;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #475669;
  }
  .frequent-use {
      li{
          height: 86px;
          line-height: 86px;
          border:1px solid #d8dce5;
          border-radius: 4px;
          width: 258px;
          float: left;
          margin-right:10px;
          box-sizing: border-box;
          margin-bottom: 20px; 
          padding-left: 120px;
          position: relative;
        //    background-image: url('../../../../static/img/home-icons.png');
        //  background-repeat: no-repeat;
        //  background-position-x: 34px;
         cursor: pointer;
         .icon{
           width:54px;
           height:54px;
           overflow: hidden;
           border-radius: 4px;
           position: absolute;
           top:16px;
           left:34px
         }
      }
    //   li:nth-of-type(1){
    //    background-position-y: -198px
    //  }
    //  li:nth-of-type(2){
    //    background-position-y: -339px
    //  }
    //  li:nth-of-type(3){
    //    background-position-y: -482px
    //  }
    //  li:nth-of-type(4){
    //    background-position-y: -623px
    //  }
    //   li:last-child{
    //     margin-right: 0;
    //     background-position-y: -765px
    //   }
  }
  .btm{
     font-size: 16px;
     margin-top:46px;
     
     h3{
         height: 18px;
         line-height: 18px;
         border-left: 2px solid #409eff;
         padding-left:10px; 
         margin-bottom: 20px;
     }
  }

}
</style>