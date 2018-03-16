<template :key="randomNum">
<el-dialog
    title="选择部门"
    :visible.sync="chooseDepartments"
    width="800px"
    :show-close="false"
    center>
    <!-- :before-close="handleClose" -->
    <div class="choose-department-wrap clearfix">
        <div class="left-wrap">
            <slot name="left-name"></slot>
            <div class="left-box">
                <el-tree
                class="filter-tree"
                show-checkbox
                :data="chooseData"
                node-key="id"
                @check-change="handleCheckChange"
                :expand-on-click-node="true"
                :check-strictly="true"
                default-expand-all
                ref="myTree">
                </el-tree>
            </div>
        </div>
        <div class="right-wrap">
            <slot name="right-name"></slot>
            <ul class="right-box">
                <li v-for="(item, index) in selectArr" :key="index">{{item.label}}</li>
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
let __arrrr=[];
export default {
    props: ['chooseDepartments','chooseData','defaultCheckArr'],
    methods: {
        close (){   //取消,关闭弹框
            this.$emit('closeChooseDepartment',[false]);
            this.defaultData=[];
            this.$refs.myTree.setCheckedNodes([])
        },
        sure (){    //确定,选定部门,关闭弹框
            let arr = [];
            this.$refs.myTree.getCheckedNodes().map((e,i)=>{
                arr.push({
                    id:e.id,
                    label:e.label});
            });
            this.$emit('closeChooseDepartment',arr);
            this.defaultData=[];
            this.$refs.myTree.setCheckedNodes([])
        },
        childrenForEach(arr,isDisable){
          let _result=[];
          arr.map((item)=>{
            item.disabled=isDisable;
             _result.push(item);
          })
          return _result;
        },
        getActiveNode(arr){
            let result=[];
            arr.map((item)=>{
                if(!item.disabled) result.push(item)
            })
            return result;
        },
        getItemById(arr,idArr){
            arr.map((item,index)=>{
                if(idArr.indexOf(item.id)>-1){this.defaultData.push(item)};
                this.getItemById(item.children,idArr)
            })
        },
        handleCheckChange(selected,status,hasSelectChild){   //选中之后,将选中的数组赋值给selectArr,再交由右边进行列表渲染
        // return false;
            // status:true选中;false:取消
            let childrenArr=this.childrenForEach(selected.children,status);
            let checkedNodes=this.$refs.myTree.getCheckedNodes();
            if(childrenArr.length>0){
                if(status){
                    this.$refs.myTree.setCheckedNodes(checkedNodes.concat(childrenArr));
                }else{
                    childrenArr.map((item,index)=>{
                        checkedNodes.splice(checkedNodes.indexOf(item),1)
                        this.$refs.myTree.setCheckedNodes(checkedNodes);
                    })
                }  
            } 
             this.selectArr=this.getActiveNode(this.$refs.myTree.getCheckedNodes()); 
            //  console.log("33",__arrrr)  
        },
        deleteDepart(i){   //右边删除所选项 本次先不做
            this.defaultData=[];
            this.$refs.myTree.setCheckedNodes(this.defaultData)
            this.selectArr.splice(i,1);
            let arr=[];
            this.selectArr.map((item)=>{
                arr.push(item.id)
            })
            this.getItemById(this.renderData, arr);
            console.log("xxx",this.defaultData)
            this.$refs.myTree.setCheckedNodes(this.defaultData)
            // __arrrr=JSON.parse(JSON.stringify(this.selectArr));
            // console.log(__arrrr)
            // console.log(arr)
            // let checkNode=this.getActiveNode(this.$refs.myTree.getCheckedNodes());
            // console.log(checkNode);
            // console.log(this.selectArr);
            // this.$refs.myTree.setCheckedNodes(__arrrr);
        },
        
    },
    data (){
        return {
            defaultId:[],
            defaultData:[],
            renderData:[],
            selectArr: [],   //已经选中的选项,主要用来渲染右边的数据
            randomNum: Math.random()
        }
    },
    watch: {
        chooseData(val){
            this.renderData=val;
        },
        defaultCheckArr: function (val){ 
                                 //用来显示右边选中结构的内容框
            this.defaultId=[]; //每次使用清空数据，防止数据叠加
            this.selectArr = val;
            val.map((item,index)=>{
                this.defaultId.push(item.id)
            }) 
        },
        chooseDepartments(val){
           if(val){
              this.getItemById(this.renderData,this.defaultId)
               setTimeout(()=>{ // 脱离主线程，等组件渲染完毕才可以获取到this.$refs.myTree对象
                 if(this.$refs.myTree) this.$refs.myTree.setCheckedNodes(this.defaultData)
                },0)
           }
            
        },
    },
}
</script>


<style lang="scss">
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
.choose-department-wrap .is-current.is-current.is-current > .el-tree-node__content{
    background-color: #fff;
}
</style>

