<template>
  <div class="company-notify-wrap">
  <h4 class="com-item-title">通知公告</h4>
  <div class="form-wrap">
  <el-tabs v-model="activeName" type="card" >
    <el-tab-pane label="发公告" name="first">
         <notify-send :renderData="sendNotifyData"></notify-send>
    </el-tab-pane>
    <el-tab-pane label="新员工欢迎公告" name="second">
        <notify-Welcome :renderData="welcomeNotifyData"></notify-Welcome>
    </el-tab-pane>
    <el-tab-pane label="历史公告" name="third">
       <section class="third-top">
          <span class="sendtime">发送时间</span>
          <el-date-picker
            v-model="historyTimePick.start"
            value-format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker>
          <el-date-picker
            v-model="historyTimePick.end"
            value-format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择结束时间">
          </el-date-picker>
          <!-- <el-date-picker
          class="picker"
          v-model="historyTimePick"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker> -->
        <el-button type="primary" @click="handleSearchHistory">搜索</el-button>
       </section>
          <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="zmp_id"
            label="序号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zmp_createTime"
            label="发送时间"
            width="200">
          </el-table-column>
          <el-table-column
            prop="zmp_title"
            label="通知标题">
            <template slot-scope="scope">
              <div class="perview-info" @click="hanldeShowDetail(scope.row)">{{scope.row.zmp_title}}</div>
           </template>
          </el-table-column>
          <el-table-column
            prop="zmp_write"
            label="发送人"
            width="200">
          </el-table-column>
          <el-table-column
            label="状态"
            width="180">
            <template slot-scope="scope">
              <div class="readnums" @click="hanldeShowReadInfo(scope.row)">
              <span>已读{{scope.row.sum_see}}</span>
              <span>未读{{scope.row.sum_see_no}}</span>
              </div>
           </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button @click="handleClickCopy(scope.row)" type="text" size="small">复制</el-button>
              <el-button v-if="scope.row.zmp_isTop==1" class="dark" @click="handleCancelUp(scope.row)" type="text" size="small">取消置顶</el-button>
              <el-button v-else class="light" @click="handleSetUp(scope.row)" type="text" size="small">设为置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
        <section class="pagination-wrap clearfix">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="pageCount">
          </el-pagination>
    </section>
    </el-tab-pane>
  </el-tabs>
  </div>
   <el-dialog
    title="已读未读人数详情"
    :visible.sync="infoDialogVisible"
    width="450px"
    center>
    <div class="info-dialog-content">
      <section class="top">
        <h5>未读{{unReadObj.noseeNum}}人</h5>
        <ul class="clearfix">
          <li v-for="(item,index) in unReadObj.noseeuidList" :key="index">
            <img :src="item.avatar" />
            <span>{{item.name}}</span>
          </li>
        </ul>
      </section>
      <section class="btm">
        <h5>已读{{hasReadObj.seeNum}}人</h5>
        <ul class="clearfix">
          <li v-for="(item,index) in hasReadObj.seeuidList" :key="index">
            <img :src="item.avatar" />
            <span>{{item.name}}</span>
          </li>
        </ul>
      </section>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="infoDialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog
    title="公告预览"
    :visible.sync="previewDialogVisible"
    width="375px"
    center>
    <div class="preview-container">
      <div class="title">
      <div class="top">{{perviewData.zmp_title}}</div>
      <div class="info"><span style="margin-right:4px">{{perviewData.zmp_write}}</span><span>{{perviewData.zmp_createTime}}</span></div>
      </div>
      <div class="cont">
        <p class="top">通知正文</p>
        <div v-html="perviewData.zmp_content"></div>
      </div>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import notifySend from "./notify-send";
