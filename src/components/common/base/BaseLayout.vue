<template>
  <el-container>
    <el-header height="64px"
               class="padding-0"
               style="padding:0;">
      <base-header :handleCollapse="handleCollapse"></base-header>
    </el-header>
    <el-container>
      <el-aside class="side-wrap"
                :width="sideWidth">
        <base-menu :collapse="collapse" ></base-menu>
      </el-aside>
      <el-main class="container-main">
        <div class="container-inner">
        <router-view :key="$route.fullPath"></router-view>
        </div>
        <!-- <div :style="bodyHeight">
          <el-card class="box-card">
            <transition name="move" mode="out-in">
              <router-view :key="$route.fullPath"></router-view>
            </transition>
          </el-card>
        </div> -->
        <!-- <el-footer><base-footer></base-footer></el-footer> -->
      </el-main>

    </el-container>
  </el-container>
</template>
<script>
import BaseMenu from './BaseMenu'
import BaseHeader from './BaseHeader'
import BaseFooter from './BaseFooter'
export default {
  components: {
    BaseMenu,
    BaseHeader,
    BaseFooter
  },

  data () {
    return {
      bodyHeight: {},
      collapse: false,
      sideWidth: "280px"
    }
  },
  methods: {
    handleCollapse () {
      this.collapse = !this.collapse;
      this.sideWidth = this.collapse ? "64px" : "280px";
    }
  },
  computed: {
    containerBody () {
      let height = document.getElementById('main').offsetHeight - 40
      return {
        height: height + 'px'
      }
    }
  }

}
</script>
<style scoped>
.el-container {
  background: #f5f5f5;
  height: 100%;
}
.container-main {
  width: auto;
  box-sizing: border-box;
  overflow-y: scroll;
  min-width: 1110px;
  padding: 0;
  margin:10px;
  background-color: #fff;
 
}
.container-main::-webkit-scrollbar {/*滚动条整体样式*/
      width: 0px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 0px;
  }
  .container-main::-moz-scrollbar {/*滚动条整体样式*/
      width: 0px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 0px;
  }
  .container-main::-ms-scrollbar {/*滚动条整体样式*/
      width: 0px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 0px;
  }
  .container-main::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(0,0,0,0.2);
  }
  .container-main::-webkit-scrollbar-track {/*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 0;
      background: rgba(0,0,0,0.1);
  }
   .side-wrap::-webkit-scrollbar {/*滚动条整体样式*/
      width: 0px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 0px;
  }
  .side-wrap::-moz-scrollbar {/*滚动条整体样式*/
      width: 0px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 0px;
  }


/* .container-inner{
  height: 400px;
} */
.side-wrap {
  background: #324157;
  transition: width 0.5s ease-in-out;
  /* position: relative;
  overflow:hidden; */
}
</style>
