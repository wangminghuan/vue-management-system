<template>
  <div class="perform-rank-wrap">
    <div class="title-wrap">
        <p class="com-item-title">晋升职级</p>
        <div v-show="!isEditStatus" @click="isEditStatus=true">
          <el-button type="primary" class="title-rt">编辑晋升职级</el-button>
        </div>
        <div v-show="isEditStatus" class="title-rt">
        <el-button type="primary" plain @click="handleClickCancel">取消</el-button>
         <el-button type="primary" @click="saveBtnEvent()">保存</el-button>
        </div>
     </div>
     <div class="table-wrap">
       <h2>晋升通道：</h2>
        <ul  v-if="!isEditStatus">
          <li>职级<i class="tile-tips">（职级由下至上递升）</i></li>
          <li v-for="(item,index) in tableData1" :key="index">{{item.s_name}}</li>
        </ul>
         <div v-if="isEditStatus">
             <el-table
                  :data="tableData"   border style="width: 100%;text-align: center">
                 <el-table-column prop="s_name" label="职级"></el-table-column>
                 <el-table-column label="操作" >
                     <template slot-scope="scope">
                         <el-button
                             @click.native.prevent="ediut(scope.row,scope.$index)"
                             type="text"
                             size="small">
                             编辑
                         </el-button>
                         <el-button
                             @click.native.prevent="deleteRow(scope.$index,scope.row,tableData)"
                             type="text"
                             size="small">
                             移除
                         </el-button>
                         <el-button
                             @click.native.prevent="moveUp(scope.$index)"
                             type="text"
                             size="small">
                             上移
                         </el-button>
                         <el-button
                             @click.native.prevent="moveDown(scope.$index)"
                             type="text"
                             size="small">
                             下移
                         </el-button>
                     </template>
                 </el-table-column>
             </el-table>
             <el-button type="primary" class="margin-top" @click="newAddBottomEvent()">添加一条</el-button>
         </div>
     </div>
      <el-dialog  :visible.sync="dialogFormVisible" center width="25%">
          <el-form :model="form" :rules="jobRules" ref="jobRuleForm">
            <el-form-item label="职级名称：" :label-width="formLabelWidth" prop="s_name">
                <el-input v-model="form.s_name" auto-complete="off"></el-input>
            </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="addBtnEvent('jobRuleForm')">确 定</el-button>
          </div>
      </el-dialog>
      <el-dialog  :visible.sync="dialogFormVisible_del" center width="25%">
          <div>若需删除该职级，请先将该职级下所有成员调整至</div>
          <el-form :model="changeForm" :rules="changeRules" ref="changeRuleForm">
              <el-form-item label="" prop="newId">
                <el-select v-model="changeForm.newId" placeholder="请选择">
                    <el-option
                    v-for="item in deloptions"
                    :key="item.s_id"
                    :label="item.s_name"
                    :value="item.s_id">
                    </el-option>
                </el-select>
            </el-form-item>
          </el-form>
          <!-- <el-select v-model="changeForm.newId" placeholder="请选择"  :class="{'border_red':changeForm.newId===''}">
              <el-option
                  v-for="item in deloptions"
                  :key="item.s_id"
                  :label="item.s_name"
                  :value="item.s_id"
                  v-if="changeForm.oldId!=item.s_id"
                  >
              </el-option>
          </el-select> -->
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="delBtnEvent('changeRuleForm')">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
      var validatePass = (rule, value, callback) => {
        if ((typeof value=="string" && value.replace(/(^\s+)|(\s+$)/g,"") === '')||(!value)) {
           callback(new Error('请输入有效职级名称！'));
        }else{
            callback()
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value  === '') {
           callback(new Error('请选择调整后职级！'));
        }else{
            callback()
        }
      };
      return{
       originData:[],
       isEditStatus:false,
       isAdd:false, //编辑还是新增
       editIndex:-1,
       tableData: [],
       tableData1:[],
        dialogFormVisible: false,
        dialogFormVisible_del: false,
        formLabelWidth: '100px',
        form:{},
        jobRules:{
        s_name: [
            { required: true, validator: validatePass, trigger: 'blur' },
          ],
        },
        changeRules:{
           newId: [
            { required: true, validator: validatePass2, trigger: 'change' },
            ],
        },
        saveData:{
            s_arr:[],
            del_arr:[]
        },
        deloptions:[],
        changeForm:{
         newId:'',
         oldId:'',
        },
        tableIndex:''
      }
  },
  computed:{

  },
  methods:{
      handleClickCancel(){
          this.isEditStatus=false;
      },
      newAddBottomEvent() {
          this.isAdd=true;
          this.form={};
          this.dialogFormVisible=true;
      },
      ediut(obj,index) {
          this.form={...obj};
          this.editIndex=index;
          this.dialogFormVisible=true;
          this.isAdd=false;
      },
      saveBtnEvent() {
          this.saveData.s_arr=[];
          for(var i=0;i<this.tableData.length;i++)
          {
              this.saveData.s_arr.push({
                  s_id:this.tableData[i].s_id,
                  s_name:this.tableData[i].s_name,
              })
          }
          this.$axios.post('/api/performance/performancemanager/savestationlist',this.saveData)
              .then((res)=>{
                  const _data = res.data;
                 if (_data.code == 0) {
                      this.isEditStatus=false;
                      this._getList();
                      this.$message("操作成功");
                  }else{
                      this.$message(_data.message);
                  }
              }).catch(function (error) {
              console.log(error);
          });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      addBtnEvent(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            const _text=typeof this.form.s_name=="string" ? this.form.s_name.replace(/(^\s+)|(\s+$)/g,""):"";
            if(this.isAdd){
            //   新增时
            this.form.s_id="0";
            this.tableData.push(this.form);
          }else{
            //编辑时
            this.tableData[this.editIndex].s_name=_text
          }
           
           this.dialogFormVisible=false;

          } else {
            console.log('error submit!!');
            return false;
          }
        });

          
      },

      deleteRow(index,rows,tabData) {
          if(this.tableData.length==1){
              this.$message("无法移除！")
              return false
          }
          this.changeForm.newId='';
          this.changeForm.oldId=rows.s_id; 
          let _str="";
          this.saveData.del_arr.map((item)=>{
              (item.oldId) && (_str+=","+item.oldId)
          })
          this.$axios.post('/api/performance/performancemanager/getexceptstationlist',{
              s_id:rows.s_id+_str
          })
           .then((res)=>{
                  const _data = res.data;
                 if (_data.code == 0) {
                     this.deloptions=_data.data;
                  }
              });
          this.dialogFormVisible_del=true;
          this.tableIndex=index;
      },
      delBtnEvent(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                this.dialogFormVisible_del=false;
                this.saveData.del_arr.push(
                    {
                        oldId:this.changeForm.oldId,
                        newId:this.changeForm.newId==''?'0':this.changeForm.newId
                    }
                );
                this.tableData.splice(this.tableIndex, 1);
              }
          })
      },
      moveUp(index) {
          if(index == 0) {
              this.$message('已最上层不可上移!');
              return;
          }
          //在上一项插入该项
          this.tableData.splice(index-1,0,(this.tableData[index]));
          //删除后一项
          this.tableData.splice(index+1,1);

      },
      moveDown(index) {
          if(index == this.tableData.length-1) {
              this.$message('已最下层不可下移!');
              return;
          }
          //在下一项插入该项
          this.tableData.splice(index+2,0,(this.tableData[index]));
          // 删除前一项
          this.tableData.splice(index,1);
      },
      _getList(){
          this.$axios.post('/api/performance/performancemanager/getstationlist')
              .then((resp)=>{
                  if (typeof(resp.data) != "undefined" && resp.data.code == "0") {
                      this.tableData=resp.data.data;
                      this.tableData1=[...resp.data.data]; //保存原始数据，查看数据是否变化
                  }
                  else if (typeof(resp.data) != "undefined" && resp.data.code!= "0") {
                      this.$message(resp.data.message);
                  }
              }).catch((error)=>{
              console.log(error);
          });
      }
  },
  created(){
      this._getList();
  },
}
</script>
<style lang="scss">
.perform-rank-wrap{
 .table-wrap{
   padding-left: 20px;
   width: 99%;
   font-size: 14px;
   h2{

     line-height: 16px;
     margin-bottom: 20px;
   }
   li{
     height: 45px;
     line-height: 45px;
     border: 1px solid #e6ebf5;
     border-bottom: none;
     padding-left: 14px;
   }
   .tile-tips{
      font-size: 12px;
      color: #409eff;
   }
   li:last-child{
     border-bottom: 1px solid #e6ebf5;
   }
   .el-table .cell {
       text-align: center;
   }
   .margin-top{
       margin-top: 10px;
   }
 }
.border_red{

    border:1px solid #ff1010;
}
// .el-select .el-input.is-focus .el-input__inner{
//     border-color: #fff
// }
}
</style>

