<template>
<el-container class="organ-wrap clearfix">
    <!-- 侧边栏 -->
    <el-aside class="organ-left-wrap ts-aside" width="240px">
        <!-- 侧边栏搜索框 -->
        <el-input
            size="small"
            suffix-icon="el-icon-search"
            placeholder="搜索成员、部门"
            v-model="filterText"
            class="search-input">
        </el-input>
        <!-- 侧边栏切换按钮 -->
        <ul class="tab-router clearfix">
            <li @click="goOrgan">组织结构</li>
            <li class="act">角色</li>
        </ul>
        <div class="role-btn-box">
            <el-button type="primary" plain size="small" @click="goManagerRole">管理角色组</el-button>
            <el-button type="primary" plain size="small" @click="addRoleMethod">添加角色</el-button>
        </div>
        <!-- 侧边栏展示用结构树 -->
        <el-tree
            class="filter-tree organ-tree ts-tree"
            :data="roleData"
            node-key="id"
            :default-expanded-keys="tree0ExpandedKeys"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="true"
            @node-click="handleNodeClick"
            v-show="!isSearching">
        </el-tree>
        </div>
        <!-- 侧边栏用于搜素的结构树,不在前端展示 -->
        <el-tree
            v-show="isSecondTree"
            class="filter-tree"
            :data="roleAllData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            ref="tree1">
        </el-tree>
        <!-- 侧边栏搜索结果展示区域 -->
        <dl class="search-result-box" v-show="isSearching">
            <dt>成员:</dt>
            <dd v-for="(per,i) in searchResult.person" @click="getPersonDetail(per.id)" :key="i"> {{per.label}} </dd>
            <dt>角色:</dt>
            <dd v-for="(role, index) in searchResult.role" @click="getRoleDetail(role.id,role.label)" :key="index"> {{role.label}} </dd>
            <dt>角色组:</dt>
            <dd v-for="(team, index) in searchResult.team" :key="index"> {{team.label}} </dd>
        </dl>
    </el-aside>
    <!-- 内容主体区域 -->
    <el-main class="organ-right-wrap" v-if="firstOver">
        <role-content :roleData="roleData" :mainTableFlag="mainTableFlag" :departId="currentRole" @listAdjust="listAdjust" @adjustUpload="adjustUpload" :teamRole="teamRole">
            <!-- 插销中的头部按钮区域 -->
            <h4 class="content-head-box" slot="content-header"><b></b>{{currentRole.currentRoleName}}({{currentDepartmentMemberNum}}人)<el-button type="primary" plain @click="addPersonFlag = true;">添加成员</el-button><el-button type="primary" plain @click="editDepartmentAction">编辑角色</el-button></h4>
        </role-content>
        <!-- 一级弹框 == 编辑角色弹框 -->
        <el-dialog
            title="编辑角色"
            :visible.sync="editDepartmentVisible"
            width="600px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            center>
            <el-form ref="form" label-width="100px">
                <el-form-item label="角色名称" required>
                    <el-input v-model="editRoleName"></el-input>
                </el-form-item>
                <!-- 点击上级部门,弹出二级弹框(选择上级部门) -->
                <el-form-item label="角色组名称" required>
                    <el-input v-model="currentRole.currentRoleGroupName" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" plain @click="deleteDepartment">删 除</el-button>
                <el-button type="primary" @click="setEditDepartment">保 存</el-button>
                <el-button @click="editDepartmentVisible = false" plain>取 消</el-button>
            </span>
        </el-dialog>
    </el-main>
    <!-- 当进入角色中时,先行展示的页面 -->
    <el-main v-else class="role-preheat">
        <div class="role-preheat-box">
            <img src="../../../../static/img/fb_icon.png" class="fb-icon">
            <p class="fb-tip">通过角色可以将企业成员进行分类，并将角色应用到审批流程中，方便地进行流程管理。</p>
            <el-button type="primary" @click="addRoleMethod">添加角色</el-button>
        </div>
    </el-main>
    
    <!-- 添加角色 -->
    <el-dialog
        title="添加角色"
        :visible.sync="addRoleFlag"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>
        <el-form ref="form" :model="addRoleForm" label-width="100px">
            <el-form-item label="角色名称" required>
                <el-input v-model="addRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="所属角色组" required>
                <el-select v-model="addRoleForm.roleTeamName" placeholder="请选择" class="role-team-select">
                    <el-option
                    v-for="item in roleTeam"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addRole">保 存</el-button>
            <el-button @click="addRoleFlag = false">取 消</el-button>
        </span>
    </el-dialog>
    
    <!-- 角色模块中添加成员的弹框 -->
    <choose-person-box :chooseDepartments="addPersonFlag" :chooseData="organAllData" @closeChoosePerson="closeChoosePerson" @adjustUpload="adjustUpload" :currentRole="currentRole.currentRoleId" :roleDefaultArr="roleDefaultArr">
        <h4 slot="left-name" class="choose-department-h4">组织结构</h4>
        <h4 slot="right-name" class="choose-department-h4">已选成员</h4>
    </choose-person-box>
