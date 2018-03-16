<template>
  <div >
     <div class="title-wrap">
        <p class="com-item-title">指标规则设置</p> 
        <div class="title-rt">
            <el-button type="primary" plain  @click="handleGoback">取消</el-button>
            <el-button type="primary" @click="handleSve">保存</el-button>
        </div>
     </div>
     <div style="padding: 0 26px;min-width:850px">
            <ul class="perform-rule-wrap">
                <li class="clearfix">
                    <div class="fl">业绩统计限制</div>
                    <div class="fr"><span>FYC≥</span><input class="table-input" v-model="form.i_r_fyc" placeholder=""/><em>元</em></div>
                </li>
                <li class="clearfix">
                    <div class="fl">件数统计限制</div>
                    <div class="fr"><span>FYC≥</span><input class="table-input" v-model="form.i_r_num" placeholder=""/><em>件</em></div>
                </li> 
            </ul>
     </div>     
  </div>
</template>
<script>
export default {
  data(){
      return {
          form:{},
          hasSubmit:false
      }
  },
  methods:{
      handleGoback(){
          this.$router.push("/performance_check")
      },
      handleSve(){
        if(this.hasSubmit) return;
        this.hasSubmit=true;
        this.$axios.post("/api/performance/performancemanager/updateIndicatorRule",{
            fyc:this.form.i_r_fyc||"0",
            num:this.form.i_r_num||"0"
        })
          .then((res)=>{
            const _data = res.data;
            if (_data.code == 0) {
               this.$message({
                    message: '保存成功！',
                    type: 'success'
                });
                setTimeout(()=>{
                  this.$router.push("/performance_check")
                },1000)
            }else{
                 this.$message.error(_data.message);
            }
            this.hasSubmit=false;
          }).catch(()=>{
              this.hasSubmit=false;
          })
      },
      getRulesData(){
          this.$axios.post("/api/performance/performancemanager/getIndicatorRule")
          .then((res)=>{
            const _data = res.data;
            if (_data.code == 0) {
             this.form=_data.data;
            }
          })
      }
  },
  created(){
      this.getRulesData()
  }
}
</script>
<style lang="scss">
.perform-rule-wrap{
  li{
      height: 50px;
      line-height: 50px;
      transition: background-color .25s ease;
      border: 1px solid #e6ebf5;
    //   padding: 12px 0;
       text-align: center;
        min-width: 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        font-size: 14px;
        color: #5a5e66;
        span{
         display: inline-block;
        }
  }
  li:last-child{
      border-top:none;
  }
  .fr{
      float:right;
      width: 50%;
      height: 50px;
      display: block;
      border-right: 1px solid #e6ebf5;
  }
  .fl{
      float: left;
      width: 50%;
      display: block;
      border-right: 1px solid #e6ebf5;
  }
}
</style>
