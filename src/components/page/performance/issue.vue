<template>
<div>
    <div class="title-wrap">
        <p class="com-item-title">出单管理</p> 
            <div class="title-rt">
            <el-button type="primary" plain @click="createStatus=true;dialogIsCreate=true;editData=null;">创建</el-button>
            <el-button type="primary" @click="jumpImport">批量导入</el-button>
        </div>
    </div>
    <issue-content @edit="edit" ref="content"></issue-content>
    <issue-create :dialogIsShow="createStatus" :editData="editData" :dialogStatus="dialogIsCreate" @createAct="createAct"></issue-create>
</div>
</template>
<script>
import issueContent from './issueContent';  
import issueImport from './issueImport';
import issueCreate from './issueCreate';
export default {
    data(){
        return{
            createStatus: false,    //是否显示 创建-编辑
            dialogIsCreate: true,    //弹框是否为创建弹框  否则为编辑
            editData: null,    //默认编辑信息
        }
    },
    components: {
        issueContent,     //  主体内容组件
        issueImport,    //   批量导入组件
        issueCreate,    // 创建 组件
    },
    computed:{

    },
    methods:{
        jumpImport(){
          this.$router.push({path: '/performance_issue_import'})
        },
        createAct(bol){   //接收issueCreate组件上传的事件
            this.editData = null;
            this.createStatus = false;
            if (bol){   //如果bol为true，则弹框的操作事件为--确定   需要更新列表
                this.$refs.content.getListMsg();
            }
        },
        edit(obj){   //从表格组件中提交上来   进行编辑操作
            this.createStatus = true;
            this.dialogIsCreate = false;
            this.editData = obj;
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

}
</style>

