<template>
  
</template>
<script>
export default {
    props:{
        renderData:Object
    },
  data(){
     return{
       defaultUserData:window.localStorage?(localStorage.getItem('__loginName__')||"").split("#"):[],
       adminVal:1, //1,无权限，2主管理员, 3子管理员
        mueuVal:[], // 1:通讯录管理，2工作台管理，3：企业设置，4，通知公告，5. 工作台轮播图
        isDissolve:"1",// 1正常,2禁用,3解散中,4已解散
     }
  },
   computed:{
            defaultNameisExpire: function () {
                 // 是否过期 ，true:过期
                return this.defaultUserData[1] && ((new Date()).getTime()-this.defaultUserData[1])/(1000*60*60*24)>15?true:false
            }

  },
  methods:{
      entryHome(arg){
        sessionStorage.setItem('__user__',this.renderData.m_name);
        sessionStorage.setItem('__c_type__',this.renderData.is_insurancecompany);
        sessionStorage.setItem('__data__',JSON.stringify({
                    access_token:this.renderData.access_token,
                    u_id:this.renderData.u_id,
                    c_id:this.renderData.c_id,
                    ver:"1.0.0"
        }));
        //    设置显示菜单
        const __menu={
            menu: this.mueuVal instanceof Array? this.mueuVal.join("&"):"",
            admin:this.adminVal,
            status:this.isDissolve,
        }
        const __from=this.$route.query.from;let _query={};
        if(arg)  _query.guide=1;

        if(__from) _query.from=__from;
        sessionStorage.setItem('__menu__',JSON.stringify(__menu));
        this.$router.push({path: '/home', query:_query})
        
    },
  },
  created(){
        // console.log(this.renderData)
        this.mueuVal=this.renderData.models;
        this.adminVal=this.renderData.identity;
        this.isDissolve=this.renderData.isdissolve||"1";
        sessionStorage.setItem('__token__',this.renderData.access_token);
        if(window.localStorage && (this.defaultUserData[0]=="" || this.defaultNameisExpire || (this.defaultUserData[0]!==this.renderData.tel.replace(/\s+/g,""))) ){
            // 本地数据为空或过期时，账号数据更新时，再次存储一份
            localStorage.setItem('__loginName__',this.renderData.tel.replace(/\s+/g,"")+"#"+new Date().getTime());
        }
        //将已经登录过的账号和公司存起来，首次登录展示引导
        let hasLoginUserAndCompany=JSON.parse(localStorage.getItem('__hasloginUidCid__'))||[];
        const __item=this.renderData.u_id+"#"+this.renderData.c_id;
        if(hasLoginUserAndCompany.indexOf(__item)==-1){
            hasLoginUserAndCompany.push(__item);
            localStorage.setItem('__hasloginUidCid__',JSON.stringify(hasLoginUserAndCompany))
            this.entryHome("showGuide");
        }else{
            this.entryHome();
        }       
  }
}
</script>

