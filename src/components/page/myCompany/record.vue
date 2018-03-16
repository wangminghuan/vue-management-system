<template>
  <div class="company-record-wrap">
    <h4 class="com-item-title">操作记录</h4>
    
   <div class="form-wrap">
       <el-form :inline="true" :model="formTop" class="form-top">
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="formTop.selectDateStart"
            value-format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker>
          <el-date-picker
            v-model="formTop.selectDateEnd"
            value-format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择结束时间">
          </el-date-picker>
          <!-- <el-date-picker
            value-format="yyyy-MM-dd HH:mm"
            v-model="formTop.selectDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker> -->
        </el-form-item>
        <el-form-item label="管理员">
          <el-select v-model="formTop.selectAdmin" placeholder="请选择">
            <el-option 
            v-for="item in optionsAdmin"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作对象">
          <el-select v-model="formTop.selectType" placeholder="请选择">
            <el-option 
            v-for="item in optionsType"
            :key="item.log_o_id"
            :label="item.log_o_name"
            :value="item.log_o_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFromTopSubmit">查询</el-button>
        </el-form-item>
      </el-form>
     <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="create_time"
        label="时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="admin_name"
        label="管理员"
        width="180">
      </el-table-column>
      <el-table-column
        prop="log_type"
        label="操作类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="log_o_name"
        label="操作对象"
        width="200">
      </el-table-column>
      <el-table-column
        prop="log_detail"
        label="详细信息">
      </el-table-column>
    </el-table>
    <section class="pagination-wrap clearfix">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="listCount">
    </el-pagination>
    </section>
   </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
       pageSize:10,
       listCount:0,
       currentPage:1,
       startTime:"",
       endTime:"",
       selectedAdmin:"",
       selectedType:"",
       tableData: [],
       optionsAdmin: [{
         id:"",
         name:"不限"}],
       optionsType:[{
         log_o_id:"",
         log_o_name:"不限"}],
         formTop: {
          selectDateStart:"",
          selectDateEnd:"",
          selectAdmin: '',
          selectType: ''
        },
        
    }
  },
  methods:{
    handleFromTopSubmit(){
      // console.log(this.formTop);
      this.startTime=this.formTop.selectDateStart||"";
      this.endTime=this.formTop.selectDateEnd||"";
      this.selectedAdmin=this.formTop.selectAdmin;
      this.selectedType=this.formTop.selectType;
      this.renderTable();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val;
      this.renderTable();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage=val;
      this.renderTable();
    },
    renderTable(){
      this.$axios.post('/api/log/log/logs', {
      page:this.currentPage,     // page	否	int	页码
      pagesize:this.pageSize,    // pagesize	否	int	分页条数，默认20，最大1000
      startTime:this.startTime,     // startTime	否	datetime	开始时间
      endTime:this.endTime,     // startTime	否	datetime	结束时间
      admin_uid :this.selectedAdmin,    // uid	否	int	管理员id
      object :this.selectedType,    // type 否	int	操作类型id
      }).then((res)=> {
        if(res.data.code==0){
          this.tableData=res.data.data.list||[];
          this.listCount=parseInt(res.data.data.count)||0;
        }
      })
  }
  },
  created(){
    this.renderTable();
    this.$axios.post('/api/log/log/admins').then((res)=> {
        if(res.data.code==0){
          this.optionsAdmin=this.optionsAdmin.concat(res.data.data||[])
        }
      })
    this.$axios.post('/api/log/log/objects').then((res)=> {
        if(res.data.code==0){
          this.optionsType=this.optionsType.concat(res.data.data||[])
        }
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.company-record-wrap{
  .top{
    margin-bottom: 40px;
  }
  
}
</style>
