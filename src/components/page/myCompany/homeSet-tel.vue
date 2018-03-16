<template>
  <section>
          <h4 class="com-item-title">联系方式-业务咨询</h4>
          <el-form label-width="90px" >
                <el-form-item label="联系电话" class="user-input-text company-set-name">
                  <el-input v-model="companyConcatTel"></el-input>
                  <el-button type="primary" @click="handleSaveTel">保存</el-button>
                </el-form-item>
          </el-form>
          <div style="height:50px"></div>
        </section>
</template>
<script>
export default {
  props:{
    renderData:Object
  },
  data() {
    return {
      companyConcatTel:""
    };
  },
  watch:{
     renderData(val){
       this.companyConcatTel=val.tel
     }
  },
  methods:{
      handleSaveTel(){
        //  if((/^([0-9]{3,4}-)?[0-9]{7,8}$/).test(this.companyConcatTel) || (/^((\+?86)|(\+86))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/).test(this.companyConcatTel)){
            //this.$message('努力提交中~');
                this.$axios.post('/api/company/company/saveCompanyPhone',{
                    companyId:__golbal_cid,
                    companyPhone:this.companyConcatTel
                } )
                .then((res)=> {
                    const _data=res.data;
                    if(_data.code==0){
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(_data.message);
                    }
                    })
        //  }else{
        //      this.$message({
        //         message: '请输入正确的联系方式',
        //         type: 'warning'
        //     });
        //  }
      }
  }
}
</script>

