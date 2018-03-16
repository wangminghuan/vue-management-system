<template>
        <section>
        <h4 class="com-item-title">企业名称与logo设置</h4>
        <el-form  label-width="90px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="企业名称" class="user-input-text company-set-name" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
           <el-button type="primary" @click="handleSaveCompanyName('ruleForm')">保存</el-button>
        </el-form-item>
        <el-form-item label="企业LOGO">
            <div class="logo-img"><img v-if="imgDataUrlLogo!=''" :src="imgDataUrlLogo" /><span v-else>暂无图片</span></div>
            <el-button type="primary" @click="handleSelctePic(1)">选择图片</el-button>
            <p class="btm-desc">（建议上传图片尺寸为150*150, 大小不超过500KB）</p>
            </el-form-item>
        </el-form>
        <!-- logo -->
        <vue-crop-upload 
        field="companyLogo"
        @crop-success="(imgDataUrl, field)=>cropSuccess(imgDataUrl, field,1)"
        @crop-upload-success="(jsonData, field)=>cropUploadSuccess(jsonData, field,1)"
        @crop-upload-fail="(status, field)=>cropUploadFail(status, field,1)"
        v-model="showCropLogo"
        :noCircle="hideCircle"
        :width="150"
        :height="150"
        :params="params1"
        :url="uploadUrlLogo"
        :langExt="langZh"
        img-format="png"></vue-crop-upload>
    </section>
</template>

<script>
import vueCropUpload from 'vue-image-crop-upload'
export default {
       components:{
          vueCropUpload
        },
       props:{
         renderData:Object,
         logoPreview:String,
       },
       watch:{
           renderData(val){
                this.ruleForm=val
            },
           logoPreview:function(val){
               if(val.indexOf("_KHFQCBrpXZRtwkSpDwFa")==-1){
                 this.imgDataUrlLogo=val;
               }
              
           },
        },
        data(){
          const __uploadParams1=__finalParams("/api/company/company/dealLogo");
          const __uploadParams2=__finalParams("/api/company/company/dealHeadImg");
          return({
            params1:__uploadParams1,
            params2:__uploadParams2,
            hideCircle:true,
            showCropLogo:false,
            showCropHead:false,
            imgDataUrlLogo:"",
            imgDataUrlHead:"",
            cropDataLogo:"",
            cropDataHead:"",
            uploadUrlLogo:"/api/company/company/dealLogo",
            uploadUrlHead:"/api/company/company/dealHeadImg",
            langZh: {
              hint: '点击，或拖动图片至此处',
              loading: '正在上传……',
              noSupported: '浏览器不支持该功能，请使用IE10以上或其他现在浏览器！',
              success: '上传成功',
              fail: '图片上传失败',
              preview: '图片预览',
              btn: {
                  off: '取消',
                  close: '关闭',
                  back: '上一步',
                  save: '保存'
              },
              error: {
                  onlyImg: '仅限图片格式',
                  outOfSize: '单文件大小不能超过 ',
                  lowestPx: '图片最低像素为（宽*高）：'
              }
            },
            ruleForm:{
               name:''
            },
            rules:{
                name: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            }
          })
        },
    methods: {
       handleSaveCompanyName(formName){
           this.$refs[formName].validate((valid) => {
            if (valid) {
                
                //this.$message('努力提交中~');
                this.$axios.post('/api/company/company/saveCompanyName',{
                    companyId:__golbal_cid,
                    companyName:this.ruleForm.name
                } )
                .then((res)=> {
                    const _data=res.data;
                    if(_data.code==0){
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(_data.message);
                    }
                    })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
       },
        handleSelctePic(type){
            if(type==1){
              this.showCropLogo = !this.showCropLogo;
            }else{
              this.showCropHead = !this.showCropHead;
            }
        },
        cropSuccess(imgDataUrl, field,type){
			type==1?this.cropDataLogo = imgDataUrl: this.cropDataHead=imgDataUrl;
		},
		cropUploadSuccess(jsonData, field,type){
                // console.log('-------- upload success --------');
                // console.log(jsonData);
                if(jsonData.code==0){
                    type==1?this.imgDataUrlLogo = this.cropDataLogo:this.imgDataUrlHead = this.cropDataHead;
                    
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                }else{
                    this.$message.error('抱歉，保存失败，请稍候重试~');
                }
			},
		cropUploadFail(status, field,type){
            // console.log('-------- upload fail --------');
            // console.log(status);
      },
    }
    }
</script>

