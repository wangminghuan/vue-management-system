<template>
    <div>
    <div class="login-wrap" v-if="isNotIE9" :style="{height: winHeight}">
        <div class="login-topbar">
            <h4>保世界管理后台 </h4>
            <div class="signin-btn"><span @click="handleClickSignin">企业注册</span></div>
        </div>
        <div class="login-form-wrap">
            <section v-if="!isSelctedCompany" class="com-form-wrap">
            <!-- <el-tabs type="card" class="login-tab" v-model="activeName"> -->
                <!-- 登陆 账号登录 -->
                    <!-- <el-tab-pane label="保世界账号登录" name="inputLogin"> -->
                    <h4>保世界账号登录</h4>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="input-form" style="margin-top:35px">
                        <el-form-item prop="username">
                            <el-input v-model="ruleForm.username" placeholder="请输入手机号" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"  auto-complete="off" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                        </el-form-item>
                    </el-form>
                        <div class="login-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
                        </div>
                        <div class="login-tips">
                            <!-- <span>企业注册</span> -->
                            <em @click="handleClickForget">忘记密码</em>
                        </div>
                   
                <!-- </el-tab-pane> -->
                <!-- <el-tab-pane label="扫码登录" name="scanLogin">
                    <div class="ecode-wrap">
                        <div class="img-wrap">
                            <img :src="scanLoginImg" />
                            <section class="lose-tips" :style="{display:ecodeIsLose?'block':'none'}">
                            <p>您的二维码已失效</p>
                            <p>请点击下方刷新按钮</p>
                            </section>
                            </div>
                        <div class="ecode-tips"><b>请使用保世界扫描二维码登录</b><i @click="handleClickRefresh">刷新</i></div>
                    </div>
                </el-tab-pane> -->
            <!-- </el-tabs> -->
            <!-- 忘记密码 -->
              <el-dialog
                title="忘记密码"
                class="forget-password-dialog"
                :visible.sync="showForgetPasswordDialog"
                width="650px"
                center>
                <el-form :label-position="labelPosition" label-width="120px" :model="formFindPasswordCode" :rules="formFindCodeRule" ref="formFindManCode">
                    <el-form-item label="手机号" prop="tel">
                        <el-input v-model="formFindPasswordCode.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="短信验证码" prop="msg">
                        <el-input v-model="formFindPasswordCode.msg" style="width:240px"></el-input>
                        <div class="send-msg-btn"><sendMsgCode :sendMsgData="sendMsgData2"></sendMsgCode></div>
                    </el-form-item>
                    <el-form-item label="新的登录密码" prop="newCode">
                        <el-input v-model="formFindPasswordCode.newCode" type="password" auto-complete="off" placeholder="数字字母组合，长度不低于8位"></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入密码" prop="reNewCode" >
                        <el-input v-model="formFindPasswordCode.reNewCode" type="password" auto-complete="off" placeholder="数字字母组合，长度不低于8位"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <!-- <el-button @click="showForgetMangDialog = false">取 消</el-button> -->
                    <el-button type="primary" @click="handleRestPasswordCode('formFindManCode')">确 定</el-button>
                </span>
                </el-dialog>
            </section>
            <section v-else class="com-form-wrap">
                <!-- 第二步登录 -->
                <h4>保世界账号登录</h4>
                <div class="company-list">
                     <el-carousel 
                     type="card" 
                     height="70px"  
                     :autoplay="false"
                     indicator-position="none"
                     arrow="always"
                     @change="handleActive"
                     >
                    <el-carousel-item v-for="(item,index) in companyList" :key="index">
                        <div class="company-logo">
                            <img v-if="item.c_logo!==''" :src="item.c_logo" >
                            <img v-else src="../../../static/img/default-logo.png" >
                        </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                
                <div class="team-name">{{activeCompany.c_name}}</div>
                <div v-if="activeCompany.isSetPassword">
                    <div :class="[isSubmitSelectEmpty ?'mange-input-error' : '', 'mange-code-input']">
                    <el-input type="password" placeholder="请输入管理密码" v-model="ruleSelectForm.password" @keyup.enter.native="submitSelectForm()" :autofocus="true"></el-input>
                    <div class="mange-code-error" v-show="isSubmitSelectEmpty">请输入密码</div>
                    </div>
                    <div class="login-btn" style="margin-top: 20px;">
                        <el-button type="primary" @click="submitSelectForm()" >登 录</el-button>
                    </div>
                </div>
                <div v-else class="mange-code-wrap">
                    <div class="setcode-tips">您好，这是你第一次登录该企业的保世界管理后台，请先设置管理密码</div>
                    <div class="login-btn" style="margin-top: 20px;">
                        <el-button type="primary" @click="showSetMangDialog = true">设置管理密码</el-button>
                    </div>
                </div>
                <div class="login-tips">
                    <span @click="handleGoBack">返回</span>
                    <em v-show="activeCompany.isSetPassword" @click="handleClickForgetMan">忘记管理密码</em>
                </div>
            
            <!-- 设置管理密码 -->
            <el-dialog
                title="设置管理密码"
                class="forget-man-dialog"
                :visible.sync="showSetMangDialog"
                width="432px"
                center>
                <el-form :label-position="labelPosition" label-width="120px" :model="formSetManCode" :rules="formSetManCodeRule" ref="formSetManCode">
                    <el-form-item label="新的管理密码" prop="code">
                        <el-input v-model="formSetManCode.code" type="password" auto-complete="off" placeholder="数字字母组合，长度不低于8位"></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入密码" prop="recode" >
                        <el-input v-model="formSetManCode.recode" type="password" auto-complete="off" placeholder="数字字母组合，长度不低于8位"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleSetMangDialog('formSetManCode')">确 定</el-button>
                </span>
                </el-dialog>
            
            <!-- 找回密码 -->
            <el-dialog
                title="找回管理密码"
                class="forget-man-dialog"
                :visible.sync="showForgetMangDialog"
                width="520px"
                center>
                <el-form :label-position="labelPosition" label-width="120px" :model="formFindManCode" :rules="formFindCodeRule2" ref="formFindManCode">
                    <el-form-item label="手机号" style="position:relative" prop="tel">
                        <el-input v-model="formFindManCode.tel" :disabled="true" style="width:200px"></el-input>
                        <div class="send-msg-btn"><sendMsgCode :sendMsgData="sendMsgData"></sendMsgCode></div>
                    </el-form-item>
                    <el-form-item label="短信验证码" prop="msg">
                        <el-input v-model="formFindManCode.msg"></el-input>
                    </el-form-item>
                    <el-form-item label="新的管理密码" prop="newCode">
                        <el-input v-model="formFindManCode.newCode" type="password" auto-complete="off" placeholder="数字字母组合，长度不低于8位"></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入密码" prop="reNewCode" >
                        <el-input v-model="formFindManCode.reNewCode" type="password" auto-complete="off" placeholder="数字字母组合，长度不低于8位"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <!-- <el-button @click="showForgetMangDialog = false">取 消</el-button> -->
                    <el-button type="primary" @click="handleRestMangCode('formFindManCode')">确 定</el-button>
                </span>
                </el-dialog>
            </section>
        </div>
    </div>
    <div v-else>
        <div style="margin-top:100px"><img style="margin:0 auto;width:200px;display:block" src="//s29.9956.cn/res/bxd365/images/error-tips.jpg" />
        <p style="text-align: center;">你的浏览器实在<strong>太太太太太太旧了</strong>，请升级浏览器！！
        <a style="text-decoration:underline" target="_blank" href="http://rj.baidu.com/soft/detail/14744.html">立即升级</a></p></div>
    </div>
    <entry v-if="entryHomeStatus" :renderData="entryData"></entry>
    </div>
