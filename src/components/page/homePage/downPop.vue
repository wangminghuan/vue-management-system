<template>
    <el-dialog title="下载保世界APP客户端" :visible.sync="dialogTableVisible" class="home-down-pop" center width="600px">
        <img :src="renderData.qrCodeUrl"/>
        <span class="down-btn" @click="handleClickDownCode"><a :href="renderData.qrCodeUrl" download='downfiles'>下载二维码</a></span>
        <div class="down-link"><span>下载链接</span><em>{{renderData.url}}</em><b v-clipboard:copy="renderData.url"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError">复制</b></div>
    </el-dialog>
</template>

<script>
import Vue from "vue";
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);
export default {
    props:{
        renderData:Object
    },
  data: function() {
    return {
      dialogTableVisible:false,
    };
  },
  methods:{
   handleClickDownCode(){
        this.$message({
          message: '恭喜你，下载成功！',
          type: 'success'
        });
   },
   onCopy: function (e) {
      this.$message({
          message: '复制成功！',
          type: 'success'
    });
    },
    onError: function (e) {
      this.$message({
          message: '复制失败！',
          type: 'error'
    });
    }
  },
  created(){
      __vBus.$on("H_showDialogDown",()=>{
          this.dialogTableVisible=true;
      })
  }
};
</script>

<style lang="scss">
.home-down-pop{
    font-size: 14px;
    img{
        display: block;
        width: 158px;
        height: auto;
        margin:0 auto;
    }
    .down-btn{
        margin:20px auto 30px auto;
        width:100px;
        height: 38px;
        display: block;
        text-align: center;
        line-height: 36px;
        background-color:#ecf5ff ;
        color: #409eff;
        border:1px solid #b3d8ff;
        border-radius: 4px;
         cursor: pointer;     
    }
    .down-link{
        height: 40px;
        width: 560px;
        margin:0 auto;
        line-height: 40px;
        span,em{
            float: left;
        }
        span{
            color: #6e7274;
            margin-right: 10px;
            
        }
        em{
            border:1px solid #d8dce5;
            width:378px;
            box-sizing: border-box; 
            height: 100%;
            padding-left:14px; 
            border-radius:4px;
            color: #c4bccc;
        }
        b{
            float: right;
            height: 100%;
            width:100px;
            border-radius: 4px;
            line-height: 38px;
            background-color: #409eff; 
            text-align: center;
            color: #fff; 
            cursor: pointer;      
        }
    }
}
</style>