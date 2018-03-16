<template>
<div>
    <slot name="content-header"></slot>
    <div class="content-wrap">
        <h6>批量操作<el-button type="danger" plain @click="batchDelete">批量移除</el-button></h6>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            prop="m_name"
            label="姓名"
            width="220"
            align="left">
            </el-table-column>
            <el-table-column
            prop="m_position"
            label="职位"
            align="center">
            </el-table-column>
            <el-table-column
            prop="m_jobnumber"
            label="工号"
            align="center">
            </el-table-column>
            <el-table-column
            prop="u_phone"
            label="手机号"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="u_email"
            align="center"
            label="邮箱"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="operation"
            align="center"
            width="250"
            label="操作"
            show-overflow-tooltip>
                <template slot-scope="scope">
                    <!-- <el-button
                    size="mini"
                    type="primary"
                    @click.stop="handleEdit(scope.$index, scope.row)" plain>编辑</el-button> -->
                    <el-button
                    size="mini"
                    type="warning"
                    @click.stop="handleAdjust(scope.$index, scope.row)" plain>调整角色</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)" plain>移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="table-footer">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="mainCurrentPage"
                :page-size="10"
                :highlight-current="true"
                layout="total, prev, pager, next"
                :total="allDataNum">
            </el-pagination>
            <span class="pagination-tip">每页显示10条</span>
        </div>
        <notify-pop></notify-pop>
    </div>
    <!-- 调整部门 ==> 选择部门弹框 -->
    <choose-department-box :chooseDepartments="chooseDepartments_adjust" :defaultCheckArr="defaultCheckedArr" @closeChooseDepartment="closeChooseDepartmentBox_adjust" :chooseData="organData">
        <h4 slot="left-name" class="choose-department-h4">组织结构</h4>
        <h4 slot="right-name" class="choose-department-h4">已选部门</h4>
    </choose-department-box>
    <choose-department-box :chooseDepartments="chooseDepartments_single" :defaultCheckArr="defaultCheckedArr" @closeChooseDepartment="closeChooseDepartmentBox_single" :chooseData="organData">
        <h4 slot="left-name" class="choose-department-h4">组织结构</h4>
        <h4 slot="right-name" class="choose-department-h4">已选部门</h4>
    </choose-department-box>
    <!-- 调整角色 -->
    <el-dialog
        title="调整角色"
        :visible.sync="adjustRoleFlag"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>
        <el-form ref="form" label-width="120px">
            <el-form-item label="调整后的角色" required>
                <el-select v-model="adjustAfterRole" multiple placeholder="请选择" class="select-box">
                    <el-option
                    v-for="item in teamRole"
                    :key="item.id"
                    :label="item.label"
                    :disabled="item.isGroup"
                    :value="item.id">
                    <span style="float: left" :class="{'group-span':!item.isGroup}">
                        <i class="el-icon-goods" v-if="item.isGroup"></i>
                        <i class="el-icon-document" v-else></i>
                        {{ item.label }}
                    </span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="adjustRoleOk">保 存</el-button>
            <el-button @click="adjustRoleFlag = false">取 消</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import chooseDepartmentBox from './chooseDepartmentBox';