import notifyWelcome from "./notify-welcome";
export default {
  components: {
    notifySend,
    notifyWelcome
  },
  data() {
    return {
      previewDialogVisible:false,
      _content: "",
      activeName: "first",
      labelPosition: "right",
      historyTimePick:{
        start:"",
        end:""
      },
      perviewData:{},
      currentPage:1,
      pageCount:0,
      pageSize:10,
      tableData: [],
      nowSelectedIndex: -1,
      sendNotifyData:{},
      welcomeNotifyData:{},
      infoDialogVisible:false,
      unReadObj:{},//未读对象
      hasReadObj:{},//已读对象
    };
  },
  watch:{
      activeName:function(val){
         if(val==="third"){
            this.renderTable();
         }else if(val==="second"){
            // 获取新员工公告模板
             this.$axios.post('/api/notice/manage/getNoticeBycid')
                .then((res)=> {
                  const _data=res.data;
                  if(_data.code==0){
                     this.welcomeNotifyData= _data.data instanceof Array?{}:_data.data;
                  }else{
                     this.$message.error(_data.message);
                  }
                });
            
         }
      }
  },
  methods: {
    // 标题点击预览
    hanldeShowDetail(row){
       this.previewDialogVisible=true;
       this.perviewData=row;
    },
    hanldeShowReadInfo(row){
      // console.log(row);
        this.infoDialogVisible=true;
        this.$axios.post('/api/notice/manage/seePeople',{
          zmpid:row.zmp_id
        } )
          .then((res)=> {
            const _data=res.data;
            if(_data.code==0){
                this.unReadObj={
                  noseeNum:_data.data.nosee_num,
                  noseeuidList:_data.data.nosee_list
                };
                this.hasReadObj={
                  seeNum:_data.data.see_num,
                  seeuidList:_data.data.see_list
                }
            }else{
              this.$message.error(_data.message);
            }
          });
    },
    handleSizeChange(val) {
      this.pageSize=val;
      this.renderTable();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage=val;
      this.renderTable();
      // console.log(`当前页: ${val}`);
    },
    // 历史公告搜索
    handleSearchHistory() {
      this.renderTable();
    },
    // 设置置顶功能
    handleSetUp(row) {
      this.nowSelectedIndex = this.tableData.indexOf(row);
      this.$confirm("确认将此公告设置为置顶?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.post('/api/notice/manage/operation',{
              zmpid:row.zmp_id,
              isdo:"2"
          } )
          .then((res)=> {
              const _data=res.data;
              if(_data.code==0){
                  //  this.tableData[this.nowSelectedIndex].isTop = true;
                  this.renderTable();
                    this.$message({
                        type: "success",
                        message: "置顶成功!"
                      });
              }else{
	                this.$message.error(_data.message);
              }
              })
          
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 取消置顶
    handleCancelUp(row) {
      this.nowSelectedIndex = this.tableData.indexOf(row);
      this.$confirm("确认将此公告取消置顶?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.tableData[this.nowSelectedIndex].isUp = false;

          this.$axios.post('/api/notice/manage/operation',{
              zmpid:row.zmp_id,
              isdo:"1"
          } )
          .then((res)=> {
              const _data=res.data;
              if(_data.code==0){
                  //  this.tableData[this.nowSelectedIndex].isTop = true;
                  this.renderTable();
                    this.$message({
                      type: "success",
                      message: "取消置顶成功!"
                    });
              }else{
	                this.$message.error(_data.message);
              }
              })

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 复制按钮
    handleClickCopy(row){
      this.$confirm('复制该公告信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(row)
          this.sendNotifyData=row;
          this.$message({
            type: 'success',
            message: '复制成功!'
          });
          //5为新员工公告，转移到第二个tab
          this.activeName="first";
        })
       
    },
    renderTable(){
      this.$axios.post('/api/notice/manage/recordList',{
        time_start:this.historyTimePick.start,
        time_end:this.historyTimePick.end,
        page:this.currentPage,
        pageSize:this.pageSize
      } )
      .then((res)=> {
        const _data=res.data;
        if(_data.code==0){
              this.pageCount=parseInt(_data.data.count)||0,
              this.tableData=_data.data.list||[];
        }
      })
      .catch((err)=>{
        console.log(err);
      });
    }
  },
  mounted(){
    __vBus.$on("H_notifyTabIndex",(data)=>{
          this.activeName=data.activeName
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.company-notify-wrap {
  .el-tabs__nav .is-active {
    background-color: #409eff;
    color: #fff;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: 1px solid #dfe4ed;
  }
  .el-tabs__header {
    border-bottom: none;
    margin-bottom: 30px;
  }
  #pane-first,
  #pane-second {
    width: 800px;
  }
  #pane-third {
    .dark {
      color: #a0a5b0;
    }
    .light {
      color: #409eff;
    }
  }
  .btm-tips {
    color: #878d99;
    font-size: 12px;
  }
  // .ql-link, .ql-image, .ql-video, .ql-font, .el-upload-list{
  //   display: none!important;
  // }
  .ql-container, .preview-container {
    height: 300px;
    strong,
    b {
      font-weight: bold;
    }
    i,
    em,
    address,
    b {
      font-style: italic;
    }
  }
  .preview-container{
    height:auto;
    padding: 0 14px;
    .title{
      padding: 14px 0 16px 0;
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: 8px;
      .top{
      // height: 28px;
      line-height: 28px;
      font-size: 14px;
      }
      .info{
        height: 18px;
        line-height: 18px;
        color: #959595;
        font-size: 12px;
      }
    }
    .cont{
      .top{
          height: 28px;
          line-height: 28px;
          font-size: 14px;
      }
    }
  }
  .ql-snow .ql-picker {
    height: auto;
  }
  .third-top {
    font-size: 14px;
    margin-bottom: 25px;
    .sendtime {
      color: #353535;
      margin-right: 20px;
      line-height: 40px;
    }
    .picker {
      width: 415px;
    }
    .el-button {
      margin-left: 25px;
    }
    
  }
  .send-input-partment{
    display: block;
    width: 675px;
    line-height: 40px;
    height: 40px;
    white-space: nowrap;
    overflow:hidden;
    text-overflow: ellipsis;
  }
  .readnums,.perview-info{
    cursor: pointer;
    color:#409eff;
  }
  .info-dialog-content{
    h5{
      line-height: 40px;
      background-color: #f3f3f3;
      
    }
    ul{
      margin-bottom: 20px;
      max-height: 140px;
      overflow: auto;
    }

    li{
      float: left;
      margin-right: 6px;
      padding-top:10px;
      span{
        text-align: center;
        font-size: 12px;
        width: 40px;
        line-height: 16px;
        display: block;
        margin-top:4px;
      }
    img{
      width: 40px;
      height: 40px;
      display: block;
      overflow: hidden;
    }
    }
  }
}
</style>
