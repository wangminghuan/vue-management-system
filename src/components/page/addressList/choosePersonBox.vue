<template :key="randomNum">
<el-dialog
    title="添加成员"
    :visible.sync="chooseDepartments"
    width="800px"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center>
    <div class="choose-department-wrap clearfix">
        <div class="left-wrap">
            <slot name="left-name"></slot>
            <div class="left-box">
                <el-input
                placeholder="输入关键字进行过滤"
                suffix-icon="el-icon-search"
                v-model="filterText">
                </el-input>
                <!-- :default-checked-keys="defalutCheckedArr" -->
                <el-tree
                class="filter-tree"
                show-checkbox
                :data="chooseData"
                node-key="id"
                @check-change="handleCheckChange"
                :expand-on-click-node="true"
                :check-strictly="true"
                default-expand-all
                :filter-node-method="filterNode"
                ref="fb">
                </el-tree>
            </div>
        </div>
        <div class="right-wrap">
            <slot name="right-name"></slot>
            <ul class="right-box">
                <li v-for="(item, index) in selectArr" :key="index">{{item.label}}<i class="el-icon-close" @click="deleteDepart(index)"></i></li>
            </ul>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
export default {
    props: [
        'chooseDepartments',       //是否打开弹框的识别
        'chooseData',       //结构树的数据
        'currentRole',       //当前选中的角色的id
        'roleDefaultArr',      //默认选中的选项
        ],
    methods: {
        close (){   //取消,关闭弹框
            this.$emit('closeChoosePerson');
            // __vBus.departmentAdjustArr.length = 0;
            __vBus.departmentAdjust = '';
            __vBus.departmentAdjust = '';
            this.$refs.fb.setCheckedKeys([]);
        },
        sure (){    //确定,选定部门,关闭弹框
            let arr = [];
            this.selectArr.forEach((e,i)=>{
                arr.push(e.o_id);
            });
            if (arr.length <= 0){
                this.$message({
                    type:'warnning',
                    message:'请选择成员'
                });
                return false;
            }
            Array.prototype.unique = function (){
                let res = [],
                    obj = {};
                for (let i =0; i < this.length; i++){
                    if (!obj[this[i]]){
                        res.push(this[i]);
                        obj[this[i]] = 1;
                    }
                }
                return res;
            }
            arr = arr.unique();    //数组去重
            this.$axios.post('/api/role/role/addMemRole',{
                r_id: this.currentRole,
                ids: arr.join(',')
            }).then((res)=>{
                if (res.data.code == 0){
                    this.$refs.fb.setCheckedKeys([]);
                    this.$emit('closeChoosePerson');
                    this.$message({
                        type:'success',
                        message: '添加成员成功~'
                    });
                    this.$emit('adjustUpload');
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
            
        },
        filterNode(value,data) {    //过滤节点,显示筛选结果
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleCheckChange(){   //选中之后,将选中的数组赋值给selectArr,再交由右边进行列表渲染
            this.selectArr = this.$refs.fb.getCheckedNodes();
        },
        deleteDepart(i){   //右边删除所选项
            this.selectArr.splice(i,1);
            this.$refs.fb.setCheckedNodes(this.selectArr);
        },
        
    },
    data (){
        return {
            selectArr: [],   //已经选中的选项,主要用来渲染右边的数据
            filterText: '',     //过滤的文案
            randomNum: Math.random(),
        }
    },
    watch: {
        filterText(val){
            this.$refs.fb.filter(val);
        },
        defaultCheckArr: function (val){      //用来显示右边选中结构的内容框
            this.selectArr = val;
        },
    },
    

}
</script>


<style lang="scss" scoped>
.choose-department-wrap{
    .left-wrap,.right-wrap{
        width: 45%;
        float: left;
    }
    .left-wrap{
        margin-right: 5%;
        .left-box{
            height: 400px;
            border: 1px solid #eee;
            padding: 15px;
            overflow: scroll;
        }
    }
    .right-wrap{
        margin-left: 5%;
        .right-box{
            height: 400px;
            border: 1px solid #eee;
            padding: 15px;
            overflow: scroll;
            li{
                i{
                    cursor: pointer;
                    float: right;
                    margin-right: 15px;
                    font-size: 18px;
                    margin-top: 3px;
                }
            }
            & li:hover{
                background-color: #eee;
            }
        }
    }
}
</style>
<style>
.choose-department-wrap .is-current.is-current.is-current > .el-tree-node__content{
    background-color: #fff;
}

</style>


