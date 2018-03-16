<template>
<section >
    <h4 class="com-item-title">企业启动页设置</h4>
    <el-form label-width="90px" >
        <el-form-item label="启动页">
            <div class="start-img"><img v-if="imgDataUrl!=''" :src="imgDataUrl" /><span v-else>暂无图片</span></div>
            <el-button type="primary" @click="handleSelctePic">选择图片</el-button>
            <el-button type="danger" @click="handleDelectStartPage" plain>清除启动页</el-button>
            <p class="btm-desc">你的企业员工每次启动保世界，都可以看到启动页的图片。</p>
            <p class="btm-desc" style="margin-top:-24px">（上传的图片尺寸建议为640*1136，大小不超过500KB）</p>
        </el-form-item>
         <el-form-item label="启动页链接" class="user-input-text company-set-name">
            <el-input placeholder="请输入链接" v-model="ruleForm.jumpUrl">
               <!-- <template slot="prepend">http://</template> -->
            </el-input>
           <el-button type="primary" @click="handleSaveLink">保存</el-button>
        </el-form-item>
    </el-form>
      <vue-crop-upload 
        field="companyStartImg"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="showCrop"
        :noCircle="hideCircle"
        :width="640"
        :height="1136"
        :params="params"
        :url="uploadUrl"
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
          startPreview:String,
          startUrl:String
        },
        watch:{
           startPreview:function(val){
              if(val.indexOf("_KHFQCBrpXZRtwkSpDwFa")==-1){
                 this.imgDataUrl=val
               }
              
           },
           startUrl:function(val){
             this.ruleForm.jumpUrl=val
           }
        },
        data(){
          const __uploadParams=__finalParams("/api/company/company/dealStartImg");
          return({
            params:__uploadParams,
            showCrop:false,
            hideCircle:true,
            imgDataUrl:"",
            cropData:"",
            uploadUrl:"/api/company/company/dealStartImg",
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
              jumpUrl:"",
            }
          })
        },
    methods: {
      handleSaveLink(){
         //this.$message('努力提交中~');
         this.$axios.post(this.uploadUrl,{
           companyStartImgUrl:this.ruleForm.jumpUrl
         })
           .then((res)=> {
                const _data=res.data;
                if(_data.code==0){
                    this.$message({
                      type: 'success',
                      message: '保存成功!'
                    });
                }else{
                   this.$message.error(_data.message);
                }
              })
      },
      handleSelctePic() {
				this.showCrop = !this.showCrop;
      },
      cropSuccess(imgDataUrl, field){
				this.cropData = imgDataUrl;
			},
			cropUploadSuccess(jsonData, field){
				// console.log('-------- upload success --------');
        // console.log(jsonData);
        if(jsonData.code==0){
          this.imgDataUrl = this.cropData;
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        }else{
            this.$message.error('抱歉，保存失败，请稍候重试~');
        }
			},
			cropUploadFail(status, field){
				// console.log('-------- upload fail --------');
				// console.log(status);
      },
       handleDelectStartPage(){
          this.$confirm('此操作将清除启动页, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(this.uploadUrl,{
              delStartImg:1
          })
           .then((res)=> {
                const _data=res.data;
                if(_data.code==0){
                    this.$message({
                      type: 'success',
                      message: '清除启动图成功!'
                    });
                    this.imgDataUrl="";
                }else{
                   this.$message.error(_data.message);
                }
              })
          
        }).catch(() => {
         
        });
      }

    }
}
</script>
<style lang="scss">

</style>


