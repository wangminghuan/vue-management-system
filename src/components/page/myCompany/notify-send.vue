<template>
<section class="notify-send-wrap">
         <el-form :label-position="labelPosition" label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="发送范围" prop="range">
            <div style="line-height: 40px;margin-bottom:-10px" class="el-input__inner" placeholder="请选择部门、人员" @click="chooseDepartments_adjust = true"><em class="send-input-partment">{{hasSelectDeparts}}</em></div>
            <el-input style="display:none" v-model="ruleForm.range"></el-input>
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
          </el-form-item>
          <el-form-item label="其他">
            <el-checkbox v-model="ruleForm.isTop">置顶应用首页</el-checkbox>
            <p class="btm-tips">（发送范围为所有员工时，才可在应用首页置顶此公告）</p>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="handleClickSubmit('ruleForm')">发送</el-button>
          <el-button type="primary" plain @click="handleClickPreview">预览</el-button>
        </el-form-item>
        </el-form>
          <choose-department-box 
        :chooseDepartments="chooseDepartments_adjust" 
        :defaultCheckArr="defaultCheckedArr" 
        @closeChooseDepartment="closeChooseDepartmentBox_adjust" 
        :chooseData="organData">
        <h4 slot="left-name" class="choose-department-h4">组织结构</h4>
        <h4 slot="right-name" class="choose-department-h4">已选部门</h4>
    </choose-department-box>
          <el-dialog
          title="公告预览"
          :visible.sync="previewDialogVisible"
          width="375px"
          center>
          <div class="preview-container">
            <div class="title">
            <div class="top">{{ruleForm.title}}</div>
            <div class="info"><span style="margin-right:4px">{{ruleForm.author}}</span><span>{{new Date().format("yyyy-MM-dd hh:mm:ss")}}</span></div>
            </div>
            <div class="cont">
              <p class="top">通知正文</p>
              <div v-html="ruleForm.content"></div>
            </div>
          </div>
        </el-dialog>
  </section>
</template>

