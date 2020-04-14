<template>
    <div>
        <el-checkbox-group 
        :disabled='isDisabled' 
        v-model="isCheck" 
        @change='GetChangeCheck'
        :border='isBorder'
        :size="checkSize">
            <el-checkbox  v-for="item in CheckOption" :disabled='item.disabled' :label="item.label" :key="item.label"></el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
export default {
    data(){
        return {
            isCheck:this.CheckList
        }
    },
    props:{
        CheckOption:{    //多选按钮组数据
            type:Array,
            default:() => {
                return []
            }
        },
        isDisabled:{   //是否禁用
            type:Boolean,
            default:false
        },
        CheckList:{   //选中数据  也可以理解为父组件传过来的默认值
            type:Array,
            default:() => {
                return []
            }
        },  
        isBorder:{    //多选按钮是否有边框线
            type:Boolean,
            default:false
        },
        checkSize:{    //多选按钮尺寸 需要配合border使用
            type:String,
            default:''
        }
    },
    methods:{
        GetChangeCheck(){
            let _this = this
            _this.$emit('GetChangeCheck',_this.isCheck)
        },
    }
}
</script>


<style lang="less" scoped>

</style>