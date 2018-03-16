<template>
<div class="issue-content">
    <el-form :inline="true">
        <el-form-item label="保单号">
            <el-input v-model="form.insId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
            <el-input v-model="form.customerName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="form.insStatus" placeholder="请选择">
                <el-option 
                v-for="item in optionsStatus"
                :key="item.id"
                :label="item.label"
                :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="承保日期">
            <el-date-picker
                v-model="form.startTime"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker
                v-model="form.endTime"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择结束时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table
      :data="tableList"
      style="width: 100%">
        <el-table-column
            prop="insId"
            label="保单号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="customerName"
            label="客户"
            width="180">
        </el-table-column>
        <el-table-column
            prop="fyc"
            label="FYC">
        </el-table-column>
        <el-table-column
            prop="insTime"
            label="承保日期">
            <template slot-scope="scope">
                <span>{{scope.row.insTime.split(" ")[0]}}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="serveName"
            label="服务人员">
        </el-table-column>
        <el-table-column
            label="状态">
            <template slot-scope="scope">
                {{scope.row.insStatus == '1' ? '正常' : '已作废'}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="address"
            label="操作">
            <template slot-scope="scope">
                <el-button @click="rowEdit(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="rowDel(scope.row)" type="text" size="small" v-if="scope.row.insStatus == '1'">作废</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
        layout="prev, pager, next"
        :total="totalNum"
        @current-change="handleCurrentChange"
        :page-size="20"
        :style="{'textAlign':'center'}">
    </el-pagination>
</div>
</template>

<script>
export default {
    data(){
        return {
            tableList: [],   //列表信息
            total: '',    //信息的总共条数
            page: 1,    //分页当前页码
            form: {
                insId: '',   //保单号
                customerName: '',   //客户姓名
                insStatus: '',   //保单状态
                startTime: '',    //承保开始日期
                endTime: '',    //承保结束时间
            },
            optionsStatus: [    //状态的选项
                {
                    label: '请选择',
                    id: ''
                },
                {
                    label: '正常',
                    id: '1'
                },
                {
                    label: '已作废',
                    id: '2'
                }
            ]
        }
    },
    created(){
        this.getListMsg();
    },
    methods: {
        getListMsg(){   //获取table列表信息
            this.$axios.post('/api/performance/performancemanager/getinsurancelist',{
                page: this.page,
                ...this.form
            }).then((res)=>{
                if (res.data.code == 0){
                    const data = res.data.data;
                    const that = this;
                    ({totalNum: that.total,listArr:that.tableList} = data);
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        // 表格内方法
        rowEdit(obj){    //编辑
            this.$emit('edit',obj);
        },
        rowDel(obj){     // 作废
            this.$confirm('是否将此条信息作废？','作废',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.post('/api/performance/performancemanager/abolishinsurance',{
                    i_id: obj.i_id
                }).then((res)=>{
                    if (res.data.code == 0){
                        this.$message.success('已将此条作废！');
                        this.getListMsg();
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }).catch(()=>{
            });
            
        },
        handleCurrentChange(val) {    //分页跳转
            // console.log(`当前页: ${val}`);
            this.page=val;
            this.getListMsg();

        },
        search(){   // 根据条件查询
            this.page=1;
            this.getListMsg();
        }
    },
    computed: {
        totalNum(){
            return this.total - 0;
        }
    }
}
</script>

<style lang="scss" scoped>
.issue-content{
    padding: 0 24px;
}
</style>

