<template>
<div class="first-recommend-box">
    <el-tag size="small" class="first-recommend" v-if="isRun && appmsg.isFirstRecommend">首推</el-tag>
    <el-tag type="success" size="small" class="first-recommend" v-if="isRun && appmsg.applicationIsPC">PC</el-tag>
    <el-tag type="warning" size="small" class="first-recommend" v-if="isRun && appmsg.applicationIsApp">APP</el-tag>
    <el-tag size="small" type="info" v-if="!isRun" disabled>已禁止</el-tag>
    <i class="el-icon-more" @click.stop="settingShow(appmsg.applicationId)">
        <ul class="setting-box bubble" v-show="allPopover">
            <li @click="setSetting(appmsg.applicationId,appmsg.applicationShowRegion,appmsg.applicationShowSectionId,appmsg.applicationShowSection)">设置</li>
            <li v-if="isRun && !appmsg.isFirstRecommend" @click="setFirstRecommend(i,appmsg.applicationId)">设为首推</li>
            <li v-if="isRun && appmsg.isFirstRecommend" @click="cancelFirstRecommend(i,appmsg.applicationId,appmsg.isFirstRecommend)">取消首推</li>
            <li v-if="isRun" @click="forbiddenApp(i,appmsg.applicationId,appmsg.isFirstRecommend)">禁用</li>
            <li v-if="!isRun" @click="startUse(i,appmsg.applicationId)">启用</li>
        </ul>
    </i>
</div>
</template>

<script>
export default {
    methods: {
        settingShow (appid){    //点击弹出设置框
            this.allPopover = !this.allPopover;
            __vBus.$emit("W_allClose",{
                id:appid
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.allPopover = false;
            }, 4000);
        },
        setFirstRecommend (id,appid){   //设置为首推
            if (__vBus.firstRecommendAllNum-0 >= 8){
                this.$alert('您已经设置了八个首推应用，最多只能八个哦~',"设置失败",{
                    confirmButtonText: '确定'
                });
                return false;
            }
            this.$axios.post('/api/workbench/workbench/appSetup',{
                c_id: __golbal_cid,
                a_id: appid,
                operate: 'onFirst'
            }).then((res)=>{
                if (res.data.code == 0){
                    __vBus.firstRecommendAllNum++;
                    __vBus.$emit('W_setFirstRecommend',{
                        index: id
                    });
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        cancelFirstRecommend(id,appid,isfirstRecommend){    //取消首推
            this.$axios.post('/api/workbench/workbench/appSetup',{
                c_id: __golbal_cid,
                a_id: appid,
                operate: 'offFirst'
            }).then((res)=>{
                if (res.data.code == 0){
                    if (isfirstRecommend){
                        __vBus.firstRecommendAllNum--;
                    }
                    __vBus.$emit('W_cancelFirstRecommend',{
                        index: id
                    });
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        forbiddenApp(id,appid,isfirstRecommend){    //禁用APP
            this.$axios.post('/api/workbench/workbench/appSetup',{
                c_id: __golbal_cid,
                a_id: appid,
                operate: 'close'
            }).then((res)=>{
                if (res.data.code == 0){
                    if (isfirstRecommend){
                        __vBus.firstRecommendAllNum--;
                    }
                    __vBus.$emit('W_forbiddenApp',{
                        index: id
                    });
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
            
        },
        startUse(id,appid){   //启用App
            this.$axios.post('/api/workbench/workbench/appSetup',{
                c_id: __golbal_cid,
                a_id: appid,
                operate: 'open'
            }).then((res)=>{
                if (res.data.code == 0){
                    __vBus.$emit('W_startApp',{
                        index: id
                    });
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        setSetting(appid,appRange,appRangeId,appRangeTxt){
            this.$emit('setting',appid,appRange,appRangeId,appRangeTxt);
        }
    },
    data (){
        return {
            allPopover : false,
            timer : null
        }
    },
    created(){
        const that = this;
        document.body.addEventListener('click',function (e){
            that.allPopover = false;
            clearTimeout(that.timer);
        });
        __vBus.$on("W_allClose",(arg)=>{
            if (arg.id != this.appmsg.applicationId){
                this.allPopover=false;
                clearTimeout(this.timer);
            }
        });

    },
    props:['isRun','appmsg','isSetting','i']
}
</script>

<style lang="scss" scoped>
.first-recommend-box{
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
    i{
        float: right;
        margin-top: 10px;
        cursor: pointer;
        color: #409eff;
        position: relative;
    }
    position: absolute;
    bottom: 25px;
    left: 149px;
    width: 188px;
}
.setting-box{
    position: absolute;
    top: 0;
    z-index: 1;
    left: -85px;
    width: 80px;
    line-height: 30px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #409eff;
    color: #353535;
    list-style: none;
    li{
        font-size: 13px;
        text-align: center;
        list-style: none;
        cursor: pointer;
        color: #409eff;
        border-bottom: 1px solid #eee;
    }
    & li:last-child{
        border-bottom: none;
    }
    li:hover{
        color: #fff;
        background-color: #409eff;
    }
}
// .bubble:after{
//     content:'';
//     position:absolute;
//     left:100%;
//     top:10px;
//     width:16px;
//     height:16px;
//     border-width:0;
//     border-style:solid;
//     border-color:transparent;
//     border-bottom-width:10px;
//     border-bottom-color:currentColor;
//     border-radius:0 0 32px 0;
//     color:#409eff;
// }
</style>


