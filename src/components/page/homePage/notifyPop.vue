<template>
    <el-dialog title="通知激活" class="home-notify-pop" :visible.sync="dialogNotifyVisible" width="700px" center>
        <div class="el-icon-info">有{{tableData.length}}人尚未激活</div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;max-height:386px;overflow-y:scroll"
            @select="handleSelectedNotify"
            @select-all="handleSelectedAll"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55" :disabled="true">
            </el-table-column>
            <el-table-column
            label="姓名"
            width="200">
            <template slot-scope="scope">
                <span class="notify-name">{{ scope.row.m_name}}</span>
                <el-tag size="mini" v-if="scope.row.u_isnotice == 1">今日已通知</el-tag>
                <el-tag type="info" size="mini" v-else-if="scope.row.isRegeste==0">未注册</el-tag>
                <el-tag type="warning" size="mini" v-else>未激活</el-tag>
            </template>
            </el-table-column>
            <!-- <el-table-column
            prop="m_position"
            label="职位"
            width="200">
            </el-table-column> -->
            <el-table-column
            prop="s_name"
            label="部门"
            width="200">
            </el-table-column>
            <el-table-column
            prop="u_phone"
            label="手机号"
            >
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleClickSendNotify">通知激活</el-button>
            <el-button @click="dialogNotifyVisible = false">取 消</el-button>
            <div class="btm-tips">通知激活会向未注册用户发送邀请通知和短信，对注册用户仅发送邀请通知</div>
       </div>
       
    </el-dialog>
</template>

<script>
export default {
  data: function() {
    return {
      dialogNotifyVisible:false,
      tableData:[],
      multipleSelection: [],
      confirmUrl:""
    };
  },
  methods:{
      handleSelectedAll(selection){
       const _section=[...selection];
       _section.map((item)=>{
         if(item.u_isnotice==1){
             this.$refs.multipleTable.toggleRowSelection(item,false)
         }
       })
      },
      handleSelectedNotify(selection, row){
        if(row.u_isnotice==1){
            this.$refs.multipleTable.toggleRowSelection(row,false)
            this.$message({
                message: '同一个用户一天只能通知一次',
                type: 'warning'
            });
            
        }
      },
      handleSelectionChange(val) {
        let _val=[];
        for(let k=0;k<val.length;k++){
             if(val[k].u_isnotice==0){
               _val.push(val[k])
            }
        }
        this.multipleSelection = _val;
      },
      handleClickSendNotify(){
          if(this.multipleSelection.length>0){
              let _send=[];
              this.multipleSelection.map((item)=>{
                  _send.push(item.m_id)
              })
            this.dialogNotifyVisible=false;
            this.$axios.post('/api/index/index/activate', {
                    mids:_send.join(","),
            }).then((res)=> {
                 let _data=res.data;
                 if(_data.code==0){
                    this.$message({
                        message: '恭喜你，通知成功！',
                        type: 'success'
                    });
                    this.$emit('resetList');     //触发父级事件
                 }else{
                     this.$message({
                     message: '发送异常，请稍后再试',
                     type: 'error'
                 });
                 }
                }).catch((err)=>{
                  console.log(err);
                  this.$message({
                     message: '请求失败，请稍后再试！',
                    type: 'error'
                  });
                });
                
          }else{
             this.$message({
                message: '您未选择任何成员！',
                type: 'error'
           });
          }
      }
    },
  mounted(){
      __vBus.$on("H_showDialogNotify",(data)=>{
        this.dialogNotifyVisible=true;
        this.$axios.post(data.getListUrl, data.getListData).then((res)=> {
            let _data=res.data;
            if(_data.code==0){
                this.tableData=_data.data;
            }
        }).catch((err)=>{
            console.log(err);
        });
      })
    
  }
};
</script>

<style lang="scss">
.home-notify-pop{
    font-size: 14px;
    padding:0 36px;
    .el-icon-info{
    width: 100%;
    background-color: #f3f4f5;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #878d99;
    border-radius: 4px;
    &:before{
    margin-right: 10px;
    }
    }
    .cell{
        .notify-name{
        //   width: 62px;
          overflow: hidden;
          white-space: nowrap;
        //   display: block;
        //   float: left;
          text-overflow:ellipsis;
        }
        .un-notify,.has-notify,.un-regist{
           color: #fff;
           font-size:12px;
           padding: 2px 4px;
           border-radius: 2px;
           position: absolute;
           top:11px;
           left: 76px;
        //    float: left;
        }
        .un-notify{
             background-color:#fa5555;
        } 
        .has-notify{
            background-color:#409eff;
        }
        .un-regist{
            background-color: rgba(135,141,153,.2);
            border: 1px solid rgba(135,141,153,.2);
            color: #878d99;
        }
    }
    .btm-tips{
        font-size: 12px;
        color:#dfe4ed;
        margin-top:12px;
    }
}
</style>