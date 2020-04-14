<template>
    <div>
        <el-button 
        :type='type' 
        :disabled='isDisabled'
        :plain='isPlain'
        :round='isRound'
        :circle='isCircle'
        :icon='isIcon'
        :size='BottonSize'>{{text}} <slot></slot> </el-button>
    </div>
</template>


<script>
export default {
    data(){
        return {

        }
    },
    props:{
        text:{  //按钮文字
            type:String,
            default:'默认'
        },
        type:{    //按钮类型
            type:String,
            default:''
        },
        isDisabled:{   //是否禁用
            type:Boolean,
            default:false
        },
        isPlain:{   //是否朴素按钮
            type:Boolean,
            default:false
        },
        isRound:{   //是否圆角
            type:Boolean,
            default:false
        },
        isCircle:{   //是否圆形
            type:Boolean,
            default:false
        },
        isIcon:{    //Icon图标
            type:String,
            default:''
        },
        BottonSize:{
            type:String,
            default:''
        }
    }
}
</script>


<style scoped lang='less'>

</style>