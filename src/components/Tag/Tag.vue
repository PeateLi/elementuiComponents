<template>
    <div>
        <el-tag
        v-for="item in tags"
        :key="item.id"
        :type="item.type"
        :size='item.size'
        :closable='isClosableTag'
        @close="handleClose(item)">
            {{item.name}}
        </el-tag>
    </div>
</template>

<script>
export default {
    data(){
        return {
          
        }
    },
    props:{
        tags:{    //标签类型
            type:Array,
            default:() => {
                return []
            }
        },
        isClosableTag:{   //标签是否可关闭
            type:Boolean,
            default:true
        }

    },
    methods:{
        handleClose(tag){
            let _this = this
            _this.$emit('CloseTag',tag)
        }
    }
}
</script>

<style lang="less" scoped>

</style>