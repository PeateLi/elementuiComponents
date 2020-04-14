<template>
  <div id="app">
    <Home></Home>
    <!-- <router-view/> -->
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  components:{
      Home:() => import('./views/Home')
  }
}
</script>

<style>
body,html{
  margin: 0px;
  height: 100%;
}
#app{
  height: 100%;
}
</style>
