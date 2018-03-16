<template>
  <div class="company-carousel-wrap">
    <h4 class="com-item-title">工作台轮播图</h4>
    <div class="form-wrap">
    <el-table
    v-loading="loading"
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      label="序号"
      width="100">
      <template slot-scope="scope">
       <div>{{scope.$index+1}}</div>
      </template>
    </el-table-column>
    <el-table-column
      prop="bm_title"
      label="标题"
      width="180">
    </el-table-column>
    <el-table-column
      label="图片"
      width="200">
      <template slot-scope="scope">
       <img :src="scope.row.bm_imgUrl" width="200"/>
      </template>
    </el-table-column>
    <el-table-column
      prop="bm_link"
      label="链接">
    </el-table-column>
    <el-table-column
      prop="bm_start_time"
      label="开始时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="bm_end_time"
      label="结束时间"
      width="180">
    </el-table-column>
    <el-table-column
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button @click="handleClickModify(scope)" type="text" size="small">修改</el-button>
        <el-button @click="handleClickDelect(scope)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <section class="pagination-wrap clearfix">
    <el-button type="primary" @click="handleClickAdd">新增</el-button>
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="5"
      layout="total, sizes, prev, pager, next"
      :total="100">
    </el-pagination> -->
    </section>
    </div>
    <el-dialog
      @close="editDialogClose"
      :title="isAddDialog?'新建':'修改'"
      :visible.sync="modifyDialogVisible"
      width="560px"
      center>
      <el-form :label-position="labelPosition" label-width="100px" :model="nowSelectedData" ref="nowSelectedData" :rules="selectedDataRules">
        <el-form-item label="标题" prop="bm_title">
          <el-input v-model="nowSelectedData.bm_title"></el-input>
        </el-form-item>
        <el-form-item label="banner上传" prop="bm_imgUrl">
          <!-- <el-input v-model="nowSelectedData.pic"></el-input> -->
          <el-upload
          ref="upload"
          :data="params"
          action="/api/banner/manage/upload"
          :on-success="uploadBannerSuccess"
          :on-exceed="overLimited"
          :limit="1"
          list-type="picture"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </el-form-item>
        <el-form-item label="添加链接" prop="bm_link">
          <el-input v-model="nowSelectedData.bm_link"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="bm_start_time">
          <el-date-picker
            v-model="nowSelectedData.bm_start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="bm_end_time">
          <el-date-picker
            v-model="nowSelectedData.bm_end_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClickConfirm('nowSelectedData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    const __uploadParams=__finalParams("/api/banner/manage/upload",{type:"banner"});
    return {
      params:__uploadParams,
      fileList:[],
      hasSubmit:false,
      currentPage:1,
      loading: true,
      modifyDialogVisible: false,
      // confirmDialogVisible: false,
      isAddDialog:false,
      tableData: [],
      labelPosition: 'right',
      tempUploadImg:"",
      nowSelectedData: {
          bm_id: "",
          bm_title: "",
          bm_imgUrl: "",
          bm_link: "",
          bm_start_time:'',
          bm_end_time:''
        },
        selectedDataRules:{
            bm_title: [
                { required: false, message: '请输入标题', trigger: 'blur' }
            ],
             bm_imgUrl: [],
             bm_link: [
                { required: false, message: '请输入链接', trigger: 'blur' }
            ],
             bm_start_time: [
                { required: true, message: '请选择开始时间', trigger: 'blur' }
            ],
             bm_end_time: [
                { required: true, message: '请选择结束时间', trigger: 'blur' }
            ],
        },
        nowSelectedIndex:-1
    }
  },
  methods:{
    handleClickModify(scope) {
       this.selectedDataRules.bm_imgUrl.splice(0,1,{ required: false, message: '请上传图片', trigger: 'change' });
        this.nowSelectedIndex=scope.$index;
        this.nowSelectedData={...scope.row};
        this.fileList=[{name: 'cover.jpg', url: scope.row.bm_imgUrl}];
        this.isAddDialog=false;
        this.modifyDialogVisible = true;
        // console.log(this.nowSelectedData)
      },
      handleClickDelect(scope){
        this.nowSelectedIndex=scope.$index;
        this.nowSelectedData=scope.row;
        // this.confirmDialogVisible = true;
        this.$confirm('此操作将永久删除该轮播, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleDelectConfirm();
          })

      },
      handleClickConfirm(formName){
        console.log(this.hasSubmit)
        if(this.tempUploadImg){
            this.nowSelectedData.bm_imgUrl=this.tempUploadImg
        }
        this.$refs[formName].validate((valid) => {
         if (valid) {
             if(this.hasSubmit) return;
             this.hasSubmit=true;
            //新增，修改提交
            // this.nowSelectedData.bm_imgUrl=this.tempUploadImg!==""?this.tempUploadImg:this.nowSelectedData.bm_imgUrl;
            this.$axios.post('/api/banner/manage/edit',{
                bmid:this.nowSelectedData.bm_id,
                type:"5",
                link:this.nowSelectedData.bm_link,
                startTime:this.nowSelectedData.bm_start_time,
                endTime:this.nowSelectedData.bm_end_time,
                title:this.nowSelectedData.bm_title,
                burl:this.nowSelectedData.bm_imgUrl,
            })
            .then((res)=> {
              const _data=res.data;
              if(_data.code==0){
                  this.modifyDialogVisible = false;
                  this.renderTable();
                  this.$message({
                    message: '恭喜您'+(this.isAddDialog?'新增':'修改')+'成功！',
                    type: 'scuuess'
                  });
              }else{
                this.$message.error(_data.message);
              }
              setTimeout(() => {
                    this.hasSubmit=false;
                  }, 1000); 
            }).catch(()=>{
              this.hasSubmit=false;
            })
         }else{
             console.log('error submit!!');
             return false;
          }
      })
      },
      handleDelectConfirm(){
        this.$axios.post('/api/banner/manage/del',{
           bmid:this.nowSelectedData.bm_id
        })
          .then((res)=> {
            const _data=res.data;
            if(_data.code==0){
                this.$message({
                  message: '删除成功！',
                  type: 'scuuess'
                });
                this.tableData.splice(this.nowSelectedIndex,1);
            }else{
              this.$message.error(_data.message);
            }
          })
        
        // this.confirmDialogVisible = false;
      },
      handleClickAdd(){
        if(this.tableData.length>2){
             this.$message({
              message: '无法添加，已超出最大数量限制！',
              type: 'warning'
            });
          return false;
        }
        this.selectedDataRules.bm_imgUrl.splice(0,1,{ required: true, message: '请上传图片', trigger: 'change'})
        this.nowSelectedData={};
        this.isAddDialog=true;
        this.modifyDialogVisible=true;
        
      },
     uploadBannerSuccess(response, file, fileList){
       this.tempUploadImg=response.data.url;
     },
     overLimited(){
       this.$message({
          message: '一次只能上传一张图片！',
          type: 'warning'
        });
     },
     editDialogClose(){
      //  弹窗关闭时的回调。清除上传图片列表，清除缓存图片
       this.$refs.upload.clearFiles();
       this.tempUploadImg=null;
       this.fileList=[];
     },
     renderTable(){
       this.$axios.post('/api/banner/manage/lists',{
          type:"5"
        } )
          .then((res)=> {
            const _data=res.data;
            if(_data.code==0){
                this.tableData=_data.data;
            }
            this.loading=false;
          }).catch((err)=>{
            // console.log(err);
            //this.$message.error('抱歉，网络连接异常，请稍候重试~');
            this.loading=false;
          });
     }
  },
  created(){
    this.renderTable();
  }
}
</script>
