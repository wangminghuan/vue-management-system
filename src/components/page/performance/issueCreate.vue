<template>
    <div class="create-wrap">
        <el-dialog :title="titleTxt" :visible.sync="dialogIsShow" width="500px" @close="act(false)" :close-on-click-modal="false">
            <el-form label-width="80px" label-position="left" :model="form" :rules="rules">
                <el-form-item label="保单号" prop="insId">
                    <el-input v-model="form.insId" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="客户" prop="customerName">
                    <el-input v-model="form.customerName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="承保日期" prop="insTime">
                    <el-date-picker
                    v-model="form.insTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="服务人员" prop="serveId">
                    <el-select v-model="form.serveId" filterable placeholder="请选择内容" @change="selectChange">
                        <el-option
                        v-for="item in suggestArr"
                        :key="item.serveId"
                        :label="item.serveName"
                        :value="item.serveId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="FYC" prop="fyc">
                    <el-input v-model="form.fyc" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item :style="{'textAlign':'center','marginLeft':'-80px'}">
                    <el-button type="primary" plain @click="act(false)">取消</el-button>
                    <el-button type="primary" @click="act(true)" v-if="dialogStatus">创建</el-button>
                    <el-button type="primary" @click="act(true)" v-else>保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            titleTxt: this.dialogIsCreate ? '创建保单' : '编辑保单',
            form: {
                i_id: '',    //保单id
                insId: '',    //保单号
                customerName: '',  //用户名称
                insTime: '',    //承保日期
                serveId: '',    //服务人员id
                fyc: '',    //保单金额FYC
                serveName: '',  //服务人员名称
            },
            suggestArr: [],   //承保人员选择建议数组
            rules: {    //表单输入验证规则
                insId : [{required: true, message: '保单号不能为空', trigger: 'blur'}],
                customerName:[{required: true, message: '用户名称不能为空', trigger: 'blur'}],
                insTime:[{type: 'date', required: true, message: '承保日期不能为空', trigger: 'change'}],
                serveId:[{required: true, message: '服务人员不能为空', trigger: 'change'}],
                fyc:[{required: true, message: '保单金额FYC不能为空', trigger: 'blur'}],
            }
        }
    },
    props: [
        'dialogIsShow',   //弹框是否展示
        'dialogStatus',   //  弹框是显示 编辑 还是 创建
        'editData',     //编辑的默认信息
    ],
    methods: {
        act(bol){    
            if (bol){   // 创建
                for (const key in this.form) {    //获取所有值进行验证，如果有未填写的，提示进行填写
                    if (this.form.hasOwnProperty(key)) {
                        if (key != 'i_id' && !this.form[key]){
                            this.$message.warning('请将信息填写完整');
                            return false;
                        }
                    }
                }
                this.$axios.post('/api/performance/performancemanager/saveinsurance',this.form).then((res)=>{
                    if (res.data.code == 0){
                        this.$emit('createAct',true);
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                })
            }else{    //取消
                this.$emit('createAct',false);
            }
        },
        selectChange(){    //选择框选中之后，将服务人员名称赋值给form
            let arr = this.suggestArr.map((v,i)=>{
                if (v.serveId == this.form.serveId){
                    return v.serveName;
                }
            });
            arr = [...new Set(arr)];
            this.form.serveName = arr[0] || arr[1];
        }
    },
    created(){
        this.$axios.post('/api/performance/performancemanager/attendantlist',{}).then((res)=>{
            if (res.data.code == 0){
                const obj = res.data.data;
                this.suggestArr = obj;
            }else{
                this.$message.error(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    },
    watch:{
        editData: function (newVal,oldVal){
            const that = this;
            if (this.editData){   //如果存在editData  则填上默认信息
                ({
                    i_id: that.form.i_id,
                    insId: that.form.insId,
                    customerName: that.form.customerName,
                    insTime: that.form.insTime,
                    serveId: that.form.serveId,
                    fyc: that.form.fyc,
                    serveName: that.form.serveName
                    } = this.editData);
            }
        },
        dialogIsShow: function (newVal,oldVal){    //当弹框显示时，判断是否为创造，如果未创造需要重置所有数据
            const that = this;    //这里定义个that没啥用，但我就是想这么定义:)
            if (that.dialogStatus){
                const newArr = new Array(7).fill('');
                [
                    that.form.i_id,
                    that.form.insId,
                    that.form.customerName,
                    that.form.insTime,
                    that.form.serveId,
                    that.form.fyc,
                    that.form.serveName
                ] = newArr;
            }
        }
    }


}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
.create-wrap{
    .el-select{
        width: 100%;
    }
    .el-date-editor.el-input{
        width: 100%;
    }
}
</style>