<script> 
    import {quillEditor} from 'vue-quill-editor';
    import chooseDepartmentBox  from './departmentTree'; 
    export default { 
        components: {  
          quillEditor,
          chooseDepartmentBox
        },  
        props:{
          renderData:Object
        } ,
        data() {  
          const __uploadParams=window.__finalParams("/api/banner/manage/upload",{
           type:"notice",
           seat:"2"
          })
          return { 
            hasSelectSid:[],
            hasSelectDeparts:"请选择部门",
            chooseDepartments_adjust:false,
            organData:[],
            defaultCheckedArr:[],
             previewDialogVisible:false,
             fileList:[],
             updata:__uploadParams,
             selectDialogVisible:false,
             labelPosition:"right",
             partmentTreeList:[],
             hasChooseList:[],
             copySelected:[],
             hasSubmit:false,
             defaultProps: {
                children: 'children',
                label: 'label'
              },
             ruleForm:{
               ncid:"",
               range:"",
               title:"",
               author:"",
               content:"",
               pic:"",
               isTop:false
             },
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
            }, 
          }  
        },  
        methods: { 
          closeChooseDepartmentBox_adjust(...data){
          this.chooseDepartments_adjust=false;
          const select=data[0];
          if(select[0]==false) return;
          this.defaultCheckedArr=select;
         }, 
          onChange(){  
            this.$emit('input', this.ruleForm.content);
          },  
          /*选择上传图片切换*/  
          onFileChange(e){   
            var self=this
            var fileInput=e.target
            if(fileInput.files.length==0){
              return
            }
            this.editor.focus();
            // console.log(fileInput.files[0].size)
            if(fileInput.files[0].size>1024*1024){
              this.$alert('图片不能大于1M', '图片尺寸过大', {
                confirmButtonText: '确定',
                type: 'warning',
              })
            }
            var data=new FormData();
            this.$message('图片上传中...');
            data.append("file",fileInput.files[0]);
            data.append("type","notice");
            data.append("seat","1");
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
            // console.log(this.ruleForm)
            // return false;
             this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.hasSubmit) return;
                this.hasSubmit=true;
                const isSelectedAllCompany=this.hasSelectSid.indexOf("-2")>-1 || this.hasSelectSid.indexOf(__golbal_cid)>-1?true:false;
                this.$axios.post('/api/notice/manage/edit',{
                    ncid:this.ruleForm.ncid,  //是	int	公告id
                    type:isSelectedAllCompany?"3":"1",	//是	int	类型 1部门类型 2个人类型 ,3为整个公司
                    nctype:"1", //类型 1普通公告 2新员工公告
                    groupid:isSelectedAllCompany?__golbal_cid:this.hasSelectSid.join(","),	//否	string	部门id 多个逗号隔开 当type=1时必须
                    title:this.ruleForm.title,	//是	string	标题
                    write:this.ruleForm.author,//	是	string	作者
                    content:this.ruleForm.content,	//是	string	内容
                    // link:this.ruleForm.pic,	//否	string	链接
                    imgUrl:this.ruleForm.pic,
                    istop:this.ruleForm.isTop?1:0, //	否	int	是否置顶
                } )
                .then((res)=> {
                    const _data=res.data;
                    if(_data.code==0){
                        this.$message({
                          message: '恭喜你，发布成功！',
                          type: 'success'
                        });
                        setTimeout(()=>{
                          this.ruleForm={
                          range:"",
                          title:"",
                          author:"",
                          content:"",
                          pic:"",
                          isTop:false
                        };
                        this.fileList=[];
                        this.defaultCheckedArr=[];
                        this.hasSelectSid=[];
                        __vBus.$emit("H_notifyTabIndex",{
                            activeName:"third"
                        })
                        },1000)
                         
                    }else{
                        this.$message.error(_data.message);
                    }
                    setTimeout(() => {
                       this.hasSubmit=false;
                    }, 1000);
                    }).catch((err)=>{
                         this.hasSubmit=false;
                     });
              } else {
                return false;
              }
            });
             
          },
          // 预览按钮
          handleClickPreview(){
            this.previewDialogVisible=true;
          },
        // 上传封面成功逻辑
        uploadBannerSuccess(response, file, fileList){
            // console.log(response)
           if(response.code==0){
             this.ruleForm.pic=response.data.url;
            //  console.log(this.ruleForm.pic)
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
        watch:{
           // 获取部门树
           chooseDepartments_adjust:function(val){
               if(val && this.organData.length==0){
                     this.$axios.post('/api/notice/manage/getTreeByCid')
                    .then((res)=> {
                        const _data=res.data;
                        if(_data.code==0){
                          const origin=_data.data;
                          // 防止出现公司id与第一个部门id相同的情况，公司id统一置为-2
                           if(origin[0]) origin[0].id="-2";
                            this.organData=origin;
                        }
                    })
               }
            },
            defaultCheckedArr(val){
            let __str="请选择部门";
            let __arr=[];
            this.hasSelectSid=[];
            if(val.length>0){
                  val.map((item)=>{
                    __arr.push(item.label.replace(/\(.*\)/g,''));
                    this.hasSelectSid.push(item.id);
                  })
                  
                 __str=__arr.join("；")
                 this.ruleForm.range=__str
            }else{
              this.ruleForm.range=""
            }
            this.hasSelectDeparts=__str;
          },
            renderData(val){
              if(val.zmp_type==5) return ;
              let _range=[];
              this.hasChooseList=val.selected;
              this.hasChooseList.map((item)=>{
               _range.push({
                 id:item.id,
                 label:item.label
               });
               this.hasSelectSid.push(item.id);
              });
              this.defaultCheckedArr=_range;
              // this.ruleForm.range=_range.join(";");
              this.ruleForm.title=val.zmp_title;
              this.ruleForm.author=val.zmp_write;
              this.ruleForm.content=val.zmp_content;
              this.ruleForm.pic=val.zmp_cover;
              this.ruleForm.isTop=val.zmp_isTop==1?true:false;
              this.ruleForm.ncid="";
              if(val.zmp_cover){
                this.fileList=[{
                  name: 'cover.png', 
                  url:val.zmp_cover
                }];
              }
              
            }
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
