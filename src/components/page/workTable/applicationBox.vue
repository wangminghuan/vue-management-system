<template>
<div class="clearfix application-div">
    <slot></slot>
    <div class="application-wrap" v-for="(item,index) in applicationMsg.appMsg" :key="index">
        <div class="application-box" @click.stop="goUrl(item.applicationIsPC,item.applicationUrlPC)">
            <a class="img-box">
                <img :src="isRun ? item.coverImg1 : item.coverImg0">
            </a>
            <div class="application-msg clearfix">
                <h4>{{item.applicationName}}</h4>
                <p v-if="item.isThirdParty">第三方应用</p>
                <first-recommend-box :isRun="isRun" :appmsg="item" :i="index" @setting="setSetting"></first-recommend-box>
            </div>
        </div>
        <img src="../../../../static/img/custom-made.png" v-if="item.isCustomMade">
    </div>
    <p v-if="applicationMsg.appMsg.length == 0" class="noData">暂无数据</p>
    <el-dialog
        title="客户管理"
        :visible.sync="customManagement"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>
        <!-- 选择部门的范围 -->
        <el-form ref="settingForm" :model="settingForm" label-width="100px">
            <el-form-item label="可见范围">
                <div>
                    <el-radio v-model="settingForm.rangeRadio" label="showAll">全公司</el-radio>
                </div>
                <div>
                    <el-radio v-model="settingForm.rangeRadio" label="showAdmin">仅管理员</el-radio>
                </div>
                <div>
                    <el-radio v-model="settingForm.rangeRadio" label="showSection">特定部门</el-radio>
                </div>
                <div>
                    <el-input v-model="departmentRange" v-show="settingForm.rangeRadio == 'showSection'" readonly @focus="selectDepartment"></el-input>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="customManagement = false">取 消</el-button>
            <el-button type="primary" @click="customManagementSure">保 存</el-button>
        </span>
    </el-dialog>
    <choose-department-box :defaultCheckArr="defaultCheckedArr" :chooseDepartments="chooseDepartments" @closeChooseDepartment="closeChooseDepartmentBox" :chooseData="organMessage">
        <h4 slot="left-name" class="choose-department-h4">组织结构</h4>
        <h4 slot="right-name" class="choose-department-h4">已选部门</h4>
    </choose-department-box>
</div>
</template>

<script>
import firstRecommendBox from './firstRecommendBox';
import chooseDepartmentBox from '../addressList/chooseDepartmentBox';
export default {
    props: ['applicationMsg','isRun','isSetting'],
    data () {
        return {
            currentAppId: '',   //当前进行设置的应用的id
            customManagement: false,     //设置界面的控制变量
            settingForm: {
                rangeRadio: "showAll",    // 1-->全公司   2-->仅管理员   3-->特定部门
            },
            defaultCheckedArr: [],     //选择部门弹框的默认选项
            chooseDepartments: false,    //是否显示部门选择弹框
            organMessage: null,    //选择部门弹框的所有数据
            departmentRange: '',    //特定部门的输入框
            departmentRangeId: '',    //特定部门的id
        }
    },
    components:{
        firstRecommendBox,
        chooseDepartmentBox
    },
    methods:{
        goUrl(flag,url){   //点击跳转应用详情
            if (!this.isRun){    //判断是否是禁用应用,如果是,则取消事件
                return false;
            }
            if (flag){    //判断是否是PC端应用,如果是,则跳转详情页,否,则给提示
                location.href = url;
            }else{
                this.$message.warning('此应用仅支持手机端使用');
            }
        },
        setFirstRecommend (id){
            this.$emit('setFirstRecommend');
        },
        setSetting(...data){     //触发设置界面
            if (!data[0]){
                return false;
            }
            this.customManagement = true;
            this.currentAppId = data[0];
            this.settingForm.rangeRadio = data[1];
            this.defaultCheckedArr = data[2];
            this.departmentRange = data[3];
            
        },
        customManagementSure(){    //设置--保存
            this.$axios.post('/api/workbench/workbench/appSetup',{
                uid: __golbal_uid,
                cid: __golbal_cid,
                a_id: this.currentAppId,
                operate: this.settingForm.rangeRadio,
                ca_showSectionId: this.departmentRangeId,
                ca_showSection: this.departmentRange
            }).then((res)=>{
                if (res.data.code == 0){
                    // const data = res.data.data;
                    this.$emit('reloadMsg');
                    this.$message({
                        type:'success',
                        message:'保存成功'
                    });
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            })
            this.customManagement = false;
        },
        closeChooseDepartmentBox(...data){    //接收组件触发的事件,关闭选择部门的组件
            this.chooseDepartments = false;
            if (!data[0]){
                return false;
            }
            if (data[0].length <= 0){
                this.departmentRangeId = [];
                this.departmentRange = '';
                return false;
            };
            let arr = [],
                arr0 = [];
            data[0].forEach((e,i) => {
                arr.push(e.label);
                arr0.push(e.id);
            });
            this.departmentRangeId = arr0.join(',');
            this.departmentRange = arr.join('，');
        },
        selectDepartment(){    //选择部门
            this.chooseDepartments = true;
        }
    },
    created (){
        __vBus.departmentAdjustArr = [];
        __vBus.departmentAdjust = '';
        this.$axios.post('/api/maillist/maillist/webStructure',{
            uid: __golbal_uid,
            cid: __golbal_cid
        }).then((res)=>{
            if (res.data.code == 0){    //将所有结构树进行更新
                const data = res.data.data;
                this.organMessage = data.organMessage;
            }else{
                this.$message.error(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }
}
</script>

<style lang="scss" scoped>
.clearfix::after{
    content: '.';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
}
.application-div{
    margin-bottom: 30px;
    .noData{
        text-align: center;
        font-size: 14px;
        margin-top: 20px;
        color: #959595;
    }
}
.application-wrap{
    float: left;
    position: relative;
    height: 153px;
    width: 361px;
    padding-top: 5px;
    margin-right: 40px;
    margin-bottom: 10px;
    >img{
        position: absolute;
        top: 0;
        right: 0;
        width: 75px;
    }
    .application-box{
        border-radius: 8px;
        margin-right: 6px;
        box-sizing: border-box;
        border: 1px solid #dfe4ed;
        padding: 21px 17px 19px 24px;
        overflow: hidden;
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
        .application-msg{
            overflow: hidden;
            h4{
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
                font-size: 12px;
                line-height: 12px;
                color: #cacaca;
            }
        }
    }
}



</style>


