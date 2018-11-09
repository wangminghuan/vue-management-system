import pages from "@/components";
import router from "@/router";
const getRouter= ()=> {
  let permissionRouterConfig = [
    {
      path: '/app',
      component: pages.BaseLayout.component,
      children: [
        {
          path: '/',
          redirect: '/app/home'
        }
      ]
    }
  ];
  for (let key in pages) {
    if (pages[key].name) {
      permissionRouterConfig[0].children.push({
        path: pages[key].path,
        meta: {
          title: pages[key].name
        },
        component: pages[key].component
      })
    }
  }
  //匹配404页面
  permissionRouterConfig.push({
    path: '*',
    redirect: '/404'
  })
  router.addRoutes(permissionRouterConfig);
}

export default getRouter;