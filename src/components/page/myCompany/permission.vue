<template>
  <div class="company-perm-wrap" v-loading.fullscreen.lock="fullscreenLoading">
  <section v-if="!isShowTransfer">
  <h4 class="com-item-title">权限管理</h4>
  <div class="form-wrap">
  <ul class="top">
    <li class="clearfix">
      <p>主管理员</p>
      <el-button type="primary" plain @click="isShowTransfer = true">转让</el-button>
      <p><i>姓名：{{adminName}}</i><i>手机号：{{adminTel}}</i></p>
    </li>
    <li class="clearfix">
      <p>子管理员</p>
      <el-button type="primary" plain @click="subAdminDialogVisible = true">添加</el-button>
    </li>
  </ul>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="m_name"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="m_position"
      label="职位"
      width="180">
    </el-table-column>
    <el-table-column
      prop="section"
      label="所在部门"
      width="150">
    </el-table-column>
    <el-table-column
      prop="u_phone"
      label="手机号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="Model"
      label="权限">
    </el-table-column>
    <el-table-column
      label="操作"
      width="180">
      <template slot-scope="scope">
        <el-button @click="handleClickModify(scope)" type="text" size="small">调整权限</el-button>
        <el-button type="text" size="small" @click="handleClickDelect(scope)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- <section class="pagination-wrap clearfix">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="5"
      layout="total, sizes, prev, pager, next"
      :total="100">
    </el-pagination>
    </section> -->
  </div>
  </section>
  <section v-else>
    <permission-admin 
    :isShowTransfer.sync="isShowTransfer"
    :adminName="adminName"
    :adminTel="adminTel"
    :adminMid="adminMid"
    ></permission-admin>
  </section>
  <!-- 添加子管理员 -->
  <el-dialog
    title="添加子管理员"
    :visible.sync="subAdminDialogVisible"
    width="500px"
    class="sub-admin-dialog"
    center>
    <el-autocomplete
      v-model="subAdminState.value"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入成员姓名或手机号"
      @select="handleSelect"
    ></el-autocomplete>
    <span slot="footer" class="dialog-footer">
      <el-button @click="subAdminDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSelectSubAdmin">保存</el-button>
    </span>
  </el-dialog>
  <!-- 权限调整 -->
  <el-dialog 
  class="dialog-change-permission" 
  title="调整权限" 
  width="690px"
  :visible.sync="outerDialogVisible" 
  @close="handleChangeDialogClose"
  center >
    <!-- <el-dialog
      width="750px"
      title="选择部门"
      :visible.sync="innerDialogVisible"
      append-to-body>
      <div class="clearfix">
         <el-tree
          class="partment-tree-wrap"
          :data="partmentTreeList"
          @check-change="handleCheckChange"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <div class="partment-choose-wrap">
            <li v-for="(item,index) in hasChooseList" :key="index" >
              <span>{{item.label}}</span>
              <i class="el-dialog__close el-icon el-icon-close" @click="()=>handleCloseItem(item)"></i>
              </li>
        </div>
        </div>
        <div class="dialog-footer" style="margin:20px auto 0 auto;width:200px;">
          <el-button @click="innerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSelectPartment">确定</el-button>
        </div>
    </el-dialog> -->
    <el-form :label-position="labelPosition" label-width="100px" :model="formPermission">
      <el-form-item label="管理员姓名">
        <el-input v-model="formPermission.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="管理范围" class="perm-range">
          <el-radio-group v-model="parmentRange">
          <el-radio :label="1" >全公司</el-radio>
          <el-radio :label="2">所在部门及其子部门</el-radio>
          <el-radio :label="3">特定部门</el-radio>
          </el-radio-group>
          <div v-show="isSowSpecial" class="special-selected" @click="chooseDepartments_adjust=true">{{hasSelectDeparts}}</div>
      </el-form-item>
      <el-form-item label="拥有权限" class="perm-set">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部权限</el-checkbox>
        <el-checkbox-group v-model="checkedPerm" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(item,index) in checkOptions" :label="item" :key="item"><span>{{item}}</span><i>{{checkOptionsVal[index].tips}}</i></el-checkbox>
      </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="outerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleChangePerConfirm">确定</el-button>
    </div>
  </el-dialog>
    <permissionTree 
      :chooseDepartments="chooseDepartments_adjust" 
      :defaultCheckArr="defaultCheckedArr" 
      @closeChooseDepartment="closeChooseDepartmentBox_adjust" 
      :chooseData="organData">
        <h4 slot="left-name" class="choose-department-h4">组织结构</h4>
        <h4 slot="right-name" class="choose-department-h4">已选部门</h4>
    ></permissionTree>
  </div>
</template>

