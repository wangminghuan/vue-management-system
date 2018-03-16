<template>
  <section >
            <h4 class="com-item-title">详细信息</h4>
            <el-form :model="detailRuleForm" :rules="detailRules" ref="detailRuleForm" label-width="100px">
              <el-form-item label="企业地址">
                <city-select v-model="detailRuleForm.location"></city-select>
              </el-form-item>
              <el-form-item label="详细地址" prop="adress">
                <el-input v-model="detailRuleForm.adress" class="user-input-text"></el-input>
              </el-form-item>
              <el-form-item label="企业类型" prop="type" >
                <el-input :disabled="true" placeholder="保险公司" class="user-input-text" v-model="detailRuleForm.type" ></el-input>
              </el-form-item>
              <el-form-item label="保险公司" prop="cname" v-show="isShowInsuranceSelect">
                <el-select v-model="detailRuleForm.cname" class="user-input-text" placeholder="请选择保险公司">
                  <el-option v-for="item in insuranceList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="企业简介" prop="desc">
                <el-input type="textarea" class="user-input-text" placeholder="填写公司的介绍文字，建议言简意赅，不超过300字" v-model="detailRuleForm.desc"></el-input>
              </el-form-item>
              <el-form-item>
              <el-button type="primary" @click="handleSubmitDetailForm('detailRuleForm')">保存</el-button>
            </el-form-item>
           </el-form>
        </section>
</template>
<script>
import citySelect from "../../common/citySelect";
export default {
   components:{
            citySelect
        },
    props:{
       renderData:Object
     },
   data(){
       return {
           isShowInsuranceSelect:false,
           insuranceList:[],
           detailRuleForm: {
              location:{
                prov:"",
                city:"",
                region:""
              },
                adress: '',
                type: '',
                cname: '',
                desc: '',
                isInsurance:false
            },
            detailRules: {
                adress: [
                  { required: false, message: '请输入详细地址', trigger: 'blur' },
                  { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
                ],
                desc: [
                  { required: true, message: '请输入企业简介', trigger: 'blur' },
                  { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
                ],
                cname: [],
                type: [
                  { required: false, message: '请选择企业类型', trigger: 'change' }
                ]
            },
       }
   },
   watch:{
      renderData(val){
            this.detailRuleForm=val;
            if(val.c_type==1){  //type为1为保险公司，需要再请求保险公司列表
              this.isShowInsuranceSelect=true;
              this.detailRules.cname.push({ required: true, message: '请选择保险公司', trigger: 'change' })
 
              this.$axios.post('/api/company/company/getInsuranceCompany', )
                .then((res)=> {
                const _data=res.data;
                if(_data.code==0){
                  this.insuranceList=_data.data||[];
                }
                })
            }
      }
    },
   methods:{
       handleSubmitDetailForm(formName) {
         this.$refs[formName].validate((valid) => {
          if (valid) {
             //this.$message('努力提交中~');
            this.$axios.post('/api/company/company/saveCompanyDetails', {
             province:this.detailRuleForm.location.prov,
             city:this.detailRuleForm.location.city,
             area:this.detailRuleForm.location.region,
             companyAddress:this.detailRuleForm.adress,
             companyIntroduce:this.detailRuleForm.desc,
             companyType:this.detailRuleForm.c_type,
             belongInsuranceCompany:this.detailRuleForm.cname,
            })
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
   }
}
</script>

