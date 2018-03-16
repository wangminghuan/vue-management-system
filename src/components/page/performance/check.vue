<template>
  <div class="perform-check-wrap">
     <div class="title-wrap">
        <p class="com-item-title">业绩考核管理</p> 
        <div class="title-rt">
            <span class="txt-tips">*可设置考核指标的统计限制</span>
            <el-button type="primary" @click="jumpRule">指标规则设置</el-button>
        </div>
     </div>
     <div class="right-wrap">
     <el-tabs v-model="activeName" type="card" @tab-click="handleClickTab">
      <el-tab-pane :label="tabMenu[0]" name="first">
        <checkTable
        :renderData="tableData1"
        :tabName="tabMenu[0]"
        :tabIndex="1"
        ></checkTable>
      </el-tab-pane>
      <el-tab-pane :label="tabMenu[1]" name="second">
        <checkTable
        :renderData="tableData2"
        :tabName="tabMenu[1]"
        :tabIndex="2"
        ></checkTable>
      </el-tab-pane>
  </el-tabs>
     </div>
     
  </div>
</template>
<script>
import checkTable from "./checkTable";
export default {
  components:{
    checkTable
  },
  data() {
    return {
      activeName: this.$route.query.tab=="2"?"second":"first",
      tabMenu: ["职级维持", "职级晋升"],
      tableData1: [],
      tableData2: []
    };
  },
  computed: {},
  methods: {
    jumpRule(){
      this.$router.push("/performance_check_ruledit")
    },
    handleClickTab() {
     this.$route.query.tab=this.activeName
    },
  },
  created() {
    this.$axios
      .post("/api/performance/performancemanager/getCompanyStationNorm")
      .then(res => {
        const _data = res.data;
        if (_data.code == 0) {
          this.tableData1 = _data.data.keep;
          this.tableData2 = _data.data.promote;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {}
};
</script>
<style lang="scss">
.perform-check-wrap {
  .txt-tips {
    font-size: 12px;
    color: #409eff;
    padding-right: 10px;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: none;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    // border:none;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #dfe4ed;
    border-radius: 6px;
  }
  .el-tabs__item.is-active {
    color: #fff;
    background-color: #409eff;
  }
  .right-wrap {
    padding-left: 26px;
    padding-bottom: 100px;
  }
}
</style>

