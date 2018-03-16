<template>
<div class="issue-result">
    <p class="result-tip">您导入了{{uploadAllNum}}条数据，成功{{uploadSuccessNum}}条，失败{{uploadErrorNum}}条</p>
    <el-radio-group v-model="leadingInResult" class="tab-btn-box" size="small">
      <el-radio-button label="1" @click="tabActive">导入成功</el-radio-button>
      <el-radio-button label="0" @click="tabActive">导入失败</el-radio-button>
    </el-radio-group>
    <el-table
        ref="multipleTable"
        :data="tablePageData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
        type="index"
        :index="indexMethod"
        width="50">
        </el-table-column>
        <el-table-column
        prop="i_client"
        label="客户名"
        align="left">
        </el-table-column>
        <el-table-column
        prop="i_card"
        label="保单号"
        align="center">
        </el-table-column>
        <el-table-column
        prop="i_fyc"
        label="FYC"
        align="center">
        </el-table-column>
        <el-table-column
        prop="i_sign_date"
        label="承保日期"
        align="center">
        </el-table-column>
        <el-table-column
        prop="m_name"
        align="center"
        label="服务人员">
        </el-table-column>
        <el-table-column
        prop="m_phone"
        align="center"
        label="手机号">
        </el-table-column>
        <el-table-column
        prop="reason"
        align="center"
        label="失败原因"
        show-overflow-tooltip
        v-if="leadingInResult == 0">
        </el-table-column>
    </el-table>
    <div class="table-footer">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="20"
            :highlight-current="true"
            layout="total, prev, pager, next"
            :total="uploadNum">
        </el-pagination>
        <span class="pagination-tip">每页显示20条</span>
    </div>
    <el-button type="primary" plain @click="goback">返回</el-button>
</div>
</template>

<script>
export default {
    data(){
        return {
            leadingInResult: '1',     //用来切换'导入成功'和'导入失败',其中'1'代表带入成功,'0'代表导入失败
            currentPage: 1,    //当前页面
            uploadSuccessData: [],    //上传成功的数据
            uploadErrorData: [],     //上传失败的数据
            uploadSuccessCurrentPage: 1,    //上传成功信息当前页
            uploadErrorCurrentPage: 1,      //上传失败信息当前页
            uploadData: null,    //上传返回过来的信息
        }
    },
    computed: {
        tableData: function (){     //当前所处于状态的总数据
            return this.leadingInResult == 1 ? this.uploadData.success : this.uploadData.error;
        },
        tablePageData: function (){
            const nowPage = this.leadingInResult == 1 ? this.uploadSuccessCurrentPage : this.uploadErrorCurrentPage;
            return this.tableData.slice((nowPage-1)*20,nowPage*20);
        },
        uploadSuccessNum: function (){    //上传成功的数量
            return this.uploadData.success.length;
        },
        uploadErrorNum: function (){     //上传失败的数量
            return this.uploadData.error.length;
        },
        uploadAllNum: function (){
            return (this.uploadSuccessNum - 0) + (this.uploadErrorNum - 0);
        },
        uploadNum: function (){
            return this.leadingInResult == 1 ? this.uploadSuccessNum : this.uploadErrorNum;
        }

    },
    // props: ['uploadData'],
    methods: {
        goback (){
            // this.$emit('goback');
            this.$router.push({path: '/performance_issue_import'})
        },
        handleSizeChange(){

        },
        handleCurrentChange(val){    //当前页操作
            if(this.leadingInResult == 1){
                this.uploadSuccessCurrentPage = val;
            }else{
                this.uploadErrorCurrentPage = val;
            }
            this.currentPage = this.leadingInResult == 1 ? this.uploadSuccessCurrentPage : this.uploadErrorCurrentPage;
        },
        tabActive(){   //切换导入成功或失败的数据
            const page = this.leadingInResult == 1 ? this.uploadSuccessCurrentPage : this.uploadErrorCurrentPage;
            this.currentPage = this.leadingInResult == 1 ? this.uploadSuccessCurrentPage : this.uploadErrorCurrentPage;
        },
        indexMethod(index){    //自定义索引值
            const page = this.leadingInResult == 1 ? this.uploadSuccessCurrentPage : this.uploadErrorCurrentPage;
            return (page - 1)*20 + index + 1;
        }
    },
    created(){
        this.uploadData = JSON.parse(sessionStorage.getItem('import_result'));
    }
}
</script>


<style lang="scss" scoped>
.issue-result{
    padding: 24px 24px;
}
.result-tip{
    font-size: 14px;
}
.tab-btn-box{
    margin-top: 15px;
}
.table-footer{
    height: 66px;
    line-height: 66px;
    font-size: 12px;
    color: #959595;
    .table-tip{
        margin-right: 15px;
    }
    .pagination-tip{
        float: right;
        margin-right: 15px;
    }
    .el-pagination{
        float: right;
        height: 28px;
        margin-top: 17px;
        font-size: 12px;
    }
}
</style>