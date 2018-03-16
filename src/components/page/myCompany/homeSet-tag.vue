<template>
  <section >
         <h4 class="com-item-title">业务标签</h4>
         <div class="company-set-tag">
         <p class="btm-desc">（帮助客户快速了解你企业的业务经营范围，最多可添加10个）</p>
         <el-tag
            :key="index"
            v-for="(tag,index) in myTag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag.zt_name}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新建标签</el-button>
          <div class="add-more-tags">
            <el-button type="success" @click="selectTagDialogVisible=true" plain>选择常用标签</el-button>
            <el-button type="primary" @click="handleSaveTag">保存</el-button>
          </div>
          <p class="btm-desc" style="margin-top:10px">（请在所有操作后进行点击保存操作）</p>
           <el-dialog
              title="选择常用标签"
              :visible.sync="selectTagDialogVisible"
              width="500px"
              class="tag-select-dialog"
              center>
              <div><span
              @click="()=>handleSelectMoreTag(index,tag)"
              :class="tag.isSelect==1?'el-tag is-selected':'el-tag'"
              :key="index"
              v-for="(tag,index) in sysTag" 
              >{{tag.zt_name}}</span></div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSetSysTag">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </section>
</template>
<script>
let tempSysTag=[];
export default {
  props:{
    renderData:Object
  },
  data(){
      return{
          myTag:[],
          privateTag:[],
          propSysTag:[],
          sysTag:[],
          inputVisible: false,
          inputValue: '',
          selectTagDialogVisible:false,
          selectTagVal:[],
      }
  },
  watch:{
     renderData(val){
       this.privateTag=val.privateTag;
       this.sysTag = val.sysTag;
       this.propSysTag = val.sysTag;
        //  获取个人所有标签
       this.myTag=this.concatTag(val.sysTag);
     },
     selectTagDialogVisible(val){
       if(val){
         if(tempSysTag.length==0){
            //  缓存为空，则将数据缓存
            tempSysTag=JSON.parse(JSON.stringify(this.sysTag))
         }else{
          //  缓存不为空，则取缓存
           this.sysTag=JSON.parse(JSON.stringify(tempSysTag))
         }
       }
         
     }
     
  },
  methods:{
    //保存标签
    handleSaveTag(){
          //this.$message('努力提交中~');
          // 私有标签删除        
              this.$axios.post('/api/tag/tag/addTagBat',{
                companyTag:JSON.stringify(this.myTag),
              } )
              .then((res)=> {
                  const _data=res.data;
                  if(_data.code==0){
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    //  this.myTag.splice(this.getTagIndex(this.myTag,tag.zt_id), 1);
                  }else{
                     this.$message.error(_data.message);
                  }
                })
    },
    concatTag(sys){
        let _arr=[];
        if(sys){
            sys.map((item)=>{
              if(item.isSelect==1){
                _arr.push(item)
              }
            })
            return _arr.concat(this.privateTag);
        }
        return _arr;
        
    },
       getTagIndex(arr,id){
            for(let k=0;k<arr.length;k++){
               if(arr[k].zt_id==id)
               return k
            }
            retrun (-1)
       },
       handleClose(tag) {

         if(tag.zt_mark==2){
            // 私有标签删除
            this.privateTag.splice(this.getTagIndex(this.privateTag,tag.zt_id),1)
            
         }else{
            // 共有标签删除
            this.sysTag[this.getTagIndex(this.sysTag,tag.zt_id)].isSelect=0;
         }
         this.myTag.splice(this.getTagIndex(this.myTag,tag.zt_id), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue ) {
          if(this.myTag.length>9){
            this.$message.error('抱歉，最多只能添加10个标签！');
            this.inputVisible = false;
            this.inputValue = '';
            return false
          }
        this.privateTag.push({
            zt_name:inputValue,
            zt_mark:"2",
            zt_id:""
          });
        this.myTag=this.concatTag(this.sysTag);
        }
         this.inputVisible = false;
         this.inputValue = '';
      },
      handleSelectMoreTag(index,tag){
        
        if(tag.isSelect==0){
          this.sysTag[index].isSelect=1;
        }else{
          this.sysTag[index].isSelect=0;
        }
      },
      handleSetSysTag(){
        let __sysTag=[];
        this.sysTag.map((item)=>{
              if(item.isSelect==1){
                __sysTag.push(item)
              }
        })
        if((__sysTag.length + this.privateTag.length)>10){
          this.$message.error('抱歉，最多只能添加10个标签！');
          return false;
        }else{
          tempSysTag=[]; //清空缓存
          this.selectTagDialogVisible=false;
          this.myTag=this.concatTag(this.sysTag);
        }
        // if(this.myTag.length){
        //   this.$message.error('抱歉，最多只能添加10个标签！');
        // }else{
        //   this.selectTagDialogVisible=false;
        //   this.propSysTag={...this.sysTag};
        //   this.myTag=this.concatTag();
        // }
      }
  }
}
</script>
<style lang="scss">
.company-set-tag{
  margin-left: 103px;
  .add-more-tags {
    margin-top: 36px;
  }
  .tag-select-dialog {
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .el-tag {
      background-color: hsla(220, 8%, 56%, 0.1);
      border-color: hsla(220, 8%, 56%, 0.2);
      color: #878d99;
    }
    .is-selected {
      background-color: rgba(64, 158, 255, 0.1);
      color: #409eff;
      border: 1px solid rgba(64, 158, 255, 0.2);
    }
  }

.el-tag {
    background-color: rgba(64, 158, 255, 0.1);
    padding: 0 10px;
    height: 32px;
    line-height: 30px;
    color: #409eff;
    border: 1px solid rgba(64, 158, 255, 0.2);
    margin-top: 15px;
    margin-right: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 15px;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
    margin-top: 15px;
  }
}
</style>

