<template>
<!-- 服务商入住组件 -->
    <div class="merchant-wrap">
        <div class="merchant-topbar">
            <router-link to="/home" tag="h4" style="cursor: pointer;">保世界管理后台 </router-link>
        </div>
        <div class="merchant-form-wrap"  v-loading.fullscreen.lock="fullscreenLoading">
            <h5>服务商入驻</h5>
            <el-steps :active="active" finish-status="success" class="step-wrap">
                <el-step title="完善服务信息"></el-step>
                <el-step title="入驻审核"></el-step>
                <el-step title="入驻成功"></el-step>
            </el-steps>
            <el-form class="first-step-wrap" v-show="active==1"  :label-position="labelPosition" label-width="134px" :model="formFirst" :rules="formFirstRule" ref="formFirst">
                
                <el-form-item label="公司名称" prop="cname">
                    <el-input v-model="formFirst.cname" placeholder="请输入公司名称" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="name">
                    <el-input v-model="formFirst.name" placeholder="请输入联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系人手机号" prop="tel">
                    <el-input v-model="formFirst.tel" placeholder="请输入联系人手机号"></el-input>
                </el-form-item>
                <el-form-item label="联系人邮箱" prop="email">
                    <el-input v-model="formFirst.email" placeholder="请输入联系人邮箱"></el-input>
                </el-form-item>

                <el-form-item label="所在地"  prop="location">
                    <city-select v-model="formFirst.location"></city-select>
                    <!-- <el-input style="margin-top:20px" placeholder="请输入详细地址" v-model="formFirst.locDetail" ></el-input> -->
                </el-form-item>
                <el-form-item label="" prop="locDetail" style="margin-top:-20px">
                    <el-input style="margin-top:20px" placeholder="请输入详细地址" v-model="formFirst.locDetail" ></el-input>
                </el-form-item>
                <el-form-item label="企业类型" prop="serType">
                    <el-select style="width:396px" :disabled="true" v-model="formFirst.serType" placeholder="请选择服务商类型" >
                        <el-option
                            v-for="item in comTypeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主营业务" prop="content">
                    <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入主营业务"
                        v-model="formFirst.content">
                        </el-input>
                </el-form-item>
                <el-form-item label="" class="clearfix" prop="agree">
                    <el-checkbox v-model="formFirst.agree" style="float:left">我同意</el-checkbox>
                    <div class="agreement" @click="agreementDialogVisible = true">《保世界服务入驻协议》</div>
                </el-form-item>
                <el-button class="next-btn" type="primary" @click="handleSubmitFirst('formFirst')">下一步</el-button>
                <div class="btm-tips">请认真核对以上信息是否正确</div>
                
                <el-dialog
                title="保世界服务入驻协议"
                :visible.sync="agreementDialogVisible"
                width="520px"
                center>
                <div>保世界服务入驻协议正在积极拟定中...</div>
                <span slot="footer">
                    <!-- <el-button @click="showForgetMangDialog = false">取 消</el-button> -->
                    <el-button type="primary" @click="agreementDialogVisible=false">确 定</el-button>
                </span>
                </el-dialog>

            </el-form>
            <el-form class="second-step-wrap" v-show="active==2" :label-position="labelPosition" label-width="80px" >
                <img src="../../../static/img/hopper.png"/>
               <div class="success"><p>您的入驻申请已提交，工作人员正在审核当中</p>
                    <p>期间注意接听来电以便核实信息。</p>
                </div>
                <div class="send-tips">如有问题，请联系客服电话：0371-55001255</div>
            </el-form>

            <el-form class="second-step-wrap" v-show="active==3" :label-position="labelPosition" label-width="80px">
                <img src="../../../static/img/stips.png"/>
               <div class="success"><p>欢迎入住保世界服务商</p></div>
            </el-form>
            
        </div>
    </div>
</template>

