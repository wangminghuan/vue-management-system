const BaseLayout=()=> import('@/components/common/base/BaseLayout.vue');

const Home=()=> import('@/components/pages/Home.vue');

const BaseTable=()=> import('@/components/pages/BaseTable.vue');

const BaseForm=()=> import('@/components/pages/BaseForm.vue');

const VueEditor=()=> import('@/components/pages/VueEditor.vue');

const MarkDown=()=> import('@/components/pages/MarkDown.vue');


export default {
  BaseLayout,
  Home,
  BaseTable,
  VueEditor,
  BaseForm,
  MarkDown
}