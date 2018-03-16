<template>
<div class="market-wrap">
    <dl v-for="(item,index) in allData" :key="index" class="application-module">
        <dt>
            <h3 class="work-table-h3"><b></b>{{item.moduleName}} <el-button type="primary" class="application-market-btn" v-if="index == 0" @click="goback" plain>返回</el-button></h3>
        </dt>
        <dd class="clearfix">
            <div class="application-box" v-for="(obj, i) in item.appMsg" :key="i" @click.stop="goApplicationDetail(obj.applicationId)">
                <a class="img-box">
                    <img :src="obj.coverImg">
                </a>
                <h4>{{obj.applicationName}}</h4>
                <p class="tag-box">
                    <el-tag type="success" size="small" class="first-recommend" v-if="obj.applicationIsPC">PC</el-tag>
                    <el-tag type="warning" size="small" class="first-recommend" v-if="obj.applicationIsApp">APP</el-tag>
                    <el-button type="primary" size="mini" v-if="!obj.isInstalled && !isDefault" @click.stop="installApp(index,i,obj.applicationId,obj.applicationName)">安装应用</el-button>
                    <!-- <el-tag type="info" size="small" v-else>已安装</el-tag> -->
                    <el-button type="primary" size="mini" v-else @click.stop="openApp(obj.applicationIsPC,obj.applicationUrlPC,obj.applicationId)">打开</el-button>
                </p>
            </div>
        </dd>
    </dl>
</div>
</template>

<script>
import applicationBox from './applicationBox';
export default {
    methods: {
        installApp(index,i,id,name){
            // const that = this;
            this.$confirm('是否确认安装该应用？','安装 ' + name,{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type: 'wraning'
            }).then(()=>{
                this.$axios.post('/api/workbench/workbench/appInstall',{
                    c_id: __golbal_cid,
                    a_id: id,
                }).then((res)=>{
                    if (res.data.code == 0){
                        this.$message({
                            type:'success',
                            message:'成功安装 ' + name + '!'
                        });
                        this.allData[index].appMsg[i].isInstalled = true;
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }).catch(()=>{
                this.$message({
                    type:'info',
                    message:'已取消安装 ' + name + '~'
                });
            });
        },
        openApp(flag,url,id){     //打开APP
            if (flag){
                this.$axios.post('/api/workbench/workbench/updateAppHits',{
                    a_id: id
                }).then((res)=>{
                    if (res.data.code == 0){
                        location.href = url;
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }else{
                this.$message.warning('此应用仅支持手机端使用');
            }
        },
        goback(){
            this.$router.push('/worktable');
        },
        goApplicationDetail(id){    //跳转到当前应用的详情页
            sessionStorage.setItem('app_id_fb',id);
            this.$router.push('/worktable_applicationDetail');
        }
    },
    data () {
        return {
            allData:[]
        }
    },
    created(){
        this.$axios.post('/api/workbench/workbench/lists',{
            c_id:__golbal_cid
        }).then((res)=>{
            if (res.data.code == 0){
                this.allData = res.data.data.allData;
            }else{
                this.$message.error(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    },
    components: {
        applicationBox,
    }
}
</script>

<style lang="scss" scoped>
.market-wrap{
    padding: 10px 40px;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
}
dl,dt,dd{
    list-style: none;
}
.application-module{
    margin-bottom: 40px;
}
.work-table-h3{
    font-size: 16px;
    color: #353535;
    height: 50px;
    line-height: 50px;
    b{
        display: inline-block;
        width: 2px;
        height: 16px;
        vertical-align: middle;
        margin-right: 10px;
        background-color: #409eff;
    }
    .gray-b{
        background-color: #878d99;
    }
    span{
        color: #409eff;
        font-size: 12px;
        margin-left: 20px;
    }
    .application-market-btn{
        float: right;
    }
}
.clearfix::after{
    content: '.';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
}
.application-box{
        float: left;
        width: 356px;
        border-radius: 8px;
        box-sizing: border-box;
        margin-right: 40px;
        margin-bottom: 10px;
        border: 1px solid #dfe4ed;
        padding: 21px 17px 19px 24px;
        overflow: hidden;
        position: relative;
        a{
            float: left;
            width: 106px;
            height: 106px;
            overflow: hidden;
            margin-right: 21px;
            >img{
                width: 100%;
            }
        }
        h4{
            width: 149px;
            font-weight: 500;
            font-size: 18px;
            line-height: 18px;
            margin-top: 8px;
            margin-bottom: 11px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #353535;
        }
        p{
            position: absolute;
            bottom: 22px;
            left: 149px;
            width: 188px;
        }
        .tag-box button{
            float: right;
        }
    }
</style>