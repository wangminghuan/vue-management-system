<template>
<div>
    <p>您导入了{{uploadAllNum}}条数据，成功{{uploadSuccessNum}}条，失败{{uploadErrorNum}}条</p>
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
        prop="m_name"
        label="姓名"
        align="left"
        width="120">
        </el-table-column>
        <el-table-column
        prop="u_gender"
        label="性别"
        align="center"
        width="180">
        </el-table-column>
        <el-table-column
        prop="u_phone"
        label="手机号"
        align="center"
        width="180">
        </el-table-column>
        <el-table-column
        prop="u_email"
        label="邮箱"
        align="center"
        width="150"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="section"
        align="center"
        label="部门"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="s_id"
        align="center"
        label="职级"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="m_position"
        align="center"
        label="职位"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="m_jobnumber"
        align="center"
        label="工号"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="m_entrytime"
        align="center"
        label="入职时间"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="m_remarks"
        align="center"
        label="备注"
        show-overflow-tooltip>
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
            :page-size="11"
            :highlight-current="true"
            layout="total, prev, pager, next"
            :total="uploadNum">
        </el-pagination>
        <span class="pagination-tip">每页显示10条</span>
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
        }
    },
    watch:{
        personStationOption(val){
            console.log(9,val)
        }
    },
    computed: {
        tableData: function (){     //当前所处于状态的总数据
            return this.leadingInResult == 1 ? this.uploadData.success : this.uploadData.error;
        },
        tablePageData: function (){
            const nowPage = this.leadingInResult == 1 ? this.uploadSuccessCurrentPage : this.uploadErrorCurrentPage;
            return this.tableData.slice((nowPage-1)*10,nowPage*10);
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
    props: ['uploadData','personStationOption'],
    methods: {
        goback (){
            this.$emit('goback');
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
            return (page - 1)*10 + index + 1;
        }
    }
}
</script>


<style lang="scss" scoped>
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

