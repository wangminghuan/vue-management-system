const BaseLayout={
  path:"/app",
  name:"",
  component:()=> import('@/components/common/base/BaseLayout.vue')
}
const Home={
  path:"/app/home",
  name: "首页",
  component:()=> import('@/components/pages/Home.vue')
}
const BaseTable={
  path:"/app/baseTable",
  name: "基础表格",
  component:()=> import('@/components/pages/BaseTable.vue')
}
const BaseForm={
  path:"/app/baseForm",
  name: "基础表单",
  component:()=> import('@/components/pages/BaseForm.vue')
}
const VueEditor={
  path:"/app/vueEditor",
  name: "富文本编辑器",
  component:()=> import('@/components/pages/VueEditor.vue')
}
const MarkDown={
  path:"/app/markDown",
  name: "markDown编辑器",
  component:()=> import('@/components/pages/MarkDown.vue')
}

export default {
  BaseLayout,
  Home,
  BaseTable,
  VueEditor,
  BaseForm,
  MarkDown
}