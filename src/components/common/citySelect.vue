
<template>
  <div>
    <el-select v-model="selectProvince" placeholder="请选择省份" class="city-item">
    <el-option
      v-for="item in provOptions"
      :key="item.re_id"
      :label="item.re_name"
      :value="item.re_id">
    </el-option>
    </el-select>
    <el-select v-model="selectCity" placeholder="请选择城市" class="city-item">
    <el-option
      v-for="item in cityOptions"
      :key="item.re_id"
      :label="item.re_name"
      :value="item.re_id">
    </el-option>
    </el-select>
    <el-select v-model="selectRegions" placeholder="请选择区域" class="city-item">
    <el-option
      v-for="item in regOptions"
      :key="item.re_id"
      :label="item.re_name"
      :value="item.re_id">
    </el-option>
  </el-select>
  <!-- <el-button type="primary" @click="submit">子组件按钮</el-button> -->
  </div>
</template>
<script>
// let this.provinceArr=[], this.cityArr=[], this.regionsArr=[];
export default {
    props:{
       value: {
        type: Object,
        default:() => {},
      }
    },
    data(){
        return{
          provinceArr:[], 
          cityArr:[], 
          regionsArr:[],
          provOptions:[],
          cityOptions:[],
          regOptions:[],
          selectProvince:"",
          selectCity:"",
          selectRegions:"",
        }
    },
    watch:{
        value:function(val){
            // 检测v-modle变化
            this.selectProvince=val.prov;
            this.selectCity=val.city;
            this.selectRegions=val.region;
        },
        selectProvince:function(val,oldVal){
            // 数据发生变化时才进行原始数据清除
            if(val&&oldVal!=""){
                this.selectCity="";
                this.selectRegions="";
            }
            let _city=[];
            this.cityArr.map((item)=>{
              if(item.re_parent==val){
                    _city.push(item)
              } 
            });
            this.cityOptions=_city;
            this.$emit('input',{
                prov:this.selectProvince,
                city:this.selectCity,
                region:this.selectRegions
            })
        },
        selectCity:function(val,oldVal){
            // 数据发生变化时才进行原始数据清除
            if(val&&oldVal!=""){
                this.selectRegions="";
            }
            let _regions=[];
            this.regionsArr.map((item)=>{
              if(item.re_parent==val){
                    _regions.push(item)
              } 
            });
            this.regOptions=_regions;
            this.$emit('input',{
                prov:this.selectProvince,
                city:this.selectCity,
                region:this.selectRegions
            })
        },
        selectRegions(val){
            this.$emit('input',{
                prov:this.selectProvince,
                city:this.selectCity,
                region:this.selectRegions
            })
        }
    },
    methods:{
       getCityData(){
            let cityData;
            if(localStorage.getItem("__city_select__")){
                cityData=JSON.parse(localStorage.getItem("__city_select__"));
                cityData.map((item)=>{
                    if(item.re_level==1){
                        this.provinceArr.push(item)
                    }else if(item.re_level==2){
                        this.cityArr.push(item)
                    }else{
                        this.regionsArr.push(item);
                    }
                })
            }else{
                // 异步请求
                this.$axios.post('/api/common/region/all')
                .then((res)=> {
                const _data=res.data;
                    if(_data.code==0){
                        cityData=_data.data;
                        cityData.map((item)=>{
                            if(item.re_level==1){
                                this.provinceArr.push(item)
                            }else if(item.re_level==2){
                                this.cityArr.push(item)
                            }else{
                                this.regionsArr.push(item);
                            }
                           }) 
                        localStorage.setItem("__city_select__",JSON.stringify(_data.data))                   
                        }else{
                         this.$message.error('抱歉，获取地区失败，请稍候重试~');
                    }
                })
                
            }
            this.provOptions=this.provinceArr;
            // console.log([this.provinceArr.length,this.cityArr.length,this.regionsArr.length])
       }
    },
    created(){
        this.getCityData();
        // 添加默认数据
        this.selectProvince=this.value.prov;
        this.selectCity=this.value.city;
        this.selectRegions=this.value.region;
        // 父级的使用
        // <citySelect v-model="renderData"></citySelect>
        // renderData:{
        //             prov:"10011",
        //             city:"10039",
        //             region:"10539"
        //         }
        // console.log(renderData)
    }
}
</script>
