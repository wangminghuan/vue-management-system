<template>
<el-container class="organ-wrap clearfix">
    <!-- 侧边栏 -->
    <!-- <el-aside class="organ-left-wrap ts-aside" width="240px"> -->
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
            <li class="act">组织结构</li>
            <li @click="goRole">角色</li>
        </ul>
        <!-- 侧边栏展示用结构树 -->
        <div class="side-tree-wrap">
        <el-tree
            class="filter-tree organ-tree ts-eltree"
            :data="organData"
            node-key="id"
            :default-expanded-keys="tree0ExpandedKeys"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            v-show="!isSearching">
        </el-tree>
        </div>
        <!-- 侧边栏用于搜素的结构树,不在前端展示 -->
        <el-tree
            v-show="isSecondTree"
            class="filter-tree"
            :data="organAllData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            ref="tree1">
        </el-tree>
        <!-- 侧边栏搜索结果展示区域 -->
        <dl class="search-result-box" v-show="isSearching">
            <dt>成员:</dt>
            <dd v-for="(per,i) in searchResult.person" :key="i" @click="searchPersonDetail(per.m_id)"> {{per.label}} </dd>
            <dt v-show="!isSearchingPhone">部门:</dt>
            <dd v-show="!isSearchingPhone" v-for="(depart, index) in searchResult.department" @click="searchDepartmentDetail(depart)" :key="index"> {{depart.label}} </dd>
        </dl>
    </el-aside>
    <!-- 内容主体区域 -->
    <el-main class="organ-right-wrap" v-show="!isBatchAddPerson && !isAddPerson">
        <organ-content :organData="organMessage" :mainTableFlag="mainTableFlag" :departId="currentDepartmentId" @listEdit="listEdit" @listAdjust="listAdjust" @adjustUpload="adjustUpload" @isFirstGetDepartmentMsg="isFirstGetDepartmentMsg">
            <!-- 插销中的头部按钮区域 -->
            <h4 class="content-head-box" slot="content-header"><b></b>{{currentDepartment}}({{currentDepartmentMemberNum}}人)<el-button type="primary" plain @click="addMember">添加成员</el-button><el-button type="primary" @click="batchAddPersonBtn" plain>批量添加成员</el-button><el-button type="primary" @click="addSonDepartment" plain>添加子部门</el-button><el-button type="primary" plain @click="editDepartmentAction" v-show="!currentDepartmentIsZhiShu">编辑部门</el-button><el-button type="primary" plain @click="setCharger = true;" v-show="currentDepartmentIsZhiShu">设置主管</el-button></h4>
        </organ-content>
        <!-- 一级弹框 == 编辑部门弹框 -->
        <el-dialog
            title="编辑部门"
            :visible.sync="editDepartmentVisible"
            width="600px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            center>
            <!-- 二级弹框 == 选择上级部门 -->
            <el-dialog
                width="600px"
                title="选择上级部门"
                :visible.sync="selectSuperiorDepartment"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                center
                append-to-body>
                <div class="choose-department-box">
                    <!-- 选择上级部门中的结构树 -->
                    <el-tree
                        :default-expanded-keys="tree0ExpandedKeys"
                        node-key="id"
                        class="filter-tree choose-department-tree"
                        :data="organMessage"
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        @node-click="chooseDepartment">
                    </el-tree>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="setSuperiorDepartment">确 定</el-button>
                    <el-button @click="selectSuperiorDepartment = false" plain>取 消</el-button>
                </span>
            </el-dialog>
            <!-- 二级弹框 == 选择主管 -->
            <el-dialog
                width="800px"
                title="选择主管"
                center
                :visible.sync="selectChargePerson"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                append-to-body>
                <div class="choose-charge-box">
                    <!-- 选择主管中的穿梭框 -->
                    <el-transfer
                        v-model="temCharge" 
                        :data="personMessage"
                        :titles="['部门成员', '主管人员']"
                        :button-texts="['取消主管','选为主管']">
                    </el-transfer>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="setChargePerson">确 定</el-button>
                    <el-button @click="selectChargePerson = false" plain>取 消</el-button>
                </span>
            </el-dialog>
            <el-form ref="form" :model="editDepartmentForm" label-width="100px">
                <el-form-item label="部门名称" required>
                    <el-input v-model="editDepartmentForm.departmentName" :maxlength="20"></el-input>
                </el-form-item>
                <!-- 点击上级部门,弹出二级弹框(选择上级部门) -->
                <el-form-item label="上级部门" required>
                    <el-input v-model="editDepartmentForm.superiorDepartment" @focus="selectSuperiorDepartment = true" readonly></el-input>
                </el-form-item>
                <!-- 点击主管,弹出二级弹框(选择主管) -->
                <el-form-item label="主管">
                    <el-input v-model="editDepartmentForm.chargePerson" @focus="selectChargePerson = true" readonly class="charge-input"></el-input>
                </el-form-item>
                <el-form-item label="隐藏部门">
                    <el-radio v-model="editDepartmentForm.isHideDepartment" label="1">是</el-radio>
                    <el-radio v-model="editDepartmentForm.isHideDepartment" label="0">否</el-radio>
                    <span class="hide-department-tip">隐藏部门后，他人无法从通讯录看到此部门</span>
                </el-form-item>
                <el-form-item label="部门群" v-if="editDepartmentForm.haveDepartment == '1'">
                    {{editDepartmentForm.groupNum}}人<el-button type="danger" style="margin-left:10px;" size="mini" @click="dissolveGroup">解散部门群</el-button>
                </el-form-item>
                <el-form-item label="建立部门群" v-else>
                    <el-radio v-model="editDepartmentForm.setDepartmentGrouu" label="1">是</el-radio>
                    <el-radio v-model="editDepartmentForm.setDepartmentGrouu" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="包含子部门" v-if="editDepartmentForm.setDepartmentGrouu == '1'">
                    <el-radio v-model="editDepartmentForm.setChildrenGrouu" label="1">是</el-radio>
                    <el-radio v-model="editDepartmentForm.setChildrenGrouu" label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" plain @click="deleteDepartment">删 除</el-button>
                <el-button type="primary" @click="setEditDepartment">保 存</el-button>
                <el-button @click="editDepartmentVisible = false" plain>取 消</el-button>
            </span>
        </el-dialog>

        <!-- 一级弹框==设置主管 -->
        <el-dialog
            width="800px"
            title="设置主管"
            center
            :visible.sync="setCharger"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body>
            <div class="choose-charge-box">
                <!-- 选择主管中的穿梭框 -->
                <el-transfer
                    v-model="temCharger" 
                    :data="personMessage"
                    :titles="['部门成员', '主管人员']"
                    :button-texts="['取消主管','选为主管']">
                </el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setChargerOk">确 定</el-button>
                <el-button @click="setCharger = false" plain>取 消</el-button>
            </span>
        </el-dialog>

        <!-- 一级弹框==添加子部门 -->
        <el-dialog
            title="添加子部门"
            :visible.sync="addSubdivisionVisible"
            width="530px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            center>
            <el-form ref="form" :model="addSubdivisionForm" label-width="100px">
                <el-form-item label="部门名称" required>
                    <el-input v-model="addSubdivisionForm.departmentName" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" required>
                    <el-input v-model="currentDepartmentFB" disabled></el-input>
                </el-form-item>
                <el-form-item label="隐藏部门">
                    <el-radio v-model="addSubdivisionForm.isHideDepartment" label="1">是</el-radio>
                    <el-radio v-model="addSubdivisionForm.isHideDepartment" label="0">否</el-radio>
                    <span class="hide-department-tip">隐藏部门后，他人无法从通讯录看到此部门</span>
                </el-form-item>
                <el-form-item label="建立部门群">
                    <el-radio v-model="addSubdivisionForm.setDepartmentGrouu" label="1">是</el-radio>
                    <el-radio v-model="addSubdivisionForm.setDepartmentGrouu" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="包含子部门" v-if="addSubdivisionForm.setDepartmentGrouu == '1'">
                    <el-radio v-model="addSubdivisionForm.setChildrenGrouu" label="1">是</el-radio>
                    <el-radio v-model="addSubdivisionForm.setChildrenGrouu" label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setAddSubdivision">保 存</el-button>
                <el-button @click="addSubdivisionVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </el-main>
    <el-main v-show="isBatchAddPerson && !isAddPerson" class="batch-add-person">
        <h4 class="content-head-box"><b></b>批量导入成员</h4>
        <div class="add-person-wrap add-person-wrap0" v-show="preUpdata">
            <p>温馨提示：</p>
            <p>1. 每次最多导入200名成员</p>
            <p>2. 子管理员仅能上传有权限范围内的部门成员</p>
            <dl>
                <dt>1. 请先下载成员通讯录模版，按格式批量填写成员信息</dt>
                <dd>
                    <el-button type="primary" @click="dowModel" plain>下载模板</el-button>
                </dd>
                <dt>2.导入文件</dt>
                <dd>
                    <el-upload
                        ref="upload"
                        class="upload-demo"
                        :data="params"
                        :action="uploadUrl"
                        multiple
                        :on-success="uploadSuccess"
                        :auto-upload="false"
                        accept=".xls,.xlsx"
                        :fileList='fileList'
                        :limit="1">
                        <el-button type="primary" plain>点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
                    </el-upload>
                </dd>
            </dl>
            <div class="footer-button-box">
                <el-button type="primary" @click="sureLeadingIn">确定导入</el-button>
                <el-button type="primary"  plain @click="isBatchAddPerson = false">返回</el-button>
            </div>
        </div>
        <leading-in-content class="add-person-wrap" v-if="!preUpdata" @goback="goBack" :uploadData="uploadResult"></leading-in-content>
        
    </el-main>
    <el-main v-show="isAddPerson" class="add-person">
        <!-- 当时编辑成员信息时,显示上面的,反之则显示下面的 -->
        <h4 class="content-head-box" v-if="isEditPersonMsg"><b></b>编辑成员信息<el-button @click="editPersonCancel">取消</el-button><el-button type="primary" plain @click="editPersonSave">保存</el-button><el-button type="danger" @click="thoroughDeletePerson">彻底删除成员</el-button></h4>
        <h4 class="content-head-box" v-else><b></b>添加成员<el-button @click="addPersonCancel">取消</el-button><el-button type="primary" plain @click="addPersonSave">保存</el-button><el-button type="primary" @click="saveAndContinue">保存并继续添加</el-button></h4>
        <div class="add-person-form-wrap">
            <el-form ref="form" :model="addPersonForm" label-width="120px">
                <el-form-item label="姓名" required>
                    <el-input v-model="addPersonForm.name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="addPersonForm.sex" label="1">男</el-radio>
                    <el-radio v-model="addPersonForm.sex" label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="手机" required>
                    <el-input v-model.number="addPersonForm.phone" :disabled="addPersonForm.isSure" placeholder="手机号一旦创建，不可更改"></el-input>
                    <span v-if="addPersonForm.isSure" class="isSureTips">手机号不可修改</span>
                </el-form-item>
                <el-form-item label="邮箱" prop="mail"
                    :rules="[
                        {type: 'email', message: '请输入正确的邮箱地址'}
                    ]"
                    >
                    <el-input v-model="addPersonForm.mail"></el-input>
                </el-form-item>
                <el-form-item label="部门" required>
                    <el-input v-model="addPersonForm.department" @focus="departmentOpen" readonly></el-input>
                </el-form-item>
                <el-form-item label="职位">
                    <el-input v-model="addPersonForm.job"></el-input>
                </el-form-item>
                <el-form-item label="职级">
                    <el-select v-model="addPersonForm.station" placeholder="请选择职级">
                        <el-option
                        v-for="item in personStationOption"
                        :key="item.s_id"
                        :label="item.s_name"
                        :value="item.s_id">
                        </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工号">
                    <el-input v-model="addPersonForm.jobNum"></el-input>
                </el-form-item>
                <el-form-item label="入职时间">
                    <el-date-picker
                        v-model="addPersonForm.joinTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addPersonForm.comment"></el-input>
                </el-form-item>
                <el-form-item label="发送通知激活">
                    <el-switch v-model="isSendNotify"></el-switch>
                </el-form-item>
               
            </el-form>
        </div>
        <!-- 添加成员 ==> 选择部门弹框 -->
        <choose-department-box :defaultCheckArr="defaultCheckedArr" :chooseDepartments="chooseDepartments" @closeChooseDepartment="closeChooseDepartmentBox" :chooseData="organMessage">
            <h4 slot="left-name" class="choose-department-h4">组织结构</h4>
            <h4 slot="right-name" class="choose-department-h4">已选部门</h4>
        </choose-department-box>
    </el-main>
