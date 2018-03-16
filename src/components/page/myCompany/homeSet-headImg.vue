<template>
        <section>
        <h4 class="com-item-title">头部配图</h4>
        <el-form  label-width="90px">
            <el-form-item label="">
            <div class="head-img"><img v-if="imgDataUrlHead!=''" :src="imgDataUrlHead" /><span v-else>暂无图片</span></div>
            <el-button type="primary" @click="handleSelctePic(2)">选择图片</el-button>
            <p class="btm-desc">（建议上传图片尺寸为640*320, 大小不超过500KB）</p>
            </el-form-item>
        </el-form>
         <!-- head -->
        <vue-crop-upload 
        field="companyHeadImg"
        @crop-success="(imgDataUrl, field)=>cropSuccess(imgDataUrl, field,2)"
        @crop-upload-success="(jsonData, field)=>cropUploadSuccess(jsonData, field,2)"
        @crop-upload-fail="(status, field)=>cropUploadFail(status, field,2)"
        v-model="showCropHead"
        :noCircle="hideCircle"
        :params="params2"
        :width="640"
        :height="320"
        :url="uploadUrlHead"
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
         headPreview:String,
       },
       watch:{
           headPreview:function(val){
               if(val.indexOf("_KHFQCBrpXZRtwkSpDwFa")==-1){
                 this.imgDataUrlHead=val
               }
           }
        },
        data(){
          const __uploadParams2=__finalParams("/api/company/company/dealHeadImg");
          return({
            params2:__uploadParams2,
            hideCircle:true,
            showCropHead:false,
            imgDataUrlHead:"",
            cropDataHead:"",
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
            }
          })
        },
    methods: {

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

