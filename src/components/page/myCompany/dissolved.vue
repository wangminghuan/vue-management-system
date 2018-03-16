<template>
  <div class="company-dis-wrap">
    <h4 class="com-item-title">解散企业</h4>
    <img class="tips-pic" src="../../../../static/img/dissloved-tips.png" />
    <section v-if="isConfirm" >
      <div class="cont-txt">
        <p>解散企业后，确认后您仍 <b>拥有7天的犹豫期</b></p>
        <p>犹豫期期间不可对企业进行任何操作，期间内您仍可前往此页面取消解散</p>
        <p>犹豫期过后，您后台管理帐号、通讯录及应用数据将会被删除，请做好备份。</p>
      </div>
       <el-button type="danger" @click="showConfirmDialog">确认解散</el-button>
    </section>
    <section v-else>
      <div class="cont-txt">
        <p>您的企业还有 <b>{{countdown}}</b> 自动解散，您也可以选择恢复企业</p>
      </div>
      <el-button type="danger" @click="showRecoveryDialog">恢复企业</el-button>
    </section>
    <el-dialog
    class="dialog-confirm"
    :title="dialogType?'恢复企业':'解散企业'" 
    :visible.sync="centerDialogVisible"
    width="560px"
    center>
    <el-form  :label-position="labelPosition" label-width="100px" :model="formLabelAlign" :rules="formLabelRules" ref="formLabelAlign">
      <el-form-item label="当前主管理员">
        <span style="color:#5a5e66">{{formLabelAlign.user}}</span>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formLabelAlign.tel" :disabled="true"></el-input>
        <div class="send-code"><sendMsgCode :sendMsgData="sendMsgData"></sendMsgCode></div>
        <!-- <el-button type="primary" plain  @click="hanleClickGetVerCode" :disabled="hasSendCode">{{sendCodeTxt}}</el-button> -->
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="formLabelAlign.code"></el-input>
      </el-form-item>
      <el-form-item label="管理密码" prop="password">
        <el-input v-model="formLabelAlign.password" type="password"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm('formLabelAlign')">确 定</el-button>
    </span>
     </el-dialog>
  </div>
</template>

