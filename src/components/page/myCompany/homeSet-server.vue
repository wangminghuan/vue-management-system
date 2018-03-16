<template>  
        <section>
          <h4 class="com-item-title">企业服务</h4>
          <ul class="company-set-server">
            <li class="clearfix" v-for="(item,index) in serverList.listArr" :key="index">
              <div class="left"><img v-if="item.s_icon!==''" :src="item.s_icon" /><span v-else>暂无图片</span></div>
              <div class="center">
                <h5>{{item.s_name}}</h5>
                <p>{{item.s_describe}}</p>
              </div>
              <el-button class="right" type="primary" @click="handleClickEdit(item,index)">编辑</el-button>
              <el-button class="right" type="primary" @click="handleClickDelect(item,index)">删除</el-button>
            </li>
            <li class="add-server" @click="handleClickAdd"><b></b><i>添加服务</i></li>
          </ul>
          <el-dialog 
          :title="isModify?'修改':'新增'" 
          :visible.sync="dialogFormVisible" 
          @close="handleDialogClose"
          center width="800px">
          <el-form :label-position="labelPosition" label-width="100px" :model="formServer" ref="formServer" :rules="formServerRules">
            <el-form-item label="图片上传" prop="s_icon">
              <div class="server-img" @click="showCropHead=true"><img v-if="imgDataUrlServer!=''" :src="imgDataUrlServer" /><span v-else>暂无图片</span></div>
              <!-- <el-upload
                ref="myupload"
                :action="uploadUrl"
                :data="params"
                list-type="picture-card"
                :limit="1"
                :file-list="fileList"
                :on-exceed="handlePictureOverLimit"
                :on-success="handlePicUploadSucess">
                <i class="el-icon-plus"></i>
              </el-upload> -->
            </el-form-item>
            <el-form-item label="标题" prop="s_name">
              <el-input v-model="formServer.s_name"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="s_describe">
              <el-input v-model="formServer.s_describe"></el-input>
            </el-form-item>
            <el-form-item label="应用列表" prop="s_a_id">
              <el-select style="width:300px" v-model="formServer.s_a_id" placeholder="请选择" :loading="appSelectLoading" >
                <el-option  v-for="(item,index) in appList" :label="item.a_name" :value="item.a_id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务类型" prop="st_id">
              <el-select style="width:300px" v-model="formServer.st_id" placeholder="请选择" :loading="typeSelectLoading"> 
                <el-option v-for="(item,index) in serTypeList" :label="item.st_name" :value="item.st_id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="正文详情" prop="s_introduction">
                <quill-editor v-model="formServer.s_introduction"  
                ref="myTextEditor"
                :class="editorOption.class"  
                :options="editorOption"  
                @change="onChange">
                </quill-editor>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormConfirm('formServer')">确 定</el-button>
          </div>
        </el-dialog>
          <vue-crop-upload 
          :field="fileName"
          @crop-success="cropSuccess"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
          v-model="showCropHead"
          :params="params"
          :noCircle="hideCircle"
          :width="640"
          :height="360"
          :url="uploadUrl"
          :langExt="langZh"
          img-format="png"></vue-crop-upload>
        </section>
</template>

