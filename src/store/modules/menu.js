//动态生成菜单
import defaultMenu from "@/components/config/defaultMenu.js";
const buildTree= (_arr,mark)=>{
  let arr= JSON.parse(JSON.stringify(_arr));
  let temp = {},treeObj = {};
  // 数组转 键值对,将每一项的id作为key放在一个临时对象中
  arr.map(item => {
    temp[item.id] = item;
    temp.subs && (temp.subs=[]);
  })
  let tempKeys = Object.keys(temp);
  tempKeys.forEach(key => {
    // 获取当前项
    let item = temp[key]
    // 当前项 pId
    let itemPid = item.pid
    // 获取父级项
    let parentItemByPid = temp[itemPid]
    //根据对象引用，修改对象，所有指向该对象的指针也会变化
    if(mark.includes(item.marker) && item.isMenu){
      if (parentItemByPid) {
        if (!parentItemByPid.subs) parentItemByPid.subs = [];
        parentItemByPid.subs.push(item)
      } else {
        treeObj[item.id] = item
      }
    }
    
  })
  // 对象转数组并返回
  return Object.keys(treeObj).map(key => treeObj[key])
}

export default {
  state:{
     userMenu:[]
  },
  mutations: {
    generateMenu(state,marker) {
      state.userMenu=buildTree(defaultMenu,marker);
    }
  }
}