</el-container>
</template>

<script>
import chooseDepartmentBox from './chooseDepartmentBox';
import roleContent from './roleContent';
import choosePersonBox from './choosePersonBox';

export default {
    watch: {
        filterText(val) {     //搜索框数据
            this.searchResult.team.length = 0;
            this.searchResult.role.length = 0;
            this.searchResult.person.length = 0;
            if (val){
                this.isSearching = true;
            }else{
                this.isSearching = false;
            }
            this.$refs.tree1.filter(val);
        },
    },
    methods: {
        addRoleMethod(){      //添加角色的方法
            this.addRoleFlag = true;
            this.addRoleForm.roleTeamName = '';
        },
        filterNode(value, data) {    //过滤查找数方法
            if (!value) return true;
            if (data.label.indexOf(value) !== -1){
                if (data.isTeam){
                    this.searchResult.team.push(data);
                }else if (data.isPerson){
                    if (this.searchResult.person.length <= 0){
                        this.searchResult.person.push(data);
                    }else{
                        let flag = true;
                        for (var i =0; i < this.searchResult.person.length; i++){
                            if (this.searchResult.person[i].id == data.id){
                                flag = false;
                            }
                        }
                        if (flag){
                            this.searchResult.person.push(data);
                        }
                    }
                }else{
                    this.searchResult.role.push(data);
                }
            }
        },
        editDepartmentAction(){   //编辑角色按钮事件
            this.editRoleName = this.currentRole.currentRoleName;
            this.editDepartmentVisible = true;
        },
        handleNodeClick (data) {    //左边点击结构树操作
            if (data.isTeam){     //点击的是公司
                return false;
                this.currentRole.isTeam = true;
            }else{
                this.currentRole.isTeam = false;
            }
            this.firstOver = true;
            this.currentRole.currentRoleId = data.id;
            this.currentRole.currentRoleName = data.label;
            this.getDepartmentMsg();
            this.mainTableFlag = !this.mainTableFlag;
        },
        goOrgan(){   //跳转组织结构
            this.$router.push('/addressList');
        },
        goManagerRole(){    //跳转管理角色组页面
            this.$router.push('/addressList_managerole');
        },
        deleteDepartment(){    //编辑角色-->删除
            this.$confirm('是否确认删除该角色','删除该角色',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.post('/api/role/role/rmRole',{
                    r_id: this.currentRole.currentRoleId
                }).then((res)=>{
                    if (res.data.code == 0){
                        this.updateTreeDate();
                        this.getDepartmentMsg();
                        this.$message({
                            type:'success',
                            message: '成功删除该角色！'
                        });
                    }else{
                        this.$message.error(res.data.message);
                    }
                    this.editDepartmentVisible = false;
                }).catch((error)=>{
                    console.log(error);
                });
            }).catch((error)=>{
            });
        },
        setEditDepartment(){    //保存按钮==>编辑角色
            this.editRoleName = this.editRoleName.replace(/\s+/g,'');
            if (!this.editRoleName){
                this.$message({
                    type:'warnning',
                    message:'请输入角色名'
                });
                return false;
            }
            if (this.editRoleName.length > 20){
                this.$message({
                    type:'warnning',
                    message:'角色名输入内容过长'
                });
                return false;
            }
            const obj = {
                name: this.editRoleName,
                id: this.currentRole.currentRoleId,
            }
            this.$axios.post('/api/role/role/save',obj).then((res)=>{
                if (res.data.code == 0){
                    this.updateTreeDate();
                    this.getDepartmentMsg();
                    this.editDepartmentVisible = false;
                    this.$message({
                        type:'success',
                        message:'保存成功~'
                    });
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        closeChooseDepartmentBox(...data){   //接收组件触发的事件,关闭选择部门的组件
            this.chooseDepartments = false;
            if (data[0].length <= 0) return true;
            let arr = [],
                arr0 = [];
            data[0].forEach((e,i) => {
                arr.push(e.label);
                arr0.push(e.id);
            });

            this.addPersonForm.departmentId = arr0.join(',');
            this.addPersonForm.department = arr.join('，');
        },
        closeChoosePerson(){   //接收组件触发的事件,关闭添加成员的弹框
            this.addPersonFlag = false;
        },
        listAdjust(...data){
            this.chooseDepartments = true;
        },
        updateTreeDate(){     //更新结构树的数据
            this.$axios.post('/api/role/role/roles',{
                uid: __golbal_uid,
                cid: __golbal_cid
            }).then((res)=>{
                if (res.data.code == 0){    //将所有结构树进行更新
                    const data = res.data.data;
                    this.roleData = data.roleData;
                    this.roleAllData = data.roleAllData;
                    this.teamRole = data.roleSelect;
                    this.roleTeam = data.roleTeam;
                    // this.currentRole.currentRoleId = data.roleData[0].children[0].id;
                    // this.currentRole.currentRoleName = data.roleData[0].children[0].label;
                    this.organAllData = data.organAllData;
                    this.getDepartmentMsg();
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        getDepartmentMsg(){   //获取角色或角色组信息
            if (!this.currentRole.currentRoleId){
                return false;
            }
            this.$axios.post('/api/role/role/getOptInfo',{
                cid: __golbal_cid,
                role_id: this.currentRole.currentRoleId,
            }).then((res)=>{
                if (res.data.code == 0){
                    const data = res.data.data;
                    // this.currentRole.currentRoleId = data.id;
                    this.currentRole.currentRoleName = data.name;
                    this.currentRole.isTeam = data.isTeam;
                    this.currentRole.currentRoleGroupName = data.group_name;
                    this.currentDepartmentMemberNum = data.count;
                    this.editRoleName = data.name;
                    this.roleDefaultArr = data.members;
                }else{
                    this.$message.error(res.data.data);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        adjustUpload(){    //调整部门完成,进行页面信息更新
            this.updateTreeDate();
            this.getDepartmentMsg();
            this.mainTableFlag = !this.mainTableFlag;
        },
        /*  角色面板的方法  */
        addRole(){    //添加角色-->保存
            this.addRoleForm.roleName = this.addRoleForm.roleName.replace(/\s+/g,'');
            if (!this.addRoleForm.roleName){
                this.$message({
                    message:'请填写角色名~',
                    type:'warnning'
                });
                return false;
            }
            if (this.addRoleForm.roleName.length > 20){
                this.$message({
                    type:'warnning',
                    message:'角色名输入内容过长'
                });
                return false;
            }
            if (!this.addRoleForm.roleTeamName){
                this.$message({
                    message:'请选择所属角色组~',
                    type:'warnning'
                });
                return false;
            }
            const obj = {
                cid : __golbal_cid,
                name: this.addRoleForm.roleName,
                gid: this.addRoleForm.roleTeamName,
            };
            this.$axios.post('/api/role/role/save',obj).then((res)=>{
                if (res.data.code == 0){
                    this.$message({
                        message:'添加角色成功',
                        type:'success'
                    });
                    this.updateTreeDate();
                    this.addRoleForm.roleName = '';      //添加角色成功之后,将状态重置
                    this.addRoleForm.roleTeamName = ''; 
                }else{
                    this.$message.error(res.data.message);
                }
                this.addRoleFlag = false;
            }).catch((error)=>{
                console.log(error);
            });
        },
        getPersonDetail(id){    //点击左边结构树搜索出来的人物,跳转到组织结构面板,人物编辑页面
            sessionStorage.setItem('organ_id',id);
            this.$router.push('/organ?personDetail');
        },
        getRoleDetail(id,name){     //点击搜索出来的角色,页面切换到所选角色的列表
            this.currentRole.currentRoleId = id;
            this.currentRole.currentRoleName = name;
            this.getDepartmentMsg();
            this.mainTableFlag = !this.mainTableFlag;
        }
        
    },
    data() {
        return {
            /* 用来判断弹框弹出状态的变量 */
            editDepartmentVisible: false,  //编辑部门弹框是否显示
            chooseDepartments: false,    //添加成员-->是否显示部门选择弹框
            mainTableFlag: false,   //专门用来父级改变原来的值,子级组件监控它是否变化,来确定是否更新整个列表信息
            firstOver: false,    //进入角色页面时候,先要进入一个引导页面,当点击左边的结构树的时候,关闭引导页面,显示角色人物列表
            currentRole: {    //当前角色数选中信息
                currentRoleId: '',     //角色的id
                isTeam: true,     //是否是角色组
                currentRoleName: '',    //角色的名字
                currentRoleGroupName: '',     //当前角色组的名字
            },
            currentDepartmentMemberNum: '',    //当前部门的人数
            isSecondTree: false,     //是否是专门用来过滤的结构树,这个不进行展示,只是套用element-ui现有的过滤功能
            searchResult:{   //搜索结果
                team:[],    //角色组
                person:[],    //人物
                role:[],     //角色
            },

            isSearching: false,   //搜索结果
            filterText: '',   //侧边栏过滤文案
            roleData: null,     //组织结构树数据-->人数+部门(用来进行左边结构树展示)
            roleAllData: null,    //组织结构树数据-->部门+人(用来进行左边结构树的搜索查询)
            teamRole: null,      //单独的角色组的信息
            defaultProps: {      //element-ui树形结构的设置参数
                children: 'children',
                label: 'label'
            },
            temCharge: [],    //临时确定下来的主管人员,作用和上面的变量类似
            multipleSelection: [],
            defaultCheckedArr: [],     //编辑部门弹框默认选项
            editDepartmentForm: {    //编辑部门表单
                departmentName: '',   //部门名称
                superiorDepartment: '',    //上级部门,此选项主要用来前端展示
                superiorDepartmentId: '',   //上级部门id
                chargePerson: '',    //主管人员,此选项主要用来前端展示
                chargePersonId: '',     //主管人员id数组
                isHideDepartment: '0',   //隐藏部门,'0'表示否,'1'表示是
            },
            addPersonForm: {    //添加成员表单
                name: '',    //新添加成员的姓名
                sex: '1',    //性别
                phone: '',   //手机号
                mail: '',     //邮箱
                department: '',   //部门
                departmentId: '',   //选中部门的id数组,转成,隔开的字符串
                job: '',   //职位
                jobNum: '',   //工号
                joinTime: '',  //入职时间
                comment: '',   //备注
                isSure: false     //是否已经激活,如果已经激活,则无法在后台更改激活的手机号
            },
            /* 角色的特有的变量 */
            addRoleFlag: false,    //添加角色的弹框是否显示
            editRoleFlag: false,    //编辑角色的弹框是否显示
            addRoleForm: {    //添加角色表单
                roleName: '',    //角色名
                roleTeamName: '',    //角色组名称
            },
            editRoleName: '',    //编辑角色-->角色名称
            addPersonFlag: false,    //角色模块中用来控制添加成员弹框是否显示
            organAllData: null,     //添加成员的结构树的信息
            roleTeam: null,      //所有角色组+角色的信息,给调整角色的弹框提供数据支持
            roleDefaultArr:[],     //当前部门默认有的人
        };
    },
    computed:{
        tree0ExpandedKeys : function (){     //计算出侧边栏展示出的第一个节点
            let arr = [];
            if (this.roleData === null || this.roleData.length <= 0){
                return arr;
            }
            arr.push(this.roleData[0].id);
            return arr;
        }

    },
    created(){
        this.updateTreeDate();
        __vBus.departmentAdjustArr = [];
        __vBus.departmentAdjust = '';
    },
    components: {
        roleContent,   //内容主体(主要是表格)的组件
        chooseDepartmentBox,    //选择部门的弹出框,带有机构数,结构树节点选择,结构树节点过滤和类似穿梭框之间的联动,有几个地方可以共用
        choosePersonBox,     //角色模块中添加成员的弹框
    }
}
</script>

<style lang="scss">
.organ-wrap{
    overflow: hidden;
    ul,li{
        list-style: none;
    }
    height: 100%;
    width: 100%;
    .organ-left-wrap{
        height: 100%;
        background-color: #333744;
        width: 240px;
        min-width: 240px;
        color: #fff;
        font-size: 14px;
        padding-top: 20px;
        .tab-router{
            width: 100%;
            height: 53px;
            li{
                cursor: pointer;
                float: left;
                width: 50%;
                height: 53px;
                box-sizing: border-box;
                border-bottom-width: 4px;
                border-bottom-style: solid;
                border-bottom-color: #333744;
                text-align: center;
                line-height: 49px;
            }
            li.act{
                background-color: #4e556c;
                border-bottom-color: #409eff;
            }
        }
        .search-input{
            width: 220px;
            height: 32px;
            margin-left: 10px;
            margin-bottom: 18px;
            .el-input__inner{
                height: 32px;
                line-height: 32px;
                font-size: 14px;
                border-radius: 18px;
            }
            .el-input__icon{
                font-size: 18px;
                color: #409eff;
            }
        }
        .organ-tree{
            background-color: #333744;
            color: #fff;
            .el-tree-node__content{
                height: 52px;
                background-color: #333744;
                .el-tree-node__expand-icon{
                    font-size: 25px;
                }
            }
            & .el-tree-node__content.el-tree-node__content:hover{
                background-color: #4e556c;
                // 409eff
            }
            .el-tree-node__children{
                .el-tree-node__content{
                    background-color: #333744;
                }
            }

        }
        .search-result-box{
            font-size: 14px;
            padding-left: 10px;
            dt{
                height: 30px;
                line-height: 30px;
                font-weight: 900;
                color: #409eff;
                margin-top: 20px;
            }
            & dt:first-child{
                margin-top: 0;
            }
            dd{
                height: 52px;
                line-height: 52px;
                cursor: pointer;
                padding-left: 18px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            & dd:hover{
                background-color: #4e556c;
            }
        }
    }
    .is-current.is-current.is-current>.el-tree-node__content{
        background-color: #409eff;
    }
    .organ-right-wrap{
        min-width: 400px;
        overflow: scroll;
        .hide-department-tip{
            font-size: 12px;
            color: #878d99;
            margin-left: 15px;
        }
        .dissolve-group{
            margin-left: 15px;
        }
    }
    .el-main{
        padding: 0;
    }

}
.choose-department-box{
    overflow-y: scroll;
    max-height: 300px;
    background-color: #f00;
    .choose-department-tree{
        .el-tree-node__content{
            height: 52px;
            .el-tree-node__expand-icon{
                font-size: 25px;
            }
        }
    }
    .is-current>.el-tree-node__content{
        background-color: #409eff;
    }
}
.choose-charge-box{
    text-align: center;
    .el-transfer div{
        text-align: left;
    }
}
.charge-input input{
    white-space: nowrap;
    text-overflow: ellipsis;
}
.batch-add-person{
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
    .add-person-wrap{
        padding: 10px 40px;
        p{
            font-size: 12px;
            color: #409eff;
            line-height: 32px;
        }
        dl{
            margin-top: 20px;
            font-size: 14px;
            line-height: 32px;
            dt{
                margin-top: 30px;
            }
            dd button{
                margin-top: 15px;
            }
        }
        .footer-button-box{
            margin-top: 50px;
        }
    }
    .add-person-wrap0{
        width: 800px;
    }
}
.add-person{
    .add-person-form-wrap{
        margin-top: 20px;
        width: 600px;
    }
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
}
.choose-department-h4{
    font-size: 14px;
    font-weight: 900;
    line-height: 30px;
}
.isSureTips{
    font-size: 12px;
    line-height: 15px;
    color: #959595;
}
.role-btn-box{
    text-align: center;
    padding: 10px 0 0;
}
.role-team-select{
    width: 100%;
}
.ts-aside{
    overflow-x: hidden;
    position: relative;
    .ts-tree{
        position: absolute;
        overflow-x: scroll;
        width: 100%;
        left: 0;
        top: 175px;
        bottom: 0;
    }
}
.role-preheat{
    position: relative;
    text-align: center;
    .role-preheat-box{
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        margin-top: -150px;
        .fb-icon{
            display: block;
            margin: 0 auto 20px;
            height: 147px;
        }
        .fb-tip{
            line-height: 20px;
            height: 20px;
            text-align: center;
            font-size: 14px;
            color: #999;
            margin-bottom: 20px;
        }
    }
}
</style>



