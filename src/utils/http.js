import axios from 'axios';
import qs from "qs";
import router from 'router';
import Vue from 'vue';
import Md5 from "md5";
import uncompileStr from "./decode";
//设置基本数据
//对字符串进行加密, 通过解密函数得到结果
// function compileStr(code){         
//     let c=String.fromCharCode(code.charCodeAt(0)+code.length); 
//     for(let i=1;i<code.length;i++){        
//       c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
//     }     
//     return escape(c);   
//  } 
 // console.log(11,compileStr("wmPck3Dy3CjkZUji6MhPnRU1i8LKfUyeTEG"));
// console.log(12,compileStr("wwPck3Dy5CjkZUji69hPnRU1i8LKyUyewEk"));
// console.log(13,compileStr("wmhJck3Dy3CjkZUji6MhPnRU1i8LKfPnHAl"));//真正线上key(Jck3Dy3CjkZUji6MhPnRU1i8LKfPnHAl),去掉前三位
// console.log(21,compileStr("qlrCiuBHUB7vhrpKRvME19PO7519Y5M9Wsa"));
// console.log(22,compileStr("qy19lrvhEPO7519rpCiuBHUB7KRvMY5M9W")); //真正测试key(19lrvhEPO7519rpCiuBHUB7KRvMY5M9W),去掉前两位
// console.log(23,compileStr("yy1EPO75199lrvhrpHUB7KRvMCi5M9WuBYr"));
const  __vue=new Vue();
const  finalhost=window.location.hostname.indexOf("rc.inswindows.com")>-1?"service.rc.inswindows.com":window.location.hostname.indexOf("inswindows.com")>-1?"service.inswindows.com":"zc.dev.bxd365.com";
// console.log(finalhost)
const  secret_arr=[
    "%9A%E4%BD%B3%CE%9Ew%BD%ACv%AD%D5%C5%AF%BF%D3%9F%83%B5%B8%BE%C0%A7%86%9A%A1%84%97%B1%BB%CE%DE%B9%99%8C",
    "%9A%EE%C7%B3%CE%9Ew%BD%AEx%AD%D5%C5%AF%BF%D3%9Fo%A1%B8%BE%C0%A7%86%9A%A1%84%97%C4%CE%CE%DE%DC%BC%B0",
    "%9A%E4%D5%B2%AD%CE%9Ew%BD%ACv%AD%D5%C5%AF%BF%D3%9F%83%B5%B8%BE%C0%A7%86%9A%A1%84%97%B1%B6%BE%B6%89%AD",
    "%94%DD%DE%B5%AC%DE%B7%8A%9D%97y%AD%DE%DA%E2%BB%9D%C8%C3%92vj%89%9F%86lfj%92%8E%82%86%90%CA%D4",
    "%93%EA%AAj%A5%DE%E8%DE%AD%95%9F%86lfj%AB%E2%B3%AC%DE%B7%8A%9D%97y%82%9D%C8%C3%A6%8E%82%86%90",
    "%9C%F2%AAv%95%9F%86lfjr%A5%DE%E8%DE%DA%E2%B8%9D%97y%82%9D%C8%C3%90%AC%9E%82%86%90%CC%B7%9B%CB"
];

