<template>
  <el-breadcrumb :separator-class="isSeparator">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="item in breadList"
      :to="{path:item.path}"
      :key="item.name"
    >{{item.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
  
 
  <script>
     export default {
     created(){
         this.getBreadcrumb()
     },
     data(){
         return {
             breadList: []
         }
     },
     watch: {
         $route () {
             this.getBreadcrumb()
         }
     },
     methods:{
         getBreadcrumb(){
             let matched = this.$route.matched.filter(item => item.name)
             this.breadList = matched
         }
     },
     props:{
         isSeparator:{
             type:String,
             default:'el-icon-arrow-right'
         }
     }
 }
 </script>