</el-container>
</template>

<script>
import chooseDepartmentBox from './chooseDepartmentBox';
import leadingInContent from './leadingInContent';
import organContent from './organContent';
export default {
    watch: {
        filterText(val) {     //搜索框数据
            this.searchResult.department.length = 0;
            this.searchResult.person.length = 0;
            if (val){
                this.isSearching = true;
            }else{
                this.isSearching = false;
            }
            this.$refs.tree1.filter(val);
        },
        currentDepartmentId(val){    //一旦用户操作左边的树形列表,右边的内容要实时显示所在部门的内容,最主要的是请求到在这个部门里的所有人
            // 请求所有相关部门里的人
            //请求当前是什么部门和部门里多少人
        }
    },
    methods: {
        filterNode(value, data) {    //过滤查找数方法
            if (!value) return true;
            if (data.phoneNum.indexOf(value) !== -1){     //优先匹配手机号
                this.isSearchingPhone = true;
                if (this.searchResult.person.length <= 0){
                    this.searchResult.person.push(data);
                }else{
                    let flag = true;
                    for (var i =0; i < this.searchResult.person.length; i++){
                        if (this.searchResult.person[i].m_id == data.m_id){
                            flag = false;
                        }
                    }
                    if (flag){
                        this.searchResult.person.push(data);
                    }
                }
            }else if (data.label.indexOf(value) !== -1){    //过滤搜索人名和部门名称
                this.isSearchingPhone = false;
                if (data.isgather){          //过滤掉重复存在的数据
                    if (this.searchResult.department.length <= 0){
                        this.searchResult.department.push(data);
                    }else{
                        let flag = true;
                        for (var i =0; i < this.searchResult.department.length; i++){
                            if (this.searchResult.department[i].id == data.id){
                                flag = false;
                            }
                        }
                        if (flag){
                            this.searchResult.department.push(data);
                        }
                    }
                }else{
                    if (this.searchResult.person.length <= 0){
                        this.searchResult.person.push(data);
                    }else{
                        let flag = true;
                        for (var i =0; i < this.searchResult.person.length; i++){
                            if (this.searchResult.person[i].m_id == data.m_id){
                                flag = false;
                            }
                        }
                        if (flag){
                            this.searchResult.person.push(data);
                        }
                    }
                }
            }else{
                this.isSearchingPhone = false;
            }
            
        },
        editDepartmentAction(){   //编辑部门按钮事件
            /*if (this.currentDepartmentId == 0){    //当现在处于整个公司的情况下,编辑部门按钮不可点击;
                this.$message({
                    type:'warning',
                    message: '当前部门不可编辑！'
                });
                return false;
            }*/
            if (this.currentDepartmentIsZhiShu){
                this.$message({
                    type:'warning',
                    message: '公司直属部门不可编辑！'
                });
                return false;
            }
            if (this.currentDepartmentIsZhiShu){
                this.$message({
                    type:'warning',
                    message: '公司直属部门不可编辑！'
                });
                return false;
            }
            this.editDepartmentForm.departmentName = this.currentDepartment;
            this.editDepartmentVisible = true;
        },
        addSonDepartment(){
            /*if (this.currentDepartmentIsZhiShu && this.currentDepartmentId != '0'){
                this.$message({
                    type:'warning',
                    message: '公司直属部门不可添加子部门！'
                });
                return false;
            }*/
            this.addSubdivisionForm.isHideDepartment = '0';
            this.addSubdivisionForm.setDepartmentGrouu = '0';
            this.addSubdivisionForm.setChildrenGrouu = '0';
            this.addSubdivisionForm.departmentName = '';
            this.addSubdivisionVisible = true
        },
        handleDelete(index,rows){    //单条移除
            this.$confirm('是否将该成员从该部门中移除？','从部门移除',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.tableData.splice(index,1);
                this.$message({
                    type:'success',
                    message: '删除成功！'
                });
            }).catch(()=>{
            });
        },
        handleNodeClick (data) {    //左边点击结构树操作
            /*if (data.isCompany == 1){     //点击的是公司
                this.currentDepartmentId = 0;
            }else{
                this.currentDepartmentId = data.id;
            }*/
            this.currentDepartmentId = data.id;
            if (data.isCompany){
                this.currentDepartmentIsZhiShu = true;
            }else{
                this.currentDepartmentIsZhiShu = false;
            }
            this.isAddPerson = false;
            this.isBatchAddPerson = false;
            this.getDepartmentMsg(this.currentDepartmentId);
        },
        goRole(){   //跳转角色
            this.$router.push('/addressList_role');
        },
        chooseDepartment(data){   //选择上级部门中的二级弹框,触发条件,此方法中的data为点击节点的对象
            this.temDepartment = data;
        },
        setSuperiorDepartment(){     //承接上面这个方法,将中转对象的信息赋值给from表单
            this.editDepartmentForm.superiorDepartment = this.temDepartment.label;
            this.editDepartmentForm.superiorDepartmentId = this.temDepartment.id;
            this.selectSuperiorDepartment = false;
        },
        setChargePerson(){   //编辑部门中,真正设置主管的方法
            /*穿梭框只能获取到你选中项的key,要想得到id对应的人名,需要把数据重新梳理一下*/
            const cal1 = _ => {       //操操操操操操操 
                const data = [];
                this.personMessage.forEach((e,i)=>{
                    if (this.temCharge.indexOf(e.key) >= 0){
                        data.push(e.label);
                    }
                });
                return data.join('，');
            };
            const cal2 = _ => {
                const data = [];
                this.temCharge.forEach((e,i) => {
                    const num = e.split('___')[0];
                    data.push(num);
                });
                return data.join(',');
            };
            this.editDepartmentForm.chargePerson = cal1();
            this.editDepartmentForm.chargePersonId = cal2();
            this.selectChargePerson = false;
        },
        setChargerOk(){   //一级弹框 设置主管  设置主管的方法
            this.setCharger = false;
            console.log(this.temCharger);
            console.log(this.currentDepartmentId);
            this.$axios.post('/api/member/member/managerSet',{
                mid: this.temCharger,
                sid: this.currentDepartmentId
            }).then((res)=>{
                if (res.data.code == 0){
                    this.mainTableFlag = !this.mainTableFlag;
                    this.getDepartmentMsg(this.currentDepartmentId);
                    this.$message({
                        type:'success',
                        message:'保存成功'
                    });
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });

        },
        deleteDepartment(){    //删除该部门
            if (this.personMessage.length > 0){    //先判断当前部门中是否还有人员
                this.$alert('请先移除该部门及其子部门下的成员，再进行操作！','删除失败！');
                return false;
            }
            this.$confirm('是否确认删除该部门','删除该部门',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.post('/api/section/section/del',{
                    currentDepartmentId: this.currentDepartmentId,
                    VS: this.currentDepartmentId
                }).then((res)=>{
                    if (res.data.code == 0){
                        this.$message({
                            type:'success',
                            message: '成功删除该部门！'
                        });
                        this.updateTreeDate();
                        this.editDepartmentVisible = false;
                        
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                })
            }).catch(()=>{
                console.log(error);
            });
        },
        setEditDepartment(){    //保存按钮==>编辑部门
            this.editDepartmentForm.departmentName = this.editDepartmentForm.departmentName.replace(/\s+/g,'');
            if (this.editDepartmentForm.departmentName.length > 20){
                this.$message({
                    type:'warning',
                    message:'部门名称过长，最多20个字'
                });
                return false;
            }
            if (this.editDepartmentForm.departmentName.length <= 0){
                this.$message({
                    type:'warning',
                    message:'部门名称不能为空'
                });
                return false;
            }
            const obj = this.editDepartmentForm;
            obj.currentDepartment = this.editDepartmentForm.departmentName;
            obj.currentDepartmentId = this.currentDepartmentId;
            obj.cid = __golbal_cid;
            obj.VS = this.currentDepartmentId;
            this.$axios.post('/api/section/section/update',obj).then((res)=>{
                if (res.data.code == 0){
                    this.updateTreeDate();
                    this.mainTableFlag = !this.mainTableFlag;
                    this.getDepartmentMsg(this.currentDepartmentId);
                    this.editDepartmentVisible = false;
                    this.$message({
                        type:'success',
                        message:'保存成功~'
                    });
                    this.currentDepartmentFB = this.currentDepartment;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        setAddSubdivision(){   //保存按钮==>添加子部门
            this.addSubdivisionForm.departmentName = this.addSubdivisionForm.departmentName.replace(/\s+/g,'');
            if (this.addSubdivisionForm.departmentName.length > 20){
                this.$message({
                    type:'warning',
                    message:'部门名称过长，最多20个字'
                });
                return false;
            }
            if (this.addSubdivisionForm.departmentName.length <= 0){
                this.$message({
                    type:'warning',
                    message:'部门名称不能为空'
                });
                return false;
            }
            const obj = this.addSubdivisionForm;
                obj.cid = __golbal_cid;
                obj.superiorDepartmentId = this.currentDepartmentId;
            this.$axios.post('/api/section/section/add',obj).then((res)=>{
                if (res.data.code == 0){
                    this.addSubdivisionVisible = false;
                    this.$message({
                        type:'success',
                        message: '添加子部门成功~'
                    });
                    /* 因为添加了新的子部门,需要把左边的结构树重新进行更新  */
                    this.updateTreeDate();
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        batchAddPersonBtn(){    //批量添加成员按钮
            this.fileList = [];
            this.isBatchAddPerson = true;
        },
        dowModel(){    //下载模板
            location.href = 'http://'+( window.location.hostname=="open.inswindows.com"? "s29.9956.cn":"s29.dev.bxd365.com")+'/res/crowdsource/docs/ImportTemplet.xlsx?v=20180312';
        },
        sureLeadingIn (){   //批量添加成员-->确认导入
            this.$refs.upload.submit();
        },
        uploadSuccess(res,f,fl){     //上传成功之后的回调
            if (res.code == 0){
                this.uploadResult = res.data;
                this.preUpdata = false;
                this.adjustUpload();     //信息更新
                // this.updateTreeDate();
            }else{
                this.$message.error(res.message);
            }
        },
        goBack(){    //批量添加成员-->返回
            this.preUpdata = true;
            this.isBatchAddPerson = false;
        },
        closeChooseDepartmentBox(...data){   //接收组件触发的事件,关闭选择部门的组件
            this.chooseDepartments = false;
            if (!data[0]){
                return false;
            }
            if (data[0].length <= 0){
                this.addPersonForm.departmentId = [];
                this.addPersonForm.department = '';
                return false;
            };
            let arr = [],
                arr0 = [];
            data[0].forEach((e,i) => {
                arr.push(e.label);
                arr0.push(e.id);
            });

            this.addPersonForm.departmentId = data[0];
            this.addPersonForm.department = arr.join('，');
        },
        addMember(){
            this.isAddPerson = true; 
            this.isEditPersonMsg = false;
            /* 添加成员ajax */
            this.addPersonForm.name = '';
            this.addPersonForm.sex = '1';            
            this.addPersonForm.phone = '';
            this.addPersonForm.mail = '';
            this.addPersonForm.station = '';
           /*if (this.currentDepartmentId == '0'){
                this.addPersonForm.department = '';
                this.addPersonForm.departmentId = '0';
                this.defaultCheckedArr = [];
            }else{*/
                this.addPersonForm.department = this.currentDepartment;
                this.addPersonForm.departmentId = this.currentDepartmentId;
                let arr = [],
                    obj = {
                        id: this.currentDepartmentId,
                        label: this.currentDepartment
                    };
                arr.push(obj);
                this.defaultCheckedArr = arr;
        /*}*/
            this.addPersonForm.job = '';
            this.addPersonForm.jobNum = '';
            this.addPersonForm.joinTime = '';
            this.addPersonForm.comment = '';
            this.addPersonForm.isSure = false;
        },
        saveAndContinue (){     //添加成员-->保存并继续添加
            let addObj = this.addPersonForm;
            if (Array.isArray(addObj.departmentId)){
                let arr = [];
                addObj.departmentId.forEach((e,i)=>{
                    arr.push(e.id);
                });
                addObj.departmentId = arr;
            }
            if (!this.addPersonForm.name){
                this.$message({
                    type:'warnning',
                    message:'请输入姓名'
                });
                return false;
            }
            if (this.addPersonForm.name.length >20){
                this.$message({
                    type:'warnning',
                    message:'姓名输入内容过长'
                });
                return false;
            }
            if (!this.addPersonForm.phone){
                this.$message({
                    type:'warnning',
                    message:'请输入手机号'
                });
                return false;
            }
            if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.addPersonForm.phone)){
                this.$message({
                    type:'warnning',
                    message:'请输入正确的手机号'
                });
                return false;
            }
            if (this.addPersonForm.mail && this.addPersonForm.mail.length > 64){
                this.$message({
                    type:'warnning',
                    message:'邮箱输入内容过长'
                });
                return false;
            }
            if (this.addPersonForm.jobNum && this.addPersonForm.jobNum.length > 20){
                this.$message({
                    type:'warnning',
                    message:'工号输入内容过长'
                });
                return false;
            }
            if (this.addPersonForm.comment && this.addPersonForm.comment.length > 500){
                this.$message({
                    type:'warnning',
                    message:'备注输入内容过长'
                });
                return false;
            }
            if (!this.addPersonForm.department){
                this.$message({
                    type:'warnning',
                    message:'请选择所属部门'
                });
                return false;
            }
            if(this.isSendNotify) addObj.isactive="1"; //选中通知激活，isactive字段为1，否则该字段不存在
            this.$axios.post('/api/member/member/save',addObj).then((res)=>{
                if (res.data.code == 0){
                    this.$message({
                        type: 'success',
                        message: '成员信息添加成功!'
                    })
                    /* 添加成员ajax */
                    this.addPersonForm.name = '';
                    this.addPersonForm.sex = '1';            
                    this.addPersonForm.phone = '';
                    this.addPersonForm.mail = '';
                    // this.addPersonForm.department = '';
                    // this.addPersonForm.departmentId = '';
                    this.addPersonForm.job = '';
                    this.addPersonForm.jobNum = '';
                    this.addPersonForm.joinTime = '';
                    this.addPersonForm.comment = '';
                    this.addPersonForm.station = '';
                    this.updateTreeDate();
                    this.mainTableFlag = !this.mainTableFlag;
                    this.addPersonForm.department = this.currentDepartment;
                    this.addPersonForm.departmentId = this.currentDepartmentId;
                }else if (res.data.code == 1){
                    this.$message({
                        type:'warnning',
                        message: res.data.message
                    });
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        addPersonSave(){   //添加成员-->保存
      
            let addObj = this.addPersonForm;
            if (Array.isArray(addObj.departmentId)){
                let arr = [];
                addObj.departmentId.forEach((e,i)=>{
                    arr.push(e.id);
                });
                addObj.departmentId = arr;
            }
            if (!this.addPersonForm.name){
                this.$message({
                    type:'warnning',
                    message:'请输入姓名'
                });
                return false;
            }
            if (this.addPersonForm.name.length >20){
                this.$message({
                    type:'warnning',
                    message:'姓名输入内容过长'
                });
                return false;
            }
            if (!this.addPersonForm.phone){
                this.$message({
                    type:'warnning',
                    message:'请输入手机号'
                });
                return false;
            }
            if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.addPersonForm.phone)){
                this.$message({
                    type:'warnning',
                    message:'请输入正确的手机号'
                });
                return false;
            }
            if (this.addPersonForm.mail && this.addPersonForm.mail.length > 64){
                this.$message({
                    type:'warnning',
                    message:'邮箱输入内容过长'
                });
                return false;
            }
            if (this.addPersonForm.jobNum && this.addPersonForm.jobNum.length > 20){
                this.$message({
                    type:'warnning',
                    message:'工号输入内容过长'
                });
                return false;
            }
            if (this.addPersonForm.comment && this.addPersonForm.comment.length > 500){
                this.$message({
                    type:'warnning',
                    message:'备注输入内容过长'
                });
                return false;
            }
            if (!this.addPersonForm.department){
                this.$message({
                    type:'warnning',
                    message:'请选择所属部门'
                });
                return false;
            }
            if(this.isSendNotify) addObj.isactive="1"; //选中通知激活，isactive字段为1，否则该字段不存在
            this.$axios.post('/api/member/member/save',addObj).then((res)=>{
                if (res.data.code == 0){
                    this.$message({
                        type: 'success',
                        message: '成员信息添加成功!'
                    });
                    this.isAddPerson = false;
                    this.updateTreeDate();
                    this.mainTableFlag = !this.mainTableFlag;
                }else if (res.data.code == 1){
                    this.$message({
                        type:'warnning',
                        message: res.data.message
                    });
                }else{
                    this.$message.error(res.data.message);
                }
                /* 添加成员ajax */
                this.addPersonForm.name = '';
                this.addPersonForm.sex = '1';            
                this.addPersonForm.phone = '';
                this.addPersonForm.mail = '';
                this.addPersonForm.department = '';
                this.addPersonForm.departmentId = '';
                this.addPersonForm.job = '';
                this.addPersonForm.jobNum = '';
                this.addPersonForm.joinTime = '';
                this.addPersonForm.comment = '';
                this.addPersonForm.station = '';
                this.jumpAddList();
            }).catch((error)=>{
                console.log(error);
            });

        },
        addPersonCancel(){    //添加成员-->取消
            this.isAddPerson = false;
            // 添加成员先要将原来输入的信息取消掉
            this.addPersonForm.name = '';
            this.addPersonForm.sex = '1';            
            this.addPersonForm.phone = '';
            this.addPersonForm.mail = '';
            this.addPersonForm.department = '';
            this.addPersonForm.departmentId = '';
            this.addPersonForm.job = '';
            this.addPersonForm.jobNum = '';
            this.addPersonForm.joinTime = '';
            this.addPersonForm.comment = '';
            this.jumpAddList();
        },
        listEdit (...data){     //内容列表-->编辑
        // console.log(...data)
            this.isAddPerson = true;
            this.isEditPersonMsg = true;
            const obj = data[0];
            this.defaultCheckedArr = obj.Sections;
            this.addPersonForm.id = obj.m_id;
            this.addPersonForm.name = obj.m_name;
            this.addPersonForm.sex = obj.u_gender == 0 ? '' : obj.u_gender;
            this.addPersonForm.phone = obj.u_phone;
            this.addPersonForm.mail = obj.u_email;
            this.addPersonForm.department = obj.SectionName;
            this.addPersonForm.departmentId = obj.Sections;
            this.addPersonForm.job = obj.m_position;
            this.addPersonForm.jobNum = obj.m_jobnumber;
            this.addPersonForm.joinTime = obj.m_entrytime;
            this.addPersonForm.comment = obj.m_remarks;
            this.addPersonForm.isSure = true;
            this.addPersonForm.station = obj.s_id=="0"?"":obj.s_id;
        },
        jumpAddList(){
           this.$router.push("/addressList")
        },
        editPersonCancel (){     //内容列表 --> 编辑 -->  取消
            this.isAddPerson = false;
            this.isEditPersonMsg = false;
            this.jumpAddList()
        },
        editPersonSave () {      //内容列表 --> 编辑   -->保存
            if (!this.addPersonForm.name){
                this.$message({
                    type:'warnning',
                    message:'请输入姓名'
                });
                return false;
            }
            if (this.addPersonForm.name.length >20){
                this.$message({
                    type:'warnning',
                    message:'姓名输入内容过长'
                });
                return false;
            }
            if (!this.addPersonForm.phone){
                this.$message({
                    type:'warnning',
                    message:'请输入手机号'
                });
                return false;
            }
            if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.addPersonForm.phone)){
                this.$message({
                    type:'warnning',
                    message:'请输入正确的手机号'
                });
                return false;
            }
            if (this.addPersonForm.mail && this.addPersonForm.mail.length > 64){
                this.$message({
                    type:'warnning',
                    message:'邮箱输入内容过长'
                });
                return false;
            }
            if (this.addPersonForm.jobNum && this.addPersonForm.jobNum.length > 20){
                this.$message({
                    type:'warnning',
                    message:'工号输入内容过长'
                });
                return false;
            }
            if (this.addPersonForm.comment && this.addPersonForm.comment.length > 500){
                this.$message({
                    type:'warnning',
                    message:'备注输入内容过长'
                });
                return false;
            }
            let departmentid = [];
            // console.log(this.addPersonForm.departmentId);
            if (this.addPersonForm.departmentId.length > 0){
                this.addPersonForm.departmentId.forEach((e,i)=>{
                    departmentid.push(e.id);
                });
            }
            this.$axios.post('/api/member/member/update',{
                mid: this.addPersonForm.id,
                name: this.addPersonForm.name,
                sex: this.addPersonForm.sex,
                phone: this.addPersonForm.phone,
                email: this.addPersonForm.mail,
                departmentId: departmentid,
                jobnumber: this.addPersonForm.jobNum,
                position: this.addPersonForm.job,
                entrytime: this.addPersonForm.joinTime,
                remarks: this.addPersonForm.comment,
                station: this.addPersonForm.station,
            }).then((res)=>{
                if (res.data.code == 0){
                    this.$message({
                        type:'success',
                        message:'提交成功~'
                    });
                    this.isAddPerson = false;
                    this.isEditPersonMsg = false;
                    this.adjustUpload();     //信息更新
                    // this.updateTreeDate();
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        thoroughDeletePerson (){     //内容列表  --> 编辑  --> 彻底删除成员
            this.$confirm('确认删除该成员后，将从所有部门中删除该成员，且不可找回？','彻底删除成员',{
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.post('/api/member/member/moveMemberFromCompany',{
                    mid:this.addPersonForm.id
                }).then((res)=>{
                    if (res.data.code == 0){
                        this.$message({
                            type:'success',
                            message: '彻底删除成员成功！'
                        });
                        this.isAddPerson = false;
                        this.isEditPersonMsg = false;
                        this.adjustUpload();     //信息更新
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
        listAdjust(...data){
            this.chooseDepartments = true;
        },
        updateTreeDate(){     //更新结构树的数据
            this.$axios.post('/api/maillist/maillist/webStructure',{
                uid: __golbal_uid,
                cid: __golbal_cid
            }).then((res)=>{
                if (res.data.code == 0){    //将所有结构树进行更新
                    const data = res.data.data;
                    this.organData = data.organMsg;
                    this.organAllData = data.organAllData;
                    this.organMessage = data.organMessage;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        isFirstGetDepartmentMsg(){
            try {
                this.getDepartmentMsg(this.organData[0].children[0].id);
            } catch (error) {
                console.log(error);
            }
        },
        getDepartmentMsg(id){   //获取部门信息,需要传部门的id
            this.$axios.post('/api/member/member/getOptInfo',{
                sid: id,
                cid: __golbal_cid
            }).then((res)=>{
                if (res.data.code == 0){
                    const data = res.data.data;
                    this.currentDepartmentId = data.s_id;
                    this.currentDepartment = data.s_name;
                    this.parentDepartment = data.ParentName;
                    this.parentDepartmentId = data.s_parent_id;
                    this.editDepartmentForm.isHideDepartment = data.s_status;
                    this.editDepartmentForm.setDepartmentGrouu = data.s_group + '';
                    this.editDepartmentForm.haveDepartment = data.s_group + '';
                    this.editDepartmentForm.setChildrenGrouu = data.is_groupchildren + '';
                    this.editDepartmentForm.groupNum = data.sectiongroup_num + '';
                    this.currentDepartmentIsZhiShu = data.IsZhiShu;
                    this.currentDepartmentFB = data.s_parent_name;
                    this.personMessage = data.info;
                    let arr0 = [];
                    data.info_admin.forEach((e,i)=>{
                        arr0.push(e.key);
                    });
                    this.temCharge = arr0;
                    this.currentChargeIdArr.length = 0;    //由于打开了一个新的部门,需要将之前记录的前部门的主管信息全部清除掉
                    this.currentChargeNameArr.length = 0;
                    data.info_admin.forEach((e,i)=>{
                        this.currentChargeIdArr.push(e.key);
                        this.currentChargeNameArr.push(e.label);
                    });
                    this.editDepartmentForm.departmentName = data.s_name;
                    this.editDepartmentForm.chargePerson = this.currentChargeNameArr.join('，');
                    this.editDepartmentForm.chargePersonId = this.currentChargeIdArr.join(',');
                    this.editDepartmentForm.isHideDepartment = data.s_status + '';
                    this.editDepartmentForm.superiorDepartment = data.ParentName;
                    this.editDepartmentForm.superiorDepartmentId = data.s_parent_id + '';
                    this.currentDepartmentMemberNum = data.secCount;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        adjustUpload(){    //调整部门完成,进行页面信息更新
            this.updateTreeDate();
            this.getDepartmentMsg(this.currentDepartmentId);
            this.mainTableFlag = !this.mainTableFlag;
        },
        searchPersonDetail(id){    //搜索结果点击成员进入成员的编辑页面
            this.$axios.post('/api/member/member/detailMember',{
                mid: id
            }).then((res)=>{
                if (res.data.code == 0){
                    this.isAddPerson = true;
                    this.isEditPersonMsg = true;
                    const obj = res.data.data;
                    this.defaultCheckedArr = obj.Sections;
                    this.addPersonForm.id = obj.m_id;
                    this.addPersonForm.name = obj.m_name;
                    this.addPersonForm.sex = obj.u_gender;            
                    this.addPersonForm.phone = obj.u_phone;
                    this.addPersonForm.mail = obj.u_email;
                    this.addPersonForm.department = obj.SectionName;
                    this.addPersonForm.departmentId = obj.Sections;
                    this.addPersonForm.job = obj.m_position;
                    this.addPersonForm.jobNum = obj.m_jobnumber;
                    this.addPersonForm.joinTime = obj.m_entrytime;
                    this.addPersonForm.comment = obj.m_remarks;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        searchDepartmentDetail(depart){    //搜索结果点击部门,右边列表进入部门列表页
            /*if (depart.isCompany){     //点击的是公司
                this.currentDepartmentId = 0;
            }else{
                this.currentDepartmentId = depart.id;
            }*/
            if (depart.isCompany){
                this.currentDepartmentIsZhiShu = true;
            }else{
                this.currentDepartmentIsZhiShu = false;
            }
            this.currentDepartmentId = depart.id;
            this.isAddPerson = false;
            this.isBatchAddPerson = false;
            this.getDepartmentMsg(this.currentDepartmentId);
        },
        dissolveGroup(){    //解散部门群
            this.$confirm('确认解散部门群？','解散部门群',{
                confirmButtonText: '解散',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.post('/api/section/section/deletegroup',{
                    s_id: this.currentDepartmentId,
                    c_id: __golbal_params.c_id,
                }).then((res)=>{
                    this.editDepartmentForm.setDepartmentGrouu = '0';
                    this.editDepartmentForm.haveDepartment = '0';
                    this.editDepartmentForm.setChildrenGrouu = '0';
                    this.editDepartmentForm.groupNum = '0';
                    this.$message({
                        type:'success',
                        message: '解散部门群成功！'
                    });
                });
            }).catch((error)=>{
                console.log(error);
            });
        },
        departmentOpen(){    //编辑成员或添加成员界面中-->调起选择部门弹框
            this.chooseDepartments = true;
            __vBus.departmentAdjustArr=[];
            __vBus.departmentAdjust='';
        },
        getStationList(){
             this.$axios.post('/api/performance/performancemanager/getstationlist')
             .then((res)=>{
                   const _data = res.data;
                    if (_data.code == 0) {
                    this.personStationOption = _data.data;
                    }
            });
            
        }
    },
    data() {
        const calPersonMsg = _ => {    //将获取到的人物信息列表改造成穿梭框可以使用的数据
            const data = [];
            for (let i =0; i < personMsg.tableMsg.length; i++){
                data.push({
                    key: personMsg.tableMsg[i].id + '___' + personMsg.tableMsg[i].name,
                    label: personMsg.tableMsg[i].name
                });
            }
            return data;
        }
        const __uploadParams=__finalParams("/api/member/member/saveMembers");
        return {
            /* 用来判断弹框弹出状态的变量 */
            setCharger: false,      //设置主管  -- 控制一级弹框==设置主管  是否显示
            editDepartmentVisible: false,  //编辑部门弹框是否显示
            selectSuperiorDepartment: false,    //选择上级部门弹框是否显示
            selectChargePerson: false,    //选择主管弹框是否显示
            addSubdivisionVisible: false,   //添加子部门弹框是否显示
            isBatchAddPerson: false,     //是否正处于批量添加成员页面
            preUpdata: true,     //是否正处于批量导入之前(就是处在要下载模板的那个页面)
            isAddPerson: false,   //是否正处在添加成员的页面
            chooseDepartments: false,    //添加成员-->是否显示部门选择弹框
            isEditPersonMsg: false,     //是否是编辑成员信息   因为它们两个长的比较像,所以统一使用一套固定东西
            /* end */
            //mainCurrentPage: 1,     //主列表的分页
            mainTableFlag: false,   //专门用来父级改变原来的值,子级组件监控它是否变化,来确定是否更新整个列表信息
            //isAdjustOutter: false,   //用来判断,在选择部门时候,点击确定是否是要发送请求
            currentDepartmentId: '0',   //当前部门(主要是为所有信息提供)-->部门id
            currentDepartment: '',     //当前部门的名字(主要用来显示)---->部门名字
            currentDepartmentFB: '',       //在当前部门添加子部门时,所使用的字段
            currentDepartmentMemberNum: '',    //当前部门的人数
            parentDepartment: '',      //上级部门的名字
            parentDepartmentId: '0',      //上级部门的id
            currentChargeIdArr: [],      //当前部门管理员id数组
            currentChargeNameArr: [],     //当前部门管理员姓名数组
            personMessage: [],       //calPersonMsg(),   //当前部门,右边内容区域显示出来的所有的人物信息
            //transferCheckedData: [],       //穿梭框中当前选中的数据
            isSecondTree: false,     //是否是专门用来过滤的结构树,这个不进行展示,只是套用element-ui现有的过滤功能
            searchResult:{   //搜索结果
                department:[],    //部门
                person:[],    //人物
            },
            isSearchingPhone: false,     //当前搜索框搜索的是否为手机号
            currentDepartmentIsZhiShu: false,      //当前部门是否是公司直属部门
            fileList: [],    //上传文件的初始数组,主要用来初始上传状态
            uploadUrl: '/api/member/member/saveMembers',   //上传文件的路径
            params:__uploadParams,     //批量上传文件的路径
            uploadResult: null,   //上传文件的返回结果

            isSearching: false,   //搜索结果
            filterText: '',   //侧边栏过滤文案
            organData: null,     //组织结构树数据-->人数+部门(用来进行左边结构树展示)
            organAllData: null,    //组织结构树数据-->部门+人(用来进行左边结构树的搜索查询)
            organMessage: null,     //组织结构树数据-->部门(用在选择部门弹框中)
            defaultProps: {      //element-ui树形结构的设置参数
                children: 'children',
                label: 'label'
            },
            temDepartment: null,   //临时确定下来的上级部门节点,用来做中转,当在选择上级部门弹框中点击确定按钮,把这个对象的信息提取出来赋值给编辑部门弹框中的上级部门 :)
            temCharger: [],    //设置部门主管 ---  一级弹框所使用的数组
            temCharge: [],    //临时确定下来的主管人员,作用和上面的变量类似
            //departmentGroup: '0',    //当前部门是否有部门群,没有的话就是传一个空值,有的话,直接传过来部门群的人数
            //displayGroup: false,     //是否有权限解散部门群
            multipleSelection: [],
            defaultCheckedArr: [],     //编辑部门弹框默认选项
            editDepartmentForm: {    //编辑部门表单
                departmentName: '',   //部门名称
                superiorDepartment: '',    //上级部门,此选项主要用来前端展示
                superiorDepartmentId: '',   //上级部门id
                chargePerson: '',    //主管人员,此选项主要用来前端展示
                chargePersonId: '',     //主管人员id数组
                isHideDepartment: '0',   //隐藏部门,'0'表示否,'1'表示是
                setDepartmentGrouu: '0',    //是否要建立部门群,默认为不建立,'0'表示否,'1'表示是
                groupNum: '0',      //部门群里的人数
                setChildrenGrouu: '0',       //建立的部门群是否包含子部门
                haveDepartment: '0',    //是否有部门群-->专门用来对编辑部门的显示状态做区分
            },
            addSubdivisionForm: {     //添加子部门表单
                departmentName: '',    //新添加的部门的名称
                isHideDepartment: '0',   //隐藏部门,'0'表示否,'1'表示是
                setDepartmentGrouu: '0',    //是否要建立部门群,默认为不建立,'0'表示否,'1'表示是
                setChildrenGrouu: '0',     //是否包含子部门
            },
            addPersonForm: {    //添加成员表单
                id: '',     //编辑成员的id
                name: '',    //新添加成员的姓名
                sex: '1',    //性别
                phone: '',   //手机号
                mail: '',     //邮箱
                department: '',   //部门
                departmentId: [],   //选中部门的id数组,转成,隔开的字符串
                job: '',   //职位
                jobNum: '',   //工号
                joinTime: '',  //入职时间
                comment: '',   //备注
                isSure: false,     //是否已经激活,如果已经激活,则无法在后台更改激活的手机号,
                station:''
            },
            isSendNotify:false, //是否通知激活
            personStationOption:[]
        };
    },
    computed:{
        tree0ExpandedKeys : function (){     //计算出侧边栏展示出的第一个节点
            let arr = [];
            if (this.organData === null || this.organData.length <= 0){
                return arr;
            }
            arr.push(this.organData[0].id);
            return arr;
        }

    },
    created(){
        if(this.$route.query.add){
            this.addMember()
        }
        this.updateTreeDate();
        this.getDepartmentMsg('0');
        __vBus.departmentAdjustArr = [];
        __vBus.departmentAdjust = '';
        const localAddress = location.href;
        if (localAddress.indexOf('organ?add')>-1){
            this.addMember();      //一旦接受到add参数,则是从首页的添加成员按钮进来的,直接触发本页中的添加成员的操作
        }
        if (localAddress.indexOf('organ?personDetail')>-1){
            const organ_id = sessionStorage.getItem('organ_id');
            this.searchPersonDetail(organ_id);
        }
        this.getStationList();//获取职级列表
        
    },
    components: {
        organContent,   //内容主体(主要是表格)的组件
        leadingInContent,    //导入结果的主体,主要是表格
        chooseDepartmentBox,    //选择部门的弹出框,带有机构数,结构树节点选择,结构树节点过滤和类似穿梭框之间的联动,有几个地方可以共用
        
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
            & .el-tree-node__content.el-tree-node__content:hover .el-tree-node__label{
                // background-color: #4e556c;
                // 409eff
            }
            .el-tree-node__children{
                overflow:visible;
            }
                .el-tree-node__content{
                    background-color: #333744;
                    .el-tree-node__label{
                        padding-right: 10px;
                        line-height: 36px;
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
    .is-current.is-current.is-current>.el-tree-node__content .el-tree-node__label{
        background-color: #409eff;
    }
    // .is-current.is-current.is-current .el-tree-node__label{
    //     background-color: #409eff;
    // }
    
    .organ-right-wrap{
        min-width: 500px;
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
.ts-aside{
    overflow-x: hidden;
    position: relative;
    .ts-eltree{
        position: absolute;
        overflow-x: scroll;
        width: 100%;
        // min-width:300px;
        // height: 750px;
        left: 0;
        top: 125px;
        bottom: 0;

    }
}
 .organ-left-wrap .side-tree-wrap{
        // width: 240px;
        // overflow-x: scroll;
    }
</style>




