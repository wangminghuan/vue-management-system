<template>
  <el-button type="primary" @click="sendMsgCode" :disabled="hasSendCode">{{sendCodeTxt}}</el-button>
</template>
<script>
export default {
   props:{
     sendMsgData:Object
    },
  data(){
      return{
          timer:null,
          hasSendCode:false,
          sendCodeTxt:"发送验证码",
      }
  },
  methods:{
     resetSendCodeStaus(){
       clearInterval(this.timer);
        this.hasSendCode=false;
        this.sendCodeTxt="发送验证码"
      },
     sendMsgCode(){
      //  console.log([this.sendMsgData , this.sendMsgData.phone])
     if(this.sendMsgData && this.sendMsgData.phone){
        
        this.$axios.post('/api/user/sms/send',this.sendMsgData)
            .then((res)=> {
            const _data=res.data;
                if(_data.code==0){
                  this.hasSendCode=true;
                    let maxTime=60;
                    this.timer=setInterval(()=>{
                      maxTime--;
                      this.sendCodeTxt=maxTime+"s后再发送";
                      if(maxTime==0){
                        this.resetSendCodeStaus()
                      }
                    },1000)
                     this.$message({
                        message: '发送成功！',
                        type: 'success'
                  });
                }else{
                  
                  if(_data.code==-2){
                    // 用户未在手机端注册，弹出二维码提示框
                    __vBus.$emit("C_showQRcodeDialog")
                    return false;
                  }
                  this.$message.error(_data.message);
                  
                }
            })
         }else{
             this.$message.error('请输入手机号！');
         }
      },
  }
}
</script>