// 将所有参数获得，再计算MD5后sign值
function getAllParmas(url,result){
   let arr=[];
   for(let key in result){
    arr.push(key+"="+result[key])
   }
  result.sign=getMd5Code(url,(arr.sort()).join("&"))
  return result;
}
function getMd5Code(url,strParams){
    // console.log(((finalhost+url+"?")+strParams)+ (finalhost.indexOf("inswindows.com")>-1?''== null?uncompileStr(secret_arr[0]).substring(3):false == ''?uncompileStr(secret_arr[2]).substring(3):uncompileStr(secret_arr[1]).substring(2) : null == undefined? uncompileStr(secret_arr[4]).substring(2): NaN==NaN?uncompileStr(secret_arr[3]).substring(2) :uncompileStr(secret_arr[4]).substring(1)));
    return Md5(((finalhost+url+"?")+strParams)+ (finalhost.indexOf("inswindows.com")>-1?''== null?uncompileStr(secret_arr[0]).substring(3):false == ''?uncompileStr(secret_arr[2]).substring(3):uncompileStr(secret_arr[1]).substring(2) : null == undefined? uncompileStr(secret_arr[4]).substring(2): NaN==NaN?uncompileStr(secret_arr[3]).substring(2) :uncompileStr(secret_arr[4]).substring(1)))
}
// Date原型链挂载格式化方法
Date.prototype.format = function (format) {
    let args = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let i in args) {
        let n = args[i];
        if (new RegExp("(" + i + ")").test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
};
// 全局签名对象，所有接口必须携带
// window.__signParams={
//     app_id:"zc_pc_admin",
//     api_version:"1.0.0",
//     request_sign:"c5da3ebf9fba-dba97572ef64",
//     request_date:(new Date().format("yyyy-MM-dd hh:mm:ss")),
// };
// 供element-upload组件上传使用
window.__finalParams=function(url,params){
    const  __sign={
        app_id:"zc_pc_admin",
        api_version:"1.0.0",
        request_sign:"c5da3ebf9fba-dba97572ef64",
        request_date:(new Date().format("yyyy-MM-dd hh:mm:ss")),
    };
    let result={
        ...params,
        ...__golbal_params,
        ...__sign
    };
    return getAllParmas(url,result);
}

axios.interceptors.request.use(
config => {
    let _params={};
    if(typeof __golbal_params=="undefined"){
        _params.u_id=sessionStorage.getItem('__uid__');
        _params.access_token=sessionStorage.getItem('__token__');
    }else{
        const  __sign={
            app_id:"zc_pc_admin",
            api_version:"1.0.0",
            request_sign:"c5da3ebf9fba-dba97572ef64",
            request_date:(new Date().format("yyyy-MM-dd hh:mm:ss")),
        };
        _params={
            ...__golbal_params,
            ...__sign
        }
    }
    // 多媒体类型处理
    if(typeof FormData !=="undefined" && config.data instanceof FormData){
        let origin={},result={},hasKey=[];
         if(config.data.forEach){
            config.data.forEach((val,key)=>{
                if(key!=="file"&& typeof key!=="object"){
                    hasKey.push(key);
                    origin[key]=val
                }
            });
        }else{
            console.log("不支持FormData对象遍历")
            // __vue.$message({
            //     showClose: true,
            //     message: '您的浏览器过旧，推荐使用谷歌浏览器访问！',
            //     type: 'warning'
            //   });
         
        }
        result={
            ..._params,
            ...origin
        };
        result=getAllParmas(config.url,result);
        for(let k in result){
            if(hasKey.indexOf(k)==-1)
            config.data.append(k,result[k])
        }
        
        return config
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    
    if(config.method === 'post') {
        let data = qs.parse(config.data);
        // console.log(new Date().getTime(),(new Date().format("yyyy-MM-dd hh:mm:ss")))
        if(!sessionStorage.getItem('__data__')){
             _params={
                app_id:"zc_pc_admin",
                api_version:"1.0.0",
                request_sign:"c5da3ebf9fba-dba97572ef64",
                request_date:(new Date().format("yyyy-MM-dd hh:mm:ss")),
            }
        } 
        let allParams=qs.stringify({
            ..._params,
            ...data
        });
        const sortParams={
            sign:getMd5Code(config.url,decodeURIComponent(((allParams.split("&")).sort()).join("&")))
        };
        config.data = qs.stringify({
            ..._params,
            ...data,
            ...sortParams
        })
    } else if(config.method === 'get') {
        let allParams={
            ..._params,
            ...config.params
        };
        const sortParams={
            sign:getMd5Code(config.url,((allParams.split("&")).sort()).join("&"))
        };
        config.params = {
            ..._params,
            ...config.params,
            ...sortParams
        }
        
    }
    // console.log(new Date().getTime(),_params.request_date)
    return config;
},
err => {
    return Promise.reject(err);
});
axios.interceptors.response.use(function (response) {  
    // token 已过期，重定向到登录页面  
    if(response.data.resultNum==94){
        sessionStorage.clear();  
        __vue.$message({
            showClose: true,
            message: '本机时间与标准时间相差较大，请校正本地时间后重新登陆',
            type: 'error'
          });
        router.replace('/login');
        return false
    }
    if (response.data.code == -100){  
        sessionStorage.clear();  
        __vue.$message.error('登录过期，请重新登录！！！');
        router.replace('/login');
        
    } 
    if(response.data.code && parseInt(response.data.code)>4000){
        sessionStorage.clear();  
        __vue.$alert('您的权限已发生变更，请重新登录！！！', '警告', {
            confirmButtonText: '确定',
            callback: action => {
                router.replace('/login');
            }
        });
    }
    return response  
}, function (error) { 
    console.log(error);
    __vue.$message({
        showClose: true,
        message: '抱歉，网络连接异常，请稍候重试~',
        type: 'error'
      });
    return Promise.reject(error)  
});
export  default axios;
