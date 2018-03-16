<template>
  <div class="company-set-wrap">
    <home-set-head-img :headPreview="headPreview"></home-set-head-img>
    <home-set-tag :renderData="tagData"></home-set-tag>
    <home-set-server :renderData="serverData"></home-set-server>
    <home-set-tel :renderData="telData"></home-set-tel>
  </div>
</template>
<script>
import homeSetTag from "./homeSet-tag.vue";
import homeSetServer from "./homeSet-server";
import homeSetTel from "./homeSet-tel.vue";
import homeSetHeadImg from "./homeSet-headImg";
export default {
  components:{
          homeSetServer,
          homeSetTag,
          homeSetTel,
          homeSetHeadImg
        },
    data(){
          return({
              fullscreenLoading: true,
              tagData:{},
              serverData:{},
              telData:{},
              headPreview:"",
          })
    },
     mounted(){
    // 获取企业初始化数据
    this.$axios.post('/api/company/company/getCompanyInfo',{
      companyId:__golbal_cid
    } )
      .then((res)=> {
        const _data=res.data;
        if(_data.code==0){
          const _res=_data.data||{};

          // 手机号
          this.telData={
            tel:_res.c_phone
          };
          // 业务标签
          this.tagData={
            sysTag:_res.companySysTag,
            privateTag:_res.companyPrivateTag
          };
          // 服务标签
          this.serverData={
            listArr:_res.server.listArr||[],
            totalNum:parseInt(_res.server.totalNum)
          }
          // 头部配图
          this.headPreview=_res.c_head_img
        }
        this.fullscreenLoading=false;
      })
      .catch((err)=>{
        console.log(err);
        this.fullscreenLoading=false;
      });
  }
}
</script>

<style lang="scss">
.company-set-wrap {
  color: #353535;
  font-size: 16px;
  .el-form {
    padding-left: 14px;
  }
  .form-name .el-form-item__content {
    width: 320px;
  }
  .user-input-text {
    input,
    textarea {
      width: 509px;
    }
    textarea {
      height: 100px;
      resize: none;
    }
  }
  .head-img {
    border: 1px solid #dfe4ed;
    color: #dfe4ed;
    border-radius: 2px;
    text-align: center;
    margin-bottom: 12px;
    overflow: hidden;
    width: 325px;
    height: 163px;
    line-height: 163px;
  }
  .server-img {
      border: 1px solid #dfe4ed;
      color: #dfe4ed;
      border-radius: 2px;
      text-align: center;
      margin-bottom: 12px;
      overflow: hidden;
      width: 170px;
      height: 112px;
      line-height: 112px;
   }
  .btm-desc {
    white-space: nowrap;
    color: #878d99;
    font-size: 12px;
  }
  .server-editor-content{
    .ql-container {
    height: 200px;
    strong,b {
      font-weight: bold;
    }
    i,em,address,b {
      font-style: italic;
    }
  }
  .ql-picker{
       height: auto;
    }
  } }
</style>
</style>
