<template>
<div class="detail-wrap">
    <div class="head-box">
        <span class="el-icon-arrow-left" @click="goback"></span>
        <div class="application-header">
            <span class="img-box">
                <img :src="applicationImg">
            </span>
            <div class="application-msg">
                <h3>{{applicationName}}</h3>
                <p>{{applicationIntroduce}}</p>
                <p class="tag-box">
                    <el-tag v-if="applicationTag">企业应用</el-tag>
                    <el-tag v-else>个人应用</el-tag>
                    <el-tag type="success" class="first-recommend" v-if="applicationIsPC">PC</el-tag>
                    <el-tag type="warning" class="first-recommend" v-if="applicationIsApp">APP</el-tag>
                </p>
            </div>
        </div>
        <el-button type="primary" v-if="!isInstalled" @click="installApp">安装按钮</el-button>
        <el-button type="primary" v-else @click="openApp">打开</el-button>
    </div>
    <div class="content-box" v-html="mainContent">
    </div>
</div>
</template>
<style lang="scss" scoped>
.detail-wrap{
    height: 100%;
    width: 100%;
    overflow-y: scroll;
}
.head-box{
    background-color: #dfe4ed;
    height: 149px;
    overflow: hidden;
    padding: 22px 55px;
    .el-icon-arrow-left{
        margin-right: 68px;
        vertical-align: middle;
        cursor: pointer;
    }
    .application-header{
        display: inline-block;
        .img-box{
            height: 105px;
            width: 105px;
            overflow: hidden;
            display: inline-block;
            vertical-align: top;
            margin-right: 20px;
            >img{
                width: 100%;
            }
        }
        .application-msg{
            width: 430px;
            height: 105px;
            display: inline-block;
            position: relative;
            p{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #878d99;
                font-size: 12px;
            }
            h3{
                color: #353535;
                font-size: 18px;
                line-height: 36px;
            }
            .tag-box{
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
            }
        }
    }
    button{
        float: right;
        margin-top: 35px;
    }
}
.content-box{
    padding: 22px 55px;
}
</style>
<script>
export default {
    data(){
        return {
            applicationId: '',      //当前应用的id
            applicationImg: '',      //应用logo
            applicationName: '',     //应用名
            applicationIntroduce: '',  //引用介绍
            applicationTag: true,       //该应用是否为企业应用  true-->是   false->否
            mainContent: null,        //主要内容的图片数组
            isInstalled: false,    //是否已经安装过了 
            applicationIsPC: false,    //是否是pc端应用
            applicationIsApp: false,    //是否是app应用
            pcUrl: '',    //如果是PC端应用,打开的地址
        }
    },
    methods: {
        goback(){    //返回按钮
            this.$router.push('/worktable_applicationMarket');
        },
        installApp(){    //安装应用
            this.$axios.post('/api/workbench/workbench/appInstall',{
                a_id: this.applicationId
            }).then((res)=>{
                if (res.data.code == 0){
                    this.$message({
                        type:'success',
                        message:'安装成功'
                    });
                    this.isInstalled = true;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            })
        },
        openApp(){    //打开应用的方法
            if (this.applicationIsPC){
                this.$axios.post('/api/workbench/workbench/updateAppHits',{
                    a_id: this.applicationId
                }).then((res)=>{
                    if (res.data.code == 0){
                        location.href = this.pcUrl;
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }else{
                this.$message.warning('此应用仅支持手机端使用');
            }
        }
    },
    created(){
        try {
            this.applicationId = sessionStorage.getItem('app_id_fb');
        } catch (error) {
            this.$message.error('缺少关键参数');
        }
        this.$axios.post('/api/workbench/workbench/appDetail',{
            a_id: this.applicationId
        }).then((res)=>{
            if (res.data.code == 0){
                const data = res.data.data;
                this.applicationImg = data.coverImg;
                this.applicationName = data.applicationName;
                this.applicationIntroduce = data.appDescribe;
                this.mainContent = data.appIntroduction;
                this.applicationTag = data.isCompanyApp;
                this.isInstalled = data.isInstalled;
                this.applicationIsPC = data.applicationIsPC;
                this.applicationIsApp = data.applicationIsApp;
                this.pcUrl = data.applicationUrlPC;
            }else{
                this.$message.error(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }
}
</script>




