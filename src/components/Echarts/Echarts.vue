<template>
	<div :id="id" :option="option" :time="time"></div>
</template>
 
<script>
	import HighCharts from "highcharts"
	export default {
		props: {
			id: {
				type: String
			},
			option: {
				type: Object
			},
			time: ""
		},
		mounted() {
			HighCharts.chart(this.id, this.option)
		},
		watch: {
            //time是用来动态更新子组件的。
            //比如options的参数很多都是通过数据交互从后台取回来的，
            //或者按钮之间来回切换显示不同的图表。如果没有加time监听只会显示第一次加载的图标。
            //所以通过定义time着参数，当数据有变化时，可以通过props传递一个时间戳就会更新。
			time() {
				HighCharts.chart(this.id, this.option);
				deep:true
			}
		}
	}
</script>