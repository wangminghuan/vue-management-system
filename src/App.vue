<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import asyncRouter from "@/components/config/asyncRouter.js";
export default {
  created(){
    const token=sessionStorage.getItem('__TOKEN__');
    if(token){
      asyncRouter();
    }
  }
}
</script>

<style>
@import "./assets/css/reset.css";
html,body,#app{
  width: 100%;
  height: 100%;
}
</style>