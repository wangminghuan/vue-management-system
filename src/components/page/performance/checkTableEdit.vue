<template>
  <div class="check-table-edit-wrap">
     <div class="title-wrap">
        <p class="com-item-title">{{job}}（{{name}}）</p> 
        <div class="title-rt">
            <el-button type="primary" plain @click="handleClickGoback">取消</el-button>
            <el-button type="primary" @click="handleClickSave">保存</el-button>
        </div>
     </div>
     <div class="right-wrap" style="padding: 0 26px;min-width:850px">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="r_name"
              label="考核指标"
              width="300">
            </el-table-column>
            <el-table-column
              label="指标值"
              width="400">
               <template slot-scope="scope">
                 <el-input type="number" style="width:80%" v-model="scope.row.num"></el-input>
                 <span >{{scope.row.r_unit}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作">
              <template slot-scope="scope">
              <el-button @click="hanldeDelect(scope)" type="text" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
           <el-button type="primary" style="margin-top:20px;" @click="isShowDialog=true">添加指标</el-button>
     </div>
     <el-dialog
      title="选择指标"
      :visible.sync="isShowDialog"
      width="300px"
      center>
      <div class="list-wrap">
        <div class="list-inner-wrap">
        <ul>
          <!-- <li class="disabled">个人业绩2</li> -->
          <li :class="item.isActive==1? 'active':'disabled'" @click="handleClickAdd(item)" v-for="(item,index) in normRangeList" :key="index">{{item.r_name}}</li>
        </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowDialog=false">确 定</el-button>
      </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    const _data=JSON.parse(sessionStorage.getItem("__p_check_table__")||"{}");
      return{
        hasSubmit:false,
        isShowDialog:false,
        name:_data.name||"",
        sid:_data.data.s_id||"",
        job:_data.data && _data.data.s_name?_data.data.s_name:"",
        sid:_data.data && _data.data.s_id?_data.data.s_id:"",
        propsData:_data.data||{},
        tableData:_data.data && _data.data.n_config && _data.data.n_config instanceof Array?_data.data.n_config:[],
        index:_data.index||"1",
        normRangeList:[],
      }
  },
  watch:{
      isShowDialog:function(val){
         if(val){
            this.normRangeList.map((item)=>{
              this.getListIndex(item.r_id)>-1? item.isActive=0:item.isActive=1;
            })
         }
      }
  },
  methods:{
  handleClickGoback(){
    this.$router.push({path:"/performance_check",query:{tab: this.index}});
    sessionStorage.removeItem("__p_check_table__")

  },
  handleClickSave(){
     this.updateDate()
  },
  // 添加指标
  handleClickAdd(item){
     if(item.isActive==0) return;
       this.isShowDialog=false;
       item.num=0;
       this.tableData.push(item)
  },
  updateDate(){
    //数字校验，防止提交的不是正整数
    for(let i=0;i<this.tableData.length;i++){
          if(!(/(^[1-9]\d*$)/.test(this.tableData[i].num))){
              this.$message.error("请确认提交的数据为正整数！")
              return false;
         }
        }
      if(this.hasSubmit) return;
        this.hasSubmit=true;
        this.$axios.post("/api/performance/performancemanager/setStationNorm",{
            s_id:this.sid,
            type:this.index=="2"?"promote":"keep",
            config:this.tableData
        })
          .then((res)=>{
            const _data = res.data;
            if (_data.code == 0) {
               this.$message({
                    message: '保存成功！',
                    type: 'success'
                });
                setTimeout(()=>{
                 this.handleClickGoback()
                },1000)
            }else{
                 this.$message.error(_data.message);
            }
            this.hasSubmit=false;
          }).catch(()=>{
              this.hasSubmit=false;
          })
  },
  //移除
  hanldeDelect(data){
    this.tableData.splice(data.$index,1)
  },
  getListIndex(_id){
      for(let i=0;i<this.tableData.length;i++){
        if(this.tableData[i].r_id==_id){
          return i
        }
      }
      return -1
  }
  
  },
  created(){
    this.$axios.post("/api/performance/performancemanager/getNormRangeList")
    .then((res)=>{
            const _data = res.data;
            if (_data.code == 0) {
              this.normRangeList=_data.data;
            }
          })
  },
  mounted(){
  }
}
</script>
<style lang="scss">
.check-table-edit-wrap{
  .list-wrap{
     text-align: center;
      width: 246px;
      height: 170px;
      overflow-y: scroll;  
     
     .list-inner-wrap{
      //  width: 268px;
      //  height:170px ;
      //   overflow-y: scroll;
     }
     li{
       white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;
     }
     li.active:hover{
           background-color: #f5f7fa;
     }
     li.disabled{
       background-color: #d3d7dc
     }

  }
}

</style>

