<template>
<div class="msg-tips-wrap" v-show="isShow">
  <img @click="handleClick" src="../../../static/img/msg.png">
  <i v-show="msgListArr.length>0"></i>
</div>
</template>
<script>
export default {
  data(){
      return {
          msgListArr:[],
          isShow:false,
      }
  },
  props:{
    isInsurCompany:Boolean
  },
  methods:{
      handleClick(){
          const h = this.$createElement;
          const that=this;
          if(this.msgListArr.length==0){
              this.$message("暂无新消息")
              return false
          }
          this.msgListArr.map((item,index)=>{
                setTimeout(()=>{
                    this.$notify({
                        title: item.msg_title,
                        message: h('i', { style: 'color: teal'}, item.msg_content),
                        duration: 0,
                        onClose:function(){
                             that.$axios.post('/api/system/message/readmsg',{
                                 msg_id:item.msg_id
                             }).then((res)=>{
                                   const _data=res.data;
                                   if(_data.code==0){
                                       that.msgListArr.splice(index,1)
                                   } 
                             })
                         }
                        });
                },100*index)
          })
          
        
        
      }
  },
  created(){
    //   显示信息图标
      __vBus.$on("showMsgTips",(val)=>{
             this.isShow=true;
      })
      if(!this.isInsurCompany){
       this.$axios.post('/api/system/message/companyunreadmsglist')
            .then((res)=> {
            const _data=res.data;
            if(_data.code==0 && _data.data.length>0){
                this.msgListArr=_data.data;
            }
            })
      }
      
      
  }
}
</script>

<style lang="scss">
.msg-tips-wrap{
    position: relative;
    width: 60px;
    height: 100%;
    cursor: pointer;
   img{
       width: 30px;
       display: block;
       margin-top:18px;
   }
   i{
       background-color: red;
       width: 8px;
       height: 8px;
       display: block;
       position: absolute;
       top:-4px;
       left: 30px;
       border-radius: 50%;
   }
}
</style>

