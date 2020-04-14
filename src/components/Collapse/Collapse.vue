<template>
    <div>
        <el-collapse accordion>
        <el-collapse-item v-for="item in collapseArr" :key="item.title">
            <template slot="title">
           {{item.title}}<i :class="item.icon"></i>
            </template>
            <slot :name='item.content'></slot>
        </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
export default {
    data(){
        return{
            
        }
    },
    props:{
        collapseArr:{
            type:Array,
            default:() => {
                return []
            }
        }
    }
}
</script>