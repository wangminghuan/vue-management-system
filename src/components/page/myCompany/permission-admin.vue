<template>
   <section class="transfer-wrap">
   <h4 class="com-item-title">主管理员转让</h4>
    <el-form  v-if="!isSetNew" :label-position="labelPosition" label-width="120px" :model="formChangeAdmin" class="cont-wrap" :rules="formChangeRules" ref="formChangeAdmin">
    <el-form-item label="当前主管理员" >
      <span style="color:#5a5e66">{{formChangeAdmin.user}}</span>
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="formChangeAdmin.tel" :disabled="true"></el-input>
      <div class="perm-send-msg"><sendMsgCode :sendMsgData="sendMsgData"></sendMsgCode></div>
      <!-- <el-button type="primary" plain class="ver-code" @click="hanleClickGetVerCode" :disabled="sendCodeStaus">{{sendCodeTxt}}</el-button> -->
    </el-form-item>
    <el-form-item label="验证码" prop="code">
      <el-input v-model="formChangeAdmin.code"></el-input>
    </el-form-item>
    <el-form-item label="管理密码" prop="password" >
      <el-input v-model="formChangeAdmin.password" type="password"></el-input>
    </el-form-item>
      <el-button type="primary" style="margin-left:118px" @click="handleGoback"  plain>上一步</el-button>
      <el-button type="primary" @click="handleChangeNext('formChangeAdmin')" >下一步</el-button>
  </el-form>

  <el-form v-else :label-position="labelPosition" label-width="120px" :model="formSetAdmin" class="cont-wrap" :rules="formSetRules" ref="formSetAdmin">
    <el-form-item label="新主管理员" prop="user">
      <el-autocomplete
      v-model="formSetAdmin.user"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入管理员名称"
      @select="handleSelect"
    ></el-autocomplete>
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="formSetAdmin.tel" :disabled="true"></el-input>
      <div class="perm-send-msg"><sendMsgCodeNew :sendMsgData="sendMsgDataNew"></sendMsgCodeNew></div>
    </el-form-item>
    <el-form-item label="验证码" prop="code">
      <el-input v-model="formSetAdmin.code"></el-input>
    </el-form-item>
      <el-button type="primary" style="margin-left:118px" @click="isSetNew=false" plain>上一步</el-button>
      <el-button type="primary"  @click="handleConfirm('formSetAdmin')">确定</el-button>
  </el-form>
  </section>
</template>

<script>
import sendMsgCode from "../../common/sendMsgCode";
import sendMsgCodeNew from "../../common/sendMsgCode";
 export default {
     components:{
       sendMsgCode,
       sendMsgCodeNew
     },
     props:{
        isShowTransfer:Boolean,
        adminTel:String,
        adminName:String,
        adminMid:String,
        adminMpass:String
     },
    data() {
      return {
        sendMsgData:{
            phone:this.adminTel,
            usage:4
        },
        sendMsgDataNew:{
            phone:"",
            usage:4
        },
        labelPosition: 'right',
        timer:null,
        isSetNew:false,
        restaurants: [],
        timeout:  null,
        // showTransfer:this.isShowTransfer,
        formChangeAdmin: {
          password: '',
          code: '',
          tel: this.adminTel,
          user:this.adminName,
          mid:this.adminMid,
        },
        formChangeRules:{
          code: [
              { required: true, message: '请输入验证码', trigger: 'blur' }
            ],
            password:[
              { required: true, message: '请输入管理密码', trigger: 'blur' }
            ]
        },
        formSetAdmin: {
          code: '',
          tel: '',
          user:'',
          mid:''
        },
        formSetRules:{
          code: [
              { required: true, message: '请输入验证码', trigger: 'blur' }
            ],
          user:[
              { required: true, message: '请输入新管理员姓名' }
            ]
        },
      }
    },
    methods: {
      //   上一步
      handleGoback(){
       this.$emit('update:isShowTransfer', false);
      },
      handleChangeNext(formName){
        //转让主管理员下一步
        this.$refs[formName].validate((valid) => {
          if (valid) {
          // 第一步校验
          this.$axios.post('/api/administrator/admin/moveAdministratorCheck',{
              mid:this.adminMid,
              phone:this.formChangeAdmin.tel,
              m_password:this.formChangeAdmin.password,
              captcha:this.formChangeAdmin.code
          })
            .then((res)=> {
              // 成功！！
              const _data=res.data;
              if(_data.code==0){
                  this.isSetNew=true;
              }else{
                // 失败
                this.$message.error(_data.message);
              }
            })

             
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleConfirm(formName){
        // 转让主管理员确定校验
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/api/administrator/admin/moveAdministrator',{
              mid:this.formSetAdmin.mid,
              phone:this.formSetAdmin.tel,
              captcha:this.formSetAdmin.code
            })
              .then((res)=> {
                const _data=res.data;
                if(_data.code==0){
                    this.$message({
                      message: '主管理员转让完成，需要您重新登录！！',
                      type: 'warning'
                    });
                    setTimeout(()=>{
                    sessionStorage.clear();
                    this.$router.push('/login');
                    },1500)
                }else{
                  this.$message.error(_data.message);
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
                mid:item.m_id,
                tel:item.u_phone
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
        this.formSetAdmin.mid=item.mid;
        this.formSetAdmin.user=item.value;
        this.formSetAdmin.tel=item.tel;
        this.sendMsgDataNew.phone=item.tel;
      }
    }
  }
</script>