<script>
import sendMsgCode from "../../common/sendMsgCode";
export default {
  components:{
       sendMsgCode
     },
    data() {
      const _menuObj=JSON.parse(sessionStorage.getItem("__menu__"))||{};
      return {
        timer:null,
        isConfirm:_menuObj.status==3?false:true,
        dialogType:0,
        centerDialogVisible:false,
        labelPosition: 'right',
        formLabelAlign: {
          password: '',
          code: '',
          tel: '',
          user:'',
          mid:"",
        },
        formLabelRules:{
              code: [
                  { required: true, message: '请输入验证码',trigger: 'blur' }
                ],
              password: [
                  { required: true, message: '请输入管理密码', trigger: 'blur' }
                ],
        },
        countdown:"00天00小时00分00秒",
        leftTime:0,
        sendMsgData:{
            phone:this.adminTel,
            usage:4
        },
      };
    },
    methods:{
        showCountDown(leftTime) {
          if(leftTime<=0){
            return "00天00小时00分00秒"
          }
          var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数 
          var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
          var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
          var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
          days = this.checkTime(days); 
          hours = this.checkTime(hours); 
          minutes = this.checkTime(minutes); 
          seconds = this.checkTime(seconds); 
          this.leftTime=this.leftTime-1000;
          return (days+"天"+hours+"小时"+minutes+"分"+seconds+"秒")
          },
      checkTime(i){
          if(i<10) { 
            i = "0" + i; 
          } 
          return i;
      },
      showConfirmDialog(){
        // 解散企业弹窗
        this.centerDialogVisible=true;
        this.dialogType=0;
      },
      showRecoveryDialog(){
        // 确认恢复企业弹窗
         this.formLabelAlign.code= "";
         this.formLabelAlign.password= "";
         this.dialogType=1;
         this.centerDialogVisible=true;
         
      },
      handleDialogConfirm(formName){
        this.$refs[formName].validate((valid) => {
         if (valid) {
              if(this.dialogType){ 
                    // 恢复确认  
                this.$axios.post('/api/company/company/applyRecoverCompany',{
                    companyId:__golbal_cid,
                    adminPassword:this.formLabelAlign.password,
                    phone:this.formLabelAlign.tel,
                    captcha:this.formLabelAlign.code,
                  } )
                  .then((res)=> {
                    const _data=res.data;
                    console.log(_data);
                    if(_data.code==0){
                        this.isConfirm=true;
                        this.centerDialogVisible=false;
                        clearInterval(this.timer);
                        this.$message({
                            message: '恢复企业成功，您需要重新登录！',
                            type: 'success'
                          });
                          setTimeout(() => {
                             sessionStorage.clear();
                             this.$router.push('/login');
                        }, 2000);
                    }else{
                      this.$message.error(_data.message);
                    }
                  })   
              }else{
                    // 解散确认
                  this.$axios.post('/api/company/company/applyDissolutionCompany',{
                    companyId:__golbal_cid,
                    adminPassword:this.formLabelAlign.password,
                    phone:this.formLabelAlign.tel,
                    captcha:this.formLabelAlign.code,
                  } )
                  .then((res)=> {
                    const _data=res.data;
                    if(_data.code==0){
                        this.isConfirm=false;
                        this.centerDialogVisible=false;
                        this.$message({
                          message: '冻结企业成功，您需要重新登录',
                          type: 'success'
                        });
                        setTimeout(() => {
                             sessionStorage.clear();
                             this.$router.push('/login');
                        }, 2000);
                      this.leftTime=((new Date(_data.data.endDissolutionTime)).getTime()-(new Date(_data.data.starDissolutionTime)).getTime());
                      this.timer=setInterval(()=>{
                            
                            this.countdown=this.showCountDown(this.leftTime);
                            if(this.leftTime<=0){
                              sessionStorage.clear();
                               this.$router.push('/login');
                            }
                      },1000)
                    }else{
                      this.$message.error(_data.message);
                    }
                  })
              }
          }else{
             console.log('error submit!!');
             return false;
          }
      })
      }
    },
    mounted(){
      this.$axios.post('/api/company/company/getCompanyInfo').then((res)=> {
          if(res.data.code==0){
            const _data=res.data.data||{masterAdmin:{},};
            this.formLabelAlign.user=_data.masterAdmin.m_name;
            this.formLabelAlign.tel=_data.masterAdmin.u_phone;
            this.formLabelAlign.mid=_data.masterAdmin.m_id;
            this.sendMsgData.phone=_data.masterAdmin.u_phone;
            if(!this.isConfirm){
              // 如果处于解散状态，开始倒计时
              this.leftTime=((new Date(_data.c_endDissolutionTime)).getTime()-(new Date(_data.c_starDissolutionTime)).getTime());
                      this.timer=setInterval(()=>{
                            this.countdown=this.showCountDown(this.leftTime);
                            if(this.leftTime<=0){
                              sessionStorage.clear();
                              this.$router.push('/login');
                            }
                      },1000)
            }
          }
        })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.company-dis-wrap{
  .dialog-confirm{
    .el-input{
      width: 250px;
    }
    .send-code{
      position: absolute;
      top:0;
      right:10px;
    }
  }
  .tips-pic{
    width: 200px;
    margin:0 auto;
    display: block;
    margin-top:86px;
  }
  .cont-txt{
    width: 560px;
    margin:0 auto;
    text-align: center;
    line-height:30px;
    font-size: 16px;
    color: #353535 ;
    margin-top: 40px;
    margin-bottom: 50px;
    b{
      color:#409eff
    }
  }
  section .el-button{
    margin:0 auto;
    width: 120px;
    display: block;
  }
}
</style>
