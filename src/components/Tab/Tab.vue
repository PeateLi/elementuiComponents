<template>
    <div>
         <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
            <el-tab-pane
                v-for="(item, index) in tabArr"
                :key="item.name"
                :label="item.title"
                :name="item.name"
            >
            
                {{item.content}}
            </el-tab-pane>
        </el-tabs>
    </div>
</template>


<script>
export default {
    data(){
        return {
            editableTabsValue:this.activeTab,
        }
    },
    methods:{
        removeTab(targetName) {
        let tabs = this.tabArr;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.tabArr = tabs.filter(tab => tab.name !== targetName);
      }
    },
    props:{
        tabArr:{
            type:Array,
            default:() => {
                return []
            }
        },
        activeTab:{
            type:String,
            default:''
        },
        isTabPosition:{
            type:String,
            default:'bottom'
        }
    }
    
}
</script>


<style lang="less" scoped>

</style>