<script>
import permissionAdmin from './permission-admin';
import chooseDepartmentBox  from './departmentTree';
import permissionTree  from './permissionTree';
const checkOptionsVal=[
{
  label:'通讯录管理',
  val:"1",
  tips:""
},{
  label:'业绩管理',
  val:"7",
  tips:"（仅保险公司有此功能）"
},{
  label:'工作台管理',
  val:"2",
  tips:"（该权限不受管理范围限制）"
},{
  label:'企业设置',
  val:"3",
  tips:"（该权限不受管理范围限制）"
},{
  label:'企业主页管理',
  val:"4",
  tips:"（该权限不受管理范围限制，仅服务商有此功能）"
},{
  label:'通知公告',
  val:"5",
  tips:""
},{
  label:'工作台轮播图',
  val:"6",
  tips:"（该权限不受管理范围限制）"
}]
// const checkOptions = checkOptionsVal.map((item)=>{
//   return item.label
// })
// const maxOptionsLen=checkOptions.length;
 export default {
   components:{
     permissionAdmin,
     chooseDepartmentBox,
     permissionTree
   },
    data() {
      return {
        hasSelectSid:[],
        hasSelectDeparts:"请选择部门",
        chooseDepartments_adjust:false,
        organData:[],
        checkOptionsVal:checkOptionsVal,
        defaultCheckedArr:[],
        fullscreenLoading:true,
        subAdminDialogVisible:false,
        labelPosition: 'right',
        isShowTransfer:false,//
        currentPage: 1,
        adminName:"",
        adminTel:"",
        adminMid:"",
        adminMpass:"",
        tableData: [],
        nowActiveIndex:-1,
        outerDialogVisible: false,
        innerDialogVisible: false,
        formPermission:{
          name:"",
          mid:""
        },
        parmentRange:1,
        restaurants: [],
        subAdminState:{},
        timeout:  null,
        checkAll: false,
        checkedPerm: [],
        isIndeterminate: true,
        isSowSpecial:false,
        partmentTreeList:[],
        hasChooseList:[],
        hasChooseGroupId:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      }
    },
    computed:{
         checkOptions:function(){
           let temp=[];
           temp=this.checkOptionsVal.map((item)=>{
              return item.label
            })
            return temp;
         }
    },
    methods: {
      closeChooseDepartmentBox_adjust(...data){
      this.chooseDepartments_adjust=false;
      const select=data[0];
      if(select[0]==false) return;
      this.defaultCheckedArr=select;
      // console.log("select",select)
      },
      // 确定调整副管理员
    handleSelectSubAdmin(){
                this.$axios.post('/api/administrator/admin/addAdministrator',{
                    mid:this.subAdminState.mid
                } )
                .then((res)=> {
                    const _data=res.data;
                    if(_data.code==0){
                      // console.log(_data)
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.renderTable();
                    }else{
                        this.$message.error(_data.message);
                    }
                    })
                  this.subAdminDialogVisible=false;
    },
      // 调整权限按钮点击
    handleClickModify(scope) {
      // console.log(scope.row)
      // this.activeRow=scope.row;
      this.nowActiveIndex=scope.$index;
      this.formPermission.name=scope.row.m_name;
      this.formPermission.mid=scope.row.m_id;
      this.defaultCheckedArr=scope.row.STypeSections;
      if(scope.row.STypeSections[0] && scope.row.STypeSections[0].id== __golbal_cid){
        scope.row.STypeSections.splice(0,1,{
          id:__golbal_cid,
          label:this.organData[0].label
        })
      }
      this.defaultCheckedArr=scope.row.STypeSections;
      this.outerDialogVisible=true;
      let __now=[];
      // 数据回填
      this.checkOptionsVal.map((item)=>{
          if(scope.row.ModelIDs.indexOf(item.val)>-1){
                 __now.push(item.label)
          }
      })
     this.checkedPerm=__now;
     // 默认是全公司
     this.parmentRange=parseInt(scope.row.SType)||1;
     
    },
     // 调整权限功能-权限选择全选
    handleCheckAllChange(val) {
         this.checkedPerm = val ? this.checkOptions : [];
        this.isIndeterminate = false;
      },
     // 调整权限功能-权限选择单个
    handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.checkOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkOptions.length;
      },
      
  // 调整权限确定按钮
    handleChangePerConfirm(){
      let __modelids=[];
      this.checkedPerm.map((item,index)=>{
        if(this.checkOptions.indexOf(item)>-1){
          __modelids.push(this.checkOptionsVal[index].val)
        }
      })
      if(__modelids.length==0){
        this.$message.error("请选择权限范围！");
        return false;
      }
      this.$axios.post('/api/administrator/admin/updateAdministrator',{
       mid:this.formPermission.mid, //调整权限的成员id
       sids:this.hasSelectSid.join(","), //部门id
       type:this.parmentRange,//管理部门范围类型
       modelids:__modelids//管理模块
      })
      .then((res)=> {
          const _data=res.data;
          if(_data.code==0){
            this.tableData.splice(this.nowActiveIndex,1,_data.data);
               this.$message({
                  message: '权限调整完成',
                  type: 'success'
              });
              this.renderTable();
          }else{
            this.$message.error(_data.message);
          }
        })
      this.outerDialogVisible = false;
    },
    // 调整权限弹窗关闭
    handleChangeDialogClose(){
       this.checkedPerm=[];
    },
    // 删除权限
    handleClickDelect(scope){
       this.nowActiveIndex=scope.$index;
       this.$confirm('此操作将永久删除管理员:'+scope.row.m_name+', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          this.$axios.post('/api/administrator/admin/delAdministrator',{
              mid: scope.row.m_id
            }).then((res)=> {
              if(res.data.code==0){
                this.tableData.splice(this.nowActiveIndex,1)
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
              }else{
                 this.$message.error(res.data.message);
              }
            })
        });

    },
    renderTable(){
    this.$axios.post('/api/administrator/admin/administratorLists').then((res)=> {
            if(res.data.code==0){
              this.tableData=res.data.data||[];
            }
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.renderTable();
    },
    handleCurrentChange(val) {
      this.renderTable();
    },
      querySearchAsync(queryString, cb) {
        this.$axios.post('/api/member/member/searchMember',{         
          name:queryString
        })
        .then((res)=> {
          const _data=res.data;
          let _result=[];
          if(_data.code==0){
            _data.data.map((item)=>{
              _result.push({
                value:item.m_name,
                u_id:item.u_id,
                mid:item.m_id
              })
            })
          }
          cb(_result)
        })
        .catch((err)=>{
            cb([])
        });
      },
      handleSelect(item) {
        this.subAdminState=item;
      },
        },
        watch:{
          // 获取部门树
          //  chooseDepartments_adjust:function(val){
          //      if(val){
          //         this.defaultCheckedArr=this.activeRow.STypeSections;
          //      }
          //   },
          // 调整权限功能-范围选择,监控，控制内嵌弹窗的入口
          parmentRange(val){
            val==3?this.isSowSpecial=true:this.isSowSpecial=false;
          },
          defaultCheckedArr(val){
            let __str="请选择部门";
            let __arr=[];
            this.hasSelectSid=[];
            if(val.length>0){
                  val.map((item)=>{
                    __arr.push(item.label.replace(/\(.*\)/g,''));
                    this.hasSelectSid.push(item.id);
                  })
                 __str=__arr.join("；")
            }
            this.hasSelectDeparts=__str;
          }

    }, 
    mounted() {
      this.renderTable();
      this.$axios.post('/api/administrator/admin/getMainAdministratorInfo').then((res)=> {
        if(res.data.code==0){
          this.adminName=res.data.data.m_name;
          this.adminTel=res.data.data.u_phone;
          this.adminMid=res.data.data.m_id;
          this.adminMpass= res.data.data.m_password;
        }else{
           this.$message.error(res.data.message);
        }
        this.fullscreenLoading=false;
      }).catch((err)=>{
          // console.log(err);
          //this.$message.error('抱歉，网络连接异常，请稍候重试~');
           this.fullscreenLoading=false;
        });
        // 加载部门结构树
        this.$axios.post('/api/notice/manage/getTreeByCid')
          .then((res)=> {
              const _data=res.data;
              if(_data.code==0){
                  this.organData=_data.data;
              }
        })
    }
  }
