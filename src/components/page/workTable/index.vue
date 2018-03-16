<template>
<div class="wrap">
    <application-box :applicationMsg="allData.enterpriseApplication" :isRun="true" @reloadMsg="getMessage">
        <h3 class="work-table-h3"><b></b>企业应用 <span>首推应用将展示在成员工作台的固定位置</span><el-button class="application-market-btn" type="primary" @click="goMarket">应用市场</el-button></h3>
    </application-box>
    <application-box :applicationMsg="allData.prohibitionAppliaction" :isRun="false" @reloadMsg="getMessage">
        <h3 class="work-table-h3"><b class="gray-b"></b>禁用应用</h3>
    </application-box>
</div>
</template>
<script>
import applicationBox from './applicationBox';
export default {
    methods: {
        goMarket () {
            this.$router.push('/worktable_applicationMarket');
        },
        getMessage(){
            this.$axios.post('/api/workbench/workbench/index',{
                c_id:__golbal_cid
            }).then((res)=>{
                if (res.data.code == 0){
                    const data = res.data.data;
                    this.allData.enterpriseApplication.firstRecommendNum = data.allData.enterpriseApplication.firstRecommendNum - 0;
                    __vBus.firstRecommendAllNum = data.allData.enterpriseApplication.firstRecommendNum - 0;
                    this.allData.enterpriseApplication.appMsg = data.allData.enterpriseApplication.appMsg;
                    this.allData.prohibitionAppliaction.appMsg = data.allData.prohibitionAppliaction.appMsg;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        }
    },
    data () {
        return {
            startAppObj: null,    //启用的App的对象
            forbiddenAppObj: null,   //禁止App的对象
            cancelRecommendObj : null,  //取消设置首推的对象
            firstRecommendObj : null,    //设置首推的对象
            allData: {     //总数据
                enterpriseApplication:{    //企业应用
                    firstRecommendNum: 0,   //首推的应用的数量
                    appMsg: []
                },
                prohibitionAppliaction:{    //禁止应用
                    appMsg: []
                },
            }
        }
    },
    created(){
        __vBus.$on('W_setFirstRecommend',(arg)=>{     //设置为首推
            // this.firstRecommendObj = this.allData.enterpriseApplication.appMsg.splice(arg.index,1)[0];
            // this.firstRecommendObj.isFirstRecommend = true;
            // this.allData.enterpriseApplication.appMsg.unshift(this.firstRecommendObj);
            this.getMessage();
        });
        __vBus.$on('W_cancelFirstRecommend',(arg)=>{
            // this.cancelRecommendObj = this.allData.enterpriseApplication.appMsg.splice(arg.index,1)[0];
            // this.cancelRecommendObj.isFirstRecommend = false;
            // this.allData.enterpriseApplication.appMsg.push(this.cancelRecommendObj);
            this.getMessage();
        });
        __vBus.$on('W_forbiddenApp',(arg)=>{
            // this.forbiddenAppObj = this.allData.enterpriseApplication.appMsg.splice(arg.index,1)[0];
            // this.forbiddenAppObj.isFirstRecommend = false;
            // this.allData.prohibitionAppliaction.appMsg.push(this.forbiddenAppObj);
            this.getMessage();
        });
        __vBus.$on('W_startApp',(arg)=>{
            // this.startAppObj = this.allData.prohibitionAppliaction.appMsg.splice(arg.index,1)[0];
            // this.allData.enterpriseApplication.appMsg.push(this.startAppObj);
            this.getMessage();
        });
        __vBus.firstRecommendAllNum = this.allData.enterpriseApplication.firstRecommendNum - 0;
        this.getMessage();
    },
    components: {
        applicationBox,
    }
}
</script>
<style lang="scss" scoped>
.wrap{
    padding: 10px 40px;
    height: 100%;
    overflow-y: scroll;
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
</style>



