# 通讯录

    通讯录
        |
        |----组织结构(organ)
        |       |
        |       |----列表主体(organContent)
        |       |       |
        |       |       |----选择部门(chooseDepartmentBox)
        |       |       |
        |       |       |----通知激活(notifyPop)
        |       |
        |       |----批量添加结果页(leadingInContent)
        |       |
        |       |----选择部门(chooseDepartmentBox)
        |
        |----角色(role)
                |
                |
                |----列表主体(roleContent)
                |       |
                |       |----选择部门(chooseDepartmentBox)
                |       |
                |       |----通知激活(notifyPop)
                |
                |
                |----选择部门(chooseDepartmentBox)
                |
                |----添加成员(choosePersonBox)

--------------------

## organ.vue   (通讯录-组织结构--主体)

    el-container
        |
        |
        |----el-aside    //侧边栏(由于结构树功能比较复杂,下面会有两个element的结构树结构,一个用于点击,一个用于搜索不展示,最后还有专门用来展示搜索结果的区域)
        |       |
        |       |----el-input   //搜索框
        |       |
        |       |----ul(.tab-router)    //切换框（组织结构--角色）
        |       |
        |       |
        |       |----div(.side-tree-wrap)    //侧边栏--用于展示结构树(主要是展开,点击功能)
        |       |
        |       |----el-tree   //用于搜索，前端不会显示--用于搜索的结构树
        |       |
        |       |----div(.search-result-box)   //用于展示搜索结果，只有当在搜索时，才会隐藏展示结构树，显示此结构
        |
        |----el-main(.organ-right-wrap)     //主体   其中包括数个弹框（编辑部门、选择部门、选择主管、设置主管、添加子部门）
        |       |
        |       |
        |       |----organ-content    //organContent组件 --> 列表内容，包括列表操作
        |       |                     // :organData  --> 组织结构树数据-->部门(用在选择部门弹框中)
        |       |                     // :mainTableFlag   -->  专门用来父级改变原来的值,子级组件监控它是否变化,来确定是否更新整个列表信息   后期优化：可以直接使用ref调用子组件的方法实现
        |       |                     // :departId   -->  当前部门的id
        |       |                     // @listEdit  --> 内容编辑    调起编辑框
        |       |                     // @chooseDepartments   -->   直接调整部门（非在编辑框中调整），调起调整部门
        |       |                     // @adjustUpload   -->   数据更新 （更新所有数据，包括结构树）
        |       |                     // @isFirstGetDepartmentMsg   判断是否是刚进入通讯录  如果是，则取用第一个总部门的信息进行展示
        |
        |----el-main(.batch-add-person)     //批量添加成员主体
        |       |
        |       |
        |       |----leading-in-content   //leadingInContent组件  --> 批量导入结果展示页
        |                                // :uploadResult    导入的结果数据
        |                                // @goBack     返回-->隐藏结果页，重新展示批量添加
        |
        |----el-main(.add-person)    //添加成员主体（编辑成员、添加成员）
                |
                |
                |----choose-department-box   //chooseDepartmentBox组件   -->  选择部门
                                                // :defaultCheckArr  -->如果是编辑成员，会有默认选项
                                                // :chooseDepartments  -->添加成员-->是否显示部门选择弹框
                                                // @closeChooseDepartment  --> 关闭选择部门弹框


---------------------

## role.vue    (通讯录-角色--主体)

    el-container
        |
        |
        |----el-aside    //侧边栏(由于结构树功能比较复杂,下面会有两个element的结构树结构,一个用于点击,一个用于搜索不展示,最后还有专门用来展示搜索结果的区域)
        |       |
        |       |----el-input   //搜索框
        |       |
        |       |----ul(.tab-router)    //切换框（组织结构--角色）
        |       |
        |       |
        |       |----div(.side-tree-wrap)    //侧边栏--用于展示结构树(主要是展开,点击功能)
        |       |
        |       |----el-tree   //用于搜索，前端不会显示--用于搜索的结构树
        |       |
        |       |----div(.search-result-box)   //用于展示搜索结果，只有当在搜索时，才会隐藏展示结构树，显示此结构
        |
        |----el-main(.organ-right-wrap)     //主体   其中包括数个弹框（编辑角色）
        |       |
        |       |----role-content    //roleContent组件
        |                           // :organData  -->  组织结构树数据-->部门(用在选择部门弹框中)
        |                           // :mainTableFlag   -->  专门用来父级改变原来的值,子级组件监控它是否变化,来确定是否更新整个列表信息   后期优化：可以直接使用ref调用子组件的方法实现
        |                           // :departId   -->  当前部门的id
        |                           // @listEdit  --> 内容编辑    调起编辑框
        |                           // @adjustUpload   -->   数据更新 （更新所有数据，包括结构树）
        |                           // :teamRole   --> 单独的角色组的信息
        |
        |----el-main(.role-preheat)   当进入角色中时,先行展示的页面
        |
        |
        |----el-dialog(添加角色弹框)
        |
        |----choose-person-box  // choosePersonBox组件   添加成员弹框
                                // :chooseDepartments       -->   是否打开弹框
                                // :chooseData              -->  结构树的数据
                                // @closeChoosePerson       -->    关闭添加成员弹框
                                // @adjustUpload            -->    更新数据
                                // :currentRole             -->   当前选中的角色的id
                                // :roleDefaultArr          -->   默认选中的选项



# 工作台

    工作台(index)
        |
        |----企业应用/禁用应用(applicationBox)   //  :applicationMsg --> 应用列表   
                |
                |----应用操作区域(firstRecommendBox)   //其中包括：设为首推、禁用、设置等
                |                                     // :isRun   判断是否是禁用应用
                |                                     // :appmsg    当前应用的信息
                |                                     // :i     当前应用的索引值
                |                                     // @setting   触发设置界面
                |
                |----选择部门(chooseDepartmentBox)
    
    应用详情(applicationDetail)

    应用市场(applicationMarket)