</template>

<script>
import sendMsgCode from "../common/sendMsgCode";
import entry from "./Entry.vue";
let timer=null,timerOut=null;
    export default {
        components:{
          sendMsgCode,
          entry
        },
        created(){
            if(this.defaultUserData[0] && !this.defaultNameisExpire){
               this.ruleForm.username=this.defaultUserData[0]
            }
             sessionStorage.clear();
        },
        data(){
            // 判断是否是IE9，不支持ie9
            const  isIE9=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0"?true:false;
            var validatePass = (rule, value, callback) => {
                    if (value === '') {
                      callback(new Error('请再次输入密码'));
                    } else if (this.showForgetPasswordDialog && value !== this.formFindPasswordCode.newCode) {
                       callback(new Error('两次输入密码不一致!'));
                    } else if(this.showForgetMangDialog && value !== this.formFindManCode.newCode){
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                      callback();
                    }
                };
            return {
                entryHomeStatus:false,
                entryData:{},
                winHeight:this.getViewPortHeight()+"px",
                defaultUserData:window.localStorage?(localStorage.getItem('__loginName__')||"").split("#"):[],
                hasSubmit:false,
                isNotIE9:!isIE9,
                activeName:"inputLogin",
                isSelctedCompany:false,
                showForgetMangDialog:false,
                showForgetPasswordDialog:false,
                showSetMangDialog:false,
                labelPosition:"right",
                expire:600,
                scanKey:"",
                companyList:[],
                activeCompany:{},
                ecodeIsLose:false,
                isFirstClickScan:true,
                loginData:{
                    access_token:"",
                    u_id:"",
                    c_id:"",
                    ver:"1.0.0"
                },
                adminVal:1, //1,无权限，2主管理员, 3子管理员
                mueuVal:[], // 1:通讯录管理，2工作台管理，3：企业设置，4，通知公告，5. 工作台轮播图
                isDissolve:"1",// 1正常,2禁用,3解散中,4已解散
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                scanLoginImg:"",
                ruleSelectForm:{
                        password: ''
                },
                isSubmitSelectEmpty:false,
                formFindPasswordCode:{  //忘记密码
                    tel:"",
                    msg:"",
                    newCode:"",
                    reNewCode:""
                },
                formFindManCode:{  //忘记管理密码
                    tel:"",
                    msg:"",
                    newCode:"",
                    reNewCode:""
                },
                formFindCodeRule:{ //忘记密码校验规则
                    tel:[
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                     ],
                     msg: [
                        { required: true, message: '请输入短信验证码', trigger: 'blur' }
                     ],
                     newCode: [
                        { required: true, message: '数字字母组合，长度不低于8位', trigger: 'blur' }
                     ],
                     reNewCode: [
                        {required: true, validator: validatePass, trigger: 'blur' }
                     ],
                },
                formFindCodeRule2:{ //忘记管理密码校验规则
                 tel:[
                        { required: false }
                     ],
                     msg: [
                        { required: true, message: '请输入短信验证码', trigger: 'blur' }
                     ],
                     newCode: [
                        { required: true, message: '数字字母组合，长度不低于8位', trigger: 'blur' }
                     ],
                     reNewCode: [
                        {required: true, validator: validatePass, trigger: 'blur' }
                     ],
                },
                formSetManCode:{
                    code:"",
                    recode:""
                },
                formSetManCodeRule:{
                     code: [
                        { required: true, message: '数字字母组合，长度不低于8位', trigger: 'blur' }
                     ],
                    recode: [
                            { required: true, message: '请再次输入密码', trigger: 'blur' }
                    ],
                },
                sendMsgData:{
                  phone:"",
                  usage:3
                 },
                 
            }
        },
        computed:{
            // defaultNameisExpire: function () {
            //      // 是否过期 ，true:过期
            //     return this.defaultUserData[1] && ((new Date()).getTime()-this.defaultUserData[1])/(1000*60*60*24)>15?true:false
            // },

            sendMsgData2:function(){
                    return {
                        phone:this.formFindManCode.tel,
                        usage:3
                    }
                 }
        },
        watch:{
            activeName:function(val){
                if(val=="scanLogin" && this.isFirstClickScan ){
                    // 切换到第二个tab，且首次点击时候才自动更新二维码
                    this.getScanLoginImg();
                    this.isFirstClickScan=false;
                }
            },
            ecodeIsLose:function(val){
                if(val){
                  console.log("验证码失效！")
                  clearInterval(timer)
                  clearTimeout(timerOut)
                }
            }

        },
        methods: {
            // 登录提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.hasSubmit) return;
                        this.hasSubmit=true;
                        // //this.$message('努力提交中~');
                        this.sendMsgData.phone=this.ruleForm.username;
                        this.$axios.post('/api/user/account/companyAdminLogin',{
                            phone:this.ruleForm.username.replace(/\s+/g,""),
                            password:this.ruleForm.password
                        } )
                        .then((res)=> {
                        const _data=res.data;
                            if(_data.code==0){
                                this.$message('验证通过，请进行下一步操作');
                                this.loginData.access_token=_data.data.loginToken;
                                this.loginData.u_id=_data.data.u_id;
                                this.companyList=_data.data.company;
                                this.isSelctedCompany=true;
                                 sessionStorage.setItem('__uid__',_data.data.u_id);
                                 sessionStorage.setItem('__token__',_data.data.loginToken);
                                //  第一步登录完毕，结束轮询
                                 clearInterval(timer)
                                 clearTimeout(timerOut)
                            }else{
                              this.$message.error(_data.message);
                            }
                            setTimeout(() => {
                                this.hasSubmit=false;
                            }, 1000);
                        }).catch(()=>{
                            this.hasSubmit=false;
                        })
                        
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 登录管理密码提交
            submitSelectForm() {
                    if(this.ruleSelectForm.password==""){
                        this.isSubmitSelectEmpty=true
                        return false;
                    }else{
                        this.isSubmitSelectEmpty=false
                    }
                    if(this.hasSubmit) return;
                        this.hasSubmit=true;
                        this.$axios.post('/api/member/member/passwordVerifyByToken',{
                            choosenCid:this.activeCompany.c_id,
                            password:this.ruleSelectForm.password,
                            u_id:this.loginData.u_id,
                            loginToken:this.loginData.access_token,
                        } )
                        .then((res)=> {
                        const _data=res.data;
                            if(_data.code==0){
                                this.$message({
                                    showClose: true,
                                    message: '恭喜你，登录成功！！',
                                    type: 'success'
                                });
                                // 进入首页，初始化数据
                                this.entryHomeStatus=true;
                                this.loginData.c_id=_data.data.c_id;
                                this.loginData.access_token=_data.data.access_token;
                                this.entryData={
                                    ..._data.data,
                                    ...this.loginData,
                                    m_name:this.activeCompany.m_name,
                                    tel:this.ruleForm.username.replace(/\s+/g,"")
                                };                              

                                // this.mueuVal=_data.data.models;
                                // this.adminVal=_data.data.identity;
                                // this.isDissolve=_data.data.isdissolve||"1";
                                // sessionStorage.setItem('__token__',_data.data.access_token);
                                // if(window.localStorage && (this.defaultUserData[0]=="" || this.defaultNameisExpire || (this.defaultUserData[0]!==this.ruleForm.username.replace(/\s+/g,""))) ){
                                //     // 本地数据为空或过期时，账号数据更新时，再次存储一份
                                //     localStorage.setItem('__loginName__',this.ruleForm.username.replace(/\s+/g,"")+"#"+new Date().getTime());
                                // }
                                // //将已经登录过的账号和公司存起来，首次登录展示引导
                                // let hasLoginUserAndCompany=JSON.parse(localStorage.getItem('__hasloginUidCid__'))||[];
                                // const __item=this.loginData.u_id+"#"+this.loginData.c_id;
                                // if(hasLoginUserAndCompany.indexOf(__item)==-1){
                                //     hasLoginUserAndCompany.push(__item);
                                //     localStorage.setItem('__hasloginUidCid__',JSON.stringify(hasLoginUserAndCompany))
                                //     this.entryHome("showGuide");
                                // }else{
                                //     this.entryHome();
                                // }                                
                            }else{
                              this.$message.error(_data.message);
                            }
                            setTimeout(() => {
                                this.hasSubmit=false;
                            }, 1000);
                        }).catch(()=>{
                            this.hasSubmit=false;
                        })
            },
            
            // entryHome(arg){
            //    sessionStorage.setItem('__data__',JSON.stringify(this.loginData));
            //    //    设置显示菜单
            //    const __menu={
            //        menu: this.mueuVal instanceof Array? this.mueuVal.join("&"):"",
            //        admin:this.adminVal,
            //        status:this.isDissolve,
            //    }
            //    sessionStorage.setItem('__menu__',JSON.stringify(__menu));
            //        arg?this.$router.push({path: '/home', query:{"guide": 1}})
            //           :this.$router.push({path: '/home'});
               
            // },
            handleActive(active){
                this.activeCompany=this.companyList[active]
                // console.log(this.activeCompany)
            },
            handleClickForget(){
                this.showForgetPasswordDialog=true;
                this.formFindPasswordCode.tel=this.ruleForm.username;
                // 忘记密码
                
            },
            handleClickForgetMan(){
                this.showForgetMangDialog=true;
                this.formFindManCode.tel=this.ruleForm.username;
                console.log(this.formFindManCode)
                // 忘记管理密码
                
            },
            handleClickRefresh(){
                clearInterval(timer);
                clearTimeout(timerOut);
                this.getScanLoginImg()
            },
            // 获取登录二维码
            getScanLoginImg(){
               this.$axios.post('/api/user/account/loginQrcode', )
                        .then((res)=> {
                        const _data=res.data;
                            if(_data.code==0){
                                 this.scanLoginImg=_data.data.image; 
                                 this.expire=_data.data.expire;
                                 this.scanKey=_data.data.key;
                                 this.ecodeIsLose=false;
                                
                                // 轮询检测是否扫描了二维码
                                 timer=setInterval(()=>{
                                     console.log("no message")
                                     this.$axios.post('/api/user/account/loginQrcodeStatus',{
                                         key:this.scanKey
                                     })
                                        .then((res)=> {
                                        const _data=res.data;
                                            if(_data.code==0){
                                                // 成功接收到扫描用户登录信息
                                                this.$message('验证通过，请进行下一步操作');
                                                this.loginData.access_token=_data.data.loginToken;
                                                this.loginData.u_id=_data.data.u_id;
                                                this.isSelctedCompany=true;
                                            }else{
                                                if(sessionStorage.getItem('__data__')){
                                                    // 如果有__data__则说明第一步登录已经成功，不需要继续轮询了
                                                     clearInterval(timer)
                                                     clearTimeout(timerOut)
                                                }
                                            }
                                        })
                                        .catch((err)=>{
                                                console.log(err);
                                                clearInterval(timer)
                                                clearTimeout(timerOut)
                                                this.ecodeIsLose=true;
                                        });
                                },3000);
                                // 定时器，自动调起失效
                                timerOut=setTimeout(()=>{
                                      this.ecodeIsLose=true;
                                },this.expire*1000)
                            }else{
                              this.$message.error('抱歉，获取二维码失败，请刷新重试~');
                              this.ecodeIsLose=true;
                            }
                        })
                        .catch((err)=>{
                            // console.log(err);
                            this.ecodeIsLose=true;
                            // this.$message.error('抱歉，网络异常，获取二维码失败，请刷新重试~');
                        });
            },
            
            handleClickSignin(){
                 this.$router.push('/regist');
            },
            handleGoBack(){
                this.isSelctedCompany=false;
            },
            // 获取管理密码（被转让，首次登录）
            handleSetMangDialog(formName){
              this.$refs[formName].validate((valid) => {
                if (valid) {
                 if(this.formSetManCode.code !== this.formSetManCode.recode){
                      this.$message.error("两次密码必须相同");
                       return false;
                 }
                 //this.$message('努力提交中~');
                 this.$axios.post('/api/member/member/setPassword',{
                  u_id:this.loginData.u_id,
                  password:this.formSetManCode.code,
                  c_id:this.activeCompany.c_id,
                  loginToken:this.loginData.access_token
                 })
                .then((res)=> {
                    const _data=res.data;
                        if(_data.code==0){
                           this.$message({
                                message: '恭喜你，管理密码设置成功！！',
                                type: 'success'
                             });
                            const _index=this.companyList.indexOf(this.activeCompany);
                            if(_index>-1){
                               let _item=this.companyList[_index];
                                   _item.isSetPassword=true;
                               this.companyList.splice(_index,1,_item);
                               this.showSetMangDialog=false;
                            }else{
                                window.location.reload()
                            }
                            
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
            // 忘记密码
            handleRestPasswordCode(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                 //this.$message('努力提交中~');
                 const password=this.formFindPasswordCode.newCode;
                 const rePassword=this.formFindPasswordCode.reNewCode;
                 if(password!==rePassword){
                      this.$message('两次输入不相同')
                 }
                 this.$axios.post('/api/user/account/forgotPassword',{
                  password:this.formFindPasswordCode.newCode,
                  rePassword:this.formFindPasswordCode.reNewCode,
                  phone:this.formFindPasswordCode.tel,
                  captcha:this.formFindPasswordCode.msg,
                 })
                .then((res)=> {
                    const _data=res.data;
                        if(_data.code==0){
                           this.$message({
                                message: '恭喜你，密码修改成功！！',
                                type: 'success'
                             });
                             this.showForgetPasswordDialog=false;
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
            // 忘记管理密码
            handleRestMangCode(formName){
              this.$refs[formName].validate((valid) => {
                
                if (valid) {
                 //this.$message('努力提交中~');
                 this.$axios.post('/api/company/company/retrieveAdminPassword',{
                  u_id:this.loginData.u_id,
                  c_id:this.activeCompany.c_id,
                  password:this.formFindManCode.newCode,
                  rePassword:this.formFindManCode.reNewCode,
                  phone:this.ruleForm.username,
                  captcha:this.formFindManCode.msg,
                  loginToken:this.loginData.access_token
                 })
                .then((res)=> {
                    const _data=res.data;
                        if(_data.code==0){
                           this.$message({
                                message: '恭喜你，管理密码修改成功！！',
                                type: 'success'
                             });
                             this.showForgetMangDialog=false;
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
            getViewPortHeight() {
                return document.documentElement.clientHeight || document.body.clientHeight;
            }
        }
    }
</script>

<style lang="scss">
 .login-wrap{
     .mange-code-input{
         width: 354px;
        display: block;
        margin: 0 auto;
        position: relative;
     }
     .mange-input-error input{
         border-color: #fa5555;
     }
     .mange-code-error{
        color: #fa5555;
        font-size: 12px;
        position: absolute;
        left: 0px;
        bottom: -16px;
     }
        .login-topbar{
            position: fixed;
            height: 60px;
            background-color: #545c64;
            top:0;
            right: 0;
            width: 100%;
            color: #fff;
            font-size:16px;
            h4{
                float: left;
                width: 240px;
                height: 50px;
                line-height: 50px;
                margin-top: 5px;
                border-right: 1px solid #454b55;
                font-size: 16px;
                text-align: center;
            }
            .signin-btn{
                width: 1200px;
                position: absolute;
                left:0;
                right: 0;
                margin:0 auto;
                height: 60px;
                span{
                    float: right;
                      height: 28px;
                    line-height: 28px;
                    border-radius: 28px;
                    border: 1px solid #fff ;
                    text-align: center;
                    font-size: 12px;
                    display: block;
                    padding:0 18px;
                    margin-top:15px;
                    cursor: pointer;
                }
            }
        }
        position: relative;
        border-top:60px solid #545c64;
        width:100%;
        height:100%;
        overflow: auto;
        background-image:url("../../../static/img/login-bg.png");
        background-repeat:no-repeat;
        background-position: center;
        .login-tab{
            .el-tabs__item.is-active{
                border-bottom:2px solid #3885f9;
                // border-left:none;
            }
            .el-tabs__nav{
                width: 100%;
                height: 65px;
            }
            .el-tabs__item{
                width: 50%;
                height: 64px;
                line-height: 64px;
                text-align: center;
                border-left:none;
                
            }
        }
        .login-form-wrap{
            background-image:url("../../../static/img/login-title.png");
            background-repeat: no-repeat;
            background-position: 0 0;
             padding-top: 42px;
            width: 563px;
            position: absolute;
            top:50%;
            margin:0 auto;
            margin-top: -310px;
            left: 0;
            right: 0;
            .team-name{
              color:#353535;
              text-align:center;
              line-height:16px;
              margin-top:-20px;
              font-size:14px;
              white-space: nowrap;
              overflow:hidden;
              text-overflow: ellipsis;
              margin-bottom:10px;
           }
           .setcode-tips{
               font-size:14px;
               line-height:20px;
               margin-bottom:20px;
               margin-top:22px;
               color:#353535;
               padding: 0 42px;
           }
        }
        
        .ecode-wrap{
            .img-wrap{
              width:204px;
              height: 204px;
              margin:0 auto;
              margin-top:25px;
              margin-bottom: 14px;
              position: relative;
            }
            .lose-tips{
               width: 204px;
               height: 204px;
               background-color: rgba(255, 255, 255, 0.7);
               position: absolute;
               color: #f05959;
               top:0;
               left:0;
               font-size: 14px;
               font-weight: bold;
               padding-top: 84px;
               text-align: center;
               display: none;
            }
            .lose-show{
                display: block
            }
            img{
                width:100%;
                display: block; 
               
            }
            .ecode-tips{
                height: 48px;
                line-height: 48px;
                font-size: 14px;
                color: #a3a3a3;
                position: relative;
                width: 210px;
                margin:0 auto;
                i{
                    color: #3885f9;
                    position: absolute;
                    right: 0;
                    top:0;
                    text-decoration: underline;
                    margin-left: 18px;
                    cursor: pointer;
                    line-height: 48px;
                    height: 48px;
                }
            }
        }



        // //////////////////////////////
        .login-btn button{
            width: 354px;
            margin: 0 auto;
            display: block;
            height: 60px;
            font-size: 16px;
            border-radius: 0;
        }
        .login-tips{
            height:62px ;
            line-height: 62px;
            color: #fff;
            font-size: 14px;
            span{
                cursor: pointer;
                // height: 62px;
                width: 70px;
                // display: block;
                float: left;
            }
            em {
                float: right;
                padding-left: 10px;
                cursor: pointer;
            }
        }
        .com-form-wrap{
            width: 434px;
            height: 408px;
            background-color: #fff;
            margin:0 auto;
            margin-top:105px;
            h4{
              height: 66px;
              line-height: 66px;
              border-bottom: 1px solid #dfdfdf;
            font-size: 16px;
            color: #353535;
            padding-left:24px; 
            }
            .el-input__inner{
                height: 50px;
                line-height: 50px;
            }
            .company-list{
                height: 78px;
                margin-top:28px;
                margin-bottom: 25px;
                padding: 0 20px;
            }
            .input-form{
               padding:0 40px;
            }
            .login-tips{
                color: #a3a3a3;
                padding: 0 43px;
            }
        }
        .company-logo{
            img{
                width: 70px;
                height: 70px;
                border-radius: 10px;
                overflow: hidden;
                display: block;
                margin:0 auto;
                border:1px solid #dfdfdf;
            }
            // .company-name{
            //     text-align: center;
            //     color: #ed6b00;
            //     padding: 0 4px;
            //     padding-top:20px;
            //     font-size: 12px;
            // }
        }
        .is-active.el-carousel__item--card{
            img,.company-name{
                border:1px solid #3485ff;
            }
        }
        .el-carousel__arrow--left{
            left:0
        }
        .el-carousel__arrow--right{
            right:0
        }
        .forget-man-dialog{
             .el-input__inner{
                 height: 40px;
             }
             .send-msg-btn{
                 position: absolute;
                 top:0;
                 right:0;
             }
        }
        .forget-password-dialog{
            .el-input__inner{
                 height: 40px;
             }
             .send-msg-btn{
                 position: absolute;
                 top:0;
                 right:0;
             }
            .el-dialog__header{
                border-bottom: 1px solid #dfe4ed;
                padding-top: 15px;
            }
            .el-dialog__body{
                padding-left: 70px;
                padding-right: 70px;
            }
        }
     //////////////////////////////////

//   .el-carousel__item:nth-child(2n+1) {
//     background-color: #d3dce6;
//   }
    }
</style>