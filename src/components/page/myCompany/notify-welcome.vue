<template>
<section class="notify-send-wrap">
         <el-form :label-position="labelPosition" label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="发送范围">
            <el-input v-model="ruleForm.range" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="ruleForm.author"></el-input>
          </el-form-item>
           <el-form-item label="正文" prop="content">
              <quill-editor v-model="ruleForm.content"  
                ref="myTextEditor"  
                :options="editorOption"  
                @change="onChange">  
        </quill-editor> 
          </el-form-item>
          <el-form-item label="封面图片">
            <el-upload
              action="/api/banner/manage/upload"
              :data="updata"
              :on-success="uploadBannerSuccess"
              :on-exceed="overLimited"
              :limit="1"
              :file-list="fileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">（推荐尺寸640*360；支持.jpg  .jpeg  .bmp  .gif  .png类型文件，5M以内）</div>
          </el-upload>
            <!-- <el-input v-model="ruleForm.pic"></el-input>
            <p class="btm-tips">（推荐尺寸640*360；支持.jpg  .jpeg  .bmp  .gif  .png类型文件，5M以内）</p> -->
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="handleClickSubmit('ruleForm')">保存</el-button>
        </el-form-item>
        </el-form>
  </section>
</template>

<script>  
    import {quillEditor} from 'vue-quill-editor';
    export default { 
        components: {  
          quillEditor  
        }, 
        props:{
          renderData:Object
        },  
        data() {  
          const __uploadParams=__finalParams("/api/banner/manage/upload",{
           type:"notice",
           seat:"2"
          })
          return { 
             fileList:[],
             updata:__uploadParams,
             labelPosition:"right",
             ruleForm:{
               range:"新入职员工",
               title:"欢迎加入我们的大家庭",
               author:"",
               content:"",
               pic:"",
             } ,
             rules: {
                range: [
                  { required: true, message: '请选择发送范围', }
                ],
                title: [
                  { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                content: [
                  { required: true, message: '请输入正文', trigger: 'blur' },
                ]
              },
              editorOption: { 
              content: '',
              uploadUrl:'/api/banner/manage/upload',
              placeholder: "请输入内容", 
              modules: {  
                toolbar:[
                        ['bold', 'italic', 'underline'],        // toggled buttons
                        // ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        // [{ 'direction': 'rtl' }],                         // text direction
                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        // [{ 'font': [] }],
                        [{ 'align': [] }],
                        // ['clean']                                         // remove formatting button
                        ['image']
                      ]

              }
            }
          }  
        }, 
        watch:{
            renderData(val){
              this.ruleForm.range="新入职员工";
              this.ruleForm.title=val.zmp_title;
              this.ruleForm.author=val.zmp_write;
              this.ruleForm.content=val.zmp_content;
              this.ruleForm.pic=val.zmp_cover;
              this.ruleForm.ncid="";
              if(val.zmp_cover){
                  this.fileList=[{
                    name: 'cover.png', 
                    url:val.zmp_cover
                  }];
                }
            }
        },
        methods: {
          onChange(){  
            this.$emit('input', this.ruleForm.content);
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
            data.append("type","notice");
            data.append("seat","1");
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
           // 发布公告的确认按钮
          handleClickSubmit(formName){
             this.$refs[formName].validate((valid) => {
              if (valid) {
                // console.log(this.ruleForm)
                //this.$message('努力提交中~');
                this.$axios.post('/api/notice/manage/edit',{
                    ncid:"",  //是	int	公告id
                    type:"2",	//是	int	类型 1部门类型 2个人类型
                    nctype:"2", //类型 1普通公告 2新员工公告
                    // groupid:this.hasChooseGroupId.join(","),	//否	string	部门id 多个逗号隔开 当type=1时必须
                    title:this.ruleForm.title,	//是	string	标题
                    write:this.ruleForm.author,//	是	string	作者
                    content:this.ruleForm.content,	//是	string	内容
                    // link:this.ruleForm.pic,	//否	string	链接
                    imgUrl:this.ruleForm.pic,
                    // istop:this.ruleForm.isTop?1:0, //	否	int	是否置顶
                } )
                .then((res)=> {
                    const _data=res.data;
                    // console.log(_data);
                    if(_data.code==0){
                        this.$message({
                          message: '恭喜你，保存成功！',
                          type: 'success'
                        });
                        // this.ruleForm={
                        //    range:"新入职员工",
                        //   title:"欢迎加入我们的大家庭",
                        //   author:"",
                        //   content:"",
                        //   pic:"",
                        //   isTop:""
                        // };
                        // this.fileList=[];
                        //  __vBus.$emit("H_notifyTabIndex",{
                        //     activeName:"third"
                        // })
                      }else{
                          this.$message.error(_data.message);
                      }
                    })

              } else {
                return false;
              }
            });
             
          },
          // // 预览按钮
          // handleClickPreview(){
          //     this.previewDialogVisible=true;
          // },
      // 上传封面成功逻辑
          uploadBannerSuccess(response, file, fileList){
              // console.log(response)
            if(response.code==0){
              this.ruleForm.pic=response.data.url;
              // console.log(this.ruleForm.pic)
            }
          },
          // 上传封面超过限制按钮
          overLimited(){
            this.$message({
              message: '一次只能上传一张图片！',
              type: 'warning'
            });
          },
        },  
        computed:{  
          editor() {  
            return this.$refs.myTextEditor.quill  
          }  
        },
        mounted(){
          this.$refs.myTextEditor.quill.getModule('toolbar').addHandler('image', this.imgClick)
        }
    
      }  
      
</script>