<script>
import {quillEditor} from 'vue-quill-editor';
import vueCropUpload from 'vue-image-crop-upload';
    export default {
      components:{
        quillEditor,
        vueCropUpload
      },
        props:{
          renderData:Object,
        },
        data(){
          const __uploadParams=__finalParams("/api/company/company/dealServiceImg");
          return({
            showCropHead:false,
            imgDataUrlServer:"",
            hideCircle:true,
            fileName:"file",
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
            hasSubmit:false,
            params:__uploadParams,
            uploadUrl:"/api/company/company/dealServiceImg",
            appSelectLoading:true,
            typeSelectLoading:true,
            tempImg:null,
            // fileList:[],
            serverList:[],
            appList:[],//应用列表
            serTypeList:[],//服务类型
            labelPosition:"right",
            dialogFormVisible:false,
            isModify:false,
            formServer:{
              s_icon:"",
              s_name:"",
              s_describe:"",
              s_a_id:"",
              st_id:"",
              s_id:"",
              s_introduction:""
            },
            formServerRules:{
              s_icon: [],
              s_name: [
                    { required: true, message: '请输入服务标题', trigger: 'blur' },
                ],
              s_describe: [
                    { required: true, message: '请输入服务介绍', trigger: 'blur' },
                ],
              s_a_id: [
                    { required: false, message: '请选择应用列表', trigger: 'change' },
                ],
              st_id:[
                    { required: true, message: '请选择服务类型', trigger: 'change' },
                ]
            },
            editorOption: { 
              class:"server-editor-content",
              content: '',
              uploadUrl:"/api/company/company/dealServiceImg",
              placeholder: "请输入内容", 
              modules: {  
                toolbar:[
                        ['bold', 'italic', 'underline'],        // toggled buttons
                        // ['blockquote', 'code-block'],
                        // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered'}],
                        // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        // [{ 'direction': 'rtl' }],                         // text direction
                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        // [{ 'font': [] }],
                        // [{ 'align': [] }],
                        // ['clean']                                         // remove formatting button
                        ['image']
                      ]

              }  
            },   
            modifyIndex:-1
          })
        },
    watch:{
        renderData:function(val){
            this.serverList=val
        },
        dialogFormVisible:function(val){
          if(val && !this.editor){
            setTimeout(()=>{
              // 弹窗弹出的时候获取ref
              if(this.$refs.myTextEditor){
                this.editor=this.$refs.myTextEditor.quill;
                this.$refs.myTextEditor.quill.getModule('toolbar').addHandler('image', this.imgClick)
              }
            },1000)
          }
        }
  	},
    methods: {
      renderServerList(){
        this.$axios.post('/api/company/company/getCompanyInfo',{
          companyId:__golbal_cid
       } )
       .then((res)=> {
        const _data=res.data;
        if(_data.code==0){
          const _res=_data.data||{};
          // 服务标签
          this.serverList.listArr=_res.server.listArr||[];
        }
      })
      },
      /*选择上传图片切换*/  
          onFileChange(e){  
            var self=this;  
            var fileInput=e.target  
            if(fileInput.files.length==0){  
              return  
            }  
            this.editor.focus();
            if(fileInput.files[0].size>1024*1024){  
              self.$alert('图片不能大于1M', '图片尺寸过大', {  
                confirmButtonText: '确定',  
                type: 'warning',  
              })  
            }  
            var data=new FormData();  
            data.append("file",fileInput.files[0]);
            data.append("serviceImgType","detail");
            this.$message('图片上传中...');
            this.$axios.post(this.editorOption.uploadUrl,data).then((res)=>{
              if(res.data.code==0) {
                this.editor.insertEmbed(this.editor.getSelection().index, 'image', res.data.data.url)
              }else{
                this.$message({
                message: '上传失败',
                type: 'warning'
              });
              }
            }).catch((err)=>{
               this.$message({
                message: '上传失败',
                type: 'warning'
              });
            });
          },  
          /*点击上传图片按钮*/  
          imgClick() {  
            if(!this.editorOption.uploadUrl){  
              console.log('no editor editorOption.uploadUrl')  
              return;  
            }  
            /*内存创建input file*/  
            var input=document.createElement('input')  
            input.type='file'  
            input.name=this.fileName  
            input.accept='image/jpeg,image/png,image/jpg,image/gif'  
            input.onchange=this.onFileChange  
            input.click()  
          },
      onChange(){  
            this.$emit('input', this.formServer.content);
          }, 
      handleDialogClose(){
        //  弹窗关闭时的回调。清除上传图片列表，清除缓存图片
          // this.$refs.myupload.clearFiles();
          // this.fileList=[];
          this.tempImg=null;
          this.imgDataUrlServer="";
          console.log("this.imgDataUrlServer"+this.imgDataUrlServer)
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        // this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handlePictureOverLimit(){
        // 文件超过限制
        this.$message({
          message: '一个服务只能上传一张图片',
          type: 'warning'
        });
         this.$message.error('抱歉，只能上传一张图片~');
      },
      // 图片上传成功
      handlePicUploadSucess(res){
        this.tempImg=res.data;
      },
      // 编辑服务
      handleClickEdit(item,index){
      //  this.formServerRules.s_icon.splice(0,1,{ required: false, message: '请上传封面图片', trigger: 'change' });
       this.modifyIndex=index;
       this.formServer={...item};
      //  this.fileList=[{name: 'cover.jpg', url: item.s_icon}];
       this.imgDataUrlServer=item.s_icon;
       this.isModify=true;
       this.dialogFormVisible=true;
      },
      // 删除服务
      handleClickDelect(item,index){
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
           //this.$message('努力提交中~');
           this.$axios.post('/api/company/services/del',{
              s_id:item.s_id
          } )
          .then((res)=> {
              const _data=res.data;
              if(_data.code==0){
                  this.$message({
                      message: '删除成功',
                      type: 'success'
                  });
                  this.serverList.listArr.splice(index,1)
              }else{
                  this.$message.error(_data.message);
              }
              })
        })
      },
      // 新增按钮
      handleClickAdd(){
        if(this.serverList.listArr.length>7){
             this.$message({
              message: '无法添加，已超出最大数量限制！',
              type: 'warning'
            });
          return false;
        }
        // this.formServerRules.s_icon.splice(0,1,{ required: true, message: '请上传封面图片', trigger: 'change' });
         this.formServer={
              s_icon:"",
              s_name:"",
              s_describe:"",
              s_a_id:"",
              st_id:"",
              s_id:"",
              s_introduction:""
            };
       this.isModify=false;
       this.dialogFormVisible=true;
      },
      dialogFormConfirm(formName){
          const tempUrl={...this.tempImg}
          if(tempUrl.data_url){
            this.formServer.s_icon=tempUrl.data_url
          }
        this.$refs[formName].validate((valid) => {
            if (valid) {
               if(this.hasSubmit) return;
               this.hasSubmit=true;
               //this.$message('努力提交中~');
          
          this.$axios.post('/api/company/services/index',{
              c_id:__golbal_cid,
              s_name:this.formServer.s_name,
              s_icon:tempUrl.data_url,
              s_describe:this.formServer.s_describe,
              s_a_id:this.formServer.s_a_id,
              st_id:this.formServer.st_id,
              s_id:this.formServer.s_id,
              s_introduction:this.formServer.s_introduction
          } )
          .then((res)=> {
              const _data=res.data;
              if(_data.code==0){
                  this.formServer.s_icon=tempUrl.url?tempUrl.url:this.formServer.s_icon;
                  this.$message({
                      message: '保存成功',
                      type: 'success'
                  });
                   if(this.isModify){
                    // 注意此处，一定要用数组方法，否则无法触发视图更新
                     this.serverList.listArr.splice(this.modifyIndex,1,this.formServer);      
                  }else{
                     this.formServer.s_id= typeof _data.data!="undefined" && _data.data instanceof Array &&_data.data[0]? _data.data[0]:"";
                     this.serverList.listArr.push(this.formServer);
                  }
              }else{
                  this.$message.error(_data.message);
              }
              setTimeout(() => {
                    this.hasSubmit=false;
                  }, 1000);
              }).catch(()=>{
                  this.hasSubmit=false;
              })
        
           this.dialogFormVisible=false;
        } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
    cropSuccess(imgDataUrl, field){
      // console.log('-------- cropSuccess success --------');
      // this.imgDataUrlServer=imgDataUrl;
		},
		cropUploadSuccess(jsonData, field){
                console.log('-------- upload success --------');
                console.log(jsonData);
                if(jsonData.code==0){ 
                    this.imgDataUrlServer=jsonData.data.url;
                    this.tempImg=jsonData.data;
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
    },
    created(){
      // 弹窗服务类型列表数据
      this.$axios.post('/api/company/serviceType/lists').then((res)=> {
              this.typeSelectLoading=false;
                const _data=res.data;
                if(_data.code==0){
                    this.serTypeList=_data.data.listArr||[];
                }
      })
      // 弹窗应用列表数据
      this.$axios.post('/api/company/company/appLists').then((res)=> {
              this.appSelectLoading=false;
                const _data=res.data;
                if(_data.code==0){
                    this.appList=_data.data.listArr||[];
                }
      })
    },
    }
</script>
<style lang="scss">
.set-dialog-server-img{
  height: 100px;
  width: 100px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 4px;
  span{
    width: 99px;
    line-height: 98px;
    text-align: center;
    color:#e5e5e5;
    display: block;
    border-radius: 4px;
    border: 1px solid #c9c9c9;
  }
  
}
.company-set-server{
    padding-left: 104px;
    li {
      margin-bottom: 38px;
    }

    .left,
    .center,
    .right {
      float: left;
    }
    .left,
    .add-server {
      overflow:hidden;
      border-radius: 4px;
      span{
        color:#e5e5e5;
        width: 100%;
        text-align: center;
        display: block;
        border-radius: 4px;
        font-size: 12px;
        border: 1px solid #c9c9c9;
      }
    }
    .left{
      width: 106px;
      height: 106px;
      position: relative;
      border-radius: 0;
      span{
        line-height: 106px;
        // height: 106px;
      }
      // img{
      //   // display: block;
      //   // position: absolute;
      //   // width: 100%;
      //   // top:50%;
      //   // left:0;
      //   // transform: translateY(-50%);
      // }
    }
    .add-server {
      border: 1px solid #c9c9c9;
      background-color: #fff;
      width: 106px;
      height: 106px;
      span{
        line-height: 104px;
        height: 104px;
      }
      b {
        display: block;
        width: 40px;
        height: 40px;
        margin: 0 auto;
        background-image: url("../../../../static/img/home-icons.png");
        background-repeat: no-repeat;
        background-position-x: 0px;
        background-position-y: -1076px;
        margin-top: 20px;
      }
      i {
        color: #e5e5e5;
        font-size: 12px;
        text-align: center;
        display: block;
        line-height: 30px;
      }
    }
    .center {
      width: 326px;
      padding: 0 20px;

      h5 {
        color: #555;
        font-size: 16px;
        margin-bottom: 10px;
        margin-top: -2px;
      }
      p {
        color: #878d99;
        font-size: 14px;
        line-height: 26px;
        height: 75px;
        overflow: hidden;
      }
    }
    .right {
      margin-top: 20px;
      margin-left: 20px;
    }
    
}
.company-set-wrap .server-img{
      width: 200px;
      height: 113px;
      line-height: 113px;
      border: 1px solid #dfe4ed;
      color: #dfe4ed;
      border-radius: 2px;
      text-align: center;
       overflow: hidden;
    
    }
</style>