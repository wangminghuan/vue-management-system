<template>
<div>
    <slot name="content-header"></slot>
    <div class="content-wrap">
        <h6>批量操作<el-button type="primary" plain @click="adjustDepartment">调整部门</el-button><el-button type="danger" plain @click="batchDelete">批量移除</el-button></h6>
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
                <template slot-scope="scope" disabled>
                    <span>{{ scope.row.m_name}}</span>
                    <el-tag type="success" size="mini" v-if="scope.row.isManager == 1">主管</el-tag>
                    <el-tag type="info" size="mini" v-if="scope.row.isRegeste == 0">未注册</el-tag>
                    <el-tag type="warning" size="mini" v-if="scope.row.u_isactive == 0">未激活</el-tag>
                    <el-tag size="mini" v-if="scope.row.u_isnotice == 1">今日已通知</el-tag>
                </template>
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
                    <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)" plain>编辑</el-button>
                    <el-button
                    size="mini"
                    type="warning"
                    @click.stop="handleAdjust(scope.$index, scope.row)" plain>调整部门</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)" plain>移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="table-footer">
            <span class="table-tip" v-if="departId != 0">部门有{{notActiveNum}}人尚未激活</span>
            <el-button type="primary" plain @click="informActivate">通知激活</el-button>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="mainCurrentPage"
                :page-size="10"
                :highlight-current="true"
                layout="total, prev, pager, next"
                :total="allDataNum">
            </el-pagination>
            <span class="pagination-tip">每页显示10条</span>
        </div>
        <notify-pop @resetList="resetList"></notify-pop>
    </div>
    <!-- 调整部门 ==> 选择部门弹框 -->
    <choose-department-box :chooseDepartments="chooseDepartments_adjust" :defaultCheckArr="defaultCheckedArr" @closeChooseDepartment="closeChooseDepartmentBox_adjust" :chooseData="organData" @adjustUpload="resetList">
        <h4 slot="left-name" class="choose-department-h4">组织结构</h4>
        <h4 slot="right-name" class="choose-department-h4">已选部门</h4>
    </choose-department-box>
    <choose-department-box :chooseDepartments="chooseDepartments_single" :defaultCheckArr="defaultCheckedArr" @closeChooseDepartment="closeChooseDepartmentBox_single" :chooseData="organData" @adjustUpload="resetList">
        <h4 slot="left-name" class="choose-department-h4">组织结构</h4>
        <h4 slot="right-name" class="choose-department-h4">已选部门</h4>
    </choose-department-box>
    <el-dialog
        title="通知激活"
        :visible.sync="informAct"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>
        <div>
            <span>有{{notActiveNum}}人尚未激活</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
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
        adjustDepartment(){   //批量操作-->调整部门按钮
            if (this.checkArr.length <= 0){
                this.$message.error('您未选择任何成员！');
                return false;
            }
            this.defaultCheckedArr = [];
            this.chooseDepartments_adjust = true;
            __vBus.departmentAdjustArr = this.checkArr;
        },
        handleSizeChange(val) {
        },
        handleCurrentChange(val) {
            this.mainCurrentPage = val;
            this.getDepartmentPersonMsg(this.departId);
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
            if (this.checkIdArr.length <= 0){
                this.$message.error('您未选择任何成员！');
                return false;
            }
            let paramsObj = {
                mid: this.checkArr,
                sid: this.departId,
                cid: __golbal_cid
            };
            this.$axios.post('/api/member/member/isDelAll',paramsObj).then((res)=>{
                if (res.data.code == 0){
                    const data = res.data.data;
                    if (data.isallow){
                        this.$confirm('移除 ' + data.info + ' 后，将彻底从企业彻底删除该成员，是否继续？','从部门移除',{
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(()=>{
                            this.$axios.post('/api/member/member/delMemberFromSection',paramsObj).then((res)=>{
                                if (res.data.code == 0){
                                    this.$message({
                                        type:'success',
                                        message: '删除成功！'
                                    });
                                    this.$emit('adjustUpload');
                                    this.getDepartmentPersonMsg(this.departId);
                                }else{
                                    this.$message.error(res.data.message);
                                }
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }).catch((error)=>{
                            console.log(error);
                        });
                    }else{
                        this.$confirm('是否将所选成员从该部门中移除？','从部门移除',{
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(()=>{
                            this.$axios.post('/api/member/member/delMemberFromSection',paramsObj).then((res)=>{
                                if (res.data.code == 0){
                                    this.$message({
                                        type:'success',
                                        message: '删除成功！'
                                    });
                                    this.$emit('adjustUpload');
                                    this.getDepartmentPersonMsg(this.departId);
                                }else{
                                    this.$message.error(res.data.message);
                                }
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }).catch((error)=>{
                            console.log(error);
                        });
                    }
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
            
        },
        handleEdit (i,e){    //列表-->编辑
            this.$emit('listEdit',e);
        },
        handleAdjust(i,e){  //列表 --> 调整部门
            __vBus.departmentAdjustArr=[];
            __vBus.departmentAdjust='';
            this.defaultCheckedArr = e.Sections;
            this.chooseDepartments_single = true;
            __vBus.departmentAdjust = e.m_id;
        },
        closeChooseDepartmentBox_single(...data){
            this.chooseDepartments_single = false;
        },
        handleDelete(i,e){    //列表-->移除
            let paramsObj = {
                mid: e.m_id,
                sid: this.departId,
                cid: __golbal_cid
            }
            this.$axios.post('/api/member/member/isDelAll',paramsObj).then((res)=>{
                if (res.data.code == 0){
                    const data = res.data.data;
                    if (data.isallow){
                        this.$confirm('移除 ' + data.info + ' 后，将彻底从企业彻底删除该成员，是否继续？','从部门移除',{
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(()=>{
                            this.$axios.post('/api/member/member/delMemberFromSection',paramsObj).then((res)=>{
                                if (res.data.code == 0){
                                    this.$message({
                                        type:'success',
                                        message: '删除成功！'
                                    });
                                    this.$emit('adjustUpload');
                                    this.getDepartmentPersonMsg(this.departId);
                                }else{
                                    this.$message.error(res.data.message);
                                }
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }).catch(()=>{
                        });

                    }else{
                        this.$confirm('是否将所选成员从该部门中移除？','从部门移除',{
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(()=>{
                            this.$axios.post('/api/member/member/delMemberFromSection',paramsObj).then((res)=>{
                                if (res.data.code == 0){
                                    this.$message({
                                        type:'success',
                                        message: '删除成功！'
                                    });
                                    this.$emit('adjustUpload');
                                    this.getDepartmentPersonMsg(this.departId);
                                }else{
                                    this.$message.error(res.data.message);
                                }
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }).catch(()=>{
                        });
                    }
                }else{
                    this.$message.error(res.data.message);
                }
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
        getDepartmentPersonMsg(id) {     //获取主页面列表信息
            if (id == 0){
                return false;
            }
            this.$axios.post('/api/member/member/membersList',{
                page: this.mainCurrentPage,
                sid: id,
                cid: __golbal_cid
            }).then((res)=>{
                if (res.data.code == 0){
                    const data = res.data.data;
                    this.tableData = data.listArr;
                    this.allDataNum = data.countRecords;
                    this.notActiveNum = data.notActiveNum;
                }else if(res.data.code == -100){
                    return false;
                }else{
                    if (this.isFirstGetDepartmentPersonMsg){
                        this.isFirstGetDepartmentMsg = false;
                        this.$emit('isFirstGetDepartmentMsg');
                        this.getDepartmentPersonMsg(this.organData[0].id);
                    }else{
                        this.$message.error(res.data.message);
                    }
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        resetList(){      //通知激活之后,触发列表更新
            this.getDepartmentPersonMsg(this.departId);
            this.$emit('adjustUpload');
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
            isFirstGetDepartmentPersonMsg: true,    //是不是第一次请求公司的数据
        }
    },
    computed :{
        checkIdArr: function (){
            let arr = [];
            this.checkArr.forEach((e,i)=>{
                arr.push(e.id);
            });
            return arr;
        }

    },
    components: {
        chooseDepartmentBox,    //选择部门的弹出框,带有机构数,结构树节点选择,结构树节点过滤和类似穿梭框之间的联动,有几个地方可以共用
        notifyPop,     //通知激活组件
    },
    props: ['organData','departId','mainTableFlag','closeChooseDepartmentBoxCheckId'],
    created (){
        this.getDepartmentPersonMsg(this.departId);
    },
    watch: {
        departId: function (val){
            this.mainCurrentPage = 1;
            this.getDepartmentPersonMsg(val);
        },
        mainTableFlag: function (val){
            this.mainCurrentPage = 1;
            this.getDepartmentPersonMsg(this.departId);
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
</style>

