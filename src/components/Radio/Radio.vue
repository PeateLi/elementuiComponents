<template>
    <div>
        <el-radio-group v-model="radio" :size="RadioSize" @change='ChangeRadio' :border='isBorder' :disabled='isDisabled'>
            <el-radio  v-for="item in RadioOptions" :key="item.value" :disabled='item.disabled' :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
    </div>
</template>


<script>
export default {
    data(){
        return {
            radio:this.activeRadio
        }
    },
    props:{
        RadioOptions:{   //单选按钮组数据
            type:Array,
            default:() => {
                return []
            }
        },
        isDisabled:{  //是否禁用
            type:Boolean,
            default:false
        },

        RadioSize:{    //在 border 为真时有效
            type:String,
            default:''
        },
        isBorder:{   //是否需要border
            type:Boolean,
            default:false
        },
        activeRadio:{  //默认选中
            type:String,
            default:''
        }
    },
    methods:{
        ChangeRadio(){
            let _this = this
            _this.$emit('GetChangeRadio',_this.radio)
        }
    }
}
</script>


<style lang="less" scoped>

</style>