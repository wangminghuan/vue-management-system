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
                :default-checked-keys="defaultArr"
                class="filter-tree"
                show-checkbox
                :data="chooseData"
                node-key="id"
                @check-change="handleCheckChange"
                :expand-on-click-node="true"
                :check-strictly="true"
                default-expand-all
                ref="tree2">
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
let childrenArr=[];
export default {
    props: ['chooseDepartments','chooseData','defaultCheckArr'],
    methods: {
        close (){   //取消,关闭弹框
            this.$emit('closeChooseDepartment',[false]);
            this.defaultArr=[];
            // __vBus.departmentAdjustArr.length = 0;
            // this.$refs.tree2.setCheckedKeys([]);
        },
        sure (){    //确定,选定部门,关闭弹框
            let arr = [];
            this.selectArr.map((e,i)=>{
                arr.push({
                    id:e.id,
                    label:e.label});
            });
            this.$emit('closeChooseDepartment',arr);
        },
        childrenForEach(arr,isDisable){
          arr.map((item)=>{
            item.disabled=isDisable;
             if(item.children.length>0){
                 this.childrenForEach(item.children,isDisable)
             }
          })
        },
        getActiveNode(arr){
            let result=[];
            arr.map((item)=>{
                if(!item.disabled) result.push(item)
            })
            return result;
        },
        getIndexChildren(arr,id){
            for(let i=0;i<arr.length;i++){
                if(arr[i].id==id){
                    return arr[i].children;
                } 
                if(arr[i].children.length>0){
                    this.getIndexChildren(arr[i].children,id)
                }
            }
        },
        handleCheckChange(selected,status,hasSelectChild){   //选中之后,将选中的数组赋值给selectArr,再交由右边进行列表渲染
            // status:true选中;false:取消
            this.childrenForEach(selected.children,status);
            console.log(this.renderData)
            // let checkedNodes=this.$refs.tree2.getCheckedNodes();
            // if(childrenArr.length>0){
            //     if(status){
            //         this.$refs.tree2.setCheckedNodes(checkedNodes.concat(childrenArr));
            //     }else{
            //         childrenArr.map((item,index)=>{
            //             checkedNodes.splice(checkedNodes.indexOf(item),1)
            //             this.$refs.tree2.setCheckedNodes(checkedNodes);
            //         })
            //     }  
            // } 
            //  console.log("childrenArr",childrenArr);
            //  this.selectArr=this.getActiveNode(this.$refs.tree2.getCheckedNodes());   
        },
        deleteDepart(i){   //右边删除所选项 本次先不做
            this.selectArr.splice(i,1);
            // console.log(this.selectArr);
            this.$refs.tree2.setCheckedNodes(this.selectArr);
        },
        
    },
    data (){
        return {
            defaultArr:[],
            renderData:[],
            selectArr: [],   //已经选中的选项,主要用来渲染右边的数据
            randomNum: Math.random()
        }
    },
    watch: {
        chooseData(val){
            this.renderData=val;
            if(this.defaultArr.length==0) return;
            setTimeout(()=>{
                let _arr=[];
                const checked=[...this.$refs.tree2.getCheckedNodes()];
                setTimeout(()=>{
                    console.log(checked)
                    this.$refs.tree2.setCheckedNodes(checked)
                },100)
                // this.$refs.tree2.getCheckedNodes()
                // this.$refs.tree2.setCheckedNodes(checked[0])
                // checked.map((item)=>{
                //    if(item.children.length>0){
                //        item.children.map((sub)=>{
                //             sub.disabled=true
                //        })
                //    }
                // })
            },0)
           
            // console.log(2,this.getIndexChildren(this.renderData,"138"))
        },
        defaultCheckArr: function (val){      //用来显示右边选中结构的内容框
            this.selectArr = val;
            console.log(this.randomNum,val)
            val.map((item,index)=>{
                this.defaultArr.push(item.id)
            })
            console.log('selectArr:',this.selectArr);
            
        },
        chooseDepartments(val){
            // console.log(2,this.defaultArr)
            // if (this.defaultArr.length == 0){
            //     try {
            //         this.$refs.tree2 && this.$refs.tree2.setCheckedKeys([]);
            //         // console.log(this.defaultArr);
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }else{
            //     try {
            //          console.log(this.$refs.tree2.getCheckedKeys(this.defaultArr))
            //          this.$refs.tree2 && this.$refs.tree2.setCheckedKeys(this.defaultArr);
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
        },
    },
    // computed:{
    //     defaultArr: function(){      //用来默认选中树形结构中的选项
    //         try {
    //             let arr = [];
    //             this.selectArr.forEach((e,i)=>{
    //                 arr.push(e.id);
    //             });
    //             // console.log("default",arr)
    //             return arr;
    //         } catch (error) {
    //             return [];
    //         }
    //     }
    // },
    // created(){
    //     console.log(33)
    // }

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