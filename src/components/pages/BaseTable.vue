<template>
<div>
  <el-table
    :data="tableData"
    border
    height="550"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage:1,
      pageSize:10,
      total:100,
    };
  },
  methods: {
    handleSizeChange(obj){
       console.log(`当前每页展示${obj}条`)
       this.pageSize=parseInt(obj);
       this.renderData();
    },
    handleCurrentChange(obj){
      console.log(`当前展示第${obj}页`);
      this.currentPage=parseInt(obj);
      this.renderData();
    },
    generate() {
      let result = [];
      for (let i = 0; i < this.pageSize; i++) {
        result.push({
          date: new Date().getTime(),
          name: "王小虎-" + this.currentPage,
          address: "上海市普陀区金沙江路 1516 弄"
        });
      }
      return result;
    },
    renderData() {
      setTimeout(() => {
        this.tableData = this.generate();
      }, 1000);
    }
  },
  created() {
    this.renderData();
  }
};
</script>