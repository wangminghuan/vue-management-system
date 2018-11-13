<template>
  <div class="base-menu" :style="{'width':'290px','height':'sideHeight'}">
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
          <el-submenu :index="item.path"
                      :key="item.path">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs"
                          :index="subItem.path"
                          :key="subItem.path">
                <template slot="title">{{ subItem.name }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs"
                              :key="i"
                              :route="'/'+threeItem.path"
                              :index="threeItem.path">
                  {{ threeItem.name }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else
                            :index="subItem.path"
                            :route="'/'+subItem.path"
                            :key="subItem.path">
                {{ subItem.name }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path"
                        :route="'/'+item.path"
                        :key="item.path">
            <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
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
      items: this.$store.state.menu.userMenu,
      sideHeight:""
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace("/", '');
    }
  },
  mounted(){
     this.sideHeight=window.innerHeight+"px"
  }
}
</script>

<style scoped lang="scss">
.base-menu {
  display: block;
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
