<template>
  <div class="base-menu">
    <el-menu class="sidebar-menu"
             :default-active="onRoutes"
             :collapse="collapse"
             background-color="#324157"
             text-color="#bfcbd9"
             active-text-color="#20a0ff"
             unique-opened
             router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index"
                      :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs"
                          :index="subItem.index"
                          :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs"
                              :key="i"
                              :route="'/'+threeItem.index"
                              :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else
                            :index="subItem.index"
                            :route="'/'+subItem.index"
                            :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index"
                        :route="'/'+item.index"
                        :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    collapse: {
      type: Boolean,
      value: false
    }
  },
  data () {
    return {
      items: this.$store.state.menu.userMenu
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace("/",'');
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    // vBus.$on('collapse', (status) => {
    //     this.collapse = status;
    // })
  }
}
</script>

<style scoped lang="scss">
.base-menu {
  display: block;
  overflow-y: scroll;
  position: absolute;
  top:0;
  left: 0;
  &::-webkit-scrollbar {
    width: 0;
  }
  .el-menu {
    border: 0;
  }
  .sidebar-menu:not(.el-menu--collapse) {
   width: 280px;
  }
  & > ul {
    height: 100%;
  }
}
</style>