import notifyPop from '../homePage/notifyPop';
export default {
    methods: {
        handleSelectionChange(val) {
            let arr = [];
            val.forEach((e,i)=>{
                arr.push(e.m_id);
            });
            this.checkArr = arr;
        },
        handleCurrentChange(val) {
            this.mainCurrentPage = val;
            this.getDepartmentPersonMsg();
        },
        closeChooseDepartmentBox_adjust (...data){      //调整部门-->接收组件触发的事件,关闭选择部门的组件
            this.chooseDepartments_adjust = false;
            if (data[0].length <= 0) return true;
            let arr = [];     //要调整的部门的数组
            data[0].forEach((e,i) => {
                arr.push(e.label);
                this.departmentId.push(e.id);
            });
            /* 调整部门的操作,获取列表的选项,然后发送给后台 */
        },
        batchDelete (){   //批量删除
            if (this.checkArr.length <= 0){
                this.$message.error('您未选择任何成员！');
                return false;
            }
            this.$confirm('是否将所选成员从该角色中移除？','从角色移除',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.post('/api/role/role/rmmember',{
                    ids: this.checkArr.join(','),
                    rid: this.departId.currentRoleId,
                }).then((res)=>{
                    if (res.data.code == 0){
                        this.$message({
                            type:'success',
                            message: '删除成功！'
                        });
                        this.$emit('adjustUpload');
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }).catch(()=>{
            });
        },
        handleAdjust(i,e){  //列表 --> 调整部门
            this.adjustRoleFlag = true;
            this.adjustAfterRole = e.roleArr;
            this.currentPersonId = e.m_id;

        },
        closeChooseDepartmentBox_single(...data){
            this.chooseDepartments_single = false;
        },
        handleDelete(i,e){    //列表-->移除
            this.$confirm('是否将该成员从该角色中移除？','从角色移除',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.post('/api/role/role/rmmember',{
                    ids: e.m_id,
                    rid: this.departId.currentRoleId,
                }).then((res)=>{
                    if (res.data.code == 0){
                        this.$message({
                            type:'success',
                            message: '删除成功！'
                        });
                        this.$emit('adjustUpload');
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }).catch((error)=>{
                console.log(error);
            });
        },
        informActivate(){     //通知激活
            __vBus.$emit("H_showDialogNotify",{
                getListUrl:"/api/member/member/getNotActivate",
                getListData:{
                    cid:__golbal_cid,
                    sid: this.departId
                }
            });
        },
        getDepartmentPersonMsg() {     //获取主页面列表信息
            this.$axios.post('/api/role/role/members',{
                page: this.mainCurrentPage,
                role_id: this.departId.isTeam ? '' : this.departId.currentRoleId,
            }).then((res)=>{
                if (res.data.code == 0){
                    const data = res.data.data;
                    this.tableData = data.listArr;
                    this.allDataNum = data.countRecords - 0;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        adjustRoleOk(){    //调整角色-->保存
            if(this.adjustAfterRole.length <= 0){
                this.$message.error('角色不能为空哦~');
                return false;
            }
            this.$axios.post('/api/role/role/adjustrole',{
                rids: this.adjustAfterRole.join(','),
                ids: this.currentPersonId
            }).then((res)=>{
                if (res.data.code == 0){
                    this.$message({
                        message:'调整角色成功!',
                        type:'success'
                    });
                    this.$emit('adjustUpload');
                    this.getDepartmentPersonMsg();
                    this.adjustRoleFlag = false;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        handleEdit(i,e){
            sessionStorage.setItem('organ_id',e.m_id);
            this.$router.push('/organ?personDetail');
        }
    },
    data (){
        return {
            tableData: [],    //列表总信息
            allDataNum: 10,    //信息总数
            mainCurrentPage: 1,
            chooseDepartments_adjust: false,    //调整部门-->是否显示部门选择弹框
            chooseDepartments_single: false,     //调整部门-->列表操作-->是否显示部门选择弹框
            informAct: false,       //通知激活的弹框是否显示
            checkArr: [],    //选中的对象的id的数组
            departmentId: [],    //调整部门-->要调整到的部门的id数组
            notActiveNum: 0,    //未激活的人数数量
            defaultCheckedArr: [],    //调整部门默认选项,如果有则是一个对象数组,没有即为空数组
            currentPersonId:'',       //当前人物的id

            adjustRoleFlag: false,    //角色模块中用来控制调整角色是否显示
            adjustAfterRole: [],    //调整后选择的角色
        }
    },
    components: {
        chooseDepartmentBox,    //选择部门的弹出框,带有机构数,结构树节点选择,结构树节点过滤和类似穿梭框之间的联动,有几个地方可以共用
        notifyPop,     //通知激活组件
    },
    props: ['organData','departId','mainTableFlag','closeChooseDepartmentBoxCheckId','teamRole'],
    created (){
        this.getDepartmentPersonMsg();
    },
    watch: {
        departId: function (){
            this.mainCurrentPage = 1;
            this.getDepartmentPersonMsg();
        },
        mainTableFlag: function (val){
            this.mainCurrentPage = 1;
            this.getDepartmentPersonMsg();
        }
    }
}
</script>


<style lang="scss" scoped>
.content-head-box{
    padding: 0 15px;
    font-weight: 500;
    font-size: 14px;
    height: 70px;
    line-height: 70px;
    overflow: hidden;
    border-bottom: 1px solid #d5d5d5;
    button{
        float: right;
        margin-left: 15px;
        margin-top: 15px;
    }
    b{
        width: 2px;
        height: 15px;
        background-color: #409eff;
        display: inline-block;
        vertical-align: middle;
        margin-top: -2px;
        margin-right: 10px;
    }
}
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
.group-span{
    margin-left: 20px;
}
.select-box{
    width: 100%;
}
</style>