</script>

<style lang="scss">
.company-perm-wrap{
  .top{
    li{
      margin-bottom:28px;
    }
    p,.el-button{
      float: left;
    }
    p{
      line-height:40px; 
      padding-right: 20px;
      font-size: 14px;
      color: #353535;
    }
    i{
      margin-right: 40px;
      color: #409eff;
    }
    .el-button{
      margin-right: 50px;
    }
  }
  .transfer-wrap{
  .el-input__inner{
      width: 325px;
    }
  }
  
  .ver-code{
    position: absolute;
    left: 360px;
    top:0;
    width: 118px;
  }
  .sub-admin-dialog .el-autocomplete{
    width: 100%;
  }
  .dialog-change-permission{
    .perm-set{
    .el-checkbox{
      display: block;
      margin-left: 0;
    }
    .el-checkbox__label i{
      color: #5a5e66;
    }
    }
    .perm-range{
    .el-radio{
      display: block;
      margin-left: 0;
      line-height: 40px;
     }
    }
    .special-selected{
    background-color: #f5f7fa;
    color: #b4bccc;
    border-radius: 4px;
    border: 1px solid #dfe4ed;
    box-sizing: border-box;
    line-height: 40px;
    height: 40px;
    padding-left: 15px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    }
  }
  .perm-send-msg{
    position: absolute;
    top:0;
    left:350px;
  }
}
 
</style>
