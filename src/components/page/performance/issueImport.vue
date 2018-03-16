<template>
    <div class="perform-issue-wrap">
        <div class="title-wrap">
            <p class="com-item-title">批量导入</p> 
            <div class="title-rt">
                <el-button type="primary" plain @click="handleBack">返回</el-button>
            </div>
        </div>
        <div class="add-person-wrap add-person-wrap0">
            <p>温馨提示：</p>
            <p>1. 每次最多导入200条数据</p>
            <p>2. 子管理员仅能上传有权限范围内的部门成员保单</p>
            <dl>
                <dt>1. 请先下载保单批量导入模版，按格式批量填写保单信息</dt>
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
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        const __uploadParams=__finalParams("/api/performance/performancemanager/importinsurance");
        return{
            uploadUrl: '/api/performance/performancemanager/importinsurance',    //上传文件路径
            params: __uploadParams,
            fileList: [],    //上传文件的初始数组，主要用来初始上传状态
            uploadResult: null,    //上传文件的返回结果
        }
    },
    computed:{

    },
    methods:{
        handleBack(){
            this.$router.push({path: '/performance_issue'})
        },
        dowModel(){   //下载模板
               location.href = 'http://'+( window.location.hostname=="open.inswindows.com"? "s29.9956.cn":"s29.dev.bxd365.com")+'/res/crowdsource/docs/InsuranceTemplet.xlsx?v=10';
        },
        sureLeadingIn(){    //确定导入
            this.$refs.upload.submit();
        },
        uploadSuccess(res,f,fl){     //上传成功之后的回调
            if (res.code == 0){
                this.uploadResult = res.data;
                sessionStorage.setItem('import_result',JSON.stringify(this.uploadResult));
                this.$router.push('/performance_issue_import_result');
            }else{
                this.$message.error(res.message);
            }
        }


    },
    created(){

    },
    mounted(){
        
    }
}
</script>
<style lang="scss">
.perform-issue-wrap{
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
</style>