<script>
import sendMsgCode from "../common/sendMsgCode";
import citySelect from "../common/citySelect";
    export default {
        components:{
            sendMsgCode,
            citySelect
        },
        data(){
            var validateLocDetail= (rule, value, callback) => {
                if (!value) {
                      callback(new Error('请填写详细地址'));
                    } else if((this.formFirst.location.prov==""||this.formFirst.location.city==""||this.formFirst.location.region=="")){
                       callback(new Error('请选择所在地'));
                    }else {
                      callback();
                    }
                };
            var validateCheck= (rule, value, callback) => {
                    if (!value) {
                      callback(new Error('请先阅读并同意相关协议'));
                    } else {
                      callback();
                    }
                };
            var validateSerType= (rule, value, callback) => {
                    if (!value) {
                      callback(new Error('请选择服务商类型'));
                    } else {
                      callback();
                    }
                };
            return {
                 fullscreenLoading: true,
                 active: 0,
                 labelPosition:"right",
                 agreementDialogVisible:false,
                 formFirst:{
                        came:"",
                        name:"",
                        tel:"",
                        email:"",
                        location:{
                            prov:"",
                            city:"",
                            region:""
                        },
                        locDetail:"",
                        serType:"",
                        content:"",
                        agree:false,
                 },
                 formFirstRule:{
                     cname:[
                        { required: true, message: '请输入公司名称', trigger: 'blur' }
                      ],
                      name:[
                        { required: true, message: '请输入联系人', trigger: 'blur' }
                      ],
                      tel:[
                        { required: true, message: '请输入联系人手机号', trigger: 'blur' }
                      ],
                      email:[
                        { required: true, message: '请输入联系人邮箱', trigger: 'blur' }
                      ],
                      serType:[
                        { required: true, validator: validateSerType,  trigger: 'change' }
                      ],
                      location:[
                        { required: true}
                      ],
                      locDetail:[
                        { required: true, validator: validateLocDetail,  trigger: 'blur' }
                      ],
                      agree:[
                        {required: true, validator: validateCheck, trigger: 'change' }
                      ],
                      content:[
                        { required: true, message: '请输入主营业务', trigger: 'blur' }
                      ]
                 },
                //  第二步数据
                comTypeLoading:false,
                comTypeOptions:[],
            }
        },
        methods: {
            // 第一步提交
            handleSubmitFirst(formName){
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$axios.post('/api/provider/manage/doapplyprovider',{
                                c_name:this.formFirst.cname,	//企业名称
                                pr_linkman:this.formFirst.name,	//联系人
                                pr_phone:this.formFirst.tel,	//联系人手机号
                                pr_email:this.formFirst.email,	//联系人邮箱
                                pr_province:this.formFirst.location.prov,	//省地区代码
                                pr_city:this.formFirst.location.city,	//市地区代码
                                pr_area:this.formFirst.location.region,	//区地区代码
                                pr_type:this.formFirst.serType,	//服务商类型
                                pr_business:this.formFirst.content,	//主营业务
                                pr_detail:this.formFirst.locDetail	//详细地址
                            })
                            .then((res)=> {
                                const _data=res.data;
                                    if(_data.code==0){
                                        this.active = 2;
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
            // 第二步监听公司类型变化
            // comTypeChange(val){
            //    this.formFirst.serType=val;
            // },
            // 第二步，企业类型选择下拉菜单
            getComTypeOption(){
                  this.$axios.post('/api/provider/manage/providertypes', )
                    .then((res)=> {
                    const _data=res.data;
                        if(_data.code==0){
                            this.comTypeOptions=_data.data;
                        }
                    })
            }
           
        },
        created(){
            this.getComTypeOption();
            // 信息回填，如果是服务商的话
            this.$axios.post('/api/provider/manage/applyprovider', )
                    .then((res)=> {
                    const _data=res.data;
                    this.formFirst.cname=_data.data.c_name;
                    this.formFirst.serType=_data.data.pr_type;
                    // console.log(_data.data.c_name)
                    this.fullscreenLoading=false;
                        if(_data.code==0){
                            //-1:未申请 0:待审核 1:审核通过 2:拒绝通过
                            const __data=_data.data||{};
                            const __type=parseInt(__data.pr_apply_status);
                            switch(true){
                                case __type==-1:
                                case __type==2:
                                this.active=1;
                                // 数据回填
                                const _location={
                                    prov:__data.pr_province,
                                    city:__data.pr_city,
                                    region:__data.pr_area
                                };
                                this.formFirst.location=_location;
                                 
                                this.formFirst.name=__data.pr_linkman;
                                this.formFirst.tel=__data.pr_phone;
                                this.formFirst.email=__data.pr_email;
                                this.formFirst.locDetail=__data.pr_address;
                                this.formFirst.content=__data.pr_business;
                                break;
                                case __type==0:
                                 this.active=2;
                                break;
                                case __type==1:
                                 this.active=3;
                                break;
                            }
                        }else{
                            this.$message.error(_data.message);
                        }
                    }).catch((err)=>{
                        
                        this.fullscreenLoading=false;
                        
                    });
            // 服务商类型
        }
    }
</script>

<style lang="scss">
    .merchant-wrap{
         width: 100%;
            height: 100%;
            // min-height: 800px;
            // min-height: 800px;
            overflow-y: scroll;
            background-color: #f3f3f3;
            // background-color: red;
            border-top:60px solid #f3f3f3;
            .merchant-rules-body{
                height:400px;
                overflow-y:scroll;
                padding:0 10px;
              strong{
                  font-weight: bold;
              }
            }
            textarea{
                resize: none;
            }
        .merchant-topbar{
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
        }
        .merchant-form-wrap{
           
        //    position: absolute;
           background-color: #fff;
           width: 1200px;
           margin:20px auto;
            // top:50%;
            // left:50%;
            // transform:translate(-50%,-50%);
            overflow: auto;

        //    height: 628px;
           h5{
               line-height: 106px;
               height: 106px;
               margin-top:18px;
               text-align: center;
               color: #545c64;
               font-size: 18px;
           }

        }
        .step-wrap{
            width:760px;
            margin:0 auto; 
        }
        .next-btn{
        //    width: 100px;
           margin:0 auto;
           display: block;
        }
        .first-step-wrap{
          width: 530px;
          margin:72px auto;
          input{
              border-radius: 4px;
          }
          .code-input{
            width: 270px;
            position: relative;
          }
          .pic-code,.msg-code-btn{
            width:138px; 
            height: 40px;
            position: absolute;
            right: 0;
            top:0;
            
          }
          .pic-code{
            //  background-color: red;
             padding-top: 2px;
          }
          .agreement{
                float: left;
                color: #409EFF;
                cursor: pointer;
            }
        }
        .second-step-wrap{
            width: 410px;
            margin:72px auto;
            padding-right: 50px;
            
            img{
                display: block;
                width: 48px;
                margin:0 auto;
                margin-bottom: 30px;
            }
            .success{
               line-height: 48px;
               text-align: center;
               font-size: 18px;
               color:#353535;
            }
            .send-tips{
                font-size: 14px;
                color:#409eff;
                text-align: center;
                margin-top:60px;
            }
        }
        .third-step-wrap{
            margin:72px auto;
            .success{
                background-image: url('../../../static/img/home-icons.png');
                background-repeat: no-repeat;
                background-position-x: 44px;
                background-position-y: -1196px;
                width: 150px;
                height: 114px;
                margin: 0 auto;
                margin-top:126px;
                margin-bottom:112px;
                position: relative;
                span{
                    position: absolute;
                    bottom:0;
                    left: 0;
                    width: 100%;
                    display: block;
                    color: #353535;
                    font-size: 18px;
                    text-align: center;
                }
            }
        }
        .city-item{
            width: 125px;
            float: left;
            margin-right: 10px;

        }
        .city-item:last-child{
            margin-right: 0
        }
        .down-qrcode-wrap{
        img{
          display: block;
          width: 200px;
          margin:20px auto 5px auto; 
        }
        span,em{
            text-align: center;
            display: block;
        }
        em{
            font-size: 12px;
        }
        }
       .btm-tips{
           font-size: 12px;
           color: #c1c4ca;
           text-align: center;
        //    height: 20px;
           line-height: 50px;
       }
    }
</style>