//动态路由+异步获取
import axios from "../../utils/http";
import pages from "@/components/config/page.js";
import defaultMenu from "@/components/config/defaultMenu.js";
const generate=(pressionArr)=>{
  let permissionRouterConfig = [
    {
      path: '/app',
      component: pages.BaseLayout,
      children: [
        {
          path: '/',
          redirect: '/app/home'
        }
      ]
    }
  ];
  defaultMenu.map((item)=>{
     if(pressionArr.indexOf(item.marker)>-1){
       //动态添加路由
      !!item.component && permissionRouterConfig[0].children.push({
        path: "/"+item.path,
        meta: {
          title: item.name
        },
        component: pages[item.component]
      })
     }
  })
  //匹配404页面
  permissionRouterConfig.push({
    path: '*',
    redirect: '/404'
  })
  return permissionRouterConfig
}
export default {
  actions:{
      getPremission({commit}){
        return new Promise((resolve, reject)=>{
          axios.post("/pression")
          .then((res)=>{
              if(res.data.code==0){
                const marker=res.data.data.pre||[];
                commit("generateMenu",marker);
                resolve(generate(marker));
              }else{
                reject();
              }
          }).catch((err)=>{
            console.log(err)
            reject();
          })
        })
      }
  }
}