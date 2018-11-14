
export default [
{
  pid:0,
  id:10,
  marker:"P_HOME",
  icon: 'el-icon-tickets',
  path: 'app/home',
  name: '系统首页',
  isMenu:true,
  component:"Home"
},
{
  pid:0,
  id:20,
  marker:"P_BASE_TABLE",
  icon: 'el-icon-tickets',
  path: 'app/baseTable',
  name: '基础表格',
  isMenu:true,
  component:"BaseTable"
},
{
  pid:0,
  id:30,
  marker:"M_FORM",
  icon: 'el-icon-tickets',
  path:'M_FORM',
  name: '表单相关',
  isMenu:true,
},
{
  pid:30,
  id:3001,
  marker:"P_BASE_FORM",
  icon: 'el-icon-tickets',
  path:'app/baseForm',
  name: '基本表单',
  isMenu:true,
  component:"BaseForm"
},
{
  pid:30,
  id:3002,
  marker:"M_Three",
  icon: 'el-icon-tickets',
  path:'M_Three',
  name: '三级菜单',
  isMenu:true,
},
{
  pid:3002,
  id:300201,
  marker:"P_VUEEDITOR",
  icon: 'el-icon-tickets',
  path:'app/vueEditor',
  name: '富文本编辑器',
  isMenu:true,
  component:"VueEditor"
},
{
  pid:3002,
  id:300202,
  marker:"P_MARKDOWN",
  icon: 'el-icon-tickets',
  path:'app/markDown',
  name: 'markdown编辑器',
  isMenu:true,
  component:"MarkDown"
}
]