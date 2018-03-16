<template>
      <div class="company-set-wrap">
         <setting-logo 
         :logoPreview="logoPreview" 
         :headPreview="headPreview" 
         :renderData="logoData"></setting-logo> 
         <setting-detail 
         :renderData="detailData"></setting-detail>
         <setting-start 
         :startPreview="startPreview"
         :startUrl="startUrl"
         ></setting-start>
			</div>
</template>
<script>
import settingLogo from "./setting-logo.vue";
import settingStart from "./setting-start.vue";
import settingDetail from "./setting-detail.vue";

// import vueCropper from 'vue-cropper';
export default {
        components:{
          settingLogo,
          settingStart,
          settingDetail,
        },
        data(){
          return({
              fullscreenLoading: true,
              logoData:{},
              detailData:{},
              startData:{},
              startPreview:"",
              logoPreview:"",
              headPreview:"",
              startUrl:"",
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
          this.logoData={
             name:_res.c_name,
          };
          this.startData=_res.startImg;
          // 企业详细信息
          this.detailData={
            location:{
                prov:_res.c_province,
                city:_res.c_city,
                region:_res.c_area
            },
            adress: _res.c_address,
            type: _res.company_type,
            cname:_res.belongInsuranceCompanyMsg,
            c_nid:_res.c_belongInsuranceCompany,
            desc: _res.c_introduce,
            c_type:_res.c_type
          };
          // 启动图：
          this.startPreview=_res.c_start_img;
          this.startUrl=_res.c_start_url;
          // logo图
          this.logoPreview=_res.c_logo,
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
  .area-select .el-select:first-child {
    margin-left: 0;
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
  .start-img,
  .logo-img {
    border: 1px solid #dfe4ed;
    color: #dfe4ed;
    border-radius: 2px;
    text-align: center;
    margin-bottom: 12px;
    overflow: hidden;
  }
  .start-img {
    width: 132px;
    height: 176px;
    line-height: 176px;
  }
  .logo-img {
    width: 110px;
    height: 110px;
    line-height: 110px;
  }
  .company-set-name{
    position: relative;
    input{
      width: 420px;
    }
    .el-button {
      position: absolute;
      top: 0;
      left: 450px;
    }
  }
  .btm-desc {
    white-space: nowrap;
    color: #878d99;
    font-size: 12px;
  }
  .city-item{
     width: 160px;
     margin-right: 10px;
    }
    .city-item:last-child{
      margin-right: 0
    }
}
</style>

