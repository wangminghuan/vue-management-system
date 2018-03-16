<template>
<div class="content-wrap">
    <h6>管理角色组<el-button type="primary" plain @click="goback">返回</el-button><el-button type="primary" @click="addRoleTeamBtn" class="edit-role-group">添加角色组</el-button></h6>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="label"
        label="角色组">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="180">
        <template slot-scope="scope">
            <el-button
            size="mini"
            type="warning"
            @click.stop="handleEdit(scope.$index, scope.row)" plain>编辑</el-button>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色组 -->
    <el-dialog
        title="添加角色组"
        :visible.sync="addRoleTeamFlag"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>
        <el-form ref="form" label-width="100px">
            <el-form-item label="角色组名称" required>
                <el-input v-model="addRoleTeamInput"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addRoleTeam('false')">保 存</el-button>
            <el-button @click="addRoleTeamFlag = false">取 消</el-button>
        </span>
    </el-dialog>
    <!-- 添加角色组 -->
    <el-dialog
        title="编辑角色组"
        :visible.sync="editRoleTeamFlag"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>
        <el-form ref="form" label-width="100px">
            <el-form-item label="角色组名称" required>
                <el-input v-model="addRoleTeamInput"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addRoleTeam('true')">保 存</el-button>
            <el-button @click="editRoleTeamFlag = false">取 消</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data(){
        return {
            addRoleTeamFlag: false,    //添加角色组弹框
            editRoleTeamFlag: false,     //编辑角色组弹框
            tableData:null,      //列表信息对象
            addRoleTeamInput: '',     //添加角色组弹框的input
            currentTeam: '',      //当前正在处理的角色组信息
            iaAdd: true,      //区分开添加角色组和编辑角色组   true-->添加角色组    false-->编辑角色组
        }
    },
    methods: {
        goback(){    //返回角色面板
            this.$router.push('/addressList_role');
        },
        addRoleTeam(flag){     //添加角色组-->保存      编辑角色组-->保存
            this.addRoleTeamInput = this.addRoleTeamInput.replace(/\s+/g,'');
            if (!this.addRoleTeamInput){
                this.$message({
                    message:'请填写角色组名~',
                    type:'warnning'
                });
                return false;
            }
            if (this.addRoleTeamInput.length > 20){
                this.$message({
                    type:'warnning',
                    message:'角色组名称输入内容过长'
                });
                return false;
            }
            let obj = {
                name: this.addRoleTeamInput,
            }
            if (!this.isAdd){
                obj.id = this.currentTeam;
            }
            this.$axios.post('/api/role/role/groupsave',obj).then((res)=>{
                if (res.data.code == 0){
                    if (flag == 'true'){
                        this.$message({
                            message:'编辑保存成功',
                            type:'success'
                        });
                    }else{
                        this.$message({
                            message:'添加角色组成功',
                            type:'success'
                        });
                    }
                    this.uploadTeamMsg();
                }else{
                    this.$message.error(res.data.message);
                }
                this.addRoleTeamFlag = false;
                this.editRoleTeamFlag = false;
            }).catch((error)=>{
                console.log(error);
            })
        },
        uploadTeamMsg(){     //获取角色组信息
            this.$axios.post('/api/role/role/roles').then((res)=>{
                if (res.data.code == 0){    //将所有结构树进行更新
                    this.tableData = res.data.data.roleTeam;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        handleEdit(i,e){     //编辑角色组
            this.isAdd = false;
            this.editRoleTeamFlag = true;
            this.addRoleTeamInput = e.label;
            this.currentTeam = e.id;
        },
        handleDelete(i,e){     //删除角色组
            this.$confirm('是否确认删除该角色组？','删除角色组',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.post('/api/role/role/rmGrouprole',{
                    r_g_id: e.id,
                }).then((res)=>{
                    if (res.data.code == 0){
                        this.$message({
                            type:'success',
                            message: '删除成功！'
                        });
                        this.uploadTeamMsg();
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }).catch(()=>{
            });
        },
        addRoleTeamBtn(){
            this.addRoleTeamFlag = true;
            this.addRoleTeamInput = '';
            this.isAdd = true;
        }
    },
    created(){
        this.uploadTeamMsg();
    }
}
</script>


<style lang="scss" scoped>
.content-wrap{
    padding: 0 15px;
    font-size: 14px;
    h6{
        height: 73px;
        line-height: 73px;
        color: #878d99;
        button{
            margin-left: 15px;
        }
    }
    .el-table{
        border: 1px solid #e6ebf5;
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
}
.edit-role-group{
    float: right;
    margin-top: 18px;
}
</style>
