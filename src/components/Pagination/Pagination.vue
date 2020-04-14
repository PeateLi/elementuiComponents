<template>
    <div>
        <el-pagination
        @size-change="GetChangeSize"
        @current-change="GetChangePage"
        :current-page="page"
        :page-sizes="showSizeArr"
        :page-size="showSize"
        :layout="showLayout"
        :total="total">
        </el-pagination>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    props:{
        page:{    //页数
            type:Number,
            default:1
        },
        showSizeArr:{    //每页显示数量选项
            type:Array,
            default:() => {
                return [5, 10, 15, 20,25]
            }
        },
        showSize:{   //每页显示数量
            type:Number,
            default:5
        },
        showLayout:{   //分页显示功能选项
            type:String,
            default:'total, sizes, prev, pager, next, jumper'
        },
        total:{
            type:Number,
            default:200
        }
    },
    methods:{
        GetChangeSize(){   //页数显示数量改变
            let _this = this
            _this.$emit('GetChangeSize',_this.showSize)
        },
        GetChangePage(){   //页码改变
             let _this = this
            _this.$emit('GetChangePage',_this.page)
        }
    }
}
</script>

<style lang="less" scoped>

</style>